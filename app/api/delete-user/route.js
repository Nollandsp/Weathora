import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Récupération des infos utilisateur depuis le token
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(token);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    // Suppression du compte utilisateur via Supabase Admin
    const { error: deleteUserError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error(
        "Erreur lors de la suppression de l'utilisateur:",
        deleteUserError
      );
      return NextResponse.json(
        { error: "Erreur lors de la suppression de l'utilisateur" },
        { status: 500 }
      );
    }

    console.log(`✅ Utilisateur ${userId} supprimé avec succès`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur interne lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
