'use client'

import { useState, useCallback } from 'react'
import { AnalyticsService, AnalyticsData, PlayerDetailAnalytics } from '@/lib/services/analytics'

const analyticsService = new AnalyticsService()

export function useAnalyticsService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('Analytics service error:', err)
    return null
  }, [])

  const getDashboardAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await analyticsService.getDashboardAnalytics()
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

  const getPlayerAnalytics = useCallback(async (playerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await analyticsService.getPlayerAnalytics(playerId)
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

  const getTeamComparison = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await analyticsService.getTeamComparison()
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

  return {
    // State
    loading,
    error,
    clearError,
    
    // Methods
    getDashboardAnalytics,
    getPlayerAnalytics,
    getTeamComparison,
  }
}