/**
 * Generates placeholder images so the site renders fully on first run.
 * Run: node scripts/generate-placeholders.mjs
 * Existing files are NOT overwritten (pass --force to regenerate), so real
 * images you drop into /public are safe.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = (p) => path.join(root, "public", p);
const force = process.argv.includes("--force");

const COLORS = ["#D900FD", "#C900F2", "#BB00E5", "#9E00C9", "#8A00BC", "#7A00AE", "#5E0094"];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function out(file, data) {
  const full = file.startsWith(root) ? file : pub(file);
  if (!force && (await exists(full))) return;
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  console.log("wrote", path.relative(root, full));
}

/** Stack of open concentric arcs (the "C"), opening to the right. */
export function ringsSvg(size = 512, { bg = null, glow = true } = {}) {
  const c = size / 2;
  const scale = size / 512;
  const radii = [220, 195, 172, 150, 130, 112, 96].map((r) => r * scale * 0.95);
  const tubes = [16, 15, 14, 12.5, 11, 10, 9].map((t) => t * scale * 1.15);
  const half = (40 * Math.PI) / 180;
  const arcs = radii
    .map((r, i) => {
      const x1 = c + r * Math.cos(half);
      const y1 = c - r * Math.sin(half);
      const x2 = c + r * Math.cos(-half);
      const y2 = c - r * Math.sin(-half);
      return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 0 ${x2.toFixed(2)} ${y2.toFixed(2)}" stroke="${COLORS[i]}" stroke-width="${tubes[i]}" stroke-linecap="round" fill="none"/>`;
    })
    .join("");
  const rIn = radii[6] * 0.55;
  const orb = `<circle cx="${c - rIn * 0.15}" cy="${c + rIn * 0.25}" r="${34 * scale}" fill="url(#orb)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="orb" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#B455F0"/><stop offset="1" stop-color="#5E0094"/></radialGradient>
    ${glow ? `<filter id="g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${6 * scale}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` : ""}
  </defs>
  ${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}
  <g ${glow ? 'filter="url(#g)"' : ""}>${arcs}${orb}</g>
</svg>`;
}

function card(w, h, title, sub = "", { hue = 0 } = {}) {
  const a = COLORS[hue % COLORS.length];
  const b = COLORS[(hue + 4) % COLORS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#140C22"/><stop offset="1" stop-color="#0A0612"/></linearGradient>
    <radialGradient id="glow" cx="75%" cy="20%" r="70%"><stop offset="0" stop-color="${a}" stop-opacity="0.55"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g stroke="#2A1A40" stroke-width="1">${Array.from({ length: 12 }, (_, i) => `<line x1="${(i * w) / 12}" y1="0" x2="${(i * w) / 12}" y2="${h}"/>`).join("")}</g>
  <text x="50%" y="${h / 2}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${Math.round(Math.min(w, h) / 11)}" fill="#F5F0FA">${title}</text>
  ${sub ? `<text x="50%" y="${h / 2 + Math.min(w, h) / 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(w, h) / 22)}" fill="#B7A9C9">${sub}</text>` : ""}
</svg>`;
}

const jpg = (svg) => sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
const png = (svg) => sharp(Buffer.from(svg)).png().toBuffer();

// Logo + icons
await out("logo.svg", ringsSvg(512, { glow: false }));
await out("logo.png", await png(ringsSvg(512, { glow: false })));
await out(path.join(root, "src/app/icon.png"), await png(ringsSvg(512, { bg: "#0A0612", glow: false })));
await out(path.join(root, "src/app/apple-icon.png"), await sharp(Buffer.from(ringsSvg(180, { bg: "#0A0612", glow: false }))).png().toBuffer());

// OG image
await out(
  "og.jpg",
  await jpg(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="100%" height="100%" fill="#0A0612"/>
  <g transform="translate(700 70) scale(0.95)">${ringsSvg(512).replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="80" y="270" font-family="Arial" font-weight="700" font-size="68" fill="#F5F0FA">Commerce Crews</text>
  <text x="80" y="340" font-family="Arial" font-size="32" fill="#B7A9C9">Meta, TikTok &amp; Google Ads</text>
  <text x="80" y="390" font-family="Arial" font-size="24" fill="#D900FD">PLACEHOLDER OG IMAGE — replace</text>
</svg>`),
);

// About portrait (4:5)
await out("about.jpg", await jpg(card(800, 1000, "Portrait placeholder", "Replace /public/about.jpg (4:5)", { hue: 2 })));

// Projects
const projects = ["project-one", "project-two", "project-three", "project-four", "project-five", "project-six"];
for (const [i, slug] of projects.entries()) {
  await out(`projects/${slug}/cover.jpg`, await jpg(card(1200, 900, `Project ${i + 1} cover`, "Placeholder image", { hue: i })));
  for (let g = 1; g <= 3; g++) {
    await out(`projects/${slug}/gallery-${g}.jpg`, await jpg(card(g === 2 ? 900 : 1200, g === 2 ? 1200 : 800, `Gallery ${g}`, `Project ${i + 1} · placeholder`, { hue: i + g })));
  }
  await out(`projects/${slug}/before.jpg`, await jpg(card(1200, 750, "BEFORE", "Placeholder creative / metrics", { hue: 6 })));
  await out(`projects/${slug}/after.jpg`, await jpg(card(1200, 750, "AFTER", "Placeholder creative / metrics", { hue: 0 })));
}

// Results screenshots
for (const name of ["meta-1", "meta-2", "meta-3", "google-1", "google-2", "tiktok-1"]) {
  await out(`results/${name}.jpg`, await jpg(card(840, 520, `${name.split("-")[0].toUpperCase()} dashboard`, "Placeholder screenshot — blur client names", { hue: name.length })));
}

// Testimonials
for (let i = 1; i <= 6; i++) {
  await out(`testimonials/avatar-${i}.jpg`, await jpg(card(160, 160, "", "", { hue: i })));
}
await out("testimonials/video-poster-1.jpg", await jpg(card(720, 1280, "Video poster", "Placeholder", { hue: 3 })));

// Badges
for (let i = 1; i <= 3; i++) {
  await out(
    `badges/badge-${i}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#140C22" stroke="#5F2C89" stroke-width="3"/><text x="60" y="56" text-anchor="middle" font-family="Arial" font-weight="700" font-size="14" fill="#F5F0FA">BADGE ${i}</text><text x="60" y="76" text-anchor="middle" font-family="Arial" font-size="11" fill="#B7A9C9">placeholder</text></svg>`,
  );
}

// Platform wordmarks (neutral text placeholders — replace with official logo files)
for (const [file, label] of [
  ["meta", "Meta"],
  ["google-ads", "Google Ads"],
  ["tiktok", "TikTok"],
  ["shopify", "Shopify"],
  ["woocommerce", "WooCommerce"],
  ["ga4", "GA4"],
]) {
  const w = 40 + label.length * 15;
  await out(
    `platforms/${file}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="40" viewBox="0 0 ${w} 40"><text x="0" y="28" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="#B7A9C9">${label}</text></svg>`,
  );
}

console.log("done");
