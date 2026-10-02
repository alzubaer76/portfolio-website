/**
 * Coordinates the hero entrance with the (optional) preloader.
 *
 * The preloader marks `<html data-intro="pending">` while it covers the page
 * and calls `markIntroDone()` when it starts to reveal the hero. Without a
 * preloader the intro is considered done immediately.
 */
const EVENT = "cc:intro-done";

export function isIntroPending(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "pending";
}

export function onIntroDone(cb: () => void): () => void {
  if (!isIntroPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}

export function markIntroDone() {
  delete document.documentElement.dataset.intro;
  window.dispatchEvent(new Event(EVENT));
}
