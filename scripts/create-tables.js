const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://aghossjvuiqbsltndmnm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaG9zc2p2dWlxYnNsdG5kbW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ2OTIzNywiZXhwIjoyMDY4MDQ1MjM3fQ.NqwW026cE6bjFIdaxAG99EBqqN37M0i5GW6xV8AXFQ8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  try {
    console.log('Creating basic tables...')
    
    // Create users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError && usersError.code === '42P01') {
      console.log('Users table does not exist, need to create via SQL editor')
      console.log('Please run the schema.sql file in your Supabase SQL Editor')
      return
    }
    
    console.log('Database appears to be set up already')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createTables()