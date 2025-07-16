'use client'

import { useState, useCallback } from 'react'
import { CalendarService, CreateCalendarEventData, UpdateCalendarEventData, CalendarEventWithAttendees } from '@/lib/services/calendar'
import { EventType } from '@/lib/services/types'
import { PaginationOptions, SortOptions, FilterOptions } from '@/lib/services/base'
import { useAuth } from '@/contexts/AuthContext'

const calendarService = new CalendarService()

export function useCalendarService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || 'An unexpected error occurred'
    setError(message)
    console.error('Calendar service error:', err)
    return null
  }, [])

  // Get events with filters
  const getEvents = useCallback(async (options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions & {
      start_date?: string
      end_date?: string
      event_type?: EventType
      attendee_id?: string
    }
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getEvents(options)
      
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

  // Get single event
  const getEventById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getEventById(id)
      
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

  // Create event
  const createEvent = useCallback(async (eventData: CreateCalendarEventData) => {
    if (!user?.id) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.createEvent(eventData, user.id)
      
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

  // Update event
  const updateEvent = useCallback(async (id: string, eventData: UpdateCalendarEventData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.updateEvent(id, eventData)
      
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

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.deleteEvent(id)
      
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

  // Get events by date range
  const getEventsByDateRange = useCallback(async (startDate: string, endDate: string, attendeeId?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getEventsByDateRange(startDate, endDate, attendeeId)
      
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

  // Get upcoming events
  const getUpcomingEvents = useCallback(async (limit: number = 10) => {
    if (!user?.id) return null

    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getUpcomingEvents(user.id, limit)
      
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
  }, [handleError, user?.id])

  // Get events by player
  const getEventsByPlayer = useCallback(async (playerId: string, options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getEventsByPlayer(playerId, options)
      
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

  // Get event statistics
  const getEventStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await calendarService.getEventStats(user?.id)
      
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
    
    // Operations
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDateRange,
    getUpcomingEvents,
    getEventsByPlayer,
    getEventStats,
  }
}