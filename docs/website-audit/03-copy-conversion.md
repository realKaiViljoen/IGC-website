# Copy, Conversion & Narrative Architecture Audit

**Date:** 2026-04-10
**Scope:** All homepage sections, diagnostic page, secondary pages (services, about, results, contact, thank-you), nav, footer
**Auditor perspective:** B2B copywriter + conversion rate optimization + sales psychology

---

## Findings

### CC-01 | HIGH | Testimonial is from a med-aesthetics clinic, not a recruitment agency

**File:** `components/sections/TestimonialSection.tsx` lines 9-17

**Problem:** The single testimonial is from "Dr. A.M., Medical Aesthetics, Sandton" and discusses Facebook ads, WhatsApp sequences, review generation, and consultations. The entire website is positioned for recruitment agencies selling BD pipeline services for mandates. This testimonial:
- Is from a completely different industry (med-aesthetics, not recruitment)
- Discusses irrelevant tactics (Facebook ads, WhatsApp, review generation) rather than LinkedIn outreach and mandate acquisition
- Uses wrong outcome metrics ("22 confirmed consultations" vs. client conversations / mandates)
- Will immediately trigger skepticism in a recruitment agency owner: "They have never done this for a recruiter"

This is the single most damaging conversion issue on the site. A skeptical B2B buyer sees one piece of social proof, and it proves you serve a different market.

**Proposed fix:** Replace with a recruitment-specific testimonial. If no recruitment client testimonial exists yet (likely given Cohort 1 is still in progress per the results page), either:
1. Remove the testimonial section entirely until Q3 2026 when verified case studies are ready (honest, matches the Results page messaging)
2. Replace with a "What our first cohort is building" section showing anonymized pipeline metrics from active recruitment builds without fabricating a quote
3. If a real recruitment client can provide even a short quote, use that

---

### CC-02 | HIGH | About page still references med-aesthetic clinics

**File:** `app/about/page.tsx` lines 63-65

**Problem:** The founder bio says: "IGC is that capability, applied specifically to med-aesthetic clinics. If your clinic is booking fewer consultations than it should be, this is where to start." This directly contradicts the entire homepage positioning. A recruitment agency owner who clicks "About" will immediately bounce.

**Proposed fix:**
```
IGC is that capability, applied specifically to independent recruitment agencies. If your agency is winning fewer mandates than it should be, this is where to start.
```

---

### CC-03 | HIGH | About page CTA says "See the Sprint" but services page never uses the word "Sprint"

**File:** `app/about/page.tsx` lines 113-118

**Problem:** The CTA text says "Next step: see the full Sprint" and the button reads "See the Sprint." But `/services` calls it "The 30-Day BD Infrastructure Build" throughout. The SprintSection on the homepage also calls it "The BD Build." "Sprint" is orphaned jargon that will confuse users. Inconsistent naming erodes trust.

**Proposed fix:**
```
Next step: see the full BD Build.
[See the Build →]
```

---

### CC-04 | HIGH | Results page references clinics, consultations, WhatsApp -- wrong vertical

**File:** `app/results/page.tsx` lines 12-28, 80, 98

**Problem:** The Results page metrics scorecard tracks "New consultations booked," "Cost per consultation," "WhatsApp response time," and "Review score delta." These are med-aesthetics clinic metrics. The page also references "4 clinics actively running the system" and asks "whether your clinic is a fit for the Sprint."

A recruitment agency owner measures mandates won, client conversations booked, placement fees, time-to-fill. WhatsApp response time and Google review scores are irrelevant.

**Proposed fix:** Replace metrics with recruitment-relevant ones:
- "New client conversations booked" (already used on the homepage)
- "Connection-to-conversation rate" (LinkedIn outreach metric)
- "Average response time to inbound" (from booking system)
- "Pipeline-to-mandate conversion" (the metric that matters)

Replace "4 clinics" with "4 agencies." Replace "whether your clinic is a fit" with "whether your agency is a fit." Replace "Book a Diagnostic" with "Book a BD Audit" for consistency.

---

### CC-05 | HIGH | Contact page form asks for "Clinic Name" -- wrong vertical

**File:** `app/contact/page.tsx` lines 48-56

