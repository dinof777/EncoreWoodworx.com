# Encore Woodworx — Design System

The human-readable source of truth for the site's visual language. The CSS custom
properties under `styles/tokens/` implement exactly what is written here. **Change both
together** — a token file that drifts from this document is a bug.

Aesthetic: **Kraft & Chalk**. A near-monochrome system — a saturated kraft-paper page,
chalk-white cards floating on it, near-black char ink and panels, and one oak-tan action
colour doing all the work. Warm, quiet, workshop-not-showroom.

---

## Where things live

```
styles/
  tokens/
    index.css        entry point — imports the five below, in dependency order
    fonts.css        font-family roles (families themselves load via next/font)
    colors.css       palette + semantic colour aliases
    typography.css   type scale, leading, tracking, weights
    spacing.css      space scale, container, section rhythm
    effects.css      radii, shadows, motion, texture, overlays
  base.css           element defaults          -> @layer base
  components.css     .btn / .input / brand primitives -> @layer components
app/globals.css      wiring only: @import tailwindcss -> tokens -> base -> components,
                     then @theme inline to expose the palette + fonts to Tailwind
```

`app/globals.css` contains no design values of its own. It is import order plus the
`@theme` bridge, nothing more.

### Two rules that keep this from breaking

1. **Never `@import` a font from a CDN.** Inter, Cormorant Garamond and Fraunces are loaded
   by `next/font/google` in `app/layout.tsx`, which defines `--font-inter`,
   `--font-cormorant` and `--font-fraunces` on `<html>`. A CDN `@import` would double-load
   the faces and add a render-blocking request. `styles/tokens/fonts.css` only names the
   roles and supplies fallback chains.

2. **Do not name a token after a Tailwind scale you did not mean to replace.** The token
   files are imported *after* `@import "tailwindcss"` and are unlayered, so a `:root`
   declaration silently beats Tailwind's own theme variable. `--radius-sm` would have
   retuned every `rounded-sm` in the markup; `--leading-tight` would have retuned every
   `leading-tight`. Both were renamed (`--radius-chip`, `--leading-heading`).
   Deliberate overlaps are documented below.

**Deliberate overlaps with Tailwind's scale:**

| Token | Why it shares the name |
|---|---|
| `--shadow-sm` … `--shadow-2xl` | Every `shadow-*` utility should pick up warm char ink, never neutral black. Intentional. |
| `--text-sm`, `--text-xs` | Identical to Tailwind's stock values — sharing the name is a no-op. |
| `--font-sans`, `--font-display` | The brand families *are* the site's sans/display. Intentional. |

---

## Colour

### Palette

| Token | Value | Role |
|---|---|---|
| `--background` | `#ded2bd` | kraft-paper page |
| `--foreground` | `#1a1815` | char ink |
| `--muted` | `#615a4d` | secondary copy |
| `--surface` | `#faf8f3` | chalk-white cards |
| `--border` | `#c6b99f` | hairlines on paper |
| `--accent` | `#a87a35` | oak tan — the one action colour |
| `--accent-deep` | `#26231e` | near-black panels, eyebrows, hover |
| `--accent-soft` | `#c9b48c` | tan-on-dark, muted highlights |
| `--forest` | `#3a4a3a` | the single cool counterpoint; success/positive copy only |
| `--slab` | `#d0c3ab` | placeholder fill behind photography |

### Semantic aliases

Prefer these over the raw palette — they say what the colour is *for*, so a palette change
lands in one place.

**Text** — `--text-body`, `--text-strong`, `--text-muted`, `--text-eyebrow`,
`--text-inverse`, `--text-link`, `--text-link-hover`, `--text-success`, `--text-error`

**Surface** — `--surface-page`, `--surface-card`, `--surface-dark`, `--surface-brand`,
`--surface-media`

**Border** — `--border-subtle`, `--border-strong`, `--border-on-dark`

**Action** — `--action-primary`, `--action-primary-hover`, `--action-primary-text`,
`--focus-ring`

---

## Typography

Two families, three roles. Cormorant Garamond sets every display line; Inter carries all
body, UI and micro copy. Fraunces is available as `--font-accent` for one-off editorial
moments.

