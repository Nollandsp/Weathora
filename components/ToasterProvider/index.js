"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function ToasterProvider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Toaster
      richColors
      position={isMobile ? "bottom-center" : "bottom-right"}
      offset={isMobile ? 80 : 24}
    />
  );
}
