-- Seed data for sports nutrition app
-- This data matches the structure from your prototype

-- Insert sample users (staff)
INSERT INTO users (id, email, first_name, last_name, role, organization, phone) VALUES
    ('11111111-1111-1111-1111-111111111111', 'sarah.johnson@sportsnutrition.com', 'Sarah', 'Johnson', 'admin', 'Elite Sports Academy', '+1-555-0101'),
    ('22222222-2222-2222-2222-222222222222', 'mike.chen@sportsnutrition.com', 'Mike', 'Chen', 'dietitian', 'Elite Sports Academy', '+1-555-0102'),
    ('33333333-3333-3333-3333-333333333333', 'lisa.rodriguez@sportsnutrition.com', 'Lisa', 'Rodriguez', 'coach', 'Elite Sports Academy', '+1-555-0103');

-- Insert sample player users
INSERT INTO users (id, email, first_name, last_name, role, organization, phone) VALUES
    ('44444444-4444-4444-4444-444444444444', 'alex.thompson@players.com', 'Alex', 'Thompson', 'player', 'Elite Sports Academy', '+1-555-0201'),
    ('55555555-5555-5555-5555-555555555555', 'emma.davis@players.com', 'Emma', 'Davis', 'player', 'Elite Sports Academy', '+1-555-0202'),
    ('66666666-6666-6666-6666-666666666666', 'james.wilson@players.com', 'James', 'Wilson', 'player', 'Elite Sports Academy', '+1-555-0203'),
    ('77777777-7777-7777-7777-777777777777', 'sophia.brown@players.com', 'Sophia', 'Brown', 'player', 'Elite Sports Academy', '+1-555-0204'),
    ('88888888-8888-8888-8888-888888888888', 'michael.jones@players.com', 'Michael', 'Jones', 'player', 'Elite Sports Academy', '+1-555-0205'),
    ('99999999-9999-9999-9999-999999999999', 'olivia.garcia@players.com', 'Olivia', 'Garcia', 'player', 'Elite Sports Academy', '+1-555-0206');

-- Insert sample players data
INSERT INTO players (id, user_id, date_of_birth, gender, height, weight, position, sport, team, squad, jersey_number, status, compliance_rate, tags, allergies, dietary_restrictions) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '2000-03-15', 'Male', 185.0, 78.5, 'Forward', 'Soccer', 'Elite FC', 'First Team', 9, 'active', 92, '{"high-performer", "experienced"}', 'None', 'None'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', '1999-07-22', 'Female', 168.0, 58.2, 'Midfielder', 'Soccer', 'Elite FC', 'First Team', 14, 'active', 88, '{"team-captain", "consistent"}', 'Nuts', 'Vegetarian'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', '2001-11-08', 'Male', 190.0, 85.3, 'Defender', 'Soccer', 'Elite FC', 'First Team', 5, 'active', 85, '{"reliable", "strong"}', 'None', 'None'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '2000-12-03', 'Female', 170.0, 60.1, 'Goalkeeper', 'Soccer', 'Elite FC', 'First Team', 1, 'active', 95, '{"leader", "focused"}', 'Dairy', 'Lactose-free'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '88888888-8888-8888-8888-888888888888', '1998-05-17', 'Male', 175.0, 72.4, 'Midfielder', 'Soccer', 'Elite FC', 'Reserve Team', 8, 'active', 78, '{"developing", "potential"}', 'None', 'None'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '99999999-9999-9999-9999-999999999999', '2002-01-25', 'Female', 165.0, 55.8, 'Forward', 'Soccer', 'Elite FC', 'Reserve Team', 11, 'active', 82, '{"young-talent", "promising"}', 'Shellfish', 'None');

-- Insert sample meal plans
INSERT INTO meal_plans (id, player_id, title, description, plan_type, status, calories, protein, carbs, fat, fiber, duration_days, start_date, ai_confidence, created_by) VALUES
    ('a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pre-Competition Nutrition', 'High-carb plan for match preparation', 'competition', 'active', 2800, 120.5, 420.0, 85.2, 35.8, 3, '2024-01-15', 95, '22222222-2222-2222-2222-222222222222'),
    ('b2b2b2b2-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Recovery Nutrition Plan', 'Post-training recovery focused meal plan', 'recovery', 'active', 2400, 110.0, 300.0, 75.0, 30.0, 7, '2024-01-10', 88, '22222222-2222-2222-2222-222222222222'),
    ('c3c3c3c3-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Strength Building Plan', 'Protein-rich plan for muscle development', 'training', 'draft', 3200, 150.0, 350.0, 110.0, 40.0, 14, '2024-01-20', 92, '22222222-2222-2222-2222-222222222222');

