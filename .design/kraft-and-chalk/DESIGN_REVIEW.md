# Design Review: Kraft & Chalk rollout

Reviewed against: `DESIGN.md` (repo root — no `.design/*/DESIGN_BRIEF.md` exists)
Philosophy: **Kraft & Chalk** — kraft-paper page, chalk-white cards, char ink, one oak-tan action colour
Date: 2026-07-27
Commits under review: `735a83d`, `ec5ca9f`

## Screenshots captured

| Screenshot | Breakpoint | Description |
|---|---|---|
| `screenshots/review-home-hero-desktop-1920.jpg` | Desktop 1920 | Hero, nav lockup, primary/light button pair |
| `screenshots/review-home-story-desktop-1920.jpg` | Desktop 1920 | Our Story, motto blockquote, three chalk cards |
| `screenshots/review-services-hero-desktop-1920.jpg` | Desktop 1920 | Char panel hero, accent-soft eyebrow |
| `screenshots/review-shop-catalogue-desktop-1920.jpg` | Desktop 1920 | Catalogue grid, product cards, badges |
| `screenshots/review-contact-form-desktop-1920.jpg` | Desktop 1920 | Form controls, link list, chalk panel |
| `screenshots/review-contact-textarea-focus.jpg` | Desktop 1920 | Keyboard focus on textarea |

All screenshots are from the **production build** (`next start`, port 3031), not the dev server — see "Method" below.

## Method + what was NOT verified

Verified by measurement, not eyeball: contrast ratios computed from the palette hexes with the
WCAG relative-luminance formula; touch targets, heading order, alt text, form labels, landmarks
and media-query counts read from the live DOM.

**Not verified: tablet (768px) and mobile (375px).** The available browser tooling resizes the
window but the page viewport stays at 1920, so no media query below `2xl` could be triggered.
Every responsive finding below is from reading breakpoint classes in the markup, not from seeing
it render. **This needs your eyes or a real device before shipping.**

One process note worth recording: the long-running dev server on :3030 was serving *stale CSS*
(computed `--background` was still `#f8f3e8`) after a brief `git stash` during an unrelated lint
check. An early pass of this review was measuring the old palette. Always confirm
`getComputedStyle(document.documentElement).getPropertyValue('--background')` matches the token
file before trusting a design review.

## Summary

The token architecture is sound and the aesthetic reads clearly — kraft page, chalk cards and char
panels are unmistakably one system, and the Cormorant/Inter pairing carries the "workshop, not
showroom" intent well. The serious finding is **colour contrast: the single oak-tan action colour
fails WCAG AA on both of the surfaces it sits on**, including the primary CTA text sitewide and
every body link. That is a design-system-level problem, not a per-page one — it needs a token
change, and it will change how the site looks.

## Status: what was applied vs. left for a decision

**Applied in the follow-up pass (commit `7e67071`):** Must-fix #4 (the "Send us a note" copy bug),
Should-fix #1 (footer `h4` → `h3`), #2 (button focus ring), #3 (`prefers-reduced-motion`).

On #2, the first attempt wired `.btn:focus-visible` to `--ring-focus` for consistency with
`.input`. That was a **regression**: `--ring-focus` is `rgba(168,122,53,0.2)`, which composites to
about 1.15:1 on a chalk card — fainter than the browser default it replaced and far below the 3:1
WCAG 2.2 asks of a focus indicator. Shipped instead as a solid 2px `--border-strong` outline with
a 2px offset (11.9:1 on kraft, 16.7:1 on chalk), inverting to `--text-inverse` for `.btn-light` on
dark panels. **`--ring-focus` remains too weak to be a focus indicator on its own** — it works on
`.input` only because a border-colour change carries the signal alongside it.

**Resolved since (commit below):** Must-fix #1–#3, the contrast set. The fix keeps the bright
oak as the brand colour and adds a second, darker `--accent-ink` for the moment that oak becomes
small text — so the page stays bright while the type became legible. `--text-link` and
`--action-primary` now resolve to the ink; hover states were retargeted so no hover drops back
below AA. Measured after: button label 6.98:1, links on kraft 4.96:1, links on chalk 6.98:1.

**Still left for your decision:** Should-fix #4 (touch targets) and #5 (imagery) need product
decisions, and the mobile/tablet gap in "Method" above is still unverified.

## Must fix

1. **`.btn-primary` label fails WCAG AA — 3.60:1.** `--action-primary-text` (`#faf8f3`) on
   `--action-primary` (`#a87a35`), rendered at 14px / weight 600. WCAG "large text" starts at
   18.66px bold or 24px regular, so this is normal text and needs 4.5:1. This affects every
   primary CTA on the site — START A PROJECT, SHOP NOW, SEND MESSAGE, Start a Custom Job. See
   `screenshots/review-contact-form-desktop-1920.jpg`.
   *Fix: darken `--accent` until it clears 4.5:1 against `#faf8f3` (around `#8a6224` gets ~4.6:1),
   or keep the tan and set the label to char `#1a1815` (≈6.4:1). The second keeps the palette but
   changes the button's character — worth a deliberate call.*

