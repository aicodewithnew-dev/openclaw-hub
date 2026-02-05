-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  soul_md TEXT,
  agents_md TEXT,
  tools_md TEXT,
  other_files JSONB,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_agent_id ON likes(agent_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Anyone can view agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Users can create agents" ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own agents" ON agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own agents" ON agents FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Function to update likes_count
CREATE OR REPLACE FUNCTION update_agent_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agents SET likes_count = likes_count + 1 WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agents SET likes_count = likes_count - 1 WHERE id = OLD.agent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update likes_count
CREATE TRIGGER update_agent_likes_count_trigger
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_agent_likes_count();
