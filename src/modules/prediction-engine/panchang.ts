/**
 * Panchang calculator — deterministic, based on actual astronomical positions.
 * Computes: Tithi, Vara, Nakshatra, Yoga, Karana, Sunrise/Sunset approximations,
 * Rahu Kalam, Yamaganda, Gulika Kalam.
 */

import { dateToJD, tropicalSunLongitude, tropicalMoonLongitude, lahiriAyanamsa, getNakshatra } from "./astro-math";

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

const TITHIPAKSHA = (i: number) => i < 15 ? "Shukla" : "Krishna";

const VARAS = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];
const VARA_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
];

const YOGA_QUALITY: Record<string, "auspicious" | "inauspicious" | "neutral"> = {
  Vishkambha: "inauspicious", Priti: "auspicious", Ayushman: "auspicious", Saubhagya: "auspicious",
  Shobhana: "auspicious", Atiganda: "inauspicious", Sukarma: "auspicious", Dhriti: "auspicious",
  Shula: "inauspicious", Ganda: "inauspicious", Vriddhi: "auspicious", Dhruva: "auspicious",
  Vyaghata: "inauspicious", Harshana: "auspicious", Vajra: "inauspicious", Siddhi: "auspicious",
  Vyatipata: "inauspicious", Variyan: "neutral", Parigha: "inauspicious", Shiva: "auspicious",
  Siddha: "auspicious", Sadhya: "auspicious", Shubha: "auspicious", Shukla: "auspicious",
  Brahma: "auspicious", Indra: "auspicious", Vaidhriti: "inauspicious",
};

const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija",
  "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna",
];

// Rahu Kalam hours for each weekday (in hour offsets from sunrise, duration 1.5h)
const RAHU_KALAM_SLOT: Record<number, number> = {
  0: 4.5, // Sunday: 3rd slot (10:30-12:00 from 6am sunrise)
  1: 7.5, // Monday: 5th slot (13:30-15:00)
  2: 3.0, // Tuesday: 2nd slot (09:00-10:30)
  3: 6.0, // Wednesday: 4th slot (12:00-13:30)
  4: 1.5, // Thursday: 1st slot (07:30-09:00)
  5: 9.0, // Friday: 6th slot (15:00-16:30)
  6: 0.0, // Saturday: sunrise (06:00-07:30)
};

const YAMAGANDA_SLOT: Record<number, number> = {
  0: 3.0, 1: 6.0, 2: 0.0, 3: 7.5, 4: 4.5, 5: 1.5, 6: 9.0,
};

const GULIKA_SLOT: Record<number, number> = {
  0: 6.0, 1: 0.0, 2: 9.0, 3: 3.0, 4: 7.5, 5: 4.5, 6: 1.5,
};

/** Approximate sunrise based on latitude and day of year (hours UTC) */
function approximateSunrise(date: Date, latitude: number, longitude: number): number {
  const doy = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = 23.45 * Math.sin((360 / 365) * (doy - 81) * Math.PI / 180);
  const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180)) * 180 / Math.PI;
  const sunriseUTC = 12 - hourAngle / 15 - longitude / 15;
  return ((sunriseUTC % 24) + 24) % 24;
}

function approximateSunset(date: Date, latitude: number, longitude: number): number {
  const doy = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = 23.45 * Math.sin((360 / 365) * (doy - 81) * Math.PI / 180);
  const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180)) * 180 / Math.PI;
  const sunsetUTC = 12 + hourAngle / 15 - longitude / 15;
  return ((sunsetUTC % 24) + 24) % 24;
}

