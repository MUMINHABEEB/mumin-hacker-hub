-- Create achievements table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('award', 'certification', 'recognition', 'milestone', 'competition')),
  type TEXT NOT NULL CHECK (type IN ('certificate', 'achievement', 'badge', 'award')),
  date DATE NOT NULL,
  organization TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  video_url TEXT,
  skills TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on category for faster queries
CREATE INDEX idx_achievements_category ON achievements(category);

-- Create an index on type for faster queries (especially for certificates)
CREATE INDEX idx_achievements_type ON achievements(type);

-- Create an index on featured for faster queries
CREATE INDEX idx_achievements_featured ON achievements(featured);

-- Create an index on date for chronological ordering
CREATE INDEX idx_achievements_date ON achievements(date DESC);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_achievements_updated_at 
    BEFORE UPDATE ON achievements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON achievements
    FOR SELECT USING (true);

-- Create policies for authenticated insert/update/delete (for admin)
CREATE POLICY "Enable insert for authenticated users only" ON achievements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON achievements
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON achievements
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample achievements for testing
INSERT INTO achievements (title, description, category, type, date, organization, skills, featured) VALUES
(
    'AWS Certified Solutions Architect',
    'Achieved AWS Solutions Architect certification demonstrating expertise in designing distributed systems on Amazon Web Services.',
    'certification',
    'certificate',
    '2024-01-15',
    'Amazon Web Services',
    ARRAY['Cloud Architecture', 'AWS', 'Distributed Systems', 'Security'],
    true
),
(
    'Cybersecurity Excellence Award',
    'Recognized for outstanding contribution to cybersecurity research and implementation of advanced security protocols.',
    'award',
    'award',
    '2023-11-20',
    'Tech Security Institute',
    ARRAY['Cybersecurity', 'Research', 'Security Protocols', 'Risk Assessment'],
    true
),
(
    'Hackathon Winner - FinTech Innovation',
    'First place winner in the National FinTech Innovation Challenge for developing a blockchain-based payment solution.',
    'competition',
    'achievement',
    '2023-09-10',
    'FinTech Innovation Challenge',
    ARRAY['Blockchain', 'FinTech', 'Smart Contracts', 'Payment Systems'],
    true
);