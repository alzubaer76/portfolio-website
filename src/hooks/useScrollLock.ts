"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";

let locks = 0;

/**
 * Lock page scroll while `active`: stops Lenis (so it doesn't fight an
 * overlay's own native scroll) and sets overflow hidden on <html>.
 * Reference-counted so nested dialogs work.
 */
export function useScrollLock(active: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    lenis?.stop();
    if (locks === 1) {
      html.style.overflow = "hidden";
      if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      locks -= 1;
      if (locks === 0) {
        html.style.overflow = "";
        html.style.paddingRight = "";
        lenis?.start();
      }
    };
  }, [active, lenis]);
}
