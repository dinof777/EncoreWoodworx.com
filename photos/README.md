# Drop photos here

Any size, any filename, JPEG / PNG / HEIC / WebP / TIFF. Straight off a phone is fine.

    npm run photos

Then commit and push — Vercel redeploys and they are live.

## Adding more later

Just drop them in and run it again. **Never delete anything first.**

After a run, originals move to `processed/`, so this folder only ever shows what has yet
to be handled. Files already in `processed/` are still sources — they stay on the site and
are not rebuilt.

To take a photo *off* the site, delete it from `processed/` and re-run.

## Alt text

A descriptive filename becomes alt text automatically: `live-edge-walnut-table.jpg`
becomes "Live edge walnut table". Naming files well before you drop them is the least
work for the best result.

A camera filename like `IMG_0055.jpg` carries no meaning, so it gets an empty alt and is
treated as decorative — a screen reader announcing "Img 0055" is worse than silence. Write
real descriptions into `public/photos/manifest.json` for any photo that should be
described; hand-written wording survives re-runs.

## What the script does

Resizes to 2400px, converts to WebP, applies EXIF rotation, and strips metadata —
including the GPS coordinates phone photos embed, which would otherwise publish the
location of the workshop and home.

Nothing in this folder is committed. Only the optimised output in `public/photos/` is.
