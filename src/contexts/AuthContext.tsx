'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService, AuthUser, AuthState } from '@/lib/auth'

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

  const authService = new AuthService()

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
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
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
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