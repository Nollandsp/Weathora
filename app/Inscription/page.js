"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function Inscription() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");

    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères"); setLoading(false); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas"); setLoading(false); return; }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("email address is already")) {
          setError("Un compte existe déjà avec cette adresse email.");
        } else if (msg.includes("invalid email")) {
          setError("Adresse email invalide.");
        } else if (msg.includes("password")) {
          setError("Le mot de passe ne respecte pas les critères requis.");
        } else {
          setError("Une erreur est survenue lors de l'inscription.");
        }
        setLoading(false); return;
      }

      const user = data.user;
      const session = data.session;
      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert([{ id: user.id, pseudo, is_premium: false }]);
        if (profileError) { setError("Erreur lors de la création du profil."); }
        else if (session) { router.push("/"); }
        else { setSuccess("Compte créé ! Vérifiez votre boîte mail."); setTimeout(() => router.push("/Connexion"), 3000); }
      }
    } catch { setError("Erreur lors de l'inscription."); }
    setLoading(false);
  };

  const fields = [
    { label: "Pseudo", val: pseudo, set: setPseudo, type: "text", ph: "Votre pseudo" },
    { label: "Email", val: email, set: setEmail, type: "email", ph: "votre@email.com" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-default flex flex-col items-center justify-center p-5">

        <div className="ios-glass rounded-[28px] w-full max-w-sm p-8 animate-ios-appear">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 ios-glass-dark rounded-[18px] flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-white/80" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Créer un compte</h1>
            <p className="text-white/50 text-sm mt-1">Rejoignez Weathora</p>
          </div>

          {error && (
            <div className="mb-5 ios-glass-dark rounded-2xl px-4 py-3 text-red-300 text-sm font-medium animate-fade-in">{error}</div>
          )}
          {success && (
            <div className="mb-5 ios-glass-dark rounded-2xl px-4 py-3 text-emerald-300 text-sm font-medium animate-fade-in">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, val, set, type, ph }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">{label}</label>
                <input
                  type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} required
                  className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                />
              </div>
            ))}

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères" required
                  className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Confirmer</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full ios-glass-dark rounded-2xl px-4 py-3.5 text-white placeholder-white/30 text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
            >
              {loading ? "Chargement..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              Déjà membre ?{" "}
              <a href="/Connexion" className="text-white/70 hover:text-white font-semibold transition-colors">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
