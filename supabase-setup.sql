-- Unified database schema with Row Level Security (RLS)
-- Run this in Supabase SQL Editor

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS water_samples CASCADE;
DROP TABLE IF EXISTS upload_sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table for user management
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unified upload_sessions table
CREATE TABLE upload_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL, -- User-generated unique session ID
  session_name TEXT NOT NULL,
  description TEXT,
  total_samples INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unified water_samples table
CREATE TABLE water_samples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL, -- Links to upload_sessions.session_id
  sample_id TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  ph DECIMAL(4, 2),
  fe DECIMAL(10, 6),
  mn DECIMAL(10, 6),
  zn DECIMAL(10, 6),
  cu DECIMAL(10, 6),
  cr DECIMAL(10, 6),
  cd DECIMAL(10, 6),
  pb DECIMAL(10, 6),
  arsenic DECIMAL(10, 6),
  hg DECIMAL(10, 6),
  ni DECIMAL(10, 6),
  collection_date TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES upload_sessions(session_id) ON DELETE CASCADE
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_samples ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for upload_sessions table
CREATE POLICY "Users can view own upload sessions" ON upload_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own upload sessions" ON upload_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own upload sessions" ON upload_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own upload sessions" ON upload_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for water_samples table
CREATE POLICY "Users can view own water samples" ON water_samples
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own water samples" ON water_samples
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water samples" ON water_samples
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water samples" ON water_samples
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_water_samples_session_id ON water_samples(session_id);
CREATE INDEX idx_water_samples_user_id ON water_samples(user_id);
CREATE INDEX idx_upload_sessions_session_id ON upload_sessions(session_id);
CREATE INDEX idx_upload_sessions_user_id ON upload_sessions(user_id);
CREATE INDEX idx_upload_sessions_created_at ON upload_sessions(created_at);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Grant necessary permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON upload_sessions TO authenticated;
GRANT ALL ON water_samples TO authenticated;

-- Create a function to update last_accessed timestamp
CREATE OR REPLACE FUNCTION update_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE upload_sessions 
  SET last_accessed = NOW() 
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_accessed when water samples are queried
CREATE TRIGGER update_session_last_accessed
  AFTER INSERT ON water_samples
  FOR EACH ROW
  EXECUTE FUNCTION update_last_accessed();

-- Create function to handle updated_at for profiles
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on profiles
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();