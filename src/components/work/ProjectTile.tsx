"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { m } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/content/site";
import { cn } from "@/lib/utils";
import { SHARED_SPRING } from "./motion";

const MAX_TILT = 6; // degrees

interface ProjectTileProps {
  project: Project;
  /** While this project's case study is open, its shared elements live in the overlay. */
  selected: boolean;
  onOpen: () => void;
  tiltEnabled: boolean;
  priority?: boolean;
}

/**
 * Bento tile. Layers, outermost first: (grid item: motion layout reflow) →
 * [data-reveal] (GSAP scroll reveal) → tilt layer (CSS vars from pointer) →
 * content. Each transform lives on its own element so they never fight.
 */
export function ProjectTile({ project, selected, onOpen, tiltEnabled, priority }: ProjectTileProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const setTilt = (rx: number, ry: number, gx = 50, gy = 50, instant = false) => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = instant ? "none" : "";
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--gx", `${gx}%`);
    el.style.setProperty("--gy", `${gy}%`);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!tiltEnabled || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt((0.5 - py) * 2 * MAX_TILT, (px - 0.5) * 2 * MAX_TILT, px * 100, py * 100);
  };

  const open = () => {
    // Flatten the tilt instantly so the shared-element transition measures an untransformed box.
    setTilt(0, 0, 50, 50, true);
    requestAnimationFrame(onOpen);
  };

  return (
    <div data-reveal className="h-full">
      <div
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setTilt(0, 0)}
        className="project-tilt group relative h-full"
      >
        <article
          data-cursor="view"
          className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[20px] border border-border bg-bg-elevated has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-3 has-[button:focus-visible]:outline-magenta"
        >
          {!selected && (
            <m.div layoutId={`project-cover-${project.slug}`} transition={SHARED_SPRING} className="absolute inset-0 -z-10 overflow-hidden" style={{ borderRadius: 20 }}>
              <m.div layout className="absolute inset-0">
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  priority={priority}
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                />
              </m.div>
            </m.div>
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
          {/* Glare follows the pointer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.14), transparent 45%)" }}
          />

          <div className="relative p-5 sm:p-6">
            <p className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-text-muted">
              <span>{project.industry}</span>
              <span aria-hidden="true">·</span>
              <span>
                <span aria-hidden="true">{project.flag}</span> {project.country}
              </span>
            </p>
            <p className="text-metric text-gradient text-3xl sm:text-4xl">{project.headlineMetric}</p>
            {!selected ? (
              <m.h3 layoutId={`project-title-${project.slug}`} transition={SHARED_SPRING} className="text-h3 mt-1">
                {project.title}
              </m.h3>
            ) : (
              <h3 className="text-h3 invisible mt-1">{project.title}</h3>
            )}
            <button
              type="button"
              data-project-trigger={project.slug}
              onClick={open}
              aria-haspopup="dialog"
              className={cn(
                "mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-text outline-none after:absolute after:inset-0 after:content-['']",
                // Hidden until hover only where hover exists; always visible on touch.
                "transition-[transform,opacity] duration-300 hoverable:translate-y-2 hoverable:opacity-0 hoverable:group-hover:translate-y-0 hoverable:group-hover:opacity-100 hoverable:focus-visible:translate-y-0 hoverable:focus-visible:opacity-100",
              )}
            >
              View case study <ArrowRight aria-hidden="true" className="size-4" />
              <span className="sr-only">: {project.title}</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