**Problem:** The form label says "Clinic Name" and the placeholder says "Clinic or practice name." This immediately signals the wrong market and will confuse or repel recruitment agency buyers.

**Proposed fix:**
- Label: `Agency Name`
- Placeholder: `Your recruitment agency name`

---

### CC-06 | HIGH | Contact page metadata references "Diagnostic" while homepage uses "BD Audit" -- CTA fragmentation

**File:** `app/contact/page.tsx` lines 5-9, 18-19, 96-97

**Problem:** The contact page title is "Book a Call: 20-Minute Diagnostic," the h1 says "Book Your Diagnostic," and the submit button says "Request Your Diagnostic." Meanwhile the homepage, comparison section, how-it-works section, sprint section, trust section, and closing CTA all use "Book a BD Audit." The diagnostic page itself mixes "BD Audit" in its URL path (`/diagnostic`) and heading ("Book your mandate pipeline audit") with the page title saying "BD Audit."

Having two names for the same call ("BD Audit" vs. "Diagnostic") fractures the user's mental model. They are not sure if these are the same thing.

**Proposed fix:** Standardize on "BD Audit" everywhere. It is more specific, more descriptive, and already dominant across the site. Update:
- Contact page title: "Contact IGC"
- Contact h1: "Book Your BD Audit" or "Get in Touch"
- Contact submit button: "Request Your BD Audit"
- Contact confirmation text: "We reply within one business day to confirm your audit time."

---

### CC-07 | HIGH | Nav CTA says "Book a Call" while hero says "Book a BD Audit" -- label mismatch

**File:** `components/ui/Nav.tsx` lines 133-135, 193-194

**Problem:** The persistent nav button says "Book a Call" (generic, low-value label). The hero CTA says "Book a BD Audit" (specific, high-value label). Both go to `/diagnostic`. "Book a Call" is what every SaaS and agency says. "Book a BD Audit" differentiates because it promises diagnostic value, not a sales conversation.

**Proposed fix:** Change nav CTA to "Book a BD Audit" on both desktop and mobile. If space is tight on mobile, "BD Audit" alone works.

---

### CC-08 | MEDIUM | Hero sub-headline is a feature list, not a benefit statement

**File:** `components/sections/HeroSection.tsx` lines 117-119

**Problem:** "LinkedIn sequences, conversion landing pages, automated follow-up, booking infrastructure. Built for recruitment agencies. Running in the background while your team fills roles."

This reads as a list of deliverables. A skeptical buyer does not yet care about the components; they care about the outcome. The second paragraph (line 128: "Not campaigns. Not content. A mandate acquisition system built in 30 days and owned by you.") is actually stronger and does more work.

The first sub-head should answer: "What will this do for me?" not "What will you build?"

**Proposed fix:**
```
A done-for-you mandate acquisition system that books client conversations while your team fills roles. Built in 30 days. Owned by you.
```
Then the second line becomes the differentiator:
```
Not campaigns. Not content. Not another marketing agency. Infrastructure that converts.
```

---

### CC-09 | MEDIUM | Hero headline "your billers will not" -- ambiguity risk

**File:** `components/sections/HeroSection.tsx` line 107

**Problem:** "We build the BD pipeline your billers will not." The phrase "will not" could be read as "refuse to" (intended) or "are not able to" (subtly insulting their team). For a recruitment agency owner who is proud of their billers, the second reading could trigger defensiveness rather than recognition.

The headline does land -- it names the core tension accurately. But it could be sharpened to make the "won't, not can't" framing explicit.

**Proposed fix (optional -- test both):**
- Keep current. It is strong and will resonate with owners who already feel this frustration.
- Alternative: "We build the BD pipeline your billers should not have to." This reframes from blame to empathy, but loses some edge.
- Recommended: Keep current for now. The ProblemSection point 03 ("Your billers are excellent at filling roles. They will not do cold BD.") already clarifies the intended reading. Monitor bounce rate on hero.

---

### CC-10 | MEDIUM | Metric strip "5 Guaranteed" reads awkwardly

**File:** `components/sections/HeroSection.tsx` lines 11-13

