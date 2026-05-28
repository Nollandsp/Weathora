import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const PSEUDO_REGEX = /^[a-zA-ZÀ-ÿ0-9_\-]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { pseudo, email, password, captchaToken } = body;

    // 1. PSEUDO
    if (!pseudo || typeof pseudo !== "string") {
      return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
    }
    const trimmedPseudo = pseudo.trim();
    if (trimmedPseudo.length < 2) {
      return NextResponse.json(
        { error: "Le pseudo doit contenir au moins 2 caractères" },
        { status: 400 }
      );
    }
    if (trimmedPseudo.length > 30) {
      return NextResponse.json(
        { error: "Le pseudo ne peut pas dépasser 30 caractères" },
        { status: 400 }
      );
    }
    if (!PSEUDO_REGEX.test(trimmedPseudo)) {
      return NextResponse.json(
        { error: "Le pseudo ne peut contenir que des lettres, chiffres, - et _" },
        { status: 400 }
      );
    }

    // 2. EMAIL (regex stricte)
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail.length > 254) {
      return NextResponse.json(
        { error: "Adresse email trop longue" },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // 3. PASSWORD
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }
    if (password.length > 128) {
      return NextResponse.json(
        { error: "Le mot de passe est trop long" },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une majuscule" },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une minuscule" },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins un chiffre" },
        { status: 400 }
      );
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins un caractère spécial" },
        { status: 400 }
      );
    }

    // 4. CAPTCHA (présence ; Supabase le vérifie)
    if (!captchaToken) {
      return NextResponse.json({ error: "Captcha manquant" }, { status: 400 });
    }

    // 5. CLIENT ADMIN
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 6. PSEUDO DISPONIBLE ?
    const { data: existingPseudo } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("pseudo", trimmedPseudo)
      .maybeSingle();

    if (existingPseudo) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà utilisé, choisis-en un autre." },
        { status: 400 }
      );
    }

    // 7. CRÉER L'UTILISATEUR (envoie l'email de confirmation)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email: trimmedEmail,
        password,
        options: { captchaToken },
      });

    if (authError) {
      const msg = authError.message?.toLowerCase() ?? "";
      if (
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("email address is already") ||
        msg.includes("duplicate")
      ) {
        return NextResponse.json(
          { error: "Un compte existe déjà avec cette adresse email." },
          { status: 400 }
        );
      }
      if (msg.includes("captcha")) {
        return NextResponse.json(
          { error: "Captcha invalide, veuillez réessayer." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Erreur lors de la création du compte." },
        { status: 500 }
      );
    }

    // Email déjà existant : identities vide
    if (
      authData.user &&
      Array.isArray(authData.user.identities) &&
      authData.user.identities.length === 0
    ) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email." },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte." },
        { status: 500 }
      );
    }

    // 8. CRÉER LE PROFIL
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{ id: userId, pseudo: trimmedPseudo, is_premium: false }]);

    if (profileError) {
      return NextResponse.json(
        { error: "Erreur lors de la création du profil." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Compte créé ! Vérifiez votre boîte mail.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}
