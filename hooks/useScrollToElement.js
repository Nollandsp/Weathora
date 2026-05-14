"use client";

import { useEffect } from "react";

export default function useScrollToElement(buttonId, targetId) {
  useEffect(() => {
    const button = document.getElementById(buttonId);
    const target = document.getElementById(targetId);

    if (button && target) {
      const scrollHandler = () => {
        target.scrollIntoView({ behavior: "smooth" });
      };
      button.addEventListener("click", scrollHandler);

      return () => {
        button.removeEventListener("click", scrollHandler);
      };
    }
  }, [buttonId, targetId]);
}
