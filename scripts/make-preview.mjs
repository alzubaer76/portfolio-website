/**
 * Turns the static export in /out into a self-contained, path-relative copy
 * that works from any URL (e.g. a review link hosted under a sub-path).
 *
 *   PREVIEW_EXPORT=1 npm run build && node scripts/make-preview.mjs <outDir>
 *
 * Rewrites root-absolute references ("/_next/…", "/projects/…") to relative
 * ones in HTML, CSS and JS. The source tree is never modified.
 */
import { cp, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "out");
const dest = path.resolve(process.argv[2] ?? path.join(root, "preview"));

// Top-level files/folders from /public referenced by the app.
const PUBLIC = String.raw`logo\.png|logo\.svg|about\.jpg|og\.jpg|icon\.png|apple-icon\.png|projects/|results/|testimonials/|badges/|platforms/`;
// A root-absolute path right after a quote (plain or JSON-escaped inside the RSC payload).
const quoted = (body) => new RegExp(String.raw`(\\?["'])/(${body})`, "g");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
// Not needed for a single-page review copy.
await rm(path.join(dest, "404.html"), { force: true });
await rm(path.join(dest, "index.txt"), { force: true });
await rm(path.join(dest, "_not-found"), { recursive: true, force: true });
await rm(path.join(dest, "_not-found.txt"), { force: true });
// Pages-router and 404 leftovers the single app-router page never loads.
await rm(path.join(dest, "_next/static/chunks/pages"), { recursive: true, force: true });
await rm(path.join(dest, "_next/static/chunks/app/_not-found"), { recursive: true, force: true });
for (const dir of await readdir(path.join(dest, "_next/static"))) {
  if (!["chunks", "css", "media"].includes(dir)) await rm(path.join(dest, "_next/static", dir), { recursive: true, force: true });
}

// Some hosts reserve top-level names starting with "_": serve Next's assets from a plain folder.
const ASSET_DIR = "next-assets";
await rename(path.join(dest, "_next"), path.join(dest, ASSET_DIR));

const counts = {};
for (const file of await walk(dest)) {
  const ext = path.extname(file);
  if (![".html", ".js", ".css"].includes(ext)) continue;
  let s = await readFile(file, "utf8");
  const before = s;
  if (ext === ".css") {
    // CSS lives in _next/static/css/, fonts in _next/static/media/.
    s = s.replaceAll("url(/_next/static/media/", "url(../media/");
  } else {
    s = s.replace(quoted(String.raw`_next/`), `$1./${ASSET_DIR}/`);
    s = s.replace(quoted(PUBLIC), "$1./$2");
  }
  // Webpack runtime public path: resolve lazy chunks relative to the page.
  if (ext === ".js") {
    s = s.replaceAll('r.p="/_next/"', `r.p="./${ASSET_DIR}/"`);
    // Raw U+FFFD inside string literals (URL polyfill) -> identical escape sequence,
    // so text-validating hosts don't mistake it for a decoding error.
    s = s.replaceAll("\uFFFD", "\\ufffd");
  }
  if (s !== before) {
    await writeFile(file, s);
    counts[path.relative(dest, file)] = true;
  }
}
console.log(`preview written to ${dest} (${Object.keys(counts).length} files rewritten)`);
