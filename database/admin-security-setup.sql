-- Admin Authentication Setup for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security on all existing tables if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with proper authentication
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON projects;

DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON blog_posts;

DROP POLICY IF EXISTS "Enable read access for all users" ON social_media;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON social_media;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON social_media;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON social_media;

DROP POLICY IF EXISTS "Enable read access for all users" ON achievements;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON achievements;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON achievements;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON achievements;

-- Create secure policies for PROJECTS table
CREATE POLICY "Public read access for projects" ON projects
    FOR SELECT USING (published = true);

CREATE POLICY "Admin read access for all projects" ON projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access for projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for projects" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for projects" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create secure policies for BLOG_POSTS table
CREATE POLICY "Public read access for published blogs" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Admin read access for all blogs" ON blog_posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access for blogs" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for blogs" ON blog_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for blogs" ON blog_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create secure policies for SOCIAL_MEDIA table
CREATE POLICY "Public read access for published social media" ON social_media
    FOR SELECT USING (published = true);

CREATE POLICY "Admin read access for all social media" ON social_media
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access for social media" ON social_media
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for social media" ON social_media
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for social media" ON social_media
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create secure policies for ACHIEVEMENTS table
CREATE POLICY "Public read access for achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Admin insert access for achievements" ON achievements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for achievements" ON achievements
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for achievements" ON achievements
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create an admin user check function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user is authenticated
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

-- Create a view for admin statistics (optional)
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
  'projects' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE published = true) as published_count
FROM projects
UNION ALL
SELECT 
  'blog_posts' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE published = true) as published_count
FROM blog_posts
UNION ALL
SELECT 
  'social_media' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE published = true) as published_count
FROM social_media
UNION ALL
SELECT 
  'achievements' as table_name,
  COUNT(*) as total_count,
  COUNT(*) as published_count  -- All achievements are public
FROM achievements;

-- Grant access to the admin stats view for authenticated users only
GRANT SELECT ON admin_stats TO authenticated;

-- Create RLS policy for the admin stats view
ALTER VIEW admin_stats OWNER TO postgres;

-- Enable realtime for authenticated users (optional - for live updates)
ALTER publication supabase_realtime ADD TABLE projects;
ALTER publication supabase_realtime ADD TABLE blog_posts;
ALTER publication supabase_realtime ADD TABLE social_media;
ALTER publication supabase_realtime ADD TABLE achievements;