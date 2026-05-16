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

  /* ── Nav item — partagé desktop + mobile ── */
  const NavItem = ({ href, Icon, label, mobileOnly = false, desktopOnly = false }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        aria-label={label}
        className={[
          "relative flex flex-col items-center justify-center gap-1 cursor-pointer",
          /* desktop pill */
          "md:shrink-0 md:w-[60px] lg:w-[68px] md:py-2.5 md:rounded-2xl md:group md:transition-transform md:duration-200 md:hover:scale-105 md:active:scale-95",
          /* mobile tab */
          "flex-1 py-2 rounded-none",
          mobileOnly ? "md:hidden" : "",
          desktopOnly ? "hidden md:flex" : "",
        ].join(" ")}
      >
        {active && (
          <span className="absolute inset-0 md:rounded-2xl liquid-glass-bubble animate-bubble-pop" />
        )}
        <Icon
          size={22}
          strokeWidth={active ? 2.2 : 1.8}
          className={`relative z-10 transition-colors duration-200 ${
            active ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-900"
          }`}
        />
        <span
          className={`relative z-10 text-[9px] font-semibold tracking-wide leading-none transition-colors duration-200 ${
            active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  const LogoutButton = ({ mobile = false }) => (
    <button
      onClick={handleLogout}
      aria-label="Se déconnecter"
      className={[
        "relative flex flex-col items-center justify-center gap-1 cursor-pointer group",
        mobile
          ? "flex-1 py-2"
          : "shrink-0 w-[60px] lg:w-[68px] py-2.5 rounded-2xl transition-transform duration-200 hover:scale-105 active:scale-95",
      ].join(" ")}
    >
      <LogOut
        size={22}
        strokeWidth={1.8}
        className="text-zinc-400 group-hover:text-red-500 transition-colors duration-200"
      />
      <span className="text-[9px] font-semibold tracking-wide leading-none text-zinc-400 group-hover:text-red-500 transition-colors duration-200">
        Quitter
      </span>
    </button>
  );

  const navItems = [
    ...(!user ? [{ href: "/Inscription", Icon: UserPlus, label: "Rejoindre" }] : []),
    ...(!user ? [{ href: "/Connexion", Icon: LogIn, label: "Connexion" }] : []),
    { href: "/Favoris", Icon: Heart, label: "Favoris" },
    { href: "/premium", Icon: Crown, label: "Premium" },
    ...(user ? [{ href: "/profil", Icon: User, label: "Profil" }] : []),
  ];

  return (
    <>
      {/* ══ DESKTOP : floating pill ══ */}
      <div className="hidden md:block fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">
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

          <div className="w-px h-7 bg-black/10 shrink-0 mx-1.5" />

          {navItems.map(({ href, Icon, label }) => (
            <NavItem key={href} href={href} Icon={Icon} label={label} />
          ))}

          {user && (
            <>
              <div className="w-px h-7 bg-black/10 shrink-0 mx-1.5" />
              <LogoutButton />
            </>
          )}
        </nav>
      </div>

      {/* ══ MOBILE : bottom tab bar ══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] ios-tab-bar safe-area-bottom">
        <nav className="flex items-stretch w-full px-2 pb-safe">
          {/* Home */}
          <Link
            href="/"
            aria-label="Accueil"
            className="relative flex flex-col items-center justify-center gap-1 flex-1 py-3 cursor-pointer group"
          >
            {pathname === "/" && (
              <span className="absolute inset-0 bg-white/8 rounded-xl" />
            )}
            <Home
              size={22}
              strokeWidth={pathname === "/" ? 2.2 : 1.8}
              className={pathname === "/" ? "text-white" : "text-white/50 group-hover:text-white"}
            />
            <span className={`text-[9px] font-semibold tracking-wide leading-none ${pathname === "/" ? "text-white" : "text-white/40"}`}>
              Accueil
            </span>
          </Link>

          {navItems.map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-3 cursor-pointer group"
            >
              {pathname === href && (
                <span className="absolute inset-0 bg-white/8 rounded-xl" />
              )}
              <Icon
                size={22}
                strokeWidth={pathname === href ? 2.2 : 1.8}
                className={pathname === href ? "text-white" : "text-white/50 group-hover:text-white"}
              />
              <span className={`text-[9px] font-semibold tracking-wide leading-none ${pathname === href ? "text-white" : "text-white/40"}`}>
                {label}
              </span>
            </Link>
          ))}

          {user && <LogoutButton mobile />}
        </nav>
      </div>

      {/* Spacer mobile pour éviter que le contenu passe sous la tab bar */}
      <div className="md:hidden h-16" />
    </>
  );
}
