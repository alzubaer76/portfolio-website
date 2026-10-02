"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { formatNumber } from "@/lib/utils";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Start immediately instead of on scroll-enter (e.g. after the hero intro). */
  start?: boolean;
}

/**
 * Counts from 0 to `value` when scrolled into view. The final value is
 * server-rendered, so it's correct without JS and with reduced motion.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6, className, start }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${formatNumber(n, decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || start === false) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const counter = { n: 0 };
        el.textContent = format(0);
        gsap.to(counter, {
          n: value,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(counter.n);
          },
          scrollTrigger: start ? undefined : { trigger: el, start: "top 90%", once: true },
        });
        return () => {
          el.textContent = format(value);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [value, start], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