| Role | Token | Size |
|---|---|---|
| Hero (home, lg) | `--text-hero` | 6rem / 96px |
| Page hero (md+) | `--text-h1` | 4.5rem / 72px |
| Section title (md+) | `--text-h2` | 3rem / 48px |
| Sub-section | `--text-h3` | 1.875rem / 30px |
| Card title | `--text-h4` | 1.5rem / 24px |
| Small title | `--text-h5` | 1.25rem / 20px |
| Lead paragraph | `--text-lead` | 1.125rem / 18px |
| Body | `--text-body-size` | 1rem |
| Small / buttons | `--text-sm` | 0.875rem |
| Eyebrow | `--text-xs` | 0.75rem |
| Micro (logo sub-line) | `--text-2xs` | 0.625rem |

**Leading** — `--leading-display` 1.02 (heroes) · `--leading-title` 1.05 (section titles) ·
`--leading-heading` 1.15 · `--leading-body` 1.625

**Tracking** — `--tracking-display` -0.01em · `--tracking-eyebrow` 0.22em ·
`--tracking-button` 0.06em · `--tracking-micro` 0.18em · `--tracking-logo-sub` 0.25em

**Weights** — `--weight-regular` 400 · `--weight-display` / `--weight-medium` 500 ·
`--weight-semibold` 600 · `--weight-bold` 700

`--font-features: "ss01", "cv11"` is applied on `body` and should stay there.

---

## Spacing & layout

`--space-1` … `--space-28` follow the 0.25rem step (`--space-7` = 1.75rem is the standard
card padding). Layout tokens:

| Token | Value | Meaning |
|---|---|---|
| `--container-max` | 80rem | page container (`max-w-7xl`) |
| `--container-pad` | 1.5rem | gutter, mobile |
| `--container-pad-lg` | 2.5rem | gutter, lg+ |
| `--measure` | 42rem | prose measure |
| `--section-y` | 5rem | section padding, mobile |
| `--section-y-lg` | 7rem | section padding, md+ |
| `--grid-gap` | 1.5rem | card grid gutter |

---

## Effects

**Radii** — `--radius-input` 0.5rem · `--radius-chip` 0.75rem · `--radius-card` 1rem ·
`--radius-panel` 1.5rem (banners, big feature cards) · `--radius-pill` 9999px (all buttons)

**Shadows** — `--shadow-sm` through `--shadow-2xl`. Soft, warm, never black: every one is
built on char ink `rgba(26, 24, 21, …)`. `--ring-focus` is the focus treatment.

**Motion** — one curve and a short set of durations, used everywhere:
`--ease` · `--duration-fast` 200ms (all UI transitions) · `--duration-media` 700ms (image
zoom on hover) · `--duration-crossfade` 1400ms (hero slideshow) · `--lift`
`translateY(-1px)` (button hover) · `--media-zoom` `scale(1.04)`

**Texture & overlays** — `--grain-dot-a` / `--grain-dot-b` (the `.grain` paper speckle) ·
`--wood-gradient` · `--glow-warm` · `--hatch` · `--scrim-dark` · `--blur-nav`

---

## Components

Defined in `styles/components.css`, inside `@layer components` so a utility written
alongside them still wins (`btn btn-ghost text-xs` really is 12px).

| Class | Notes |
|---|---|
| `.font-display` | Cormorant, weight 500, tracking -0.01em |
| `.eyebrow` | uppercase Inter micro-label, `--text-eyebrow` |
| `.grain` | kraft page + speckle — the default editorial surface |
| `.wood-gradient` | dark wood scrim for hero/panel overlays |
| `.btn` | pill, uppercase, `--text-sm`, `--tracking-button` |
| `.btn-primary` | oak tan fill, lifts 1px on hover |
| `.btn-ghost` | char outline, inverts on hover |
| `.btn-light` | for use on dark panels |
| `.input` | chalk field, hairline border, warm focus ring |

Button padding (`0.85rem 1.6rem`) is intentionally off the space scale — the pill needs
more horizontal than vertical air.

---

## Brand voice

Five brothers, one shop. Plain-spoken and specific — wood species, joinery, finishing
schedules — never luxury-brand adjectives. Sentences are short. Claims are concrete
("built to be passed down", not "timeless elegance"). Copy addresses the reader as someone
who is going to own the thing for thirty years.
