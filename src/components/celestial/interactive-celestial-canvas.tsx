"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Orbit } from "lucide-react";

interface PlanetNode {
  name: string;
  symbol: string;
  color: string;
  radius: number;
  angle: number;
  speed: number;
  sign: string;
  degree: number;
  house: number;
  size: number;
}

const DEFAULT_PLANETS: PlanetNode[] = [
  { name: "Sun", symbol: "☉", color: "#f5d061", radius: 55, angle: 0.8, speed: 0.005, sign: "Leo", degree: 14.2, house: 5, size: 8 },
  { name: "Moon", symbol: "☽", color: "#e2e8f0", radius: 75, angle: 1.9, speed: 0.015, sign: "Cancer", degree: 22.8, house: 4, size: 6 },
  { name: "Mercury", symbol: "☿", color: "#38bdf8", radius: 95, angle: 3.2, speed: 0.008, sign: "Virgo", degree: 5.4, house: 6, size: 5 },
  { name: "Venus", symbol: "♀", color: "#f472b6", radius: 115, angle: 4.1, speed: 0.006, sign: "Libra", degree: 18.1, house: 7, size: 6 },
  { name: "Mars", symbol: "♂", color: "#f87171", radius: 140, angle: 0.2, speed: 0.004, sign: "Aries", degree: 27.9, house: 1, size: 6 },
  { name: "Jupiter", symbol: "♃", color: "#fbbf24", radius: 170, angle: 2.5, speed: 0.002, sign: "Sagittarius", degree: 11.3, house: 9, size: 9 },
  { name: "Saturn", symbol: "♄", color: "#c084fc", radius: 200, angle: 5.1, speed: 0.001, sign: "Capricorn", degree: 19.6, house: 10, size: 8 },
  { name: "Rahu", symbol: "☊", color: "#818cf8", radius: 225, angle: 1.1, speed: -0.002, sign: "Pisces", degree: 8.5, house: 12, size: 5 },
  { name: "Ketu", symbol: "☋", color: "#a78bfa", radius: 245, angle: 4.24, speed: -0.002, sign: "Virgo", degree: 8.5, house: 6, size: 5 },
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface InteractiveCelestialCanvasProps {
  planets?: {
    name: string;
    sign: string;
    degree: number;
    house: number;
  }[];
}

export function InteractiveCelestialCanvas({ planets: customPlanets }: InteractiveCelestialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derive initial planet configurations
  const planetList = useMemo<PlanetNode[]>(() => {
    return DEFAULT_PLANETS.map((dp) => {
      const match = customPlanets?.find((cp) => cp.name.toLowerCase() === dp.name.toLowerCase());
      if (match) {
        return {
          ...dp,
          sign: match.sign,
          degree: match.degree,
          house: match.house,
        };
      }
      return dp;
    });
  }, [customPlanets]);

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetNode>(planetList[0]);
  const [isPaused, setIsPaused] = useState(false);

  // Mutable animated state for canvas rendering
  const animPlanets = useRef<PlanetNode[]>(planetList.map(p => ({ ...p })));

  useEffect(() => {
    animPlanets.current = planetList.map(p => ({ ...p }));
  }, [planetList]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };
    window.addEventListener("resize", handleResize);

    // Stars background
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Starfield
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Zodiac Outer Ring
      const outerRadius = Math.min(centerX, centerY) - 20;
      ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw 12 Zodiac Segments
      for (let i = 0; i < 12; i++) {
        const segAngle = (i * Math.PI) / 6;
        const x1 = centerX + Math.cos(segAngle) * (outerRadius - 15);
        const y1 = centerY + Math.sin(segAngle) * (outerRadius - 15);
        const x2 = centerX + Math.cos(segAngle) * outerRadius;
        const y2 = centerY + Math.sin(segAngle) * outerRadius;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Sign text abbreviation
        const textAngle = segAngle + Math.PI / 12;
        const tx = centerX + Math.cos(textAngle) * (outerRadius - 8);
        const ty = centerY + Math.sin(textAngle) * (outerRadius - 8);
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ZODIAC_SIGNS[i].slice(0, 3).toUpperCase(), tx, ty);
      }

      // 3. Draw Celestial Center / Earth Core
      const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 24);
      centerGrad.addColorStop(0, "rgba(56, 189, 248, 0.8)");
      centerGrad.addColorStop(0.6, "rgba(14, 165, 233, 0.3)");
      centerGrad.addColorStop(1, "rgba(14, 165, 233, 0)");
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw Planetary Orbits and Nodes
      animPlanets.current.forEach((p) => {
        const scale = (outerRadius - 35) / 250;
        const scaledRadius = p.radius * scale;

        // Draw orbit ring
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Update angle if not paused
        if (!isPaused) {
          p.angle += p.speed;
        }

        const px = centerX + Math.cos(p.angle) * scaledRadius;
        const py = centerY + Math.sin(p.angle) * scaledRadius;

        // Glow
        const isSelected = selectedPlanet?.name === p.name;
        if (isSelected) {
          ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, p.size + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        const planetGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2);
        planetGrad.addColorStop(0, p.color);
        planetGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)";
        ctx.font = isSelected ? "bold 11px sans-serif" : "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.name, px, py + p.size + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPaused, selectedPlanet, planetList]);

  // Click / Selection handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 20;
    const scale = (outerRadius - 35) / 250;

    for (const p of animPlanets.current) {
      const scaledRadius = p.radius * scale;
      const px = centerX + Math.cos(p.angle) * scaledRadius;
      const py = centerY + Math.sin(p.angle) * scaledRadius;
      const dist = Math.hypot(clickX - px, clickY - py);

      if (dist < p.size + 15) {
        const found = planetList.find(pl => pl.name === p.name);
        if (found) setSelectedPlanet(found);
        break;
      }
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl space-y-4 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gold/10 text-gold border border-gold/20">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-outfit)" }}>
              Interactive 3D Celestial Orrery
            </h3>
            <p className="text-[11px] text-white/50">Real-time planetary orbits & zodiac alignments</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1 rounded-lg text-xs font-semibold glass border border-white/10 text-white/80 hover:text-white cursor-pointer"
          >
            {isPaused ? "Resume Motion" : "Pause Orbit"}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
        />

        {/* Selected Planet Floating Card */}
        {selectedPlanet && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 glass-strong rounded-xl p-3.5 border border-gold/40 shadow-2xl animate-fade-in space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono" style={{ color: selectedPlanet.color }}>
                  {selectedPlanet.symbol}
                </span>
                <span className="text-sm font-bold text-white">{selectedPlanet.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gold/10 text-gold-light border border-gold/30">
                House {selectedPlanet.house}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/10">
              <div>
                <span className="text-[10px] text-white/40 block">Zodiac Sign</span>
                <span className="font-semibold text-white">{selectedPlanet.sign}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block">Ecliptic Longitude</span>
                <span className="font-mono text-gold-light">{selectedPlanet.degree.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Planet Quick Select Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {planetList.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setSelectedPlanet(p)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedPlanet?.name === p.name
                ? "bg-gold/20 text-gold-light border border-gold"
                : "glass border-white/5 text-white/60 hover:text-white"
            }`}
          >
            <span style={{ color: p.color }}>{p.symbol}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
