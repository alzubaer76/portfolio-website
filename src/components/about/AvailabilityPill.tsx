import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const DOT: Record<"open" | "limited" | "closed", string> = {
  open: "bg-success animate-pulse-dot",
  limited: "bg-success animate-pulse-dot",
  closed: "bg-text-muted",
};

export function AvailabilityPill({ className }: { className?: string }) {
  const { status, note } = site.about.availability;
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-bg-elevated/70 px-3.5 py-1.5 text-[13px] font-medium text-text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", DOT[status])} />
      <span>
        <span className="sr-only">Availability: </span>
        {note}
      </span>
    </p>
  );
}
