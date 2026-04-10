# Interactions, Animation & Motion Quality Audit

**Date:** 2026-04-10
**Scope:** Main public-facing marketing site (not portal)
**Auditor:** Claude Opus 4.6

---

## Finding 01 — HIGH: TestimonialSection is not rendered on the homepage

- **File:** `app/page.tsx`, lines 1-23
- **Problem:** `TestimonialSection` is imported nowhere in `app/page.tsx`. The component exists in `components/sections/TestimonialSection.tsx` and is fully built with stagger/fadeUp animations, stat callouts, and a testimonial quote block, but it never appears on the page. The entire section's animations are dead code. From a conversion perspective, social proof is missing from the page flow between ComparisonSection and FAQSection — a critical gap.
- **Proposed fix:** Add `<TestimonialSection />` between `<ComparisonSection />` and `<FAQSection />` in `app/page.tsx`. Import the component at the top of the file.

---

## Finding 02 — HIGH: Cursor.tsx renders on mobile/touch devices and hides the native cursor

- **File:** `components/ui/Cursor.tsx`, lines 17-19; `components/ui/PublicShell.tsx`, line 15
- **Problem:** `Cursor` is rendered unconditionally for all non-portal routes. On line 18 of Cursor.tsx, `document.body.style.cursor = 'none'` fires immediately. There is no check for touch capability. On mobile devices and tablets, this hides the native cursor if a mouse is briefly connected, and the component runs a perpetual `requestAnimationFrame` loop (`tick` function, line 59) burning CPU cycles for zero benefit on touch devices. The `visible` state starts as `false` so the elements are opacity-0, but the rAF loop still runs continuously.
- **Proposed fix:** In `PublicShell.tsx`, conditionally render `<Cursor />` only on pointer-capable devices. Use a state hook:
  ```tsx
  const [hasPointer, setHasPointer] = useState(false)
  useEffect(() => {
    setHasPointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])
  ```
  Render `{!isPortal && hasPointer && <Cursor />}`. This eliminates wasted rAF cycles on all touch devices.

---

## Finding 03 — HIGH: Cursor.tsx useEffect has `visible` in dependency array, causing teardown/rebuild on every mouse enter/leave

- **File:** `components/ui/Cursor.tsx`, line 81
- **Problem:** The `useEffect` dependency array is `[visible]`. Every time the mouse enters or leaves the document (`onMouseEnter`/`onMouseLeave` toggle `visible`), the entire effect tears down — removes all event listeners, cancels the rAF — and rebuilds. This means:
  1. A brief frame gap where no events are listened to.
  2. The `ringPos` ref resets its lerp position because a new `tick` closure captures stale state.
  3. When the user moves the mouse back in, the ring jumps to the cursor instead of smoothly lerping.
- **Proposed fix:** Remove `visible` from the dependency array (make it `[]`). Handle visibility purely through the opacity style, which is already driven by the `visible` state. The rAF loop and event listeners should be mounted once and persist for the component lifetime.

---

## Finding 04 — HIGH: No `prefers-reduced-motion` handling for scroll-driven parallax or the infinite scroll-cue bounce

- **File:** `components/sections/HeroSection.tsx`, lines 19-24 (parallax), lines 193-197 (infinite bounce); `components/ui/MotionProvider.tsx`, line 6
- **Problem:** `MotionProvider` correctly sets `<MotionConfig reducedMotion="user">`, which causes framer-motion to respect `prefers-reduced-motion` for variant-based animations. However, `useTransform`-driven values (`contentY`, `scrollCueOpacity` on lines 23-24) and the infinite bounce animation (line 195: `animate={{ y: [0, 8, 0] }}` with `repeat: Infinity`) are NOT affected by `reducedMotion="user"`. The `useTransform` hook always produces values regardless of the motion preference. The infinite bounce explicitly sets `animate` props which bypass the variant system entirely. Users who have requested reduced motion still get parallax shifts and an endlessly bouncing dot.
- **Proposed fix:** For the parallax, conditionally set `contentY` to `0` when reduced motion is preferred:
  ```tsx
  const prefersReduced = useReducedMotion()
  const contentY = useTransform(scrollYProgress, [0, 0.3], prefersReduced ? [0, 0] : [0, -40])
  ```
  For the bounce, conditionally remove the infinite animation:
  ```tsx
  animate={prefersReduced ? {} : { y: [0, 8, 0] }}
  ```
  Import `useReducedMotion` from `framer-motion`.

---