-- Insert sample templates
INSERT INTO templates (id, name, category, description, calories, protein, carbs, fat, fiber, times_used, created_by, organization) VALUES
    ('d1d1d1d1-1d1d-1d1d-1d1d-1d1d1d1d1d1d', 'High-Carb Loading', 'Competition', 'Standard carb loading template for pre-competition', 2800, 120, 420, 85, 35, 15, '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy'),
    ('e2e2e2e2-2e2e-2e2e-2e2e-2e2e2e2e2e2e', 'Recovery Protocol', 'Recovery', 'Post-training recovery nutrition template', 2400, 110, 300, 75, 30, 23, '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy'),
    ('f3f3f3f3-3f3f-3f3f-3f3f-3f3f3f3f3f3f', 'Strength & Power', 'Training', 'Muscle building focused nutrition template', 3200, 150, 350, 110, 40, 8, '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy');

-- Insert sample calendar events
INSERT INTO calendar_events (id, title, description, event_type, start_time, end_time, location, attendees, created_by, organization) VALUES
    ('g1g1g1g1-1g1g-1g1g-1g1g-1g1g1g1g1g1g', 'Team Training Session', 'Morning training with full squad', 'training', '2024-01-20 09:00:00+00', '2024-01-20 11:00:00+00', 'Training Ground A', '{"44444444-4444-4444-4444-444444444444", "55555555-5555-5555-5555-555555555555"}', '33333333-3333-3333-3333-333333333333', 'Elite Sports Academy'),
    ('h2h2h2h2-2h2h-2h2h-2h2h-2h2h2h2h2h2h', 'Nutrition Workshop', 'Weekly nutrition education session', 'meeting', '2024-01-22 14:00:00+00', '2024-01-22 15:30:00+00', 'Conference Room', '{"44444444-4444-4444-4444-444444444444", "55555555-5555-5555-5555-555555555555", "66666666-6666-6666-6666-666666666666"}', '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy'),
    ('i3i3i3i3-3i3i-3i3i-3i3i-3i3i3i3i3i3i', 'Match Day', 'Important league match', 'competition', '2024-01-25 15:00:00+00', '2024-01-25 17:00:00+00', 'Stadium', '{"44444444-4444-4444-4444-444444444444", "55555555-5555-5555-5555-555555555555", "66666666-6666-6666-6666-666666666666", "77777777-7777-7777-7777-777777777777"}', '33333333-3333-3333-3333-333333333333', 'Elite Sports Academy');

-- Insert sample reports
INSERT INTO reports (id, title, description, category, status, created_by, organization) VALUES
    ('j1j1j1j1-1j1j-1j1j-1j1j-1j1j1j1j1j1j', 'Monthly Compliance Report', 'Player compliance rates for January', 'compliance', 'active', '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy'),
    ('k2k2k2k2-2k2k-2k2k-2k2k-2k2k2k2k2k2k', 'Performance Analytics', 'Nutrition impact on performance metrics', 'performance', 'active', '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy'),
    ('l3l3l3l3-3l3l-3l3l-3l3l-3l3l3l3l3l3l', 'Team Overview', 'Overall team nutrition status', 'overview', 'active', '22222222-2222-2222-2222-222222222222', 'Elite Sports Academy');

-- Insert sample compliance logs
INSERT INTO compliance_logs (id, player_id, meal_plan_id, log_date, meals_completed, meals_total) VALUES
    ('m1m1m1m1-1m1m-1m1m-1m1m-1m1m1m1m1m1m', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2024-01-15', 5, 6),
    ('n2n2n2n2-2n2n-2n2n-2n2n-2n2n2n2n2n2n', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2024-01-16', 6, 6),
    ('o3o3o3o3-3o3o-3o3o-3o3o-3o3o3o3o3o3o', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2b2b2b2-2b2b-2b2b-2b2b-2b2b2b2b2b2b', '2024-01-15', 4, 5),
    ('p4p4p4p4-4p4p-4p4p-4p4p-4p4p4p4p4p4p', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2b2b2b2-2b2b-2b2b-2b2b-2b2b2b2b2b2b', '2024-01-16', 5, 5);