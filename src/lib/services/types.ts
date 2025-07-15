/**
 * Database types based on Supabase schema
 */

export type UserRole = 'admin' | 'dietitian' | 'coach' | 'player'
export type PlayerStatus = 'active' | 'inactive' | 'injured' | 'suspended'
export type MealPlanStatus = 'active' | 'draft' | 'completed' | 'archived'
export type EventType = 'training' | 'meal' | 'competition' | 'recovery' | 'meeting'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  organization?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  user_id: string
  date_of_birth?: string
  gender?: string
  height?: number
  weight?: number
  position?: string
  sport?: string
  team?: string
  squad?: string
  jersey_number?: number
  status: PlayerStatus
  compliance_rate: number
  tags: string[]
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  emergency_contact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  notes?: string
  created_at: string
  updated_at: string
  // Joined user data
  user?: User
}

export interface CreatePlayerData {
  // User data
  email: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  // Player-specific data
  date_of_birth?: string
  gender?: string
  height?: number
  weight?: number
  position?: string
  sport?: string
  team?: string
  squad?: string
  jersey_number?: number
  status?: PlayerStatus
  tags?: string[]
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  emergency_contact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  notes?: string
}

export interface UpdatePlayerData {
  // User data
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  // Player-specific data
  date_of_birth?: string
  gender?: string
  height?: number
  weight?: number
  position?: string
  sport?: string
  team?: string
  squad?: string
  jersey_number?: number
  status?: PlayerStatus
  tags?: string[]
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  emergency_contact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  notes?: string
}

export interface MealPlan {
  id: string
  player_id: string
  dietitian_id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  status: MealPlanStatus
  meals: any[] // JSON structure for meals
  nutritional_targets: any // JSON structure for targets
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  player?: Player
  dietitian?: User
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  location?: string
  attendee_ids: string[]
  created_by: string
  meal_plan_id?: string
  metadata?: any
  created_at: string
  updated_at: string
  // Joined data
  created_by_user?: User
  attendees?: User[]
}