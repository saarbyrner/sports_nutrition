-- Add missing columns to calendar_events table
-- Run this in your Supabase SQL Editor

-- Add the attendee_ids column as a JSON array to store user IDs
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS attendee_ids JSONB DEFAULT '[]'::jsonb;

-- Add the metadata column for additional event data
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_attendee_ids 
ON calendar_events USING GIN (attendee_ids);

CREATE INDEX IF NOT EXISTS idx_calendar_events_metadata 
ON calendar_events USING GIN (metadata);

-- Update column comments for clarity
COMMENT ON COLUMN calendar_events.attendee_ids IS 'Array of user IDs who are attending this event';
COMMENT ON COLUMN calendar_events.metadata IS 'Additional metadata for the event stored as JSON';