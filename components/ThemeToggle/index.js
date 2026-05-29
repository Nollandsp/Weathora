"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="relative flex flex-col items-center justify-center gap-1 cursor-pointer group shrink-0 w-[60px] lg:w-[68px] py-2.5 rounded-2xl transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {isDark ? (
        <Sun size={22} strokeWidth={1.8} className="text-zinc-300 group-hover:text-white transition-colors duration-200" />
      ) : (
        <Moon size={22} strokeWidth={1.8} className="text-zinc-700 group-hover:text-zinc-900 transition-colors duration-200" />
      )}
      <span className="text-[9px] font-semibold tracking-wide leading-none text-zinc-400 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-200">
        {isDark ? "Clair" : "Sombre"}
      </span>
    </button>
  );
}
