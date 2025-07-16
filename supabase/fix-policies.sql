-- Fix RLS policies to avoid infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view users in their organization" ON users;
DROP POLICY IF EXISTS "Users can view players in their organization" ON players;
DROP POLICY IF EXISTS "Users can view meal plans in their organization" ON meal_plans;

-- Temporarily disable RLS for debugging
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs DISABLE ROW LEVEL SECURITY;

-- For development, we'll create simpler policies later
-- This allows the app to work while we debug the policy structure