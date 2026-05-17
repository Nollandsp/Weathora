"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Crown, LogIn, UserPlus } from "lucide-react";

const links = [
  { href: "/Favoris", label: "Favoris", Icon: Heart },
  { href: "/premium", label: "Premium", Icon: Crown },
  { href: "/Connexion", label: "Connexion", Icon: LogIn },
  { href: "/Inscription", label: "Rejoindre", Icon: UserPlus },
];

const legal = [
  { title: "Éditeur du site", content: "Ce site est édité par NollanDsp, dans le cadre d'un projet personnel." },
  { title: "Hébergement", content: "Le site Weathora est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis." },
  { title: "Données météorologiques", content: "Les données météo sont fournies par OpenWeatherMap (openweathermap.org). Weathora n'est pas responsable de l'exactitude des prévisions affichées." },
  { title: "Données personnelles & RGPD", content: "Les données collectées (adresse e-mail, villes favorites) sont stockées de manière sécurisée via Supabase et ne sont pas transmises à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression." },
  { title: "Cookies & stockage local", content: "Weathora utilise uniquement le localStorage pour mémoriser vos préférences (unité de température). Aucun cookie de traçage ni publicitaire n'est utilisé." },
  { title: "Propriété intellectuelle", content: "L'ensemble du contenu (code, design, logo) est la propriété de NollanDsp. Toute reproduction sans autorisation est interdite." },
];

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="w-full px-5 md:px-8 lg:px-14 py-10 md:py-12">
        <div className="ios-glass rounded-2xl px-6 md:px-10 py-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

            {/* ── Colonne gauche : brand ── */}
            <div className="flex flex-col gap-4 max-w-xs">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0">
                  <Image src="/Logo-weathora.png" alt="Weathora" fill className="object-cover" priority />
                </div>
                <span className="text-white font-semibold text-lg tracking-tight group-hover:text-white/80 transition-colors">
                  Weathora
                </span>
              </Link>
              <p className="text-white/45 text-sm font-light leading-relaxed">
                Votre météo de confiance — prévisions précises, qualité de l'air et cartes interactives.
              </p>
              <p className="text-white/25 text-xs font-light">
                Fait avec soin par{" "}
                <span className="text-white/45 font-medium">NollanDsp</span>
              </p>
            </div>

            {/* ── Colonne droite : liens + légal ── */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                {links.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors group w-fit"
                  >
                    <Icon size={13} className="text-white/30 group-hover:text-white/60 transition-colors" />
                    {label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/8 pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <button
                  onClick={() => setOpen(true)}
                  className="text-xs text-white/35 hover:text-white/60 transition-colors underline underline-offset-2 text-left cursor-pointer"
                >
                  Mentions légales
                </button>
                <span className="hidden sm:block text-white/15 text-xs">·</span>
                <span className="text-xs text-white/25 font-light">© 2026 Weathora</span>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* ── Dialog mentions légales ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-[#1a2f5e] border border-white/15 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Mentions légales
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 text-sm text-white/60 leading-relaxed">
            {legal.map(({ title, content }) => (
              <section key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1.5">{title}</h3>
                <p>{content}</p>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
