# IGC Brand Guidelines
**Integrated Growth Consultants — Design System v1.0**
*For use with Claude Design, Figma, and production implementation.*

---

## 1. Brand Identity

### Positioning
IGC is not a design agency. Not a growth hacker. Not a 2016 playbook shop. It is an **infrastructure operator** for recruitment agencies.

**Brand promise:** "We build the BD pipeline your billers will not."
**Guarantee:** "5 client conversations in 30 days or we work free."

### Tone
- Clinical precision over emotional exuberance
- Quiet confidence, disproportionate detail
- Systems language: infrastructure, mandate acquisition, pipeline, conversion
- Accountability-first: guarantees, named operators, owned assets

### Aesthetic Reference
> "Closer to a private equity trading desk crossed with a technical operator's dashboard."

Peers: Linear, Vercel, Resend, Raycast — warm operator-dark, not cold tech-dark.

---

## 2. Color System

### Philosophy
Gold is the rarest element in the system. It signals: *this is the most important thing on the screen.* Never use gold for ambient decoration, labels, or icons.

### Base Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#080808` | Page base, hero, all dark sections |
| `surface` | `#111110` | Section alternation |
| `surface-soft` | `#0D0D0C` | Grouped UI, forms, dropdowns, nested cards |
| `surface-raised` | `#1A1918` | Elevated cards, popovers |
| `border` | `#2D2A27` | Dividers, section borders |

**Critical:** `#080808` is warm black. Never substitute `#000000` or blue-grey darks.

### Text Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F2EDE4` | Primary text — warm white, NOT `#FFFFFF` |
| `text-mid` | `#C5C0BB` | Medium emphasis |
| `text-secondary` | `#A09890` | Sub-headlines, muted copy, nav links (default) |
| `text-tertiary` | `#857F74` | Labels, meta, minimum emphasis |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#CF9B2E` | PRIMARY ACCENT — CTAs, active states, achievements only |
| `gold-dim` | `#7D5E1C` | Passive gold, subtle backgrounds |
| `signal` | `#1F4D3A` | CTA hover fill, signal states |
| `signal-nominal` | `#3D8B5E` | All-clear / active / success |
| `signal-watch` | `#CF9B2E` | Attention needed (aliases `gold`) |
| `signal-critical` | `#B84233` | Brick red — action required |

### Gold Usage Rules
- **Always use gold for:** Primary CTA buttons (hover glow), active nav state, expansion icon on open, comparison card highlight border
- **Never use gold for:** Section labels, ambient icon fill, decorative border of standard cards, body copy, badge text

---

## 3. Typography

### Font Stack

| Font | Variable | Weights | Role |
|------|----------|---------|------|
| Playfair Display | `--font-playfair` | 400 (regular only) | All display headlines |
| Inter / DM Sans | `--font-dm-sans` | 300, 400, 500, 600 | UI text, body, nav, buttons, labels |
| DM Mono | `--font-dm-mono` | 400, 500 | Section labels, KPI sub-labels, metadata |
| Poppins | `--font-poppins` | default | Logo text only |

### Type Scale

| Class | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|-----------------|-------|
| `text-display-2xl` | `clamp(6rem, 16vw, 16rem)` | `0.95` | `-0.04em` | Hero main headline |
| `text-display-xl` | `clamp(4rem, 9vw, 8rem)` | `1.0` | `-0.03em` | Page H1 |
| `text-display-lg` | `clamp(2.75rem, 5.5vw, 5rem)` | `1.05` | `-0.02em` | Section H2 |
| `text-display-md` | `clamp(1.875rem, 3.5vw, 3.25rem)` | `1.12` | `-0.015em` | Subsection heading |
| `text-display-sm` | `clamp(1.375rem, 2.2vw, 1.875rem)` | `1.2` | `-0.01em` | Tertiary heading |
| `text-body-lg` | `1.5rem` | `1.75` | — | Lead copy, large body |
| `text-body-md` | `1.25rem` | `1.7` | — | Standard body text |
| `text-label` | `0.6875rem` | `1` | `0.16em` | Section labels, badges |

### Critical Rules
- **Hero H1:** Playfair **400 regular**. At this scale, regular weight reads more premium than bold.
- **Lead copy:** Inter **300 light** — contrast against the serif headline is the effect.
- **Section labels:** `text-tertiary` (`#857F74`) in DM Mono + `tracking-[0.16em]` + uppercase. Never gold.
- **All display text:** Apply negative letter-spacing. Tightness signals premium.
- **Button text:** `tracking-[0.08em]` uppercase, `font-semibold` (primary) or `font-medium` (ghost/outline).