**Problem:** The first metric displays as "5 Guaranteed / Client conversations in 30 days / Or we work free until we do." The word "Guaranteed" is placed in the `unit` field, making it render as a suffix to "5." Visually this reads as "5 Guaranteed" which is grammatically incomplete. Compare with the clean "30 Days" and "R10k /month" which parse naturally.

**Proposed fix:** Restructure the first metric:
```js
{ value: '5+', unit: '', label: 'Client conversations guaranteed', note: 'In 30 days, or we work free' }
```
This reads naturally: "5+ / Client conversations guaranteed / In 30 days, or we work free."

---

### CC-11 | MEDIUM | Scarcity claim "3 of 6 Q2 build slots remaining" is static and will age

**File:** `components/sections/HeroSection.tsx` line 95
**File:** `components/sections/ClosingCTA.tsx` lines 53-54, 60

**Problem:** The hero pill says "3 of 6 Q2 build slots remaining." The ClosingCTA says "Three of six Q2 slots are filled" and the headline says "Your Q2 2026 build slot is open." These are hardcoded. When Q2 passes (or when all slots fill, or none do), this becomes a lie. Stale urgency destroys trust faster than no urgency at all. A skeptical buyer who visits twice and sees the same number will discount everything.

**Proposed fix:**
1. Short term: Make the slot count a config constant or env variable that can be updated without a code deploy
2. Medium term: If you have a real booking system, pull live availability
3. If you cannot keep it updated, replace with evergreen urgency: "Limited build capacity per quarter" or "We take 6 agencies per quarter"

---

### CC-12 | MEDIUM | Page flow puts TrustSection before HowItWorksSection -- premature credibility play

**File:** `app/page.tsx` lines 11-22

**Problem:** Current order: Hero > Problem > Trust > HowItWorks > Sprint > Comparison > FAQ > ClosingCTA.

Placing Trust (why IGC, named operator, recruitment expertise) immediately after Problem is premature. The buyer has just recognized their pain. They do not yet understand what IGC does or how it works. Asking "why trust us?" before answering "what do you actually do?" creates a logical gap.

The classic B2B conversion arc is: Problem > Solution (how it works) > Proof/Evidence (why us) > Offer (pricing/guarantee) > Objection handling > Close.

**Proposed fix:** Reorder to:
```
Hero > Problem > HowItWorks > Comparison > Sprint > Trust > Testimonial > FAQ > ClosingCTA
```
This follows: "Here is your problem" > "Here is how we solve it" > "Here is why we are better than alternatives" > "Here is exactly what you get and what it costs" > "Here is why you can trust us" > "Here is proof" > "Here are your remaining questions answered" > "Book now."

---

### CC-13 | MEDIUM | No TestimonialSection in page.tsx at all

**File:** `app/page.tsx`

**Problem:** The TestimonialSection component exists but is not imported or rendered on the homepage. This means there is zero social proof on the main conversion page. The section is defined but unused. (This may be intentional given CC-01, but it means the page currently has no proof element between the offer and the close.)

**Proposed fix:** Once CC-01 is resolved with a recruitment-relevant testimonial or proof element, add it back to the page flow. See CC-12 for recommended placement.

---

### CC-14 | MEDIUM | ComparisonSection "In-House BD Person" salary figure may be too low

**File:** `components/sections/ComparisonSection.tsx` line 48

**Problem:** "R35,000+ salary before commission" for an in-house BD person. In 2026 South Africa, a competent BD hire in recruitment (especially Gauteng) may command R40,000-R55,000+. If the stated figure feels low to the buyer, it weakens the comparison because they think: "That is cheap, I should just hire someone." Understating the competitor cost works against you.

**Proposed fix:** Update to "R40,000-55,000+ salary before commission" or "R40,000+ salary before commission and benefits." The higher the perceived cost of alternatives, the stronger the R10k retainer looks.

---

### CC-15 | MEDIUM | ComparisonSection comparison points are not parallel in structure

**File:** `components/sections/ComparisonSection.tsx` lines 17-55

**Problem:** The marketing agency column has 5 weaknesses. The IGC column has 5 strengths. The in-house hire column has 5 weaknesses. But the points do not map 1:1 across columns. For example:
- Agency point 1 (impressions vs. placements) maps roughly to IGC point 2 (one metric: conversations) but not to hire point 1 (salary cost)
- This makes it harder for the reader to do mental comparison

