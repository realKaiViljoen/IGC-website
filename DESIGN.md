# IGC — Design System v2 (Canonical)

## The Positioning

IGC is not a design agency. Not a growth hacker. Not a 2016 playbook shop.

**It is an infrastructure operator.** The website must feel like the product dashboard of a company that is genuinely ahead — not visually loud, not trying to impress with effects, but *unmistakably capable*. Every interaction should make a clinic owner feel: *"These people know what they're doing."*

**Reference aesthetic:** Linear, Vercel, Resend, Raycast — warm operator-dark. Not cold-blue tech. Not agency pink. Closer to a private equity trading desk crossed with a technical operator's dashboard.

---

## Theme: Full Dark (Warm)

Warm near-black. Not cold `#000000`. Not blue-grey. Warm dark — the distinction that separates premium from developer-tool.

---

## Color Tokens (Final)

```
background:     #080808   — Page base, hero, all dark sections
surface:        #111110   — Section alternation
surface-soft:   #0D0D0C   — Grouped UI, forms, dropdowns, nested cards
surface-raised: #1A1918   — Elevated cards, popovers
border:         #242220   — Dividers, input borders (warm, not grey)
text-primary:   #F2EDE4   — Primary text (warm white, NOT stark #FFF)
text-secondary: #857F74   — Sub-headlines, muted copy, nav links default
text-tertiary:  #4A4640   — Labels, meta, minimum emphasis
gold:           #C9922A   — RESTRICTED (see Gold Rule below)
gold-dim:       #7A5A1A   — Passive gold only when gold must appear subtly
signal:         #1F4D3A   — CTA hover fill (primary button hover)
paper:          #F2EDE4   — Reserved for light-on-dark overlays only
```

---

## The Gold Rule

Gold (`#C9922A`) is the rarest element in the system. It signals: *this is the most important thing on the screen*.

**Gold IS used for:**
- Primary CTA: border + text colour + hover fill
- Active / selected states: left accent bar, active underline
- KPI highlights: Sprint stat numbers only
- The 1px gold line in hero (single decorative use)

**Gold is NEVER used for:**
- Mono labels / section labels (use `text-tertiary`)
- Ambient decorative glow (radial bloom is warm-tinted, not gold)
- Icon colour
- Any background fill except primary CTA hover

**Why:** Everything that is gold signals action or achievement. Distributing gold across labels and glows causes premium saturation collapse — everything looks important, nothing stands out.

---

## Typography

### Validated Pairing: Playfair Display + Inter
Confirmed #1 "Classic Elegant" match for premium editorial operator positioning.

| Font | Role | When |
|---|---|---|
| Playfair Display | Headlines only | H1, H2, display text |
| Inter | All UI text | Body, nav, buttons, labels, forms |
| DM Mono | Mono metadata | Section labels, KPI sub-labels, code |

### Type Scale

| Element | Font | Weight | Size | Tracking | Colour |
|---|---|---|---|---|---|
| Hero H1 | Playfair | **400** | `clamp(3.5rem, 7vw, 6.5rem)` | `-0.02em` | `#F2EDE4` |
| Page H1 | Playfair | 400 | `clamp(2.5rem, 4.5vw, 4rem)` | `-0.015em` | `#F2EDE4` |
| H2 (section) | Playfair | 400 | `clamp(1.75rem, 3vw, 2.5rem)` | `-0.015em` | `#F2EDE4` |
| Lead copy | Inter | **300** | `1.125rem / 1.75` | `0` | `#857F74` |
| Body | Inter | 400 | `1rem / 1.7` | `0` | `#857F74` |
| Section label | DM Mono | 400 | `0.6875rem` | `0.16em` | `#4A4640` (tertiary) |
| Nav links | Inter | 400 | `0.875rem` | `0.02em` | `#857F74 → #F2EDE4` |
| Button | Inter | **500** | `0.75rem` | `0.1em` | varies |

**Critical rules:**
- Hero H1 uses Playfair **400 regular** — NOT bold. At 6.5rem, regular is more premium. Bold is for tabloids.
- Lead copy (`body-lg`) uses Inter **300 light** — creates contrast against the regular/medium headline.
- Section labels use `text-tertiary` (`#4A4640`) — NOT gold. Gold is reserved.

---

## Spacing System

8px base grid. All spacing is a multiple of 4px.

```
Section padding:   py-24 md:py-32 lg:py-40
Inner gap (large): gap-12 md:gap-16
Inner gap (small): gap-6 md:gap-8
Content max-width: 1200px (max-w-site)
Prose max-width:   680px (max-w-prose)
```

---

## Motion System

```
Easing: cubic-bezier(0.16, 1, 0.3, 1)  — expo-out, used everywhere

Rules:
- opacity + translateY ONLY — no scale, no blur stacking
- Scroll-triggered: useInView once:true margin:'-80px'
- Hero: mount animation (not scroll)
- Continuous/infinite animations: loading only (no decorative loops except scroll cue)
```

### Hero Entrance Timing