---

## 4. Logo & Identity Mark

### Assets
- **Logo mark (PNG):** `/public/logo-icon.png`
- **OG image (JPG):** `/public/og-image.jpg`
- **OG image (SVG):** `/public/og-image.svg`

### Logo Component
- Logo text: "Integrated Growth Consultants"
- Font: Poppins
- Icon border-radius: `rounded-[4px]`

### Size Variants
| Size | Icon | Text |
|------|------|------|
| `sm` | 26px | `text-[0.8rem]` |
| `md` | 30px | `text-[0.875rem]` |
| `lg` | 36px | `text-[1rem]` |

### Logo Clearspace
Maintain minimum clearspace equal to the icon height on all sides.

---

## 5. Spacing & Layout

### Base Grid
- 8px base unit. All spacing is a multiple of 4px.

### Container Widths
| Token | Value | Usage |
|-------|-------|-------|
| `max-w-site` | `1200px` | All section content |
| `max-w-prose` | `680px` | Body copy, FAQ answers, single-column text |

### Section Padding
```
Mobile:  px-6  py-28
Tablet:  px-10 py-32
Desktop: px-16 py-40
```

### Gap Patterns
- Large (between cards): `gap-12 md:gap-16`
- Standard (between elements): `gap-6 md:gap-8`
- Tight (within components): `gap-2`, `gap-3`, `gap-4`

### Grid Columns
- 1 column (mobile) → 3 columns (desktop) for: steps, stats, proof points, comparison
- Section divider: `1px solid rgba(242, 237, 228, 0.05)` — extremely subtle

---

## 6. Components

### Buttons

#### Primary
- Background: `#F2EDE4`
- Text: `#080808`
- Border: `1px solid rgba(242,237,228,0.80)`
- Font: `font-semibold tracking-[0.08em] uppercase`
- Shadow: `0 0 28px rgba(242,237,228,0.18), 0 4px 14px rgba(0,0,0,0.45)`
- Hover shadow: `0 0 44px rgba(207,155,46,0.20), 0 6px 22px rgba(0,0,0,0.55)`
- Hover scale: `scale(1.02)`, active: `scale(0.99)`
- Transition: `all 300ms cubic-bezier(0.16, 1, 0.3, 1)`

#### Ghost
- Background: transparent
- Text: `rgba(242,237,228,0.68)`
- Border: `2px solid rgba(242,237,228,0.20)`
- Hover border: `rgba(242,237,228,0.40)`, text: `rgba(242,237,228,0.92)`
- Font: `font-medium tracking-[0.1em] uppercase`

#### Outline
- Background: transparent → `#F2EDE4` on hover
- Text: `#F2EDE4` → `#080808` on hover
- Border: `2px solid #F2EDE4`

#### Sizes
| Size | Padding | Min-height | Font |
|------|---------|------------|------|
| `sm` | `px-5 py-2.5` | `44px` | `text-[0.75rem]` |
| `md` | `px-7 py-3.5` | `44px` | `text-[0.8125rem]` |
| `lg` | `px-10 py-[1.0625rem]` | `44px` | `text-[0.875rem]` |

All buttons: `rounded-md`, focus ring: `2px solid #CF9B2E` offset `2px` on `#080808`.

#### Magnetic Effect
- Trigger zone: 60px outside element bounds
- Max drift: 10px
- Strength: 0.4
- Spring-back easing: `cubic-bezier(0.16, 1, 0.3, 1)` over 0.6s
- Movement response: `transform 0.15s ease-out`
- Respects `prefers-reduced-motion`

### Cards

#### Standard Card
```css
border-radius: 8px;  /* rounded-lg */
border: 1px solid #2D2A27;
background: #111110;
```

#### Portal / Elevated Card
```css
border-radius: 16px;
box-shadow:
  inset 0 1px 0 0 rgba(242,237,228,0.03),
  0 1px 3px 0 rgba(0,0,0,0.5),
  0 4px 12px 0 rgba(0,0,0,0.3);
```

#### Comparison Card (IGC Recommended)
```css
border: 1px solid rgba(207,155,46,0.40);
border-left: 2px solid rgba(207,155,46,0.70);
background: #111110;
box-shadow: 0 0 30px rgba(207,155,46,0.06);
```
Top highlight: `2px gradient bar — transparent → gold/80 → transparent` (centered).

