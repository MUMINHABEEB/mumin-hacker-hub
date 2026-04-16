-- URGENT: Fix for Social Media Table Schema
-- Run this SQL in your Supabase Dashboard → Database → SQL Editor

-- Step 1: Add the missing metrics column (JSONB type for structured data)
ALTER TABLE social_media 
ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}';

-- Step 2: Add missing url column if it doesn't exist
ALTER TABLE social_media 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Step 3: Add missing published column if it doesn't exist  
ALTER TABLE social_media 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Step 4: Update any existing records to have proper default values
UPDATE social_media 
SET metrics = '{}' 
WHERE metrics IS NULL;

UPDATE social_media 
SET published = false 
WHERE published IS NULL;

-- Step 5: Verify the table structure (optional check)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'social_media' 
ORDER BY ordinal_position;

-- Expected columns after fix:
-- id (uuid), title (text), content (text), platform (text), 
-- url (text), tags (text[]), metrics (jsonb), published (boolean), 
-- created_at (timestamp), updated_at (timestamp)