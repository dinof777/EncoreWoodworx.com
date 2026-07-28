import manifest from "@/public/photos/manifest.json";

/**
 * Workshop photography, generated from the photos/ drop folder by `npm run photos`.
 *
 * The manifest is imported rather than read from disk so it is bundled at build time and
 * works everywhere, including statically prerendered pages.
 */

export type Photo = {
  /** Filename inside /public/photos. */
  file: string;
  width: number | null;
  height: number | null;
  alt: string;
};

export type PhotoImage = { src: string; alt: string; width?: number; height?: number };

const PHOTOS: Photo[] = (manifest.photos ?? []) as Photo[];

export function getPhotos(): PhotoImage[] {
  // An empty alt is meaningful, not missing: it marks the photo as decorative, which is
  // correct for a backdrop behind a heading. Do not substitute a generic string here —
  // "Encore Woodworx workshop photograph" repeated 60 times is noise to a screen reader.
  return PHOTOS.filter((p) => p.file).map((p) => ({
    src: `/photos/${p.file}`,
    alt: p.alt ?? "",
    width: p.width ?? undefined,
    height: p.height ?? undefined,
  }));
}

export function hasPhotos(): boolean {
  return PHOTOS.length > 0;
}

/** Small deterministic string hash — same input, same output, on server and client. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * A stable slice of the library, rotated by `seed`, so different surfaces show different
 * photos while any one surface stays consistent between server render and hydration.
 * Never use Math.random here — that is a hydration mismatch waiting to happen.
 */
export function pickPhotos(seed: string, count: number): PhotoImage[] {
  const all = getPhotos();
  if (all.length === 0 || count <= 0) return [];
  const start = hash(seed) % all.length;
  const take = Math.min(count, all.length);
  return Array.from({ length: take }, (_, i) => all[(start + i) % all.length]);
}
