import { cn } from "@/lib/utils";

const RADII = [220, 195, 172, 150, 130, 112, 96];
const COLORS = ["#D900FD", "#C900F2", "#BB00E5", "#9E00C9", "#8A00BC", "#7A00AE", "#5E0094"];
const HALF_GAP = (40 * Math.PI) / 180;
const C = 256;

/** Open arc of the "C" (opening right), as an SVG path. */
function arc(r: number) {
  const x1 = (C + r * Math.cos(HALF_GAP)).toFixed(2);
  const y1 = (C - r * Math.sin(HALF_GAP)).toFixed(2);
  const y2 = (C + r * Math.sin(HALF_GAP)).toFixed(2);
  return `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x1} ${y2}`;
}

/**
 * Static ring stack for reduced motion, devices without fast WebGL, and while
 * the 3D chunk loads. Inline SVG on purpose: it needs no request and is not an
 * LCP candidate, so the H1 stays the largest contentful paint.
 */
export function HeroFallback({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 flex items-center", className)}>
      <svg
        viewBox="0 0 512 512"
        className="mx-auto w-[min(92vw,520px)] opacity-60 lg:mr-[max(4vw,calc((100vw-1240px)/2))] lg:w-[min(38vw,520px)] lg:opacity-90"
      >
        <defs>
          <radialGradient id="hero-fallback-orb" cx="35%" cy="35%" r="70%">
            <stop offset="0" stopColor="#B455F0" />
            <stop offset="1" stopColor="#5E0094" />
          </radialGradient>
        </defs>
        <g style={{ filter: "drop-shadow(0 0 18px rgba(217,0,253,0.35))" }}>
          {RADII.map((r, i) => (
            <path key={r} d={arc(r * 0.95)} stroke={COLORS[i]} strokeWidth={18 - i * 1.3} strokeLinecap="round" fill="none" />
          ))}
          {/* Round "partnership" end at the inner arc's lower tip */}
          <circle cx={C + RADII[6] * 0.95 * Math.cos(HALF_GAP)} cy={C + RADII[6] * 0.95 * Math.sin(HALF_GAP)} r={30} fill="url(#hero-fallback-orb)" />
        </g>
      </svg>
    </div>
  );
}
