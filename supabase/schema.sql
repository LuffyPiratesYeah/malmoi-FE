-- Malmoi Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'admin')),
  is_teacher BOOLEAN NOT NULL DEFAULT false,
  profile_image TEXT,
  verification_status TEXT NOT NULL DEFAULT 'none' CHECK (verification_status IN ('none', 'pending', 'verified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verification codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_codes_email ON email_verification_codes(email);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  tutor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutor_name TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_info TEXT,
  zoom_link TEXT,
  google_docs_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_classes_tutor_id ON classes(tutor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class_id ON schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_student_id ON schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Classes policies
CREATE POLICY "Anyone can view classes" ON classes
  FOR SELECT USING (true);

CREATE POLICY "Teachers can create classes" ON classes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND is_teacher = true
    )
  );

CREATE POLICY "Teachers can update own classes" ON classes
  FOR UPDATE USING (
    tutor_id::text = auth.uid()::text
  );

CREATE POLICY "Teachers can delete own classes" ON classes
  FOR DELETE USING (
    tutor_id::text = auth.uid()::text
  );

-- Schedules policies
CREATE POLICY "Users can view own schedules" ON schedules
  FOR SELECT USING (
    student_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = schedules.class_id
      AND classes.tutor_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Students can create schedules" ON schedules
  FOR INSERT WITH CHECK (
    student_id::text = auth.uid()::text
  );

CREATE POLICY "Users can update own schedules" ON schedules
  FOR UPDATE USING (
    student_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = schedules.class_id
      AND classes.tutor_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own schedules" ON schedules
  FOR DELETE USING (
    student_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = schedules.class_id
      AND classes.tutor_id::text = auth.uid()::text
    )
  );

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
