import "./globals.css";
import "leaflet/dist/leaflet.css";
import ToasterProvider from "@/components/ToasterProvider";

export const metadata = {
  title: "Weathora — Votre météo de confiance",
  description: "Une interface claire et moderne pour vous accompagner au quotidien.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="relative min-h-screen">
        <div className="relative z-10">{children}</div>
        <ToasterProvider />
      </body>
    </html>
  );
}
