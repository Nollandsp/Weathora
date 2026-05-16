"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Heart,
  Search,
  LocateFixed,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  CloudRain,
  Gauge as GaugeIcon,
  Navigation,
  Activity,
} from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { useUnit } from "@/hooks/useUnit";
import { toast } from "sonner";

/* ── Gradient iOS par condition météo ── */
function getSkyClass(weatherMain, icon) {
  const isNight = icon && icon.endsWith("n");
  const cond = weatherMain?.toLowerCase() || "";
  if (cond === "clear")
    return isNight ? "ios-sky-clear-night" : "ios-sky-clear-day";
  if (cond === "clouds") return "ios-sky-cloudy";
  if (cond === "rain") return "ios-sky-rain";
  if (cond === "drizzle") return "ios-sky-drizzle";
  if (cond === "thunderstorm") return "ios-sky-thunder";
  if (cond === "snow") return "ios-sky-snow";
  if (cond === "mist" || cond === "fog" || cond === "haze")
    return "ios-sky-mist";
  return "ios-sky-default";
}

/* ── Direction du vent en texte ── */
function windDir(deg) {
  if (deg === null || deg === undefined) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}

/* ── AQI label ── */
function aqiLabel(aqi) {
  const labels = ["", "Excellent", "Bon", "Modéré", "Mauvais", "Très mauvais"];
  const colors = [
    "",
    "text-emerald-300",
    "text-green-300",
    "text-yellow-300",
    "text-orange-300",
    "text-red-400",
  ];
  return { label: labels[aqi] || "—", color: colors[aqi] || "text-white/60" };
}

