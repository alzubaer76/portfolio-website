"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Trap Tab focus inside `ref` while `active`, close on Escape, and restore
 * focus to the previously focused element when deactivated.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  { onEscape, initialFocus }: { onEscape?: () => void; initialFocus?: RefObject<HTMLElement | null> } = {},
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("inert") && el.getClientRects().length > 0,
      );

    const focusFirst = () => {
      const target = initialFocus?.current ?? getFocusable()[0] ?? container;
      target.focus({ preventScroll: true });
    };
    // Wait a frame so enter animations have mounted the content.
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active, ref, onEscape, initialFocus]);
}
