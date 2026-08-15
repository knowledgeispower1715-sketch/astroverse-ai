import { LocationResult } from "./types";

export const WORLD_CITIES: LocationResult[] = [
  // India
  { id: "in-jabalpur", name: "Jabalpur", adminRegion: "Madhya Pradesh", country: "India", countryCode: "IN", latitude: 23.1815, longitude: 79.9864, timezone: "Asia/Kolkata", formattedAddress: "Jabalpur, Madhya Pradesh, India" },
  { id: "in-delhi", name: "New Delhi", adminRegion: "Delhi", country: "India", countryCode: "IN", latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata", formattedAddress: "New Delhi, Delhi, India" },
  { id: "in-mumbai", name: "Mumbai", adminRegion: "Maharashtra", country: "India", countryCode: "IN", latitude: 19.0760, longitude: 72.8777, timezone: "Asia/Kolkata", formattedAddress: "Mumbai, Maharashtra, India" },
  { id: "in-bengaluru", name: "Bengaluru", adminRegion: "Karnataka", country: "India", countryCode: "IN", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", formattedAddress: "Bengaluru, Karnataka, India" },
  { id: "in-kolkata", name: "Kolkata", adminRegion: "West Bengal", country: "India", countryCode: "IN", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata", formattedAddress: "Kolkata, West Bengal, India" },
  { id: "in-chennai", name: "Chennai", adminRegion: "Tamil Nadu", country: "India", countryCode: "IN", latitude: 13.0827, longitude: 80.2707, timezone: "Asia/Kolkata", formattedAddress: "Chennai, Tamil Nadu, India" },
  { id: "in-hyderabad", name: "Hyderabad", adminRegion: "Telangana", country: "India", countryCode: "IN", latitude: 17.3850, longitude: 78.4867, timezone: "Asia/Kolkata", formattedAddress: "Hyderabad, Telangana, India" },
  { id: "in-ahmedabad", name: "Ahmedabad", adminRegion: "Gujarat", country: "India", countryCode: "IN", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", formattedAddress: "Ahmedabad, Gujarat, India" },
  { id: "in-pune", name: "Pune", adminRegion: "Maharashtra", country: "India", countryCode: "IN", latitude: 18.5204, longitude: 73.8567, timezone: "Asia/Kolkata", formattedAddress: "Pune, Maharashtra, India" },
  { id: "in-jaipur", name: "Jaipur", adminRegion: "Rajasthan", country: "India", countryCode: "IN", latitude: 26.9124, longitude: 75.7873, timezone: "Asia/Kolkata", formattedAddress: "Jaipur, Rajasthan, India" },
  { id: "in-lucknow", name: "Lucknow", adminRegion: "Uttar Pradesh", country: "India", countryCode: "IN", latitude: 26.8467, longitude: 80.9462, timezone: "Asia/Kolkata", formattedAddress: "Lucknow, Uttar Pradesh, India" },
  { id: "in-varanasi", name: "Varanasi", adminRegion: "Uttar Pradesh", country: "India", countryCode: "IN", latitude: 25.3176, longitude: 82.9739, timezone: "Asia/Kolkata", formattedAddress: "Varanasi, Uttar Pradesh, India" },
  { id: "in-indore", name: "Indore", adminRegion: "Madhya Pradesh", country: "India", countryCode: "IN", latitude: 22.7196, longitude: 75.8577, timezone: "Asia/Kolkata", formattedAddress: "Indore, Madhya Pradesh, India" },
  { id: "in-bhopal", name: "Bhopal", adminRegion: "Madhya Pradesh", country: "India", countryCode: "IN", latitude: 23.2599, longitude: 77.4126, timezone: "Asia/Kolkata", formattedAddress: "Bhopal, Madhya Pradesh, India" },
  { id: "in-patna", name: "Patna", adminRegion: "Bihar", country: "India", countryCode: "IN", latitude: 25.5941, longitude: 85.1376, timezone: "Asia/Kolkata", formattedAddress: "Patna, Bihar, India" },
  { id: "in-chandigarh", name: "Chandigarh", adminRegion: "Chandigarh", country: "India", countryCode: "IN", latitude: 30.7333, longitude: 76.7794, timezone: "Asia/Kolkata", formattedAddress: "Chandigarh, India" },

  // Nepal & South Asia
  { id: "np-kathmandu", name: "Kathmandu", adminRegion: "Bagmati", country: "Nepal", countryCode: "NP", latitude: 27.7172, longitude: 85.3240, timezone: "Asia/Kathmandu", formattedAddress: "Kathmandu, Nepal" },
  { id: "np-pokhara", name: "Pokhara", adminRegion: "Gandaki", country: "Nepal", countryCode: "NP", latitude: 28.2096, longitude: 83.9856, timezone: "Asia/Kathmandu", formattedAddress: "Pokhara, Nepal" },
  { id: "lk-colombo", name: "Colombo", adminRegion: "Western", country: "Sri Lanka", countryCode: "LK", latitude: 6.9271, longitude: 79.8612, timezone: "Asia/Colombo", formattedAddress: "Colombo, Sri Lanka" },
  { id: "bd-dhaka", name: "Dhaka", adminRegion: "Dhaka", country: "Bangladesh", countryCode: "BD", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka", formattedAddress: "Dhaka, Bangladesh" },

  // United States
  { id: "us-newyork", name: "New York", adminRegion: "New York", country: "United States", countryCode: "US", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York", formattedAddress: "New York, NY, USA" },
  { id: "us-losangeles", name: "Los Angeles", adminRegion: "California", country: "United States", countryCode: "US", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles", formattedAddress: "Los Angeles, CA, USA" },
  { id: "us-chicago", name: "Chicago", adminRegion: "Illinois", country: "United States", countryCode: "US", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago", formattedAddress: "Chicago, IL, USA" },
  { id: "us-houston", name: "Houston", adminRegion: "Texas", country: "United States", countryCode: "US", latitude: 29.7604, longitude: -95.3698, timezone: "America/Chicago", formattedAddress: "Houston, TX, USA" },
  { id: "us-sanfrancisco", name: "San Francisco", adminRegion: "California", country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", formattedAddress: "San Francisco, CA, USA" },
  { id: "us-seattle", name: "Seattle", adminRegion: "Washington", country: "United States", countryCode: "US", latitude: 47.6062, longitude: -122.3321, timezone: "America/Los_Angeles", formattedAddress: "Seattle, WA, USA" },
  { id: "us-miami", name: "Miami", adminRegion: "Florida", country: "United States", countryCode: "US", latitude: 25.7617, longitude: -80.1918, timezone: "America/New_York", formattedAddress: "Miami, FL, USA" },
  { id: "us-austin", name: "Austin", adminRegion: "Texas", country: "United States", countryCode: "US", latitude: 30.2672, longitude: -97.7431, timezone: "America/Chicago", formattedAddress: "Austin, TX, USA" },
  { id: "us-boston", name: "Boston", adminRegion: "Massachusetts", country: "United States", countryCode: "US", latitude: 42.3601, longitude: -71.0589, timezone: "America/New_York", formattedAddress: "Boston, MA, USA" },
  { id: "us-denver", name: "Denver", adminRegion: "Colorado", country: "United States", countryCode: "US", latitude: 39.7392, longitude: -104.9903, timezone: "America/Denver", formattedAddress: "Denver, CO, USA" },
  { id: "us-phoenix", name: "Phoenix", adminRegion: "Arizona", country: "United States", countryCode: "US", latitude: 33.4484, longitude: -112.0740, timezone: "America/Phoenix", formattedAddress: "Phoenix, AZ, USA" },

  // Canada
  { id: "ca-toronto", name: "Toronto", adminRegion: "Ontario", country: "Canada", countryCode: "CA", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto", formattedAddress: "Toronto, ON, Canada" },
  { id: "ca-vancouver", name: "Vancouver", adminRegion: "British Columbia", country: "Canada", countryCode: "CA", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver", formattedAddress: "Vancouver, BC, Canada" },
  { id: "ca-montreal", name: "Montreal", adminRegion: "Quebec", country: "Canada", countryCode: "CA", latitude: 45.5017, longitude: -73.5673, timezone: "America/Toronto", formattedAddress: "Montreal, QC, Canada" },
  { id: "ca-calgary", name: "Calgary", adminRegion: "Alberta", country: "Canada", countryCode: "CA", latitude: 51.0447, longitude: -114.0719, timezone: "America/Edmonton", formattedAddress: "Calgary, AB, Canada" },

  // United Kingdom & Europe
  { id: "gb-london", name: "London", adminRegion: "England", country: "United Kingdom", countryCode: "GB", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London", formattedAddress: "London, England, UK" },
  { id: "gb-manchester", name: "Manchester", adminRegion: "England", country: "United Kingdom", countryCode: "GB", latitude: 53.4808, longitude: -2.2426, timezone: "Europe/London", formattedAddress: "Manchester, England, UK" },
  { id: "gb-edinburgh", name: "Edinburgh", adminRegion: "Scotland", country: "United Kingdom", countryCode: "GB", latitude: 55.9533, longitude: -3.1883, timezone: "Europe/London", formattedAddress: "Edinburgh, Scotland, UK" },
  { id: "fr-paris", name: "Paris", adminRegion: "Île-de-France", country: "France", countryCode: "FR", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", formattedAddress: "Paris, France" },
  { id: "de-berlin", name: "Berlin", adminRegion: "Berlin", country: "Germany", countryCode: "DE", latitude: 52.5200, longitude: 13.4050, timezone: "Europe/Berlin", formattedAddress: "Berlin, Germany" },
  { id: "de-munich", name: "Munich", adminRegion: "Bavaria", country: "Germany", countryCode: "DE", latitude: 48.1351, longitude: 11.5820, timezone: "Europe/Berlin", formattedAddress: "Munich, Germany" },
  { id: "de-frankfurt", name: "Frankfurt", adminRegion: "Hesse", country: "Germany", countryCode: "DE", latitude: 50.1109, longitude: 8.6821, timezone: "Europe/Berlin", formattedAddress: "Frankfurt, Germany" },
  { id: "nl-amsterdam", name: "Amsterdam", adminRegion: "North Holland", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam", formattedAddress: "Amsterdam, Netherlands" },
  { id: "es-madrid", name: "Madrid", adminRegion: "Madrid", country: "Spain", countryCode: "ES", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid", formattedAddress: "Madrid, Spain" },
  { id: "es-barcelona", name: "Barcelona", adminRegion: "Catalonia", country: "Spain", countryCode: "ES", latitude: 41.3879, longitude: 2.1699, timezone: "Europe/Madrid", formattedAddress: "Barcelona, Spain" },
  { id: "it-rome", name: "Rome", adminRegion: "Lazio", country: "Italy", countryCode: "IT", latitude: 41.9028, longitude: 12.4964, timezone: "Europe/Rome", formattedAddress: "Rome, Italy" },
  { id: "it-milan", name: "Milan", adminRegion: "Lombardy", country: "Italy", countryCode: "IT", latitude: 45.4642, longitude: 9.1900, timezone: "Europe/Rome", formattedAddress: "Milan, Italy" },
  { id: "ch-zurich", name: "Zurich", adminRegion: "Zurich", country: "Switzerland", countryCode: "CH", latitude: 47.3769, longitude: 8.5417, timezone: "Europe/Zurich", formattedAddress: "Zurich, Switzerland" },
  { id: "ch-geneva", name: "Geneva", adminRegion: "Geneva", country: "Switzerland", countryCode: "CH", latitude: 46.2044, longitude: 6.1432, timezone: "Europe/Zurich", formattedAddress: "Geneva, Switzerland" },
  { id: "at-vienna", name: "Vienna", adminRegion: "Vienna", country: "Austria", countryCode: "AT", latitude: 48.2082, longitude: 16.3738, timezone: "Europe/Vienna", formattedAddress: "Vienna, Austria" },
  { id: "se-stockholm", name: "Stockholm", adminRegion: "Stockholm", country: "Sweden", countryCode: "SE", latitude: 59.3293, longitude: 18.0686, timezone: "Europe/Stockholm", formattedAddress: "Stockholm, Sweden" },
  { id: "no-oslo", name: "Oslo", adminRegion: "Oslo", country: "Norway", countryCode: "NO", latitude: 59.9139, longitude: 10.7522, timezone: "Europe/Oslo", formattedAddress: "Oslo, Norway" },
  { id: "ie-dublin", name: "Dublin", adminRegion: "Leinster", country: "Ireland", countryCode: "IE", latitude: 53.3498, longitude: -6.2603, timezone: "Europe/Dublin", formattedAddress: "Dublin, Ireland" },

  // Middle East
  { id: "ae-dubai", name: "Dubai", adminRegion: "Dubai", country: "United Arab Emirates", countryCode: "AE", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai", formattedAddress: "Dubai, UAE" },
  { id: "ae-abudhabi", name: "Abu Dhabi", adminRegion: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai", formattedAddress: "Abu Dhabi, UAE" },
  { id: "sa-riyadh", name: "Riyadh", adminRegion: "Riyadh", country: "Saudi Arabia", countryCode: "SA", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh", formattedAddress: "Riyadh, Saudi Arabia" },
  { id: "qa-doha", name: "Doha", adminRegion: "Doha", country: "Qatar", countryCode: "QA", latitude: 25.2854, longitude: 51.5310, timezone: "Asia/Qatar", formattedAddress: "Doha, Qatar" },
  { id: "kw-kuwait", name: "Kuwait City", adminRegion: "Al Asimah", country: "Kuwait", countryCode: "KW", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait", formattedAddress: "Kuwait City, Kuwait" },

  // East & Southeast Asia
  { id: "jp-tokyo", name: "Tokyo", adminRegion: "Tokyo", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", formattedAddress: "Tokyo, Japan" },
  { id: "jp-osaka", name: "Osaka", adminRegion: "Osaka", country: "Japan", countryCode: "JP", latitude: 34.6937, longitude: 135.5023, timezone: "Asia/Tokyo", formattedAddress: "Osaka, Japan" },
  { id: "jp-kyoto", name: "Kyoto", adminRegion: "Kyoto", country: "Japan", countryCode: "JP", latitude: 35.0116, longitude: 135.7681, timezone: "Asia/Tokyo", formattedAddress: "Kyoto, Japan" },
  { id: "sg-singapore", name: "Singapore", adminRegion: "Singapore", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore", formattedAddress: "Singapore" },
  { id: "my-kualalumpur", name: "Kuala Lumpur", adminRegion: "Federal Territory", country: "Malaysia", countryCode: "MY", latitude: 3.1390, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur", formattedAddress: "Kuala Lumpur, Malaysia" },
  { id: "th-bangkok", name: "Bangkok", adminRegion: "Bangkok", country: "Thailand", countryCode: "TH", latitude: 13.7563, longitude: 100.5018, timezone: "Asia/Bangkok", formattedAddress: "Bangkok, Thailand" },
  { id: "id-jakarta", name: "Jakarta", adminRegion: "Jakarta", country: "Indonesia", countryCode: "ID", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta", formattedAddress: "Jakarta, Indonesia" },
  { id: "kr-seoul", name: "Seoul", adminRegion: "Seoul", country: "South Korea", countryCode: "KR", latitude: 37.5665, longitude: 126.9780, timezone: "Asia/Seoul", formattedAddress: "Seoul, South Korea" },
  { id: "hk-hongkong", name: "Hong Kong", adminRegion: "Hong Kong", country: "Hong Kong", countryCode: "HK", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong", formattedAddress: "Hong Kong" },

  // Australia & New Zealand
  { id: "au-sydney", name: "Sydney", adminRegion: "New South Wales", country: "Australia", countryCode: "AU", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", formattedAddress: "Sydney, NSW, Australia" },
  { id: "au-melbourne", name: "Melbourne", adminRegion: "Victoria", country: "Australia", countryCode: "AU", latitude: -37.8136, longitude: 144.9631, timezone: "Australia/Melbourne", formattedAddress: "Melbourne, VIC, Australia" },
  { id: "au-brisbane", name: "Brisbane", adminRegion: "Queensland", country: "Australia", countryCode: "AU", latitude: -27.4698, longitude: 153.0251, timezone: "Australia/Brisbane", formattedAddress: "Brisbane, QLD, Australia" },
  { id: "au-perth", name: "Perth", adminRegion: "Western Australia", country: "Australia", countryCode: "AU", latitude: -31.9505, longitude: 115.8605, timezone: "Australia/Perth", formattedAddress: "Perth, WA, Australia" },
  { id: "nz-auckland", name: "Auckland", adminRegion: "Auckland", country: "New Zealand", countryCode: "NZ", latitude: -36.8485, longitude: 174.7633, timezone: "Pacific/Auckland", formattedAddress: "Auckland, New Zealand" },

  // Latin America & Africa
  { id: "br-saopaulo", name: "São Paulo", adminRegion: "São Paulo", country: "Brazil", countryCode: "BR", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo", formattedAddress: "São Paulo, Brazil" },
  { id: "br-riodejaneiro", name: "Rio de Janeiro", adminRegion: "Rio de Janeiro", country: "Brazil", countryCode: "BR", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo", formattedAddress: "Rio de Janeiro, Brazil" },
  { id: "mx-mexicocity", name: "Mexico City", adminRegion: "CDMX", country: "Mexico", countryCode: "MX", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City", formattedAddress: "Mexico City, Mexico" },
  { id: "ar-buenosaires", name: "Buenos Aires", adminRegion: "Capital Federal", country: "Argentina", countryCode: "AR", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires", formattedAddress: "Buenos Aires, Argentina" },
  { id: "za-johannesburg", name: "Johannesburg", adminRegion: "Gauteng", country: "South Africa", countryCode: "ZA", latitude: -26.2041, longitude: 28.0473, timezone: "Africa/Johannesburg", formattedAddress: "Johannesburg, South Africa" },
  { id: "za-capetown", name: "Cape Town", adminRegion: "Western Cape", country: "South Africa", countryCode: "ZA", latitude: -33.9249, longitude: 18.4241, timezone: "Africa/Johannesburg", formattedAddress: "Cape Town, South Africa" },
  { id: "eg-cairo", name: "Cairo", adminRegion: "Cairo", country: "Egypt", countryCode: "EG", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", formattedAddress: "Cairo, Egypt" },
];
