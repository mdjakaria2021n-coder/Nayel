-- Supabase Schema for Bijoy Classic Typing Tutor

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_practice_time INT DEFAULT 0,
  average_wpm NUMERIC(5, 2) DEFAULT 0,
  average_accuracy NUMERIC(5, 2) DEFAULT 0
);

-- Lessons Table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  lesson_index INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Exam')),
  content_keys TEXT NOT NULL, -- The english physical keys sequence target
  content_bangla TEXT NOT NULL, -- The rendered bangla text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  highest_wpm NUMERIC(5, 2) DEFAULT 0,
  highest_accuracy NUMERIC(5, 2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Test Results Table (For Skill Tests & Daily Tracking)
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_type TEXT CHECK (test_type IN ('Lesson', 'Word Drill', 'Sentence Drill', 'Skill Test', 'Review')),
  lesson_id INT REFERENCES lessons(id) ON DELETE SET NULL,
  wpm NUMERIC(5, 2) NOT NULL,
  cpm NUMERIC(5, 2) NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  error_keys JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"j": 3, "k": 1}
  duration_seconds INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lessons are viewable by everyone." ON lessons FOR SELECT USING (true);

CREATE POLICY "Users can manage their own progress." ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own test results." ON test_results FOR ALL USING (auth.uid() = user_id);
