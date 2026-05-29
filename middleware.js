import { NextResponse } from "next/server";

export function middleware(request) {
  const hasSession = request.cookies.has("weathora_session");

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/Connexion";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Favoris", "/profil"],
};
