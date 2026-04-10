# Audit 05: Accessibility, SEO, Performance, and Code Quality

**Auditor:** Claude Opus 4.6
**Date:** 2026-04-10
**Scope:** All public-facing pages and shared components of the IGC recruitment agency marketing site (Next.js 15 App Router).

---

## Accessibility

### A-01 | HIGH | No skip-to-content link

**File:** `app/layout.tsx` / `components/ui/PublicShell.tsx`
**Problem:** There is no "Skip to main content" link anywhere in the site. Keyboard-only and screen reader users must tab through the entire Nav on every page before reaching content. This is a WCAG 2.4.1 (Level A) failure.
**Proposed fix:** Add a visually hidden skip link as the first child of `<body>` in `app/layout.tsx`:
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-[#F2EDE4] focus:text-[#080808] focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
>
  Skip to main content
</a>
```
And add `id="main-content"` to the `<main>` element (line 73).

---

### A-02 | HIGH | Metric strip in HeroSection hidden from assistive technology

**File:** `components/sections/HeroSection.tsx:158`
**Problem:** The entire metric strip (`5 Guaranteed`, `30 Days`, `R10k /month`) has `aria-hidden="true"`. These are substantive content claims (the guarantee, timeline, and pricing), not decorative. Screen reader users never receive this information.
**Proposed fix:** Remove `aria-hidden="true"` from the metric strip container on line 158. The decorative background numbers and visual separators should keep `aria-hidden`, but the actual values and labels must be accessible.

---

### A-03 | HIGH | ProblemSection expandable rows lack keyboard accessibility

**File:** `components/sections/ProblemSection.tsx:91-153`
**Problem:** The expandable pain-point rows use `onClick` and `onHoverStart`/`onHoverEnd` on a `<motion.div>` (not a `<button>`). They have `cursor-pointer` but no `role="button"`, no `tabIndex`, no `onKeyDown` handler, and no `aria-expanded` attribute. Keyboard users cannot interact with these at all.
**Proposed fix:** Wrap the interactive area of each row in a `<button>` element (or add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler for Enter/Space). Add `aria-expanded={open === item.number}` to each trigger. The consequence text should have `role="region"` or use a details/summary pattern.

---

### A-04 | HIGH | HowItWorksSection step cards have cursor-pointer but are not interactive

**File:** `components/sections/HowItWorksSection.tsx:89`
**Problem:** Each step card has `cursor-pointer` and `group` CSS classes but no click handler, no href, no interactive role. This is misleading for sighted users (cursor implies clickable) and creates no action for anyone. The `group-hover:opacity-60` on the background number is purely decorative.
**Proposed fix:** Remove `cursor-pointer` from the step card `className` on line 89. If hover effects are desired, keep `group` but remove the pointer cursor to avoid implying interactivity.

---

### A-05 | MEDIUM | Heading hierarchy violation on homepage

**File:** `app/page.tsx` (homepage section order)
**Problem:** The homepage renders sections in this order: HeroSection (h1), ProblemSection (h2), TrustSection (h2 + h3), HowItWorksSection (h2 + h3), SprintSection (h2), ComparisonSection (h2), FAQSection (h2), ClosingCTA (h2). This is structurally valid. However, the TestimonialSection is imported but NOT rendered on the homepage (not in `app/page.tsx`), which is likely an oversight -- not an a11y issue but a content gap.

Additionally, `ClosingCTA` at line 49 uses `<h2>` with `text-display-lg` (same visual size as h1), which may confuse users relying on heading structure as navigation, since it appears to be a "final hero" rather than a subsection.
**Proposed fix:** No structural fix strictly needed for heading order. Consider adding TestimonialSection to the homepage if it was intended to be there. The ClosingCTA h2 is semantically acceptable.

---

### A-06 | MEDIUM | Mobile nav links lack focus-visible styles

**File:** `components/ui/Nav.tsx:41-51`
**Problem:** The mobile `NavLink` variant (lines 41-51) has no `focus:outline-none focus-visible:ring-*` styles, unlike the desktop variant (line 57). Keyboard/screen-reader users on mobile-sized viewports get no visible focus indicator when tabbing through mobile nav links.
**Proposed fix:** Add focus-visible ring styles to the mobile NavLink:
```tsx
className={`font-sans text-[1.0625rem] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0A09] rounded-sm ${
  isActive ? 'text-[#F2EDE4]' : 'text-[#C5C0BB] hover:text-[#F2EDE4]'
}`}
```

---

### A-07 | MEDIUM | Cursor component hides native cursor, breaking accessibility

**File:** `components/ui/Cursor.tsx:19`
**Problem:** Line 19 sets `document.body.style.cursor = 'none'`, hiding the native cursor for all users including those with motor impairments who rely on seeing the system cursor. Custom cursors can cause confusion with screen magnifiers and assistive pointing devices. The custom cursor also runs a continuous `requestAnimationFrame` loop unconditionally.
**Proposed fix:** Gate the custom cursor behind a `prefers-reduced-motion` check and a `(hover: hover) and (pointer: fine)` media query. Better yet, keep the native cursor visible and layer the ring as a decorative enhancement only:
```tsx
// Don't hide native cursor
// document.body.style.cursor = 'none'  <-- remove this line
```
If the custom cursor is essential to brand, add a CSS class to `<html>` instead of inline style, and provide a user toggle.

---

### A-08 | MEDIUM | CountUp in SprintSection has no reduced-motion fallback

**File:** `components/sections/SprintSection.tsx:11-56`
**Problem:** While `MotionProvider` sets `reducedMotion="user"` for Framer Motion animations, the `CountUp` component uses a raw `requestAnimationFrame` loop (not Framer Motion). It always animates from 0 to the target value regardless of user motion preferences.
**Proposed fix:** Check `prefers-reduced-motion` and skip the animation:
```tsx
useEffect(() => {
  if (!inView) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setCount(to)
    return
  }
  // ... existing rAF animation
}, [inView, to, duration])
```

---

### A-09 | MEDIUM | useMagnetic has no reduced-motion guard

**File:** `hooks/useMagnetic.ts`
**Problem:** The magnetic button effect uses direct DOM manipulation with `mousemove` and has no `prefers-reduced-motion` check. Users who opted out of motion will still see buttons drifting.
**Proposed fix:** Add an early return at the top of the effect:
```tsx
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
```

---

### A-10 | MEDIUM | Contact form inputs lack visible error states

**File:** `app/contact/page.tsx:33-93`
**Problem:** Form inputs use `required` attribute but have no visible error styling, no `aria-invalid`, no `aria-describedby` for error messages. When a user submits with empty required fields, the only feedback is the browser's default constraint validation tooltip, which varies by browser and is invisible to some assistive technologies.
**Proposed fix:** Add client-side validation with visible inline errors, `aria-invalid="true"` on invalid fields, and `aria-describedby` pointing to error message elements. This requires making the contact page a client component or extracting the form into a client component.

---

### A-11 | MEDIUM | CalEmbed has no accessible fallback

**File:** `components/ui/CalEmbed.tsx`
**Problem:** The Cal.com embed provides no loading state, no fallback content for when JS fails, and no accessible label. Screen readers encounter an opaque third-party embed with no context.
**Proposed fix:** Wrap the Cal embed in a labeled container:
```tsx
<div role="region" aria-label="Booking calendar">
  <Cal ... />
