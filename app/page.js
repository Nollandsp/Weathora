"use client";

import { useState } from "react";
import MainWeather from "@/components/MainWeather";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ForecastExtended from "@/components/ForecastExtended";

export default function Home() {
  const [fullCityName, setFullCityName] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative">
        <Navbar />
        <MainWeather setFullCityName={setFullCityName} />
      </div>

      <main className="flex-grow bg-white">
        <ForecastExtended fullCityName={fullCityName} />
      </main>

      <Footer />
    </div>
  );
}
