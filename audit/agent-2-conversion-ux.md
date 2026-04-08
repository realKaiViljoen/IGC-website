# Agent 2: Conversion & UX Audit
**IGC Website — Full Conversion Architecture Review**
*Audited: April 2026*

---

## Executive Summary

The site has strong bones. The design system is genuinely premium — the Playfair/Inter pairing, warm-dark palette, and constrained gold usage are all correct decisions that most agency sites get wrong. The motion design shows craft.

But there is a structural conversion problem: **the homepage is currently optimised for education, not commitment.** A clinic owner who lands on it gets oriented — they understand what IGC does — but they are not compelled to act. The section sequence narrates before it persuades. The trust signals are present but built for a peer audience (marketers, operators, LinkedIn connections), not the actual buyer (a clinic owner who is exhausted by bad agencies and does not know who IGC is).

The single most important thing to fix: **the Results page is a live liability**. It is the second or third page any skeptical buyer will click, and it currently serves as evidence that IGC has not done anything yet. That needs to be reframed immediately before launch.

The second most important thing: **the hero CTA priority is inverted.** "See the Sprint" is the primary gold CTA. "Book a Call" is ghost. This is wrong — the sprint page is orientation content; a call is the conversion event.

Everything else is optimization. These two are close-the-door issues.

---

## Conversion Architecture Analysis

### Homepage Flow Assessment

**Sections in order:**
1. HeroSection — establishes positioning, dual CTAs
2. HowItWorksSection — explains the three-phase process
3. SprintSection — states the offer with stats
4. TrustSection — provides credibility points

**The problem with this sequence:** it follows a product-logic order, not a buyer-psychology order. The structure is: *Here is what we do → Here is how we do it → Here is what it costs → Here is why trust us.*

High-intent B2B buyers (clinic owners who are actively searching for a growth solution) do not need this much warm-up before they are asked to act. They need to understand the category, believe the outcome is real, believe the operator can deliver, and be asked to book. The current sequence delays the trust question until the last section — by which time many buyers have already decided.

**The correct psychological order for a cold B2B buyer:**
1. What you do + why it is different (Hero)
2. Why this works / what outcome looks like (proof — move TrustSection or add a proof section here)
3. How the process works (HowItWorks — validation, not entry point)
4. The specific offer (Sprint)
5. Final CTA / friction reduction

Right now, TrustSection is the anchor — but it's at the bottom when it should be second.

**Verdict:** The homepage needs TrustSection moved to position 2, between Hero and HowItWorks. The section sequence should be: Hero → Why this works (trust/proof) → How it works → The offer → CTA.

---

### Primary CTA Recommendation

**Current state:** "See the Sprint" is primary (gold). "Book a Call" is ghost (dim-white).

**This is the wrong hierarchy. Book a Call should be primary.**

The argument for the current arrangement is: clinic owners need to understand the offer before they book. "See the Sprint" warms them up. This is a product thinking argument, not a conversion argument.

The conversion argument: **"Book a Call" is the revenue event.** Everything on the site should point to it. A clinic owner who clicks "See the Sprint" goes to a page with more copy — good — but they have deferred the commitment. A clinic owner who clicks "Book a Call" is at the point of maximum purchase intent. You should reward that intent immediately.

"See the Sprint" belongs as a ghost secondary CTA — or even better, as a tertiary link below the CTAs. The structure should be:

```
Primary (gold):    Book a Call →
Secondary (ghost): See how it works
Tertiary (text):   4 active deployments · Q2 2026 cohort
```

The badge/social proof line below the CTAs ("Active deployments: 4 med-aesthetic clinics") is doing more heavy lifting than the ghost CTA. Move it up to sit directly below the primary CTA, not below the CTA row.

**One note on "Book a Call" copy specifically:** clinic owners have been burned by sales calls. The meta-description text already does the reframe well: "Not a sales call. A 20-minute diagnostic." This reframe needs to appear next to the CTA, not only on the contact page. Add a one-line rider under the primary hero CTA: *"20-minute diagnostic, not a sales pitch."* This removes the objection at the moment of click, not after.

