"use client";

import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useId, useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
}

/**
 * Comparison slider. A native range input covers the whole frame (invisible),
 * so pointer drag, touch, arrow keys, Home/End and screen-reader value
 * announcements all work without custom handling.
 */
export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel, alt }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure>
      <div className="relative aspect-[16/10] select-none overflow-hidden rounded-[20px] border border-border bg-bg-elevated">
        <Image src={after} alt={`${afterLabel}: ${alt}`} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={`${beforeLabel}: ${alt}`} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 text-sm font-semibold backdrop-blur">{beforeLabel}</span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-bg/80 px-3 py-1 text-sm font-semibold backdrop-blur">{afterLabel}</span>

        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
          aria-valuetext={`${pos}% ${beforeLabel.toLowerCase()}`}
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize touch-pan-y appearance-none opacity-0"
        />

        {/* Visual handle (follows the input) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-0 w-0.5 -translate-x-1/2 bg-white/90 peer-focus-visible:[&>span]:ring-4 peer-focus-visible:[&>span]:ring-magenta" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-gradient text-white shadow-glow ring-2 ring-white/80">
            <MoveHorizontal className="size-5" />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-text-muted">Drag the handle or use the arrow keys to compare.</figcaption>
    </figure>
  );
}