## Finding 05 — MEDIUM: HeroSection entrance stagger delays are manually hardcoded and create a 1.3s total sequence that is too long

- **File:** `components/sections/HeroSection.tsx`, lines 77-188
- **Problem:** Each element has a manually specified delay: 0.15, 0.3, 0.45, 0.6, 0.68, 0.78, 1.0, 1.3. This is an 8-step cascade spanning 1.3 seconds before the scroll cue appears. The user sees content trickling in for over a second. On repeat visits this feels sluggish, not premium. Additionally, the delays are hardcoded per-element rather than using the `stagger` variant, creating maintenance burden and inconsistency with every other section that uses `stagger`.
- **Proposed fix:** Reduce the total cascade to ~0.9s. Use a parent `stagger` container with `staggerChildren: 0.08` and `delayChildren: 0.15` instead of manual delays. This means ~7 children x 0.08 = 0.56s of stagger + 0.15 initial delay = 0.71s total, then the scroll cue at ~0.85s. Faster, cleaner, and consistent with how every other section works. Alternatively, if manual control is preferred, compress the delays: 0.1, 0.2, 0.3, 0.4, 0.46, 0.54, 0.7, 0.85.

---

## Finding 06 — MEDIUM: HowItWorksSection step cards have `cursor-pointer` but no click handler

- **File:** `components/sections/HowItWorksSection.tsx`, line 89
- **Problem:** Each step card has `className="... cursor-pointer group"` but there is no `onClick`, `onHoverStart`, or any interactive behavior. The `cursor-pointer` promises interactivity that does not exist. The only hover effect is the background number opacity change (line 93: `group-hover:opacity-60`), which is purely decorative. The cursor changes to a pointer, the custom Cursor.tsx ring expands (because it detects `:hover` on elements), but clicking does nothing. This is a false affordance.
- **Proposed fix:** Either (a) remove `cursor-pointer` from the class list and keep only the decorative hover effect, or (b) add actual interactivity — e.g., clicking scrolls to a relevant section or expands a detail panel. Option (a) is the immediate fix. Replace `cursor-pointer group` with `group` on line 89.

---

## Finding 07 — MEDIUM: Comparison cards have no hover state