---

### Section Audit (Keep / Cut / Add)

**HeroSection — KEEP, modify CTA hierarchy**
Strong. The metric cards on the right side (23 consultations this month, <3min WhatsApp response, 4.9 review score) are the best trust move on the entire site. They show an operating system in motion. The problem: these cards are `aria-hidden="true"` — they are visual decoration only, not screened. For buyers on mobile they disappear entirely. Consider a text equivalent below the fold on mobile.

The "4 active deployments · Q2 2026 cohort" badge is conceptually right (scarcity + social proof) but the execution is too passive. The dot indicator is near-invisible at `#4A4640`. If you want this to function as a scarcity signal, it needs a pulse animation — a subtle green or amber pulse dot — and the text needs to signal movement: "Q2 2026 cohort · 2 slots remaining" beats "4 active deployments."

**HowItWorksSection — KEEP, move to position 3**
The three-phase structure (Diagnose / Deploy / Operate) is clean and credible. The gold left-border hover reveal is a nice interaction. The issue: it is currently in position 2, making it the first thing a buyer reads after the hero. This is a process explanation — it belongs after proof, not before it. Move to position 3 (after trust section).

**SprintSection — KEEP, reorder stats**
The countup animation on stats is a differentiator — most agency sites use static numbers. The stats themselves are good but in the wrong order. Current order: 15+ consultations / 90 days / R15,000. This order answers: *how many, how long, how much.* The buyer's psychological order is: *how much, how long, how many* — price anchoring before time investment before outcome. Lead with R15,000 to own the price framing. Then 90 days. Then 15+.

Leading with the outcome (15+) feels like it is burying the price — which makes the R15,000 feel like a surprise when they scroll. It is not a high price for this service, but if a buyer mentally calculates value before they see the price, you lose control of the framing. Show the price first, then justify it with the timeline and the output.

The sub-CTA below the stats is "See the Sprint" (a light variant button). This is redundant with the services page — the SprintSection IS the sprint summary. This CTA should be "Book a Discovery Call" pointing to `/contact`.

**TrustSection — KEEP, move to position 2**
The three proof points (Built in SA / LinkedIn-verified / Small team) are directionally right but none of them are strong enough to move a skeptical clinic owner. See Trust Signal Audit below for full breakdown.

**MISSING: A testimonial/quote section — ADD before launch**
Even one real voice from a current client — even a minimal quote — outperforms all three TrustSection points combined. See Trust Signal Audit for the no-case-study strategy.

**MISSING: A final homepage CTA block — ADD**
The homepage ends with TrustSection. There is no terminal CTA — no final invitation to book before the footer. Every high-converting service page ends with a dedicated CTA section (Superhuman's "Request access" close, Linear's "Get started free" rail). Add a closing section: the headline (e.g., *"Your Q2 2026 slot is available."*) with a single primary CTA and the 20-minute framing line.

---

## Trust Signal Audit

### What Is Working

**The hero metric cards** (New Consultations: 23 this month, Avg Response Time: <3min WhatsApp, Review Score: 4.9 / 47 reviews) are the most effective trust signal on the site. They look like a live dashboard. They do not say "we are good" — they show system output. This is the "proof of product" pattern that Resend and Linear use. It is correct and should be doubled down on.

**The "Built in SA, for SA" point** is underrated. For a clinic owner who has been sold offshore templates before, this is a real differentiator. It is currently buried as TrustSection point 1. It deserves more surface area.

**The "No lock-in" framing** across Services and About is strong. It removes the main objection clinic owners have to engagement (being trapped in a retainer). It appears in the right places.

**The tone of the Results page disclaimer** ("We do not publish metrics we cannot verify. When we do publish, it will be specific, documented, and attributable — not marketing copy dressed as proof.") is actually a trust signal. It reads as integrity. However, it is not doing enough work on its own — see Critical Gaps.

---

### Critical Gaps

**1. The Results page is the site's biggest conversion liability.**

