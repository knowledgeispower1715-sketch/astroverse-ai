-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'premium', 'pro')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- birth_profiles (multiple per user)
CREATE TABLE IF NOT EXISTS public.birth_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL DEFAULT 'My Chart',
  relationship TEXT DEFAULT 'Self',
  date_of_birth DATE NOT NULL,
  time_of_birth TIME,
  time_precision TEXT DEFAULT 'exact' CHECK (time_precision IN ('exact', 'approximate', 'unknown')),
  birth_place TEXT NOT NULL,
  admin_region TEXT,
  country TEXT,
  country_code TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  iana_timezone TEXT NOT NULL DEFAULT 'UTC',
  utc_offset_at_birth DOUBLE PRECISION,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- saved_charts
CREATE TABLE IF NOT EXISTS public.saved_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  chart_type TEXT NOT NULL DEFAULT 'vedic',
  chart_data JSONB NOT NULL DEFAULT '{}',
  engine_version TEXT DEFAULT '1.0',
  title TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- tarot_readings
CREATE TABLE IF NOT EXISTS public.tarot_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_id TEXT NOT NULL,
  question TEXT,
  drawn_cards JSONB NOT NULL DEFAULT '[]',
  cosmic_context TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- compatibility_reports
CREATE TABLE IF NOT EXISTS public.compatibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_a_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  profile_b_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  system TEXT DEFAULT 'vedic',
  report_data JSONB NOT NULL DEFAULT '{}',
  total_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- horoscope_reports
CREATE TABLE IF NOT EXISTS public.horoscope_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  period TEXT NOT NULL CHECK (period IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')),
  report_date DATE NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- numerology_reports
CREATE TABLE IF NOT EXISTS public.numerology_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  report_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- transit_reports
CREATE TABLE IF NOT EXISTS public.transit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  report_date DATE NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- panchang_reports
CREATE TABLE IF NOT EXISTS public.panchang_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  location_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  iana_timezone TEXT,
  report_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_system TEXT DEFAULT 'vedic' CHECK (default_system IN ('vedic', 'western', 'chinese')),
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  email_reports BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  payment_provider TEXT,
  provider_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- usage_events (for analytics and rate limiting)
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_birth_profiles_user ON public.birth_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_charts_user ON public.saved_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_user ON public.tarot_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_user ON public.compatibility_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_horoscope_user ON public.horoscope_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_user ON public.usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_birth_profiles_primary ON public.birth_profiles(user_id, is_primary);

-- Unique Constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_per_user ON public.birth_profiles(user_id) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscope_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panchang_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to safely drop and recreate policies
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
            'profiles', 'birth_profiles', 'saved_charts', 'tarot_readings', 'compatibility_reports',
            'horoscope_reports', 'numerology_reports', 'transit_reports', 'panchang_reports',
            'user_settings', 'subscriptions', 'usage_events', 'audit_logs'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Users can select own %I" ON public.%I', t.tablename, t.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Users can insert own %I" ON public.%I', t.tablename, t.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Users can update own %I" ON public.%I', t.tablename, t.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Users can delete own %I" ON public.%I', t.tablename, t.tablename);
        
        EXECUTE format('CREATE POLICY "Users can select own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id)', t.tablename, t.tablename);
        EXECUTE format('CREATE POLICY "Users can insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t.tablename, t.tablename);
        EXECUTE format('CREATE POLICY "Users can update own %I" ON public.%I FOR UPDATE USING (auth.uid() = user_id)', t.tablename, t.tablename);
        EXECUTE format('CREATE POLICY "Users can delete own %I" ON public.%I FOR DELETE USING (auth.uid() = user_id)', t.tablename, t.tablename);
    END LOOP;
END
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_birth_profiles_updated_at ON public.birth_profiles;
CREATE TRIGGER set_birth_profiles_updated_at
  BEFORE UPDATE ON public.birth_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER set_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Profile auto-creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
