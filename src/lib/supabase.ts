import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if we have valid environment variables (not empty or placeholder)
const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseUrl.startsWith('https://')
const isValidKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here'

// Singleton browser client to avoid multiple instances
let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null

// Remove the standalone client to prevent conflicts
export const supabase = null

export function createSupabaseBrowserClient() {
  if (!isValidUrl || !isValidKey) {
    throw new Error('Missing or invalid Supabase environment variables')
  }
  
  // Return singleton instance to prevent multiple GoTrueClient instances
  if (!browserClientInstance) {
    browserClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  return browserClientInstance
}