"Case studies loading" is not a neutral holding pattern. It is a trust-negative signal to any clinic owner doing due diligence. It does not say "we are rigorous." It says "we are new and have nothing to show." The framing around it (the integrity language about verification standards) is well-written but insufficient.

What premium services do when they have no public case studies:
- **Superhuman:** They used a founding member waitlist narrative — the exclusivity of "you haven't seen results because we haven't let everyone in yet" reframes absence as selectivity.
- **Stripe's early days:** Led with the technical integrity of what they built (the developer docs, the API quality) as the proof, not customer logos.
- **Boutique agencies (Huge/Instrument):** Show the methodology as the case study. Make the process so credible that the output feels inevitable.

For IGC at launch, the right strategy is: **replace the Results page with a "How We Measure" page** or rename and reframe the section entirely. Content should include:
- The verification standard itself (what does IGC publish, and why) — this is currently a single paragraph but could be a 3-step framework presented visually
- The metrics that matter: new consultations/month, cost per consultation, review score, WhatsApp response rate — define the scorecard
- A "Cohort 1 in progress" section with a projected publish date: *"First cohort results scheduled for publication: Q3 2026"*
- Optionally: a mini case study of the Diagnose phase — describe a real scenario (anonymised) of what you found and what you prescribed without revealing client identity or revenue numbers

This approach mirrors what Linear did on launch — they showed the depth of thought behind the product (the issue tracker philosophy, the "why we built this" essays) before they had a user base. The depth of craft became the proof.

**2. "LinkedIn-verified operator" does not land with a clinic owner.**

This phrase was written for someone who understands what "LinkedIn-verified" signals in a B2B context. A clinic owner does not. To them, everyone has a LinkedIn profile. The point being made (that K.C. Viljoen is a real, traceable human with a verifiable track record, not an offshore ghost agency) is valid — but the framing is wrong.

Reframe to: *"A named principal, not an anonymous agency."* Then, under K.C. Viljoen's name, add two or three concrete prior credentials (e.g., number of ventures, categories, specific capabilities — whatever is verifiable and relevant). The About page's "documented track record across multiple ventures" is exactly as vague as it sounds. What ventures? What kind of track record? The clinic owner can not evaluate this.

If there is any specific, verifiable prior work in adjacent sectors (e-commerce DTC, any health/wellness category, any SA brand they would recognise), that belongs here. Even one concrete anchor point ("Previously built acquisition infrastructure for [category] businesses reaching [X] monthly volume") moves the credibility needle more than "documented track record."

**3. There are zero external validation signals.**

No press mentions, no industry recognition, no partnerships, no tool certifications (Meta Business Partner, Google Partner), no professional associations. For a brand with no published case studies, third-party signals matter disproportionately. Even a Meta Business Partner badge is a checkmark that says "this is a real operator with formal platform access." If IGC has these, add them. If not, prioritise getting them.

**4. Pricing context is absent.**

R15,000/month is presented as a standalone number with no anchoring. Clinic owners will compare this to: their current agency (probably cheaper), their own staff cost (probably similar), and their revenue potential per new consultation (probably much higher). The number needs to be contextualised with a value frame: if average consultation value is R3,000-R6,000, and the system generates 15+ per month, the ROI is obvious — but the site never makes this calculation visible. Add it.

A simple 2-line value frame beneath the R15,000 stat: *"At an average consultation value of R3,500, 15 new consultations = R52,500 new revenue per month."* This is not manipulation — it is helping the buyer do math they will do anyway, and doing it correctly.

**5. The "4 active deployments" scarcity signal is too passive.**

The badge exists, but it is formatted identically to an informational label. Compare to how Superhuman handled their founding member waitlist: every element of the UX communicated exclusivity and forward motion. The IGC badge uses the same dim tertiary colour (`#4A4640`) as a date stamp. If this is meant to create urgency, it needs to be treated like urgency — slightly more prominent colour (not gold — reserve gold — but maybe `#857F74`), pulse indicator, and language that implies forward movement: *"2 of 6 Q2 slots filled"* is better than *"4 active deployments."*

