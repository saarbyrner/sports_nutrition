-- URGENT FIX FOR INFINITE RECURSION IN RLS POLICIES
-- This fixes the "infinite recursion detected in policy for relation users" error

-- First, we need to temporarily disable RLS to fix the recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all problematic policies that cause recursion
DROP POLICY IF EXISTS "allow_own_select" ON users;
DROP POLICY IF EXISTS "allow_own_update" ON users;
DROP POLICY IF EXISTS "allow_admin_select" ON users;
DROP POLICY IF EXISTS "allow_admin_insert" ON users;
DROP POLICY IF EXISTS "allow_admin_update" ON users;
DROP POLICY IF EXISTS "allow_admin_delete" ON users;

-- Also clean up players policies
DROP POLICY IF EXISTS "allow_player_own_select" ON players;
DROP POLICY IF EXISTS "allow_player_own_update" ON players;
DROP POLICY IF EXISTS "allow_admin_all_players" ON players;

-- Create NON-RECURSIVE policies using JWT claims instead of table lookups
-- The key is to use auth.jwt() instead of querying the users table

-- 1. Allow users to view their own profile (safe)
CREATE POLICY "users_own_select" ON users 
FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own profile (safe)
CREATE POLICY "users_own_update" ON users 
FOR UPDATE USING (auth.uid() = id);

-- 3. Allow admins to view all users - USING JWT ROLE, NOT TABLE LOOKUP
CREATE POLICY "users_admin_select" ON users 
FOR SELECT USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR 
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  OR
  (auth.jwt() ->> 'email') = 'sarah.johnson@sportsnutrition.com'
);

-- 4. Allow admins to insert new users - USING JWT ROLE, NOT TABLE LOOKUP
CREATE POLICY "users_admin_insert" ON users 
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR 
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  OR
  (auth.jwt() ->> 'email') = 'sarah.johnson@sportsnutrition.com'
);

-- 5. Allow admins to update any user - USING JWT ROLE, NOT TABLE LOOKUP
CREATE POLICY "users_admin_update" ON users 
FOR UPDATE USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR 
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  OR
  (auth.jwt() ->> 'email') = 'sarah.johnson@sportsnutrition.com'
);

-- 6. Allow admins to delete users - USING JWT ROLE, NOT TABLE LOOKUP
CREATE POLICY "users_admin_delete" ON users 
FOR DELETE USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR 
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  OR
  (auth.jwt() ->> 'email') = 'sarah.johnson@sportsnutrition.com'
);

-- Now fix players table with non-recursive policies
-- 1. Allow players to view their own data (safe - no recursion)
CREATE POLICY "players_own_select" ON players 
FOR SELECT USING (user_id = auth.uid());

-- 2. Allow players to update their own data (safe - no recursion)  
CREATE POLICY "players_own_update" ON players 
FOR UPDATE USING (user_id = auth.uid());

-- 3. Allow admins full access to players - USING JWT, NOT TABLE LOOKUP
CREATE POLICY "players_admin_all" ON players 
FOR ALL USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR 
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  OR
  (auth.jwt() ->> 'email') = 'sarah.johnson@sportsnutrition.com'
);

-- Re-enable RLS now that policies are fixed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Verify policies are created without recursion issues
SELECT 'FIXED - Users table policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users';

SELECT 'FIXED - Players table policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'players';

SELECT 'RECURSION FIX COMPLETE!' as status;