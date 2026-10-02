import { ArrowUpRight } from "lucide-react";
import type { Ref } from "react";
import type { Service } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
  /** Gradient border: the ring's front-most card. */
  highlighted?: boolean;
  /** Remove from the tab order (ring cards not facing the viewer). */
  inert?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
}

/**
 * Card with a real <h3> (crawlable service name) and a "stretched" button
 * whose ::after covers the whole card, so the entire card is clickable while
 * the markup stays valid (no headings inside a button).
 */
export function ServiceCard({ service, onSelect, highlighted, inert, buttonRef, className }: ServiceCardProps) {
  return (
    <article
      className={cn(
        "group card card-hover service-card relative flex h-full w-full flex-col gap-4 p-6 text-left has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-3 has-[button:focus-visible]:outline-magenta",
        highlighted && "is-front",
        className,
      )}
    >
      <span className="bg-brand-gradient grid size-12 shrink-0 place-items-center rounded-full text-white shadow-glow">
        <Icon name={service.icon} className="size-6" />
      </span>
      <h3 className="text-h3 leading-tight">{service.name}</h3>
      <p className="text-[15px] leading-relaxed text-text-muted">{service.tagline}</p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onSelect}
        tabIndex={inert ? -1 : undefined}
        aria-haspopup="dialog"
        className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-text outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
      >
        View details <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only">: {service.name}</span>
      </button>
    </article>
  );
}
