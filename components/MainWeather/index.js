"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Heart, Search, LocateFixed, Thermometer, Droplets, Gauge } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { Badge } from "@/components/ui/badge";
import { useUnit } from "@/hooks/useUnit";
import { toast } from "sonner";

function updateBackground(weatherMain) {
  const map = {
    clear: "/clear2.webp",
    clouds: "/clouds.jpg",
    rain: "/rain.jpg",
    drizzle: "/rain.jpg",
    thunderstorm: "/thunderstorm.jpg",
    snow: "/snow.jpg",
    mist: "/mist.jpg",
    fog: "/mist.jpg",
    haze: "/mist.jpg",
  };
  return map[weatherMain?.toLowerCase()] || "";
}

export default function MainWeather({ setFullCityName, setCoords }) {
  const { unit, toggleUnit, convertTemp } = useUnit();

  const inputRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cityName, setCityName] = useState("");
  const [cityDesc, setCityDesc] = useState("");
  const [iconCode, setIconCode] = useState(null);
  const [tempC, setTempC] = useState(null);
  const [feelsC, setFeelsC] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [weatherDesc, setWeatherDesc] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

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
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=departement&boost=population&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        if (data.length === 0) setError("Ville non trouvée, réessayer");
        else setError("");
      } catch {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    }, 300);
  };

  const handleSuggestionClick = (commune) => {
    inputRef.current.value = commune.nom;
    setSuggestions([]);
    setShowSuggestions(false);
    getWeather(commune.nom);
  };

  const getWeather = useCallback(async (city) => {
    try {
      setError("");
      const geoRes = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(city)}&fields=departement&boost=population&limit=1`
      );
      const geoData = await geoRes.json();
      if (geoData.length === 0) { setError("Ville non trouvée"); return; }

      const fullCity = geoData[0].nom;
      const dept = geoData[0].departement.nom;
      setFullCityName(fullCity);
      setCityName(fullCity);
      setCityDesc(dept);

      const res = await fetch(`/api/weather/current?city=${encodeURIComponent(fullCity)}`);
      const data = await res.json();

      if (data.cod !== 200) { setError("Erreur météo : " + data.message); return; }

      const { weather, main, wind, coord } = data;
      setIconCode(weather[0].icon);
      setWeatherDesc(weather[0].description);
      setTempC(main.temp);
      setFeelsC(main.feels_like);
      setWindSpeed(wind.speed);
      setHumidity(main.humidity);
      setPressure(main.pressure);
      setBackgroundImage(updateBackground(weather[0].main));
      if (setCoords) setCoords({ lat: coord.lat, lon: coord.lon });
    } catch {
      setError("Erreur de connexion");
    }
  }, [setFullCityName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = inputRef.current?.value.trim();
    if (city) getWeather(city);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError("Géolocalisation non supportée."); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/weather/reverse?lat=${coords.latitude}&lon=${coords.longitude}`);
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
      () => { setError("Position refusée — autorisez la localisation dans les réglages du navigateur."); setGeoLoading(false); }
    );
  };

  const handleAddFavorite = async () => {
    if (!user) {
      setError("Connexion requise pour ajouter une ville aux favoris.");
      setTimeout(() => { window.location.href = "/Connexion"; }, 1500);
      return;
    }
    const city = inputRef.current?.value.trim();
    if (!city) return;
    if (favorites.length >= 3) { toast.error("Vous ne pouvez avoir que 3 favoris."); return; }

    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("profiles_id", user.id)
      .eq("city_name", city)
      .maybeSingle();

    if (existing) { toast.error("Cette ville est déjà dans vos favoris."); return; }

    const { data: { session } } = await supabase.auth.getSession();
    const { error: insertError } = await supabase.from("favorites").insert({
      profiles_id: session.user.id,
      city_name: city,
    });
    if (insertError) { toast.error("Erreur lors de l'ajout aux favoris."); return; }
    setFavorites([...favorites, city]);
    toast.success(`${city} ajouté aux favoris !`);
  };

  const displayTemp = (celsius) => {
    if (celsius === null) return "--";
    return `${convertTemp(celsius)}°${unit}`;
  };

  return (
    <main className="w-full flex flex-col">
      <section className="relative w-full bg-[#A8A498] min-h-[100svh] lg:min-h-[600px] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 pt-36 lg:pt-32 pb-12 text-white">
        {/* Fond photo météo */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image src={backgroundImage} alt="Météo" fill priority className="object-cover transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Ancre scroll */}
        <div id="decouvrir" className="absolute top-0" aria-hidden="true" style={{ marginTop: "-64px", height: "64px" }} />

        {/* ── GAUCHE : infos météo ── */}
        <div className="z-10 flex flex-col items-center lg:items-start text-center lg:text-left mb-10 lg:mb-0 w-full lg:w-1/2">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-condensed font-black uppercase tracking-wide mb-1 leading-none drop-shadow-md">
            {cityName || "RECHERCHEZ UNE VILLE"}
          </h1>
          <p className="text-sm md:text-lg font-bold opacity-90 uppercase tracking-[0.2em] mb-3 lg:mb-12">
            {cityDesc ? `${cityDesc} • ` : ""}
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>

          {cityName && (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              {/* Température principale */}
              <div className="flex items-start">
                <span className="text-[100px] md:text-[130px] lg:text-[160px] font-condensed font-extralight leading-none tracking-tighter">
                  {tempC !== null ? convertTemp(tempC) : "--"}
                </span>
                <span className="text-5xl font-condensed font-light mt-6">°{unit}</span>
              </div>

              <div className="flex flex-col items-center sm:items-start gap-1">
                <Badge variant="outline" className="text-white border-white/40 bg-white/10 font-condensed font-black uppercase tracking-wider text-sm px-3 py-1 rounded-full">
                  {weatherDesc}
                </Badge>
                <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
                  Ressenti {displayTemp(feelsC)}
                </p>
                <p className="text-xs opacity-60 italic">Vent : {windSpeed !== null ? `${windSpeed} m/s` : "--"}</p>
                <div className="flex gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs opacity-60">
                    <Droplets size={11} /> {humidity !== null ? `${humidity}%` : "--"}
                  </span>
                  <span className="flex items-center gap-1 text-xs opacity-60">
                    <Gauge size={11} /> {pressure !== null ? `${pressure} hPa` : "--"}
                  </span>
                </div>

                {/* Toggle °C / °F */}
                <button
                  onClick={toggleUnit}
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-all"
                >
                  <Thermometer size={11} />
                  {unit === "C" ? "Passer en °F" : "Passer en °C"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── DROITE : icône + recherche ── */}
        <div className="z-10 flex flex-col items-center lg:items-end justify-center gap-8 w-full lg:w-1/3">
          {/* Icône météo moderne */}
          {iconCode && (
            <div className="animate-float lg:mr-8">
              <WeatherIcon iconCode={iconCode} size={72} />
            </div>
          )}

          {/* Formulaire de recherche */}
          <div className="relative w-full max-w-[350px] md:max-w-[400px] lg:max-w-[320px]">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="search"
                    placeholder={cityName || "Paris..."}
                    onChange={handleInputChange}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="w-full rounded-2xl border border-white/30 bg-white/10 py-4 pl-6 pr-12 text-white placeholder-white/70 backdrop-blur-md outline-none focus:bg-white/20 focus:border-white/50 transition-all font-bold"
                    autoComplete="off"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
                    <Search size={18} />
                  </div>
                </div>

                {/* Bouton géolocalisation */}
                <button
                  type="button"
                  onClick={handleGeolocate}
                  disabled={geoLoading}
                  title="Détecter ma position"
                  className="flex-shrink-0 flex items-center justify-center w-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 transition-all disabled:opacity-50"
                >
                  <LocateFixed size={18} className={geoLoading ? "animate-pulse" : ""} />
                </button>
              </div>

              {/* Suggestions React */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl bg-black/95 border border-white/20 shadow-2xl overflow-hidden animate-fade-in">
                  {suggestions.map((commune, i) => (
                    <li
                      key={i}
                      onMouseDown={() => handleSuggestionClick(commune)}
                      className="px-5 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                    >
                      {commune.nom}
                      <span className="ml-2 text-white/40 text-xs">({commune.departement?.nom})</span>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            {/* Erreur de recherche (ville non trouvée) */}
            {error && (
              <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-red-300 animate-fade-in">
                {error}
              </p>
            )}

            {/* Favoris */}
            <div className="mt-6 w-full flex flex-col items-center lg:items-end gap-3">
              {user && cityName && (
                <button
                  onClick={handleAddFavorite}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full transition-all text-white"
                >
                  <Heart size={12} />
                  Ajouter aux favoris
                </button>
              )}

              {favorites.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-end gap-2 w-full">
                  {favorites.slice(0, 3).map((fav, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (inputRef.current) inputRef.current.value = fav;
                        getWeather(fav);
                      }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/30 border border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      {fav}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
