/**
 * Service Layer Index
 * Central export point for all services
 */

export * from './base'
export * from './types'
export * from './player'
export * from './calendar'

// Import services
import { PlayerService } from './player'
import { CalendarService } from './calendar'

/**
 * Service Manager - Singleton pattern for service instances
 */
class ServiceManager {
  private static instance: ServiceManager
  private _playerService: PlayerService | null = null
  private _calendarService: CalendarService | null = null

  private constructor() {}

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  get playerService(): PlayerService {
    if (!this._playerService) {
      this._playerService = new PlayerService()
    }
    return this._playerService
  }

  get calendarService(): CalendarService {
    if (!this._calendarService) {
      this._calendarService = new CalendarService()
    }
    return this._calendarService
  }

  // Add more services here as we create them
  // get mealPlanService(): MealPlanService { ... }
  // get analyticsService(): AnalyticsService { ... }
}

/**
 * Export singleton instance for easy access
 */
export const services = ServiceManager.getInstance()

/**
 * Individual service exports for direct access
 */
export const playerService = services.playerService
export const calendarService = services.calendarService

/**
 * Convenience hook for React components
 */
export function useServices() {
  return services
}