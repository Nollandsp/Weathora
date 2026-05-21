"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import WeatherIcon from "@/components/WeatherIcon";
import { useUnit } from "@/hooks/useUnit";
import { Trash2, Heart, Wind, Droplets, Gauge } from "lucide-react";

function getSkyClass(weatherMain, icon) {
  const isNight = icon && icon.endsWith("n");
  const cond = weatherMain?.toLowerCase() || "";
  if (cond === "clear") return isNight ? "ios-sky-clear-night" : "ios-sky-clear-day";
  if (cond === "clouds") return "ios-sky-cloudy";
  if (cond === "rain" || cond === "drizzle") return "ios-sky-rain";
  if (cond === "thunderstorm") return "ios-sky-thunder";
  if (cond === "snow") return "ios-sky-snow";
  if (cond === "mist" || cond === "fog" || cond === "haze") return "ios-sky-mist";
  return "ios-sky-default";
}

export default function Favoris() {
  const { unit, toggleUnit, convertTemp } = useUnit();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const pendingDeletes = useRef({});

  useEffect(() => {
    const getUserAndFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        const { data, error } = await supabase.from("favorites").select("*").eq("profiles_id", user.id);
        if (!error && data) {
          const withWeather = await Promise.all(
            data.map(async (fav) => {
              try {
                const res = await fetch(`/api/weather/current?city=${encodeURIComponent(fav.city_name)}`);
                const w = await res.json();
                return {
                  ...fav,
                  iconCode: w.weather?.[0]?.icon ?? null,
                  weatherMain: w.weather?.[0]?.main ?? "",
                  temperature: w.main?.temp ?? null,
                  tempMin: w.main?.temp_min ?? null,
                  tempMax: w.main?.temp_max ?? null,
                  humidity: w.main?.humidity ?? null,
                  pressure: w.main?.pressure ?? null,
                  wind: w.wind?.speed ?? null,
                  weather_condition: w.weather?.[0]?.description ?? "Inconnue",
                };
              } catch {
                return { ...fav, iconCode: null, weatherMain: "", temperature: null, humidity: null, pressure: null, wind: null, weather_condition: "Erreur" };
              }
            })
          );
          setFavorites(withWeather);
        }
      }
      setLoading(false);
    };
    getUserAndFavorites();
  }, []);

  const handleDelete = (id) => {
    if (!user) return;
    const originalIndex = favorites.findIndex((f) => f.id === id);
    const item = favorites[originalIndex];
    if (!item) return;

    // Suppression optimiste immédiate
    setFavorites((prev) => prev.filter((f) => f.id !== id));

    // Vraie suppression DB après 5s
    const timeoutId = setTimeout(async () => {
      delete pendingDeletes.current[id];
      await supabase.from("favorites").delete().eq("id", id).eq("profiles_id", user.id);
    }, 5000);

    pendingDeletes.current[id] = { item, originalIndex, timeoutId };

    toast(`${item.city_name} retiré des favoris`, {
      duration: 5000,
      action: {
        label: "Annuler",
        onClick: () => {
          const pending = pendingDeletes.current[id];
          if (!pending) return;
          clearTimeout(pending.timeoutId);
          delete pendingDeletes.current[id];
          setFavorites((prev) => {
            const restored = [...prev];
            restored.splice(pending.originalIndex, 0, pending.item);
            return restored;
          });
        },
      },
    });
  };

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  /* ── Non connecté ── */
  if (!user && !loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen ios-sky-default flex items-center justify-center p-6">
          <div className="ios-glass rounded-[28px] p-10 max-w-sm w-full text-center animate-ios-appear">
            <Heart size={40} className="text-white/40 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-2">Accès privé</h2>
            <p className="text-white/50 text-sm mb-8">Connectez-vous pour accéder à vos villes favorites</p>
            <Link href="/Connexion"
              className="block w-full bg-white text-gray-900 font-semibold py-3 rounded-2xl text-sm hover:bg-white/90 transition-all">
              Se connecter
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-default flex flex-col">

        {/* Header */}
        <div className="pt-24 md:pt-28 pb-4 px-5 md:px-8 lg:px-16">
          <div className="flex items-end justify-between gap-4 mb-6 animate-ios-appear">
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1 capitalize">{today}</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Mes favoris</h1>
              {!loading && (
                <p className="text-white/40 text-sm mt-1">
                  {favorites.length} ville{favorites.length !== 1 ? "s" : ""} enregistrée{favorites.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button onClick={toggleUnit}
              className="ios-glass rounded-full px-4 py-2 text-[11px] font-semibold text-white/60 hover:text-white transition-colors shrink-0">
              °{unit === "C" ? "F" : "C"}
            </button>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="ios-glass rounded-[24px] h-52 animate-pulse" />
              ))}
            </div>
          )}

          {/* Vide */}
          {!loading && favorites.length === 0 && (
            <div className="ios-glass rounded-[24px] p-10 max-w-sm animate-ios-appear">
              <Heart size={36} className="text-white/30 mb-5" />
              <p className="text-white/50 text-sm mb-6">Aucune ville enregistrée. Recherchez une ville et ajoutez-la à vos favoris.</p>
              <Link href="/" className="block bg-white text-gray-900 font-semibold py-3 px-6 rounded-2xl text-sm text-center hover:bg-white/90 transition-all">
                Explorer la météo
              </Link>
            </div>
          )}

          {/* Grille de favoris */}
          {!loading && favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav, idx) => (
                <Link
                  key={fav.id}
                  href={`/?city=${encodeURIComponent(fav.city_name)}`}
                  className={`relative rounded-[24px] overflow-hidden group cursor-pointer animate-ios-appear`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  {/* Fond gradient par condition */}
                  <div className={`absolute inset-0 ${getSkyClass(fav.weatherMain, fav.iconCode)}`} />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Contenu */}
                  <div className="relative z-10 p-5">
                    {/* Top: ville + icône + suppression */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white leading-tight">{fav.city_name}</h3>
                        <p className="text-white/60 text-xs capitalize mt-0.5">{fav.weather_condition}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {fav.iconCode && <WeatherIcon iconCode={fav.iconCode} size={36} />}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(fav.id); }}
                          aria-label="Supprimer"
                          className="ios-glass rounded-full p-2 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Température */}
                    <p className="text-5xl font-thin text-white leading-none tracking-tight">
                      {fav.temperature !== null ? convertTemp(fav.temperature) : "—"}°
                      <span className="text-2xl">{unit}</span>
                    </p>

                    {/* H/L */}
                    {fav.tempMin !== null && fav.tempMax !== null && (
                      <p className="text-white/50 text-xs mt-1">
                        H : {convertTemp(fav.tempMax)}° · L : {convertTemp(fav.tempMin)}°
                      </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/15">
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Droplets size={12} />
                        <span>{fav.humidity !== null ? `${fav.humidity}%` : "—"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Wind size={12} />
                        <span>{fav.wind !== null ? `${Math.round(fav.wind * 3.6)} km/h` : "—"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Gauge size={12} />
                        <span>{fav.pressure !== null ? `${fav.pressure} hPa` : "—"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Upsell Premium */}
          {!loading && favorites.length >= 2 && (
            <Link
              href="/premium"
              className="mt-4 flex items-center justify-between gap-4 ios-glass rounded-2xl px-5 py-3.5 animate-ios-appear hover:bg-white/10 transition-colors group"
            >
              <p className="text-white/60 text-sm">
                <span className="text-white/90 font-semibold">{favorites.length}/3 favoris</span>
                {favorites.length === 3
                  ? " — Limite atteinte. Passez Premium pour des favoris illimités."
                  : " — Bientôt à la limite. Passez Premium pour des favoris illimités."}
              </p>
              <span className="text-white/50 group-hover:text-white text-xs font-semibold shrink-0 transition-colors">
                Premium →
              </span>
            </Link>
          )}
        </div>

        <div className="flex-1" />
        <Footer />
      </div>
    </>
  );
}