</div>
```
Add a `<noscript>` fallback: "JavaScript is required to load the booking calendar. Email hello@igc.co.za to book directly."

---

### A-12 | LOW | Footer LinkedIn icon duplicates svg with aria-label

**File:** `components/ui/Footer.tsx:12-22`, `components/ui/Nav.tsx:17-27`, `app/about/page.tsx:9-19`
**Problem:** The `LinkedInIcon` SVG component is defined identically in three separate files, each with `aria-label="LinkedIn"` and `role="img"` on the SVG itself. However, the parent `<a>` tags already have `aria-label="LinkedIn"`. Having both results in redundant announcements. The SVG should be `aria-hidden="true"` when the parent link already has a label.
**Proposed fix:** On the SVG elements inside linked contexts, change to `aria-hidden="true"` and remove `role="img"`. The parent `<a>` tag's `aria-label` is sufficient.

---

### A-13 | LOW | Color contrast concern on small mono text

**File:** Multiple (section labels, footnotes)
**Problem:** The color `#857F74` used for tertiary text on `#080808` background yields a contrast ratio of approximately 3.5:1. For text at `10px`-`11px` (e.g., stat notes in HeroSection line 174, timestamp in TestimonialSection line 57), this fails WCAG AA for normal text (requires 4.5:1). At these sizes, the text is not "large" text.
**Proposed fix:** Increase the tertiary text color to at least `#908A82` (approximately 4.5:1 ratio) or increase font size to 14px+ where that color is used for critical information. For purely decorative labels, this is lower priority.