2. **Body links fail WCAG AA badly — 2.56:1.** `styles/base.css` sets `a { color: var(--text-link) }`
   → `--accent` `#a87a35` on the kraft page `#ded2bd`. Below even the 3:1 large-text floor. The
   "Etsy → florabrofurnishings / Instagram / Facebook / Past work gallery" list on `/contact` is
   the clearest case. See `screenshots/review-contact-form-desktop-1920.jpg`.
   *Fix: give `--text-link` its own darker value rather than aliasing `--accent`. Char-with-underline
   (`#26231e`, 10.5:1) suits the near-monochrome system better than a second tan.*

3. **Product titles fail AA — 3.60:1.** Oak tan on chalk `#faf8f3` at ~16px in the catalogue grid.
   See `screenshots/review-shop-catalogue-desktop-1920.jpg`. Same root cause as #2; fixing the
   `--text-link` token fixes this too.

4. **A missed shop-referring plural.** `app/(main)/contact/page.tsx:39` still reads
   **"Send us a note"** — the only survivor of the solo-maker voice pass, and it sits directly
   above copy that now says "I typically reply within one business day."
   *Fix: "Send me a note".*

## Should fix

1. **Heading order skips a level.** `/contact` runs H1 → H2 → **H4** (the footer's EXPLORE / VISIT
   labels are `h4` with no `h3` between). Screen-reader users navigating by heading hit a gap.
   *Fix: make the footer column labels `h3`, or drop them to a non-heading element with
   `.eyebrow` styling — they are labels, not document structure.*

2. **Button focus ring is the browser default blue.** `--ring-focus` is defined in
   `styles/tokens/effects.css` but wired only to `.input:focus` (`styles/components.css:100` is the
   *only* focus rule in the whole stylesheet). Buttons fall back to Chrome's blue ring — accessible,
   but visually foreign to a warm monochrome palette and inconsistent with the input treatment.
   *Fix: add `.btn:focus-visible { outline: none; box-shadow: var(--ring-focus); }`.*

3. **No `prefers-reduced-motion` support anywhere** (0 matching rules in the compiled CSS). The site
   runs a 1400ms crossfading hero slideshow plus Framer Motion entrance animations.
   *Fix: a `@media (prefers-reduced-motion: reduce)` block in `styles/base.css` that neutralises
   `--duration-*` and stops the slideshow auto-advance.*

4. **Touch targets below 44px.** 18 elements on `/contact` measure under 44px in at least one axis:
   nav links at 20px tall, the four external links at 20px tall, social icon buttons at 36×36, and
   the basket button at 40×40. On desktop this is minor; on mobile it is a real failure — and mobile
   is exactly what could not be verified here.
   *Fix: increase vertical padding on the link lists and take the icon buttons to 44×44.*

5. **Catalogue imagery is upscaled ~2×.** Etsy's RSS thumbnails arrive at 188px natural width and
   render into 382px cards (764 device px at DPR 2). Visibly soft on the product grid.
   *Fix: this is the "real workshop photography" item — owned assets would solve resolution and
   the Etsy-CDN dependency at once.*

## Could improve

1. **`--muted` on kraft is marginal at 4.57:1** — it passes AA for body text with almost nothing to
   spare, and the grain texture sits underneath it. Nudging `--muted` a step darker would give the
   secondary copy some headroom.

2. **The design system has no dark mode** (0 `prefers-color-scheme` rules). `DESIGN.md` does not
   claim one, so this is by design rather than a defect — but the token layer is well-placed to
   support it if you ever want it, since every component already reads semantic aliases.

3. **`--radius-chip` and several type-scale tokens are defined but unused** (`--text-hero`,
   `--text-h1`…`--text-h5`, `--text-lead`, `--leading-display`, `--leading-title`,
   `--leading-heading`, most of `--space-*`). Components still size type with Tailwind utilities
   (`text-5xl md:text-7xl`). The token file therefore documents an intent the markup does not
   follow. Either wire the scale into `@theme` so utilities generate from it, or trim the tokens to
   what is actually used — right now `DESIGN.md` slightly overstates the system's reach.

## What works well

- **The palette reads exactly as named.** Kraft page, chalk cards floating on it, char panels for
  the dark sections — the three-surface system is legible at a glance and the grain texture keeps
  the mid-tone kraft from going flat. `review-home-story-desktop-1920.jpg` is the clearest example.
- **The motto placement is disciplined.** Two placements sitewide, both as a left-ruled blockquote
  in accent — it lands as a thesis line rather than a tagline, which is what restraint buys.
- **Typography carries the brand.** Cormorant at hero scale against Inter body copy is doing real
  work; the uppercase tracked eyebrows tie sections together without extra ornament.
- **Semantic aliasing is the right call.** Because every component reads `var(--foreground)` etc.
  rather than Tailwind colour utilities, the entire palette swap landed from one token file. That
  is also why fixes #1–#3 above are cheap — they are token edits, not a sweep through components.
- **Layering is correct.** Base rules in `@layer base`, components in `@layer components`, so
  utilities compose predictably — and the token names that would have hijacked Tailwind's
  `rounded-sm` / `leading-tight` scales were caught and renamed.
- Landmarks, `alt` text and form labels are all clean: `main`/`nav`/`header`/`footer` all present,
  0 images without alt, every input labelled.
