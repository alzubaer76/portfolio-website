/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Map v from [inMin, inMax] to [0, 1], clamped. */
export const progress = (v: number, inMin: number, inMax: number) => clamp((v - inMin) / (inMax - inMin), 0, 1);

export function formatNumber(value: number, decimals = 0, locale = "en-US"): string {
  return value.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Simple trailing-edge throttle via requestAnimationFrame. */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T) {
  let frame = 0;
  let lastArgs: Parameters<T>;
  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...lastArgs);
    });
  };
  throttled.cancel = () => cancelAnimationFrame(frame);
  return throttled;
}
