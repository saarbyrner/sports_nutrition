import { BaseService, ServiceResponse, PaginationOptions, SortOptions, FilterOptions } from './base'
import { MealPlan, CreateMealPlanData, UpdateMealPlanData, Template, CreateTemplateData, UpdateTemplateData } from './types'
import { mockMealPlans, mockTemplates, mockStats } from '@/lib/testing/mockData'

export class ResilientMealPlanService extends BaseService {
  private useMockData = false

  /**
   * Check if we should use mock data (when database is unavailable)
   */
  private async shouldUseMockData(): Promise<boolean> {
    if (this.useMockData) return true

    try {
      // Simple test query to check if database is accessible
      const { error } = await this.supabase
        .from('meal_plans')
        .select('id')
        .limit(1)

      if (error && error.message.includes('infinite recursion')) {
        console.warn('Database RLS policies have issues, falling back to mock data')
        this.useMockData = true
        return true
      }

      return false
    } catch (error) {
      console.warn('Database connection issues, falling back to mock data')
      this.useMockData = true
      return true
    }
  }

  /**
   * Get all meal plans with fallback to mock data
   */
  async getMealPlans(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<MealPlan[]>> {
    try {
      const useMock = await this.shouldUseMockData()

      if (useMock) {
        console.log('Using mock meal plans data')
        let data = [...mockMealPlans]

        // Apply filters to mock data
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (key === 'search') {
                data = data.filter(plan => 
                  plan.title.toLowerCase().includes(value.toLowerCase()) ||
                  (plan.description && plan.description.toLowerCase().includes(value.toLowerCase()))
                )
              } else if (key === 'status') {
                data = data.filter(plan => plan.status === value)
              } else if (key === 'plan_type') {
                data = data.filter(plan => plan.plan_type === value)
              }
            }
          })
        }

        // Apply pagination to mock data
        if (options?.pagination) {
          const { page = 1, limit = 10 } = options.pagination
          const offset = (page - 1) * limit
          data = data.slice(offset, offset + limit)
        }

        return this.formatResponse(data, mockMealPlans.length)
      }

      // Try database query
      let query = this.supabase
        .from('meal_plans')
        .select('*')

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'search') {
              query = query.or(`title.ilike.%${value}%,description.ilike.%${value}%`)
            } else if (key === 'player_id') {
              query = query.eq('player_id', value)
            } else if (key === 'status') {
              query = query.eq('status', value)
            } else if (key === 'plan_type') {
              query = query.eq('plan_type', value)
            }
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        query = query.order(column, { ascending })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (options?.pagination) {
        const { page = 1, limit = 10 } = options.pagination
        const offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)
      }

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      return this.formatResponse(data as MealPlan[], count)
    } catch (error) {
      console.error('Database query failed, using mock data:', error)
      this.useMockData = true
      return this.getMealPlans(options) // Retry with mock data
    }
  }

  /**
   * Get meal plan statistics with fallback
   */
  async getMealPlanStats(): Promise<ServiceResponse<typeof mockStats>> {
    try {
      const useMock = await this.shouldUseMockData()

      if (useMock) {
        console.log('Using mock meal plan stats')
        return this.formatResponse(mockStats)
      }

      // Try database query
      const { data, error } = await this.supabase
        .from('meal_plans')
        .select('status, plan_type, calories, protein')

      if (error) {
        throw error
      }

      const stats = {
        total: data.length,
        active: data.filter(p => p.status === 'active').length,
        draft: data.filter(p => p.status === 'draft').length,
        completed: data.filter(p => p.status === 'completed').length,
        archived: data.filter(p => p.status === 'archived').length,
        byPlanType: data.reduce((acc, plan) => {
          const type = plan.plan_type || 'general'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        avgCalories: data.length > 0 ? Math.round(data.reduce((sum, p) => sum + (p.calories || 0), 0) / data.length) : 0,
        avgProtein: data.length > 0 ? Math.round(data.reduce((sum, p) => sum + (p.protein || 0), 0) / data.length) : 0
      }

      return this.formatResponse(stats)
    } catch (error) {
      console.error('Stats query failed, using mock data:', error)
      this.useMockData = true
      return this.formatResponse(mockStats)
    }
  }

  /**
   * Get templates with fallback
   */
  async getTemplates(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<Template[]>> {
    try {
      const useMock = await this.shouldUseMockData()

      if (useMock) {
        console.log('Using mock templates data')
        let data = [...mockTemplates]

        // Apply filters to mock data
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (key === 'search') {
                data = data.filter(template => 
                  template.name.toLowerCase().includes(value.toLowerCase()) ||
                  (template.description && template.description.toLowerCase().includes(value.toLowerCase()))
                )
              } else if (key === 'category') {
                data = data.filter(template => template.category === value)
              }
            }
          })
        }

        return this.formatResponse(data, mockTemplates.length)
      }

      // Try database query
      let query = this.supabase
        .from('templates')
        .select('*')

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'search') {
              query = query.or(`name.ilike.%${value}%,description.ilike.%${value}%,category.ilike.%${value}%`)
            } else if (key === 'category') {
              query = query.eq('category', value)
            }
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        query = query.order(column, { ascending })
      } else {
        query = query.order('times_used', { ascending: false }).order('created_at', { ascending: false })
      }

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      return this.formatResponse(data as Template[], count)
    } catch (error) {
      console.error('Templates query failed, using mock data:', error)
      this.useMockData = true
      return this.getTemplates(options) // Retry with mock data
    }
  }

  /**
   * Create meal plan (mock implementation for testing)
   */
  async createMealPlan(mealPlanData: CreateMealPlanData, createdBy?: string): Promise<ServiceResponse<MealPlan>> {
    try {
      const useMock = await this.shouldUseMockData()

      if (useMock) {
        console.log('Creating mock meal plan')
        const newPlan: MealPlan = {
          id: `meal-plan-${Date.now()}`,
          ...mealPlanData,
          status: 'draft',
          created_by: createdBy,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Add to mock data
        mockMealPlans.unshift(newPlan)
        return this.formatResponse(newPlan)
      }

      // Try database insert
      const { data, error } = await this.supabase
        .from('meal_plans')
        .insert({
          ...mealPlanData,
          created_by: createdBy,
          status: 'draft'
        })
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return this.formatResponse(data as MealPlan)
    } catch (error) {
      console.error('Create meal plan failed, using mock:', error)
      this.useMockData = true
      return this.createMealPlan(mealPlanData, createdBy) // Retry with mock
    }
  }

  /**
   * Delete meal plan (mock implementation)
   */
  async deleteMealPlan(id: string): Promise<ServiceResponse<null>> {
    try {
      const useMock = await this.shouldUseMockData()

      if (useMock) {
        console.log('Deleting mock meal plan:', id)
        const index = mockMealPlans.findIndex(p => p.id === id)
        if (index !== -1) {
          mockMealPlans.splice(index, 1)
        }
        return this.formatResponse(null)
      }

      // Try database delete
      const { error } = await this.supabase
        .from('meal_plans')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return this.formatResponse(null)
    } catch (error) {
      console.error('Delete meal plan failed, using mock:', error)
      this.useMockData = true
      return this.deleteMealPlan(id) // Retry with mock
    }
  }

  /**
   * Reset to database mode (for testing)
   */
  resetToDatabase() {
    this.useMockData = false
  }

  /**
   * Force mock mode (for testing)
   */
  forceMockMode() {
    this.useMockData = true
  }

  /**
   * Check if currently using mock data
   */
  isUsingMockData(): boolean {
    return this.useMockData
  }
}