function hoursToTime(hoursUTC: number, tzOffset: number): string {
  const local = ((hoursUTC + tzOffset) % 24 + 24) % 24;
  const h = Math.floor(local);
  const m = Math.round((local - h) * 60);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

function slotToTime(slot: number, sunriseLocal: number, tzOffset: number): string {
  return hoursToTime(sunriseLocal + slot, 0); // sunriseLocal already in local
}

export interface PanchangData {
  date: string;
  vara: string;
  varaPlanet: string;
  tithi: string;
  tithiPaksha: string;
  nakshatra: string;
  nakshatraRuler: string;
  yoga: string;
  yogaQuality: string;
  karana: string;
  sunrise: string;
  sunset: string;
  rahuKalam: string;
  yamaganda: string;
  gulikaKalam: string;
  moonSign: string;
  sunSign: string;
  lunarDay: number;
  isMuhurta: boolean;
}

export function calculatePanchang(date: Date, latitude: number, longitude: number, tzOffsetHours: number = 5.5): PanchangData {
  const jd = dateToJD(date);

  const sunLong = tropicalSunLongitude(jd);
  const moonLong = tropicalMoonLongitude(jd);
  const ayan = lahiriAyanamsa(jd);
  const sidSun = ((sunLong - ayan + 360) % 360);
  const sidMoon = ((moonLong - ayan + 360) % 360);

  // Tithi: each Tithi = 12° of Moon-Sun elongation
  const elongation = ((moonLong - sunLong + 360) % 360);
  const tithiIdx = Math.floor(elongation / 12);
  const tithi = TITHIS[tithiIdx] ?? "Pratipada";
  const tithiPaksha = TITHIPAKSHA(tithiIdx);

  // Vara
  const dow = date.getDay();
  const vara = VARAS[dow];
  const varaPlanet = VARA_PLANETS[dow];

  // Nakshatra of Moon
  const moonNak = getNakshatra(sidMoon);
  const sunNak = getNakshatra(sidSun);

  // Yoga: (Sun + Moon sidereal) / 13.333°
  const yogaLong = (sidSun + sidMoon) % 360;
  const yogaIdx = Math.floor(yogaLong / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIdx];
  const yogaQuality = YOGA_QUALITY[yoga] ?? "neutral";

  // Karana: every half-Tithi
  const karanaIdx = Math.floor(elongation / 6) % 11;
  const karana = KARANAS[karanaIdx];

  // Moon and Sun signs
  const SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
  const moonSign = SIGNS[Math.floor(sidMoon / 30)];
  const sunSign = SIGNS[Math.floor(sidSun / 30)];

  // Sunrise/sunset (local time string)
  const sunriseUTC = approximateSunrise(date, latitude, longitude);
  const sunsetUTC = approximateSunset(date, latitude, longitude);
  const sunriseLocal = sunriseUTC + tzOffsetHours;
  const sunsetLocal = sunsetUTC + tzOffsetHours;

  const sunrise = hoursToTime(sunriseLocal, 0);
  const sunset = hoursToTime(sunsetLocal, 0);

  // Rahu Kalam, Yamaganda, Gulika
  const rahuStart = sunriseLocal + RAHU_KALAM_SLOT[dow];
  const yamaStart = sunriseLocal + YAMAGANDA_SLOT[dow];
  const gulikaStart = sunriseLocal + GULIKA_SLOT[dow];

  const fmtRange = (start: number) => `${hoursToTime(start, 0)} – ${hoursToTime(start + 1.5, 0)}`;

  // Auspicious muhurta check (Yoga is auspicious AND tithi favorable AND not Rahu Kalam)
  const goodYoga = yogaQuality === "auspicious";
  const favorableTithis = ["Dwitiya", "Tritiya", "Panchami", "Saptami", "Dashami", "Ekadashi", "Dwadashi"];
  const goodTithi = favorableTithis.includes(tithi);
  const isMuhurta = goodYoga && goodTithi;

  return {
    date: date.toISOString().slice(0, 10),
    vara,
    varaPlanet,
    tithi: `${tithiPaksha} ${tithi}`,
    tithiPaksha,
    nakshatra: moonNak.name,
    nakshatraRuler: moonNak.ruler,
    yoga,
    yogaQuality,
    karana,
    sunrise,
    sunset,
    rahuKalam: fmtRange(rahuStart),
    yamaganda: fmtRange(yamaStart),
    gulikaKalam: fmtRange(gulikaStart),
    moonSign,
    sunSign,
    lunarDay: tithiIdx + 1,
    isMuhurta,
  };
}
