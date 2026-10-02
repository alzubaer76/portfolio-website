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
type OpenFn = (slug: string, options?: { replace?: boolean }) => void;

export function useHashRoute(prefix: string): [slug: string | null, open: OpenFn, close: () => void] {
  const hash = useSyncExternalStore(subscribe, getHash, () => "");
  const match = hash.match(new RegExp(`^#${prefix}/([\\w-]+)$`));
  const slug = match ? match[1] : null;

  const open = useCallback<OpenFn>(
    (next, { replace = false } = {}) => {
      const target = `#${prefix}/${next}`;
      if (window.location.hash === target) return;
      // `replace` swaps the open item (e.g. "next project") without adding a back-step.
      const state = replace ? history.state : { hashRoute: prefix };
      history[replace ? "replaceState" : "pushState"](state, "", target);
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
