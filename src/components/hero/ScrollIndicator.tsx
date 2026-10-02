"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ScrollIndicator({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-text-muted transition-opacity duration-500 md:flex",
        hidden ? "opacity-0" : "opacity-100",
      )}
    >
      <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
        <rect x="1" y="1" width="22" height="36" rx="11" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="10" r="2.5" fill="#D900FD" className="animate-scroll-dot" />
      </svg>
      <span className="text-eyebrow text-[11px]">{label}</span>
    </div>
  );
}
