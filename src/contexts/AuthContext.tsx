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
    // Only create auth service on the client side
    try {
      const service = getAuthService()
      setAuthService(service)
      
      // Initialize auth state
      const initAuth = async () => {
        try {
          const user = await service.getCurrentUser()
          setAuthState({
            user,
            loading: false,
            error: null
          })
        } catch (error) {
          setAuthState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
          })
        }
      }

      initAuth()

      // Listen for auth changes
      const { data: { subscription } } = service.onAuthStateChange((user) => {
        setAuthState(prev => ({
          ...prev,
          user,
          loading: false
        }))
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      // Handle case where Supabase environment variables are missing
      setAuthState({
        user: null,
        loading: false,
        error: 'Missing Supabase configuration'
      })
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