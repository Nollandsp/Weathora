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
      if (user) {
        setUser(user);
        setName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      } else {
        router.push("/Connexion");
      }
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
    else toast.success("Pseudo modifié avec succès");
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
    else { toast.success("Mot de passe modifié avec succès"); setNewPassword(""); setConfirmPassword(""); }
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
    if (!res.ok) {
      toast.error("Erreur : " + (data.error || "Erreur inconnue"));
    } else {
      await supabase.auth.signOut();
      setShowDeleteModal(false);
      router.push("/");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#A8A498" }}>
        <div className="font-condensed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-white/5 pointer-events-none select-none uppercase leading-none animate-pulse">
          WEATHORA
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-[2px] border-white/10 border-t-white rounded-full animate-spin" />
          <p className="font-condensed text-white text-[12px] font-black tracking-[0.4em] uppercase">Initialisation</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const inputClass = "w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors";
  const labelClass = "block font-condensed text-[11px] font-black text-white uppercase tracking-widest mb-2";
  const cardClass = "bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-[4px] group transition-all hover:border-white/30 flex flex-col";

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#A8A498" }}>
        <div className="font-condensed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12rem] font-black text-white/5 pointer-events-none select-none uppercase leading-none">
          PROFIL
        </div>

        <div className="relative z-10 pt-32 pb-12">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-12 text-left">
                <h1 className="font-condensed text-[60px] md:text-[100px] font-black text-white uppercase leading-none tracking-tight">
                  MON PROFIL
                </h1>
                <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mt-2">
                  GESTION DU COMPTE — PARAMÈTRES PERSONNELS
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pseudo */}
                <div className={cardClass}>
                  <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">IDENTIFIANT</p>
                  <form onSubmit={updateName} className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <label className={labelClass}>Nom d'utilisateur</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass + " uppercase"} />
                    </div>
                    <Button type="submit" disabled={saving} className="font-condensed w-full py-3 text-[13px] font-black tracking-[0.1em] uppercase rounded-none">
                      Enregistrer les modifications
                    </Button>
                  </form>
                </div>

                {/* Email */}
                <div className={cardClass}>
                  <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">COORDONNÉES</p>
                  <form onSubmit={updateEmail} className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <label className={labelClass}>Adresse électronique</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                    </div>
                    <Button type="submit" disabled={saving} className="font-condensed w-full py-3 text-[13px] font-black tracking-[0.1em] uppercase rounded-none">
                      Mettre à jour l'email
                    </Button>
                  </form>
                </div>

                {/* Mot de passe */}
                <div className={cardClass}>
                  <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">SÉCURITÉ</p>
                  <form onSubmit={updatePassword} className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Nouveau mot de passe</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Confirmation</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving} className="font-condensed w-full py-3 text-[13px] font-black tracking-[0.1em] uppercase rounded-none">
                      Changer le mot de passe
                    </Button>
                  </form>
                </div>

                {/* Zone dangereuse */}
                <div className="relative group overflow-hidden bg-stone-900/20 backdrop-blur-md border border-red-900/30 p-8 rounded-[2px] transition-all duration-500 hover:border-red-500/50">
                  <div className="absolute -inset-px bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-[1px] w-8 bg-red-500/40" />
                      <p className="font-condensed text-red-500 text-[10px] font-black tracking-[0.3em] uppercase">Zone de non-retour</p>
                    </div>
                    <h2 className="font-condensed text-white text-2xl font-black uppercase leading-none mb-4">
                      Suppression <span className="text-red-500/80">irréversible</span>
                    </h2>
                    <p className="text-white/40 text-[11px] leading-relaxed mb-8 max-w-[280px] font-medium uppercase tracking-wider">
                      L'effacement de vos données d'accès et de vos préférences est définitif.<br />
                      Aucune récupération n'est possible.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteModal(true)}
                      className="font-condensed w-full py-4 mt-10 text-[13px] font-black tracking-[0.2em] uppercase rounded-none"
                    >
                      Détruire le compte
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog de confirmation shadcn */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="bg-[#A8A498] border border-white/20 rounded-[4px] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-condensed text-4xl font-black text-white uppercase leading-none">
                CONFIRMER ?
              </DialogTitle>
              <DialogDescription className="text-white/70 text-[11px] font-bold tracking-widest uppercase leading-loose">
                Cette action est <span className="text-red-400">irréversible</span>. Votre accès au système Weathora sera révoqué immédiatement.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="bg-transparent border-0 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                className="font-condensed flex-1 border-white/20 text-white bg-white/10 hover:bg-white/20 rounded-none uppercase tracking-widest text-xs"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAccount}
                disabled={saving}
                className="font-condensed flex-1 rounded-none uppercase tracking-widest text-xs"
              >
                {saving ? "TRAITEMENT..." : "SUPPRIMER"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
}