---

### A-14 | LOW | `scroll-behavior: smooth` in globals.css without reduced-motion guard

**File:** `app/globals.css:55`
**Problem:** `scroll-behavior: smooth` is set globally with no `prefers-reduced-motion` media query. Users who have requested reduced motion will still get smooth scrolling.
**Proposed fix:**
```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

---

## SEO

### S-01 | HIGH | Root metadata describes wrong business niche

**File:** `app/layout.tsx:42-44`
**Problem:** The page title says "Growth Infrastructure Operators" and the description says "patient acquisition systems for med-aesthetic clinics." The site copy was rewritten for recruitment agencies (commit `0e417a6`), but the root metadata was never updated. This is the most critical SEO issue -- Google sees a med-aesthetic clinic company while the actual content is about recruitment agency BD infrastructure.
**Proposed fix:** Update `app/layout.tsx` metadata:
```ts
export const metadata: Metadata = {
  title: {
    default: 'IGC | BD Infrastructure for Recruitment Agencies',
    template: '%s | IGC',
  },
  description:
    'We build mandate acquisition systems for recruitment agencies. LinkedIn sequences, landing pages, automated follow-up. 5 client conversations in 30 days or we work free.',
  keywords: ['recruitment agency BD', 'mandate acquisition', 'recruitment business development', 'South Africa', 'LinkedIn outreach'],
  // ...
}
```

---

### S-02 | HIGH | OpenGraph tags reference wrong niche

**File:** `app/layout.tsx:45-53`
**Problem:** OG title and description reference "med-aesthetic clinics" and "patient acquisition systems." Social shares will display completely wrong messaging.
**Proposed fix:** Update OG metadata to match the recruitment agency positioning:
```ts
openGraph: {
  type: 'website',
  locale: 'en_ZA',
  siteName: 'Integrated Growth Consultants',
  title: 'IGC | BD Infrastructure for Recruitment Agencies',
  description: 'We build mandate acquisition systems for recruitment agencies. 5 client conversations in 30 days.',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
},
```

---

### S-03 | HIGH | Twitter card metadata references wrong niche

**File:** `app/layout.tsx:54-58`
**Problem:** Same issue as S-02 for Twitter cards: "Growth infrastructure operators. Patient acquisition systems for med-aesthetic clinics."
**Proposed fix:** Update to match recruitment agency copy.

---

### S-04 | HIGH | About page copy references wrong niche

**File:** `app/about/page.tsx:64`
**Problem:** Line 64 says "IGC is that capability, applied specifically to med-aesthetic clinics. If your clinic is booking fewer consultations than it should be, this is where to start." The homepage copy was rewritten for recruitment agencies but the About page was not fully updated.
**Proposed fix:** Rewrite to align with recruitment agency messaging: "IGC is that capability, applied specifically to recruitment agencies. If your agency is running fewer mandate conversations than it should be, this is where to start."

---

### S-05 | HIGH | Results page copy references wrong niche

**File:** `app/results/page.tsx`
**Problem:** Multiple references to clinics: "4 clinics actively running the system" (line 80), "your clinic is a fit for the Sprint" (line 98). Metrics reference "consultations booked" and "WhatsApp response time" -- med-aesthetic metrics, not recruitment metrics.
**Proposed fix:** Full copy rewrite of results page to align with recruitment agency BD metrics: mandate conversations booked, cost per conversation, LinkedIn response rate, etc.

---

### S-06 | HIGH | Contact page form label says "Clinic Name"

**File:** `app/contact/page.tsx:48`
**Problem:** The form field label is "Clinic Name" and the placeholder is "Clinic or practice name." This is from the old med-aesthetic niche.
**Proposed fix:** Change to "Agency Name" and "Recruitment agency or firm name."

---

### S-07 | MEDIUM | No structured data (JSON-LD) on any page

**File:** All pages
**Problem:** No structured data markup anywhere on the site. For a B2B services company, `Organization`, `LocalBusiness`, `FAQPage`, and `Service` schemas would improve rich snippet eligibility.
**Proposed fix:** Add JSON-LD to `app/layout.tsx` for Organization schema. Add `FAQPage` schema to the homepage (or a dedicated FAQ page). Add `Service` schema to `/services`.

---

### S-08 | MEDIUM | Homepage has no page-specific metadata

**File:** `app/page.tsx`
**Problem:** The homepage (`app/page.tsx`) exports no `metadata` object. It relies entirely on the root layout default. While the template pattern works, a homepage-specific description would be more targeted for search.
**Proposed fix:** Add explicit metadata export:
```ts
export const metadata: Metadata = {
  title: 'IGC | BD Infrastructure for Recruitment Agencies in South Africa',
  description: 'We build mandate acquisition systems for recruitment agencies. LinkedIn sequences, landing pages, automated follow-up. 5 client conversations guaranteed in 30 days.',
}
```

---

### S-09 | MEDIUM | No canonical URLs configured

**File:** `app/layout.tsx`
**Problem:** While `metadataBase` is set (line 37), no `alternates.canonical` is configured. This can cause duplicate content issues if the site is accessible via multiple URLs (www vs non-www, trailing slashes).
**Proposed fix:** Add canonical configuration either at the layout level or per-page.

---

### S-10 | LOW | Keywords meta tag is outdated

**File:** `app/layout.tsx:44`
**Problem:** Keywords list contains `'med-aesthetic marketing'` and `'patient acquisition'` -- old niche terms.
**Proposed fix:** Update to recruitment-relevant keywords (though `keywords` meta has minimal SEO value in 2026, it should at least be accurate).

---

### S-11 | LOW | Privacy Policy page referenced but may not exist

**File:** `components/ui/Footer.tsx:8`, `app/contact/page.tsx:101`
**Problem:** Footer links to `/privacy` and the contact form references "Privacy Policy" at `/privacy`. If this page does not exist, users hit a 404 and Google indexes a broken link.
**Proposed fix:** Verify `/privacy` page exists. If not, create it or update links.

---

## Performance

### P-01 | HIGH | Custom cursor runs infinite rAF loop on all pages

**File:** `components/ui/Cursor.tsx:58-69`
**Problem:** The cursor ring interpolation runs `requestAnimationFrame` in an infinite loop on every page load, including mobile. The `visible` state dependency in the useEffect means the effect re-runs when visibility changes, but the rAF loop itself never pauses. On mobile (touch-only devices), this is pure waste -- the cursor is invisible but the loop runs anyway.
**Proposed fix:** Gate the entire Cursor component behind a pointer device check:
```tsx
// In PublicShell.tsx
const [hasPointer, setHasPointer] = useState(false)
useEffect(() => {
  setHasPointer(window.matchMedia('(pointer: fine)').matches)
}, [])
// ...
{!isPortal && hasPointer && <Cursor />}
```
Or inside Cursor.tsx, don't start the rAF loop on touch-only devices.

---

### P-02 | MEDIUM | Four Google Fonts loaded (potentially unused Poppins)

**File:** `app/layout.tsx:7-34`
**Problem:** Four Google Font families are loaded: Playfair Display, Inter, DM Mono, and Poppins. Poppins is only used in `Logo.tsx` via an inline style `fontFamily: 'var(--font-poppins)'`. Loading an entire font family (400, 500 weights) for one component's text is expensive. Each font adds a network request and parse cost.
**Proposed fix:** Consider whether Poppins can be replaced with Inter (already loaded) for the logo text. If Poppins is essential for brand, reduce to a single weight (400). The `display: 'swap'` is already set, which is good.

---

### P-03 | MEDIUM | About page is unnecessarily a client component

**File:** `app/about/page.tsx:1`
**Problem:** The About page has `'use client'` at the top solely for Framer Motion `<motion.h1>` and `<motion.p>` entrance animations on the hero text (lines 27-44). The rest of the page is static content. This forces the entire page to hydrate on the client, including all the philosophy grid and CTA sections.
**Proposed fix:** Extract only the animated hero into a small client component (e.g., `AboutHeroAnimated.tsx`) and keep the page as a server component. This reduces JS shipped to the client.

---

### P-04 | MEDIUM | Grain overlay is fixed on every page with high z-index

**File:** `app/layout.tsx:69`, `app/globals.css:89-98`
**Problem:** The grain texture overlay is a `position: fixed` element at `z-index: 9999` covering the entire viewport on every page. It uses an SVG data URI with `feTurbulence` filter. While `pointer-events: none` is set, on some browsers this fixed overlay can cause paint invalidation on scroll because the browser must composite it on top of every frame.
**Proposed fix:** Consider using `will-change: transform` or `transform: translateZ(0)` on the grain div to promote it to its own compositor layer, reducing paint cost:
```tsx
<div className="grain" aria-hidden="true" style={{ willChange: 'transform' }} />
```

---

### P-05 | LOW | `useMagnetic` attaches window mousemove listener per button instance

**File:** `hooks/useMagnetic.ts:50`
**Problem:** Every primary `Button` component creates a `MagneticWrapper` that adds its own `window.addEventListener('mousemove', ...)`. On pages with many primary CTAs (homepage has ~6), this means 6 independent mousemove listeners each doing bounding rect calculations on every mouse movement.
**Proposed fix:** Consider a single global mousemove listener that dispatches to registered elements, or use `IntersectionObserver` to only activate the effect when the button is near the viewport.

---

### P-06 | LOW | `visible` in Cursor.tsx useEffect dependency causes rAF loop restart

**File:** `components/ui/Cursor.tsx:81`
**Problem:** The `useEffect` dependency array includes `[visible]`. When `visible` state changes, the entire effect tears down and re-creates, including all event listeners and the rAF loop. This causes a brief flicker and unnecessary GC pressure.
**Proposed fix:** Remove `visible` from the dependency array. The visibility state is already tracked via the `visible` state variable and applied via inline styles. The rAF loop and event listeners don't need to restart when visibility changes.

---

## Code Quality

### C-01 | HIGH | Invalid HTML: `<div>` nested inside `<p>` (multiple locations)

**File:** `components/sections/ComparisonSection.tsx:71-79`, `components/sections/SprintSection.tsx:110-116`, `components/sections/FAQSection.tsx:51-59`
**Problem:** Multiple sections wrap a `<div>` inside a `<motion.p>` tag. For example, ComparisonSection line 71:
```tsx
<motion.p variants={fadeUp}>
  <span className="gold-line mb-6 block" aria-hidden="true" />
  <div className="flex items-center gap-2 mb-4">  {/* INVALID: div inside p */}
