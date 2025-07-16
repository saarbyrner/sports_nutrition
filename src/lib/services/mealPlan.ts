import { BaseService, ServiceResponse, PaginationOptions, SortOptions, FilterOptions } from './base'
import { MealPlan, CreateMealPlanData, UpdateMealPlanData, Template, CreateTemplateData, UpdateTemplateData } from './types'

export class MealPlanService extends BaseService {
  /**
   * Get all meal plans with optional pagination, sorting, and filtering
   */
  async getMealPlans(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<MealPlan[]>> {
    try {
      let query = this.supabase
        .from('meal_plans')
        .select('*')

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'search') {
              // Search across multiple fields
              query = query.or(`title.ilike.%${value}%,description.ilike.%${value}%`)
            } else if (key === 'player_id') {
              query = query.eq('player_id', value)
            } else if (key === 'status') {
              query = query.eq('status', value)
            } else if (key === 'plan_type') {
              query = query.eq('plan_type', value)
            } else if (key === 'created_by') {
              query = query.eq('created_by', value)
            } else if (key === 'date_range') {
              if (value.start) query = query.gte('start_date', value.start)
              if (value.end) query = query.lte('end_date', value.end)
            }
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        query = query.order(column, { ascending })
      } else {
        // Default sort by creation date (newest first)
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
        return this.formatError(error)
      }

      return this.formatResponse(data as MealPlan[], count)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get a single meal plan by ID
   */
  async getMealPlan(id: string): Promise<ServiceResponse<MealPlan>> {
    try {
      const { data, error } = await this.supabase
        .from('meal_plans')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as MealPlan)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get meal plans for a specific player
   */
  async getMealPlansByPlayer(playerId: string): Promise<ServiceResponse<MealPlan[]>> {
    try {
      const { data, error } = await this.supabase
        .from('meal_plans')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as MealPlan[])
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Create a new meal plan
   */
  async createMealPlan(mealPlanData: CreateMealPlanData, createdBy?: string): Promise<ServiceResponse<MealPlan>> {
    try {
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
        return this.formatError(error)
      }

      return this.formatResponse(data as MealPlan)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Update a meal plan
   */
  async updateMealPlan(id: string, updates: UpdateMealPlanData): Promise<ServiceResponse<MealPlan>> {
    try {
      const { data, error } = await this.supabase
        .from('meal_plans')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as MealPlan)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Delete a meal plan
   */
  async deleteMealPlan(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await this.supabase
        .from('meal_plans')
        .delete()
        .eq('id', id)

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(null)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get meal plan statistics
   */
  async getMealPlanStats(): Promise<ServiceResponse<{
    total: number
    active: number
    draft: number
    completed: number
    archived: number
    byPlanType: Record<string, number>
    avgCalories: number
    avgProtein: number
  }>> {
    try {
      const { data, error } = await this.supabase
        .from('meal_plans')
        .select('status, plan_type, calories, protein')

      if (error) {
        return this.formatError(error)
      }

      const stats = {
        total: data.length,
        active: 0,
        draft: 0,
        completed: 0,
        archived: 0,
        byPlanType: {} as Record<string, number>,
        avgCalories: 0,
        avgProtein: 0
      }

      let totalCalories = 0
      let totalProtein = 0
      let calorieCount = 0
      let proteinCount = 0

      data.forEach(plan => {
        // Count by status
        stats[plan.status as keyof typeof stats]++

        // Count by plan type
        if (plan.plan_type) {
          stats.byPlanType[plan.plan_type] = (stats.byPlanType[plan.plan_type] || 0) + 1
        }

        // Calculate averages
        if (plan.calories) {
          totalCalories += plan.calories
          calorieCount++
        }
        if (plan.protein) {
          totalProtein += plan.protein
          proteinCount++
        }
      })

      stats.avgCalories = calorieCount > 0 ? Math.round(totalCalories / calorieCount) : 0
      stats.avgProtein = proteinCount > 0 ? Math.round(totalProtein / proteinCount) : 0

      return this.formatResponse(stats)
    } catch (error) {
      return this.formatError(error)
    }
  }

  // Template operations
  /**
   * Get all templates
   */
  async getTemplates(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<Template[]>> {
    try {
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
            } else if (key === 'created_by') {
              query = query.eq('created_by', value)
            } else if (key === 'organization') {
              query = query.eq('organization', value)
            } else if (key === 'tags') {
              query = query.contains('tags', [value])
            }
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        query = query.order(column, { ascending })
      } else {
        // Default sort by usage and creation date
        query = query.order('times_used', { ascending: false }).order('created_at', { ascending: false })
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

      return this.formatResponse(data as Template[], count)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Get a single template by ID
   */
  async getTemplate(id: string): Promise<ServiceResponse<Template>> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Template)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(templateData: CreateTemplateData, createdBy?: string): Promise<ServiceResponse<Template>> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .insert({
          ...templateData,
          created_by: createdBy
        })
        .select('*')
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Template)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Update a template
   */
  async updateTemplate(id: string, updates: UpdateTemplateData): Promise<ServiceResponse<Template>> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Template)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await this.supabase
        .from('templates')
        .delete()
        .eq('id', id)

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(null)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Use a template (increment usage count)
   */
  async useTemplate(id: string): Promise<ServiceResponse<Template>> {
    try {
      // First get the current template
      const { data: currentTemplate, error: fetchError } = await this.supabase
        .from('templates')
        .select('times_used')
        .eq('id', id)
        .single()

      if (fetchError) {
        return this.formatError(fetchError)
      }

      // Then update with incremented value
      const { data, error } = await this.supabase
        .from('templates')
        .update({ times_used: (currentTemplate.times_used || 0) + 1 })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data as Template)
    } catch (error) {
      return this.formatError(error)
    }
  }

  /**
   * Create meal plan from template
   */
  async createMealPlanFromTemplate(templateId: string, playerId: string, title: string, createdBy?: string): Promise<ServiceResponse<MealPlan>> {
    try {
      // First get the template
      const templateResult = await this.getTemplate(templateId)
      if (!templateResult.data) {
        return this.formatError(new Error('Template not found'))
      }

      const template = templateResult.data

      // Create meal plan from template
      const mealPlanData: CreateMealPlanData = {
        player_id: playerId,
        title,
        description: `Created from template: ${template.name}`,
        calories: template.calories,
        protein: template.protein,
        carbs: template.carbs,
        fat: template.fat,
        fiber: template.fiber,
        meal_data: template.meal_plan
      }

      const result = await this.createMealPlan(mealPlanData, createdBy)

      // Increment template usage count
      if (result.data) {
        await this.useTemplate(templateId)
      }

      return result
    } catch (error) {
      return this.formatError(error)
    }
  }
}