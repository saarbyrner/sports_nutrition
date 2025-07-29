-- SECURE RLS IMPLEMENTATION FOR MEAL PLANNING SYSTEM
-- This fixes the infinite recursion issue with proper security policies
-- 
-- Strategy: Use JWT claims and auth.uid() to avoid recursive table lookups
-- Security Model: Role-based access with organization isolation

-- ===========================================================================
-- STEP 1: Clean Up Existing State
-- ===========================================================================

-- Disable RLS temporarily while we rebuild
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Clean up users policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'users' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON users';
    END LOOP;
    
    -- Clean up players policies  
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'players' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON players';
    END LOOP;

    -- Clean up meal_plans policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'meal_plans' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON meal_plans';
    END LOOP;

    -- Clean up templates policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'templates' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON templates';
    END LOOP;

    -- Clean up calendar_events policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'calendar_events' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON calendar_events';
    END LOOP;
END $$;

-- ===========================================================================
-- STEP 2: Create Helper Functions (No Recursion Risk)
-- ===========================================================================

-- Function to check if user is admin (uses JWT metadata, not table lookup)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
        OR auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
        OR auth.jwt() ->> 'user_metadata' ->> 'role' = 'dietitian'
        OR auth.jwt() ->> 'app_metadata' ->> 'role' = 'dietitian'
        OR auth.jwt() ->> 'user_metadata' ->> 'role' = 'coach'
        OR auth.jwt() ->> 'app_metadata' ->> 'role' = 'coach';
$$;

-- Function to get user's organization from JWT (no table lookup)
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        auth.jwt() ->> 'user_metadata' ->> 'organization',
        auth.jwt() ->> 'app_metadata' ->> 'organization',
        'default_org'  -- Fallback for development
    );
$$;

-- ===========================================================================
-- STEP 3: USERS Table Policies (Secure, No Recursion)
-- ===========================================================================

-- Users can view their own record
CREATE POLICY "users_view_own" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own record  
CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users in their organization
CREATE POLICY "users_admin_view_org" ON users
    FOR SELECT USING (
        is_admin() 
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'  -- Development fallback
        )
    );

