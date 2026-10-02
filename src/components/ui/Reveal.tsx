"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: number;
  delay?: number;
  y?: number;
  as?: "div" | "ul" | "ol" | "header";
}

/**
 * Fades/slides content in when it scrolls into view. Content is fully visible
 * without JS and with reduced motion — the hidden "from" state is only
 * applied by GSAP inside a no-preference media query.
 */
export function Reveal({ children, className, stagger, delay = 0, y = 32, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y,
          duration: 0.9,
          delay,
          ease: "expo.out",
          stagger: stagger ?? 0,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}
