import { NextResponse, type NextRequest } from "next/server";
import {
  dateToJD,
  tropicalSunLongitude,
  tropicalMoonLongitude,
  tropicalMarsLongitude,
  tropicalMercuryLongitude,
  tropicalJupiterLongitude,
  tropicalVenusLongitude,
  tropicalSaturnLongitude,
  tropicalRahuLongitude,
  lahiriAyanamsa,
} from "@/modules/prediction-engine";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const VEDIC_SIGNS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];

// Approximate Ascendant calculation
function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  const T = (jd - 2451545.0) / 36525;
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  GMST = ((GMST % 360) + 360) % 360;
  const LST = GMST + longitude;
  const E = 23.439 - 0.00013 * T;
  const latRad = latitude * Math.PI / 180;
  const LSTrad = (LST * Math.PI / 180) % (2 * Math.PI);
  const ERad = E * Math.PI / 180;
  const y = -Math.cos(LSTrad);
  const x = Math.sin(ERad) * Math.tan(latRad) + Math.cos(ERad) * Math.sin(LSTrad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  if (asc < 0) asc += 360;
  return asc;
}

function houseFromAsc(planetLong: number, ascLong: number): number {
  const ascSign = Math.floor(ascLong / 30);
  const planetSign = Math.floor(planetLong / 30);
  return ((planetSign - ascSign + 12) % 12) + 1;
}

interface PlanetRow {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  retrograde: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      birthDate?: string; birthTime?: string;
      latitude?: number; longitude?: number;
      timezone?: string; system?: string;
    };

    const { birthDate, birthTime, latitude, longitude, system } = body;

    if (!birthDate || !birthTime) {
      return NextResponse.json({ error: "birthDate and birthTime are required" }, { status: 400 });
    }

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid birthDate format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const lat = latitude ?? 28.6139;
    const lon = longitude ?? 77.209;
    const jd = dateToJD(date, birthTime ?? "12:00");
    const ayan = lahiriAyanamsa(jd);
    const isVedic = system !== "western";
    const signs = isVedic ? VEDIC_SIGNS : SIGNS;

    const toSign = (long: number) => isVedic ? ((long - ayan + 360) % 360) : ((long % 360) + 360) % 360;

    const planetDefs = [
      { name: "Sun", fn: tropicalSunLongitude },
      { name: "Moon", fn: tropicalMoonLongitude },
      { name: "Mars", fn: tropicalMarsLongitude },
      { name: "Mercury", fn: tropicalMercuryLongitude },
      { name: "Jupiter", fn: tropicalJupiterLongitude },
      { name: "Venus", fn: tropicalVenusLongitude },
      { name: "Saturn", fn: tropicalSaturnLongitude },
    ];

    const ascTropical = calculateAscendant(jd, lat, lon);
    const ascLong = toSign(ascTropical);
    const mcLong = toSign((ascTropical + 270) % 360);

    const planetRows: PlanetRow[] = planetDefs.map(({ name, fn }) => {
      const long = toSign(fn(jd));
      const prev = toSign(fn(jd - 1));
      let diff = long - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const signIdx = Math.floor(long / 30);
      const deg = long % 30;
      return {
        planet: name,
        sign: signs[signIdx] ?? signs[0],
        degree: Math.floor(deg),
        minute: Math.floor((deg % 1) * 60),
        house: houseFromAsc(long, ascLong),
        retrograde: diff < 0,
      };
    });

    const rahuLong = toSign(tropicalRahuLongitude(jd));
    const ketuLong = (rahuLong + 180) % 360;
    planetRows.push({ planet: "Rahu", sign: signs[Math.floor(rahuLong / 30)], degree: Math.floor(rahuLong % 30), minute: Math.floor(((rahuLong % 30) % 1) * 60), house: houseFromAsc(rahuLong, ascLong), retrograde: true });
    planetRows.push({ planet: "Ketu", sign: signs[Math.floor(ketuLong / 30)], degree: Math.floor(ketuLong % 30), minute: Math.floor(((ketuLong % 30) % 1) * 60), house: houseFromAsc(ketuLong, ascLong), retrograde: true });

    const ascSignIdx = Math.floor(ascLong / 30);
    const houses = Array.from({ length: 12 }, (_, i) => {
      const sIdx = (ascSignIdx + i) % 12;
      return { house: i + 1, sign: signs[sIdx], degree: Math.floor(ascLong % 30), minute: Math.floor(((ascLong % 30) % 1) * 60) };
    });

    return NextResponse.json({
      data: {
        positions: planetRows,
        ascendant: { sign: signs[Math.floor(ascLong / 30)], degree: Math.floor(ascLong % 30) },
        midheaven: { sign: signs[Math.floor(mcLong / 30)], degree: Math.floor(mcLong % 30) },
        houses,
        system: isVedic ? "vedic" : "western",
        ayanamsa: isVedic ? parseFloat(ayan.toFixed(4)) : null,
      },
    });
  } catch (err) {
    console.error("Birth chart API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
