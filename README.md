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
```

### Environment

Copy the key below into `.env.local`. Nothing here is secret — the site reads only the
shop's public RSS feed, not the Etsy API.

```
ETSY_SHOP_NAME=florabrofurnishings
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
lib/             etsy.ts (RSS mirror) · blog.ts (JSON posts)
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
