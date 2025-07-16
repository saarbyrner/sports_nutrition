-- Comprehensive fix for RLS policy infinite recursion issues
-- Run this in your Supabase SQL Editor

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view users in their organization" ON users;
DROP POLICY IF EXISTS "Users can view players in their organization" ON players;
DROP POLICY IF EXISTS "Users can view meal plans in their organization" ON meal_plans;

-- Temporarily disable RLS to allow operations during development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for development
-- These policies allow all authenticated users to access data
-- In production, you would make these more restrictive

-- Enable RLS but with permissive policies for development
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create simple policies that don't cause recursion
CREATE POLICY "Allow authenticated users to view users" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view players" ON players 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view meal plans" ON meal_plans 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view templates" ON templates 
FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for INSERT operations
CREATE POLICY "Allow authenticated users to insert players" ON players 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert meal plans" ON meal_plans 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert templates" ON templates 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for UPDATE operations
CREATE POLICY "Allow authenticated users to update players" ON players 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update meal plans" ON meal_plans 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update templates" ON templates 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for DELETE operations
CREATE POLICY "Allow authenticated users to delete players" ON players 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete meal plans" ON meal_plans 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete templates" ON templates 
FOR DELETE USING (auth.role() = 'authenticated');

-- Note: These are very permissive policies for development
-- In production, you should implement proper organization-based filtering
-- without creating circular references