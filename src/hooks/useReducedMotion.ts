"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True when the user prefers reduced motion. False on the server. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
