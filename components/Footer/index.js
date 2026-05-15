"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-10 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 text-center">
            By{" "}
            <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              NollanDsp
            </span>
          </p>

          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
            Weathora
          </span>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-slate-500 transition-colors underline underline-offset-2"
            >
              Mentions légales
            </button>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 text-center">
              © 2026 — Tous droits réservés
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-slate-200" />
      </footer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-widest">
              Mentions légales
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Éditeur du site
              </h3>
              <p>
                Ce site est édité par <strong>NollanDsp</strong>, dans le cadre
                d'un projet personnel.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Hébergement
              </h3>
              <p>
                Le site Weathora est hébergé par <strong>Vercel Inc.</strong>,
                340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Données météorologiques
              </h3>
              <p>
                Les données météo sont fournies par{" "}
                <strong>OpenWeatherMap</strong> (openweathermap.org). Weathora
                n'est pas responsable de l'exactitude des prévisions affichées.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Données personnelles & RGPD
              </h3>
              <p>
                Les données collectées (adresse e-mail, villes favorites) sont
                stockées de manière sécurisée via <strong>Supabase</strong> et
                ne sont pas transmises à des tiers.
              </p>
              <p className="mt-1">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), vous disposez d'un droit d'accès, de rectification et de
                suppression de vos données. Pour exercer ce droit,
                contactez-nous à l'adresse ci-dessus ou supprimez votre compte
                depuis votre profil.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Cookies & stockage local
              </h3>
              <p>
                Weathora utilise uniquement le <strong>localStorage</strong> de
                votre navigateur pour mémoriser vos préférences (unité de
                température °C/°F). Aucun cookie de traçage ni publicitaire
                n'est utilisé.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5">
                Propriété intellectuelle
              </h3>
              <p>
                L'ensemble du contenu de ce site (code, design, logo) est la
                propriété de NollanDsp. Toute reproduction sans autorisation est
                interdite.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
