-- COMPREHENSIVE FIX FOR PLAYER CREATION RLS ISSUE
-- This fixes the "new row violates row-level security policy for table 'users'" error

-- Step 1: Identify the current issue
SELECT 'DIAGNOSING RLS ISSUE...' as step;

-- Check current user context
SELECT 'Current user:' as info, 
       auth.uid() as user_id,
       (SELECT email FROM users WHERE id = auth.uid()) as email,
       (SELECT role FROM users WHERE id = auth.uid()) as role,
       (SELECT organization FROM users WHERE id = auth.uid()) as organization;

-- Step 2: Remove problematic policies and create proper ones
SELECT 'FIXING USERS TABLE POLICIES...' as step;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Admins can create users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_insert_admin" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;

-- Create simplified, working policies
-- 1. Allow users to view their own profile
CREATE POLICY "allow_own_select" ON users 
FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own profile
CREATE POLICY "allow_own_update" ON users 
FOR UPDATE USING (auth.uid() = id);

-- 3. Allow authenticated admins to view all users (needed for player management)
CREATE POLICY "allow_admin_select" ON users 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
);

-- 4. Allow authenticated admins to insert new users (THIS IS KEY FOR PLAYER CREATION)
CREATE POLICY "allow_admin_insert" ON users 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
);

-- 5. Allow authenticated admins to update any user
CREATE POLICY "allow_admin_update" ON users 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
);

-- 6. Allow authenticated admins to delete users
CREATE POLICY "allow_admin_delete" ON users 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
);

-- Step 3: Fix players table policies
SELECT 'FIXING PLAYERS TABLE POLICIES...' as step;

-- Drop existing policies on players table
DROP POLICY IF EXISTS "Enable read access for all users" ON players;
DROP POLICY IF EXISTS "Admins can manage all players" ON players;
DROP POLICY IF EXISTS "Players can view own data" ON players;
DROP POLICY IF EXISTS "players_select_own" ON players;
DROP POLICY IF EXISTS "players_select_admin" ON players;
DROP POLICY IF EXISTS "players_update_own" ON players;
DROP POLICY IF EXISTS "players_all_admin" ON players;

-- Create simplified players policies
-- 1. Allow players to view their own data
CREATE POLICY "allow_player_own_select" ON players 
FOR SELECT USING (user_id = auth.uid());

-- 2. Allow players to update their own data  
CREATE POLICY "allow_player_own_update" ON players 
FOR UPDATE USING (user_id = auth.uid());

-- 3. Allow admins full access to players
CREATE POLICY "allow_admin_all_players" ON players 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
  )
);

-- Step 4: Ensure RLS is properly enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the fix
SELECT 'VERIFICATION - New policies on users table:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users' ORDER BY cmd, policyname;

SELECT 'VERIFICATION - New policies on players table:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'players' ORDER BY cmd, policyname;

-- Step 6: Test permissions
SELECT 'VERIFICATION - Current permissions:' as info;
SELECT 
  has_table_privilege('users', 'SELECT') as users_select,
  has_table_privilege('users', 'INSERT') as users_insert,
  has_table_privilege('users', 'UPDATE') as users_update,
  has_table_privilege('players', 'SELECT') as players_select,
  has_table_privilege('players', 'INSERT') as players_insert,
  has_table_privilege('players', 'UPDATE') as players_update;

SELECT 'RLS FIX COMPLETE!' as status;