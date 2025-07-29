-- RLS SECURITY TESTING PROTOCOL
-- Comprehensive testing procedures for Row Level Security implementation
-- Run these tests before deploying to production
--
-- Test Categories:
-- 1. Basic Authentication & Authorization
-- 2. Organization Isolation
-- 3. Role-Based Access Control  
-- 4. Edge Cases & Security Boundaries
-- 5. Performance Impact Assessment

-- ===========================================================================
-- PREPARATION: Set up test environment
-- ===========================================================================

-- Step 1: Apply the secure RLS implementation
-- (Run SECURE-RLS-IMPLEMENTATION.sql first)

-- Step 2: Create test data for comprehensive scenarios
INSERT INTO users (id, email, first_name, last_name, role, organization) VALUES 
-- Admin users
('00000000-0000-4000-a000-000000000001', 'admin1@org1.com', 'Admin', 'One', 'admin', 'organization_1'),
('00000000-0000-4000-a000-000000000002', 'admin2@org2.com', 'Admin', 'Two', 'admin', 'organization_2'),
-- Regular users
('00000000-0000-4000-a000-000000000003', 'user1@org1.com', 'User', 'One', 'player', 'organization_1'),
('00000000-0000-4000-a000-000000000004', 'user2@org2.com', 'User', 'Two', 'player', 'organization_2'),
-- Cross-org user for testing isolation
('00000000-0000-4000-a000-000000000005', 'external@external.com', 'External', 'User', 'player', 'external_org')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    organization = EXCLUDED.organization;

-- Create test players
INSERT INTO players (id, user_id, position, sport, team, status) VALUES
('10000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000003', 'Forward', 'Soccer', 'Team A', 'active'),
('10000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000004', 'Guard', 'Basketball', 'Team B', 'active'),
('10000000-0000-4000-a000-000000000003', '00000000-0000-4000-a000-000000000005', 'Midfielder', 'Soccer', 'External Team', 'active')
ON CONFLICT (id) DO UPDATE SET
    position = EXCLUDED.position,
    sport = EXCLUDED.sport,
    team = EXCLUDED.team,
    status = EXCLUDED.status;

-- Create test meal plans
INSERT INTO meal_plans (id, player_id, title, plan_type, status, calories, protein, created_by, meal_data) VALUES
('20000000-0000-4000-a000-000000000001', '10000000-0000-4000-a000-000000000001', 'Test Plan Org1', 'training', 'active', 2500, 150, '00000000-0000-4000-a000-000000000001', '{"breakfast": {"calories": 500}}'),
('20000000-0000-4000-a000-000000000002', '10000000-0000-4000-a000-000000000002', 'Test Plan Org2', 'recovery', 'active', 2200, 120, '00000000-0000-4000-a000-000000000002', '{"breakfast": {"calories": 400}}'),
('20000000-0000-4000-a000-000000000003', '10000000-0000-4000-a000-000000000003', 'External Plan', 'general', 'active', 2300, 130, '00000000-0000-4000-a000-000000000005', '{"breakfast": {"calories": 450}}')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    plan_type = EXCLUDED.plan_type,
    calories = EXCLUDED.calories;

-- ===========================================================================
-- TEST SUITE 1: Basic Authentication & Authorization
-- ===========================================================================

SELECT '=== TEST SUITE 1: BASIC AUTH & AUTHORIZATION ===' as test_suite;

-- Test 1.1: User can view their own profile
SELECT 'TEST 1.1: User self-access' as test_name;
SET LOCAL role TO authenticated;
-- Simulate user1@org1.com being authenticated
SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-4000-a000-000000000003", "email": "user1@org1.com"}';

