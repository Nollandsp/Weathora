"use client";
import { useState, useEffect } from "react";

export function useUnit() {
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    const saved = localStorage.getItem("weatherUnit");
    if (saved === "C" || saved === "F") setUnit(saved);
  }, []);

  const toggleUnit = () => {
    const next = unit === "C" ? "F" : "C";
    setUnit(next);
    localStorage.setItem("weatherUnit", next);
  };

  const convertTemp = (celsius) => {
    const val = parseFloat(celsius);
    if (isNaN(val)) return celsius;
    if (unit === "F") return Math.round(val * 9 / 5 + 32);
    return Math.round(val * 10) / 10;
  };

  return { unit, toggleUnit, convertTemp };
}
