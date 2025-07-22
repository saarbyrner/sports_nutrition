/**
 * Unified Player Hook
 * 
 * React hook providing centralized player data management for consistent
 * player information across all application modules (meal plans, profiles, etc.)
 * 
 * Features:
 * - Centralized player data caching
 * - Search and filtering capabilities
 * - Integration with meal plan data
 * - Consistent avatar and naming patterns
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { unifiedPlayerService, PlayerSummary, PlayerWithMealPlans } from '@/lib/services/unifiedPlayer'

export function useUnifiedPlayer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [sports, setSports] = useState<string[]>([])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('Unified Player service error:', err)
    return null
  }, [])

  /**
   * Load all player summaries
   */
  const loadPlayerSummaries = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.getPlayerSummaries()
      if (!result.success) {
        handleError(result.error)
        return null
      }

      setPlayers(result.data)
      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  /**
   * Get specific player summary
   */
  const getPlayerSummary = useCallback(async (playerId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.getPlayerSummary(playerId)
      if (!result.success) {
        handleError(result.error)
        return null
      }

      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  /**
   * Get players with meal plan information
   */
  const getPlayersWithMealPlans = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.getPlayersWithMealPlans()
      if (!result.success) {
        handleError(result.error)
        return null
      }

      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  /**
   * Search players by term
   */
  const searchPlayers = useCallback(async (searchTerm: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.searchPlayers(searchTerm)
      if (!result.success) {
        handleError(result.error)
        return null
      }

      setPlayers(result.data)
      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  /**
   * Get players by team
   */
  const getPlayersByTeam = useCallback(async (team: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.getPlayersByTeam(team)
      if (!result.success) {
        handleError(result.error)
        return null
      }

      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  /**
   * Load filter options (teams and sports)
   */
  const loadFilterOptions = useCallback(async () => {
    try {
      const [teamsResult, sportsResult] = await Promise.all([
        unifiedPlayerService.getTeams(),
        unifiedPlayerService.getSports()
      ])

      if (teamsResult.success) {
        setTeams(teamsResult.data)
      }

      if (sportsResult.success) {
        setSports(sportsResult.data)
      }
    } catch (err) {
      console.warn('Failed to load filter options:', err)
    }
  }, [])

  /**
   * Clear service cache and reload data
   */
  const refreshCache = useCallback(async () => {
    unifiedPlayerService.clearCache()
    await loadPlayerSummaries()
    await loadFilterOptions()
  }, [loadPlayerSummaries, loadFilterOptions])

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    loadPlayerSummaries()
    loadFilterOptions()
  }, [loadPlayerSummaries, loadFilterOptions])

  return {
    // State
    loading,
    error,
    players,
    teams,
    sports,
    
    // Actions
    clearError,
    loadPlayerSummaries,
    getPlayerSummary,
    getPlayersWithMealPlans,
    searchPlayers,
    getPlayersByTeam,
    refreshCache,
    
    // Utilities
    service: unifiedPlayerService
  }
}

/**
 * Hook for meal plan components that need player data with meal plan context
 */
export function usePlayersForMealPlans() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playersWithPlans, setPlayersWithPlans] = useState<PlayerWithMealPlans[]>([])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('Players for meal plans error:', err)
    return null
  }, [])

  const loadPlayersWithMealPlans = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await unifiedPlayerService.getPlayersWithMealPlans()
      if (!result.success) {
        handleError(result.error)
        return null
      }

      setPlayersWithPlans(result.data)
      return result.data
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  useEffect(() => {
    loadPlayersWithMealPlans()
  }, [loadPlayersWithMealPlans])

  return {
    loading,
    error,
    playersWithPlans,
    clearError,
    loadPlayersWithMealPlans,
    refreshData: loadPlayersWithMealPlans
  }
}

/**
 * Hook for simple player selection (dropdowns, modals, etc.)
 */
export function usePlayerSelection() {
  const { players, loading, error, loadPlayerSummaries, searchPlayers, teams, sports } = useUnifiedPlayer()

  return {
    players,
    loading,
    error,
    teams,
    sports,
    refreshPlayers: loadPlayerSummaries,
    searchPlayers
  }
}