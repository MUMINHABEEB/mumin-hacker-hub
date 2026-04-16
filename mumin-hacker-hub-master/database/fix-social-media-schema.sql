-- Fix social_media table schema
-- Add missing metrics column and ensure all columns match the TypeScript interface

-- Add metrics column if it doesn't exist
ALTER TABLE social_media 
ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}';

-- Ensure all required columns exist with proper types
ALTER TABLE social_media 
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Update any existing records to have empty metrics if null
UPDATE social_media 
SET metrics = '{}' 
WHERE metrics IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'social_media' 
ORDER BY ordinal_position;

-- Sample data insert to test (optional)
-- INSERT INTO social_media (title, content, platform, url, tags, metrics, published)
-- VALUES (
--   'Test Social Media Post',
--   'This is a test post content.',
--   'linkedin',
--   'https://linkedin.com/posts/test',
--   ARRAY['test', 'social', 'media'],
--   '{"views": 100, "likes": 25, "shares": 5, "comments": 3}',
--   true
-- );