/* ── Mini widget iOS ── */
function Widget({ Icon, label, value, unit, sub, color = "text-white" }) {
  return (
    <div className="ios-glass rounded-[20px] p-4 flex flex-col gap-2 min-h-[110px]">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-white/50" strokeWidth={2} />}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
          {label}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className={`text-2xl font-semibold leading-none ${color}`}>
          {value}
          {unit && (
            <span className="text-base font-normal text-white/70 ml-0.5">
              {unit}
            </span>
          )}
        </p>
        {sub && <p className="text-[11px] text-white/50 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function MainWeather({ setFullCityName, setCoords }) {
  const { unit, toggleUnit, convertTemp } = useUnit();

  const inputRef = useRef(null);
  const [skyClass, setSkyClass] = useState("ios-sky-default");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cityName, setCityName] = useState("");
  const [cityDesc, setCityDesc] = useState("");
  const [iconCode, setIconCode] = useState(null);
  const [weatherMain, setWeatherMain] = useState("");
  const [tempC, setTempC] = useState(null);
  const [tempMinC, setTempMinC] = useState(null);
  const [tempMaxC, setTempMaxC] = useState(null);
  const [feelsC, setFeelsC] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [windDeg, setWindDeg] = useState(null);
  const [windGust, setWindGust] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [clouds, setClouds] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [weatherDesc, setWeatherDesc] = useState("");
  const [aqi, setAqi] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("favorites")
          .select("city_name")
          .eq("profiles_id", session.user.id)
          .then(({ data, error }) => {
            if (!error && data) setFavorites(data.map((f) => f.city_name));
          });
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceRef.current);
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=departement&boost=population&limit=5`,
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        if (data.length === 0) setError("Ville non trouvée");
        else setError("");
      } catch {
        setError("Erreur de connexion.");
      }
    }, 300);
  };

  const handleSuggestionClick = (commune) => {
    inputRef.current.value = commune.nom;
    setSuggestions([]);
    setShowSuggestions(false);
    getWeather(commune.nom);
    setShowSearch(false);
  };

  const getWeather = useCallback(
    async (city) => {
      try {
        setError("");
        const geoRes = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(city)}&fields=departement&boost=population&limit=1`,
        );
        const geoData = await geoRes.json();
        if (geoData.length === 0) {
          setError("Ville non trouvée");
          return;
        }

        const fullCity = geoData[0].nom;
        const dept = geoData[0].departement.nom;
        setFullCityName(fullCity);
        setCityName(fullCity);
        setCityDesc(dept);

        const res = await fetch(
          `/api/weather/current?city=${encodeURIComponent(fullCity)}`,
        );
        const data = await res.json();
        if (data.cod !== 200) {
          setError("Erreur météo : " + data.message);
          return;
        }

        const {
          weather,
          main,
          wind,
          coord,
          visibility: vis,
          clouds: cl,
          sys,
        } = data;
        setIconCode(weather[0].icon);
        setWeatherDesc(weather[0].description);
        setWeatherMain(weather[0].main);
        setTempC(main.temp);
        setTempMinC(main.temp_min);
        setTempMaxC(main.temp_max);
        setFeelsC(main.feels_like);
        setWindSpeed(wind.speed);
        setWindDeg(wind.deg ?? null);
        setWindGust(wind.gust ?? null);
        setHumidity(main.humidity);
        setPressure(main.pressure);
        setVisibility(vis ? Math.round(vis / 1000) : null);
        setClouds(cl?.all ?? null);
        setSunrise(sys?.sunrise ?? null);
        setSunset(sys?.sunset ?? null);
        setSkyClass(getSkyClass(weather[0].main, weather[0].icon));
        if (setCoords) setCoords({ lat: coord.lat, lon: coord.lon });

        // Qualité de l'air
        const airRes = await fetch(
          `/api/weather/air?lat=${coord.lat}&lon=${coord.lon}`,
        );
        const airData = await airRes.json();
        if (airData?.list?.[0]?.main?.aqi) setAqi(airData.list[0].main.aqi);
      } catch {
        setError("Erreur de connexion");
      }
    },
    [setFullCityName, setCoords],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = inputRef.current?.value.trim();
    if (city) {
      getWeather(city);
      setShowSearch(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await res.json();
          if (data.length > 0) {
            const cityFound = data[0].name;
            if (inputRef.current) inputRef.current.value = cityFound;
            await getWeather(cityFound);
          } else {
            setError("Ville non trouvée à votre position.");
          }
        } catch {
          setError("Erreur de géolocalisation.");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setError("Position refusée.");
        setGeoLoading(false);
      },
    );
  };

  const handleAddFavorite = async () => {
    if (!user) {
      setError("Connexion requise.");
      setTimeout(() => {
        window.location.href = "/Connexion";
      }, 1500);
      return;
    }
    const city = inputRef.current?.value.trim();
    if (!city) return;
    if (favorites.length >= 3) {
      toast.error("Maximum 3 favoris.");
      return;
    }
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("profiles_id", user.id)
      .eq("city_name", city)
      .maybeSingle();
    if (existing) {
      toast.error("Déjà dans vos favoris.");
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { error: insertError } = await supabase
      .from("favorites")
      .insert({ profiles_id: session.user.id, city_name: city });
    if (insertError) {
      toast.error("Erreur lors de l'ajout.");
      return;
    }
    setFavorites([...favorites, city]);
    toast.success(`${city} ajouté !`);
  };

  const fmt = (c) => (c !== null ? `${convertTemp(c)}°` : "—");
  const fmtTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const aqiInfo = aqiLabel(aqi);

  return (
    <main
      className={`w-full min-h-screen flex flex-col transition-all duration-1000 ${skyClass}`}
    >
      {/* ══ BARRE DE RECHERCHE FLOTTANTE ══ */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9998] md:hidden w-[90vw] max-w-sm">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="ios-glass w-full rounded-[14px] px-4 py-2.5 flex items-center gap-3 text-white/70"
          >
            <Search size={16} strokeWidth={2} />
            <span className="text-sm font-medium">
              {cityName || "Rechercher une ville..."}
            </span>
            <LocateFixed
              size={16}
              strokeWidth={2}
              className={`ml-auto ${geoLoading ? "animate-pulse text-white" : "text-white/50"} cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                handleGeolocate();
              }}
            />
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <div className="ios-glass rounded-[14px] flex items-center gap-2 px-3 py-2">
              <Search size={16} className="text-white/50 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Paris, Lyon..."
                onChange={handleInputChange}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                onBlur={() =>
                  setTimeout(() => {
                    setShowSuggestions(false);
                    setShowSearch(false);
                  }, 180)
                }
                autoFocus
                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-white/50 text-sm shrink-0"
              >
                ✕
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 rounded-[14px] ios-glass-dark overflow-hidden animate-fade-in">
                {suggestions.map((c, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSuggestionClick(c)}
                    className="px-4 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between"
                  >
                    {c.nom}
                    <span className="text-white/40 text-xs">
                      {c.departement?.nom}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </form>
        )}
      </div>

      {/* ══ SECTION PRINCIPALE : météo iOS ══ */}
      <section className="relative flex flex-col items-center justify-start pt-28 md:pt-36 pb-8 px-5 min-h-[100svh] md:min-h-[auto]">
        {/* Barre de recherche desktop (au-dessus du pill navbar, invisible sur mobile) */}
        <div className="hidden md:block absolute top-24 right-8 lg:right-16 z-10">
          <form onSubmit={handleSubmit} className="relative">
            <div className="ios-glass rounded-2xl flex items-center gap-2 px-4 py-3 w-72">
              <Search size={16} className="text-white/50 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                placeholder={cityName || "Rechercher une ville..."}
                onChange={handleInputChange}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                className="flex-1 bg-transparent text-white placeholder-white/50 text-sm font-medium outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleGeolocate}
                title="Ma position"
                className="text-white/50 hover:text-white transition-colors"
              >
                <LocateFixed
                  size={16}
                  className={geoLoading ? "animate-pulse text-white" : ""}
                />
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 rounded-2xl ios-glass-dark overflow-hidden animate-fade-in z-50">
                {suggestions.map((c, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSuggestionClick(c)}
                    className="px-4 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between"
                  >
                    {c.nom}
                    <span className="text-white/40 text-xs">
                      {c.departement?.nom}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </form>
          {error && (
            <p className="mt-2 text-[11px] font-semibold text-red-300 text-right animate-fade-in">
              {error}
            </p>
          )}
        </div>

        {/* ── Ville + Date ── */}
        <div className="text-center animate-ios-appear">
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-semibold text-white tracking-tight leading-none">
            {cityName || "Recherchez une ville"}
          </h1>
          {cityDesc && (
            <p className="text-white/60 text-sm font-medium mt-1 capitalize">
              {cityDesc}
            </p>
          )}
          {!cityName && (
            <p className="text-white/50 text-sm mt-1">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          )}
        </div>

        {/* ── Température géante ── */}
        <div
          className="flex flex-col items-center mt-2 animate-ios-appear"
          style={{ animationDelay: "0.05s" }}
        >
          {cityName && iconCode && (
            <div className="animate-float mb-1">
              <WeatherIcon iconCode={iconCode} size={64} />
            </div>
          )}
          <div className="flex items-start leading-none">
            <span className="text-[clamp(5rem,22vw,9rem)] font-thin text-white tracking-tighter">
              {tempC !== null ? convertTemp(tempC) : "—"}
            </span>
            <span className="text-[clamp(2rem,6vw,3.5rem)] font-thin text-white mt-4 ml-1">
              °{unit}
            </span>
          </div>

          {cityName && (
            <p className="text-white/80 text-lg font-light capitalize -mt-1">
              {weatherDesc || ""}
            </p>
          )}

          {/* H / L */}
          {tempMinC !== null && tempMaxC !== null && (
            <p className="text-white/60 text-sm font-medium mt-1">
              H : {fmt(tempMaxC)} · L : {fmt(tempMinC)}
            </p>
          )}
        </div>

        {/* ── Favoris sous la temp ── */}
        <div
          className="mt-4 flex flex-col items-center gap-2 animate-ios-appear"
          style={{ animationDelay: "0.1s" }}
        >
          {user && cityName && (
            <button
              onClick={handleAddFavorite}
              className="ios-glass rounded-full px-4 py-1.5 flex items-center gap-1.5 text-white/80 text-xs font-semibold hover:bg-white/20 transition-all"
            >
              <Heart size={12} /> Ajouter aux favoris
            </button>
          )}
          {favorites.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {favorites.slice(0, 3).map((fav, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = fav;
                    getWeather(fav);
                  }}
                  className="ios-glass rounded-full px-3 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/20 transition-all"
                >
                  {fav}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Bouton toggle unité ── */}
        <button
          onClick={toggleUnit}
          className="mt-3 ios-glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white/60 text-[11px] font-semibold hover:bg-white/20 transition-all animate-ios-appear"
          style={{ animationDelay: "0.12s" }}
        >
          <Thermometer size={11} />
          {unit === "C" ? "°F" : "°C"}
        </button>

        {/* ── WIDGETS GRID ── */}
        {cityName && (
          <div
            className="w-full max-w-2xl mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-ios-appear"
            style={{ animationDelay: "0.18s" }}
          >
            <Widget
              Icon={Thermometer}
              label="Ressenti"
              value={feelsC !== null ? convertTemp(feelsC) : "—"}
              unit={`°${unit}`}
              sub={
                feelsC !== null && feelsC < tempC ? "Plus froid" : "Similaire"
              }
            />
            <Widget
              Icon={Wind}
              label="Vent"
              value={windSpeed !== null ? Math.round(windSpeed * 3.6) : "—"}
              unit="km/h"
              sub={`${windDir(windDeg)} · Rafales ${windGust ? Math.round(windGust * 3.6) : "—"} km/h`}
            />
            <Widget
              Icon={Droplets}
              label="Humidité"
              value={humidity !== null ? humidity : "—"}
              unit="%"
              sub={
                humidity > 70 ? "Élevée" : humidity > 40 ? "Normale" : "Faible"
              }
            />
            <Widget
              Icon={Eye}
              label="Visibilité"
              value={visibility !== null ? visibility : "—"}
              unit=" km"
              sub={
                visibility >= 10
                  ? "Excellente"
                  : visibility >= 5
                    ? "Bonne"
                    : "Réduite"
              }
            />
            <Widget
              Icon={GaugeIcon}
              label="Pression"
              value={pressure !== null ? pressure : "—"}
              unit=" hPa"
              sub={
                pressure > 1013
                  ? "Haute"
                  : pressure < 1000
                    ? "Basse"
                    : "Normale"
              }
            />
            <Widget
              Icon={Activity}
              label="Qualité air"
              value={aqi ? aqiLabel(aqi).label : "—"}
              color={aqi ? aqiLabel(aqi).color : "text-white/60"}
              sub={aqi ? `Indice ${aqi}/5` : "Non disponible"}
            />
            {sunrise && (
              <Widget
                Icon={Sunrise}
                label="Lever"
                value={fmtTime(sunrise)}
                sub="Heure solaire"
              />
            )}
            {sunset && (
              <Widget
                Icon={Sunset}
                label="Coucher"
                value={fmtTime(sunset)}
                sub="Heure solaire"
              />
            )}
            {clouds !== null && (
              <Widget
                Icon={CloudRain}
                label="Nuages"
                value={clouds}
                unit="%"
                sub={
                  clouds > 80
                    ? "Très nuageux"
                    : clouds > 40
                      ? "Partiellement"
                      : "Dégagé"
                }
              />
            )}
          </div>
        )}

        {/* Invite recherche si pas de ville */}
        {!cityName && (
          <div
            className="mt-12 text-center animate-ios-appear"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-white/50 text-sm font-medium">
              Recherchez une ville pour afficher la météo
            </p>
            <button
              onClick={handleGeolocate}
              className="mt-3 ios-glass rounded-full px-5 py-2.5 flex items-center gap-2 text-white/80 text-sm font-semibold mx-auto hover:bg-white/20 transition-all"
            >
              <LocateFixed
                size={16}
                className={geoLoading ? "animate-pulse" : ""}
              />
              Utiliser ma position
            </button>
          </div>
        )}

        {/* Erreur mobile */}
        {error && (
          <p className="mt-3 text-[11px] font-semibold text-red-300 text-center animate-fade-in md:hidden">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
