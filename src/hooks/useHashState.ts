"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Fired after our own pushState/replaceState, which don't emit hashchange. */
const LOCAL_EVENT = "cc:hashroute";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(LOCAL_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(LOCAL_EVENT, onChange);
  };
}

const getHash = () => window.location.hash;

/**
 * Deep-linkable overlay state in the URL hash, e.g. `#services/meta-ads`.
 * `open` pushes a history entry so the browser back button closes the
 * overlay; `close` pops that entry when we created it, else replaces it.
 */
export function useHashRoute(prefix: string): [slug: string | null, open: (slug: string) => void, close: () => void] {
  const hash = useSyncExternalStore(subscribe, getHash, () => "");
  const match = hash.match(new RegExp(`^#${prefix}/([\\w-]+)$`));
  const slug = match ? match[1] : null;

  const open = useCallback(
    (next: string) => {
      const target = `#${prefix}/${next}`;
      if (window.location.hash === target) return;
      history.pushState({ hashRoute: prefix }, "", target);
      window.dispatchEvent(new Event(LOCAL_EVENT));
    },
    [prefix],
  );

  const close = useCallback(() => {
    if ((history.state as { hashRoute?: string } | null)?.hashRoute === prefix) {
      history.back();
    } else {
      history.replaceState(null, "", `#${prefix}`);
      window.dispatchEvent(new Event(LOCAL_EVENT));
    }
  }, [prefix]);

  return [slug, open, close];
}
