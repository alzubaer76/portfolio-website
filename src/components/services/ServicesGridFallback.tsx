import type { Service } from "@/content/site";
import { ServiceCard } from "./ServiceCard";

/** Static grid: server render, no-JS and reduced motion. 2 columns → 4 on desktop. */
export function ServicesGrid({ services, onSelect }: { services: Service[]; onSelect: (slug: string) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <li key={s.slug} className="min-h-[260px]">
          <ServiceCard service={s} onSelect={() => onSelect(s.slug)} />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal scroll-snap carousel for small screens. */
export function ServicesCarousel({ services, onSelect }: { services: Service[]; onSelect: (slug: string) => void }) {
  return (
    <div className="relative">
      <ul
        aria-label="Services"
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((s) => (
          <li key={s.slug} className="h-[280px] w-[78%] max-w-[300px] shrink-0 snap-start">
            <ServiceCard service={s} onSelect={() => onSelect(s.slug)} />
          </li>
        ))}
      </ul>
      <p aria-hidden="true" className="mt-2 text-center text-sm text-text-muted">
        Swipe to explore →
      </p>
    </div>
  );
}
