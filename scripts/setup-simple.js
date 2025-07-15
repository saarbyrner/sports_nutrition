const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://aghossjvuiqbsltndmnm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaG9zc2p2dWlxYnNsdG5kbW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ2OTIzNywiZXhwIjoyMDY4MDQ1MjM3fQ.NqwW026cE6bjFIdaxAG99EBqqN37M0i5GW6xV8AXFQ8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('pg_stat_activity')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Connection error:', error)
      return
    }
    
    console.log('Connection successful!')
    
    // Check existing tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables')
    
    if (tablesError) {
      console.log('Cannot check tables, will proceed with manual setup')
    } else {
      console.log('Existing tables:', tables)
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testConnection()