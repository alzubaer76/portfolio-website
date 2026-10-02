# Commerce Crews — 3D Portfolio Website

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · React Three Fiber · GSAP · Lenis · Motion

> Work in progress — built in phases. Full setup, content-editing and deployment docs land with the final phase.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

## Editing content

All copy and data lives in **`src/content/site.ts`**. Every value marked `// TODO: replace` is a placeholder and must be replaced before launch — placeholder numbers and testimonials are deliberately fake-looking (`"Client Name"`, `0.0x`).

## Placeholder images

`npm run placeholders` generates any missing placeholder images in `public/` (logo, OG image, portrait, project covers/galleries, result screenshots, avatars, badges, platform wordmarks). It never overwrites existing files, so drop your real images in with the same filenames and they're kept. Replace `public/logo.png` with the real logo and re-run with `--force` only if you want the favicons regenerated from the placeholder rings.

## 3D hero notes

- The hero scene only runs on **hardware-accelerated WebGL2**. Reduced motion, no WebGL, or a software renderer (SwiftShader/llvmpipe — e.g. GPU-less machines and PageSpeed's test servers) get a static inline-SVG ring stack instead.
- Add **`?3d=1`** to the URL to force the 3D scene on a machine without a GPU (for testing only).
- `three` is pinned to `~0.182.0`: from r183 Three logs a `THREE.Clock` deprecation warning that React Three Fiber 9 still triggers internally. Lift the pin once R3F moves to `THREE.Timer`.

## Review build (static, no server)

`npm run preview` builds a static copy into `/preview` with every path made relative, so it can be hosted under any URL (used for the claude.ai review link). The production build (`npm run build`) is unaffected.
