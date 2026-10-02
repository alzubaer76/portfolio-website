"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

function Items({ hidden = false }: { hidden?: boolean }) {
  const { platforms, countries } = site.trustBar;
  return (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {platforms.map((p) => (
        <li key={p.name} className="flex shrink-0 items-center">
          <Image src={p.logo} alt={hidden ? "" : p.name} width={120} height={40} unoptimized className="h-7 w-auto opacity-80" />
        </li>
      ))}
      {countries.map((c) => (
        <li key={c.name} className="flex shrink-0 items-center gap-2 text-text-muted">
          <span aria-hidden="true" className="text-2xl leading-none">
            {c.flag}
          </span>
          <span className="whitespace-nowrap font-medium">{c.name}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite logo/country marquee. Two identical tracks animate by -100% for a
 * seamless loop. Pauses on hover, keyboard focus and via an explicit toggle
 * (WCAG 2.2.2); static and wrapped with reduced motion.
 */
export function TrustMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section id="trust" aria-labelledby="trust-heading" data-section="Trust" className="relative overflow-x-clip border-y border-border/60 py-10">
      <div className="mx-auto mb-6 flex max-w-site items-center justify-between gap-4 px-5 md:px-8">
        <h2 id="trust-heading" className="text-eyebrow text-text-muted">
          {site.trustBar.label}
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="marquee-toggle inline-flex size-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-magenta hover:text-text"
        >
          {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
          <span className="sr-only">Pause logo animation</span>
        </button>
      </div>
      <div className={cn("marquee", paused && "is-paused")} tabIndex={0} aria-label="Platforms and countries" role="region">
        <Items />
        <Items hidden />
      </div>
    </section>
  );
}
