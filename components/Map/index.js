"use client";

import { useEffect, useRef } from "react";

export default function WeatherMap({ lat, lon, cityName }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import("leaflet").then((L) => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([lat, lon], 12);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#292524;border:3px solid white;border-radius:50%;box-shadow:0 2px 12px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -12],
        className: "",
      });

      L.marker([lat, lon], { icon })
        .addTo(map)
        .bindPopup(
          `<span style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em">${cityName}</span>`,
          { closeButton: false }
        )
        .openPopup();

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon, cityName]);

  return <div ref={containerRef} className="w-full h-[260px] md:h-[380px]" />;
}
