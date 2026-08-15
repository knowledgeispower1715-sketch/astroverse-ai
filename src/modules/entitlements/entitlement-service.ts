import { PlanTier, FeatureKey, TIER_ENTITLEMENTS } from "./types";

export class EntitlementService {
  private userTier: PlanTier;

  constructor(userTier: PlanTier = "free") {
    this.userTier = userTier;
  }

  canAccess(feature: FeatureKey): boolean {
    const config = TIER_ENTITLEMENTS[this.userTier] || TIER_ENTITLEMENTS.free;
    return !!config.features[feature];
  }

  getMaxProfiles(): number {
    const config = TIER_ENTITLEMENTS[this.userTier] || TIER_ENTITLEMENTS.free;
    return config.maxBirthProfiles;
  }

  getTier(): PlanTier {
    return this.userTier;
  }
}
