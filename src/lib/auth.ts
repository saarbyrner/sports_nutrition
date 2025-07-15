import { createSupabaseBrowserClient } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  role?: 'admin' | 'dietitian' | 'coach' | 'player'
  organization?: string
  first_name?: string
  last_name?: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export class AuthService {
  private supabase: ReturnType<typeof createSupabaseBrowserClient>
  
  constructor() {
    this.supabase = createSupabaseBrowserClient()
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Sign in failed' }
    }
  }

  async signUp(email: string, password: string, userData: {
    first_name: string
    last_name: string
    role: 'admin' | 'dietitian' | 'coach' | 'player'
    organization: string
    phone?: string
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Sign up failed' }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      if (error || !user) return null
      
      // Get additional user data from our users table
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      if (userError || !userData) return user as AuthUser
      
      return {
        ...user,
        role: userData.role,
        organization: userData.organization,
        first_name: userData.first_name,
        last_name: userData.last_name
      } as AuthUser
    } catch (error) {
      return null
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

// Export singleton instance to prevent multiple AuthService instances
let authServiceInstance: AuthService | null = null

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }
  return authServiceInstance
}