-- AstroVerse AI — Tarot Readings Table + RLS Policies for ALL user tables
-- Migration: 20260816000000_tarot_and_rls.sql

-- ============================================================
-- 1. TAROT READINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tarot_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  spread_id TEXT NOT NULL,
  question TEXT,
  drawn_cards JSONB NOT NULL,
  cosmic_context TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tarot_readings_user_id ON public.tarot_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_created_at ON public.tarot_readings(created_at DESC);

-- ============================================================
-- 2. BIRTH PROFILES TABLE (for onboarding)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.birth_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME WITHOUT TIME ZONE,
  birth_place TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone_id TEXT DEFAULT 'UTC',
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_birth_profiles_user_id ON public.birth_profiles(user_id);

-- ============================================================
-- 3. ROW LEVEL SECURITY — Enable on ALL user-owned tables
-- ============================================================

-- users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_own" ON public.settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "settings_insert_own" ON public.settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "settings_update_own" ON public.settings
  FOR UPDATE USING (auth.uid() = user_id);

-- birth_details table
ALTER TABLE public.birth_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "birth_details_select_own" ON public.birth_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "birth_details_insert_own" ON public.birth_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "birth_details_update_own" ON public.birth_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "birth_details_delete_own" ON public.birth_details
  FOR DELETE USING (auth.uid() = user_id);

-- saved_charts table
ALTER TABLE public.saved_charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_charts_select_own" ON public.saved_charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_charts_insert_own" ON public.saved_charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_charts_delete_own" ON public.saved_charts
  FOR DELETE USING (auth.uid() = user_id);

-- predictions table (sign-level predictions are public, user-level are private)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "predictions_select_public" ON public.predictions
  FOR SELECT USING (target_type = 'sign');

CREATE POLICY "predictions_select_own" ON public.predictions
  FOR SELECT USING (target_type = 'user' AND auth.uid()::text = target_value);

-- reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- tarot_readings table
ALTER TABLE public.tarot_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tarot_readings_select_own" ON public.tarot_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tarot_readings_insert_own" ON public.tarot_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tarot_readings_delete_own" ON public.tarot_readings
  FOR DELETE USING (auth.uid() = user_id);

-- birth_profiles table
ALTER TABLE public.birth_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "birth_profiles_select_own" ON public.birth_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "birth_profiles_insert_own" ON public.birth_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "birth_profiles_update_own" ON public.birth_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- blogs table is public-read
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blogs_select_public" ON public.blogs
  FOR SELECT USING (true);
