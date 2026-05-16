"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
      else router.push("/");
    } catch { setError("Erreur lors de la connexion"); }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-clear-night flex flex-col items-center justify-center p-5">

        {/* Card glass */}
        <div className="ios-glass rounded-[28px] w-full max-w-sm p-8 animate-ios-appear">
          {/* Logo / titre */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 ios-glass-dark rounded-[18px] flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-white/80" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Connexion</h1>
            <p className="text-white/50 text-sm mt-1">Accédez à votre espace Weathora</p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-5 ios-glass-dark rounded-2xl px-4 py-3 text-red-300 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm font-medium outline-none focus:border-white/40 transition-all border border-transparent focus:border-white/30"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Divider + lien inscription */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              Pas encore de compte ?{" "}
              <a href="/Inscription" className="text-white/70 hover:text-white font-semibold transition-colors">
                S'inscrire
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