In a 3-column comparison, parallel structure (same dimension, different answer) is more persuasive because the reader can scan across rows.

**Proposed fix:** Restructure around 5 dimensions:
1. What they optimize for (impressions / conversations / whatever they feel like)
2. What you own at the end (nothing / everything / depends on the person)
3. Speed to output (3-month ramp / ongoing drip / 30 days)
4. Accountability (account manager rotation / one named operator / you manage them)
5. Cost structure (monthly retainer with lock-in / fixed fee, no lock-in / salary + commission + benefits)

---

### CC-16 | MEDIUM | FAQ does not address price of the initial 30-day build

**File:** `components/sections/FAQSection.tsx` lines 10-12

**Problem:** The first FAQ asks "What does R10,000 per month actually cover?" and the answer says the 30-day build is "a separate fixed-fee engagement quoted on the audit call." This is the most natural price objection: "How much does the build cost?" The answer dodges it. A skeptical buyer will interpret this as "it is expensive and they do not want to say."

If the build fee is fixed (as stated in SprintSection: "fixed-scope, fixed-fee"), either state it or give a range. If it genuinely varies, say why and give a range.

**Proposed fix:** Either:
1. State the build fee: "The 30-day build ranges from R25,000-R40,000 depending on your agency's sector focus and the complexity of your outreach targeting. Quoted on the audit call."
2. Or add a separate FAQ: "What does the 30-day build cost?" with a direct answer

---

### CC-17 | MEDIUM | Missing FAQ: "Do you work with agencies outside Gauteng / South Africa?"

**File:** `components/sections/FAQSection.tsx`

**Problem:** TrustSection mentions "Johannesburg, Cape Town, and Durban." The SprintSection mentions "Gauteng tech and engineering." But there is no FAQ addressing geographic scope. A recruitment agency owner in Cape Town or Durban (or remotely anywhere) will wonder if this applies to them.

**Proposed fix:** Add FAQ:
```
Q: "Do you work with agencies outside Gauteng?"
A: "Yes. The system is built for LinkedIn outreach, which is geography-agnostic. We have active builds across Gauteng, Western Cape, and KZN. The audit call is remote. The build is remote. Your target market is wherever your hiring managers are."
```

---

### CC-18 | MEDIUM | Missing FAQ: "Can we see an example of a landing page / sequence you have built?"

**File:** `components/sections/FAQSection.tsx`

**Problem:** The most natural objection for a skeptical buyer who has been burned by agencies: "Show me what this looks like." There is no FAQ addressing this. No portfolio link, no example, no screenshot.

**Proposed fix:** Add FAQ:
```
Q: "Can we see an example of what you build?"
A: "On the audit call, we walk through the system architecture and show you examples from active deployments (anonymized where client agreements require). We do not publish a public portfolio because every build is customized to the agency's sector, geography, and buyer persona."
```

---

### CC-19 | MEDIUM | "Book a BD Audit" -- "Audit" may imply judgment, not help

**File:** Multiple (HeroSection, ComparisonSection, HowItWorksSection, SprintSection, TrustSection, ClosingCTA)

**Problem:** The CTA "Book a BD Audit" is used consistently (good) but the word "audit" can carry negative connotations for some buyers -- it implies being evaluated, judged, found wanting. For a frustrated agency owner who already feels behind, this may add psychological friction.

Counterargument: "audit" also implies expertise, thoroughness, and diagnosis. For a sophisticated B2B buyer, it may land well.

**Proposed fix:** This is worth A/B testing. Alternatives:
- "Book a BD Review" (softer)
- "Book a Pipeline Review" (descriptive)
- "Get Your Pipeline Diagnosed" (active, outcome-oriented)

Keep "BD Audit" as default -- it is specific and differentiating. But test alternatives if conversion on `/diagnostic` is below benchmark.

---

### CC-20 | MEDIUM | ClosingCTA "Claim Your Q2 Slot" is different from all other CTAs

**File:** `components/sections/ClosingCTA.tsx` line 65