---

### Specific Trust Elements to Add (with benchmark references)

**Platform certifications:** Meta Business Partner badge, Google Partner badge. These appear in the nav or footer. Costs nothing to earn but adds institutional credibility. Reference: any performance marketing agency that targets SME clients.

**Process transparency section:** Modelled on Linear's "How we think about X" blog posts. A single page called "How We Measure Results" documenting the verification standard. This becomes the credibility anchor when you have no published case studies. Clinic owners want to know that the operator has rigour — this demonstrates it without requiring client logos.

**Photo of the principal:** The About page has K.C. Viljoen's name, title, and a LinkedIn link. There is no photo. For a high-trust, high-ticket service, a real photo of the operator is a significant trust signal. This is not optional. Service businesses sell relationships. A name without a face is corporate, not personal. Even a clean editorial portrait (no suit required — this is a warm-dark premium operator, not a management consultant) should appear on the About page.

**Client sector specificity:** The site says "med-aesthetic clinics" throughout but never describes what kind — solo practitioners, multi-location groups, aestheticians vs. doctors vs. dentists, Gauteng vs. Cape Town vs. national. Specificity signals expertise. "We work with solo-practitioner med-aesthetic clinics doing between 40-120 consultations per month" is more credible than a generic sector claim, because it shows selectivity and domain knowledge.

**WhatsApp as a contact option:** This market (South African clinic owners) conducts significant business over WhatsApp. A direct WhatsApp CTA — not replacing the form, but alongside it — signals that IGC understands the local context. It is also a psychological bridge: lower-friction than a form, higher-intent than just reading the page.

---

## CTA System Review

### Button Copy Recommendations

**"See the Sprint" (currently primary hero CTA):**
This copy has a clarity problem. "Sprint" is an internal naming convention. A cold clinic owner does not know what a Sprint is. The button asks them to "see" something — a passive action. Compare to: "See how it works" (clearer), "View the offer" (direct), or "Understand the system" (positioning-aware). If the sprint framing is kept (which it should be — it is a differentiating concept), the copy should establish context: "How the Sprint works →" is clearer than "See the Sprint →".

However, since this CTA is being demoted to secondary/ghost, the exact copy matters less. "How it works" is fine for ghost secondary.

**"Book a Call" (currently ghost secondary, should become primary):**
Strong directional copy. The objection (it sounds like a sales call) is resolved by the adjacent text that should appear below it. One micro-copy improvement: "Book Your Diagnostic →" is marginally stronger than "Book a Call →" because "diagnostic" encodes the value proposition (they will learn something) rather than just describing the action.

**"Send Message" (contact form submit):**
This is the weakest CTA copy on the site. "Send Message" describes the mechanical action, not the outcome. Compare to: "Request Your Diagnostic", "Submit & We'll Be In Touch", "Book My Spot". For a form that is positioned as a discovery intake, the submit copy should match the downstream action: "Request Your 20-Minute Diagnostic" or simply "Submit Request".

**"Ready to build the engine?" (services page CTA intro copy):**
Weak setup line. "Ready to" constructions are soft commitment framing — they put the decision on the user with no energy behind it. Replace with a statement: "Your Q2 slot is available." or "The next cohort opens [month]." Scarcity + forward motion beats a rhetorical question.

**"Want to see how the system works?" (about page CTA):**
Same issue. Reframe: "Next step: see the full Sprint architecture." Action-oriented, not question-oriented.

---

### Placement Issues

**Contact page form submit button:** The submit button is rendered with an inline style override (`style={{ background: '#C9922A', color: '#080808' }}`). This bypasses the design system and the Button component entirely. It will not have the magnetic effect. It should use the Button component with `variant="primary"`. This is both a consistency issue and a missed micro-interaction opportunity at the moment of highest commitment.

**SprintSection CTA:** The "See the Sprint" button in SprintSection uses `variant="light"` — a dim-white filled button. This is the third distinct button style on the homepage (gold ghost in hero, dim-white ghost in hero, now a light solid on Sprint). The proliferation of button styles dilutes hierarchy. The SprintSection CTA should be the gold primary pointing to `/contact`, not a secondary pointing to `/services` (which is redundant — they are already reading the sprint summary).