- **File:** `components/sections/ComparisonSection.tsx`, lines 94-162
- **Problem:** The three comparison columns (Marketing Agency, IGC, In-House BD Person) are static blocks with no hover feedback whatsoever. On a dark luxury site where every other section has hover interactions (ProblemSection rows, HowItWorksSection cards, FAQ accordion), the comparison grid feels flat and lifeless. The IGC column has a gold left border but no interactive response. For a section whose entire purpose is to make the viewer prefer IGC, the lack of hover emphasis on the IGC column is a missed conversion opportunity.
- **Proposed fix:** Add a subtle hover state to each card:
  ```tsx
  className={`${col.borderClass} ${col.bgClass} p-6 transition-all duration-300
    hover:border-[#CF9B2E]/40 hover:shadow-[0_0_40px_rgba(207,155,46,0.06)]
    ${col.id === 'igc' ? '...' : ''}`}
  ```
  For the IGC column specifically, add a stronger hover: `hover:border-[#CF9B2E]/60 hover:shadow-[0_0_60px_rgba(207,155,46,0.12)]`. This draws the eye to the recommended option on interaction.

---

## Finding 08 — MEDIUM: Ghost and outline buttons have no `active:scale` press feedback

- **File:** `components/ui/Button.tsx`, lines 37-51
- **Problem:** The `primary` variant has `active:scale-[0.99]` (line 33), giving tactile click feedback. The `ghost`, `outline`, and `light` variants have no `active:` state at all. When a user clicks "How it works" (ghost button in HeroSection), there is zero press feedback — the button just sits there. This asymmetry between button variants makes non-primary buttons feel broken by comparison.
- **Proposed fix:** Add `active:scale-[0.98]` to the `ghost`, `outline`, and `light` variant strings. For `ghost` specifically on line 39: append `active:scale-[0.98]`. For `outline` on line 44: append `active:scale-[0.98]`. For `light` on line 50: append `active:scale-[0.98]`.

---

## Finding 09 — MEDIUM: ProblemSection expand/collapse animation height transition causes layout reflow jank

- **File:** `components/sections/ProblemSection.tsx`, lines 117-126
- **Problem:** The expand animation uses `height: 'auto'` as the target (line 120). Framer Motion's `AnimatePresence` handles this via measurement, but the transition uses `duration: 0.35` with the expo-out curve. The issue is that `marginTop` is also being animated simultaneously (line 120: `marginTop: '0.75rem'`), and the `overflow-hidden` class is missing on the parent `motion.p` element (it is only applied implicitly by framer-motion during height animation). When the consequence text is long (items 01 and 02 have 2+ lines), there is a visible text reflow as the container expands because the text wraps differently at intermediate heights.
- **Proposed fix:** Add `className="overflow-hidden"` to the `motion.p` on line 117 and increase the duration slightly to 0.4s to reduce the visual speed of height changes. The key change is ensuring the text is pre-rendered at its final width so it does not reflow. Wrap the consequence text in a `<span className="block">` inside the motion element:
  ```tsx
  <motion.div
    key="consequence"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="overflow-hidden"
  >
    <p className="font-sans text-body-md text-[#A09890] leading-relaxed pt-3">
      {item.consequence}
    </p>
  </motion.div>
  ```
  By moving the `marginTop` to a `pt-3` on the inner `<p>` and animating only `height` + `opacity` on the wrapper, the layout is cleaner and the text never reflows.

---

## Finding 10 — MEDIUM: FAQ accordion opacity and height animate at the same speed, causing text to appear before container finishes opening

- **File:** `components/sections/FAQSection.tsx`, lines 99-114
- **Problem:** Both `opacity` and `height` share the same transition: `duration: 0.3, ease: [0.16, 1, 0.3, 1]`. With the expo-out curve, the opacity reaches ~0.85 at roughly 30% of the duration (because the curve front-loads progress), but the height is still mid-expansion at that point. The result is that the text fades in and becomes readable while the container is still visibly growing around it. This creates a "text floating into existence" effect that is slightly disorienting.
- **Proposed fix:** Stagger the opacity behind the height by using separate transition properties:
  ```tsx
  transition={{
    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    opacity: { duration: 0.25, delay: 0.08, ease: 'easeOut' },
  }}
  ```
  This ensures the container opens first, then the text fades in, creating a more deliberate reveal.

---

## Finding 11 — MEDIUM: `useMagnetic` hook attaches a `mousemove` listener to `window` for every primary button instance

- **File:** `hooks/useMagnetic.ts`, line 51; `components/ui/Button.tsx`, lines 82-97
- **Problem:** Every `<Button variant="primary">` wraps in `<MagneticWrapper>` which calls `useMagnetic` which attaches a `window.addEventListener('mousemove', ...)`. The homepage has at least 6 primary buttons (Hero, HowItWorks, SprintSection, ComparisonSection, TrustSection, ClosingCTA). That means 6 separate `mousemove` handlers running on every pixel of mouse movement across the entire window. Each handler calls `getBoundingClientRect()` (which forces a layout read) and checks zone containment. Six layout reads per mouse move event is a measurable performance cost.
- **Proposed fix:** Two options:
  1. **Quick fix:** Change the event from `window` `mousemove` to the wrapper element's `mouseenter`/`mousemove`/`mouseleave`. Use a larger padding area via CSS (`padding: 60px; margin: -60px;`) on the wrapper to create the trigger zone without needing a window listener.
  2. **Better fix:** Create a single global `MagneticManager` that collects all registered elements and runs one `mousemove` handler. Each `useMagnetic` call registers/unregisters with the manager. This reduces 6 handlers to 1.

---

## Finding 12 — MEDIUM: TrustSection and HowItWorksSection section label/gold-line are not animated

- **File:** `components/sections/TrustSection.tsx`, lines 38-45; `components/sections/HowItWorksSection.tsx`, lines 53-62
- **Problem:** In both sections, the `gold-line` and section label are rendered as plain HTML outside any `motion.div` with variants. Compare to ProblemSection (lines 54, 63-78) and SprintSection (lines 108-116) where these elements are inside the stagger container with `fadeUp` variants. The inconsistency means that in TrustSection and HowItWorksSection, the gold line and label appear instantly (no entrance animation), then the headline fades up below them — creating a jarring visual disconnect where decorative elements precede the content they introduce without any animation.
- **Proposed fix:** Wrap the gold-line and section label in `<motion.div variants={fadeUp}>` inside the existing stagger container. For TrustSection, move lines 38-45 inside the `motion.div` that starts at line 58. For HowItWorksSection, wrap lines 53-62 in a `<motion.div variants={fadeUp}>` and place them inside a parent stagger container.

---

## Finding 13 — MEDIUM: ClosingCTA does not use SectionWrapper, resulting in inconsistent padding and no `relative` positioning

- **File:** `components/sections/ClosingCTA.tsx`, lines 13-73
- **Problem:** Every other section uses `<SectionWrapper>` which provides `relative` positioning (implicitly via the content structure), consistent padding (`px-6 md:px-10 lg:px-16 py-28 md:py-32 lg:py-40`), and the `max-w-site` container. ClosingCTA manually defines `px-6 md:px-10 lg:px-16 py-20 md:py-32` — note the missing `lg:py-40` and the different `py-20` mobile padding. More importantly, the background decorative elements (large "IGC" text on line 15, radial bloom on line 23) use `absolute inset-0` but the section element does not explicitly set `position: relative` — it happens to work because `min-h-screen` and `flex` create a stacking context, but this is fragile.
- **Proposed fix:** Refactor to use `<SectionWrapper className="bg-[#080808] min-h-screen flex items-center">` for consistency. This ensures the `relative` context and unified padding. Move the decorative absolute elements inside the wrapper.

---

## Finding 14 — LOW: Nav pill scroll-state transition uses `transition-all duration-500` which animates properties that do not change

- **File:** `components/ui/Nav.tsx`, line 99
- **Problem:** `transition-all duration-500` means every property on the element will transition over 500ms, including `width`, `max-width`, `height`, `padding`, `border-radius`, etc. — none of which actually change between scrolled/not-scrolled states. Only `background-color`, `backdrop-filter`, `border-color`, and `box-shadow` change. Using `transition-all` is a minor performance concern (the browser sets up transition tracking for every animatable property) and a correctness concern (if any unintended property changes, it will animate slowly instead of snapping).
- **Proposed fix:** Replace `transition-all duration-500` with `transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500`. This is more explicit and slightly more performant.

---

## Finding 15 — LOW: Mobile menu links have no stagger animation

- **File:** `components/ui/Nav.tsx`, lines 170-179
- **Problem:** When the mobile menu opens, all four links appear simultaneously. The menu container itself has a fade+scale entrance (line 163: `initial={{ opacity: 0, y: -8, scale: 0.97 }}`), but the individual links inside have no stagger. On premium mobile sites, a cascading reveal of nav items (each link sliding in 40-60ms apart) is a signature touch. Currently, the links just pop in with the container.
- **Proposed fix:** Wrap the links in a framer-motion stagger container:
  ```tsx
  <motion.nav
    variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
    initial="hidden"
    animate="visible"
    className="flex flex-col px-6 py-6 gap-5"
  >
    {links.map((link) => (
      <motion.div key={link.href} variants={fadeUp}>
        <NavLink ... />
      </motion.div>
    ))}
  </motion.nav>
  ```

---

## Finding 16 — LOW: Scroll cue bouncing dot uses `easeInOut` instead of the site's signature expo-out curve

- **File:** `components/sections/HeroSection.tsx`, line 196
- **Problem:** The bouncing dot animation uses `ease: 'easeInOut'` while every other motion on the site uses `[0.16, 1, 0.3, 1]` (expo-out). The `easeInOut` curve creates a symmetrical bounce (slow-fast-slow-fast-slow), while the expo-out curve used everywhere else has an aggressive start and gentle settle. The dot's motion feels subtly different from the rest of the page — like it belongs to a different site.
- **Proposed fix:** Change to a bounce-appropriate curve. Since this is an oscillating animation (not a one-directional transition), a pure expo-out does not work well. Instead, use `ease: [0.45, 0, 0.55, 1]` (a slightly decelerated sinusoidal) or keep `easeInOut` but acknowledge this is intentional. If keeping it, add a comment: `// Intentional: symmetrical ease for looping bounce`.

---

## Finding 17 — LOW: SprintSection risk-reversal rows have no hover feedback

- **File:** `components/sections/SprintSection.tsx`, lines 173-192
- **Problem:** The three numbered ownership statements (lines 177-191) have alternating background tinting (`bg-[#F2EDE4]/[0.02]` on even rows) but no hover state. These are visually structured like interactive list items (numbered, padded, with alternating backgrounds) but provide zero interactive feedback. In the ProblemSection, similar numbered rows have hover-driven expand, glow, and arrow color changes. The contrast makes SprintSection feel unfinished.
- **Proposed fix:** Add a subtle hover effect:
  ```tsx
  className={`flex items-start gap-4 py-3 px-4 rounded-sm transition-colors duration-200
    ${index % 2 === 0 ? 'bg-[#F2EDE4]/[0.02]' : 'bg-transparent'}
    hover:bg-[#F2EDE4]/[0.04]`}
  ```

---

## Finding 18 — LOW: TrustSection LinkedIn link has no underline-on-hover to match nav link pattern

- **File:** `components/sections/TrustSection.tsx`, lines 91-99
- **Problem:** The "View LinkedIn Profile" link uses `hover:text-[#F2EDE4]` for color change but has no underline or other visual indicator that it is a link, beyond the arrow character in the label. The nav links use an animated underline scale from `scale-x-0` to `scale-x-100`. The footer links have no underline either, but they are in a nav context. This inline link within body content should have a clearer interactive indicator.
- **Proposed fix:** Add an underline-on-hover: `hover:text-[#F2EDE4] hover:underline underline-offset-4 decoration-[#CF9B2E]/40`.

---

## Finding 19 — LOW: `staggerFast` variant defined in `lib/motion.ts` is never used anywhere

- **File:** `lib/motion.ts`, lines 38-46
- **Problem:** `staggerFast` (with `staggerChildren: 0.06`) is exported but never imported by any component. Every section uses the standard `stagger` (0.12s). This is dead code. The variant exists presumably for denser lists, but no component references it.
- **Proposed fix:** Either (a) remove `staggerFast` from `lib/motion.ts`, or (b) use it where appropriate — the FAQ section (6 items) or ComparisonSection (3 cards) would benefit from the faster stagger to avoid the list feeling sluggish (6 items x 0.12s = 0.72s total stagger with `stagger`, vs 0.36s with `staggerFast`).

---

## Finding 20 — LOW: Diagnostic page (`app/diagnostic/page.tsx`) has zero entrance animations

- **File:** `app/diagnostic/page.tsx`, lines 1-123
- **Problem:** The diagnostic/booking page is entirely static — no framer-motion imports, no entrance animations, no fadeUp, no stagger. The page header (gold-line, section-label, h1) and the profile card all render instantly with no choreography. After navigating from the homepage where every element has a polished entrance sequence, the diagnostic page feels like a different product. The contrast is jarring.
- **Proposed fix:** Add the same stagger/fadeUp pattern used on every homepage section. Wrap the page header and profile card in `motion.div` with `useInView` triggers. The Cal embed can render immediately (it has its own loading state), but the surrounding content should animate in:
  ```tsx
  'use client' // required at top
  // Import motion, useInView, useRef, stagger, fadeUp
  // Wrap header elements in motion.div variants={stagger}
  // Wrap profile card in motion.div variants={fadeUp}
  ```

---

## Finding 21 — LOW: No page-level route transitions

- **File:** `app/layout.tsx`, lines 62-78; `components/ui/MotionProvider.tsx`
- **Problem:** There are no route transition animations. Navigating between pages (e.g., homepage to `/diagnostic`) is an instant hard cut. The main layout renders `<main>{children}</main>` with no `AnimatePresence` wrapping the route content. For a site with this level of motion polish on individual sections, the abrupt page transitions are a missed opportunity. The custom cursor also does not respond to route changes (no fade-out/fade-in).
- **Proposed fix:** Add a simple crossfade page transition using `AnimatePresence` and `motion.div` keyed to the pathname:
  ```tsx
  // In a client layout wrapper:
  <AnimatePresence mode="wait">
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
  ```
  Note: This requires Next.js App Router template.tsx pattern or a client-side layout wrapper, since layout.tsx does not re-render on route change.

---

## Finding 22 — LOW: Footer has no entrance animation and no hover underlines on nav links

- **File:** `components/ui/Footer.tsx`, lines 24-66
- **Problem:** The footer is a server component with no motion. It renders instantly regardless of scroll position. Footer links have `hover:text-[#F2EDE4]` color transitions but no underline animation — unlike the desktop nav links which have a gold underline scale effect. The footer is the last thing visible on the page; a subtle fade-in on scroll would be a small polish touch.
- **Proposed fix:** Convert to client component, add a `useInView`-triggered `fadeUp` on the footer content. Add the same underline-on-hover pattern from NavLink to footer links. Low priority since footers are often static.

---

## Finding 23 — LOW: Gold-line elements have no entrance animation in sections where they sit outside the stagger container

- **File:** `components/sections/HowItWorksSection.tsx`, line 53; `components/sections/TrustSection.tsx`, line 38
- **Problem:** These gold-line `<span>` elements are outside the framer-motion stagger orchestration. In HeroSection (line 76-83), the gold line uses the `lineReveal` variant (scaleX from 0 to 1) for a premium horizontal wipe effect. In ProblemSection, it is a plain span but inside the stagger container so it at least fades up. In HowItWorksSection and TrustSection, it is a plain span outside all motion containers — it just appears.
- **Proposed fix:** Use `lineReveal` animation on gold-lines site-wide for consistency with the hero. Wrap each in `<motion.span variants={lineReveal} initial="hidden" animate={inView ? 'visible' : 'hidden'}>` and add the `lineReveal` import.

---

---

## Summary Table

| ID | Severity | Section / File | Finding | Effort |
|----|----------|---------------|---------|--------|
| 01 | **HIGH** | `app/page.tsx` | TestimonialSection not rendered on homepage | 2 min |
| 02 | **HIGH** | `Cursor.tsx` / `PublicShell.tsx` | Cursor renders on touch devices, wastes CPU | 10 min |
| 03 | **HIGH** | `Cursor.tsx:81` | `useEffect` dependency on `visible` causes teardown/rebuild loop | 5 min |
| 04 | **HIGH** | `HeroSection.tsx` | Parallax and infinite bounce ignore `prefers-reduced-motion` | 10 min |
| 05 | **MEDIUM** | `HeroSection.tsx` | 1.3s hero entrance cascade is too slow; hardcoded delays | 20 min |
| 06 | **MEDIUM** | `HowItWorksSection.tsx:89` | `cursor-pointer` with no click handler (false affordance) | 2 min |
| 07 | **MEDIUM** | `ComparisonSection.tsx` | Comparison cards have zero hover state | 10 min |
| 08 | **MEDIUM** | `Button.tsx:37-51` | Ghost/outline/light buttons missing `active:scale` press state | 5 min |
| 09 | **MEDIUM** | `ProblemSection.tsx:117-126` | Expand animation causes text reflow during height transition | 15 min |
| 10 | **MEDIUM** | `FAQSection.tsx:99-114` | Opacity and height animate at same speed; text appears before box opens | 10 min |
| 11 | **MEDIUM** | `useMagnetic.ts` / `Button.tsx` | 6 window-level `mousemove` listeners from magnetic buttons | 30 min |
| 12 | **MEDIUM** | `TrustSection.tsx` / `HowItWorksSection.tsx` | Gold-line and section labels not inside stagger container | 15 min |
| 13 | **MEDIUM** | `ClosingCTA.tsx` | Does not use SectionWrapper; inconsistent padding | 10 min |
| 14 | **LOW** | `Nav.tsx:99` | `transition-all` animates unchanged properties | 2 min |
| 15 | **LOW** | `Nav.tsx:170-179` | Mobile menu links have no stagger animation | 10 min |
| 16 | **LOW** | `HeroSection.tsx:196` | Scroll cue bounce uses different easing than rest of site | 2 min |
| 17 | **LOW** | `SprintSection.tsx:173-192` | Risk-reversal rows have no hover feedback | 5 min |
| 18 | **LOW** | `TrustSection.tsx:91-99` | LinkedIn link has no underline indicator on hover | 2 min |
| 19 | **LOW** | `lib/motion.ts:38-46` | `staggerFast` variant is dead code | 2 min |
| 20 | **LOW** | `app/diagnostic/page.tsx` | Entire booking page has zero entrance animations | 20 min |
| 21 | **LOW** | `app/layout.tsx` | No page-level route transitions | 30 min |
| 22 | **LOW** | `Footer.tsx` | No entrance animation, no hover underlines | 10 min |
| 23 | **LOW** | `HowItWorksSection.tsx` / `TrustSection.tsx` | Gold-lines outside stagger; not using `lineReveal` | 10 min |

### Tier 1 — HIGH upside (fix first)
Findings 01, 02, 03, 04. These are bugs or accessibility violations. Finding 01 is a missing section. Finding 02-03 waste CPU on every device. Finding 04 is an accessibility failure for motion-sensitive users.

### Tier 2 — MEDIUM upside (polish pass)
Findings 05, 06, 07, 08, 09, 10, 11, 12, 13. These are perceptual quality gaps. Most are 5-15 minute fixes that bring interaction consistency across sections. Finding 11 (magnetic performance) is the largest effort but prevents scaling issues.

### Tier 3 — LOW upside (nice-to-have)
Findings 14, 15, 16, 17, 18, 19, 20, 21, 22, 23. Small inconsistencies and dead code. Finding 20 (diagnostic page animations) and 21 (page transitions) have the highest impact in this tier but require more effort.