```
This is invalid HTML per the spec (`<p>` cannot contain block-level elements). React will render it but browsers will auto-close the `<p>` before the `<div>`, creating unexpected DOM structure.
**Proposed fix:** Change `<motion.p>` to `<motion.div>` in all three locations.

---

### C-02 | MEDIUM | LinkedInIcon component duplicated in three files

**File:** `components/ui/Nav.tsx:16-27`, `components/ui/Footer.tsx:11-22`, `app/about/page.tsx:8-19`
**Problem:** The exact same `LinkedInIcon` SVG component is defined identically in three separate files. This violates DRY and means any update (e.g., fixing the aria attributes per A-12) must be made in three places.
**Proposed fix:** Extract to a shared component: `components/ui/icons/LinkedInIcon.tsx`. Import from there in all three files.

---

### C-03 | MEDIUM | Hardcoded color values throughout (no semantic token usage)

**File:** All component files
**Problem:** Despite defining semantic color tokens in `globals.css` (e.g., `--color-text-primary: #F2EDE4`, `--color-border: #2D2A27`, `--color-gold: #CF9B2E`), almost no component uses them. Every component hardcodes hex values like `text-[#F2EDE4]`, `border-[#2D2A27]`, `text-[#CF9B2E]`. This makes future theming changes require find-and-replace across dozens of files.
**Proposed fix:** Migrate to Tailwind theme token classes. Since `@theme` is used in globals.css, configure Tailwind to expose these as utilities (e.g., `text-text-primary`, `border-border`, `text-gold`). Migrate incrementally, starting with the most-used values.

