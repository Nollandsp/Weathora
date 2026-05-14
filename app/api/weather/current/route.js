import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  let url;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`;
  } else {
    return NextResponse.json({ error: "Missing city or coordinates" }, { status: 400 });
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const data = await res.json();
  return NextResponse.json(data);
}
