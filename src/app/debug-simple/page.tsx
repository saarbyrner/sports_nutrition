'use client'

export default function DebugSimple() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page - Simple Test</h1>
      <p>This is a simple page to test if Next.js is working correctly.</p>
      <div className="mt-4">
        <p>Environment Variables Status:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
      <div className="mt-4">
        <p>Date: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}