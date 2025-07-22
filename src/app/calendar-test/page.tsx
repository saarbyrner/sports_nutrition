'use client'

import { useEffect, useState } from 'react'
import CalendarClean from '@/components/CalendarClean'
import { AuthProvider } from '@/contexts/AuthContext'

export default function CalendarTestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Calendar - Clean Implementation
            </h1>
            <p className="text-gray-600">
              Professional calendar with proper authentication, validation, and UX
            </p>
          </div>
          
          <CalendarClean />
        </div>
      </div>
    </AuthProvider>
  )
}