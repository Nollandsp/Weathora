import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Weathora — Votre météo de confiance",
  description: "Une interface claire et moderne pour vous accompagner au quotidien.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
        <div className="background-design fixed inset-0 -z-10" />
        <div className="relative z-10">{children}</div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
