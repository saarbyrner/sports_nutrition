import { useState, useCallback } from 'react'
import { playerService } from '@/lib/services'
import { Player, CreatePlayerData, UpdatePlayerData } from '@/lib/services/types'
import { PaginationOptions, SortOptions, FilterOptions } from '@/lib/services/base'

export function usePlayerService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const getPlayers = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.getPlayers(options)
      if (result.error) {
        setError(result.error)
        return { data: null, count: null }
      }
      return { data: result.data, count: result.count }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch players'
      setError(errorMessage)
      return { data: null, count: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const getPlayer = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.getPlayer(id)
      if (result.error) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createPlayer = useCallback(async (playerData: CreatePlayerData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.createPlayer(playerData)
      if (result.error) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create player'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlayer = useCallback(async (id: string, updates: UpdatePlayerData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.updatePlayer(id, updates)
      if (result.error) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update player'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePlayer = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.deletePlayer(id)
      if (result.error) {
        setError(result.error)
        return false
      }
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete player'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkCreatePlayers = useCallback(async (playersData: CreatePlayerData[]) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.bulkCreatePlayers(playersData)
      if (result.error) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk create players'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getPlayerStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await playerService.getPlayerStats()
      if (result.error) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player stats'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    clearError,
    getPlayers,
    getPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
    bulkCreatePlayers,
    getPlayerStats
  }
}