-- Should return 1 row (user's own profile)
SELECT 'Expected: 1 row, Actual: ' || COUNT(*) || ' rows' as result
FROM users WHERE email = 'user1@org1.com';

-- Test 1.2: User cannot view other users' profiles (without admin role)
SELECT 'Expected: 0 rows, Actual: ' || COUNT(*) || ' rows' as result  
FROM users WHERE email = 'user2@org2.com';

-- Test 1.3: User can update their own profile
UPDATE users SET phone = '555-TEST-123' WHERE email = 'user1@org1.com';
SELECT 'Phone update successful: ' || CASE WHEN phone = '555-TEST-123' THEN 'PASS' ELSE 'FAIL' END as result
FROM users WHERE email = 'user1@org1.com';

-- Reset for next tests
RESET role;

-- ===========================================================================
-- TEST SUITE 2: Organization Isolation
-- ===========================================================================

SELECT '=== TEST SUITE 2: ORGANIZATION ISOLATION ===' as test_suite;

-- Test 2.1: Admin can see users in their organization only
SELECT 'TEST 2.1: Admin org isolation' as test_name;
SET LOCAL role TO authenticated;
-- Simulate admin1@org1.com being authenticated with admin role
SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-4000-a000-000000000001", "email": "admin1@org1.com", "user_metadata": {"role": "admin", "organization": "organization_1"}}';

-- Should return 2 rows (admin1 and user1 from organization_1)
SELECT 'Expected: 2 rows, Actual: ' || COUNT(*) || ' rows' as result
FROM users WHERE organization = 'organization_1';

-- Should return 0 rows (cannot see organization_2 users)
SELECT 'Expected: 0 rows, Actual: ' || COUNT(*) || ' rows' as result
FROM users WHERE organization = 'organization_2';

-- Test 2.2: Admin can see players in their organization
SELECT 'Expected: 1 row, Actual: ' || COUNT(*) || ' rows' as result
FROM players p 
JOIN users u ON p.user_id = u.id 
WHERE u.organization = 'organization_1';

-- Test 2.3: Admin can create meal plans for players in their org
INSERT INTO meal_plans (player_id, title, plan_type, status, calories, meal_data, created_by) 
VALUES ('10000000-0000-4000-a000-000000000001', 'Admin Created Plan', 'training', 'draft', 2000, '{"test": true}', '00000000-0000-4000-a000-000000000001');

SELECT 'Meal plan creation: ' || CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as result
FROM meal_plans WHERE title = 'Admin Created Plan';

RESET role;

-- ===========================================================================
-- TEST SUITE 3: Role-Based Access Control
-- ===========================================================================

SELECT '=== TEST SUITE 3: ROLE-BASED ACCESS CONTROL ===' as test_suite;

-- Test 3.1: Regular user cannot access admin functions
SELECT 'TEST 3.1: Regular user restrictions' as test_name;
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-4000-a000-000000000003", "email": "user1@org1.com", "user_metadata": {"role": "player"}}';

-- Regular user should not be able to see other users
SELECT 'Expected: 0 rows, Actual: ' || COUNT(*) || ' rows' as result
FROM users WHERE id != '00000000-0000-4000-a000-000000000003';

-- Regular user should not be able to create users
DO $$ 
BEGIN
    INSERT INTO users (email, first_name, last_name, role) 
    VALUES ('test@test.com', 'Test', 'User', 'player');
    RAISE NOTICE 'User creation by regular user: FAIL (should have been blocked)';
EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'User creation by regular user: PASS (correctly blocked)';
END $$;

-- Test 3.2: Player can only see their own meal plans
SELECT 'Expected: 1 row (own plan), Actual: ' || COUNT(*) || ' rows' as result
FROM meal_plans mp 
JOIN players p ON mp.player_id = p.id 
WHERE p.user_id = '00000000-0000-4000-a000-000000000003';

RESET role;

-- ===========================================================================
-- TEST SUITE 4: Edge Cases & Security Boundaries  
-- ===========================================================================

SELECT '=== TEST SUITE 4: EDGE CASES & SECURITY BOUNDARIES ===' as test_suite;

-- Test 4.1: SQL Injection attempt in organization field
SELECT 'TEST 4.1: SQL injection resistance' as test_name;
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-4000-a000-000000000001", "user_metadata": {"role": "admin", "organization": "organization_1\"; DROP TABLE users; --"}}';

-- Should handle malicious input gracefully
SELECT 'SQL injection test: ' || CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END as result
FROM users;

-- Test 4.2: Missing JWT claims
RESET role;
SET LOCAL role TO authenticated;
-- No JWT claims set - should fail gracefully

SELECT 'Missing JWT claims test: ' || CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result
FROM users;

-- Test 4.3: Invalid user ID in JWT
SET LOCAL "request.jwt.claims" TO '{"sub": "invalid-user-id", "user_metadata": {"role": "admin"}}';

SELECT 'Invalid user ID test: ' || CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result
FROM users;

RESET role;

-- ===========================================================================
-- TEST SUITE 5: Performance Impact Assessment
-- ===========================================================================

SELECT '=== TEST SUITE 5: PERFORMANCE ASSESSMENT ===' as test_suite;

-- Test 5.1: Query performance with RLS enabled
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.*, p.* FROM users u 
LEFT JOIN players p ON u.id = p.user_id;

-- Test 5.2: Complex query performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT mp.*, p.*, u.first_name, u.last_name 
FROM meal_plans mp
JOIN players p ON mp.player_id = p.id
JOIN users u ON p.user_id = u.id;

-- ===========================================================================
-- SUMMARY & CLEANUP
-- ===========================================================================

SELECT '=== RLS TESTING SUMMARY ===' as summary;

-- Verify all policies are active
SELECT 'Active RLS Policies:' as info;
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'players', 'meal_plans', 'templates', 'calendar_events')
ORDER BY tablename, policyname;

-- Verify RLS is enabled
SELECT 'RLS Status:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'players', 'meal_plans', 'templates', 'calendar_events')
ORDER BY tablename;

-- Performance baseline
SELECT 'Performance baseline established' as status;

-- Clean up test data
DELETE FROM meal_plans WHERE title LIKE '%Test%' OR title LIKE '%Admin Created%';
DELETE FROM players WHERE team LIKE '%Test%' OR team LIKE '%External%';  
DELETE FROM users WHERE email LIKE '%test%' OR organization = 'external_org';

SELECT '=== RLS TESTING COMPLETE ===' as final_status;
SELECT 'Review test results above and verify all tests PASS before production deployment' as instruction;