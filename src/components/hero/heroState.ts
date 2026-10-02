/**
 * Mutable state shared between the GSAP scroll timeline (DOM) and the R3F
 * scene. Written by GSAP / pointer listeners, read inside useFrame — never
 * stored in React state, so scrolling causes zero React re-renders.
 */
export const heroState = {
  /** Scroll-sequence progress, 0 → 1 across the pinned hero. */
  progress: 0,
  /** Pointer position normalised to -1 … 1 (0 when touch / idle). */
  pointerX: 0,
  pointerY: 0,
};
