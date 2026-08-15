export interface LocationResult {
  id: string;
  name: string;
  adminRegion?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA Timezone ID (e.g. 'America/New_York', 'Asia/Kolkata')
  formattedAddress: string;
}

export interface TimezoneInfo {
  timezoneId: string;
  rawOffsetHours: number;
  dstOffsetHours: number;
  totalOffsetHours: number;
  abbreviation: string;
  isDST: boolean;
}
