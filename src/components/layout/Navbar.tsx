"use client";

import { Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useScrollTo } from "@/components/layout/SmoothScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn, rafThrottle } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { AvailabilityPill } from "@/components/about/AvailabilityPill";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingTarget = useRef<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  // Glass state after 40px; hide on scroll down, show on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = rafThrottle(() => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      if (goingDown && y > 240 && !focusInside) setHidden(true);
      else if (goingUp || y <= 240) setHidden(false);
      lastY = y;
    });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      onScroll.cancel();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const ids = site.nav.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useScrollLock(menuOpen);

  // Scroll after the menu has closed and the scroll lock has been released.
  useEffect(() => {
    if (!menuOpen && pendingTarget.current) {
      const target = pendingTarget.current;
      pendingTarget.current = null;
      scrollTo(target);
    }
  }, [menuOpen, scrollTo]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const navigateFromMenu = useCallback((href: string) => {
    pendingTarget.current = href;
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-[transform,background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled ? "border-b border-border bg-bg/70 backdrop-blur-md" : "border-b border-transparent bg-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-site items-center justify-between gap-6 px-5 md:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#top", { focus: false });
            }}
            className="min-h-11 inline-flex items-center rounded-full"
            aria-label={`${site.brand.name}, back to top`}
          >
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      className={cn(
                        "relative inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-medium transition-colors",
                        isActive ? "text-text" : "text-text-muted hover:text-text",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "bg-brand-gradient absolute inset-x-3 bottom-1.5 h-0.5 origin-left rounded-full transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Visibility lives on wrappers: cn() doesn't merge conflicting display utilities. */}
            <div className="hidden xl:block">
              <AvailabilityPill />
            </div>
            <div className="hidden sm:block">
              <Button href={site.navCta.href} size="sm">
                {site.navCta.label}
              </Button>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-magenta lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </header>
      {/* Sibling, not child: the header's transform/backdrop-filter would contain a fixed child. */}
      <MobileMenu open={menuOpen} active={active} onClose={closeMenu} onNavigate={navigateFromMenu} />
    </>
  );
}
