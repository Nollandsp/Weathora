import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const data = await res.json();
  return NextResponse.json(data);
}
