"use client";

import { useMemo } from "react";

/* Pseudo-aléatoire déterministe (évite les problèmes d'hydratation) */
function sr(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ── Pluie ── */
function Rain({ heavy = false }) {
  const count = heavy ? 100 : 65;
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: sr(i * 3) * 100,
        delay: sr(i * 7) * 2,
        duration: sr(i * 11) * 0.35 + 0.25,
        height: sr(i * 13) * 14 + 8,
        opacity: sr(i * 17) * 0.25 + 0.2,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${d.left}%`,
            width: "1px",
            height: `${d.height}px`,
            background: "rgba(200, 225, 255, 0.55)",
            transform: "rotate(15deg)",
            animation: `wb-rain ${d.duration}s ${d.delay}s linear infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* ── Neige ── */
function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        left: sr(i * 5) * 100,
        delay: sr(i * 9) * 6,
        duration: sr(i * 13) * 4 + 5,
        size: sr(i * 17) * 4 + 2,
        opacity: sr(i * 19) * 0.4 + 0.35,
        drift: (sr(i * 23) - 0.5) * 70,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute top-0 rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            "--drift": `${f.drift}px`,
            animation: `wb-snow ${f.duration}s ${f.delay}s ease-in-out infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* ── Étoiles (nuit dégagée) ── */
function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: sr(i * 3) * 100,
        top: sr(i * 7) * 65,
        size: sr(i * 11) * 2 + 0.8,
        delay: sr(i * 13) * 5,
        duration: sr(i * 17) * 2 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `wb-star ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Soleil ── */
function Sun() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex justify-center">
      <div className="relative mt-20 w-48 h-48 flex items-center justify-center">
        {/* Halos externes */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-60%",
            background: "radial-gradient(circle, rgba(255,220,80,0.10) 0%, transparent 70%)",
            animation: "wb-sun-pulse 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: "-30%",
            background: "radial-gradient(circle, rgba(255,200,60,0.15) 0%, transparent 70%)",
            animation: "wb-sun-pulse 4s 1s ease-in-out infinite",
          }}
        />
        {/* Rayons rotatifs */}
        <div
          className="absolute inset-0"
          style={{ animation: "wb-sun-rotate 20s linear infinite" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                width: "90px",
                height: "2px",
                marginTop: "-1px",
                transform: `rotate(${i * 30}deg)`,
                background:
                  "linear-gradient(to right, rgba(255,220,80,0.35), transparent)",
              }}
            />
          ))}
        </div>
        {/* Cœur du soleil */}
        <div
          className="relative rounded-full"
          style={{
            width: "72px",
            height: "72px",
            background: "radial-gradient(circle, rgba(255,235,120,0.55) 0%, rgba(255,200,60,0.25) 60%, transparent 100%)",
            animation: "wb-sun-pulse 3s ease-in-out infinite",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Nuages animés ── */
function CloudShape({ opacity = 0.35 }) {
  return (
    <svg width="260" height="90" viewBox="0 0 260 90" fill={`rgba(255,255,255,${opacity})`}>
      <ellipse cx="130" cy="72" rx="115" ry="22" />
      <ellipse cx="90" cy="55" rx="55" ry="38" />
      <ellipse cx="155" cy="48" rx="50" ry="35" />
      <ellipse cx="115" cy="42" rx="42" ry="32" />
    </svg>
  );
}

function Clouds({ heavy = false }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: heavy ? 5 : 3 }, (_, i) => ({
        top: sr(i * 5) * 35 + 3,
        scale: sr(i * 11) * 0.6 + 0.7,
        duration: sr(i * 7) * 25 + 30,
        delay: -sr(i * 13) * 25,
        opacity: heavy ? 0.7 : sr(i * 17) * 0.2 + 0.28,
      })),
    [heavy]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${c.top}%`,
            left: "-20%",
            transform: `scale(${c.scale})`,
            animation: `wb-cloud ${c.duration}s ${c.delay}s linear infinite`,
          }}
        >
          <CloudShape opacity={c.opacity} />
        </div>
      ))}
    </div>
  );
}

/* ── Brouillard ── */
function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${10 + i * 18}%`,
            height: "80px",
            background: "rgba(180, 200, 215, 0.18)",
            filter: "blur(18px)",
            animation: `wb-fog ${8 + i * 3}s ${i * 2}s ease-in-out infinite`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
    </div>
  );
}

/* ── Orage ── */
function Thunder() {
  return (
    <>
      <Rain heavy />
      <Clouds heavy />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ animation: "wb-lightning 5s 1s ease-in-out infinite" }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ animation: "wb-lightning 8s 4s ease-in-out infinite" }}
      />
    </>
  );
}

/* ── Composant principal ── */
export default function WeatherBackground({ weatherMain, iconCode }) {
  const isNight = iconCode?.endsWith("n");
  const cond = weatherMain?.toLowerCase() || "";

  if (cond === "thunderstorm") return <Thunder />;
  if (cond === "rain") return <><Rain /><Clouds heavy /></>;
  if (cond === "drizzle") return <Rain />;
  if (cond === "snow") return <Snow />;
  if (cond === "mist" || cond === "fog" || cond === "haze") return <Fog />;
  if (cond === "clouds") return <Clouds />;
  if (cond === "clear") return isNight ? <Stars /> : <Sun />;
  return null;
}
