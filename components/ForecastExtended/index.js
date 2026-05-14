"use client";

import { useEffect, useState } from "react";
import WeatherIcon from "@/components/WeatherIcon";
import { useUnit } from "@/hooks/useUnit";

function SkeletonCard() {
  return (
    <div className="rounded-[2rem] p-6 flex flex-col items-center gap-4 bg-[#f8f8f7]">
      <div className="skeleton h-3 w-10 rounded-full" />
      <div className="skeleton w-16 h-16 rounded-full" />
      <div className="skeleton h-7 w-12 rounded" />
      <div className="skeleton h-2 w-16 rounded-full" />
    </div>
  );
}

export default function ForecastExtended({ fullCityName }) {
  const { unit, toggleUnit, convertTemp } = useUnit();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fullCityName) { setForecast([]); setError(""); return; }

    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/weather/forecast?city=${encodeURIComponent(fullCityName)}`);
        const data = await res.json();

        if (!data.list) { setForecast([]); return; }

        const days = {};
        data.list.forEach((entry) => {
          const date = new Date(entry.dt_txt);
          const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
          if (!days[day] && date.getHours() === 12) days[day] = entry;
        });

        setForecast(
          Object.entries(days).map(([day, entry]) => ({
            day,
            icon: entry.weather[0].icon,
            tempC: entry.main.temp,
            desc: entry.weather[0].description,
          }))
        );
      } catch {
        setError("Erreur lors du chargement des prévisions");
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [fullCityName]);

  if (!fullCityName) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 bg-white">
      {/* En-tête avec toggle °C/°F */}
      <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-4">
        <h3 className="text-xl md:text-2xl font-condensed font-black uppercase tracking-[0.2em] text-blue-900">
          Prévisions <span className="font-light text-slate-400">/ 5 jours</span>
        </h3>
        <button
          onClick={toggleUnit}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 border border-slate-200 hover:border-blue-900 px-3 py-1.5 rounded-full transition-all"
        >
          °{unit === "C" ? "C" : "F"} → °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Erreur */}
      {!loading && error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {/* Prévisions */}
      {!loading && !error && forecast.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
          {forecast.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-[#f8f8f7] hover:bg-blue-900 transition-all duration-500 rounded-[2rem] p-6 flex flex-col items-center shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-center w-full">
                <p className="font-condensed font-black text-xs md:text-sm uppercase tracking-widest mb-4 text-blue-900 group-hover:text-blue-200 transition-colors">
                  {item.day}
                </p>

                <div className="mb-4 group-hover:opacity-80 transition-opacity">
                  <WeatherIcon iconCode={item.icon} size={40} />
                </div>

                <p className="text-2xl md:text-3xl font-condensed font-light tracking-tighter text-blue-950 group-hover:text-white transition-colors mb-2">
                  {convertTemp(item.tempC)}
                  <span className="text-lg">°{unit}</span>
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-300 transition-colors text-center leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && forecast.length === 0 && (
        <p className="text-slate-400 italic text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
          Recherchez une ville pour afficher les prévisions détaillées.
        </p>
      )}
    </section>
  );
}