---

### C-04 | MEDIUM | Inconsistent `section-label` pattern: sometimes `<p>`, sometimes `<span>`

**File:** Multiple sections
**Problem:** The `section-label` class is applied to different elements across sections:
- `ProblemSection.tsx:78`: `<p className="section-label">`
- `SprintSection.tsx:114`: `<span className="section-label">`
- `TestimonialSection.tsx:41`: `<span className="section-label mb-12 block">`
- `TrustSection.tsx:45`: `<p className="section-label">`

This inconsistency means screen readers announce these differently (block vs inline semantics).
**Proposed fix:** Standardize on a single element, either `<p>` or `<span>` (with `block` class). Recommend `<p>` since these are standalone text labels.

---

### C-05 | MEDIUM | `TestimonialSection` is imported nowhere

**File:** `components/sections/TestimonialSection.tsx`
**Problem:** The TestimonialSection component is defined but not imported or rendered anywhere in the app. `app/page.tsx` does not include it. This appears to be either dead code or a deployment oversight.
**Proposed fix:** If the testimonial is intended for the homepage, add it to `app/page.tsx` between an appropriate pair of sections. If it's intentionally excluded, delete the file to reduce confusion.

---

### C-06 | MEDIUM | Contact form "Clinic Name" is a niche mismatch (code quality + SEO overlap)

