# Supabase Setup Guide

This guide will help you set up Supabase as the backend for your Mumin Hacker Hub website.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `mumin-hacker-hub`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (~2 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public key**
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'web',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  author TEXT DEFAULT 'Mumin Habeeb',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Social media table
CREATE TABLE social_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('linkedin', 'youtube', 'twitter', 'instagram')) NOT NULL,
  url TEXT,
  tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs table
CREATE TABLE error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT CHECK (type IN ('javascript', 'network', 'component', 'cms', 'build')) NOT NULL,
  level TEXT CHECK (level IN ('error', 'warning', 'info')) NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_social_media_platform ON social_media(platform);
CREATE INDEX idx_social_media_published ON social_media(published);
CREATE INDEX idx_error_logs_type ON error_logs(type);
CREATE INDEX idx_error_logs_level ON error_logs(level);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_media_updated_at BEFORE UPDATE ON social_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Public projects read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public blog posts read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public social media read" ON social_media FOR SELECT USING (published = true);

-- Allow public error logging
CREATE POLICY "Public error logging" ON error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public error read" ON error_logs FOR SELECT USING (true);

-- Note: For admin operations, you'll need to authenticate users
-- For now, we'll allow all operations for development
CREATE POLICY "Admin projects" ON projects FOR ALL USING (true);
CREATE POLICY "Admin blog posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Admin social media" ON social_media FOR ALL USING (true);
```

## 5. Insert Sample Data

```sql
-- Insert sample projects
INSERT INTO projects (title, description, technologies, github_url, demo_url, category, featured) VALUES
('IoT Security Scanner', 'A comprehensive security scanning tool for IoT devices with real-time vulnerability detection.', '{"Python", "Flask", "Docker", "Redis"}', 'https://github.com/username/iot-security-scanner', 'https://iot-scanner-demo.com', 'security', true),
('Blockchain Voting System', 'Secure and transparent voting system built on blockchain technology.', '{"Solidity", "React", "Web3", "Truffle"}', 'https://github.com/username/blockchain-voting', 'https://voting-demo.com', 'blockchain', true),
('Phishing Detection Tool', 'ML-powered tool to detect phishing websites and emails in real-time.', '{"Python", "TensorFlow", "React", "FastAPI"}', 'https://github.com/username/phishing-detector', 'https://phishing-demo.com', 'security', false);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, slug, tags, published, author, published_at) VALUES
('Cybersecurity from My Perspective', 'A comprehensive look at modern cybersecurity challenges...', 'Exploring the current landscape of cybersecurity threats and solutions.', 'cybersecurity-from-my-perspective', '{"cybersecurity", "technology", "security"}', true, 'Mumin Habeeb', NOW());

-- Insert sample social media posts
INSERT INTO social_media (title, content, platform, url, tags, published) VALUES
('Cybersecurity Trends 2024', 'Key cybersecurity trends every developer should know...', 'linkedin', 'https://linkedin.com/posts/example', '{"cybersecurity", "trends", "2024"}', true),
('Phishing Detection Demo', 'Check out our new phishing detection tool in action!', 'youtube', 'https://youtube.com/watch?v=example', '{"demo", "phishing", "security"}', true);
```

## 6. Configure Authentication (Optional)

If you want admin authentication:

1. Go to **Authentication** > **Settings**
2. Configure your preferred providers (Email, GitHub, Google, etc.)
3. Set up authentication in your React app using Supabase Auth

## 7. Test Your Setup

1. Update your `.env.local` with your credentials
2. Start your development server: `pnpm dev`
3. The app should now connect to Supabase instead of local files

## Benefits of Using Supabase

✅ **Real-time updates** - Changes sync instantly across all clients
✅ **Scalable database** - PostgreSQL that grows with your needs  
✅ **Built-in authentication** - User management made easy
✅ **RESTful API** - Automatic API generation from your schema
✅ **Real-time subscriptions** - Live data updates
✅ **File storage** - Built-in storage for images and files
✅ **Edge functions** - Serverless functions for custom logic
✅ **Dashboard** - Beautiful admin interface for managing data

## Next Steps

- Set up authentication for admin access
- Add file upload for project images
- Implement real-time features
- Add user comments and interactions
- Set up automated backups