# Drop photos here

Any size, any filename, JPEG / PNG / HEIC / WebP / TIFF. Straight off a phone is fine.

Then run:

    npm run photos

That resizes them, strips EXIF (including the GPS coordinates phone photos carry),
writes web-ready files into `public/photos/`, and updates `manifest.json`.

Filenames become alt text, so `live-edge-walnut-dining-table.jpg` starts out as
"Live edge walnut dining table". Improve it in `public/photos/manifest.json` — your
wording is preserved when you re-run.

Commit and push to put the new photos live. Originals in this folder are gitignored:
they stay on your machine and never bloat the public repo.
