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

  const NavItem = ({ href, Icon, label }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        aria-label={label}
        className="relative flex flex-col items-center justify-center gap-[5px] shrink-0 w-[60px] sm:w-[68px] py-2.5 rounded-2xl group transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {active && (
          <span className="absolute inset-0 rounded-2xl liquid-glass-bubble animate-bubble-pop" />
        )}
        <Icon
          size={23}
          strokeWidth={active ? 2.3 : 2}
          className={`relative z-10 transition-colors duration-200 ${
            active ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900"
          }`}
        />
        <span
          className={`relative z-10 text-[10px] font-extrabold uppercase tracking-[0.08em] leading-none transition-colors duration-200 ${
            active ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">
      <nav className="liquid-glass relative flex items-center rounded-[22px] px-2.5 py-2 max-w-[92vw] overflow-x-auto no-scrollbar gap-0.5">

        {/* Logo */}
        <Link
          href="/"
          aria-label="Accueil"
          className="relative flex items-center justify-center w-11 h-11 shrink-0 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95 mr-1"
        >
          {pathname === "/" && (
            <span className="absolute inset-0 rounded-xl liquid-glass-bubble animate-bubble-pop" />
          )}
          <div className="relative z-10 w-full h-full">
            <Image src="/Logo-weathora.png" alt="Weathora" fill className="object-cover" priority />
          </div>
        </Link>

        {/* Séparateur */}
        <div className="w-px h-7 bg-black/10 shrink-0 mx-1.5" />

        {!user && <NavItem href="/Inscription" Icon={UserPlus} label="Rejoindre" />}
        {!user && <NavItem href="/Connexion" Icon={LogIn} label="Connexion" />}
        <NavItem href="/Favoris" Icon={Heart} label="Favoris" />
        <NavItem href="/premium" Icon={Crown} label="Premium" />
        {user && <NavItem href="/profil" Icon={User} label="Profil" />}

        {user && (
          <>
            <div className="w-px h-7 bg-black/10 shrink-0 mx-1.5" />
            <button
              onClick={handleLogout}
              aria-label="Se déconnecter"
              className="relative flex flex-col items-center justify-center gap-[5px] shrink-0 w-[60px] sm:w-[68px] py-2.5 rounded-2xl group transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <LogOut
                size={23}
                strokeWidth={2}
                className="text-zinc-600 group-hover:text-red-500 transition-colors duration-200"
              />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] leading-none text-zinc-600 group-hover:text-red-500 transition-colors duration-200">
                Quitter
              </span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
