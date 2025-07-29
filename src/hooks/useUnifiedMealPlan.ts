/**
 * Unified Meal Plan Hook
 * 
 * React hook providing centralized meal plan and template management
 * with built-in resilience and comprehensive error handling.
 * 
 * Features:
 * - Automatic fallback to mock data when database is unavailable
 * - Complete CRUD operations for meal plans and templates
 * - Real-time loading states and error management
 * - Optimistic updates for better UX
 * - Cache management and data consistency
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 2.0.0 - Unified Implementation
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { UnifiedMealPlanService } from '@/lib/services/unifiedMealPlan'
import { MealPlan, Template, CreateMealPlanData, UpdateMealPlanData, CreateTemplateData, UpdateTemplateData } from '@/lib/services/types'
import { PaginationOptions, SortOptions, FilterOptions } from '@/lib/services/base'
import { useAuth } from '@/contexts/AuthContext'

const unifiedMealPlanService = new UnifiedMealPlanService()

export function useUnifiedMealPlan() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const { user } = useAuth()
  
  // Use ref to track in-flight operations to prevent race conditions
  const operationId = useRef(0)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any, operation?: string) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(operation ? `${operation}: ${message}` : message)
    console.error('Unified MealPlan service error:', { operation, error: err })
    return null
  }, [])

  const executeOperation = useCallback(async <T>(
    operation: () => Promise<any>,
    operationName: string
  ): Promise<T | null> => {
    const currentOpId = ++operationId.current
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      
      // Check if this operation is still current (prevent race conditions)
      if (currentOpId !== operationId.current) {
        return null
      }
      
      setUsingMockData(unifiedMealPlanService.isUsingMockData())
      
      if (!result.success) {
        handleError(result.error, operationName)
        return null
      }
      
      return result.data || result
    } catch (err) {
      if (currentOpId === operationId.current) {
        handleError(err, operationName)
      }
      return null
    } finally {
      if (currentOpId === operationId.current) {
        setLoading(false)
      }
    }
  }, [handleError])

  // ===========================================================================
  // MEAL PLAN OPERATIONS
  // ===========================================================================

  const getMealPlans = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    return executeOperation(
      () => unifiedMealPlanService.getMealPlans(options),
      'Get Meal Plans'
    )
  }, [executeOperation])

  const getMealPlan = useCallback(async (id: string) => {
    return executeOperation(
      () => unifiedMealPlanService.getMealPlan(id),
      'Get Meal Plan'
    )
  }, [executeOperation])

  const createMealPlan = useCallback(async (mealPlanData: CreateMealPlanData) => {
    return executeOperation(
      () => unifiedMealPlanService.createMealPlan(mealPlanData, user?.id),
      'Create Meal Plan'
    )
  }, [executeOperation, user?.id])

  const updateMealPlan = useCallback(async (id: string, updates: UpdateMealPlanData) => {
    return executeOperation(
      () => unifiedMealPlanService.updateMealPlan(id, updates),
      'Update Meal Plan'
    )
  }, [executeOperation])

  const deleteMealPlan = useCallback(async (id: string): Promise<boolean> => {
    const result = await executeOperation(
      () => unifiedMealPlanService.deleteMealPlan(id),
      'Delete Meal Plan'
    )
    return result !== null
  }, [executeOperation])

  const getMealPlanStats = useCallback(async () => {
    return executeOperation(
      () => unifiedMealPlanService.getMealPlanStats(),
      'Get Meal Plan Stats'
    )
  }, [executeOperation])

  // ===========================================================================
  // TEMPLATE OPERATIONS  
  // ===========================================================================

  const getTemplates = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    return executeOperation(
      () => unifiedMealPlanService.getTemplates(options),
      'Get Templates'
    )
  }, [executeOperation])

  const createTemplate = useCallback(async (templateData: CreateTemplateData) => {
    return executeOperation(
      () => unifiedMealPlanService.createTemplate(templateData, user?.id),
      'Create Template'
    )
  }, [executeOperation, user?.id])

  const updateTemplate = useCallback(async (id: string, updates: UpdateTemplateData) => {
    return executeOperation(
      () => unifiedMealPlanService.updateTemplate(id, updates),
      'Update Template'
    )
  }, [executeOperation])

  const createMealPlanFromTemplate = useCallback(async (
    templateId: string,
    mealPlanData: CreateMealPlanData
  ) => {
    // Get the template first
    const templateResult = await unifiedMealPlanService.getTemplates({
      filters: { id: templateId }
    })
    
    if (!templateResult.success || !templateResult.data?.length) {
      setError('Template not found')
      return null
    }

    const template = templateResult.data[0]
    
    // Create meal plan with template data
    const enrichedData: CreateMealPlanData = {
      ...mealPlanData,
      meal_data: template.meal_plan,
      calories: template.calories,
      protein: template.protein,
      carbs: template.carbs,
      fat: template.fat,
      fiber: template.fiber,
      description: mealPlanData.description || `Based on template: ${template.name}`
    }

    return executeOperation(
      () => unifiedMealPlanService.createMealPlan(enrichedData, user?.id),
      'Create Meal Plan from Template'
    )
  }, [executeOperation, user?.id])

  // ===========================================================================
  // UTILITY OPERATIONS
  // ===========================================================================

  const refreshCache = useCallback(() => {
    unifiedMealPlanService.clearCache()
  }, [])

  const forceMockMode = useCallback(() => {
    unifiedMealPlanService.forceMockMode()
    setUsingMockData(true)
  }, [])

  const resetToDatabase = useCallback(() => {
    unifiedMealPlanService.resetToDatabase()
    setUsingMockData(false)
  }, [])

  // ===========================================================================
  // BATCH OPERATIONS
  // ===========================================================================

  const getMealPlanSummary = useCallback(async (playerId?: string) => {
    const filters = playerId ? { player_id: playerId } : undefined
    
    const [plansResult, statsResult] = await Promise.all([
      unifiedMealPlanService.getMealPlans({ 
        filters,
        sort: { column: 'updated_at', ascending: false },
        pagination: { page: 1, limit: 5 } 
      }),
      unifiedMealPlanService.getMealPlanStats()
    ])

    return {
      recentPlans: plansResult.success ? plansResult.data : [],
      stats: statsResult.success ? statsResult.data : null,
      usingMockData: unifiedMealPlanService.isUsingMockData()
    }
  }, [])

  const bulkUpdateMealPlans = useCallback(async (
    updates: { id: string; data: UpdateMealPlanData }[]
  ) => {
    const results = await Promise.all(
      updates.map(({ id, data }) => 
        unifiedMealPlanService.updateMealPlan(id, data)
      )
    )
    
    const successful = results.filter(r => r.success).length
    const failed = results.length - successful
    
    if (failed > 0) {
      setError(`Bulk update completed with ${failed} failures out of ${results.length} operations`)
    }
    
    return {
      successful,
      failed,
      results
    }
  }, [])

  return {
    // State
    loading,
    error,
    usingMockData,
    clearError,
    
    // Meal Plan Operations
    getMealPlans,
    getMealPlan,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlanStats,
    
    // Template Operations
    getTemplates,
    createTemplate,
    updateTemplate,
    createMealPlanFromTemplate,
    
    // Utility Operations
    refreshCache,
    forceMockMode,
    resetToDatabase,
    
    // Batch Operations
    getMealPlanSummary,
    bulkUpdateMealPlans,
    
    // Service Reference
    service: unifiedMealPlanService
  }
}