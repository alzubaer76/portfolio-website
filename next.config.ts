import type { NextConfig } from "next";

// `PREVIEW_EXPORT=1 npm run build` produces a fully static copy in /out for
// review links (no server: images are served as-is).
const previewExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(previewExport ? { output: "export", images: { unoptimized: true } } : {}),
};

export default nextConfig;
