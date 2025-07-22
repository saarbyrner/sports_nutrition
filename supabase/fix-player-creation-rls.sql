-- Fix RLS policies to allow proper player creation
-- This addresses the "new row violates row-level security policy for table 'users'" error

-- Check current user and their role for debugging
SELECT 
  'Current context:' as info,
  auth.uid() as auth_user_id,
  (SELECT role FROM users WHERE id = auth.uid()) as user_role,
  (SELECT organization FROM users WHERE id = auth.uid()) as user_org;

-- Temporarily disable RLS on users table to understand the issue
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Better approach: Fix the RLS policies properly
-- First, drop all existing policies on users table
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Admins can create users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Create new comprehensive policies
-- Policy 1: Users can read their own data
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Admins can read all users in their organization
CREATE POLICY "users_select_admin" ON users  
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
      AND (
        admin_user.organization = users.organization 
        OR admin_user.organization IS NULL 
        OR users.organization IS NULL
      )
    )
  );

-- Policy 3: Users can update their own data
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy 4: Admins can update users in their organization
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
      AND (
        admin_user.organization = users.organization 
        OR admin_user.organization IS NULL
      )
    )
  );

-- Policy 5: Admins can create new users (for player creation)
CREATE POLICY "users_insert_admin" ON users
  FOR INSERT
  WITH CHECK (
    -- Must be an admin to create users
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
    )
    -- And the new user must be in the same organization or null
    AND (
      organization IS NULL
      OR organization IN (
        SELECT organization FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
      )
    )
  );

-- Policy 6: Admins can delete users
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
      AND (
        admin_user.organization = users.organization 
        OR admin_user.organization IS NULL
      )
    )
  );

-- Ensure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Now fix players table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON players;
DROP POLICY IF EXISTS "Admins can manage all players" ON players;
DROP POLICY IF EXISTS "Players can view own data" ON players;

-- Policy 1: Players can view their own data
CREATE POLICY "players_select_own" ON players
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Admins can view all players in their organization
CREATE POLICY "players_select_admin" ON players
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
      AND EXISTS (
        SELECT 1 FROM users player_user
        WHERE player_user.id = players.user_id
        AND (
          admin_user.organization = player_user.organization 
          OR admin_user.organization IS NULL
          OR player_user.organization IS NULL
        )
      )
    )
  );

-- Policy 3: Players can update some of their own data
CREATE POLICY "players_update_own" ON players
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy 4: Admins can manage players in their organization
CREATE POLICY "players_all_admin" ON players
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
      AND EXISTS (
        SELECT 1 FROM users player_user
        WHERE player_user.id = players.user_id
        AND (
          admin_user.organization = player_user.organization 
          OR admin_user.organization IS NULL
          OR player_user.organization IS NULL
        )
      )
    )
  );

-- Ensure RLS is enabled on players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Show final policy status
SELECT 'Final policies on users table:' as info;
SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = 'users' ORDER BY policyname;

SELECT 'Final policies on players table:' as info;
SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = 'players' ORDER BY policyname;

-- Test current user permissions
SELECT 'Current user permissions:' as info;
SELECT 
  has_table_privilege('users', 'SELECT') as can_select_users,
  has_table_privilege('users', 'INSERT') as can_insert_users,
  has_table_privilege('users', 'UPDATE') as can_update_users,
  has_table_privilege('players', 'SELECT') as can_select_players,
  has_table_privilege('players', 'INSERT') as can_insert_players,
  has_table_privilege('players', 'UPDATE') as can_update_players;