-- Setup Admin User for Calendar
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Temporarily disable RLS to create the admin user
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Insert the admin user (you)
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  organization,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'sarah.johnson@sportsnutrition.com',
  'Sarah',
  'Johnson',
  'admin',
  'Sports Nutrition',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  updated_at = NOW();

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify user was created
SELECT 'Admin user setup complete:' as status, 
       id, email, first_name, last_name, role, organization
FROM users 
WHERE email = 'sarah.johnson@sportsnutrition.com';

-- Test calendar event creation
DO $$
DECLARE
    admin_user_id UUID;
    test_event_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM users 
    WHERE email = 'sarah.johnson@sportsnutrition.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found!';
        RETURN;
    END IF;
    
    -- Temporarily disable RLS for calendar_events
    ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
    
    -- Try to create a test event
    INSERT INTO calendar_events (
        title,
        description,
        event_type,
        start_time,
        end_time,
        created_by,
        attendees,
        organization
    ) VALUES (
        'Test Event - Setup Verification',
        'This event verifies calendar creation works',
        'meal',
        NOW() + INTERVAL '1 hour',
        NOW() + INTERVAL '2 hours',
        admin_user_id,
        ARRAY[admin_user_id],
        'Sports Nutrition'
    ) RETURNING id INTO test_event_id;
    
    RAISE NOTICE 'Test event created with ID: %', test_event_id;
    
    -- Clean up test event
    DELETE FROM calendar_events WHERE id = test_event_id;
    RAISE NOTICE 'Test event cleaned up successfully';
    
    -- Re-enable RLS
    ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Calendar setup verification complete!';
    
EXCEPTION WHEN OTHERS THEN
    -- Re-enable RLS even if there's an error
    ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Setup error: %', SQLERRM;
END $$;