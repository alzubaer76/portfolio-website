"use client";

import type { ProjectFilter } from "@/content/site";
import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: { id: ProjectFilter; label: string }[];
  active: ProjectFilter;
  onChange: (id: ProjectFilter) => void;
  counts: Record<ProjectFilter, number>;
}

export function FilterChips({ filters, active, onChange, counts }: FilterChipsProps) {
  return (
    <div role="group" aria-label="Filter projects" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {filters.map((f) => {
        const isActive = f.id === active;
        const empty = counts[f.id] === 0;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={isActive}
            disabled={empty}
            onClick={() => onChange(f.id)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-colors disabled:opacity-40",
              isActive ? "border-transparent bg-brand-gradient text-white" : "border-border text-text-muted hover:border-magenta hover:text-text",
            )}
          >
            {f.label}
            <span className={cn("text-xs tabular-nums", isActive ? "text-white/80" : "text-text-muted")}>{counts[f.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
