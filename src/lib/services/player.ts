import { BaseService, ServiceResponse, PaginationOptions, SortOptions, FilterOptions } from './base'
import { Player, CreatePlayerData, UpdatePlayerData, User } from './types'

export class PlayerService extends BaseService {
  /**
   * Get all players with optional pagination, sorting, and filtering
   */
  async getPlayers(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<Player[]>> {
    try {
      let query = this.supabase
        .from('players')
        .select(`
          *,
          user:users(*)
        `)

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'search') {
              // Search across multiple fields
              query = query.or(`user.first_name.ilike.%${value}%,user.last_name.ilike.%${value}%,team.ilike.%${value}%,position.ilike.%${value}%`)
            } else if (key === 'team' || key === 'sport' || key === 'squad') {
              query = query.eq(key, value)
            } else if (key === 'status') {
              query = query.eq(key, value)
            } else if (key === 'tags') {
              query = query.contains('tags', [value])
            }
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        if (column.startsWith('user.')) {
          // Handle sorting by user fields
          const userField = column.replace('user.', '')
          query = query.order(userField, { ascending, referencedTable: 'users' })
        } else {
          query = query.order(column, { ascending })
        }
      } else {
        // Default sort by user's last name
        query = query.order('last_name', { ascending: true, referencedTable: 'users' })
      }

      // Apply pagination
      if (options?.pagination) {
        const { page = 1, limit = 10 } = options.pagination
        const offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)
      }

      const { data, error, count } = await query

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Player[], count)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get a single player by ID
   */
  async getPlayer(id: string): Promise<ServiceResponse<Player>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Player)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get player by user ID
   */
  async getPlayerByUserId(userId: string): Promise<ServiceResponse<Player>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users(*)
        `)
        .eq('user_id', userId)
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Player)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Create a new player (creates both user and player records)
   */
  async createPlayer(playerData: CreatePlayerData): Promise<ServiceResponse<Player>> {
    try {
      // Get current authenticated user
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        return this.formatError(new Error('User not authenticated'))
      }

      // For now, we'll trust the authentication system and skip the database lookup
      // to avoid RLS recursion issues. The RLS policies will enforce admin access.
      console.log('Creating player with authenticated user:', user.email)

      // Start a transaction-like operation
      // First, create the user with organization context
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .insert({
          email: playerData.email,
          first_name: playerData.first_name,
          last_name: playerData.last_name,
          role: 'player',
          phone: playerData.phone,
          avatar_url: playerData.avatar_url,
          organization: null // Will be set by admin's organization context via RLS
        })
        .select()
        .single()

      if (userError) {
        console.error('Error creating user for player:', {
          error: userError,
          playerData: {
            email: playerData.email,
            role: 'player',
            organization: null
          }
        })
        return this.formatError(userError)
      }

      // Then create the player record
      const { data: playerRecord, error: playerError } = await this.supabase
        .from('players')
        .insert({
          user_id: userData.id,
          date_of_birth: playerData.date_of_birth,
          gender: playerData.gender,
          height: playerData.height,
          weight: playerData.weight,
          position: playerData.position,
          sport: playerData.sport,
          team: playerData.team,
          squad: playerData.squad,
          jersey_number: playerData.jersey_number,
          status: playerData.status || 'active',
          tags: playerData.tags || [],
          allergies: playerData.allergies,
          dietary_restrictions: playerData.dietary_restrictions,
          medical_conditions: playerData.medical_conditions,
          emergency_contact: playerData.emergency_contact,
          notes: playerData.notes
        })
        .select(`
          *,
          user:users(*)
        `)
        .single()

      if (playerError) {
        // Clean up user record if player creation fails
        await this.supabase.from('users').delete().eq('id', userData.id)
        return this.formatError(playerError)
      }

      return this.formatResponse(playerRecord as Player)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Update a player
   */
  async updatePlayer(id: string, updates: UpdatePlayerData): Promise<ServiceResponse<Player>> {
    try {
      // Get the player first to get user_id
      const { data: existingPlayer, error: getError } = await this.supabase
        .from('players')
        .select('user_id')
        .eq('id', id)
        .single()

      if (getError) {
        return this.formatError(getError)
      }

      // Separate user updates from player updates
      const userUpdates: Partial<User> = {}
      const playerUpdates: Partial<UpdatePlayerData> = {}

      Object.entries(updates).forEach(([key, value]) => {
        if (['first_name', 'last_name', 'phone', 'avatar_url'].includes(key)) {
          userUpdates[key as keyof User] = value
        } else {
          playerUpdates[key as keyof UpdatePlayerData] = value
        }
      })

      // Update user table if there are user updates
      if (Object.keys(userUpdates).length > 0) {
        const { error: userUpdateError } = await this.supabase
          .from('users')
          .update(userUpdates)
          .eq('id', existingPlayer.user_id)

        if (userUpdateError) {
          return this.formatError(userUpdateError)
        }
      }

      // Update player table if there are player updates
      if (Object.keys(playerUpdates).length > 0) {
        const { error: playerUpdateError } = await this.supabase
          .from('players')
          .update(playerUpdates)
          .eq('id', id)

        if (playerUpdateError) {
          return this.formatError(playerUpdateError)
        }
      }

      // Return updated player
      return this.getPlayer(id)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Delete a player (also deletes associated user)
   */
  async deletePlayer(id: string): Promise<ServiceResponse<null>> {
    try {
      // Get the user_id first
      const { data: player, error: getError } = await this.supabase
        .from('players')
        .select('user_id')
        .eq('id', id)
        .single()

      if (getError) {
        return this.formatError(getError)
      }

      // Delete player (user will be deleted automatically due to CASCADE)
      const { error: deleteError } = await this.supabase
        .from('players')
        .delete()
        .eq('id', id)

      if (deleteError) {
        return this.formatError(deleteError)
      }

      return this.formatResponse(null)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Bulk create players from import data
   */
  async bulkCreatePlayers(playersData: CreatePlayerData[]): Promise<ServiceResponse<{
    success: Player[]
    errors: { data: CreatePlayerData; error: string }[]
  }>> {
    try {
      const results: Player[] = []
      const errors: { data: CreatePlayerData; error: string }[] = []

      // Process players one by one to handle individual errors
      for (const playerData of playersData) {
        const result = await this.createPlayer(playerData)
        if (result.error) {
          errors.push({ data: playerData, error: result.error })
        } else if (result.data) {
          results.push(result.data)
        }
      }

      return this.formatResponse({
        success: results,
        errors
      })
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(): Promise<ServiceResponse<{
    total: number
    active: number
    inactive: number
    injured: number
    suspended: number
    byTeam: Record<string, number>
    bySport: Record<string, number>
  }>> {
    try {
      const { data: players, error } = await this.supabase
        .from('players')
        .select('status, team, sport')

      if (error) {
        return this.formatError(error)
      }

      const stats = {
        total: players.length,
        active: 0,
        inactive: 0,
        injured: 0,
        suspended: 0,
        byTeam: {} as Record<string, number>,
        bySport: {} as Record<string, number>
      }

      players.forEach(player => {
        // Count by status
        stats[player.status as keyof typeof stats]++

        // Count by team
        if (player.team) {
          stats.byTeam[player.team] = (stats.byTeam[player.team] || 0) + 1
        }

        // Count by sport
        if (player.sport) {
          stats.bySport[player.sport] = (stats.bySport[player.sport] || 0) + 1
        }
      })

      return this.formatResponse(stats)
    } catch (error) {
      return this.formatError(error)
    }
  }
}