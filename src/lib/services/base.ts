import { createSupabaseBrowserClient } from '../supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Base service class with common database operations
 */
export abstract class BaseService {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = createSupabaseBrowserClient()
  }

  /**
   * Generic error handler for Supabase operations
   */
  protected handleError(error: any, operation: string): never {
    console.error(`${operation} failed:`, error)
    throw new Error(error.message || `${operation} failed`)
  }

  /**
   * Generic success response formatter
   */
  protected formatResponse<T>(data: T | null, count?: number) {
    return {
      data,
      count: count ?? null,
      error: null
    }
  }

  /**
   * Generic error response formatter
   */
  protected formatError(error: any) {
    return {
      data: null,
      count: null,
      error: error.message || 'An unexpected error occurred'
    }
  }
}

/**
 * Response type for service operations
 */
export interface ServiceResponse<T> {
  data: T | null
  count?: number | null
  error: string | null
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

/**
 * Sort options
 */
export interface SortOptions {
  column: string
  ascending?: boolean
}

/**
 * Filter options
 */
export interface FilterOptions {
  [key: string]: any
}