"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site, type ProjectFilter, type TileSpan } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { useScrollTo } from "@/components/layout/SmoothScroll";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useHashRoute } from "@/hooks/useHashState";
import { useFinePointer } from "@/hooks/useIsTouch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CaseStudyView } from "./CaseStudyView";
import { FilterChips } from "./FilterChips";
import { ProjectTile } from "./ProjectTile";

const SPAN: Record<TileSpan, string> = {
  "1x1": "",
  "2x1": "md:col-span-2",
  "1x2": "md:row-span-2",
  "2x2": "md:col-span-2 md:row-span-2",
};

export function WorkSection() {
  const { projects, workFilters, workCopy } = site;
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [slug, open, close] = useHashRoute("work");
  const scrollTo = useScrollTo();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const gridRef = useRef<HTMLUListElement>(null);
  const lastSlug = useRef<string | null>(null);
  const pendingScroll = useRef<string | null>(null);

  const index = projects.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? projects[index] : null;
  const next = projects[(index + 1) % projects.length];

  const counts = useMemo(() => {
    const c = { all: projects.length } as Record<ProjectFilter, number>;
    for (const f of workFilters) if (f.id !== "all") c[f.id] = projects.filter((p) => p.filters.includes(f.id as Exclude<ProjectFilter, "all">)).length;
    return c;
  }, [projects, workFilters]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.filters.includes(filter));

  // Lock page scroll (and pause Lenis) while a case study is open.
  useScrollLock(!!project);

  // On close: return focus to the tile that opened it (the trap can't — "next project"
  // remounts the overlay), then run any scroll requested from inside the overlay.
  useEffect(() => {
    if (project) {
      lastSlug.current = project.slug;
      return;
    }
    const last = lastSlug.current;
    lastSlug.current = null;
    if (last) {
      document.querySelector<HTMLElement>(`[data-project-trigger="${last}"]`)?.focus({ preventScroll: true });
    }
    if (pendingScroll.current) {
      const target = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() => scrollTo(target));
    }
  }, [project, scrollTo]);

  const onCta = useCallback(() => {
    pendingScroll.current = "#contact";
    close();
  }, [close]);

  // Scroll reveal, staggered from the centre of the grid.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray<HTMLElement>("[data-reveal]", gridRef.current), {
          opacity: 0,
          scale: 0.94,
          duration: 0.9,
          ease: "expo.out",
          stagger: { each: 0.07, from: "center" },
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef },
  );

  return (
    <Section id="work" label="Work" {...workCopy}>
      <LayoutGroup>
        <div className="mb-8 flex flex-col gap-4">
          <FilterChips filters={workFilters} active={filter} onChange={setFilter} counts={counts} />
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <m.ul ref={gridRef} className="grid grid-flow-dense auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <m.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={SPAN[p.span]}
              >
                <ProjectTile project={p} selected={p.slug === slug} onOpen={() => open(p.slug)} tiltEnabled={finePointer && !reduced} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>

        <AnimatePresence>
          {project && (
            <CaseStudyView
              key={project.slug}
              project={project}
              next={next}
              onClose={close}
              onNext={() => open(next.slug, { replace: true })}
              onCta={onCta}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </Section>
  );
}
