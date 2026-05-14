"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Heart, Crown, User, LogOut, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie !");
    setTimeout(() => { window.location.href = "/Connexion"; }, 1200);
  };

  const navItem = (href, Icon, label) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className="flex flex-col items-center gap-1 group transition-all hover:scale-110 shrink-0"
      >
        <div className={`transition-colors ${active ? "text-black" : "text-slate-400 group-hover:text-black"}`}>
          <Icon size={20} />
        </div>
        <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wide transition-colors ${active ? "text-black" : "text-slate-400 group-hover:text-black"}`}>
          {label}
        </span>
        {active && <span className="w-1 h-1 rounded-full bg-black" />}
      </Link>
    );
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[9999] w-[95%] sm:w-auto flex justify-center" style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}>
      <nav className="flex items-center gap-5 sm:gap-8 rounded-full border border-white/20 bg-white/70 px-6 sm:px-10 py-3 shadow-2xl backdrop-blur-xl max-w-full overflow-x-auto no-scrollbar">
        {/* Logo + Accueil */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group transition-all hover:scale-105 shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border border-black/5 shadow-sm">
            <Image src="/Logo-weathora.png" alt="Weathora" fill className="object-cover" priority />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={pathname === "/" ? "text-black" : "text-slate-400 group-hover:text-black"}>
              <Home size={20} />
            </div>
            <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wide transition-colors ${pathname === "/" ? "text-black" : "text-slate-400 group-hover:text-black"}`}>
              Accueil
            </span>
            {pathname === "/" && <span className="w-1 h-1 rounded-full bg-black" />}
          </div>
        </Link>

        {!user && navItem("/Inscription", UserPlus, "Inscription")}
        {!user && navItem("/Connexion", LogIn, "Connexion")}
        {navItem("/Favoris", Heart, "Favoris")}
        {navItem("/premium", Crown, "Premium")}
        {user && navItem("/profil", User, "Profil")}

        {user && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 group transition-all hover:scale-110 shrink-0"
          >
            <div className="text-slate-400 group-hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-slate-400 group-hover:text-red-500">
              Quitter
            </span>
          </button>
        )}
      </nav>
    </div>
  );
}
