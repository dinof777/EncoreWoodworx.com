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
| `/api/contact` | `app/api/contact/route.ts` | `POST` project inquiry → Apps Script intake. |
| `/api/newsletter` | `app/api/newsletter/route.ts` | `POST` newsletter signup → Apps Script intake. |

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

### 3. Workshop photography — `lib/photos.ts`
`photos/` is the drop folder and `photos/processed/` the archive of originals already
handled — both are gitignored, and both count as sources, so an output is only deleted
when its original is in neither. `npm run photos` writes optimised WebP plus
`public/photos/manifest.json`, which `lib/photos.ts` imports at build time.

`getPhotos()` returns the library, `shufflePhotos(seed)` the whole thing in a deterministic
order, `pickPhotos(seed, n)` a stable slice. **Never use `Math.random` in any of them** —
it would be a hydration mismatch. `rotationBucket()` returns an hour-stamp for seeding and
is server-only: it is safe because the chosen order is baked into ISR-cached HTML that the
client hydrates. Every page rendering a `PageHeroPhoto` therefore exports
`revalidate = 3600`; without it the choice freezes at build time.

### 4. Project basket — client only
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
| **Photography** | 63 owned photos in `public/photos/`, generated from the `photos/` drop folder by `npm run photos`. Etsy's CDN (`i.etsystatic.com`) still backs catalogue imagery and is the hero fallback when no owned photos exist. |
| **Gallery** | An external Google Photos album, linked from the homepage and contact page. |
| **Email / CRM** | Google Apps Script web app writing to a Sheet + emailing a notification. See below. |

### Form intake — `/api/contact` and `/api/newsletter`

Both post to a **Google Apps Script web app** (`scripts/apps-script/Code.gs`), deployed
from the Google Sheet it writes to. It appends a row to a per-type tab (*Project Inquiries*
and *Newsletter*) and emails a notification. **Live and verified end to end** — local and
production, with and without a basket. Setup steps are in the script's own header comment.

```
APPS_SCRIPT_INTAKE_URL      the web app's /exec URL
APPS_SCRIPT_INTAKE_SECRET   shared secret, must match SHARED_SECRET in the script
```

Unset, both routes report it rather than pretending: `/api/contact` answers 502 and tells
the visitor to email directly, `/api/newsletter` answers 503 and the form says the list
isn't open yet. **Neither route may ever return ok for a delivery that did not happen** —
that was the original bug and it silently lost leads.

*Why not a Google Form?* Posting to a form's `/formResponse` endpoint is the usual trick
and it no longer works: two separately created, publicly viewable forms both returned 400
to every submission, including a byte-identical browser replay with fresh `fbzx`, cookies,
user-agent and referer. Google blocks programmatic submission. Apps Script web apps are a
supported POST target.

Validation before anything is delivered: email format, `name` ≤ 200 chars, `message` ≤
5000, `basket` ≤ 50 entries, and a rejection when both message and basket are empty.

---

## Key modules

| Module | Role |
|---|---|
| `components/Nav.tsx` | Sticky header, lockup, desktop nav (lg+), basket count. Server component |
| `components/MobileMenu.tsx` | The `lg:hidden` dropdown. Client, because a `<details>` has no reason to close itself under client-side routing — it closes on tap, route change, Escape and outside tap |
| `components/Footer.tsx` | Motto (1 of its 2 sitewide placements), links, hours |
| `components/Section.tsx` | `Section`, `SectionHeader`, `Eyebrow` — the page rhythm primitives |
| `components/HeroSlideshow.tsx` | Crossfading homepage hero with the scrim + grain overlays |
| `components/BasketProvider.tsx` | Basket context (see above) |
| `components/BasketView.tsx`, `BasketInquiryForm.tsx`, `BasketButton.tsx`, `AddToProjectButton.tsx` | The project-basket flow |
| `components/ContactForm.tsx`, `NewsletterForm.tsx` | Forms posting to `/api/contact` |
| `components/PreviewSwitcher.tsx` | V1/V2/V3 pill, renders only under `/preview` |
| `components/PageHeroPhoto.tsx` | Photo backdrop for a section hero. Renders nothing when the library is empty. Needs `isolate` on the host `<section>` — it layers at `-z-10` like the glow overlays |

## Styles

See `DESIGN.md` for the token values. Structure:
`app/globals.css` (wiring only) → `styles/tokens/index.css` → `styles/base.css`
(`@layer base`) → `styles/components.css` (`@layer components`).

Two rules that bite: never `@import` a font from a CDN (`next/font` already loads
Inter, Cormorant and Fraunces in `app/layout.tsx`), and never name a token after a
Tailwind scale you did not mean to replace — token files are unlayered and imported
after Tailwind, so they silently win.

### Verifying responsive behaviour

Browser-extension tooling resizes the window without changing the CSS viewport, so it
cannot check breakpoints. Drive Chrome over CDP with `Emulation.setDeviceMetricsOverride`
instead — that is what caught the header overflowing by 11px at exactly 768px, which is
why the desktop nav switches on at `lg` rather than `md`. Layout is verified clean at
320 / 375 / 414 / 640 / 768 / 820 / 1024 / 1280.

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

1. A vector logo. `public/logo.png` is a 490 KB opaque raster; dark placements need
   `filter: invert(1)` and it muddies below ~48px.
2. Test coverage. There is none today.
3. The intake's shared secret is the only thing protecting the Sheet from anyone who finds
   the `/exec` URL. Rotate it in the script and both env locations if it is ever exposed.
