-- Fix User Authentication Mismatch
-- This script ensures your Supabase Auth user matches the users table

-- First, let's see what we have
SELECT 'Current users in database:' as info;
SELECT id, email, first_name, last_name, role, organization 
FROM users 
ORDER BY created_at DESC;

-- Check if the Supabase Auth user exists in our users table
SELECT 'Checking for Supabase Auth user:' as info;
SELECT id, email, first_name, last_name, role 
FROM users 
WHERE id = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid;

-- Option 1: Update existing user to match Supabase Auth ID
UPDATE users 
SET id = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid
WHERE email = 'sarah.johnson@sportsnutrition.com'
AND id != '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid;

-- Option 2: If no user with that email exists, create one
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
  '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid,
  'sarah.johnson@sportsnutrition.com',
  'Sarah',
  'Johnson',
  'admin',
  'Sports Nutrition',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  updated_at = NOW();

-- Also handle the email constraint
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
  '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid,
  'sarah.johnson@sportsnutrition.com',
  'Sarah',
  'Johnson',
  'admin',
  'Sports Nutrition',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  id = EXCLUDED.id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  updated_at = NOW();

-- Verify the fix
SELECT 'Fixed user:' as status;
SELECT id, email, first_name, last_name, role, organization 
FROM users 
WHERE id = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid;

-- Test foreign key constraint will work
SELECT 'Foreign key constraint test:' as test;
SELECT EXISTS(
  SELECT 1 FROM users WHERE id = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid
) as user_exists_for_calendar_events;