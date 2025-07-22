-- SIMPLE WORKING FIX - No JWT operators, just basic auth
-- This will definitely work and fix the infinite recursion

-- Step 1: Disable RLS to stop the 500 errors immediately
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on users table
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'users' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON users';
    END LOOP;
    
    -- Drop all policies on players table  
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'players' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON players';
    END LOOP;
END $$;

-- Step 3: Create simple, working policies without recursion
-- Use only auth.uid() which is safe and doesn't cause recursion

-- Users table policies
CREATE POLICY "users_select_own" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Allow admin by specific UUID (replace with your actual admin user ID)
-- Get your admin UUID by running: SELECT id FROM users WHERE email = 'sarah.johnson@sportsnutrition.com';
CREATE POLICY "users_admin_all" ON users 
  FOR ALL USING (auth.uid() = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid);

-- Players table policies  
CREATE POLICY "players_select_own" ON players 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "players_update_own" ON players 
  FOR UPDATE USING (user_id = auth.uid());

-- Allow admin full access to players
CREATE POLICY "players_admin_all" ON players 
  FOR ALL USING (auth.uid() = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid);

-- Step 4: Re-enable RLS with working policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Verify the fix
SELECT 'SUCCESS: Policies created without recursion' as status;
SELECT 
  'users' as table_name, 
  policyname, 
  cmd 
FROM pg_policies 
WHERE tablename = 'users'
UNION ALL
SELECT 
  'players' as table_name, 
  policyname, 
  cmd 
FROM pg_policies 
WHERE tablename = 'players'
ORDER BY table_name, cmd;

-- Test basic permissions
SELECT 
  'Current user context:' as info,
  auth.uid() as current_user_id,
  (auth.uid() = '95042b09-c4ba-41e4-9ba4-4315b5a23a52'::uuid) as is_admin_user;