### Badges / Pills
```css
border: 2px solid rgba(242,237,228,0.22);
border-radius: 9999px;
padding: 6px 16px;
font-family: DM Mono;
font-size: 0.6875rem;
letter-spacing: 0.16em;
text-transform: uppercase;
```
Status dot: `6px × 6px`, `border-radius: 50%`, green: `#4CAF7A`.

### Expansion Rows (Accordion)
- Border: `border-t border-b border-[#2D2A27]` with `-mb-px` overlap
- Padding: `py-7`
- Open state background: `radial-gradient(ellipse 80% 100% at 50% 50%, rgba(242,237,228,0.025) 0%, transparent 70%)`
- Icon: Transitions to `#CF9B2E` when open

---

## 7. Motion & Animation

### Master Easing
```css
cubic-bezier(0.16, 1, 0.3, 1)  /* expo-out — used everywhere */
```

### Motion Presets

| Name | From | To | Duration | Easing |
|------|------|----|----------|--------|
| `fadeUp` | `opacity:0, y:12` | `opacity:1, y:0` | 0.6s | expo-out |
| `fadeIn` | `opacity:0` | `opacity:1` | 0.5s | expo-out |
| `lineReveal` | `scaleX:0, originX:left` | `scaleX:1` | 0.9s | expo-out |
| `stagger` | — | — | — | children delay: 0.12s |
| `staggerFast` | — | — | — | children delay: 0.06s |

### Scroll Trigger
- `useInView` with `once: true`, `margin: '-80px'`
- Staggered children fadeUp on enter

### Hero Entrance Sequence (mount, no scroll)
| Element | Delay | Duration | Effect |
|---------|-------|----------|--------|
| Grid overlay + "01" ghost | 0.2s | 0.4s | opacity only |
| Gold rule line | 0.15s | 0.9s | scaleX 0→1, origin-left |
| Section badge | 0.3s | 0.7s | opacity + y:8→0 |
| H1 headline | 0.45s | 0.9s | opacity + y:12→0 |
| Sub-headline | 0.6s | 0.7s | opacity + y:10→0 |
| CTA row | 0.78s | 0.6s | opacity + y:8→0 |
| Scroll cue | 1.3s | 0.5s | opacity only |

### Keyframe Animations

**glow-pulse** (portal elements, 2s ease-in-out infinite)
```css
0%, 100%: box-shadow: 0 0 6px 2px rgba(207,155,46,0.5), 0 0 14px 4px rgba(207,155,46,0.2)
50%:      box-shadow: 0 0 3px 1px rgba(207,155,46,0.3), 0 0 8px 2px rgba(207,155,46,0.1)
```

**terminal-blink** (cursor, 1.2s step-end infinite)
```css
0%, 100%: opacity: 1
50%:      opacity: 0
```

**signal-arrive** (data arrival text glow, 0.8s ease-out forwards)
```css
0%:   text-shadow: 0 0 24px rgba(207,155,46,0.6), 0 0 48px rgba(207,155,46,0.3)
100%: text-shadow: 0 0 20px rgba(207,155,46,0.08)
```

**border-breathe** (subtle border pulse, 4s ease-in-out infinite)
```css
0%, 100%: border-color: rgba(207,155,46,0.06)
50%:      border-color: rgba(207,155,46,0.14)
```

### Motion Rules
- **Hero:** Full entrance sequence. Use mount animations, not scroll triggers.
- **Sections:** Scroll-triggered fadeUp only. No decorative loops.
- **Buttons:** Scale + shadow on hover. No blur, no rotate.
- **Content:** `opacity + translateY` only. Never scale-in or rotate content.
- **Respect** `prefers-reduced-motion` on all interactive effects.

---

## 8. Decorative Layers

### Hero Section (full treatment)
1. **Grain texture:** Fixed overlay, `opacity: 0.025`, no pointer events
2. **Precision grid:** 40px squares, `stroke: rgba(242,237,228,0.06)`
3. **Ghost ordinal:** `"01"` in Playfair, massive, `opacity: 0.04`, right-anchored
4. **Radial glow:** `rgba(242,237,228,0.04)` from center — warm, NOT gold
5. **Gold rule line:** 1px horizontal, `scaleX` reveal animation

### Other Sections (clean)
No grain, no grid, no glow. Clarity and whitespace are the trust signal.

