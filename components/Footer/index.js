"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-8 px-4 md:px-8 lg:px-16">
        <div className="ios-glass rounded-[20px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-semibold text-white/40">
            By <span className="text-white/60 hover:text-white transition-colors cursor-pointer">NollanDsp</span>
          </p>

          <span className="text-[12px] font-bold tracking-widest text-white/50 uppercase">Weathora</span>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
            >
              Mentions légales
            </button>
            <span className="text-[11px] font-semibold text-white/30">© 2026</span>
          </div>
        </div>
      </footer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-[#1a2f5e] border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-wide text-white">
              Mentions légales
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm text-white/70 leading-relaxed">
            {[
              { title: "Éditeur du site", content: "Ce site est édité par NollanDsp, dans le cadre d'un projet personnel." },
              { title: "Hébergement", content: "Le site Weathora est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis." },
              { title: "Données météorologiques", content: "Les données météo sont fournies par OpenWeatherMap (openweathermap.org). Weathora n'est pas responsable de l'exactitude des prévisions affichées." },
              { title: "Données personnelles & RGPD", content: "Les données collectées (adresse e-mail, villes favorites) sont stockées de manière sécurisée via Supabase et ne sont pas transmises à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression." },
              { title: "Cookies & stockage local", content: "Weathora utilise uniquement le localStorage pour mémoriser vos préférences (unité de température). Aucun cookie de traçage ni publicitaire n'est utilisé." },
              { title: "Propriété intellectuelle", content: "L'ensemble du contenu (code, design, logo) est la propriété de NollanDsp. Toute reproduction sans autorisation est interdite." },
            ].map(({ title, content }) => (
              <section key={title}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-1.5">{title}</h3>
                <p>{content}</p>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
