-- ALTERNATIVE SIMPLER FIX - If JWT approach doesn't work
-- This completely removes RLS restrictions for testing, then adds minimal ones

-- Step 1: Completely disable RLS temporarily to fix the app
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "users_own_select" ON users;
DROP POLICY IF EXISTS "users_own_update" ON users;
DROP POLICY IF EXISTS "users_admin_select" ON users;
DROP POLICY IF EXISTS "users_admin_insert" ON users;
DROP POLICY IF EXISTS "users_admin_update" ON users;
DROP POLICY IF EXISTS "users_admin_delete" ON users;
DROP POLICY IF EXISTS "players_own_select" ON players;
DROP POLICY IF EXISTS "players_own_update" ON players;
DROP POLICY IF EXISTS "players_admin_all" ON players;

-- Step 2: Create very permissive policies that will definitely work
-- Allow all authenticated users to do everything (for testing)
CREATE POLICY "allow_authenticated_all" ON users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_authenticated_all" ON players FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Re-enable RLS with permissive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT 'SIMPLE FIX APPLIED - All authenticated users can access everything' as status;
SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('users', 'players');