'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function SimpleTestPage() {
  const { user, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Successfully authenticated</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {(user as any).first_name} {(user as any).last_name}</p>
              <p><strong>Role:</strong> {(user as any).role}</p>
            </div>
          ) : (
            <p className="text-red-600 font-medium">❌ Not authenticated</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-600">✅ Authentication working</p>
              <p>Now you can test the calendar at:</p>
              <a 
                href="/calendar-test" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Test Calendar
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600">❌ Need to set up authentication</p>
              <p>Please run the database setup scripts first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}