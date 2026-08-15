-- AstroVerse AI — Production 3.0 Database Architecture
-- Migration: 20260816000002_production_3_multi_profiles_and_entitlements.sql

-- 1. EXTEND PROFILES
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. ENHANCE BIRTH PROFILES FOR MULTI-PERSON (SELF, PARTNER, FAMILY)
ALTER TABLE public.birth_profiles
  ADD COLUMN IF NOT EXISTS profile_name TEXT DEFAULT 'My Birth Chart',
  ADD COLUMN IF NOT EXISTS relationship TEXT DEFAULT 'self', -- 'self', 'partner', 'mother', 'father', 'child', 'friend'
  ADD COLUMN IF NOT EXISTS birth_time_precision TEXT DEFAULT 'exact', -- 'exact', 'approximate', 'unknown'
  ADD COLUMN IF NOT EXISTS birth_time_known BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS birth_city TEXT,
  ADD COLUMN IF NOT EXISTS birth_state TEXT,
  ADD COLUMN IF NOT EXISTS birth_country TEXT,
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS iana_timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS utc_offset_at_birth DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calendar_type TEXT DEFAULT 'gregorian';

-- Remove unique constraint on user_id if it exists to allow multiple birth profiles per user
ALTER TABLE public.birth_profiles DROP CONSTRAINT IF EXISTS birth_profiles_user_id_key;

CREATE INDEX IF NOT EXISTS idx_birth_profiles_user_rel ON public.birth_profiles(user_id, relationship);

-- 3. SUBSCRIPTIONS & ENTITLEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium', 'pro'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'trialing', 'canceled', 'expired'
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_own" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_own" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. SAVED CHARTS & CALCULATION VERSIONING
ALTER TABLE public.saved_charts
  ADD COLUMN IF NOT EXISTS engine_version TEXT DEFAULT '3.0.0',
  ADD COLUMN IF NOT EXISTS zodiac_system TEXT DEFAULT 'vedic',
  ADD COLUMN IF NOT EXISTS ayanamsa TEXT DEFAULT 'lahiri',
  ADD COLUMN IF NOT EXISTS ephemeris_version TEXT DEFAULT 'moshier-deterministic',
  ADD COLUMN IF NOT EXISTS birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL;
