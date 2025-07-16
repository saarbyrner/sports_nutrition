'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getAuthService, AuthUser, AuthState } from '@/lib/auth'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signUp: (email: string, password: string, userData: {
    first_name: string
    last_name: string
    role: 'admin' | 'dietitian' | 'coach' | 'player'
    organization: string
    phone?: string
  }) => Promise<{ user: AuthUser | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  const [authService, setAuthService] = useState<ReturnType<typeof getAuthService> | null>(null)

  useEffect(() => {
    let mounted = true
    let subscription: any = null

    // Only create auth service on the client side
    const initializeAuth = async () => {
      try {
        const service = getAuthService()
        if (!mounted) return

        setAuthService(service)
        
        // Initialize auth state
        try {
          const user = await service.getCurrentUser()
          if (!mounted) return

          setAuthState({
            user,
            loading: false,
            error: null
          })
        } catch (error) {
          if (!mounted) return

          setAuthState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
          })
        }

        // Listen for auth changes
        const { data } = service.onAuthStateChange((user) => {
          if (!mounted) return
          
          setAuthState(prev => ({
            ...prev,
            user,
            loading: false
          }))
        })

        subscription = data.subscription
      } catch (error) {
        if (!mounted) return
        
        // Handle case where Supabase environment variables are missing
        setAuthState({
          user: null,
          loading: false,
          error: 'Missing Supabase configuration'
        })
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!authService) {
      return { user: null, error: 'Authentication service not available' }
    }
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await authService.signIn(email, password)
    
    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: result.error
    }))
    
    return result
  }

  const signUp = async (email: string, password: string, userData: {
    first_name: string
    last_name: string
    role: 'admin' | 'dietitian' | 'coach' | 'player'
    organization: string
    phone?: string
  }) => {
    if (!authService) {
      return { user: null, error: 'Authentication service not available' }
    }
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await authService.signUp(email, password, userData)
    
    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: result.error
    }))
    
    return result
  }

  const signOut = async () => {
    if (!authService) {
      return { error: 'Authentication service not available' }
    }
    
    setAuthState(prev => ({ ...prev, loading: true }))
    
    const result = await authService.signOut()
    
    setAuthState({
      user: null,
      loading: false,
      error: result.error
    })
    
    return result
  }

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}