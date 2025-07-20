import { createSupabaseBrowserClient } from '@/lib/supabase'
import { BaseService, ServiceResponse, PaginationOptions, SortOptions, FilterOptions } from './base'
import { CalendarEvent, EventType, User } from './types'

export interface CreateCalendarEventData {
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  location?: string
  attendee_ids: string[]
  meal_plan_id?: string
  metadata?: any
}

export interface UpdateCalendarEventData {
  title?: string
  description?: string
  event_type?: EventType
  start_time?: string
  end_time?: string
  location?: string
  attendee_ids?: string[]
  meal_plan_id?: string
  metadata?: any
}

export interface CalendarEventWithAttendees extends CalendarEvent {
  attendees: User[]
}

export class CalendarService extends BaseService {
  protected supabase = createSupabaseBrowserClient()

  async getEvents(options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions & {
      start_date?: string
      end_date?: string
      event_type?: EventType
      attendee_id?: string
    }
  }): Promise<ServiceResponse<CalendarEventWithAttendees[]>> {
    try {
      let query = this.supabase
        .from('calendar_events')
        .select(`
          *,
          created_by_user:users!calendar_events_created_by_fkey(
            id, email, first_name, last_name, avatar_url
          )
        `)

      // Apply filters
      if (options?.filters) {
        const { start_date, end_date, event_type, attendee_id, search, ...otherFilters } = options.filters
        
        if (start_date) {
          query = query.gte('start_time', start_date)
        }
        if (end_date) {
          query = query.lte('end_time', end_date)
        }
        if (event_type) {
          query = query.eq('event_type', event_type)
        }
        if (attendee_id) {
          query = query.contains('attendee_ids', [attendee_id])
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Apply other filters
        Object.entries(otherFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value)
          }
        })
      }

      // Apply sorting
      if (options?.sort) {
        const { column, ascending = true } = options.sort
        query = query.order(column, { ascending })
      } else {
        query = query.order('start_time', { ascending: true })
      }

      // Apply pagination
      if (options?.pagination) {
        const { page = 1, limit = 50, offset } = options.pagination
        if (offset !== undefined) {
          query = query.range(offset, offset + limit - 1)
        } else {
          const start = (page - 1) * limit
          query = query.range(start, start + limit - 1)
        }
      }

      const { data, error, count } = await query

      if (error) {
        return this.formatError(error)
      }

      // Fetch attendees for each event
      const eventsWithAttendees = await Promise.all(
        (data || []).map(async (event: CalendarEvent) => {
          const { data: attendees } = await this.supabase
            .from('users')
            .select('id, email, first_name, last_name, avatar_url')
            .in('id', event.attendee_ids || [])

          return {
            ...event,
            attendees: attendees || []
          } as CalendarEventWithAttendees
        })
      )

      return this.formatResponse(eventsWithAttendees, count)
    } catch (error) {
      return this.formatError(error)
    }
  }

  async getEventById(id: string): Promise<ServiceResponse<CalendarEventWithAttendees>> {
    try {
      const { data, error } = await this.supabase
        .from('calendar_events')
        .select(`
          *,
          created_by_user:users!calendar_events_created_by_fkey(
            id, email, first_name, last_name, avatar_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        return this.formatError(error)
      }

      // Fetch attendees
      const { data: attendees } = await this.supabase
        .from('users')
        .select('id, email, first_name, last_name, avatar_url')
        .in('id', data.attendee_ids || [])

      const eventWithAttendees = {
        ...data,
        attendees: attendees || []
      } as CalendarEventWithAttendees

      return this.formatResponse(eventWithAttendees)
    } catch (error) {
      return this.formatError(error)
    }
  }

  async createEvent(eventData: CreateCalendarEventData, createdBy: string): Promise<ServiceResponse<CalendarEvent>> {
    try {
      const { data, error } = await this.supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          created_by: createdBy
        })
        .select()
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data)
    } catch (error) {
      return this.formatError(error)
    }
  }

  async updateEvent(id: string, eventData: UpdateCalendarEventData): Promise<ServiceResponse<CalendarEvent>> {
    try {
      const { data, error } = await this.supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return this.formatError(error)
      }

      return this.formatResponse(data)
    } catch (error) {
      return this.formatError(error)
    }
  }

  async deleteEvent(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await this.supabase
        .from('calendar_events')
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

  async getEventsByDateRange(startDate: string, endDate: string, attendeeId?: string): Promise<ServiceResponse<CalendarEventWithAttendees[]>> {
    return this.getEvents({
      filters: {
        start_date: startDate,
        end_date: endDate,
        attendee_id: attendeeId
      }
    })
  }

  async getUpcomingEvents(userId: string, limit: number = 10): Promise<ServiceResponse<CalendarEventWithAttendees[]>> {
    const now = new Date().toISOString()
    
    return this.getEvents({
      pagination: { limit },
      filters: {
        start_date: now,
        attendee_id: userId
      },
      sort: { column: 'start_time', ascending: true }
    })
  }

  async getEventsByPlayer(playerId: string, options?: {
    pagination?: PaginationOptions
    sort?: SortOptions
    filters?: FilterOptions
  }): Promise<ServiceResponse<CalendarEventWithAttendees[]>> {
    try {
      // First get the user_id for the player
      const { data: player, error: playerError } = await this.supabase
        .from('players')
        .select('user_id')
        .eq('id', playerId)
        .single()

      if (playerError || !player) {
        return this.formatError(playerError || new Error('Player not found'))
      }

      return this.getEvents({
        ...options,
        filters: {
          ...options?.filters,
          attendee_id: player.user_id
        }
      })
    } catch (error) {
      return this.formatError(error)
    }
  }

  async getEventStats(userId?: string): Promise<ServiceResponse<{
    total: number
    thisWeek: number
    thisMonth: number
    upcoming: number
    byType: Record<EventType, number>
  }>> {
    try {
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      let baseQuery = this.supabase.from('calendar_events')
      
      if (userId) {
        baseQuery = baseQuery.contains('attendee_ids', [userId])
      }

      const [totalRes, weekRes, monthRes, upcomingRes, typeRes] = await Promise.all([
        baseQuery.select('id', { count: 'exact', head: true }),
        baseQuery.select('id', { count: 'exact', head: true }).gte('start_time', startOfWeek.toISOString()),
        baseQuery.select('id', { count: 'exact', head: true }).gte('start_time', startOfMonth.toISOString()),
        baseQuery.select('id', { count: 'exact', head: true }).gte('start_time', new Date().toISOString()).lte('start_time', nextWeek.toISOString()),
        baseQuery.select('event_type')
      ])

      if (totalRes.error || weekRes.error || monthRes.error || upcomingRes.error || typeRes.error) {
        return this.formatError(totalRes.error || weekRes.error || monthRes.error || upcomingRes.error || typeRes.error)
      }

      // Count events by type
      const byType = (typeRes.data || []).reduce((acc: Record<EventType, number>, event: CalendarEvent) => {
        acc[event.event_type as EventType] = (acc[event.event_type as EventType] || 0) + 1
        return acc
      }, {} as Record<EventType, number>)

      return this.formatResponse({
        total: totalRes.count || 0,
        thisWeek: weekRes.count || 0,
        thisMonth: monthRes.count || 0,
        upcoming: upcomingRes.count || 0,
        byType
      })
    } catch (error) {
      return this.formatError(error)
    }
  }
}