-- Update Calendar Schema for Clean Implementation
-- Run this AFTER setup-admin-user.sql

-- Update event_type enum to only include needed types
ALTER TYPE event_type RENAME TO event_type_old;
CREATE TYPE event_type AS ENUM ('meal_plan', 'appointment');

-- Update calendar_events table structure
ALTER TABLE calendar_events 
  -- Update event_type column
  ALTER COLUMN event_type DROP DEFAULT,
  ALTER COLUMN event_type TYPE event_type USING 
    CASE 
      WHEN event_type::text = 'meal' THEN 'meal_plan'::event_type
      WHEN event_type::text = 'training' THEN 'appointment'::event_type
      WHEN event_type::text = 'meeting' THEN 'appointment'::event_type
      WHEN event_type::text = 'competition' THEN 'appointment'::event_type
      WHEN event_type::text = 'recovery' THEN 'appointment'::event_type
      ELSE 'appointment'::event_type
    END,
  ALTER COLUMN event_type SET DEFAULT 'appointment',
  
  -- Add privacy column
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE,
  
  -- Rename attendee_ids to attendees for consistency
  ADD COLUMN IF NOT EXISTS attendees UUID[] DEFAULT '{}';

-- Copy data from attendee_ids to attendees if attendee_ids exists
-- Convert JSONB array to UUID array
UPDATE calendar_events 
SET attendees = (
  SELECT ARRAY(
    SELECT jsonb_array_elements_text(attendee_ids)::UUID
  )
)
WHERE attendees IS NULL AND attendee_ids IS NOT NULL AND jsonb_typeof(attendee_ids) = 'array';

-- Remove old attendee_ids column if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'calendar_events' 
               AND column_name = 'attendee_ids') THEN
        ALTER TABLE calendar_events DROP COLUMN attendee_ids;
    END IF;
END $$;

-- Drop old enum type
DROP TYPE event_type_old;

-- Update indexes for better performance
DROP INDEX IF EXISTS idx_calendar_events_start_time;
DROP INDEX IF EXISTS idx_calendar_events_organization;

CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_is_private ON calendar_events(is_private);
CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by ON calendar_events(created_by);
CREATE INDEX IF NOT EXISTS idx_calendar_events_attendees ON calendar_events USING GIN(attendees);

-- Create improved RLS policies for calendar_events
DROP POLICY IF EXISTS "Users can view calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can insert calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete calendar events" ON calendar_events;

-- Allow users to view events (public events visible to all, private events only to attendees/creator)
CREATE POLICY "Users can view calendar events" ON calendar_events FOR SELECT USING (
    -- Public events visible to all users in same organization
    (is_private = FALSE AND organization = (SELECT organization FROM users WHERE id = auth.uid()))
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
    AND organization = (SELECT organization FROM users WHERE id = auth.uid())
);

-- Allow users to update their own events
CREATE POLICY "Users can update calendar events" ON calendar_events FOR UPDATE USING (
    created_by = auth.uid()
) WITH CHECK (
    created_by = auth.uid()
    AND organization = (SELECT organization FROM users WHERE id = auth.uid())
);

-- Allow users to delete their own events
CREATE POLICY "Users can delete calendar events" ON calendar_events FOR DELETE USING (
    created_by = auth.uid()
);

-- Verify the updates
SELECT 'Schema update complete!' as status;
SELECT 'Available event types:' as info, unnest(enum_range(NULL::event_type)) as type;
SELECT 'Calendar columns:' as info, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;