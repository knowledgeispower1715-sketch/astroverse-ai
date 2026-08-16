-- AstroVerse AI — Complete Professional SaaS Platform Schema
-- Migration: 20260817000003_complete_saas_platform_schema.sql

-- 1. RECENT LOCATIONS TABLE (Per-User Search History)
CREATE TABLE IF NOT EXISTS public.recent_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id TEXT,
  geoname_id BIGINT,
  place_name TEXT NOT NULL,
  formatted_address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recent_locations_user ON public.recent_locations(user_id, created_at DESC);

ALTER TABLE public.recent_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recent_locations_select_own" ON public.recent_locations;
CREATE POLICY "recent_locations_select_own" ON public.recent_locations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "recent_locations_insert_own" ON public.recent_locations;
CREATE POLICY "recent_locations_insert_own" ON public.recent_locations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "recent_locations_delete_own" ON public.recent_locations;
CREATE POLICY "recent_locations_delete_own" ON public.recent_locations FOR DELETE USING (auth.uid() = user_id);

-- 2. ASTROLOGERS MARKETPLACE
CREATE TABLE IF NOT EXISTS public.astrologers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  experience_years INT DEFAULT 5,
  languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  rating NUMERIC(3,2) DEFAULT 4.90,
  review_count INT DEFAULT 0,
  orders_count INT DEFAULT 0,
  price_per_minute INT DEFAULT 20, -- in cents or local currency units
  is_verified BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT false,
  consultation_modes TEXT[] DEFAULT ARRAY['chat', 'voice'], -- 'chat', 'voice', 'video'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "astrologers_select_public" ON public.astrologers;
CREATE POLICY "astrologers_select_public" ON public.astrologers FOR SELECT USING (true);

-- 3. ASTROLOGER SPECIALTIES
CREATE TABLE IF NOT EXISTS public.astrologer_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id UUID NOT NULL REFERENCES public.astrologers(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL -- 'Vedic', 'Tarot', 'Numerology', 'Vastu', 'Love & Relationships', 'Career & Finance'
);

CREATE INDEX IF NOT EXISTS idx_astrologer_specialties ON public.astrologer_specialties(astrologer_id, specialty);

ALTER TABLE public.astrologer_specialties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "specialties_select_public" ON public.astrologer_specialties;
CREATE POLICY "specialties_select_public" ON public.astrologer_specialties FOR SELECT USING (true);

-- 4. CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  astrologer_id UUID NOT NULL REFERENCES public.astrologers(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('chat', 'voice', 'video')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 15,
  amount_paid INT DEFAULT 0,
  notes TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_user ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_astrologer ON public.consultations(astrologer_id);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "consultations_select_own" ON public.consultations;
CREATE POLICY "consultations_select_own" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "consultations_insert_own" ON public.consultations;
CREATE POLICY "consultations_insert_own" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "consultations_update_own" ON public.consultations;
CREATE POLICY "consultations_update_own" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);

-- 5. MESSAGES (Consultation Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_consultation ON public.messages(consultation_id, created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.consultations c WHERE c.id = messages.consultation_id AND c.user_id = auth.uid())
);
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.consultations c WHERE c.id = messages.consultation_id AND c.user_id = auth.uid())
);

-- 6. PLANS & ENTITLEMENTS
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('free', 'premium', 'pro')),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT DEFAULT 0,
  interval TEXT DEFAULT 'month' CHECK (interval IN ('month', 'year')),
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_select_public" ON public.plans;
CREATE POLICY "plans_select_public" ON public.plans FOR SELECT USING (true);

-- Seed default plans if not exists
INSERT INTO public.plans (code, name, description, price_cents, interval, features)
VALUES 
  ('free', 'Explorer Free', 'Core planetary charts, daily horoscopes, and basic panchang.', 0, 'month', '{"basic_kundli": true, "basic_horoscope": true, "basic_panchang": true, "basic_tarot": true, "basic_numerology": true, "max_profiles": 3}'::jsonb),
  ('premium', 'Cosmic Premium', 'Advanced divisional charts, Dasha analysis, full 78-card Tarot, and PDF exports.', 999, 'month', '{"advanced_kundli": true, "divisional_charts": true, "detailed_dasha": true, "celtic_cross_tarot": true, "synastry_full": true, "pdf_export": true, "max_profiles": 10}'::jsonb),
  ('pro', 'Master Astrologer Pro', 'Unlimited profiles, full synastry matrix, priority consultation booking, and high-precision ephemeris.', 2999, 'month', '{"all_features": true, "unlimited_profiles": true, "priority_support": true, "max_profiles": 999}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 7. USER ENTITLEMENTS OVERRIDES
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  is_granted BOOLEAN DEFAULT true,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user ON public.entitlements(user_id, feature_key);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "entitlements_select_own" ON public.entitlements;
CREATE POLICY "entitlements_select_own" ON public.entitlements FOR SELECT USING (auth.uid() = user_id);

-- 8. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'USD',
  provider TEXT DEFAULT 'stripe',
  provider_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id, created_at DESC);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- 9. SAVED REPORTS REGISTRY
CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('kundli', 'compatibility', 'transit', 'horoscope', 'numerology', 'tarot')),
  title TEXT NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_reports_user ON public.saved_reports(user_id, created_at DESC);

ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_reports_select_own" ON public.saved_reports;
CREATE POLICY "saved_reports_select_own" ON public.saved_reports FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "saved_reports_insert_own" ON public.saved_reports;
CREATE POLICY "saved_reports_insert_own" ON public.saved_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "saved_reports_delete_own" ON public.saved_reports;
CREATE POLICY "saved_reports_delete_own" ON public.saved_reports FOR DELETE USING (auth.uid() = user_id);
