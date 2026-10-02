"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { ScrollTrigger } from "@/lib/gsap";
import { useHashRoute } from "@/hooks/useHashState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMounted } from "@/hooks/useMounted";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServicePanel } from "./ServicePanel";
import { ServicesRing } from "./ServicesRing";
import { ServicesCarousel, ServicesGrid } from "./ServicesGridFallback";

export function Services() {
  const { services, servicesCopy } = site;
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const small = useMediaQuery("(max-width: 639.98px)");
  const [slug, open, close] = useHashRoute("services");
  const service = services.find((s) => s.slug === slug) ?? null;

  // Server render / no-JS / reduced motion: every service visible in a grid.
  const mode = !mounted || reduced ? "grid" : small ? "carousel" : "ring";

  // Section height changes with the mode: re-measure every ScrollTrigger below.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [mode]);

  return (
    <Section id="services" label="Services" {...servicesCopy} subheading={mode === "ring" ? servicesCopy.subheading : undefined}>
      {mode === "ring" && <ServicesRing services={services} onOpen={open} panelOpen={!!service} />}
      {mode === "carousel" && <ServicesCarousel services={services} onSelect={open} />}
      {mode === "grid" && <ServicesGrid services={services} onSelect={open} />}
      <ServicePanel service={service} onClose={close} />
    </Section>
  );
}
