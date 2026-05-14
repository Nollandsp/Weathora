"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import WeatherIcon from "@/components/WeatherIcon";
import { useUnit } from "@/hooks/useUnit";

export default function Favoris() {
  const { unit, toggleUnit, convertTemp } = useUnit();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserAndFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("profiles_id", user.id);

        if (!error && data) {
          const favoritesWithWeather = await Promise.all(
            data.map(async (fav) => {
              try {
                const res = await fetch(`/api/weather/current?city=${encodeURIComponent(fav.city_name)}`);
                const w = await res.json();
                return {
                  ...fav,
                  iconCode: w.weather?.[0]?.icon ?? null,
                  temperature: w.main?.temp ?? null,
                  humidity: w.main?.humidity ?? "-",
                  pressure: w.main?.pressure ?? "-",
                  wind: w.wind?.speed ?? "-",
                  weather_condition: w.weather?.[0]?.description ?? "Inconnue",
                };
              } catch {
                return { ...fav, iconCode: null, temperature: null, humidity: "-", pressure: "-", wind: "-", weather_condition: "Erreur" };
              }
            })
          );
          setFavorites(favoritesWithWeather);
        }
      }
      setLoading(false);
    };
    getUserAndFavorites();
  }, []);

  const handleDeleteFavorite = async (favoriteId) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId)
      .eq("profiles_id", currentUser.id);
    if (!error) setFavorites(favorites.filter((f) => f.id !== favoriteId));
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  }).toUpperCase();

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#A8A498" }}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[4px] p-12 max-w-lg w-full text-center shadow-2xl">
            <h2 className="font-condensed text-5xl font-black text-white uppercase mb-4 leading-none tracking-tighter">
              Accès Privé
            </h2>
            <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              Connectez-vous pour consulter vos favoris
            </p>
            <Link
              href="/Connexion"
              className="inline-block bg-white text-stone-800 px-10 py-4 text-xs font-condensed font-black tracking-[0.2em] uppercase hover:bg-stone-100 transition-all shadow-lg"
            >
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
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#A8A498" }}>
        {/* Filigrane */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16rem] font-condensed font-black text-white/5 pointer-events-none select-none uppercase leading-none">
          FAVORIS
        </div>

        <div className="relative z-10 pt-40 pb-12">
          <div className="container mx-auto px-8">
            {/* En-tête */}
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="font-condensed text-[80px] md:text-[120px] font-black text-white uppercase leading-none tracking-tight">
                  FAVORIS
                </h1>
                <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mt-2">
                  {today} — {favorites.length} VILLE{favorites.length > 1 ? "S" : ""} ENREGISTRÉE{favorites.length > 1 ? "S" : ""}
                </p>
              </div>
              {/* Toggle °C / °F */}
              <button
                onClick={toggleUnit}
                className="self-start sm:self-end text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded-full transition-all"
              >
                Afficher en °{unit === "C" ? "F" : "C"}
              </button>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white/10 rounded-[4px] animate-pulse h-56" />
                ))}
              </div>
            )}

            {!loading && favorites.length === 0 && (
              <div className="max-w-md">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10">
                  <p className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-4">Aucune donnée</p>
                  <p className="font-condensed text-white text-2xl font-black uppercase mb-6">
                    Aucune ville configurée dans le système.
                  </p>
                  <Link href="/" className="inline-block bg-white text-stone-800 px-8 py-3 text-xs font-condensed font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all">
                    Ajouter une ville
                  </Link>
                </div>
              </div>
            )}

            {!loading && favorites.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
                {favorites.map((fav, index) => (
                  <div
                    key={fav.id}
                    className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                    style={{ animationDelay: `${index * 200}ms`, borderRadius: "4px" }}
                  >
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-condensed text-3xl font-black text-white uppercase leading-none">
                            {fav.city_name}
                          </h3>
                          <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
                            {fav.weather_condition}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {fav.iconCode && <WeatherIcon iconCode={fav.iconCode} size={28} />}
                          <button
                            onClick={() => handleDeleteFavorite(fav.id)}
                            className="text-white/30 hover:text-white/80 transition-colors p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="font-condensed text-[64px] font-black text-white leading-none">
                          {fav.temperature !== null ? convertTemp(fav.temperature) : "-"}°{unit}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-white/10">
                      <div className="p-4 text-center">
                        <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase">Humidité</p>
                        <p className="font-condensed text-white font-black text-lg mt-1">{fav.humidity}%</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase">Vent</p>
                        <p className="font-condensed text-white font-black text-lg mt-1">
                          {fav.wind}<span className="text-[10px] text-white/50 ml-1">m/s</span>
                        </p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase">Pression</p>
                        <p className="font-condensed text-white font-black text-lg mt-1">
                          {fav.pressure}<span className="text-[9px] text-white/50 ml-1">hPa</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
