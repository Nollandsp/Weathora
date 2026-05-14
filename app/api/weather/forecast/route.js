import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const data = await res.json();
  return NextResponse.json(data);
}
