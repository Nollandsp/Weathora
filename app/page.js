"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MainWeather from "@/components/MainWeather";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ForecastExtended from "@/components/ForecastExtended";

const WeatherMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [fullCityName, setFullCityName] = useState("");
  const [coords, setCoords] = useState(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative">
        <Navbar />
        <MainWeather setFullCityName={setFullCityName} setCoords={setCoords} />
      </div>

      <main className="flex-grow bg-white">
        {coords && (
          <section className="px-6 md:px-12 lg:px-24 py-12 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="font-condensed text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Localisation — {fullCityName}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                <WeatherMap lat={coords.lat} lon={coords.lon} cityName={fullCityName} />
              </div>
            </div>
          </section>
        )}

        <ForecastExtended fullCityName={fullCityName} />
      </main>

      <Footer />
    </div>
  );
}
