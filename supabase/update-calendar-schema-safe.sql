-- Safe Calendar Schema Update
-- Run this AFTER setup-admin-user.sql

-- First, let's see what we're working with
SELECT 'Current calendar_events structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;

-- Check if we have any existing events
SELECT 'Existing events count:' as info, COUNT(*) as count FROM calendar_events;

-- Update event_type enum safely
DO $$
BEGIN
    -- Create new enum type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type_new') THEN
        CREATE TYPE event_type_new AS ENUM ('meal_plan', 'appointment');
    END IF;
    
    -- Add new column with new type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' 
                   AND column_name = 'event_type_new') THEN
        ALTER TABLE calendar_events ADD COLUMN event_type_new event_type_new;
    END IF;
    
    -- Convert old values to new values
    UPDATE calendar_events 
    SET event_type_new = CASE 
        WHEN event_type::text = 'meal' THEN 'meal_plan'::event_type_new
        WHEN event_type::text = 'training' THEN 'appointment'::event_type_new
        WHEN event_type::text = 'meeting' THEN 'appointment'::event_type_new
        WHEN event_type::text = 'competition' THEN 'appointment'::event_type_new
        WHEN event_type::text = 'recovery' THEN 'appointment'::event_type_new
        ELSE 'appointment'::event_type_new
    END
    WHERE event_type_new IS NULL;
    
END $$;

-- Add privacy column
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- Add new attendees column (UUID array)
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS attendees UUID[] DEFAULT '{}';

-- Convert attendee_ids (JSONB) to attendees (UUID[]) safely
DO $$
DECLARE
    event_record RECORD;
    attendee_uuid UUID;
    attendees_array UUID[] := '{}';
BEGIN
    FOR event_record IN 
        SELECT id, attendee_ids 
        FROM calendar_events 
        WHERE attendee_ids IS NOT NULL 
        AND jsonb_typeof(attendee_ids) = 'array'
        AND array_length(attendees, 1) IS NULL -- only if attendees is empty
    LOOP
        attendees_array := '{}'; -- reset array
        
        -- Loop through JSONB array elements
        FOR attendee_uuid IN 
            SELECT (jsonb_array_elements_text(event_record.attendee_ids))::UUID
        LOOP
            attendees_array := array_append(attendees_array, attendee_uuid);
        END LOOP;
        
        -- Update the record
        UPDATE calendar_events 
        SET attendees = attendees_array 
        WHERE id = event_record.id;
    END LOOP;
END $$;

-- Now safely replace the old event_type column
DO $$
BEGIN
    -- Drop old column
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'calendar_events' 
               AND column_name = 'event_type') THEN
        ALTER TABLE calendar_events DROP COLUMN event_type;
    END IF;
    
    -- Rename new column to event_type
    ALTER TABLE calendar_events RENAME COLUMN event_type_new TO event_type;
    
    -- Set default
    ALTER TABLE calendar_events ALTER COLUMN event_type SET DEFAULT 'appointment';
    
    -- Make it NOT NULL if it isn't already
    UPDATE calendar_events SET event_type = 'appointment' WHERE event_type IS NULL;
    ALTER TABLE calendar_events ALTER COLUMN event_type SET NOT NULL;
END $$;

-- Remove old attendee_ids column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'calendar_events' 
               AND column_name = 'attendee_ids') THEN
        ALTER TABLE calendar_events DROP COLUMN attendee_ids;
    END IF;
END $$;

-- Add organization column if it doesn't exist
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS organization TEXT;

-- Update indexes for better performance
DROP INDEX IF EXISTS idx_calendar_events_start_time;
DROP INDEX IF EXISTS idx_calendar_events_organization;
DROP INDEX IF EXISTS idx_calendar_events_event_type;
DROP INDEX IF EXISTS idx_calendar_events_is_private;
DROP INDEX IF EXISTS idx_calendar_events_created_by;
DROP INDEX IF EXISTS idx_calendar_events_attendees;

CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_is_private ON calendar_events(is_private);
CREATE INDEX idx_calendar_events_created_by ON calendar_events(created_by);
CREATE INDEX idx_calendar_events_attendees ON calendar_events USING GIN(attendees);
CREATE INDEX idx_calendar_events_organization ON calendar_events(organization);

-- Clean up old enum type
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type_old') THEN
        DROP TYPE event_type_old;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if type doesn't exist or is still in use
    NULL;
END $$;

-- Update RLS policies for calendar_events
DROP POLICY IF EXISTS "Users can view calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can insert calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete calendar events" ON calendar_events;

-- Allow users to view events (public events visible to all, private events only to attendees/creator)
CREATE POLICY "Users can view calendar events" ON calendar_events FOR SELECT USING (
    -- Public events visible to all users in same organization
    (is_private = FALSE AND (organization IS NULL OR organization = (SELECT organization FROM users WHERE id = auth.uid())))
    OR
    -- Private events visible to creator and attendees
    (is_private = TRUE AND (
        created_by = auth.uid() 
        OR auth.uid() = ANY(attendees)
    ))
);

-- Allow authenticated users to create events
CREATE POLICY "Users can insert calendar events" ON calendar_events FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

-- Allow users to update their own events
CREATE POLICY "Users can update calendar events" ON calendar_events FOR UPDATE USING (
    created_by = auth.uid()
) WITH CHECK (
    created_by = auth.uid()
);

-- Allow users to delete their own events
CREATE POLICY "Users can delete calendar events" ON calendar_events FOR DELETE USING (
    created_by = auth.uid()
);

-- Verify the updates
SELECT 'Schema update complete!' as status;
SELECT 'Available event types:' as info, unnest(enum_range(NULL::event_type)) as type;
SELECT 'Updated calendar columns:' as info, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;