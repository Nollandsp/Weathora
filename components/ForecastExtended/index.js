"use client";

import { useEffect, useState } from "react";
import WeatherIcon from "@/components/WeatherIcon";
import { useUnit } from "@/hooks/useUnit";
import { Droplets, Wind, ChevronRight, CalendarDays } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="ios-glass rounded-[20px] p-4 flex items-center gap-4">
      <div className="skeleton w-10 h-3 rounded-full shrink-0" />
      <div className="skeleton w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-2.5 w-24 rounded-full" />
        <div className="skeleton h-2 w-16 rounded-full" />
      </div>
      <div className="skeleton h-6 w-12 rounded-lg" />
    </div>
  );
}

export default function ForecastExtended({ fullCityName }) {
  const { unit, toggleUnit, convertTemp } = useUnit();
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!fullCityName) { setForecast([]); setHourly([]); setError(""); return; }

    const fetchForecast = async () => {
      try {
        setLoading(true); setError("");
        const res = await fetch(`/api/weather/forecast?city=${encodeURIComponent(fullCityName)}`);
        const data = await res.json();
        if (!data.list) { setForecast([]); setHourly([]); return; }

        /* Prévisions horaires (8 prochaines = 24h) */
        setHourly(data.list.slice(0, 8).map((entry) => ({
          time: new Date(entry.dt_txt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          icon: entry.weather[0].icon,
          tempC: entry.main.temp,
          rain: entry.pop ? Math.round(entry.pop * 100) : 0,
        })));

        /* Prévisions journalières */
        const days = {};
        data.list.forEach((entry) => {
          const date = new Date(entry.dt_txt);
          const key = date.toISOString().split("T")[0];
          if (!days[key]) days[key] = { entries: [], label: date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" }) };
          days[key].entries.push(entry);
        });

        setForecast(
          Object.entries(days).slice(0, 6).map(([, day]) => {
            const noonEntry = day.entries.find((e) => new Date(e.dt_txt).getHours() === 12) || day.entries[0];
            const temps = day.entries.map((e) => e.main.temp);
            return {
              day: day.label,
              icon: noonEntry.weather[0].icon,
              tempC: noonEntry.main.temp,
              minC: Math.min(...temps),
              maxC: Math.max(...temps),
              desc: noonEntry.weather[0].description,
              humidity: noonEntry.main.humidity,
              wind: Math.round(noonEntry.wind.speed * 3.6),
              rain: noonEntry.pop ? Math.round(noonEntry.pop * 100) : 0,
            };
          })
        );
      } catch {
        setError("Erreur lors du chargement des prévisions");
        setForecast([]); setHourly([]);
      } finally { setLoading(false); }
    };

    fetchForecast();
  }, [fullCityName]);

  if (!fullCityName) return null;

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 pb-24 md:pb-12 mt-4">

      {/* ══ PRÉVISIONS HORAIRES ══ */}
      <div className="mb-4">
        <div className="ios-glass rounded-[24px] p-4">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
            <CalendarDays size={13} className="text-white/50" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Prévisions 24h
            </span>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-14">
                  <div className="skeleton h-3 w-8 rounded-full" />
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="skeleton h-3 w-10 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {hourly.map((h, i) => (
                <div key={i} className={`flex flex-col items-center gap-1.5 shrink-0 w-14 py-2 rounded-2xl transition-all ${i === 0 ? "bg-white/15" : ""}`}>
                  <span className="text-[11px] font-semibold text-white/60">{i === 0 ? "Maint." : h.time}</span>
                  <WeatherIcon iconCode={h.icon} size={28} />
                  <span className="text-sm font-semibold text-white">{convertTemp(h.tempC)}°</span>
                  {h.rain > 0 && (
                    <span className="text-[10px] font-semibold text-blue-300">{h.rain}%</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ PRÉVISIONS 5 JOURS ══ */}
      <div className="ios-glass rounded-[24px] overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CalendarDays size={13} className="text-white/50" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Prévisions 5 jours
            </span>
          </div>
          <button
            onClick={toggleUnit}
            className="text-[11px] font-semibold text-white/50 hover:text-white transition-colors bg-white/10 rounded-full px-3 py-1">
            °{unit === "C" ? "C → F" : "F → C"}
          </button>
        </div>

        {loading && (
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-red-300 text-sm font-medium">{error}</div>
        )}

        {!loading && !error && forecast.length > 0 && (
          <div className="divide-y divide-white/8">
            {forecast.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/8 transition-colors text-left"
                >
                  <span className="text-sm font-semibold text-white/80 w-28 capitalize shrink-0 truncate">
                    {idx === 0 ? "Aujourd'hui" : item.day}
                  </span>

                  <WeatherIcon iconCode={item.icon} size={28} />

                  {item.rain > 0 && (
                    <span className="text-[11px] font-semibold text-blue-300 shrink-0">{item.rain}%</span>
                  )}

                  <div className="flex-1 flex items-center justify-end gap-3">
                    <span className="text-sm font-medium text-white/50 w-8 text-right">{convertTemp(item.minC)}°</span>
                    {/* Barre température */}
                    <div className="flex-1 max-w-[60px] h-1 rounded-full bg-white/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white w-8">{convertTemp(item.maxC)}°</span>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`text-white/30 transition-transform duration-200 shrink-0 ${expanded === idx ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Détails étendus */}
                {expanded === idx && (
                  <div className="px-4 pb-4 grid grid-cols-3 gap-3 animate-ios-appear">
                    <div className="ios-glass-dark rounded-2xl p-3 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Condition</span>
                      <span className="text-xs font-semibold text-white/80 text-center capitalize">{item.desc}</span>
                    </div>
                    <div className="ios-glass-dark rounded-2xl p-3 flex flex-col items-center gap-1">
                      <Droplets size={14} className="text-blue-300" />
                      <span className="text-sm font-semibold text-white">{item.humidity}%</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">Humidité</span>
                    </div>
                    <div className="ios-glass-dark rounded-2xl p-3 flex flex-col items-center gap-1">
                      <Wind size={14} className="text-white/60" />
                      <span className="text-sm font-semibold text-white">{item.wind} km/h</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">Vent</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && forecast.length === 0 && (
          <p className="p-8 text-white/40 text-sm text-center font-medium">
            Recherchez une ville pour afficher les prévisions.
          </p>
        )}
      </div>
    </div>
  );
}