### Portal / Dashboard (additional)
- **CRT scanlines:** `repeating-linear-gradient(0deg, transparent 0, transparent 1px, rgba(0,0,0,0.025) 1px, rgba(0,0,0,0.025) 2px)`
- **Portal grid:** 60px squares, `rgba(207,155,46,0.012)` fill
- **Terminal cursor:** `terminal-blink` 1.2s
- **Signal glow:** `glow-pulse` 2s on active data

---

## 9. Shadows & Borders Reference

| Context | Value |
|---------|-------|
| Primary button idle | `0 0 28px rgba(242,237,228,0.18), 0 4px 14px rgba(0,0,0,0.45)` |
| Primary button hover | `0 0 44px rgba(207,155,46,0.20), 0 6px 22px rgba(0,0,0,0.55)` |
| Nav dock idle | `0 4px 24px rgba(0,0,0,0.35)` |
| Nav dock scrolled | `0 8px 48px rgba(0,0,0,0.65)` |
| Portal card | `inset 0 1px 0 rgba(242,237,228,0.03), 0 1px 3px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)` |
| Gold glow | `0 0 6px 2px rgba(207,155,46,0.5), 0 0 12px 4px rgba(207,155,46,0.2)` |
| Gold glow subtle | `0 0 4px 1px rgba(207,155,46,0.4)` |
| Comparison card | `0 0 30px rgba(207,155,46,0.06)` |

### Border Radius Scale
| Value | Usage |
|-------|-------|
| `4px` | Logo icon |
| `6px` | Small cards, guarantee block items |
| `8px` | Buttons, general cards |
| `16px` | Portal cards, elevated surfaces |
| `24px` | Mobile menu card |
| `9999px` | Pills, badges, nav dock, cursor ring |

---

## 10. Responsive Breakpoints

| Breakpoint | Min-width | Notes |
|------------|-----------|-------|
| Default | — | Mobile-first |
| `md` | 768px | Two-column layouts begin |
| `lg` | 1024px | Three-column layouts, desktop nav |

Typography uses `clamp()` — no discrete breakpoint jumps. Layout shifts at `md` and `lg` only.

---

## 11. Accessibility Standards
- All interactive elements: `min-height: 44px` (touch target)
- Focus rings: `2px solid #CF9B2E`, offset `2px` on `#080808`
- Motion: All effects wrapped in `prefers-reduced-motion` checks
- Custom cursor: Hidden on touch/coarse pointer devices
- Color contrast: `text-primary` (#F2EDE4) on `background` (#080808) = 18.1:1

---

## 12. Do / Don't

| Do | Don't |
|----|-------|
| Use `#080808` as the darkest base | Use pure `#000000` |
| Apply gold exclusively to primary CTAs and active states | Use gold on labels, icons, or ambient decoration |
| Use Playfair 400 (regular) for headlines | Use Playfair bold |
| Use Inter 300 (light) for lead copy | Use Inter 400 for lead copy (kills the serif/sans contrast) |
| Animate with `opacity + translateY` | Animate with scale, rotate, or blur on content |
| Let negative space carry the premium feel | Fill sections with decorative elements |
| Use DM Mono for labels with `tracking-[0.16em]` | Use serif or sans-serif for metadata labels |
| Apply grain + grid only in the hero | Apply decorative layers across all sections |
| Build focus rings in gold | Default to browser blue focus rings |

---

## 13. CSS Design Tokens (Copy-Paste)

```css
:root {
  /* Surfaces */
  --color-background: #080808;
  --color-surface: #111110;
  --color-surface-soft: #0D0D0C;
  --color-surface-raised: #1A1918;
  --color-border: #2D2A27;

  /* Text */
  --color-text-primary: #F2EDE4;
  --color-text-mid: #C5C0BB;
  --color-text-secondary: #A09890;
  --color-text-tertiary: #857F74;

  /* Accent */
  --color-gold: #CF9B2E;
  --color-gold-dim: #7D5E1C;

  /* Signals */
  --color-signal: #1F4D3A;
  --color-signal-nominal: #3D8B5E;
  --color-signal-critical: #B84233;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-sans: 'DM Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Fira Code', monospace;
  --font-logo: 'Poppins', sans-serif;

  /* Easing */
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Motion durations */
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
  --duration-display: 900ms;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Layout */
  --max-width-site: 1200px;
  --max-width-prose: 680px;
}
```

---

*Last updated: April 2026 — extracted from IGC website production codebase.*
