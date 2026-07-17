-- Create public tables for AstroVerse AI

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Profile Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'premium', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  astrology_system TEXT DEFAULT 'western' CHECK (astrology_system IN ('western', 'vedic', 'chinese')),
  house_system TEXT DEFAULT 'placidus',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  daily_horoscope_alert BOOLEAN DEFAULT TRUE,
  transits_alert BOOLEAN DEFAULT FALSE,
  newsletters_alert BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'UTC',
  locale TEXT DEFAULT 'en-US',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Birth Details Table
CREATE TABLE IF NOT EXISTS public.birth_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME WITHOUT TIME ZONE NOT NULL,
  birth_place TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone_id TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saved Charts Table
CREATE TABLE IF NOT EXISTS public.saved_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  birth_details_id UUID REFERENCES public.birth_details(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  chart_type TEXT DEFAULT 'western' CHECK (chart_type IN ('western', 'vedic', 'chinese')),
  placements JSONB NOT NULL,
  houses JSONB NOT NULL,
  aspects JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('sign', 'user')),
  target_value TEXT NOT NULL, -- Zodiac sign name or User ID
  period TEXT NOT NULL CHECK (period IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')),
  prediction_date DATE NOT NULL,
  scores JSONB NOT NULL, -- e.g., {"love": 85, "career": 90, "health": 75, "finance": 80}
  placements JSONB, -- Transiting positions
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reports Table (PDF registry)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('kundli', 'compatibility', 'transit_forecast')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  favorite_type TEXT NOT NULL CHECK (favorite_type IN ('chart', 'blog', 'prediction')),
  favorite_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for profiles links
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    'user'
  );
  
  INSERT INTO public.settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
