'use client'

import { useState, useCallback } from 'react'
import { MealPlanService } from '@/lib/services/mealPlan'
import { MealPlan, Template, CreateMealPlanData, UpdateMealPlanData, CreateTemplateData, UpdateTemplateData } from '@/lib/services/types'
import { PaginationOptions, SortOptions, FilterOptions } from '@/lib/services/base'
import { useAuth } from '@/contexts/AuthContext'

const mealPlanService = new MealPlanService()

export function useMealPlanService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('MealPlan service error:', err)
    return false
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
      const result = await mealPlanService.getMealPlans(options)
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

  const getMealPlan = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.getMealPlan(id)
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

  const getMealPlansByPlayer = useCallback(async (playerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.getMealPlansByPlayer(playerId)
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

  const createMealPlan = useCallback(async (mealPlanData: CreateMealPlanData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.createMealPlan(mealPlanData, user?.id)
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

  const updateMealPlan = useCallback(async (id: string, updates: UpdateMealPlanData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.updateMealPlan(id, updates)
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

  const deleteMealPlan = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.deleteMealPlan(id)
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

  const getMealPlanStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.getMealPlanStats()
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

  // Template Operations
  const getTemplates = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.getTemplates(options)
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

  const getTemplate = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.getTemplate(id)
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

  const createTemplate = useCallback(async (templateData: CreateTemplateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.createTemplate(templateData, user?.id)
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

  const updateTemplate = useCallback(async (id: string, updates: UpdateTemplateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.updateTemplate(id, updates)
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

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.deleteTemplate(id)
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

  const useTemplate = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.useTemplate(id)
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

  const createMealPlanFromTemplate = useCallback(async (
    templateId: string, 
    playerId: string, 
    title: string
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await mealPlanService.createMealPlanFromTemplate(
        templateId, 
        playerId, 
        title, 
        user?.id
      )
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

  return {
    // State
    loading,
    error,
    clearError,
    
    // Meal Plan Operations
    getMealPlans,
    getMealPlan,
    getMealPlansByPlayer,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlanStats,
    
    // Template Operations
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    createMealPlanFromTemplate,
  }
}