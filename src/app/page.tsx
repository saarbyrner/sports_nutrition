'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

// Lazy load components to avoid build issues
import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
})

const MainApp = dynamic(() => import('@/components/MainApp'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
})

export default function Home() {
  try {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        {!user ? <LoginForm /> : <MainApp />}
      </Suspense>
    )
  } catch (error) {
    // Fallback in case of any client-side errors
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sports Nutrition App</h1>
          <p className="text-gray-600 mb-4">Loading...</p>
          <p className="text-sm text-gray-400">If this persists, please check your environment configuration.</p>
        </div>
      </div>
    )
  }
}
