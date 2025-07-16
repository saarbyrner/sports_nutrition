import { BaseService, ServiceResponse } from './base'

export interface AnalyticsData {
  // Player analytics
  totalPlayers: number
  activePlayers: number
  playersByTeam: Record<string, number>
  playersBySport: Record<string, number>
  playersByStatus: Record<string, number>
  avgComplianceRate: number
  
  // Meal plan analytics
  totalMealPlans: number
  activeMealPlans: number
  mealPlansByType: Record<string, number>
  mealPlansByStatus: Record<string, number>
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFat: number
  
  // Performance metrics
  topPerformingPlayers: Array<{
    id: string
    name: string
    compliance: number
    team?: string
  }>
  
  // Trends data
  weeklyMealPlanCreation: Array<{
    week: string
    count: number
  }>
  
  complianceByTeam: Array<{
    team: string
    avgCompliance: number
    playerCount: number
  }>
}

export interface PlayerDetailAnalytics {
  player: {
    id: string
    name: string
    team?: string
    sport?: string
  }
  
  // Nutrition metrics
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFat: number
  
  // Compliance data
  complianceRate: number
  mealPlansCompleted: number
  totalMealPlans: number
  
  // Progress tracking
  weightProgress?: Array<{
    date: string
    weight: number
    target?: number
  }>
  
  // Recent meal plans
  recentMealPlans: Array<{
    id: string
    title: string
    status: string
    calories: number
    created_at: string
  }>
}

