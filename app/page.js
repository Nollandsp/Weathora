"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MainWeather from "@/components/MainWeather";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ForecastExtended from "@/components/ForecastExtended";
import { MapPin } from "lucide-react";

const WeatherMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [fullCityName, setFullCityName] = useState("");
  const [coords, setCoords] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MainWeather gère son propre fond (sky gradient) */}
      <MainWeather setFullCityName={setFullCityName} setCoords={setCoords} />

      {/* Section prévisions + widgets — même fond que MainWeather via continuation du gradient */}
      <div className="flex-grow bg-gradient-to-b from-[#1e3a5f] via-[#1a3060] to-[#16284e]">
        <ForecastExtended fullCityName={fullCityName} />

        {/* Carte des précipitations */}
        {coords && (
          <section className="px-4 md:px-8 lg:px-16 pb-8">
            <div className="ios-glass rounded-[24px] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/10">
                <MapPin size={13} className="text-white/50" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                  Localisation — {fullCityName}
                </span>
              </div>
              <div className="h-64 md:h-80">
                <WeatherMap lat={coords.lat} lon={coords.lon} cityName={fullCityName} />
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </div>
  );
}
