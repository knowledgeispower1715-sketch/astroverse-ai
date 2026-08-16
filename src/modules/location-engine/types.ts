export interface LocationResult {
  id: string;
  geonameId?: number;
  name: string;
  asciiName?: string;
  adminRegion?: string;
  admin2?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA Timezone ID (e.g. 'America/New_York', 'Asia/Kolkata', 'Europe/Paris')
  population?: number;
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