| Element | Delay | Duration | Effect |
|---|---|---|---|
| Gold line | 0.2s | 0.8s | `scaleX: 0→1` origin-left |
| Mono label | 0.4s | 0.6s | `opacity + y:8→0` |
| H1 | 0.55s | 0.7s | `opacity + y:12→0` |
| Sub-headline | 0.7s | 0.7s | `opacity + y:10→0` |
| CTA row | 0.85s | 0.6s | `opacity + y:8→0` |
| **Grid + "01"** | **0.3s** | **0.4s** | `opacity only` (snaps in fast — sets the stage) |
| Scroll cue | 1.2s | 0.5s | `opacity only` |

Grid enters fast (0.3s/0.4s) — it's the backdrop. Text performs on top of it. This creates the asymmetry that prevents the "balanced-static" feel.

---

## CTA System (3 Levels)

### Primary — Gold (action commitment)
```css
background: transparent
border: 1px solid rgba(201, 146, 42, 0.5)
color: #C9922A
padding: 14px 36px
font: Inter 500, 0.75rem, 0.1em tracking, uppercase

hover:
  background: #C9922A
  color: #080808
  border-color: #C9922A
  → arrow translates +4px right
```

### Ghost — Dim white (secondary)
```css
background: transparent
border: 1px solid rgba(242, 237, 228, 0.12)
color: rgba(242, 237, 228, 0.55)

hover:
  border-color: rgba(242, 237, 228, 0.25)
  color: rgba(242, 237, 228, 0.8)
```

### Tertiary — Text only (low friction)
```css
background: none
border: none
color: #857F74
font: Inter 400, 0.875rem

hover:
  color: #F2EDE4
  text-decoration: underline
  text-underline-offset: 4px
```

---

## State-Based UI Emphasis

All interactive elements follow this 3-state progression. Gold marks progression — it is earned, not given.

| State | Visual treatment |
|---|---|
| **Inactive** | Low contrast. No gold. `opacity-60` or muted colour |
| **Active** | 2px gold left bar OR gold underline. Text at full primary colour |
| **Committed** | Solid gold fill (`bg-gold`). Dark text on gold background |

This creates psychological funnel progression within the UI itself.

---

## Hero Section — Full Spec

### Background
- Base: `#080808`
- Radial bloom: `radial-gradient(ellipse 80% 60% at 20% -10%, rgba(201, 146, 42, 0.04) 0%, transparent 60%)` — warm tint only, NOT gold. Intensity deliberately reduced to 4%.
- Grain texture: `2.5%` opacity (reduced from `3.5%` for dark backgrounds)

### Layout
- Full viewport height
- Left content: `~55%` width, vertically centered with `pb-20` offset
- Right grid: `~50%` absolute overlay

### Left Content Stack
1. Gold line: `w-14 h-px bg-[#C9922A]/70` — lineReveal animation
2. Section label: `"Growth Infrastructure Operators"` — DM Mono, `text-[#4A4640]`, 0.16em tracking (NOT gold)
3. H1: `"We build acquisition engines."` — Playfair 400, `clamp(3.5rem, 7vw, 6.5rem)`, `-0.02em`, `max-w-[16ch]`, `#F2EDE4`
4. Sub: Inter 300, `1.125rem`, `#857F74`, `max-w-[44ch]`, `1.75` line-height
5. CTAs: `gap-3`, primary (gold) + ghost (dim white)

### Right Side
- SVG grid: 40px squares, `stroke="#F2EDE4"` `strokeOpacity="0.04"`
- Ghost "01": Playfair, `text-[20vw]`, `text-[#F2EDE4]/[0.025]`

---

## Section Backgrounds

Dark sections alternate very subtly:
```
Hero, dark sections:    #080808
Alternating sections:   #111110
Raised/card sections:   #0D0D0C (surface-soft)
```

Section borders (top): `1px solid rgba(242, 237, 228, 0.05)`

**Decorative layer rule:** Hero has all 4 layers (glow + grain + grid + ghost). All other sections are clean — no glow, no grid. This is intentional contrast. The hero's atmosphere earns attention. Other sections earn trust through clarity.

---

## Nav

- Transparent at page top (`scrollY = 0`)
- After 50px: `background: rgba(8, 8, 8, 0.92)` + `backdrop-blur-sm` + `border-b border-white/[0.06]`
- Links: `text-secondary` → `text-primary` on hover
- Active: permanent underline (`scaleX: 1`), `text-primary`
- CTA: primary button variant (gold)

---

## Interactive Components

### Custom Cursor
- Dot: 5px, `#F2EDE4`, instant
- Ring: 28px, `border border-[#F2EDE4]/30`, spring lag
- On interactive hover: ring → 40px
- Mobile: hidden

### Magnetic Buttons
- Primary CTAs only
- Max drift: 10px, strength: 0.4
- Trigger zone: 60px outside bounds
- Spring-back: `0.6s cubic-bezier(0.16, 1, 0.3, 1)`

### Grain
- Fixed, full-page, `pointer-events: none`, `z-index: 9999`
- Opacity: `2.5%` (dark), `3.5%` (light sections if any)

---

## What This Site Is Not

- Not a portfolio site with project cards
- Not a SaaS with feature matrices
- Not a playful growth agency with emoji
- Not trying to be Stripe (we're not a dev tool)

It is closer to: a **private equity firm's website** crossed with a **technical operator's dashboard**. Quiet confidence. Disproportionate detail. The kind of site where the hover states do more selling than the copy.