-- Admins can create users in their organization
CREATE POLICY "users_admin_create" ON users
    FOR INSERT WITH CHECK (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- Admins can update users in their organization
CREATE POLICY "users_admin_update" ON users
    FOR UPDATE USING (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- Admins can delete users in their organization
CREATE POLICY "users_admin_delete" ON users
    FOR DELETE USING (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- ===========================================================================
-- STEP 4: PLAYERS Table Policies (Secure, No Recursion)
-- ===========================================================================

-- Players can view their own record
CREATE POLICY "players_view_own" ON players
    FOR SELECT USING (user_id = auth.uid());

-- Players can update their own record
CREATE POLICY "players_update_own" ON players
    FOR UPDATE USING (user_id = auth.uid());

-- Admins have full access to players in their organization
-- Safe because we check user_id exists in users table for organization
CREATE POLICY "players_admin_all" ON players
    FOR ALL USING (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = players.user_id 
            AND (
                users.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Admin insert policy for players
CREATE POLICY "players_admin_insert" ON players
    FOR INSERT WITH CHECK (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = players.user_id 
            AND (
                users.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- ===========================================================================
-- STEP 5: MEAL_PLANS Table Policies (Secure, No Recursion)
-- ===========================================================================

-- Players can view their own meal plans
CREATE POLICY "meal_plans_player_view_own" ON meal_plans
    FOR SELECT USING (player_id = auth.uid());

-- Admins can view all meal plans in their organization
CREATE POLICY "meal_plans_admin_view_org" ON meal_plans
    FOR SELECT USING (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM players p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = meal_plans.player_id 
            AND (
                u.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Admins can create meal plans for players in their organization
CREATE POLICY "meal_plans_admin_create" ON meal_plans
    FOR INSERT WITH CHECK (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM players p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = meal_plans.player_id 
            AND (
                u.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Admins can update meal plans in their organization
CREATE POLICY "meal_plans_admin_update" ON meal_plans
    FOR UPDATE USING (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM players p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = meal_plans.player_id 
            AND (
                u.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Admins can delete meal plans in their organization
CREATE POLICY "meal_plans_admin_delete" ON meal_plans
    FOR DELETE USING (
        is_admin()
        AND EXISTS (
            SELECT 1 FROM players p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = meal_plans.player_id 
            AND (
                u.organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- ===========================================================================
-- STEP 6: TEMPLATES Table Policies (Secure, No Recursion)
-- ===========================================================================

-- All authenticated users can view templates in their organization
CREATE POLICY "templates_view_org" ON templates
    FOR SELECT USING (
        organization = get_user_organization()
        OR get_user_organization() = 'default_org'
        OR organization IS NULL  -- Public templates
    );

-- Admins can create templates
CREATE POLICY "templates_admin_create" ON templates
    FOR INSERT WITH CHECK (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- Admins can update templates in their organization
CREATE POLICY "templates_admin_update" ON templates
    FOR UPDATE USING (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- Admins can delete templates in their organization
CREATE POLICY "templates_admin_delete" ON templates
    FOR DELETE USING (
        is_admin()
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- ===========================================================================
-- STEP 7: CALENDAR_EVENTS Table Policies (Secure, No Recursion)
-- ===========================================================================

-- Users can view calendar events they're attending or they created
CREATE POLICY "calendar_view_attendee_or_creator" ON calendar_events
    FOR SELECT USING (
        auth.uid() = created_by
        OR auth.uid() = ANY(attendees)
        OR (
            is_admin()
            AND (
                organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Users can create calendar events
CREATE POLICY "calendar_create_own" ON calendar_events
    FOR INSERT WITH CHECK (
        auth.uid() = created_by
        AND (
            organization = get_user_organization()
            OR get_user_organization() = 'default_org'
        )
    );

-- Users can update events they created
CREATE POLICY "calendar_update_own" ON calendar_events
    FOR UPDATE USING (
        auth.uid() = created_by
        OR (
            is_admin()
            AND (
                organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- Users can delete events they created
CREATE POLICY "calendar_delete_own" ON calendar_events
    FOR DELETE USING (
        auth.uid() = created_by
        OR (
            is_admin()
            AND (
                organization = get_user_organization()
                OR get_user_organization() = 'default_org'
            )
        )
    );

-- ===========================================================================
-- STEP 8: Enable RLS on All Tables
-- ===========================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- STEP 9: Grant Necessary Permissions
-- ===========================================================================

-- Ensure authenticated users can access the tables
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON players TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meal_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON calendar_events TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ===========================================================================
-- STEP 10: Verification Queries
-- ===========================================================================

-- Check that policies were created
SELECT 'SECURITY IMPLEMENTATION COMPLETE!' as status;

SELECT 'Users table policies:' as info;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'users';

SELECT 'Players table policies:' as info;  
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'players';

SELECT 'Meal plans table policies:' as info;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'meal_plans';

SELECT 'Templates table policies:' as info;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'templates';

SELECT 'Calendar events table policies:' as info;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'calendar_events';

-- Verify RLS is enabled
SELECT 'RLS Status:' as info;
SELECT schemaname, tablename, rowsecurity, hasrls 
FROM pg_tables 
WHERE tablename IN ('users', 'players', 'meal_plans', 'templates', 'calendar_events')
ORDER BY tablename;

-- ===========================================================================
-- NOTES FOR PRODUCTION DEPLOYMENT:
-- ===========================================================================
-- 1. Test thoroughly in development environment
-- 2. Update JWT metadata to include proper role and organization
-- 3. Remove 'default_org' fallbacks for production
-- 4. Consider adding audit logging for sensitive operations
-- 5. Regular security reviews of policy effectiveness
-- ===========================================================================