"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Crown, Heart, Map, Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const features = [
  {
    icon: Heart,
    title: "Favoris illimités",
    desc: "Sauvegardez autant de villes que vous voulez. Plus de limite à 3.",
    free: "3 villes max",
    premium: "Illimité",
  },
  {
    icon: Map,
    title: "Cartes radar",
    desc: "Visualisez les précipitations, nuages et températures en temps réel sur une carte interactive.",
    free: "Non disponible",
    premium: "Inclus",
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

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#A8A498" }}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[4px] p-12 max-w-lg w-full text-center shadow-2xl">
            <h2 className="font-condensed text-5xl font-black text-white uppercase mb-4 leading-none tracking-tighter">
              Accès Privé
            </h2>
            <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              Connectez-vous pour accéder au Premium
            </p>
            <Link
              href="/Connexion"
              className="inline-block bg-white text-stone-800 px-10 py-4 text-xs font-condensed font-black tracking-[0.2em] uppercase hover:bg-stone-100 transition-all shadow-lg"
            >
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
      <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: "#A8A498" }}>

        {/* Filigrane */}
        <div className="font-condensed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] font-black text-white/5 pointer-events-none select-none uppercase leading-none whitespace-nowrap">
          PREMIUM
        </div>

        <div className="relative z-10 flex-1 flex flex-col pt-36 pb-16 px-6 md:px-16 lg:px-24">

          {/* Header éditorial */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-white/30" />
              <span className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">
                Weathora — Accès exclusif
              </span>
            </div>
            <h1 className="font-condensed text-[80px] md:text-[120px] lg:text-[150px] font-black text-white uppercase leading-none tracking-tight">
              PASSE
              <br />
              PREMIUM
            </h1>
          </div>

          {/* Carte unique premium */}
          <div className="max-w-lg w-full mx-auto lg:mx-0">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[4px] overflow-hidden">

              {/* Accent gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Badge populaire */}
              <div className="absolute top-6 right-6">
                <span className="flex items-center gap-1.5 bg-white text-stone-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  <Sparkles size={10} />
                  Meilleur choix
                </span>
              </div>

              <div className="relative z-10 p-8 md:p-10">

                {/* Icône + titre */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Crown size={18} className="text-white" />
                  </div>
                  <p className="font-condensed text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">
                    Plan Premium
                  </p>
                </div>

                {/* Prix */}
                <div className="mb-8 border-b border-white/10 pb-8">
                  <div className="flex items-end gap-2">
                    <span className="font-condensed text-[80px] font-black text-white leading-none">
                      4,99
                    </span>
                    <div className="flex flex-col pb-3">
                      <span className="font-condensed text-2xl font-black text-white">€</span>
                      <span className="text-white/50 text-xs font-bold uppercase tracking-widest">/ mois</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mt-2">
                    Sans engagement — annulable à tout moment
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-5 mb-10">
                  {features.map(({ icon: Icon, title, desc, premium }) => (
                    <li key={title} className="flex items-start gap-4">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon size={13} className="text-white/70" />
                          <p className="font-condensed text-white font-black text-base uppercase tracking-wide">
                            {title}
                          </p>
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                        <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                          Gratuit&nbsp;: {features.find(f => f.title === title)?.free}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="group relative w-full overflow-hidden bg-white text-stone-900 py-4 font-condensed font-black text-base uppercase tracking-[0.2em] transition-all hover:bg-stone-100 active:scale-[0.98]"
                  onClick={() => alert("Paiement bientôt disponible !")}
                >
                  <span className="flex items-center justify-center gap-2">
                    Commencer maintenant
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-4">
                  Paiement sécurisé · Sans engagement
                </p>
              </div>
            </div>

            {/* Lien retour */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-white/40 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
              >
                ← Continuer gratuitement
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