**File:** `app/contact/page.tsx:47-55`
**Problem:** The form field is labeled "Clinic Name" with placeholder "Clinic or practice name." The site targets recruitment agencies. This is a leftover from the previous niche and will confuse visitors.
**Proposed fix:** Change label to "Agency Name", placeholder to "Your recruitment agency name."

---

### C-07 | LOW | Magic numbers in Cursor.tsx and useMagnetic.ts

**File:** `components/ui/Cursor.tsx`, `hooks/useMagnetic.ts`
**Problem:** Multiple magic numbers: Cursor dot size (5), ring sizes (28/40), lerp factor (0.12), margins (-2.5, -14, -20). useMagnetic has `TRIGGER_ZONE = 60` and `MAX_DRIFT = 10` which are properly named, but the cursor values are not.
**Proposed fix:** Extract cursor dimensions into named constants at the top of the file:
```tsx
const DOT_SIZE = 5
const RING_SIZE = 28
const RING_SIZE_HOVER = 40
const LERP_SPEED = 0.12
```

---

### C-08 | LOW | Ease array spread creates new array on every render

**File:** `components/sections/HeroSection.tsx` (lines 80, 90, 104, etc.), `components/ui/Nav.tsx:98`
**Problem:** The pattern `ease: [...ease]` spreads the const `ease` tuple into a new array on every render. Since `ease` is a `const` tuple, this spread is unnecessary -- Framer Motion accepts readonly arrays.
**Proposed fix:** Use `ease` directly without spreading:
```tsx
transition={{ delay: 0.15, duration: 0.9, ease }}
```

---

### C-09 | LOW | `staggerFast` variant defined but never used

**File:** `lib/motion.ts:38-46`
**Problem:** The `staggerFast` variant is exported from `lib/motion.ts` but never imported anywhere in the codebase.
**Proposed fix:** Remove `staggerFast` or use it where faster stagger is intended.

---

### C-10 | LOW | Next.js `<Link>` not used for internal navigation in Footer and Nav mobile links

**File:** `components/ui/Footer.tsx:37-44`, `components/ui/Nav.tsx:42-50`
**Problem:** Footer navigation links and mobile NavLinks use plain `<a>` tags instead of Next.js `<Link>`. This causes full page reloads instead of client-side navigation, losing the SPA experience and any cached RSC payloads.
**Proposed fix:** Replace `<a href={...}>` with `<Link href={...}>` and import `Link` from `next/link`.

---

### C-11 | LOW | Netlify form in Contact page may not work on Vercel

**File:** `app/contact/page.tsx:28-29`
**Problem:** The form uses `data-netlify="true"` and `action="/thank-you/"` -- Netlify-specific form handling. If the site is deployed on Vercel (common for Next.js), this will not work. The form will POST to `/thank-you/` and likely 404.
**Proposed fix:** Clarify deployment target. If Vercel, replace with a server action, API route, or third-party form service. If Netlify, ensure the build process generates the necessary `_redirects` and form detection.

---

## Summary Table

