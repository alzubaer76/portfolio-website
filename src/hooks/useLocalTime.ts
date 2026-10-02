"use client";

import { useEffect, useState } from "react";

/**
 * Current time in `timeZone`, e.g. "10:24 PM". `null` until mounted (no
 * server/client mismatch), then refreshed on each minute boundary.
 */
export function useLocalTime(timeZone: string): string | null {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone });
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(fmt.format(new Date()));
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, [timeZone]);
  return time;
}
