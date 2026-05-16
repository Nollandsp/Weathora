"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Crown, Heart, Map, Check, ArrowRight, Sparkles, Zap, Bell, Wind, Activity } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const features = [
  {
    icon: Heart,
    title: "Favoris illimités",
    desc: "Sauvegardez autant de villes que vous voulez.",
    free: "3 villes max",
    premium: "Illimité",
  },
  {
    icon: Map,
    title: "Cartes radar",
    desc: "Précipitations, nuages et températures en temps réel sur carte interactive.",
    free: "Non disponible",
    premium: "Inclus",
  },
  {
    icon: Activity,
    title: "Qualité de l'air détaillée",
    desc: "Polluants PM2.5, CO, NO₂, O₃ avec historique 7 jours.",
    free: "Indice basique",
    premium: "Complet",
  },
  {
    icon: Bell,
    title: "Alertes météo",
    desc: "Notifications push pour les événements extrêmes dans vos villes favorites.",
    free: "Non disponible",
    premium: "Inclus",
  },
  {
    icon: Wind,
    title: "Prévisions 14 jours",
    desc: "Étendez vos prévisions jusqu'à deux semaines.",
    free: "5 jours",
    premium: "14 jours",
  },
  {
    icon: Zap,
    title: "Sans publicité",
    desc: "Une expérience épurée et sans interruption.",
    free: "Avec pubs",
    premium: "Sans pub",
  },
];

export default function Premium() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen ios-sky-clear-night flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen ios-sky-clear-night flex items-center justify-center p-6">
          <div className="ios-glass rounded-[28px] p-10 max-w-sm w-full text-center animate-ios-appear">
            <Crown size={40} className="text-yellow-300/70 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-2">Accès privé</h2>
            <p className="text-white/50 text-sm mb-8">Connectez-vous pour accéder au Premium</p>
            <Link href="/Connexion"
              className="block w-full bg-white text-gray-900 font-semibold py-3 rounded-2xl text-sm hover:bg-white/90 transition-all">
              Se connecter
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-clear-night flex flex-col">

        <div className="pt-24 md:pt-28 pb-8 px-5 md:px-8 lg:px-16 flex flex-col items-center">

          {/* Badge */}
          <div className="mt-4 mb-6 animate-ios-appear">
            <span className="ios-glass rounded-full px-4 py-1.5 flex items-center gap-2 text-yellow-300/80 text-xs font-semibold">
              <Sparkles size={13} />
              Accès exclusif Weathora
            </span>
          </div>

          {/* Titre */}
          <div className="text-center mb-10 animate-ios-appear" style={{ animationDelay: "0.05s" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
              Passez à<br />
              <span className="text-yellow-300">Premium</span>
            </h1>
            <p className="text-white/50 text-base mt-3 max-w-md mx-auto">
              Débloquez toutes les fonctionnalités pour une météo sans limites.
            </p>
          </div>

          {/* Cards grille features */}
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-ios-appear" style={{ animationDelay: "0.1s" }}>
            {features.map(({ icon: Icon, title, desc, free, premium }) => (
              <div key={title} className="ios-glass rounded-[20px] p-4 flex gap-3">
                <div className="w-8 h-8 ios-glass-dark rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} className="text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                  <p className="text-xs text-white/50 mt-0.5 leading-snug">{desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-white/30 line-through">{free}</span>
                    <span className="text-[10px] font-semibold text-yellow-300 bg-yellow-300/10 px-2 py-0.5 rounded-full">{premium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing card */}
          <div className="w-full max-w-sm animate-ios-appear" style={{ animationDelay: "0.15s" }}>
            <div className="ios-glass rounded-[28px] p-7 text-center relative overflow-hidden">
              {/* Glow décoratif */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/8 to-transparent pointer-events-none rounded-[28px]" />

              <div className="relative z-10">
                {/* Couronne */}
                <div className="w-14 h-14 ios-glass-dark rounded-[16px] flex items-center justify-center mx-auto mb-5">
                  <Crown size={26} className="text-yellow-300" />
                </div>

                {/* Prix */}
                <div className="mb-1">
                  <span className="text-5xl font-thin text-white">4</span>
                  <span className="text-5xl font-thin text-white">,</span>
                  <span className="text-5xl font-thin text-white">99</span>
                  <span className="text-2xl font-light text-white/60"> €</span>
                </div>
                <p className="text-white/40 text-xs font-medium mb-6">par mois · sans engagement</p>

                {/* Checklist compacte */}
                <ul className="text-left space-y-2 mb-7">
                  {features.slice(0, 4).map(({ title }) => (
                    <li key={title} className="flex items-center gap-2.5 text-sm text-white/70">
                      <Check size={14} className="text-yellow-300 shrink-0" />
                      {title}
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-sm text-white/40">
                    <Check size={14} className="text-white/20 shrink-0" />
                    Et bien plus...
                  </li>
                </ul>

                {/* CTA */}
                <button
                  onClick={() => alert("Paiement bientôt disponible !")}
                  className="group w-full bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-yellow-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Commencer maintenant
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                <p className="text-white/25 text-[11px] font-medium mt-4">
                  Paiement sécurisé · Annulable à tout moment
                </p>
              </div>
            </div>

            {/* Lien retour */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors">
                ← Continuer gratuitement
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <Footer />
      </div>
    </>
  );
}