**Problem:** Every other CTA on the page says "Book a BD Audit." The closing CTA says "Claim Your Q2 Slot." This is good in that it escalates urgency at the close. But if the Q2 scarcity claim ages (CC-11), the CTA ages with it. Also, the mismatch between "Claim Your Q2 Slot" and the destination page (which says "Book your mandate pipeline audit") may cause a micro-moment of confusion.

**Proposed fix:** Either:
1. Keep it but make it resilient: "Claim Your Build Slot" (evergreen)
2. Or match the pattern: "Book Your BD Audit Now" (consistency with urgency via "Now")

---

### CC-21 | LOW | ProblemSection point 04 is weaker than the other three

**File:** `components/sections/ProblemSection.tsx` lines 25-28

**Problem:** Point 04: "You are not sure which part of your BD process is actually leaking." This is introspective and meta. The first three points name specific, visceral failures (LinkedIn ads failed, marketing agency failed, billers will not do BD). Point 04 asks the reader to admit ignorance. Some buyers will not identify with this because they think they know where it breaks -- they just cannot fix it.

**Proposed fix:** Rewrite to name a more specific, common failure:
```
statement: 'You have tried to do BD yourself. It works when you have time. You never have time.',
consequence: 'Owner-led BD is the most common pipeline in independent recruitment. It is also the most fragile. One busy quarter and the pipeline goes cold. The feast-famine cycle is not a motivation problem. It is a systems problem.'
```
This is viscerally recognizable to every independent agency owner.

---

### CC-22 | LOW | "Proof copy" under CTA could be more specific

**File:** `components/sections/HeroSection.tsx` line 148

**Problem:** "20-minute audit. Free. No pitch." is clean and effective. But "No pitch" is what every pitch-heavy company says. A more specific promise would differentiate.

**Proposed fix:**
```
20-minute audit. Free. You will know exactly where your pipeline breaks.
```
This shifts from what you will NOT do (pitch) to what they WILL get (a diagnosis). Outcome > absence.

---

### CC-23 | LOW | SprintSection revenue callout "R40,000+" is not contextualized for impact

**File:** `components/sections/SprintSection.tsx` lines 162-169

**Problem:** "R40,000+ / One new retained mandate. Average placement fee, Gauteng tech and engineering." This is a good ROI anchor, but it does not complete the mental math for the reader. The reader needs to see: "One placement pays for 4 months of retainer." Making them do the math reduces impact.

**Proposed fix:**
```
R40,000+
One retained mandate covers four months of retainer. Average placement fee, Gauteng tech and engineering.
```

---

### CC-24 | LOW | HowItWorksSection step titles are generic

**File:** `components/sections/HowItWorksSection.tsx` lines 12-43

**Problem:** "Audit," "Build," "Run" are clean but generic. Every consultancy uses these words. They do not carry the specificity of the recruitment BD positioning.

**Proposed fix:** Consider:
1. "Diagnose" (more medical/precise than "Audit")
2. "Deploy" (more infrastructure-like than "Build")
3. "Operate" (implies ongoing systems, not just "running")

Or keep titles but make subtitles more specific:
- "Audit" > "Map your pipeline leaks"
- "Build" > "Deploy your BD infrastructure"
- "Run" > "Operate and optimize monthly"

---

### CC-25 | LOW | Diagnostic page credential "BD infrastructure deployments across B2B services, professional services, and recruitment" is vague

**File:** `app/diagnostic/page.tsx` lines 62-63

**Problem:** "BD infrastructure deployments across B2B services, professional services, and recruitment" lists too many sectors. If the site is positioned for recruitment, listing other sectors dilutes specialization. A recruitment buyer wants to know you specialize in their world.

**Proposed fix:**
```
BD infrastructure deployments for independent recruitment agencies across Gauteng, Western Cape, and KZN
```

---

### CC-26 | LOW | Footer links include "Privacy Policy" but no privacy page is visible in the codebase audit scope

**File:** `components/ui/Footer.tsx` line 8

**Problem:** The footer links to `/privacy`. If this page does not exist or is empty, clicking it will produce a 404, which damages trust. (Not verified whether the page exists, but it was not in the audit scope.)

