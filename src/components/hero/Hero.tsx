"use client";

import dynamic from "next/dynamic";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { isIntroPending, onIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFinePointer } from "@/hooks/useIsTouch";
import { useInView, usePageVisible } from "@/hooks/useInView";
import { useWebGL } from "@/hooks/useWebGL";
import { HeroFallback } from "./HeroFallback";
import { ScrollIndicator } from "./ScrollIndicator";
import { heroState } from "./heroState";

// Three.js, R3F and postprocessing live only in this lazily loaded chunk.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false, loading: () => null });

/** Hydration later than this means the visitor has already read the headline — don't hide it to animate it in. */
const INTRO_MAX_DELAY_MS = 1200;

export function Hero() {
  const { hero } = site;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [stage3d, setStage3d] = useState(false); // canvas chunk requested
  const [canvasReady, setCanvasReady] = useState(false); // first frame rendered
  const [introPlayed, setIntroPlayed] = useState(false);
  // While pinned, the scroll sequence decides when the scene is visible: GSAP's
  // pin-spacer re-parents the section, which leaves an IntersectionObserver on it stale.
  const [pinned, setPinned] = useState(false);
  const [sequenceDone, setSequenceDone] = useState(false);
  const sequenceDoneRef = useRef(false);

  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const finePointer = useFinePointer();
  const inView = useInView(sectionRef, { rootMargin: "100px" });
  const pageVisible = usePageVisible();
  const renderActive = pageVisible && (pinned ? !sequenceDone : inView);

  const use3d = webgl === true && !reduced;
  const showFallback = webgl === false || reduced || (use3d && !canvasReady);

  // Load the 3D chunk only after the text has painted and the main thread is idle.
  useEffect(() => {
    if (!use3d) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setStage3d(true), { timeout: 1500 });
    return () => cic(id);
  }, [use3d]);

  // Pointer → normalised coordinates for the ring tilt (desktop, fine pointer).
  useEffect(() => {
    if (!use3d || !finePointer) return;
    const onMove = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      heroState.pointerX = 0;
      heroState.pointerY = 0;
    };
  }, [use3d, finePointer]);

  const onCanvasReady = useCallback(() => setCanvasReady(true), []);

  // Text entrance: words rise from below their masks after the preloader.
  useGSAP(
    () => {
      const covered = isIntroPending();
      if (reduced || (!covered && performance.now() > INTRO_MAX_DELAY_MS)) {
        setIntroPlayed(true);
        return;
      }
      const q = gsap.utils.selector(sectionRef);
      const words = q("[data-word]");
      const rest = q("[data-enter]");
      gsap.set(words, { yPercent: 110 });
      gsap.set(rest, { autoAlpha: 0, y: 24 });
      let tl: gsap.core.Timeline | undefined;
      const stop = onIntroDone(() => {
        tl = gsap
          .timeline({ onComplete: () => setIntroPlayed(true) })
          .to(words, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.04 })
          .to(rest, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08, clearProps: "transform" }, 0.25);
      });
      return () => {
        stop();
        tl?.kill();
      };
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  // Scroll sequence: hero pinned for +=150%. Only with motion + WebGL, and only
  // when the hero content fits the viewport (otherwise pinning would hide it).
  useGSAP(
    () => {
      if (!use3d) return;
      const section = sectionRef.current;
      const canvasWrap = canvasWrapRef.current;
      if (!section || !canvasWrap) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        if (section.scrollHeight > window.innerHeight + 2) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // Created after hydration (needs the WebGL check), so refresh it first:
            // triggers further down must be measured with its pin spacing in place.
            refreshPriority: 1,
          },
          // Read the *scrubbed* progress so the 3D eases exactly like the DOM.
          onUpdate: () => {
            const p = tl.progress();
            heroState.progress = p;
            // Canvas is fully faded at the end: stop rendering (state flips only on change).
            const done = p >= 0.999;
            if (done !== sequenceDoneRef.current) {
              sequenceDoneRef.current = done;
              setSequenceDone(done);
            }
          },
        });
        tl.to(q("[data-scroll='headline']"), { yPercent: -35, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q("[data-scroll='support']"), { y: -40, autoAlpha: 0, duration: 0.2 }, 0.1)
          .to(q("[data-scroll='actions']"), { y: -30, autoAlpha: 0, duration: 0.07 }, 0.25)
          .to(canvasWrap, { autoAlpha: 0, duration: 0.3 }, 0.7)
          .set({}, {}, 1); // timeline length = 1 so time === progress
        setPinned(true);
        return () => {
          heroState.progress = 0;
          sequenceDoneRef.current = false;
          setPinned(false);
          setSequenceDone(false);
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [use3d] },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      data-section="Home"
      className="relative flex min-h-[100svh] items-center overflow-x-clip pt-[var(--nav-h)]"
    >
      {/* 3D stage — absolutely positioned, so mounting it never shifts layout. */}
      <div ref={canvasWrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {showFallback && <HeroFallback className={cn("transition-opacity duration-700", use3d && canvasReady && "opacity-0")} />}
        {use3d && stage3d && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              canvasReady ? "opacity-60 lg:opacity-100" : "opacity-0",
            )}
          >
            <HeroCanvas active={renderActive} desktop={desktop} interactive={finePointer} onReady={onCanvasReady} />
          </div>
        )}
        {/* Mobile scrim keeps the text readable over the scene. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,rgba(10,6,18,0.85),rgba(10,6,18,0.2)_70%)] lg:hidden" />
      </div>

      <Container className="relative z-10 py-10 lg:py-8">
        <div className="max-w-[44rem] lg:w-[58%] lg:max-w-none">
          <div data-scroll="support">
            <p
              data-enter
              className="text-eyebrow mb-6 short:mb-4 inline-flex items-center rounded-full border border-border bg-bg-elevated/70 px-4 py-2 text-text-muted backdrop-blur-sm"
            >
              {hero.eyebrow}
            </p>
          </div>

          <div data-scroll="headline">
            <h1 id="hero-heading" className="text-display text-[length:min(clamp(2.75rem,6vw+1rem,6rem),10.5svh)]">
              {hero.headline.map((part, i) =>
                part.text
                  .split(/(\s+)/)
                  .filter(Boolean)
                  .map((token, j) =>
                    /^\s+$/.test(token) ? (
                      " "
                    ) : (
                      // Mask: padding/negative margin keeps descenders from being clipped.
                      <span key={`${i}-${j}`} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                        <span data-word className={cn("inline-block will-change-transform", part.highlight && "text-gradient")}>
                          {token}
                        </span>
                      </span>
                    ),
                  ),
              )}
            </h1>
          </div>

          <div data-scroll="support">
            <p data-enter className="mt-6 max-w-xl text-lg text-text-muted short:mt-4 md:text-xl">
              {hero.subheadline}
            </p>
          </div>

          <div data-scroll="actions">
            <div data-enter className="mt-10 flex flex-col gap-3 short:mt-7 sm:flex-row">
              <Button href={hero.primaryCta.href} iconLeft={<CalendarDays aria-hidden="true" className="size-5" />}>
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="secondary"
                className="backdrop-blur-sm"
                iconRight={<ArrowRight aria-hidden="true" className="size-5" />}
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
            <dl data-enter className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-8 short:mt-8 short:pt-5">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="text-sm text-text-muted">{stat.label}</dt>
                  <dd className="text-metric order-first text-3xl md:text-4xl">
                    <CountUp
                      value={stat.value}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      start={introPlayed}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>

      <ScrollIndicator label={hero.scrollLabel} />
    </section>
  );
}
