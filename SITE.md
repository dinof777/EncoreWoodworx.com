# Encore Woodworx — Site Architecture

Internal map of every route, where its data comes from, and which modules matter.
The dev-facing companion to `/llms.txt` (which is the *external* manifest) and
`DESIGN.md` (which is the visual system). Keep this current when routes, data
sources, or integrations change.

**Stack:** Next.js 16.2.4 (App Router) · React 19.2 · Tailwind CSS v4 · Framer Motion 12 ·
TypeScript 5. No database. Deployed on Vercel at `https://encorewoodworx.com`.

---

## Routes

### `app/(main)/` — the public site
All wrapped by `app/(main)/layout.tsx`, which supplies `<Nav>` and `<Footer>`.

| Route | File | Rendering | Data source |
|---|---|---|---|
| `/` | `page.tsx` | ISR, 1h | `getListings()` → hero slideshow images |
| `/services` | `services/page.tsx` | Static | Hardcoded `services` array (8 items) |
| `/shop` | `shop/page.tsx` | ISR, 1h | `getListings()` |
| `/shop/[slug]` | `shop/[slug]/page.tsx` | SSG + ISR, 1h | `getListingBySlug()`, `getListingSlugs()` |
| `/shop-tips` | `shop-tips/page.tsx` | Static | `getAllPosts()` |
| `/shop-tips/[slug]` | `shop-tips/[slug]/page.tsx` | SSG | `getPostBySlug()` |
| `/contact` | `contact/page.tsx` | Static | — (form posts to `/api/contact`) |
| `/basket` | `basket/page.tsx` | Static | Client-side basket state |
| `/live-blended` | `live-blended/page.tsx` | ISR, 1h | Story page for the step-parent tee designs |

### `app/(preview)/` — design explorations
`/preview/editorial` and `/preview/scandi` are frozen V2/V3 aesthetic mockups with
their **own hardcoded palettes** — they deliberately do *not* consume the design
tokens, so a token change must not be "fixed" into them. `PreviewSwitcher` renders
the V1/V2/V3 pill, but only on `/preview*` paths. Excluded from indexing via
`robots.ts`.

### Machine-facing routes
| Route | File | Purpose |
|---|---|---|
| `/llms.txt` | `app/llms.txt/route.ts` | AI-crawler manifest. Computes catalogue counts and the shop-tips index from `lib/etsy` + `lib/blog`, so it cannot drift from the pages. |
| `/sitemap.xml` | `app/sitemap.ts` | Static routes + every listing slug + every post. |
| `/robots.txt` | `app/robots.ts` | Allows all, disallows `/preview/`, points at the sitemap. |
| `/api/contact` | `app/api/contact/route.ts` | `POST` inquiry handler. |

---

## Data model

There is **no database**. Two read-only sources:

### 1. Etsy catalogue — `lib/etsy.ts`
The shop is a **read-only mirror of the Etsy public RSS feed**
(`https://www.etsy.com/shop/<SHOP>/rss`), parsed with `fast-xml-parser`. Not the
Etsy API.

```
EtsyListing = { id, title, slug, priceUsd, priceLabel, imageUrl, etsyUrl,
                description, descriptionPlain, publishedAt, kind, madeToOrder }
ListingKind = "woodworking" | "apparel" | "other"
```

- `getListings()` — fetch + normalize, `revalidate: 3600`, cache tag `etsy-listings`.
  Returns `[]` on any failure; every consumer must handle the empty case.
- `getListingBySlug(slug)`, `getListingSlugs()`, `shopUrl`
- Slugs are derived from the title. **Collisions get the listing id appended**, so a
  slug is not stable if a duplicate title appears or disappears.
- `lib/etsy-stub.ts` holds fixture listings, used only by the preview routes.

### 2. Shop-tips posts — `lib/blog.ts`
Flat JSON files in `data/posts/*.json`, read from disk at build time.

```
BlogPost = { slug, title, category, date, cover?, excerpt?, body[], products[]?, sourceUrl? }
```

`getAllPosts()` (sorted newest-first), `getPostBySlug(slug)`, `formatDate(iso)`.

