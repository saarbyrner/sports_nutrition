/**
 * Service Layer Index
 * Central export point for all services
 */

export * from './base'
export * from './types'
export * from './player'

// Import services
import { PlayerService } from './player'

/**
 * Service Manager - Singleton pattern for service instances
 */
class ServiceManager {
  private static instance: ServiceManager
  private _playerService: PlayerService | null = null

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

  // Add more services here as we create them
  // get mealPlanService(): MealPlanService { ... }
  // get calendarService(): CalendarService { ... }
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

/**
 * Convenience hook for React components
 */
export function useServices() {
  return services
}