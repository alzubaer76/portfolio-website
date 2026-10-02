"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

export function Lightbox({ images, index, onChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const open = index !== null;
  useFocusTrap(ref, open, { onEscape: onClose });

  const go = (d: number) => index !== null && onChange((index + d + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onChange(((index ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft") onChange(((index ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onChange]);

  if (typeof document === "undefined") return null;
  const current = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index! + 1} of ${images.length}`}
          tabIndex={-1}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/95 p-4 outline-none backdrop-blur sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="relative h-full w-full">
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-bg-elevated px-4 py-1.5 text-sm tabular-nums text-text-muted" aria-hidden="true">
            {index! + 1} / {images.length}
          </p>
          <button type="button" onClick={onClose} aria-label="Close image" className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-text hover:border-magenta">
            <X aria-hidden="true" className="size-5" />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated text-text hover:border-magenta">
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated text-text hover:border-magenta">
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </>
          )}
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
