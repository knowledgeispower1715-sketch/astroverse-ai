-- AstroVerse AI — Global Locations Gazetteer Schema
-- Migration: 20260817000002_global_locations_gazetteer.sql

-- Enable pg_trgm extension for fast trigram similarity search if available
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOCATIONS TABLE (Canonical GeoNames Gazetteer)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geoname_id BIGINT UNIQUE,
  name TEXT NOT NULL,
  ascii_name TEXT,
  alternate_names TEXT,
  feature_class CHAR(1), -- 'P' for populated place, 'A' for administrative division, etc.
  feature_code TEXT,    -- 'PPL', 'PPLA', 'PPLC', 'ADM1', 'ADM2', etc.
  country_code VARCHAR(2) NOT NULL,
  country_name TEXT,
  admin1_code TEXT,
  admin1_name TEXT,     -- State / Province / Region
  admin2_code TEXT,
  admin2_name TEXT,     -- District / County / Department
  admin3_code TEXT,
  admin3_name TEXT,
  admin4_code TEXT,
  admin4_name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  population BIGINT DEFAULT 0,
  elevation INT,
  dem INT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. INDEXES FOR HIGH-PERFORMANCE SEARCH
CREATE INDEX IF NOT EXISTS idx_locations_name ON public.locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_ascii_name ON public.locations(ascii_name);
CREATE INDEX IF NOT EXISTS idx_locations_country_code ON public.locations(country_code);
CREATE INDEX IF NOT EXISTS idx_locations_admin1_code ON public.locations(country_code, admin1_code);
CREATE INDEX IF NOT EXISTS idx_locations_population ON public.locations(population DESC);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON public.locations(latitude, longitude);

-- Trigram indexes for fast typo-tolerant and prefix autocomplete
CREATE INDEX IF NOT EXISTS idx_locations_name_trgm ON public.locations USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_locations_ascii_trgm ON public.locations USING gin (ascii_name gin_trgm_ops);

-- Full text search index combining name, admin region, and country
CREATE INDEX IF NOT EXISTS idx_locations_fts ON public.locations USING gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(admin1_name, '') || ' ' || coalesce(country_name, ''))
);

-- 3. ROW LEVEL SECURITY — Locations table is public read-only
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "locations_select_public" ON public.locations;
CREATE POLICY "locations_select_public" ON public.locations
  FOR SELECT USING (true);

-- 4. LINK BIRTH PROFILES TO CANONICAL LOCATIONS
ALTER TABLE public.birth_profiles
  ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS geoname_id BIGINT,
  ADD COLUMN IF NOT EXISTS admin_region TEXT,
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS iana_timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS utc_offset_at_birth DOUBLE PRECISION;

-- 5. FUNCTION: SEARCH LOCATIONS WITH RANKING
CREATE OR REPLACE FUNCTION public.search_global_locations(
  search_query TEXT,
  filter_country TEXT DEFAULT NULL,
  max_results INT DEFAULT 15
)
RETURNS TABLE (
  id UUID,
  geoname_id BIGINT,
  name TEXT,
  admin1_name TEXT,
  admin2_name TEXT,
  country_name TEXT,
  country_code VARCHAR(2),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone TEXT,
  population BIGINT,
  formatted_address TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.geoname_id,
    l.name,
    l.admin1_name,
    l.admin2_name,
    l.country_name,
    l.country_code,
    l.latitude,
    l.longitude,
    l.timezone,
    l.population,
    CONCAT_WS(', ', l.name, NULLIF(l.admin1_name, ''), l.country_name) AS formatted_address
  FROM public.locations l
  WHERE 
    (filter_country IS NULL OR l.country_code = UPPER(filter_country))
    AND (
      l.name ILIKE search_query || '%'
      OR l.ascii_name ILIKE search_query || '%'
      OR l.alternate_names ILIKE '%' || search_query || '%'
      OR to_tsvector('simple', coalesce(l.name, '') || ' ' || coalesce(l.admin1_name, '') || ' ' || coalesce(l.country_name, '')) @@ plainto_tsquery('simple', search_query)
    )
  ORDER BY 
    CASE WHEN l.name ILIKE search_query THEN 0
         WHEN l.name ILIKE search_query || '%' THEN 1
         ELSE 2
    END,
    l.population DESC NULLS LAST
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;
