-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'dietitian', 'coach', 'player');
CREATE TYPE player_status AS ENUM ('active', 'inactive', 'injured', 'suspended');
CREATE TYPE meal_plan_status AS ENUM ('active', 'draft', 'completed', 'archived');
CREATE TYPE event_type AS ENUM ('training', 'meal', 'competition', 'recovery', 'meeting');

-- Users table (includes staff and players)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    organization TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table (extends users for player-specific data)
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    position TEXT,
    sport TEXT,
    team TEXT,
    squad TEXT,
    jersey_number INTEGER,
    status player_status DEFAULT 'active',
    compliance_rate INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    allergies TEXT,
    dietary_restrictions TEXT,
    medical_conditions TEXT,
    emergency_contact JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    plan_type TEXT, -- 'recovery', 'competition', 'training', 'general'
    status meal_plan_status DEFAULT 'draft',
    calories INTEGER,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fat DECIMAL(6,2),
    fiber DECIMAL(6,2),
    duration_days INTEGER,
    start_date DATE,
    end_date DATE,
    ai_confidence INTEGER,
    meal_data JSONB NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    calories INTEGER,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fat DECIMAL(6,2),
    fiber DECIMAL(6,2),
    meal_plan JSONB NOT NULL DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    times_used INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    attendees UUID[] DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT DEFAULT 'direct', -- 'direct', 'group'
    name TEXT,
    participants UUID[] NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    read_by UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics/Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'active',
    metrics JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    is_custom BOOLEAN DEFAULT false,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance tracking
CREATE TABLE compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    meals_completed INTEGER DEFAULT 0,
    meals_total INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization);
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_team ON players(team);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_tags ON players USING GIN(tags);
CREATE INDEX idx_meal_plans_player_id ON meal_plans(player_id);
CREATE INDEX idx_meal_plans_status ON meal_plans(status);
CREATE INDEX idx_meal_plans_created_by ON meal_plans(created_by);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_organization ON templates(organization);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_organization ON calendar_events(organization);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_compliance_logs_player_id ON compliance_logs(player_id);
CREATE INDEX idx_compliance_logs_log_date ON compliance_logs(log_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be refined based on business rules)
CREATE POLICY "Users can view users in their organization" ON users FOR SELECT USING (
    organization = (SELECT organization FROM users WHERE id = auth.uid())
);

CREATE POLICY "Users can view players in their organization" ON players FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.organization = (
            SELECT u.organization FROM users u 
            JOIN players p ON u.id = p.user_id 
            WHERE p.id = players.id
        )
    )
);

-- Similar policies for other tables (simplified for now)
CREATE POLICY "Users can view meal plans in their organization" ON meal_plans FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u
        JOIN players p ON u.id = p.user_id
        WHERE p.id = meal_plans.player_id
        AND u.organization = (SELECT organization FROM users WHERE id = auth.uid())
    )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('meal-images', 'meal-images', true),
    ('organization-assets', 'organization-assets', true),
    ('reports', 'reports', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Meal images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'meal-images');
CREATE POLICY "Organization assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'organization-assets');