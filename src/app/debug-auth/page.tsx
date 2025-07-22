'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function DebugAuthPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const testSupabase = async () => {
      try {
        addLog('🔍 Starting Supabase connection test...')
        
        // Test 1: Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        addLog(`📍 Supabase URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`)
        addLog(`🔑 Supabase Key: ${supabaseKey ? '✅ Found' : '❌ Missing'}`)
        
        if (!supabaseUrl || !supabaseKey) {
          addLog('❌ Missing Supabase environment variables!')
          setSupabaseStatus('error')
          return
        }

        // Test 2: Create Supabase client
        addLog('🔧 Creating Supabase client...')
        const supabase = createSupabaseBrowserClient()
        addLog('✅ Supabase client created')

        // Test 3: Test database connection
        addLog('📊 Testing database connection...')
        const { data, error } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true })
          .limit(1)

        if (error) {
          addLog(`❌ Database error: ${error.message}`)
          setSupabaseStatus('error')
          return
        }

        addLog(`✅ Database connection successful! Found ${data || 0} users`)

        // Test 4: Test authentication
        addLog('🔐 Testing authentication...')
        const { data: authData, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          addLog(`⚠️ Auth error: ${authError.message}`)
        } else {
          addLog(`🔐 Auth status: ${authData.user ? '✅ Logged in' : '❌ Not logged in'}`)
          if (authData.user) {
            addLog(`👤 User: ${authData.user.email}`)
          }
        }

        // Test 5: Try to query users table with specific email
        addLog('👤 Looking for sarah.johnson@sportsnutrition.com...')
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, role')
          .eq('email', 'sarah.johnson@sportsnutrition.com')
          .limit(1)

        if (userError) {
          addLog(`❌ User query error: ${userError.message}`)
        } else if (userData && userData.length > 0) {
          addLog(`✅ Found user: ${userData[0].first_name} ${userData[0].last_name} (${userData[0].role})`)
        } else {
          addLog(`⚠️ User not found in database`)
        }

        setSupabaseStatus('success')
        addLog('🎉 Supabase test complete!')

      } catch (error) {
        addLog(`💥 Unexpected error: ${error}`)
        setSupabaseStatus('error')
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔍 Supabase Debug Console
          </h1>
          
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              supabaseStatus === 'loading' ? 'bg-blue-100 text-blue-800' :
              supabaseStatus === 'success' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {supabaseStatus === 'loading' && '🔄 Testing...'}
              {supabaseStatus === 'success' && '✅ All tests passed'}
              {supabaseStatus === 'error' && '❌ Issues found'}
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="font-mono text-sm bg-gray-100 p-2 rounded">
                {log}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• If all tests pass, try the calendar at <code>/calendar-test</code></li>
              <li>• If user not found, run the SQL setup scripts in Supabase</li>
              <li>• If database errors, check your .env.local file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}