**Proposed fix:** Verify `/privacy` page exists and has content. If not, create a basic privacy policy page.

---

### CC-27 | LOW | Thank-you page does not set next expectation or provide value

**File:** `app/thank-you/page.tsx`

**Problem:** The thank-you page says "We will review your details and confirm your diagnostic time within one business day." This is fine but misses an opportunity. Post-submission is a high-attention moment. The buyer just committed. This is the ideal time to:
1. Reinforce the decision ("Good move. Most agencies we work with wish they had done this sooner.")
2. Set expectations more specifically ("K.C. will personally review your submission and respond within 24 hours.")
3. Provide value ("While you wait, here is what we typically find in the first audit")

**Proposed fix:**
```
Confirmed. K.C. will review your submission personally.

Expect a reply within one business day with your audit time. In the meantime, 
the three most common pipeline breaks we find in recruitment agencies:

1. LinkedIn outreach running without a conversion page behind it
2. Follow-up sequences that stop after two touches
3. No booking infrastructure — warm leads go cold waiting for a manual reply

Your audit will tell you exactly which applies to your agency.
```

---

### CC-28 | LOW | Ghost decorative "90" watermark in SprintSection is unexplained

**File:** `components/sections/SprintSection.tsx` lines 137-139

**Problem:** There is a large decorative "90" watermark in the background of the SprintSection stats area. The section is about a 30-day build. The number 90 has no obvious meaning in context (90 days? 90 what?). If it refers to the 90-day case study cycle mentioned on the Results page, it is not explained here. An unexplained number in a section full of meaningful numbers creates subtle confusion.

**Proposed fix:** Change to "30" (matching the 30-day build) or remove it entirely.

---

### CC-29 | LOW | About page "Philosophy" section uses "clinic" language

**File:** `app/about/page.tsx` line 87

**Problem:** "Build the latter and acquisition becomes repeatable, measurable, owned by your clinic." This is another leftover from the med-aesthetics positioning.

**Proposed fix:** Replace "owned by your clinic" with "owned by your agency."

---

### CC-30 | LOW | Tone slip: "AI-augmented delivery" in TrustSection may trigger skepticism

**File:** `components/sections/TrustSection.tsx` lines 25-27

**Problem:** "AI-augmented delivery means we operate at the output of a team five times our size." For a skeptical recruitment agency owner in South Africa, "AI-augmented" may read as buzzword fluff, or worse, imply the work is automated/impersonal. The rest of the copy is grounded and specific. This point feels like tech-speak.

**Proposed fix:** Reframe around the outcome:
```
title: 'Senior attention. Every week.',
body: 'Small team, high output. You get direct operator attention on your pipeline every week, not just at the monthly report. No junior handoffs, no layers between you and the work.'
```

---

## Summary Table

| Severity | Count | IDs |
|----------|-------|-----|
| **HIGH** | 7 | CC-01, CC-02, CC-03, CC-04, CC-05, CC-06, CC-07 |
| **MEDIUM** | 13 | CC-08, CC-09, CC-10, CC-11, CC-12, CC-13, CC-14, CC-15, CC-16, CC-17, CC-18, CC-19, CC-20 |
| **LOW** | 10 | CC-21, CC-22, CC-23, CC-24, CC-25, CC-26, CC-27, CC-28, CC-29, CC-30 |
| **Total** | **30** | |

## Priority Action Summary

**Fix immediately (HIGH):** The site has a fundamental vertical mismatch problem. The homepage sections have been rewritten for recruitment agencies, but the testimonial, about page, results page, and contact form still reference med-aesthetic clinics. This will destroy credibility with any recruitment agency buyer who explores beyond the homepage. CC-01 through CC-07 should be resolved before any paid traffic or outbound sends people to this site.

**Fix before launch (MEDIUM):** The narrative flow (CC-12), missing social proof (CC-13), sub-headline clarity (CC-08), scarcity maintenance (CC-11), and FAQ gaps (CC-16, CC-17, CC-18) are all meaningful conversion leaks. The comparison structure (CC-15) and metric strip formatting (CC-10) are polish items that affect perceived quality.

**Fix when convenient (LOW):** Tone refinements, copy sharpening, and opportunity captures on lower-traffic pages.
