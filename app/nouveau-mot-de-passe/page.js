"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function NouveauMotDePasse() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase injecte la session depuis le hash de l'URL après le clic sur le lien
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) return setError("Le mot de passe doit contenir au moins une majuscule.");
    if (!/[a-z]/.test(password)) return setError("Le mot de passe doit contenir au moins une minuscule.");
    if (!/[0-9]/.test(password)) return setError("Le mot de passe doit contenir au moins un chiffre.");
    if (!/[^a-zA-Z0-9]/.test(password)) return setError("Le mot de passe doit contenir au moins un caractère spécial.");
    if (password !== confirmPassword) return setError("Les mots de passe ne correspondent pas.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError("Erreur lors de la mise à jour. Le lien a peut-être expiré.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/Connexion"), 2500);
      }
    } catch {
      setError("Erreur inattendue.");
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
              <LockKeyhole size={28} className="text-white/80" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Nouveau mot de passe</h1>
            <p className="text-white/50 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé</p>
          </div>

          {success ? (
            <div className="ios-glass-dark rounded-2xl px-4 py-4 text-emerald-300 text-sm font-medium text-center">
              Mot de passe mis à jour ! Redirection en cours...
            </div>
          ) : !ready ? (
            <div className="ios-glass-dark rounded-2xl px-4 py-4 text-white/50 text-sm text-center">
              Lien invalide ou expiré. <a href="/mot-de-passe-oublie" className="text-white/70 hover:text-white font-semibold">Faire une nouvelle demande</a>
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
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 caractères"
                      required
                      className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
                >
                  {loading ? "Mise à jour..." : "Mettre à jour"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
