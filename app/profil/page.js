"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Lock, AlertTriangle, ChevronRight } from "lucide-react";

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="ios-glass rounded-[24px] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
        {Icon && <Icon size={14} className="text-white/50" />}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full ios-glass-dark rounded-2xl px-4 py-3 text-white text-sm font-medium outline-none border border-transparent focus:border-white/30 transition-all placeholder-white/30";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUser(user); setName(user.user_metadata?.full_name || ""); setEmail(user.email || ""); }
      else router.push("/Connexion");
      setLoading(false);
    }).catch(() => { router.push("/Connexion"); setLoading(false); });
  }, [router]);

  const updateName = async (e) => {
    e.preventDefault(); setSaving(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { toast.error("Utilisateur non connecté"); setSaving(false); return; }
    const { error: authError } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (authError) { toast.error(authError.message); setSaving(false); return; }
    const { error: dbError } = await supabase.from("profiles").update({ pseudo: name }).eq("id", user.id);
    if (dbError) toast.error(dbError.message);
    else toast.success("Pseudo mis à jour !");
    setSaving(false);
  };

  const updateEmail = async (e) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.auth.updateUser({ email });
    if (error) toast.error(error.message);
    else toast.success("Email modifié. Vérifiez votre boîte mail.");
    setSaving(false);
  };

  const updatePassword = async (e) => {
    e.preventDefault(); setSaving(true);
    if (newPassword !== confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); setSaving(false); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Mot de passe modifié !"); setNewPassword(""); setConfirmPassword(""); }
    setSaving(false);
  };

  const deleteAccount = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast.error("Session non trouvée"); setSaving(false); return; }
    const res = await fetch("/api/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) { toast.error("Erreur : " + (data.error || "Erreur inconnue")); }
    else { await supabase.auth.signOut(); setShowDeleteModal(false); router.push("/"); }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen ios-sky-default flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/50 text-sm font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen ios-sky-default flex flex-col">
        <div className="pt-24 md:pt-28 pb-4 px-5 md:px-8 lg:px-16">

          {/* Header */}
          <div className="mb-6 animate-ios-appear">
            <div className="w-16 h-16 ios-glass rounded-[18px] flex items-center justify-center mb-4">
              <User size={28} className="text-white/70" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">Mon profil</h1>
            <p className="text-white/40 text-sm mt-1">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl animate-ios-appear" style={{ animationDelay: "0.05s" }}>

            {/* Pseudo */}
            <SectionCard icon={User} title="Identifiant">
              <form onSubmit={updateName}>
                <Field label="Nom d'utilisateur">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Votre pseudo" />
                </Field>
                <button type="submit" disabled={saving}
                  className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 rounded-2xl text-sm transition-all disabled:opacity-50">
                  Enregistrer
                </button>
              </form>
            </SectionCard>

            {/* Email */}
            <SectionCard icon={Mail} title="Email">
              <form onSubmit={updateEmail}>
                <Field label="Adresse électronique">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Field>
                <button type="submit" disabled={saving}
                  className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 rounded-2xl text-sm transition-all disabled:opacity-50">
                  Mettre à jour
                </button>
              </form>
            </SectionCard>

            {/* Mot de passe */}
            <SectionCard icon={Lock} title="Sécurité">
              <form onSubmit={updatePassword} className="space-y-3">
                <Field label="Nouveau mot de passe">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} placeholder="Min. 8 caractères" />
                </Field>
                <Field label="Confirmation">
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
                </Field>
                <button type="submit" disabled={saving}
                  className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 rounded-2xl text-sm transition-all disabled:opacity-50">
                  Changer le mot de passe
                </button>
              </form>
            </SectionCard>

            {/* Zone dangereuse */}
            <div className="ios-glass rounded-[24px] overflow-hidden border border-red-500/20">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-500/20">
                <AlertTriangle size={14} className="text-red-400/70" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-red-400/70">Zone critique</span>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-white mb-1">Supprimer le compte</p>
                <p className="text-xs text-white/40 mb-5 leading-relaxed">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-2.5 rounded-2xl text-sm transition-all border border-red-500/20"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <Footer />
      </div>

      {/* Dialog confirmation suppression */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="ios-glass border-white/20 rounded-[28px] text-white max-w-sm bg-[#1a2f5e]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              Cette action est <span className="text-red-400 font-semibold">irréversible</span>. Votre accès Weathora sera immédiatement révoqué.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={saving}
              className="flex-1 border-white/20 text-white bg-white/10 hover:bg-white/20 rounded-2xl">
              Annuler
            </Button>
            <Button variant="destructive" onClick={deleteAccount} disabled={saving}
              className="flex-1 rounded-2xl">
              {saving ? "Traitement..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
