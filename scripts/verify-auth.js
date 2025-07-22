// Script to verify authentication and user setup
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verifyAuthSetup() {
  console.log('🔍 Verifying authentication setup...\n')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    return
  }
  
  console.log('✅ Environment variables found')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check if we can connect to the database (bypassing RLS)
    const { data: users, error: usersError } = await supabase.rpc('get_user_by_email', {
      user_email: 'sarah.johnson@sportsnutrition.com'
    })
    
    // Fallback: try direct query
    if (usersError) {
      console.log('Trying direct query...')
      const { data: directUsers, error: directError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, organization')
        .eq('email', 'sarah.johnson@sportsnutrition.com')
        .limit(1)
      
      if (directError) {
        console.error('❌ Database connection error:', directError.message)
        return
      }
      users = directUsers
    }
    
    if (usersError) {
      console.error('❌ Database connection error:', usersError.message)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('⚠️  User sarah.johnson@sportsnutrition.com not found in database')
      console.log('Creating user...')
      
      // Create the user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: 'sarah.johnson@sportsnutrition.com',
          first_name: 'Sarah',
          last_name: 'Johnson',
          role: 'admin',
          organization: 'Sports Nutrition'
        })
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Failed to create user:', createError.message)
        return
      }
      
      console.log('✅ User created:', newUser)
    } else {
      console.log('✅ User found:', users[0])
    }
    
    // Test calendar events table access
    const { data: events, error: eventsError } = await supabase
      .from('calendar_events')
      .select('id, title, created_by')
      .limit(1)
    
    if (eventsError) {
      console.error('❌ Calendar events table error:', eventsError.message)
    } else {
      console.log('✅ Calendar events table accessible')
      console.log(`📊 Found ${events?.length || 0} events`)
    }
    
    console.log('\n🎉 Authentication verification complete!')
    
  } catch (error) {
    console.error('❌ Setup verification failed:', error.message)
  }
}

verifyAuthSetup()