export class AnalyticsService extends BaseService {
  /**
   * Get overall dashboard analytics
   */
  async getDashboardAnalytics(): Promise<ServiceResponse<AnalyticsData>> {
    try {
      // Get player statistics
      const { data: playersData, error: playersError } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users(*)
        `)

      if (playersError) {
        return this.formatError(playersError)
      }

      // Get meal plan statistics
      const { data: mealPlansData, error: mealPlansError } = await this.supabase
        .from('meal_plans')
        .select(`
          *,
          player:players(
            *,
            user:users(*)
          )
        `)

      if (mealPlansError) {
        return this.formatError(mealPlansError)
      }

      // Process player data
      const totalPlayers = playersData.length
      const activePlayers = playersData.filter(p => p.status === 'active').length
      
      const playersByTeam = playersData.reduce((acc, player) => {
        const team = player.team || 'Unassigned'
        acc[team] = (acc[team] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const playersBySport = playersData.reduce((acc, player) => {
        const sport = player.sport || 'Unassigned'
        acc[sport] = (acc[sport] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const playersByStatus = playersData.reduce((acc, player) => {
        acc[player.status] = (acc[player.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const avgComplianceRate = playersData.length > 0 
        ? playersData.reduce((sum, p) => sum + (p.compliance_rate || 0), 0) / playersData.length 
        : 0

      // Process meal plan data
      const totalMealPlans = mealPlansData.length
      const activeMealPlans = mealPlansData.filter(mp => mp.status === 'active').length

      const mealPlansByType = mealPlansData.reduce((acc, plan) => {
        const type = plan.plan_type || 'general'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const mealPlansByStatus = mealPlansData.reduce((acc, plan) => {
        acc[plan.status] = (acc[plan.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const mealPlansWithCalories = mealPlansData.filter(mp => mp.calories)
      const avgCalories = mealPlansWithCalories.length > 0
        ? mealPlansWithCalories.reduce((sum, mp) => sum + mp.calories, 0) / mealPlansWithCalories.length
        : 0

      const mealPlansWithProtein = mealPlansData.filter(mp => mp.protein)
      const avgProtein = mealPlansWithProtein.length > 0
        ? mealPlansWithProtein.reduce((sum, mp) => sum + mp.protein, 0) / mealPlansWithProtein.length
        : 0

      const mealPlansWithCarbs = mealPlansData.filter(mp => mp.carbs)
      const avgCarbs = mealPlansWithCarbs.length > 0
        ? mealPlansWithCarbs.reduce((sum, mp) => sum + mp.carbs, 0) / mealPlansWithCarbs.length
        : 0

      const mealPlansWithFat = mealPlansData.filter(mp => mp.fat)
      const avgFat = mealPlansWithFat.length > 0
        ? mealPlansWithFat.reduce((sum, mp) => sum + mp.fat, 0) / mealPlansWithFat.length
        : 0

      // Top performing players
      const topPerformingPlayers = playersData
        .map(player => ({
          id: player.id,
          name: player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown',
          compliance: player.compliance_rate || 0,
          team: player.team
        }))
        .sort((a, b) => b.compliance - a.compliance)
        .slice(0, 5)

      // Weekly meal plan creation (last 8 weeks)
      const eightWeeksAgo = new Date()
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)
      
      const weeklyMealPlanCreation = Array.from({ length: 8 }, (_, i) => {
        const weekStart = new Date(eightWeeksAgo)
        weekStart.setDate(weekStart.getDate() + (i * 7))
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        const count = mealPlansData.filter(mp => {
          const createdDate = new Date(mp.created_at)
          return createdDate >= weekStart && createdDate <= weekEnd
        }).length

        return {
          week: `Week ${i + 1}`,
          count
        }
      })

      // Compliance by team
      const complianceByTeam = Object.keys(playersByTeam).map(team => {
        const teamPlayers = playersData.filter(p => (p.team || 'Unassigned') === team)
        const avgCompliance = teamPlayers.length > 0
          ? teamPlayers.reduce((sum, p) => sum + (p.compliance_rate || 0), 0) / teamPlayers.length
          : 0

        return {
          team,
          avgCompliance: Math.round(avgCompliance),
          playerCount: teamPlayers.length
        }
      })

      const analytics: AnalyticsData = {
        totalPlayers,
        activePlayers,
        playersByTeam,
        playersBySport,
        playersByStatus,
        avgComplianceRate: Math.round(avgComplianceRate),
        
        totalMealPlans,
        activeMealPlans,
        mealPlansByType,
        mealPlansByStatus,
        avgCalories: Math.round(avgCalories),
        avgProtein: Math.round(avgProtein),
        avgCarbs: Math.round(avgCarbs),
        avgFat: Math.round(avgFat),
        
        topPerformingPlayers,
        weeklyMealPlanCreation,
        complianceByTeam
      }

      return this.formatResponse(analytics)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get detailed analytics for a specific player
   */
  async getPlayerAnalytics(playerId: string): Promise<ServiceResponse<PlayerDetailAnalytics>> {
    try {
      // Get player data
      const { data: playerData, error: playerError } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users(*)
        `)
        .eq('id', playerId)
        .single()

      if (playerError) {
        return this.formatError(playerError)
      }

      // Get player's meal plans
      const { data: mealPlansData, error: mealPlansError } = await this.supabase
        .from('meal_plans')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })

      if (mealPlansError) {
        return this.formatError(mealPlansError)
      }

      // Calculate nutrition averages
      const mealPlansWithCalories = mealPlansData.filter(mp => mp.calories)
      const avgCalories = mealPlansWithCalories.length > 0
        ? mealPlansWithCalories.reduce((sum, mp) => sum + mp.calories, 0) / mealPlansWithCalories.length
        : 0

      const mealPlansWithProtein = mealPlansData.filter(mp => mp.protein)
      const avgProtein = mealPlansWithProtein.length > 0
        ? mealPlansWithProtein.reduce((sum, mp) => sum + mp.protein, 0) / mealPlansWithProtein.length
        : 0

      const mealPlansWithCarbs = mealPlansData.filter(mp => mp.carbs)
      const avgCarbs = mealPlansWithCarbs.length > 0
        ? mealPlansWithCarbs.reduce((sum, mp) => sum + mp.carbs, 0) / mealPlansWithCarbs.length
        : 0

      const mealPlansWithFat = mealPlansData.filter(mp => mp.fat)
      const avgFat = mealPlansWithFat.length > 0
        ? mealPlansWithFat.reduce((sum, mp) => sum + mp.fat, 0) / mealPlansWithFat.length
        : 0

      // Calculate compliance
      const totalMealPlans = mealPlansData.length
      const completedMealPlans = mealPlansData.filter(mp => mp.status === 'completed').length

      // Recent meal plans (last 5)
      const recentMealPlans = mealPlansData.slice(0, 5).map(mp => ({
        id: mp.id,
        title: mp.title,
        status: mp.status,
        calories: mp.calories || 0,
        created_at: mp.created_at
      }))

      const analytics: PlayerDetailAnalytics = {
        player: {
          id: playerData.id,
          name: playerData.user ? `${playerData.user.first_name} ${playerData.user.last_name}` : 'Unknown',
          team: playerData.team,
          sport: playerData.sport
        },
        
        avgCalories: Math.round(avgCalories),
        avgProtein: Math.round(avgProtein),
        avgCarbs: Math.round(avgCarbs),
        avgFat: Math.round(avgFat),
        
        complianceRate: playerData.compliance_rate || 0,
        mealPlansCompleted: completedMealPlans,
        totalMealPlans,
        
        recentMealPlans
      }

      return this.formatResponse(analytics)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get team comparison analytics
   */
  async getTeamComparison(): Promise<ServiceResponse<Array<{
    team: string
    playerCount: number
    avgCompliance: number
    avgCalories: number
    activeMealPlans: number
  }>>> {
    try {
      const { data: playersData, error: playersError } = await this.supabase
        .from('players')
        .select(`
          *,
          user:users(*),
          meal_plans:meal_plans(*)
        `)

      if (playersError) {
        return this.formatError(playersError)
      }

      // Group by team and calculate metrics
      const teamStats = playersData.reduce((acc, player) => {
        const team = player.team || 'Unassigned'
        
        if (!acc[team]) {
          acc[team] = {
            players: [],
            mealPlans: []
          }
        }
        
        acc[team].players.push(player)
        if (player.meal_plans) {
          acc[team].mealPlans.push(...player.meal_plans)
        }
        
        return acc
      }, {} as Record<string, { players: any[], mealPlans: any[] }>)

      const teamComparison = Object.entries(teamStats).map(([team, data]) => {
        const avgCompliance = data.players.length > 0
          ? data.players.reduce((sum, p) => sum + (p.compliance_rate || 0), 0) / data.players.length
          : 0

        const mealPlansWithCalories = data.mealPlans.filter(mp => mp.calories)
        const avgCalories = mealPlansWithCalories.length > 0
          ? mealPlansWithCalories.reduce((sum, mp) => sum + mp.calories, 0) / mealPlansWithCalories.length
          : 0

        const activeMealPlans = data.mealPlans.filter(mp => mp.status === 'active').length

        return {
          team,
          playerCount: data.players.length,
          avgCompliance: Math.round(avgCompliance),
          avgCalories: Math.round(avgCalories),
          activeMealPlans
        }
      })

      return this.formatResponse(teamComparison)
    } catch (error) {
      return this.formatError(error)
    }
  }
}