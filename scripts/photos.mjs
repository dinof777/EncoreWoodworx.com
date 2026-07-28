#!/usr/bin/env node
/**
 * Turn dropped photos into web-ready assets the site can rotate through.
 *
 *   photos/            originals you drop in — any size, name or format. Gitignored.
 *   public/photos/     what this writes: resized WebP + manifest.json. Committed.
 *
 * Run `npm run photos` after adding or removing files, then commit and push — Vercel
 * redeploys and the new photos are live.
 *
 * Notable behaviours:
 *  - EXIF orientation is applied, so phone photos are not sideways.
 *  - All other metadata is stripped. Phone photos carry GPS coordinates; those would
 *    otherwise be published, pinning your workshop and home on a public site.
 *  - Alt text you write into manifest.json is preserved across re-runs. Only new files
 *    get a generated placeholder.
 *  - A photo removed from photos/ has its generated output removed too.
 */

import { readdir, mkdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "photos");
const OUT_DIR = path.join(ROOT, "public", "photos");
const MANIFEST = path.join(OUT_DIR, "manifest.json");

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"]);
const MAX_WIDTH = 2400; // comfortably covers a full-bleed hero at 2x on a large display
const QUALITY = 82;

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "photo";
}

/** "live-edge-walnut-table" -> "Live edge walnut table" — a starting point, not a caption. */
function altFromSlug(slug) {
  const words = slug.replace(/-/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * sharp only reads HEIC when its libvips was built with libheif, which is not guaranteed.
 * macOS ships `sips`, so convert to a temporary JPEG and carry on rather than failing.
 */
async function loadBuffer(file) {
  try {
    return await sharp(file).rotate().toBuffer();
  } catch (err) {
    if (!/heif|heic|unsupported image format/i.test(String(err))) throw err;
    const tmp = path.join(OUT_DIR, `.tmp-${path.basename(file)}.jpg`);
    await run("sips", ["-s", "format", "jpeg", file, "--out", tmp]);
    const buf = await sharp(tmp).rotate().toBuffer();
    await unlink(tmp).catch(() => {});
    return buf;
  }
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No photos/ directory. Create it and drop images in, then re-run.`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const entries = (await readdir(SRC_DIR))
    .filter((f) => !f.startsWith("."))
    .filter((f) => SOURCE_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  // Keep whatever alt text has been written by hand.
  let previous = [];
  try {
    previous = JSON.parse(await readFile(MANIFEST, "utf8")).photos ?? [];
  } catch {
    /* first run */
  }
  const priorAlt = new Map(previous.map((p) => [p.file, p.alt]));

  const photos = [];
  const seen = new Set();
  let built = 0;
  let reused = 0;

  for (const entry of entries) {
    const src = path.join(SRC_DIR, entry);
    let slug = slugify(entry);
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);

    const file = `${slug}.webp`;
    const outPath = path.join(OUT_DIR, file);

    // Skip work when the output is already newer than its source.
    const [srcStat, outStat] = await Promise.all([stat(src), stat(outPath).catch(() => null)]);
    let meta;
    if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
      meta = await sharp(outPath).metadata();
      reused++;
    } else {
      const buf = await loadBuffer(src);
      await sharp(buf)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      meta = await sharp(outPath).metadata();
      built++;
      console.log(`  built  ${entry}  ->  photos/${file}  (${meta.width}x${meta.height})`);
    }

    photos.push({
      file,
      width: meta.width ?? null,
      height: meta.height ?? null,
      alt: priorAlt.get(file) ?? altFromSlug(slug),
    });
  }

  // Drop generated files whose source is gone.
  const current = new Set(photos.map((p) => p.file));
  let removed = 0;
  for (const f of await readdir(OUT_DIR)) {
    if (f === "manifest.json" || f.startsWith(".")) continue;
    if (!current.has(f)) {
      await unlink(path.join(OUT_DIR, f));
      console.log(`  removed  photos/${f}  (source no longer in photos/)`);
      removed++;
    }
  }

  await writeFile(MANIFEST, JSON.stringify({ photos }, null, 2) + "\n");

  console.log(
    `\n${photos.length} photo${photos.length === 1 ? "" : "s"} ready` +
      `  (${built} built, ${reused} unchanged, ${removed} removed)`,
  );
  if (photos.length === 0) {
    console.log("Drop images into photos/ and run this again.");
  } else {
    console.log("Edit alt text in public/photos/manifest.json, then commit and push to deploy.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
