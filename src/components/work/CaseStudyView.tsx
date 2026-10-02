"use client";

import Image from "next/image";
import { ArrowRight, Quote, X } from "lucide-react";
import { m, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { buttonClasses } from "@/components/ui/Button";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Lightbox } from "./Lightbox";
import { SHARED_SPRING } from "./motion";


const content: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delayChildren: 0.35, staggerChildren: 0.07 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

interface CaseStudyViewProps {
  project: Project;
  next: Project;
  onClose: () => void;
  onNext: () => void;
  onCta: () => void;
}

export function CaseStudyView({ project, next, onClose, onNext, onCta }: CaseStudyViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [countStart, setCountStart] = useState(false);
  // Focus goes to the close button; WorkSection restores focus to the tile on close.
  useFocusTrap(ref, true, { onEscape: onClose, initialFocus: closeRef, restoreFocus: false });

  // Start the metric count-up once the expansion has (roughly) settled.
  useEffect(() => {
    const t = setTimeout(() => setCountStart(true), 700);
    return () => clearTimeout(t);
  }, []);

  const titleId = `case-study-title-${project.slug}`;
  const gallery = project.gallery.map((src, i) => ({ src, alt: `${project.title}: creative / dashboard ${i + 1}` }));

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="fixed inset-0 z-[70] outline-none">
      <m.div
        aria-hidden="true"
        className="absolute inset-0 bg-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close case study"
        className="absolute right-4 top-4 z-20 inline-flex size-12 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-text backdrop-blur transition-colors hover:border-magenta sm:right-6 sm:top-6"
      >
        <X aria-hidden="true" className="size-5" />
      </button>

      <div className="absolute inset-0 overflow-y-auto overscroll-contain" data-lenis-prevent>
        <m.div
          layoutId={`project-cover-${project.slug}`}
          transition={SHARED_SPRING}
          className="relative h-[52svh] min-h-[320px] overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <m.div layout className="absolute inset-0">
            <Image src={project.cover} alt="" fill priority sizes="100vw" className="object-cover" />
          </m.div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        </m.div>

        <Container className="relative -mt-36 pb-28">
          <div className="max-w-4xl">
            <m.p variants={content} initial="hidden" animate="show" exit="exit" className="text-eyebrow mb-3 text-text-muted">
              {project.client} · {project.industry} · <span aria-hidden="true">{project.flag}</span> {project.country}
            </m.p>
            <m.h2 id={titleId} layoutId={`project-title-${project.slug}`} transition={SHARED_SPRING} className="text-h2">
              {project.title}
            </m.h2>
          </div>

          <m.div variants={content} initial="hidden" animate="show" exit="exit" className="mt-6 space-y-16">
            <m.ul variants={item} aria-label="Platforms" className="flex flex-wrap gap-2">
              {project.platforms.map((pl) => (
                <li key={pl} className="rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm font-medium">
                  {pl}
                </li>
              ))}
            </m.ul>

            <m.section variants={item} aria-labelledby={`${titleId}-results`}>
              <h3 id={`${titleId}-results`} className="sr-only">
                Key results
              </h3>
              <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {project.results.map((r) => (
                  <div key={r.label} className="card flex flex-col gap-1 p-5">
                    <dt className="text-sm text-text-muted">{r.label}</dt>
                    <dd className="text-metric order-first text-3xl sm:text-4xl">
                      <CountUp value={r.value} prefix={r.prefix} suffix={r.suffix} decimals={r.decimals} start={countStart} />
                    </dd>
                    <dd className={cn("text-sm font-semibold", r.change >= 0 ? "text-success" : "text-danger")}>
                      <span aria-hidden="true">{r.change >= 0 ? "▲" : "▼"} </span>
                      <span className="sr-only">{r.change >= 0 ? "Up" : "Down"} </span>
                      {Math.abs(r.change)}%
                    </dd>
                  </div>
                ))}
              </dl>
            </m.section>

            <div className="grid gap-12 lg:grid-cols-2">
              <m.section variants={item}>
                <h3 className="text-h3 mb-4">The Challenge</h3>
                <p className="text-lg text-text-muted">{project.challenge}</p>
              </m.section>
              <m.section variants={item}>
                <h3 className="text-h3 mb-4">The Strategy</h3>
                <ol className="space-y-4">
                  {project.strategy.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="bg-brand-gradient grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white">{i + 1}</span>
                      <span className="pt-1 text-text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </m.section>
            </div>

            {project.beforeAfter && (
              <m.section variants={item}>
                <h3 className="text-h3 mb-6">Before &amp; after</h3>
                <BeforeAfterSlider {...project.beforeAfter} alt={project.title} />
              </m.section>
            )}

            {gallery.length > 0 && (
              <m.section variants={item}>
                <h3 className="text-h3 mb-6">Creatives &amp; dashboards</h3>
                <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
                  {gallery.map((img, i) => (
                    <li key={img.src} className="break-inside-avoid">
                      <button
                        type="button"
                        onClick={() => setLightbox(i)}
                        className="group block w-full overflow-hidden rounded-[12px] border border-border"
                        aria-label={`Open image ${i + 1} of ${gallery.length}`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={1200}
                          height={900}
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </m.section>
            )}

            {project.testimonial && (
              <m.figure variants={item} className="card relative p-8 sm:p-10">
                <Quote aria-hidden="true" className="absolute right-6 top-6 size-10 text-plum" />
                <blockquote className="text-h3 max-w-3xl font-medium">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-text-muted">
                  <span className="font-semibold text-text">{project.testimonial.name}</span> · {project.testimonial.role}
                </figcaption>
              </m.figure>
            )}

            <m.div variants={item} className="flex flex-col gap-3 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={onCta} className={buttonClasses()}>
                Get results like this
              </button>
              <button type="button" onClick={onNext} className={buttonClasses({ variant: "secondary" })}>
                <span>
                  Next project<span className="sr-only">: {next.title}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            </m.div>
          </m.div>
        </Container>
      </div>

      <Lightbox images={gallery} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
