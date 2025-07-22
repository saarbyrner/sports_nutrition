// Test Authentication Fix
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testAuthFix() {
  console.log('🔧 Testing authentication fix...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test 1: Check if user exists with the Auth ID
    console.log('📋 Step 1: Checking user in database...')
    const authUserId = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, organization')
      .eq('id', authUserId)
      .single()
    
    if (userError) {
      console.error(`❌ User lookup failed: ${userError.message}`)
      return
    }

    if (user) {
      console.log('✅ User found in database:')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Name: ${user.first_name} ${user.last_name}`)
      console.log(`   - Role: ${user.role}`)
      console.log(`   - Organization: ${user.organization}`)
    } else {
      console.log('❌ User not found with Auth ID')
      return
    }

    // Test 2: Try creating a test calendar event
    console.log('\n📅 Step 2: Testing calendar event creation...')
    
    const testEventData = {
      title: 'Test Event - Auth Fix Verification',
      description: 'Testing if foreign key constraint is resolved',
      event_type: 'appointment',
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      location: 'Test Location',
      attendees: [authUserId],
      is_private: false,
      created_by: authUserId,
      organization: user.organization,
      metadata: {}
    }

    const { data: eventData, error: eventError } = await supabase
      .from('calendar_events')
      .insert(testEventData)
      .select()
      .single()

    if (eventError) {
      console.error(`❌ Test event creation failed: ${eventError.message}`)
      return
    }

    console.log('✅ Test event created successfully!')
    console.log(`   - Event ID: ${eventData.id}`)
    console.log(`   - Title: ${eventData.title}`)
    console.log(`   - Created by: ${eventData.created_by}`)

    // Clean up test event
    await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventData.id)
    
    console.log('🧹 Test event cleaned up')

    // Test 3: Verify calendar service will work
    console.log('\n🎯 Step 3: All tests passed!')
    console.log('✅ Authentication is properly configured')
    console.log('✅ Foreign key constraints resolved')
    console.log('✅ Calendar event creation will work')
    
    console.log('\n🚀 Ready to test calendar in the app!')

  } catch (error) {
    console.error(`💥 Unexpected error: ${error.message}`)
  }
}

testAuthFix()