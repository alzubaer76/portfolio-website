"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMounted } from "@/hooks/useMounted";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollLock } from "@/hooks/useScrollLock";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy: string;
  children: ReactNode;
}

const spring = { type: "spring", damping: 34, stiffness: 320 } as const;

/**
 * Modal drawer: a 480px panel from the right on desktop, an 85svh bottom
 * sheet with a drag-to-close handle on mobile. Focus is trapped and restored,
 * Esc / backdrop close it, and page scroll (Lenis included) is locked.
 */
export function Drawer({ open, onClose, labelledBy, children }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const desktop = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  useFocusTrap(ref, open, { onEscape: onClose });
  useScrollLock(open);

  if (!mounted) return null;

  const hidden = desktop ? { x: "100%" } : { y: "100%" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={
              desktop
                ? "absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-border bg-bg-elevated shadow-2xl outline-none"
                : "absolute inset-x-0 bottom-0 flex h-[85svh] flex-col rounded-t-[24px] border-t border-border bg-bg-elevated shadow-2xl outline-none"
            }
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={reduced ? { duration: 0 } : spring}
            drag={desktop ? false : "y"}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            {!desktop && (
              <div
                aria-hidden="true"
                onPointerDown={(e) => dragControls.start(e)}
                className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing"
              >
                <span className="h-1.5 w-12 rounded-full bg-border" />
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
