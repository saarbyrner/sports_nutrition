const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://aghossjvuiqbsltndmnm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaG9zc2p2dWlxYnNsdG5kbW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ2OTIzNywiZXhwIjoyMDY4MDQ1MjM3fQ.NqwW026cE6bjFIdaxAG99EBqqN37M0i5GW6xV8AXFQ8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createDemoUsers() {
  console.log('Creating demo user accounts...')
  
  const demoUsers = [
    {
      email: 'sarah.johnson@sportsnutrition.com',
      password: 'admin',
      user_metadata: {
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'admin'
      }
    },
    {
      email: 'mike.chen@sportsnutrition.com',
      password: 'admin',
      user_metadata: {
        first_name: 'Mike',
        last_name: 'Chen',
        role: 'dietitian'
      }
    },
    {
      email: 'lisa.rodriguez@sportsnutrition.com',
      password: 'admin',
      user_metadata: {
        first_name: 'Lisa',
        last_name: 'Rodriguez',
        role: 'coach'
      }
    }
  ]

  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.user_metadata,
        email_confirm: true
      })

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
      } else {
        console.log(`✅ Created user: ${user.email}`)
      }
    } catch (err) {
      console.error(`Failed to create user ${user.email}:`, err)
    }
  }
}

createDemoUsers()