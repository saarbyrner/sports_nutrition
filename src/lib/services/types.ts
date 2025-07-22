/**
 * Database types based on Supabase schema
 */

export type UserRole = 'admin' | 'dietitian' | 'coach' | 'player'
export type PlayerStatus = 'active' | 'inactive' | 'injured' | 'suspended'
export type MealPlanStatus = 'active' | 'draft' | 'completed' | 'archived'
export type EventType = 'meal_plan' | 'appointment'

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
  title: string
  description?: string
  plan_type?: string // 'recovery', 'competition', 'training', 'general'
  status: MealPlanStatus
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  duration_days?: number
  start_date?: string
  end_date?: string
  ai_confidence?: number
  meal_data: any // JSONB structure for meals
  created_by?: string
  created_at: string
  updated_at: string
  // Joined data
  player?: Player
  created_by_user?: User
}

export interface CreateMealPlanData {
  player_id: string
  title: string
  description?: string
  plan_type?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  duration_days?: number
  start_date?: string
  end_date?: string
  meal_data: any
}

export interface UpdateMealPlanData {
  title?: string
  description?: string
  plan_type?: string
  status?: MealPlanStatus
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  duration_days?: number
  start_date?: string
  end_date?: string
  ai_confidence?: number
  meal_data?: any
}

export interface Template {
  id: string
  name: string
  category?: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  meal_plan: any // JSONB structure
  tags: string[]
  times_used: number
  created_by?: string
  organization?: string
  created_at: string
  updated_at: string
  // Joined data
  created_by_user?: User
}

export interface CreateTemplateData {
  name: string
  category?: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  meal_plan: any
  tags?: string[]
  organization?: string
}

export interface UpdateTemplateData {
  name?: string
  category?: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  meal_plan?: any
  tags?: string[]
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  location?: string
  attendees: string[]
  is_private: boolean
  organization?: string
  created_by: string
  meal_plan_id?: string
  metadata?: any
  created_at: string
  updated_at: string
  // Joined data
  created_by_user?: User
  attendee_users?: User[]
}