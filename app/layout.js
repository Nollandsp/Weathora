import "./globals.css";
import { Inter } from "next/font/google";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="fr" className={inter.variable}>
      <head>
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
