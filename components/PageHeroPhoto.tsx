import Image from "next/image";
import { pickPhotos, rotationBucket } from "@/lib/photos";

/**
 * A workshop photograph behind a page hero, with a scrim heavy enough to keep the
 * heading legible over any image.
 *
 * `seed` decides which photo — a stable choice per surface, so /services and /contact
 * show different pieces but neither flickers between server render and hydration.
 *
 * Renders nothing when the library is empty, so heroes keep their plain dark panel until
 * photos are added. Uses -z-10 like the glow overlays it sits with, which requires the
 * host <section> to carry `isolate` so the negative layer stays above the section's own
 * background instead of disappearing behind it.
 */
export function PageHeroPhoto({ seed }: { seed: string }) {
  // Seeded by surface *and* hour, so each page shows a different photo and all of them
  // get their turn. Requires the host page to export `revalidate`, or the choice is
  // frozen at build time.
  const [photo] = pickPhotos(`${seed}-${rotationBucket()}`, 1);
  if (!photo) return null;

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Image
        src={photo.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* 80% is the lightest this can go. Against a worst-case pure-white photo it leaves
          the 12px eyebrow at 4.64:1 — just over AA. At 75% that drops to 3.87 and fails.
          Lighten it and small text stops being readable on bright photographs. */}
      <div className="absolute inset-0 bg-[color:var(--foreground)]/80" />
    </div>
  );
}
