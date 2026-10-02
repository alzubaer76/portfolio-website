"use client";

import type { ReactNode } from "react";
import { useScrollTo } from "./SmoothScroll";
import { cn } from "@/lib/utils";

/** In-page link that scrolls via Lenis. Hash routes like `#services/slug` fall through to the hash router. */
export function FooterLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const scrollTo = useScrollTo();
  const isPlainAnchor = /^#[\w-]+$/.test(href);
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!isPlainAnchor) return;
        e.preventDefault();
        scrollTo(href, { focus: href !== "#top" });
      }}
      className={cn("inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text md:min-h-9", className)}
    >
      {children}
    </a>
  );
}
