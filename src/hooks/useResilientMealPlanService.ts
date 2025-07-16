'use client'

import { useState, useCallback } from 'react'
import { ResilientMealPlanService } from '@/lib/services/resilientMealPlan'
import { MealPlan, Template, CreateMealPlanData, UpdateMealPlanData, CreateTemplateData, UpdateTemplateData } from '@/lib/services/types'
import { PaginationOptions, SortOptions, FilterOptions } from '@/lib/services/base'
import { useAuth } from '@/contexts/AuthContext'

const resilientMealPlanService = new ResilientMealPlanService()

export function useResilientMealPlanService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const { user } = useAuth()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('Resilient MealPlan service error:', err)
    return null
  }, [])

  // Meal Plan Operations
  const getMealPlans = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await resilientMealPlanService.getMealPlans(options)
      setUsingMockData(resilientMealPlanService.isUsingMockData())
      
      if (!result.success) {
        handleError(result.error)
        return null
      }
      return result
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const getMealPlanStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await resilientMealPlanService.getMealPlanStats()
      setUsingMockData(resilientMealPlanService.isUsingMockData())
      
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

  const getTemplates = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await resilientMealPlanService.getTemplates(options)
      setUsingMockData(resilientMealPlanService.isUsingMockData())
      
      if (!result.success) {
        handleError(result.error)
        return null
      }
      return result
    } catch (err) {
      handleError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createMealPlan = useCallback(async (mealPlanData: CreateMealPlanData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await resilientMealPlanService.createMealPlan(mealPlanData, user?.id)
      setUsingMockData(resilientMealPlanService.isUsingMockData())
      
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
  }, [handleError, user?.id])

  const deleteMealPlan = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await resilientMealPlanService.deleteMealPlan(id)
      setUsingMockData(resilientMealPlanService.isUsingMockData())
      
      if (!result.success) {
        handleError(result.error)
        return false
      }
      return true
    } catch (err) {
      handleError(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [handleError])

  // Testing utilities
  const resetToDatabase = useCallback(() => {
    resilientMealPlanService.resetToDatabase()
    setUsingMockData(false)
  }, [])

  const forceMockMode = useCallback(() => {
    resilientMealPlanService.forceMockMode()
    setUsingMockData(true)
  }, [])

  return {
    // State
    loading,
    error,
    usingMockData,
    clearError,
    
    // Operations
    getMealPlans,
    getMealPlanStats,
    getTemplates,
    createMealPlan,
    deleteMealPlan,
    
    // Testing utilities
    resetToDatabase,
    forceMockMode,
  }
}