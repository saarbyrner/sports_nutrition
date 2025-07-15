const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://aghossjvuiqbsltndmnm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaG9zc2p2dWlxYnNsdG5kbW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ2OTIzNywiZXhwIjoyMDY4MDQ1MjM3fQ.NqwW026cE6bjFIdaxAG99EBqqN37M0i5GW6xV8AXFQ8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Setting up database schema...')
    
    // Read and execute schema
    const schema = fs.readFileSync('supabase/schema.sql', 'utf8')
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
      console.error('Schema error:', error)
      return
    }
    
    console.log('Schema created successfully')
    
    // Read and execute seed data
    const seedData = fs.readFileSync('supabase/seed.sql', 'utf8')
    const { data: seedResult, error: seedError } = await supabase.rpc('exec_sql', { sql: seedData })
    
    if (seedError) {
      console.error('Seed error:', seedError)
      return
    }
    
    console.log('Seed data inserted successfully')
    console.log('Database setup complete!')
    
  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupDatabase()