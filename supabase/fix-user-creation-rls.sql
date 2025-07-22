-- Fix RLS policies to allow admins to create users for players
-- This script will update the RLS policies on the users table to allow
-- authenticated admins to create player user accounts

-- First, let's check the current RLS status
SELECT 'Current RLS policies on users table:' as status;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'users';

-- Drop existing policies if they're too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Create comprehensive RLS policies for users table
-- 1. Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Allow users to update their own profile  
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 3. Allow admins to create new users (for player creation)
CREATE POLICY "Admins can create users" ON users
  FOR INSERT
  WITH CHECK (
    -- Check if the current user is an admin
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 4. Allow admins to view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 5. Allow admins to update any user
CREATE POLICY "Admins can update any user" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 6. Allow admins to delete users
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Verify the policies were created
SELECT 'Updated RLS policies on users table:' as status;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'users';

-- Also check players table policies
SELECT 'Current RLS policies on players table:' as status;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'players';

-- Make sure admins can manage players
DROP POLICY IF EXISTS "Admins can manage all players" ON players;

CREATE POLICY "Admins can manage all players" ON players
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow players to view their own data
CREATE POLICY "Players can view own data" ON players
  FOR SELECT
  USING (user_id = auth.uid());

SELECT 'Updated RLS policies on players table:' as status;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'players';