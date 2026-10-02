"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Service } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { clamp, cn } from "@/lib/utils";
import { ServiceCard } from "./ServiceCard";

const AUTO_DEG_PER_S = 360 / 40; // one turn in 40s
const DRAG_DEG_PER_PX = 0.18;
const DRAG_THRESHOLD_PX = 6;
const INERTIA_DECAY = 0.95; // per 60fps frame
const SCROLL_BOOST = 0.004; // deg/s added per px/s of scroll velocity
const RESUME_AFTER_HOVER_MS = 1500;

interface ServicesRingProps {
  services: Service[];
  onOpen: (slug: string) => void;
  /** Auto-rotation pauses while the detail panel is open. */
  panelOpen: boolean;
}

/**
 * CSS-3D carousel ring. All motion runs on one GSAP ticker callback that
 * writes the angle straight to the DOM — React only re-renders when the
 * front card changes.
 */
export function ServicesRing({ services, onOpen, panelOpen }: ServicesRingProps) {
  const n = services.length;
  const step = 360 / n;
  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  // Mutable motion state — never in React state.
  const m = useRef({
    angle: 0,
    vel: 0, // deg per 60fps frame (inertia)
    boost: 0, // deg/s from page scroll
    front: 0,
    inView: false,
    hovered: false,
    down: false,
    dragging: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startAngle: 0,
    lastAngle: 0,
    lastTime: 0,
    tween: null as gsap.core.Tween | null,
    resumeTimer: 0 as number | ReturnType<typeof setTimeout>,
    autoBlocked: false,
  });

  // Anything that should stop auto-rotation and scroll boost.
  useEffect(() => {
    m.current.autoBlocked = paused || panelOpen || focusWithin;
  }, [paused, panelOpen, focusWithin]);

  /** Write the angle to the DOM and work out which card faces the viewer. */
  const apply = useCallback(() => {
    const st = m.current;
    const ring = ringRef.current;
    if (!ring) return;
    ring.style.transform = `rotateX(-10deg) rotateY(${st.angle}deg)`;
    let best = 0;
    let bestFacing = -2;
    itemRefs.current.forEach((li, i) => {
      if (!li) return;
      const world = ((((i * step + st.angle) % 360) + 540) % 360) - 180;
      const facing = Math.cos((world * Math.PI) / 180);
      li.style.setProperty("--facing", facing.toFixed(3));
      if (facing > bestFacing) {
        bestFacing = facing;
        best = i;
      }
    });
    if (best !== st.front) {
      st.front = best;
      setFront(best);
    }
  }, [step]);

  /** Closest equivalent angle (in turns) that puts card `i` at the front. */
  const angleFor = useCallback(
    (i: number) => {
      const base = -i * step;
      return base + Math.round((m.current.angle - base) / 360) * 360;
    },
    [step],
  );

  const rotateTo = useCallback((target: number, duration: number, ease: string, onComplete?: () => void) => {
    const st = m.current;
    st.tween?.kill();
    st.vel = 0;
    st.tween = gsap.to(st, {
      angle: target,
      duration,
      ease,
      onComplete: () => {
        st.tween = null;
        onComplete?.();
      },
    });
  }, []);

  const goTo = useCallback(
    (i: number, onComplete?: () => void) => {
      const idx = ((i % n) + n) % n;
      rotateTo(angleFor(idx), 0.8, "power3.inOut", () => {
        // Keyboard users: keep focus on the card now at the front.
        const region = regionRef.current;
        const active = document.activeElement;
        if (region && active && region.contains(active) && active !== region && !active.closest("[data-ring-controls]")) {
          buttonRefs.current[idx]?.focus({ preventScroll: true });
        }
        onComplete?.();
      });
    },
    [n, angleFor, rotateTo],
  );

  const snapToNearest = useCallback(() => {
    rotateTo(angleFor(m.current.front), 0.6, "power3.out");
  }, [angleFor, rotateTo]);

  // The single per-frame loop + scroll coupling.
  useGSAP(
    () => {
      const tick = (_time: number, deltaMs: number) => {
        const st = m.current;
        if (!st.inView) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        const f60 = dt * 60;
        if (!st.dragging && !st.tween) {
          if (Math.abs(st.vel) > 0.02) {
            st.angle += st.vel * f60;
            st.vel *= Math.pow(INERTIA_DECAY, f60);
            if (Math.abs(st.vel) <= 0.02) {
              st.vel = 0;
              apply();
              snapToNearest();
            }
          } else if (!st.hovered && !st.autoBlocked) {
            st.angle += AUTO_DEG_PER_S * dt;
          }
          if (Math.abs(st.boost) > 0.05) {
            st.angle += st.boost * dt;
            st.boost *= Math.pow(0.9, f60);
          }
        }
        apply();
      };
      gsap.ticker.add(tick);

      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          m.current.inView = self.isActive;
        },
        onUpdate: (self) => {
          const st = m.current;
          if (st.hovered || st.autoBlocked || st.dragging) return;
          st.boost = clamp(st.boost + self.getVelocity() * SCROLL_BOOST, -90, 90);
        },
      });
      m.current.inView = trigger.isActive;
      apply();

      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
        m.current.tween?.kill();
        clearTimeout(m.current.resumeTimer);
      };
    },
    { dependencies: [apply, snapToNearest] },
  );

  /* ---------------- pointer: drag, inertia, hover ---------------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const st = m.current;
    st.down = true;
    st.moved = false;
    st.pointerId = e.pointerId;
    st.startX = e.clientX;
    st.startY = e.clientY;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = m.current;
    if (!st.down || e.pointerId !== st.pointerId) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (!st.dragging) {
      if (Math.abs(dx) > DRAG_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
        // Horizontal intent: start dragging. Capture only now, so plain clicks
        // still reach the card buttons.
        st.dragging = true;
        st.moved = true;
        st.tween?.kill();
        st.tween = null;
        st.vel = 0;
        st.boost = 0;
        st.startX = e.clientX;
        st.startAngle = st.angle;
        st.lastAngle = st.angle;
        st.lastTime = performance.now();
        stageRef.current?.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > DRAG_THRESHOLD_PX) {
        st.down = false; // vertical intent: leave it to page scroll (touch-action: pan-y)
      }
      return;
    }
    st.angle = st.startAngle + (e.clientX - st.startX) * DRAG_DEG_PER_PX;
    const now = performance.now();
    const frames = Math.max((now - st.lastTime) / 16.67, 0.5);
    st.vel = st.vel * 0.3 + ((st.angle - st.lastAngle) / frames) * 0.7;
    st.lastAngle = st.angle;
    st.lastTime = now;
  };

  const endDrag = (e: React.PointerEvent) => {
    const st = m.current;
    if (e.pointerId !== st.pointerId) return;
    st.down = false;
    if (!st.dragging) return;
    st.dragging = false;
    if (stageRef.current?.hasPointerCapture(e.pointerId)) stageRef.current.releasePointerCapture(e.pointerId);
    // A stale velocity (pointer held still before release) shouldn't fling.
    if (performance.now() - st.lastTime > 80) st.vel = 0;
    if (Math.abs(st.vel) < 0.3) {
      st.vel = 0;
      snapToNearest();
    } else {
      st.vel = clamp(st.vel, -12, 12);
    }
  };

  // Drags never count as clicks.
  const onClickCapture = (e: React.MouseEvent) => {
    if (m.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      m.current.moved = false;
    }
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(m.current.resumeTimer);
    m.current.hovered = true;
    m.current.boost = 0;
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(m.current.resumeTimer);
    m.current.resumeTimer = setTimeout(() => {
      m.current.hovered = false;
    }, RESUME_AFTER_HOVER_MS);
  };

  /* ---------------- selection + keyboard ---------------- */

  const select = (i: number) => {
    const slug = services[i].slug;
    if (i === m.current.front && !m.current.tween) onOpen(slug);
    else goTo(i, () => onOpen(slug));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(m.current.front + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(m.current.front - 1);
    }
  };

  const isFocusable = (i: number) => {
    const d = (((i - front) % n) + n) % n;
    return d === 0 || d === 1 || d === n - 1;
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Services ring"
      aria-describedby="services-ring-help"
      tabIndex={0}
      onKeyDown={onKeyDown}
      // Keyboard focus pauses auto-rotation; a mouse press that focuses a card shouldn't.
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) setFocusWithin(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
      className="relative rounded-[24px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta"
    >
      <p id="services-ring-help" className="sr-only">
        Use the left and right arrow keys or the previous and next buttons to rotate. Select a card for details.
      </p>

      <div
        ref={stageRef}
        className="ring-stage relative mx-auto select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <ul ref={ringRef} className="ring-3d">
          {services.map((s, i) => {
            const focusable = isFocusable(i);
            return (
              <li
                key={s.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="ring-item"
                style={{ "--i": i, "--step": `${step}deg` } as CSSProperties}
                aria-hidden={focusable ? undefined : true}
              >
                <ServiceCard
                  service={s}
                  highlighted={i === front}
                  inert={!focusable}
                  onSelect={() => select(i)}
                  buttonRef={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  className="ring-card"
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex flex-col items-center gap-5" data-ring-controls>
        <p
          className="text-h3 text-center"
          aria-live={paused || focusWithin ? "polite" : "off"}
          aria-atomic="true"
        >
          <span className="text-gradient">{services[front].name}</span>
          <span className="ml-3 align-middle text-sm font-medium text-text-muted tabular-nums">
            {front + 1} / {n}
          </span>
        </p>
        <div className="flex items-center gap-3">
          <RingButton label="Previous service" onClick={() => goTo(m.current.front - 1)}>
            <ChevronLeft aria-hidden="true" className="size-5" />
          </RingButton>
          <RingButton label="Pause auto-rotation" onClick={() => setPaused((p) => !p)} pressed={paused}>
            {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
          </RingButton>
          <RingButton label="Next service" onClick={() => goTo(m.current.front + 1)}>
            <ChevronRight aria-hidden="true" className="size-5" />
          </RingButton>
        </div>
      </div>
    </div>
  );
}

function RingButton({ label, onClick, pressed, children }: { label: string; onClick: () => void; pressed?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-border text-text transition-[border-color,transform] hover:border-magenta active:scale-95",
      )}
    >
      {children}
    </button>
  );
}
