"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True on devices whose primary pointer is coarse (touch). False on the server. */
export function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}

/** True when a precise pointer (mouse/trackpad) can hover. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
