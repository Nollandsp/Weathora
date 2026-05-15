"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
      else router.push("/");
    } catch {
      setError("Erreur lors de la connexion");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: "#A8A498" }}>
        {/* Filigrane */}
        <div className="font-condensed absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] lg:text-[20rem] font-black text-white/5 pointer-events-none select-none uppercase leading-none z-0">
          LOG
        </div>

        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 pt-24 lg:pt-40">
          {/* GAUCHE */}
          <div className="flex flex-col justify-start p-8 mt-13 lg:p-16 lg:pl-24">
            <h1 className="font-condensed text-[11vw] sm:text-[80px] lg:text-[110px] xl:text-[130px] font-black text-white uppercase leading-[0.85] tracking-wide whitespace-nowrap">
              CONNEXION
            </h1>
            <div className="flex items-center gap-3 mt-5">
              <div className="h-px w-10 bg-white/30" />
              <p className="text-white/60 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">
                ACCÉDEZ À VOTRE ESPACE WEATHORA
              </p>
            </div>
          </div>

          {/* DROITE */}
          <div className="flex items-start lg:items-center justify-center p-8 lg:p-20 lg:pt-10">
            <div className="w-full max-w-sm lg:max-w-md bg-white/5 lg:bg-transparent p-8 lg:p-0 backdrop-blur-md lg:backdrop-blur-none rounded-sm border border-white/10 lg:border-none">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <span>✕</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {[
                  { label: "Email",       value: email,    set: setEmail,    type: "email",    ph: "votre@email.com" },
                  { label: "Mot de passe",value: password, set: setPassword, type: "password", ph: "••••••••" },
                ].map(({ label, value, set, type, ph }) => (
                  <div key={label}>
                    <label className="block text-[10px] lg:text-[12px] font-extrabold tracking-[0.3em] uppercase text-white mb-2.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={ph}
                      className="w-full px-0 py-3 lg:py-4 bg-transparent border-b-2 border-white/40 focus:border-white focus:outline-none text-white placeholder-white/50 text-sm lg:text-base font-medium transition-all"
                      required
                    />
                  </div>
                ))}

                <div className="pt-4 lg:pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-condensed w-full bg-white text-stone-800 py-4 lg:py-5 text-[11px] lg:text-[13px] font-black tracking-[0.2em] uppercase hover:bg-stone-100 transition-all active:scale-[0.98]"
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </div>
              </form>

              <div className="mt-10 lg:mt-12 text-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">ou</p>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <a href="/Inscription" className="text-[10px] lg:text-[12px] font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors">
                  Pas encore de compte ? S'inscrire →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