**TrustSection:** No CTA at all. This is a structural gap. Every section that builds trust should end with an invitation to act. After establishing why IGC is credible, there should be a terminal CTA — even a tertiary text link: "Enough context? Book a 20-minute call →"

**Nav CTA:** The nav has a "Book a Call" primary button in the top right — this is correct. However, the nav link order is: Services / About / Results / Contact. The CTA duplicates Contact. This is intentional redundancy and is correct. No change needed here.

---

### Hierarchy Violations

**Violation 1:** In HowItWorksSection, the step numbers (`01`, `02`, `03`) are rendered in gold (`text-gold`). According to the design system's Gold Rule, gold marks action or achievement — not informational labels. These should be `text-tertiary` (`#4A4640`) or at most `text-secondary`. The current implementation uses gold as a decorative numbering system, which contradicts "Gold signals: this is the most important thing on the screen."

**Violation 2:** On the Services page hero, the section label "The Entry Point" uses `text-gold` (`font-mono text-[11px] tracking-[0.15em] uppercase text-gold`). DESIGN.md explicitly states: "Section labels use `text-tertiary` — NOT gold." This is a gold rule violation. Change to `text-[#4A4640]`.

**Violation 3:** The Services page lists component numbers (`01` through `05`) in gold via inline `text-gold`. Same violation as above — informational sequence labels should not use gold. Use `text-tertiary`.

**Violation 4:** The contact form submit button uses a hardcoded inline style instead of the design system Button component. The magnetic effect (useMagnetic hook) will not apply. At the point of maximum intent — the submit action — the primary CTA loses its premium interaction.

**Correct primary usage** (hero CTAs, nav CTA, services page final CTA, results page CTA) is right. The violations are all in informational contexts where gold drifted in as a "make it look premium" decision rather than a "mark the most important action" decision.

---

## Contact Page Audit

### Form Fields Assessment

**Fields present:** Name / Clinic Name / Email / Phone / Challenge (textarea)

**Assessment:** The field set is appropriate for a high-ticket B2B discovery intake. It is not too long (5 fields is the upper limit before friction kills completion). The fields are in the right order. No changes needed to the field set itself.

**One addition that would meaningfully improve call quality:** A single-select qualification field: *"How many new patient consultations does your clinic book per month?"* with options: Under 20 / 20-50 / 50-100 / Over 100. This serves two purposes: it pre-qualifies the lead (IGC presumably has a minimum viable client profile), and it gives K.C. Viljoen context before the call that makes the "diagnostic" framing credible. The form currently asks "what is your biggest challenge" but does not collect any baseline performance data.

**Label style:** Labels use `section-label` class (DM Mono, `#4A4640`, 0.16em tracking, uppercase). This is visually consistent with the design system. However, the font size and colour of the labels are at the minimum threshold of legibility for a form context. Consider bumping to `text-[#857F74]` for labels — still muted, but more functional as an input label.

**Placeholder text:** The challenge textarea placeholder reads "Be specific — it helps us prepare." This is good. It sets expectation and signals the operator cares about preparation. Keep it.

### Framing Assessment

**"Not a sales call. A 20-minute diagnostic."**

This is the single strongest line on the contact page and possibly the entire site. It reframes the entire act of booking — from a dreaded sales process to a useful audit. This framing should be working much harder:

1. It should appear on the hero CTA row, not only on the contact page. A clinic owner deciding whether to click "Book a Call" needs this reassurance at the point of decision, not after.
2. It should be expanded slightly into a 2-3 sentence paragraph: what specifically happens in those 20 minutes, what they will know by the end of the call that they do not know now. "We look at your current acquisition setup and tell you honestly whether we can move the needle" is a start — but specificity wins: "We will tell you which part of your funnel is leaking the most patients, and whether the Sprint is the right fix."

### Calendly Placeholder

