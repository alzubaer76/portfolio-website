"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Returns `serverDefault` during SSR and the first
 * hydration render, then the real value — no hydration mismatch.
 */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}
