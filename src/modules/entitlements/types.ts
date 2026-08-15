export type PlanTier = "free" | "premium" | "pro";

export type FeatureKey =
  | "basic_kundli"
  | "advanced_kundli"
  | "divisional_charts"
  | "detailed_dasha"
  | "basic_horoscope"
  | "hourly_horoscope"
  | "basic_panchang"
  | "detailed_panchang"
  | "basic_tarot"
  | "celtic_cross_tarot"
  | "synastry_full"
  | "numerology_matrix"
  | "pdf_export"
  | "unlimited_profiles";

export interface EntitlementConfig {
  tier: PlanTier;
  features: Record<FeatureKey, boolean>;
  maxBirthProfiles: number;
}

export const TIER_ENTITLEMENTS: Record<PlanTier, EntitlementConfig> = {
  free: {
    tier: "free",
    maxBirthProfiles: 3,
    features: {
      basic_kundli: true,
      advanced_kundli: true, // currently enabled for all authenticated users
      divisional_charts: true,
      detailed_dasha: true,
      basic_horoscope: true,
      hourly_horoscope: true,
      basic_panchang: true,
      detailed_panchang: true,
      basic_tarot: true,
      celtic_cross_tarot: true,
      synastry_full: true,
      numerology_matrix: true,
      pdf_export: true,
      unlimited_profiles: false,
    },
  },
  premium: {
    tier: "premium",
    maxBirthProfiles: 10,
    features: {
      basic_kundli: true,
      advanced_kundli: true,
      divisional_charts: true,
      detailed_dasha: true,
      basic_horoscope: true,
      hourly_horoscope: true,
      basic_panchang: true,
      detailed_panchang: true,
      basic_tarot: true,
      celtic_cross_tarot: true,
      synastry_full: true,
      numerology_matrix: true,
      pdf_export: true,
      unlimited_profiles: false,
    },
  },
  pro: {
    tier: "pro",
    maxBirthProfiles: 50,
    features: {
      basic_kundli: true,
      advanced_kundli: true,
      divisional_charts: true,
      detailed_dasha: true,
      basic_horoscope: true,
      hourly_horoscope: true,
      basic_panchang: true,
      detailed_panchang: true,
      basic_tarot: true,
      celtic_cross_tarot: true,
      synastry_full: true,
      numerology_matrix: true,
      pdf_export: true,
      unlimited_profiles: true,
    },
  },
};
