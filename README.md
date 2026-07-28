# encorewoodworx.com

The website for **Encore Woodworx** — a one-person custom woodworking shop in Fort
Lauderdale, Florida, building bespoke epoxy river tables, live-edge furniture, sliding
barn doors, custom countertops and wood-and-steel railings.

Live at **[encorewoodworx.com](https://encorewoodworx.com)**.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · TypeScript.
Deployed on Vercel. No database — the catalogue is a read-only mirror of the shop's
public Etsy RSS feed, and the shop-tips posts are flat JSON in `data/posts/`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3030
```

```bash
npm run build   # production build
npm start       # serve the production build on :3030
npm run lint
npm run photos  # process the photos/ drop folder — see "Photography" below
```

## Photography

Drop images into **`photos/`** — any size, name or format, straight off a phone is fine —
then run:

```bash
npm run photos
git add public/photos && git commit -m "Add workshop photos" && git push
```

That resizes to 2400px, converts to WebP, applies EXIF rotation, and **strips metadata,
including the GPS coordinates phone photos embed** — those would otherwise publish the
location of your workshop and home.

**Adding more later:** drop them in and run it again. Never delete anything first — the
run is incremental (unchanged files are skipped) and `photos/` is the source of truth, so
removing a file there removes it from the site.

The originals stay on your machine (`photos/` is gitignored); only the optimised output in
`public/photos/` is committed.

**Alt text.** A descriptive filename becomes alt text automatically, so
`live-edge-walnut-table.jpg` needs no further work. A camera filename like `IMG_0055.jpg`
carries no meaning, so it gets an *empty* alt and is treated as decorative — "Img 0055"
read aloud by a screen reader is worse than silence. Write real descriptions into
`public/photos/manifest.json` for any photo that carries meaning; hand-written wording is
preserved across re-runs.

Photos then rotate through the site automatically: the homepage hero cycles the whole
library, and each section hero picks a stable one via `pickPhotos(seed, n)` in
`lib/photos.ts`. With no photos present the site falls back to Etsy imagery and plain dark
panels, so it is safe to ship empty.

### Environment

Copy these into `.env.local`. The Etsy key is not secret — the site reads only the shop's
public RSS feed, not the Etsy API. The intake pair *is* a credential.

```
ETSY_SHOP_NAME=florabrofurnishings

# Form intake — see scripts/apps-script/Code.gs for how to deploy and obtain these.
# Without them the contact and newsletter forms report failure rather than delivering.
APPS_SCRIPT_INTAKE_URL=
APPS_SCRIPT_INTAKE_SECRET=
```

## Documentation

Three docs carry the project, and they are meant to be kept current:

| File | What it covers |
|---|---|
| **[`DESIGN.md`](./DESIGN.md)** | The design system — palette, type scale, spacing, effects, components, brand voice. The human-readable source of truth that `styles/tokens/` implements. |
| **[`SITE.md`](./SITE.md)** | The architecture map — every route and its rendering mode, the data sources, integrations, key modules, roadmap. |
| **[`.design/`](./.design)** | Design briefs and reviews, with the screenshots they reference. |

## Layout

```
app/
  (main)/        the public site — home, services, shop, shop-tips, contact, basket
  (preview)/     frozen V2/V3 aesthetic explorations, excluded from indexing
  api/contact/   inquiry handler
  llms.txt/      AI-crawler manifest, computed from the same modules as the pages
  sitemap.ts     robots.ts
components/      Nav, Footer, Section primitives, the project-basket flow, forms
lib/             etsy.ts (RSS mirror) · blog.ts (JSON posts) · intake.ts (form delivery)
scripts/
  apps-script/   Code.gs — the Google Apps Script that receives form submissions
styles/
  tokens/        design tokens — fonts, colors, typography, spacing, effects
  base.css       element defaults        -> @layer base
  components.css .btn / .input / brand primitives -> @layer components
```

`app/globals.css` is wiring only: it imports Tailwind, then the tokens, then base and
components, then bridges the palette into `@theme`. It holds no design values of its own.

## Two conventions worth knowing before you edit styles

1. **Never `@import` a font from a CDN.** `next/font` already loads Inter, Cormorant
   Garamond and Fraunces in `app/layout.tsx`. A CDN import double-loads the faces and
   adds a render-blocking request.

2. **Never name a token after a Tailwind scale you did not mean to replace.** The token
   files are imported after `@import "tailwindcss"` and are unlayered, so a plain `:root`
   declaration silently beats Tailwind's own theme variable — `--radius-sm` would retune
   every `rounded-sm` in the markup. `DESIGN.md` lists the overlaps that *are* deliberate.

Colours are consumed as `bg-[color:var(--token)]` rather than through Tailwind colour
utilities, so a palette change in `styles/tokens/colors.css` propagates on its own.

## Notes

Markdown is gitignored by default so local agent-guidance files stay out of this public
repo; project documentation is opted back in by negation rules in `.gitignore`. Add a new
doc there if it is meant to be public.
