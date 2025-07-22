-- Debug script to understand player creation RLS issue
-- Run this first to understand the current state

-- 1. Check current authenticated user context
SELECT 'Current User Context:' as debug_info;
SELECT 
    auth.uid() as current_auth_id,
    auth.jwt() ->> 'email' as current_email,
    auth.jwt() ->> 'role' as jwt_role;

-- 2. Check current user data in users table  
SELECT 'Current User Data:' as debug_info;
SELECT 
    id, 
    email, 
    role, 
    organization, 
    first_name, 
    last_name
FROM users 
WHERE id = auth.uid();

-- 3. Check RLS status on tables
SELECT 'RLS Status:' as debug_info;
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'players');

-- 4. Check all current policies on users table
SELECT 'Current Users Policies:' as debug_info;
SELECT 
    policyname, 
    cmd as command, 
    permissive,
    roles,
    qual as using_clause,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 5. Check table permissions
SELECT 'Table Permissions:' as debug_info;
SELECT 
    'users' as table_name,
    has_table_privilege('users', 'SELECT') as can_select,
    has_table_privilege('users', 'INSERT') as can_insert,
    has_table_privilege('users', 'UPDATE') as can_update,
    has_table_privilege('users', 'DELETE') as can_delete
UNION ALL
SELECT 
    'players' as table_name,
    has_table_privilege('players', 'SELECT') as can_select,
    has_table_privilege('players', 'INSERT') as can_insert,
    has_table_privilege('players', 'UPDATE') as can_update,
    has_table_privilege('players', 'DELETE') as can_delete;

-- 6. Test if we can manually create a user (this will help identify the exact issue)
-- Don't actually run this insert, just show what would happen
SELECT 'Test Insert Query (DO NOT RUN):' as debug_info;
/*
INSERT INTO users (email, first_name, last_name, role, organization)
VALUES ('test@example.com', 'Test', 'Player', 'player', 
        (SELECT organization FROM users WHERE id = auth.uid()));
*/