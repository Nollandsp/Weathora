import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const { pseudo } = await request.json();
  if (!pseudo) return NextResponse.json({ taken: false });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .ilike("pseudo", pseudo.trim())
    .maybeSingle();

  return NextResponse.json({ taken: !!data });
}
