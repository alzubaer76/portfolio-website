"use client";

import { Clock } from "lucide-react";
import { site } from "@/content/site";
import { useLocalTime } from "@/hooks/useLocalTime";

/** "It's 10:24 PM in Dhaka · I usually reply within 2 hours" — time rendered after mount. */
export function LocalTime() {
  const { timezone, timezoneLabel, responseTime } = site.contact;
  const time = useLocalTime(timezone);
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-muted">
      <Clock aria-hidden="true" className="size-4 text-magenta" />
      <span>
        It&apos;s{" "}
        {/* Fixed-width slot so the line doesn't shift when the time appears */}
        <span className="inline-block min-w-[4.6em] font-semibold text-text tabular-nums">{time ?? " "}</span> in{" "}
        {timezoneLabel}
      </span>
      <span aria-hidden="true">·</span>
      <span>{responseTime}</span>
    </p>
  );
}
