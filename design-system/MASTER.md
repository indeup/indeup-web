# indeup — Design System (Master)

Brand: **indeup (인디업)** — premium desk / furniture maker
Direction: 세련되고 현대적인 프리미엄 브랜드 홈페이지
Source of truth for all pages. Page-specific deviations go in `design-system/pages/*.md`.

---

## 1. Brand Foundation

- **Logo:** `assets/logo.svg` — flat monochrome geometric wordmark ("indeup" + "인디업"), lowercase, rounded geometric letterforms (circular bowls on d/e/u/p), single vertical divider bar between the Latin and Hangul marks. No gradients, no effects — keep it that way wherever the logo appears (never add drop-shadow/glow to the logo itself).
- **Category:** furniture / desks — premium, craftsmanship-led, functional.
- **Tone:** confident, quiet-luxury, editorial. Let whitespace and typography carry the brand; the product photography is the hero, not decoration.

## 2. Style Direction — Exaggerated Minimalism

- Oversized typography, extreme negative space, black/white primary with a single accent color only.
- Massive whitespace (section padding 8rem+ desktop).
- No decorative elements, no drop shadows beyond subtle product-image separation.
- Statement headlines using `clamp()` for fluid oversized sizing.

## 3. Color Tokens

Base palette: **Architecture / Interior** (matches furniture/interior category, pairs cleanly with the monochrome logo).

```css
:root {
  --color-primary: #171717;       /* near-black, logo-matching ink */
  --color-on-primary: #FFFFFF;
  --color-secondary: #404040;
  --color-on-secondary: #FFFFFF;
  --color-accent: #A16207;        /* warm gold — premium/craft accent, WCAG-adjusted */
  --color-on-accent: #FFFFFF;
  --color-background: #FFFFFF;
  --color-foreground: #171717;
  --color-card: #FFFFFF;
  --color-card-foreground: #171717;
  --color-muted: #F5F5F5;
  --color-muted-foreground: #737373;
  --color-border: #E5E5E5;
  --color-destructive: #DC2626;
  --color-ring: #171717;
}
```

Usage rule: accent gold is used sparingly — CTA hover state, small tags/labels, or a single underline/rule element. Never as a large fill. The page should read as black/white first.

## 4. Typography — Geometric Modern

Chosen to match the logo's geometric, rounded-terminal letterforms (not a serif — the logo has none).

- **Heading:** Outfit (weights 300–700)
- **Body:** Work Sans (weights 300–700)

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Work Sans', sans-serif;

  --type-hero: clamp(3rem, 10vw, 9rem);
  --type-h1: clamp(2.5rem, 6vw, 5rem);
  --type-h2: clamp(1.75rem, 3.5vw, 3rem);
  --type-body: 1rem;       /* 16px min per mobile-readability rule */
  --type-label: 0.875rem;

  --weight-hero: 700;
  --tracking-hero: -0.03em;
}
```

## 5. Spacing & Layout

- Density: standard-to-spacious (marketing page, not a dashboard).
- Spacing scale: 4/8px rhythm — `--space-1: 4px` … up to `--space-24: 96px` section gaps.
- Container max-width: `max-w-7xl` (1280px), centered, `px-6` mobile / `px-12` desktop gutters.
- Breakpoints: 375 / 768 / 1024 / 1440 (mobile-first).
- No horizontal scroll on mobile; `min-h-dvh` for hero, never bare `100vh`.

## 6. Effects

- No glassmorphism, no blur, no gradients on brand elements.
- Product photography gets a subtle 1px `--color-border` frame or none at all — let the photo breathe in whitespace.
- Hover: 150–300ms ease-out opacity/underline transitions only. No layout-shifting hover transforms on the logo or nav.
- Motion: subtle, respects `prefers-reduced-motion`. Entrance fades/slides only — no marquee, no kinetic/brutalist motion.

## 7. Page Pattern — Landing (Minimal Single Column)

1. Hero — oversized headline (brand statement) + short description + primary CTA
2. Brand intro — one short paragraph, quiet-luxury tone
3. Product / service showcase — desk product cards or imagery grid (this is the priority section for v1)
4. Footer — minimal, logo + contact/nav links

## 8. Anti-Patterns (avoid)

- Emoji as icons — use SVG (Heroicons/Lucide) only.
- Gray-on-gray low-contrast text — body text must hit 4.5:1 minimum against white.
- Mixing serif display fonts in with the geometric sans system — stay within Outfit/Work Sans.
- Cluttered layout or busy backgrounds — this brand sells through restraint, not decoration.

## 9. Pre-Delivery Checklist

- [ ] Logo rendered untouched (no filters/shadows added)
- [ ] Contrast ≥ 4.5:1 body text, ≥ 3:1 large text
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] `prefers-reduced-motion` respected
- [ ] No horizontal scroll on mobile
- [ ] Focus states visible on all interactive elements