### 3. Project basket — client only
`components/BasketProvider.tsx` — React context over `localStorage`, key
`ew_basket_v1`. `BasketItem = { id, slug, title, priceLabel, imageUrl, addedAt }`.
Exposes `add / remove / clear / has` via `useBasket()`. Nothing server-side; the
basket is only serialized when the inquiry form posts it.

---

## Integrations

| What | Status |
|---|---|
| **Etsy** | Public RSS only. `ETSY_SHOP_NAME` (defaults to `florabrofurnishings`). `ETSY_API_KEY` and `ETSY_SHARED_SECRET` are present in `.env.local` but **currently unread by any code** — the site does not call the Etsy API. |
| **Checkout** | Entirely off-site. Every purchase path terminates at Etsy. There is no cart, no payment code, and no PCI surface in this repo. |
| **Photography** | Hot-linked from Etsy's CDN (`i.etsystatic.com`, allow-listed in `next.config.ts`). No owned image assets yet. |
| **Gallery** | An external Google Photos album, linked from the homepage and contact page. |
| **Email / CRM** | Not yet wired — see `/api/contact` below. |

### `/api/contact` — delivery transport not yet wired

The handler validates and accepts the payload, but the outbound transport is still
to be chosen. Wiring one (Resend for email, optionally a Marketplace database for a
durable record) is the highest-priority item on this site — see the tracker rather
than this file for current status.

Validation the handler enforces: email format, `name` ≤ 200 chars, `message` ≤ 5000,
`basket` ≤ 50 entries, and a rejection when both message and basket are empty.

---

## Key modules

| Module | Role |
|---|---|
| `components/Nav.tsx` | Sticky header, lockup, desktop + mobile nav, basket count |
| `components/Footer.tsx` | Motto (1 of its 2 sitewide placements), links, hours |
| `components/Section.tsx` | `Section`, `SectionHeader`, `Eyebrow` — the page rhythm primitives |
| `components/HeroSlideshow.tsx` | Crossfading homepage hero with the scrim + grain overlays |
| `components/BasketProvider.tsx` | Basket context (see above) |
| `components/BasketView.tsx`, `BasketInquiryForm.tsx`, `BasketButton.tsx`, `AddToProjectButton.tsx` | The project-basket flow |
| `components/ContactForm.tsx`, `NewsletterForm.tsx` | Forms posting to `/api/contact` |
| `components/PreviewSwitcher.tsx` | V1/V2/V3 pill, renders only under `/preview` |

## Styles

See `DESIGN.md` for the token values. Structure:
`app/globals.css` (wiring only) → `styles/tokens/index.css` → `styles/base.css`
(`@layer base`) → `styles/components.css` (`@layer components`).

Two rules that bite: never `@import` a font from a CDN (`next/font` already loads
Inter, Cormorant and Fraunces in `app/layout.tsx`), and never name a token after a
Tailwind scale you did not mean to replace — token files are unlayered and imported
after Tailwind, so they silently win.

## Conventions

- Colours are consumed as `bg-[color:var(--token)]`, not via Tailwind colour
  utilities, throughout `app/` and `components/`. A palette change in
  `styles/tokens/colors.css` therefore propagates everywhere on its own.
- Markdown is **gitignored by default** so agent-guidance files (`CLAUDE.md`,
  `AGENTS.md`) never ship in this public repo. Project documentation — `README.md`,
  `DESIGN.md`, this file, and `.design/**/*.md` — is opted back in by negation rules
  in `.gitignore`. Add a new doc there if it is meant to be public.
- Voice is first-person singular: one maker, not "we". `/llms.txt` carries an
  explicit note telling crawlers the older "five brothers" framing is obsolete.

## Roadmap

1. Wire the `/api/contact` delivery transport (above) — highest priority.
2. A vector logo. `public/logo.png` is a 490 KB opaque raster; dark placements need
   `filter: invert(1)` and it muddies below ~48px.
3. Owned workshop photography. Everything currently comes from Etsy's CDN, where the
   RSS thumbnails are ~188px and upscale roughly 2× into the catalogue cards.
4. Colour-contrast pass on the accent token — the oak tan currently sits below WCAG AA
   on both the kraft page and the chalk cards. See `.design/kraft-and-chalk/DESIGN_REVIEW.md`.
5. Test coverage. There is none today.
