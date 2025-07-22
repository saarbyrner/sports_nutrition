-- Check RLS policies on users table
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Check if RLS is enabled on users table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Check current user context
SELECT 
  current_user as current_db_user,
  auth.uid() as auth_user_id,
  auth.jwt() ->> 'role' as jwt_role;

-- Check if the current user can insert into users table
-- This will help us understand what's failing
SELECT 
  has_table_privilege('users', 'INSERT') as can_insert_users,
  has_table_privilege('players', 'INSERT') as can_insert_players;