| ID | Severity | Category | Short Description |
|----|----------|----------|-------------------|
| A-01 | HIGH | Accessibility | No skip-to-content link (WCAG 2.4.1 failure) |
| A-02 | HIGH | Accessibility | Metric strip hidden from screen readers via aria-hidden |
| A-03 | HIGH | Accessibility | ProblemSection expandable rows not keyboard accessible |
| A-04 | HIGH | Accessibility | Step cards have cursor-pointer but no interactive role |
| S-01 | HIGH | SEO | Root metadata describes wrong business niche (med-aesthetic) |
| S-02 | HIGH | SEO | OpenGraph tags reference wrong niche |
| S-03 | HIGH | SEO | Twitter card metadata references wrong niche |
| S-04 | HIGH | SEO | About page copy references clinics, not recruitment |
| S-05 | HIGH | SEO | Results page copy references clinics and wrong metrics |
| S-06 | HIGH | SEO | Contact form label says "Clinic Name" |
| P-01 | HIGH | Performance | Cursor rAF loop runs on mobile (touch-only) devices |
| C-01 | HIGH | Code Quality | Invalid HTML: div nested inside p in 3 sections |
| A-05 | MEDIUM | Accessibility | TestimonialSection not rendered on homepage |
| A-06 | MEDIUM | Accessibility | Mobile nav links lack focus-visible styles |
| A-07 | MEDIUM | Accessibility | Custom cursor hides native cursor for all users |
| A-08 | MEDIUM | Accessibility | CountUp has no reduced-motion fallback |
| A-09 | MEDIUM | Accessibility | useMagnetic has no reduced-motion guard |
| A-10 | MEDIUM | Accessibility | Contact form lacks visible error states |
| A-11 | MEDIUM | Accessibility | CalEmbed has no accessible fallback |
| S-07 | MEDIUM | SEO | No structured data (JSON-LD) on any page |
| S-08 | MEDIUM | SEO | Homepage has no page-specific metadata |
| S-09 | MEDIUM | SEO | No canonical URLs configured |
| P-02 | MEDIUM | Performance | Four Google Fonts loaded (Poppins likely unnecessary) |
| P-03 | MEDIUM | Performance | About page unnecessarily a client component |
| P-04 | MEDIUM | Performance | Grain overlay may cause paint invalidation |
| C-02 | MEDIUM | Code Quality | LinkedInIcon duplicated in 3 files |
| C-03 | MEDIUM | Code Quality | Hardcoded hex colors instead of semantic tokens |
| C-04 | MEDIUM | Code Quality | Inconsistent section-label element type |
| C-05 | MEDIUM | Code Quality | TestimonialSection defined but never rendered |
| C-06 | MEDIUM | Code Quality | Contact form "Clinic Name" niche mismatch |
| A-12 | LOW | Accessibility | Redundant aria-label on LinkedInIcon SVG inside labeled links |
| A-13 | LOW | Accessibility | #857F74 on #080808 fails WCAG AA at small text sizes |
| A-14 | LOW | Accessibility | smooth scroll without reduced-motion guard |
| S-10 | LOW | SEO | Keywords meta tag contains old niche terms |
| S-11 | LOW | SEO | /privacy page may not exist |
| P-05 | LOW | Performance | Multiple mousemove listeners from useMagnetic instances |
| P-06 | LOW | Performance | Cursor useEffect restarts rAF on visibility change |
| C-07 | LOW | Code Quality | Magic numbers in Cursor.tsx |
| C-08 | LOW | Code Quality | Unnecessary ease array spread on every render |
| C-09 | LOW | Code Quality | staggerFast variant defined but never used |
| C-10 | LOW | Code Quality | Plain `<a>` tags instead of Next.js Link in Footer/Nav |
| C-11 | LOW | Code Quality | Netlify form may not work on Vercel deployment |

**Totals:** 12 HIGH, 18 MEDIUM, 11 LOW = 41 findings

### Priority Recommendations

**Immediate (before launch):**
1. Fix S-01/S-02/S-03/S-04/S-05/S-06: Update all metadata and page copy from med-aesthetic to recruitment agency niche. This is the single highest-impact change.
2. Fix A-01: Add skip link (5 minutes of work, Level A compliance).
3. Fix A-02: Remove aria-hidden from metric strip.
4. Fix A-03: Make ProblemSection rows keyboard accessible.
5. Fix C-01: Change `motion.p` to `motion.div` where divs are nested inside.

**Next sprint:**
6. Fix P-01: Gate cursor on pointer device.
7. Fix A-07/A-08/A-09: Reduced motion guards for non-Framer animations.
8. Fix S-07: Add JSON-LD structured data.
9. Fix C-02/C-03: Consolidate LinkedInIcon and begin semantic token migration.
10. Fix C-05: Either render TestimonialSection or remove it.
