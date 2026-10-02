"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Scroll to an in-page target (`"#id"`, element, or number). Uses Lenis when
 * active, native scrolling otherwise, and moves keyboard focus to the target
 * section so screen-reader and keyboard users land in the right place.
 */
export function useScrollTo() {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  return useCallback(
    (target: string | HTMLElement | number, { focus = true }: { focus?: boolean } = {}) => {
      const el =
        typeof target === "string"
          ? target === "#top" || target === "#"
            ? null
            : document.querySelector<HTMLElement>(target)
          : typeof target === "number"
            ? null
            : target;

      if (typeof target === "string" && target !== "#top" && target !== "#" && !el) return;

      // The 80px nav offset comes from `scroll-padding-top` on <html> (globals.css),
      // which both Lenis and native scrollIntoView honour.
      if (lenis) {
        lenis.scrollTo(el ?? (typeof target === "number" ? target : 0));
      } else if (el) {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } else {
        window.scrollTo({ top: typeof target === "number" ? target : 0, behavior: reduced ? "auto" : "smooth" });
      }

      if (focus && el) {
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
      if (typeof target === "string" && target.startsWith("#") && target.length > 1) {
        history.replaceState(null, "", target === "#top" ? location.pathname + location.search : target);
      }
    },
    [lenis, reduced],
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Lenis + GSAP ticker sync. Never started with reduced motion (native scroll).
  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Recalculate trigger positions once fonts and images have settled.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