**"Calendly booking link coming — direct calendar access will be available here shortly."**

This section should not exist at launch. It is unfinished work made visible. Two options:

**Option A (preferred):** Remove the section entirely. The Netlify form is the primary mechanism. Add a line under the form: *"After submitting, expect a reply within one business day to confirm your diagnostic time."* This sets expectation without the placeholder liability.

**Option B:** If direct booking is genuinely important to conversion (clinic owners are busy, synchronous friction kills follow-through), prioritise getting Calendly connected before launch. The diagnostic framing works extremely well with a direct calendar embed — it turns "contact us" into "choose your time" which is a significant friction reduction. On balance, a live Calendly embed outperforms the form for high-intent buyers. If the form is kept as a qualification step and Calendly is used for confirmed bookings, make that sequence explicit.

---

## Navigation Audit

### Current Order
Services / About / Results / Contact (with "Book a Call" CTA button)

### Assessment

**Services before About is correct.** New visitors want to understand the offer before they understand the operator. This is product-first navigation.

**Results in position 3 is problematic.** It is the third item in the primary nav — high prominence — but currently surfaces the "case studies loading" page. For a visitor doing due diligence, clicking Results is a natural high-trust action. The page they land on signals new business / no history. This will hurt conversion until results are published. Options: (a) remove Results from the nav temporarily and add it back when populated, (b) rename it "Approach" and redirect to a methodology page, (c) reframe as described in the Trust Signal Audit above.

**Contact being in the nav alongside the "Book a Call" CTA creates a confusing dual signal.** The nav CTA says "Book a Call" (good, direct). The nav link says "Contact" (generic, passive). They both go to the same page. Consider renaming the nav link to "Book a Call" to match the CTA, or removing the nav link entirely and relying on the CTA button. The button is primary — the link just adds noise.

### Missing Pages

**FAQ / Common Questions page:** Clinic owners making a high-trust, first engagement decision have specific questions: What happens if results don't come in 90 days? What does "no lock-in" actually mean contractually? Is this only for Gauteng clinics? What platforms do you use? How quickly can we start? These objections exist whether or not the site addresses them — but if a visitor leaves to google these questions, you've lost the session. A short FAQ section (even as a section on the Services page, not a separate page) would materially reduce abandonment from informed buyers.

**Process / Methodology page (replace or supplement Results):** See Trust Signal Audit. This is the highest-leverage page addition for pre-case-study launch state.

---

## Top 5 Implementation Picks (Ranked by Conversion Impact)

### 1. Swap Hero CTA Hierarchy — Primary to "Book a Call", Secondary to "How it works"

**Impact:** High. This is the primary revenue action. Every session currently has the buy button as the secondary action.
**Effort:** Minimal. One prop change in HeroSection.tsx: `variant="primary"` on `/contact` href, `variant="ghost"` on `/services` href.
**Also add:** Below the primary CTA, one line of micro-copy: *"20-minute diagnostic, not a sales pitch."*

### 2. Reframe the Results Page

**Impact:** High. Currently a trust-negative page in a high-visibility nav slot.
**Effort:** Medium. New content strategy, not just copy changes.
**Action:** Rename to "Approach" in the nav. Rename page to "How We Measure". Populate with: (a) the metrics scorecard (what IGC tracks and why), (b) the verification standard explained as a 3-step visual, (c) "Cohort 1 in progress — results published Q3 2026" with a CTA to get notified.

### 3. Add Photo + Specific Credentials to About Page

**Impact:** High. A named-but-faceless operator on a high-ticket service site is a trust gap.
**Effort:** Low (editorial photo + copy edit).
**Action:** Add a portrait photo of K.C. Viljoen above the LinkedIn link. Replace "documented track record across multiple ventures" with 2-3 specific, verifiable credential anchors (sector, scale, relevant prior work).

### 4. Move TrustSection to Homepage Position 2

