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

import { readdir, mkdir, readFile, writeFile, unlink, stat, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "photos");
/**
 * Originals move here once processed, so the drop folder only ever shows what is new.
 * They are still sources: a photo is on the site while its original is in *either*
 * location, and deleting it from here is how you take it off the site.
 */
const DONE_DIR = path.join(SRC_DIR, "processed");
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
 * Camera and phone filenames — IMG_0055, DSC_1234, PXL_2024…, a bare timestamp, a uuid.
 * Turning those into alt text produces "Img 0055", which is worse than no alt text at all:
 * a screen reader reads it aloud and the listener learns nothing. Such photos get an empty
 * alt (correct for decorative imagery) until a real description is written.
 */
const CAMERA_NAME = /^(img|dsc|dscn|pxl|mvimg|photo|image|screenshot|fullsizerender)[-_ ]?\d*$|^\d{6,}|[0-9a-f]{8}-[0-9a-f]{4}/i;

function isCameraName(slug) {
  return CAMERA_NAME.test(slug.replace(/-/g, "_")) || CAMERA_NAME.test(slug);
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
  await mkdir(DONE_DIR, { recursive: true });

  const usable = (f) => !f.startsWith(".") && SOURCE_EXT.has(path.extname(f).toLowerCase());
  const incoming = (await readdir(SRC_DIR)).filter(usable).sort();
  const archived = (await readdir(DONE_DIR)).filter(usable).sort();

  // Both folders are sources. Anything in the drop root is new and gets filed away after.
  const entries = [
    ...incoming.map((f) => ({ name: f, dir: SRC_DIR, fresh: true })),
    ...archived.map((f) => ({ name: f, dir: DONE_DIR, fresh: false })),
  ];

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
  let filed = 0;

  for (const { name: entry, dir, fresh } of entries) {
    const src = path.join(dir, entry);
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

    // Preserve alt text only when it was written by hand. A stored value identical to what
    // we would generate is our own placeholder, so it can be re-derived — that is what
    // lets an improved rule repair filenames already in the manifest.
    const generated = isCameraName(slug) ? "" : altFromSlug(slug);
    const stored = priorAlt.get(file);
    const handWritten = stored != null && stored !== "" && stored !== altFromSlug(slug);

    photos.push({
      file,
      width: meta.width ?? null,
      height: meta.height ?? null,
      alt: handWritten ? stored : generated,
    });

    if (fresh) {
      // File the original away so the drop folder shows only what has yet to be processed.
      let dest = path.join(DONE_DIR, entry);
      if (existsSync(dest)) {
        const ext = path.extname(entry);
        dest = path.join(DONE_DIR, `${path.basename(entry, ext)}-${Date.now()}${ext}`);
      }
      await rename(src, dest);
      filed++;
    }
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

  photos.sort((a, b) => a.file.localeCompare(b.file));
  await writeFile(MANIFEST, JSON.stringify({ photos }, null, 2) + "\n");

  console.log(
    `\n${photos.length} photo${photos.length === 1 ? "" : "s"} ready` +
      `  (${built} built, ${reused} unchanged, ${filed} filed to processed/, ${removed} removed)`,
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
