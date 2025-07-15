-- Seed data for sports nutrition app
-- Using uuid_generate_v4() to create valid UUIDs

-- Insert sample users (staff)
INSERT INTO users (email, first_name, last_name, role, organization, phone) VALUES
    ('sarah.johnson@sportsnutrition.com', 'Sarah', 'Johnson', 'admin', 'Elite Sports Academy', '+1-555-0101'),
    ('mike.chen@sportsnutrition.com', 'Mike', 'Chen', 'dietitian', 'Elite Sports Academy', '+1-555-0102'),
    ('lisa.rodriguez@sportsnutrition.com', 'Lisa', 'Rodriguez', 'coach', 'Elite Sports Academy', '+1-555-0103');

-- Insert sample player users
INSERT INTO users (email, first_name, last_name, role, organization, phone) VALUES
    ('alex.thompson@players.com', 'Alex', 'Thompson', 'player', 'Elite Sports Academy', '+1-555-0201'),
    ('emma.davis@players.com', 'Emma', 'Davis', 'player', 'Elite Sports Academy', '+1-555-0202'),
    ('james.wilson@players.com', 'James', 'Wilson', 'player', 'Elite Sports Academy', '+1-555-0203'),
    ('sophia.brown@players.com', 'Sophia', 'Brown', 'player', 'Elite Sports Academy', '+1-555-0204'),
    ('michael.jones@players.com', 'Michael', 'Jones', 'player', 'Elite Sports Academy', '+1-555-0205'),
    ('olivia.garcia@players.com', 'Olivia', 'Garcia', 'player', 'Elite Sports Academy', '+1-555-0206');

-- Insert sample players data (linking to users by email)
INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '2000-03-15'::date,
    'Male',
    185.0,
    78.5,
    'Forward',
    'Soccer',
    'Elite FC',
    'First Team',
    9,
    'active',
    92,
    '{"high-performer", "experienced"}',
    'None',
    'None'
FROM users u WHERE u.email = 'alex.thompson@players.com';

INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '1999-07-22'::date,
    'Female',
    168.0,
    58.2,
    'Midfielder',
    'Soccer',
    'Elite FC',
    'First Team',
    14,
    'active',
    88,
    '{"team-captain", "consistent"}',
    'Nuts',
    'Vegetarian'
FROM users u WHERE u.email = 'emma.davis@players.com';

INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '2001-11-08'::date,
    'Male',
    190.0,
    85.3,
    'Defender',
    'Soccer',
    'Elite FC',
    'First Team',
    5,
    'active',
    85,
    '{"reliable", "strong"}',
    'None',
    'None'
FROM users u WHERE u.email = 'james.wilson@players.com';

INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '2000-12-03'::date,
    'Female',
    170.0,
    60.1,
    'Goalkeeper',
    'Soccer',
    'Elite FC',
    'First Team',
    1,
    'active',
    95,
    '{"leader", "focused"}',
    'Dairy',
    'Lactose-free'
FROM users u WHERE u.email = 'sophia.brown@players.com';

INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '1998-05-17'::date,
    'Male',
    175.0,
    72.4,
    'Midfielder',
    'Soccer',
    'Elite FC',
    'Reserve Team',
    8,
    'active',
    78,
    '{"developing", "potential"}',
    'None',
    'None'
FROM users u WHERE u.email = 'michael.jones@players.com';

INSERT INTO players (user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) 
SELECT 
    u.id,
    '2002-01-25'::date,
    'Female',
    165.0,
    55.8,
    'Forward',
    'Soccer',
    'Elite FC',
    'Reserve Team',
    11,
    'active',
    82,
    '{"young-talent", "promising"}',
    'Shellfish',
    'None'
FROM users u WHERE u.email = 'olivia.garcia@players.com';

-- Insert sample meal plans
INSERT INTO meal_plans (player_id, title, description, plan_type, status, calories, protein, carbs, fat, fiber, duration_days, start_date, ai_confidence, created_by) 
SELECT 
    p.id,
    'Pre-Competition Nutrition',
    'High-carb plan for match preparation',
    'competition',
    'active',
    2800,
    120.5,
    420.0,
    85.2,
    35.8,
    3,
    '2024-01-15'::date,
    95,
    (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com')
FROM players p 
JOIN users u ON p.user_id = u.id 
WHERE u.email = 'alex.thompson@players.com';

INSERT INTO meal_plans (player_id, title, description, plan_type, status, calories, protein, carbs, fat, fiber, duration_days, start_date, ai_confidence, created_by) 
SELECT 
    p.id,
    'Recovery Nutrition Plan',
    'Post-training recovery focused meal plan',
    'recovery',
    'active',
    2400,
    110.0,
    300.0,
    75.0,
    30.0,
    7,
    '2024-01-10'::date,
    88,
    (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com')
FROM players p 
JOIN users u ON p.user_id = u.id 
WHERE u.email = 'emma.davis@players.com';

-- Insert sample templates
INSERT INTO templates (name, category, description, calories, protein, carbs, fat, fiber, times_used, created_by, organization) VALUES
    ('High-Carb Loading', 'Competition', 'Standard carb loading template for pre-competition', 2800, 120, 420, 85, 35, 15, (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy'),
    ('Recovery Protocol', 'Recovery', 'Post-training recovery nutrition template', 2400, 110, 300, 75, 30, 23, (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy'),
    ('Strength & Power', 'Training', 'Muscle building focused nutrition template', 3200, 150, 350, 110, 40, 8, (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy');

-- Insert sample reports
INSERT INTO reports (title, description, category, status, created_by, organization) VALUES
    ('Monthly Compliance Report', 'Player compliance rates for January', 'compliance', 'active', (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy'),
    ('Performance Analytics', 'Nutrition impact on performance metrics', 'performance', 'active', (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy'),
    ('Team Overview', 'Overall team nutrition status', 'overview', 'active', (SELECT id FROM users WHERE email = 'mike.chen@sportsnutrition.com'), 'Elite Sports Academy');