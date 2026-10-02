"use client";

import { X } from "lucide-react";
import { AnimatePresence, m, useReducedMotion as useMotionReduced } from "motion/react";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { AvailabilityPill } from "@/components/about/AvailabilityPill";

interface MobileMenuProps {
  open: boolean;
  active: string | null;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

export function MobileMenu({ open, active, onClose, onNavigate }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionReduced();
  useFocusTrap(ref, open, { onEscape: onClose });

  // Close if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && onClose();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-bg/95 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between px-5 md:px-8">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-magenta"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-6 md:px-8">
            <ul className="flex flex-col gap-1">
              {site.nav.map((link, i) => {
                const isActive = active === link.href.slice(1);
                return (
                  <m.li
                    key={link.href}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.href);
                      }}
                      className={cn(
                        "flex min-h-14 items-center justify-between border-b border-border font-display text-3xl font-semibold transition-colors",
                        isActive ? "text-text" : "text-text-muted hover:text-text",
                      )}
                    >
                      {link.label}
                      {isActive && <span aria-hidden="true" className="bg-brand-gradient size-2 rounded-full" />}
                    </a>
                  </m.li>
                );
              })}
            </ul>
          </nav>

          <m.div
            className="flex shrink-0 flex-col gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 md:px-8"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AvailabilityPill className="self-start" />
            <Button href={site.navCta.href} className="w-full" onClick={onClose}>
              {site.navCta.label}
            </Button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