**Impact:** Medium-High. Trust evidence before process explanation accelerates the buyer's decision to continue scrolling.
**Effort:** Minimal. Reorder in `app/page.tsx`. New order: `<HeroSection /> <TrustSection /> <HowItWorksSection /> <SprintSection />`.
**Also:** Add a terminal CTA section at the bottom of the homepage pointing to `/contact`.

### 5. Add Value Frame to R15,000 Stat

**Impact:** Medium. Removes the price-shock risk and pre-empts the objection without the buyer having to ask.
**Effort:** Minimal. Add 2 lines of copy beneath the R15,000 stat in both SprintSection and the Services page:
*"At R3,500 avg consultation value, 15 new consults = R52,500 new monthly revenue."*

---

## If I Were Building This From Scratch

*Unconstrained architecture for a premium SA med-aesthetic growth operator at zero case studies, high ambition, and one real operator behind the brand.*

**The fundamental insight this site is missing:** The scarcest resource in this market is a credible operator who will tell a clinic owner the truth about their acquisition problem before asking for money. That is what IGC is — but the site is structured like an agency brochure, not like a diagnostic offer.

The ideal conversion architecture for this specific service, at this specific stage, would be:

---

**Page 1: Homepage**

Hero: Same positioning as now ("We build acquisition engines") but with one critical addition — a real photograph or identity signal of the person behind it. Not a profile picture. An editorial portrait that says "this is a serious operator, not an offshore template shop."

Below hero: A single, specific question addressed directly to the visitor: *"Is your clinic booking fewer than 20 new consultations per month from digital channels?"* This is qualification + relevance signal in one line. If the answer is yes, keep reading. If no, this is probably not for you (which is itself a trust signal — selective positioning).

Then: A single case narrative (even anonymised, even internal) of the Diagnose phase. "We audited a solo-practitioner aesthetic clinic in Sandton. Their Meta ads were spending R12,000/month. Their landing page was their website homepage. 94% of their ad spend was going to waste. Three weeks later, their cost per consultation booking dropped from R1,800 to R340." No client name needed. Specific numbers. Real scenario.

This replaces TrustSection, HowItWorksSection, and half of SprintSection with a single, concrete story. Stories outperform feature lists every time in B2B conversion.

**The offer:** Presented as an intake question, not a pitch. "Does this sound familiar? Book a 20-minute diagnostic. No commitment. We look at your funnel and tell you exactly where the leakage is. Free. Then we talk about whether we are the right solution." 

This is the Superhuman "request access" pattern applied to a service context. The diagnostic session is the product sample. The Sprint is the upsell. This structure removes the sales resistance entirely because the visitor is not being asked to commit to R15,000 — they are being asked to spend 20 minutes learning something useful about their own business.

**Navigation:** Four items maximum. The Sprint / The Diagnostic / About / Results. No "Contact" link — "Book a Diagnostic" is the only conversion action, and it is in the nav CTA slot.

**Results page:** Initially: "Our Measurement Standard" — the scorecard, the verification process, the cohort timeline. First real case study published at 90 days. The page's heading: "We only publish what we can prove." Same integrity framing as current, but built into a complete page architecture rather than a placeholder apology.

**About page:** Shorter. Stronger. A photo. Two paragraphs: who K.C. Viljoen is and what gives him the right to tell clinic owners how to acquire patients. One specific, verifiable prior credential. Then the LinkedIn link.

**Footer:** WhatsApp button. Verified by: Meta Business Partner + Google Partner badges if earned. "Ingenuity Industries South Africa" as the legal entity. One line: "Operating since [year]."

The ideal conversion rate for this service at this price point, with this positioning, in this market, would be approximately 2-4% of homepage visitors booking a diagnostic call — and 15-25% of diagnostic calls converting to a Sprint engagement. The current architecture is probably generating 0.5-1% on homepage to contact, and the Results page issue means a non-trivial percentage of visitors are bouncing off the site's highest-intent secondary page.

Fix the CTA hierarchy, fix the Results page, add the value frame, add a real photo, and this site will function. The rest is optimisation.

---

*Audit complete. All findings are anchored to: a clinic owner who has never heard of IGC reads this and decides whether to book a call.*
