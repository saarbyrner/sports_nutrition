/**
 * Unified Player Data Service
 * 
 * Single source of truth for player data across all application modules.
 * Eliminates mock data inconsistencies and provides centralized player management.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import { BaseService, ServiceResponse } from './base'
import { Player, CreatePlayerData, UpdatePlayerData } from './types'

export interface PlayerSummary {
  id: string
  name: string
  avatar: string
  initials: string
  team?: string
  sport?: string
  status: string
  email: string
}

export interface PlayerWithMealPlans extends Player {
  activeMealPlans: number
  totalMealPlans: number
  lastMealPlanDate?: string
  currentPlanId?: string
  currentPlanName?: string
}

/**
 * Unified Player Service providing consistent player data across all modules
 */
export class UnifiedPlayerService extends BaseService {
  private static instance: UnifiedPlayerService | null = null
  private playerCache = new Map<string, PlayerSummary>()
  private cacheExpiry = 5 * 60 * 1000 // 5 minutes
  private lastCacheUpdate = 0

  /**
   * Singleton pattern to ensure single source of truth
   */
  static getInstance(): UnifiedPlayerService {
    if (!this.instance) {
      this.instance = new UnifiedPlayerService()
    }
    return this.instance
  }

  /**
   * Get simplified player data for dropdowns, selects, and quick references
   */
  async getPlayerSummaries(): Promise<ServiceResponse<PlayerSummary[]>> {
    try {
      // Check cache first
      if (this.isCacheValid()) {
        return this.formatResponse(Array.from(this.playerCache.values()))
      }

      const { data, error } = await this.supabase
        .from('players')
        .select(`
          id,
          status,
          team,
          sport,
          user:users (
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('users.role', 'player')
        .order('users.last_name', { ascending: true })

      if (error) {
        return this.formatError(error)
      }

      // Transform to consistent format
      const summaries: PlayerSummary[] = data.map(player => ({
        id: player.id,
        name: player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown Player',
        avatar: this.generateAvatar(player.user?.first_name, player.user?.last_name),
        initials: this.generateInitials(player.user?.first_name, player.user?.last_name),
        team: player.team,
        sport: player.sport,
        status: player.status,
        email: player.user?.email || ''
      }))

      // Update cache
      this.updateCache(summaries)

      return this.formatResponse(summaries)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get specific player summary by ID
   */
  async getPlayerSummary(playerId: string): Promise<ServiceResponse<PlayerSummary>> {
    try {
      // Check cache first
      if (this.isCacheValid() && this.playerCache.has(playerId)) {
        return this.formatResponse(this.playerCache.get(playerId)!)
      }

      const { data, error } = await this.supabase
        .from('players')
        .select(`
          id,
          status,
          team,
          sport,
          user:users (
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', playerId)
        .single()

      if (error) {
        return this.formatError(error)
      }

      const summary: PlayerSummary = {
        id: data.id,
        name: data.user ? `${data.user.first_name} ${data.user.last_name}` : 'Unknown Player',
        avatar: this.generateAvatar(data.user?.first_name, data.user?.last_name),
        initials: this.generateInitials(data.user?.first_name, data.user?.last_name),
        team: data.team,
        sport: data.sport,
        status: data.status,
        email: data.user?.email || ''
      }

      // Update cache
      this.playerCache.set(playerId, summary)

      return this.formatResponse(summary)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get players with meal plan information for advanced meal plan management
   */
  async getPlayersWithMealPlans(): Promise<ServiceResponse<PlayerWithMealPlans[]>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users (
            id,
            email,
            first_name,
            last_name,
            avatar_url,
            phone
          ),
          meal_plans (
            id,
            title,
            status,
            created_at
          )
        `)
        .order('user.last_name', { ascending: true })

      if (error) {
        return this.formatError(error)
      }

      const playersWithMealPlans: PlayerWithMealPlans[] = data.map(player => {
        const mealPlans = player.meal_plans || []
        const activePlans = mealPlans.filter((plan: any) => plan.status === 'active')
        const mostRecentPlan = mealPlans.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        return {
          ...player,
          activeMealPlans: activePlans.length,
          totalMealPlans: mealPlans.length,
          lastMealPlanDate: mostRecentPlan?.created_at,
          currentPlanId: activePlans[0]?.id,
          currentPlanName: activePlans[0]?.title
        }
      })

      return this.formatResponse(playersWithMealPlans)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Search players by name, team, or email
   */
  async searchPlayers(searchTerm: string): Promise<ServiceResponse<PlayerSummary[]>> {
    try {
      if (!searchTerm.trim()) {
        return this.getPlayerSummaries()
      }

      const { data, error } = await this.supabase
        .from('players')
        .select(`
          id,
          status,
          team,
          sport,
          user:users (
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`team.ilike.%${searchTerm}%,sport.ilike.%${searchTerm}%,user.first_name.ilike.%${searchTerm}%,user.last_name.ilike.%${searchTerm}%,user.email.ilike.%${searchTerm}%`)
        .order('user.last_name', { ascending: true })

      if (error) {
        return this.formatError(error)
      }

      const summaries: PlayerSummary[] = data.map(player => ({
        id: player.id,
        name: player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown Player',
        avatar: this.generateAvatar(player.user?.first_name, player.user?.last_name),
        initials: this.generateInitials(player.user?.first_name, player.user?.last_name),
        team: player.team,
        sport: player.sport,
        status: player.status,
        email: player.user?.email || ''
      }))

      return this.formatResponse(summaries)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get players by team for team-based meal planning
   */
  async getPlayersByTeam(team: string): Promise<ServiceResponse<PlayerSummary[]>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select(`
          id,
          status,
          team,
          sport,
          user:users (
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('team', team)
        .order('user.last_name', { ascending: true })

      if (error) {
        return this.formatError(error)
      }

      const summaries: PlayerSummary[] = data.map(player => ({
        id: player.id,
        name: player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown Player',
        avatar: this.generateAvatar(player.user?.first_name, player.user?.last_name),
        initials: this.generateInitials(player.user?.first_name, player.user?.last_name),
        team: player.team,
        sport: player.sport,
        status: player.status,
        email: player.user?.email || ''
      }))

      return this.formatResponse(summaries)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get unique teams for filtering
   */
  async getTeams(): Promise<ServiceResponse<string[]>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('team')
        .not('team', 'is', null)

      if (error) {
        return this.formatError(error)
      }

      const teams = [...new Set(data.map(player => player.team))].sort()
      return this.formatResponse(teams)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get unique sports for filtering
   */
  async getSports(): Promise<ServiceResponse<string[]>> {
    try {
      const { data, error } = await this.supabase
        .from('players')
        .select('sport')
        .not('sport', 'is', null)

      if (error) {
        return this.formatError(error)
      }

      const sports = [...new Set(data.map(player => player.sport))].sort()
      return this.formatResponse(sports)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Clear cache (useful for data refresh)
   */
  clearCache(): void {
    this.playerCache.clear()
    this.lastCacheUpdate = 0
  }

  /**
   * Helper methods
   */
  private isCacheValid(): boolean {
    return this.playerCache.size > 0 && 
           (Date.now() - this.lastCacheUpdate) < this.cacheExpiry
  }

  private updateCache(summaries: PlayerSummary[]): void {
    this.playerCache.clear()
    summaries.forEach(summary => {
      this.playerCache.set(summary.id, summary)
    })
    this.lastCacheUpdate = Date.now()
  }

  private generateAvatar(firstName?: string, lastName?: string): string {
    if (!firstName || !lastName) return '??'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  private generateInitials(firstName?: string, lastName?: string): string {
    return this.generateAvatar(firstName, lastName)
  }
}

// Export singleton instance for consistent usage
export const unifiedPlayerService = UnifiedPlayerService.getInstance()