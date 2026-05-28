"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { KeyRound } from "lucide-react";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
      });
      if (error) {
        setError("Une erreur est survenue. Vérifiez votre adresse email.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-clear-night flex flex-col items-center justify-center p-5 md:pt-36">
        <div className="ios-glass rounded-[28px] w-full max-w-sm p-6 sm:p-8 animate-ios-appear">
          <div className="text-center mb-8">
            <div className="w-16 h-16 ios-glass-dark rounded-[18px] flex items-center justify-center mx-auto mb-4">
              <KeyRound size={28} className="text-white/80" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Mot de passe oublié</h1>
            <p className="text-white/50 text-sm mt-1">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {success ? (
            <div className="ios-glass-dark rounded-2xl px-4 py-4 text-emerald-300 text-sm font-medium text-center">
              Email envoyé ! Vérifiez votre boîte mail et cliquez sur le lien.
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 ios-glass-dark rounded-2xl px-4 py-3 text-red-300 text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="votre@email.com"
                    required
                    className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
                >
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <a href="/Connexion" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
