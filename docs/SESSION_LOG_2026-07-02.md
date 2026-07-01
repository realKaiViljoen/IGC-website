# Overnight portal redesign — morning brief (2026-07-02)

You went to bed and handed me discretion to push "design and product coherence
underpinned by psychological design excellence." Here is what landed, how to
review it, and what's left.

## TL;DR

The portal has been migrated off the old warm "Bloomberg-terminal" system onto
the **igc-sa dark system** (Satoshi, cool-black, one brass ember, the peak), and
the Overview has been recomposed to the anxiety/IA spec. All five client screens
now read as one coherent, quiet, institutional product. Everything is on a
branch, committed, building clean. **Nothing was pushed or deployed** — it waits
for your review.

## Decisions I made on your behalf (both were the recommended options)

1. **Hid the two empty nav doors** (Outreach, Deliverability). Routes still exist
   in code; they are just off the sidebar until they carry real data. 29% of the
   nav opening to "coming soon" was the single biggest credibility drag.
2. **Scope = visual rebrand + IA recomposition on enriched demo fixtures.** The
   deeper data-model work (Track C: real timestamps, "since last visit") is too
   risky to do unattended, so it is queued, not done.

## How to review

```bash
cd ~/IGC-website
git checkout portal-redesign-overnight
npm run dev -- --port 3021       # then open http://localhost:3021/portal
# log in: james@meridian.network / password123   (MSP demo, now Day 16 of 30)
#     or: thandi@vantagetech.co.za / password123  (recruitment demo, Day ~15)
```

Do NOT run `next build` while the dev server is up — they share `.next` and
collide (cost me one restart; harmless). The branch is 6 commits on top of
`main`; `git log --oneline main..HEAD` to see them, `git diff main` for the whole
change. If you dislike any of it, it is all isolated on the branch.

## What changed

**Foundation (`app/globals.css`, swept across 117 files)**
- Rewrote the token system to the cool-black two-layer ground (canvas-deep for
  the sidebar, canvas for content), the warm-neutral fg ramp, and one brass
  ember `#C78B28`. **Unified the two conflicting golds** (`#C9922A` vs `#C78B28`)
  that both claimed to be "the accent."
- Satoshi carries everything; the mono font is retired to `tabular-nums` (Satoshi
  tabular figures do the ledger job). The `§` glyph is stripped from every label
  and replaced by the Satoshi tracked-caps **eyebrow**.
- Killed the HUD costume: CRT scanlines, the ops grid, the blinking terminal
  cursor, breathing brass borders, gold glows, rounded shadowed cards, and the
  12% overlay grain (now a single 2% filmic ground). Square hairline surfaces.
- Added the serif-free principal-voice treatment (`.kc-voice`: Satoshi 500 + a
  2px inset), the brass focus ring, and the quiet section/value motion.

**Chrome**
- Sidebar: the **peak + IGC lockup** + "THE SYSTEM" eyebrow; the ticking HUD
  clock removed (it added anxiety, not information); brass active-nav underline.
- Login: peak lockup; "Sign in" now fills brass on hover (was green).

**Overview recomposition (`.../system/overview/page.tsx` + new `NextCommitment`)**
- Order is now: header → **guarantee (hero)** → **Next from K.C.** (the dated
  forward commitment, in his voice) → system pulse → commitments → briefing →
  activity. The **Handover Pack was demoted off the home** (a Day-3 "0 of 6"
  under an empty guarantee read as total emptiness).
- The `NextCommitment` block is the dead-zone fix: the soonest unmet commitment
  with its due date always sits under the guarantee, so `0 of 5` never appears
  without a dated forward move beside it.

**Demo fixtures**
- Both demo clients' dates shifted forward so today lands mid-build (MSP Day 16,
  recruitment Day ~15), guarantee live at "2 of 5 · ahead" — instead of the
  broken-looking "Day 86 of 30 · +56 days extended."

**Cleanup**
- Deleted `lib/analytics.ts` (orphaned, and it produced a composite "effort
  score" the brand bans). Marked `DESIGN.md` SUPERSEDED, pointing at the spec.

## Verified

Every screen was checked live in the browser with zero console errors, and the
production build is clean (`npm run build` → exit 0, all routes compile):
Login · Overview (recomposed) · Guarantee · Pipeline · Handover · Briefings.

## What's left (queued, not done)

Ranked by leverage. Full detail in [`PORTAL_REDESIGN_SPEC.md`](PORTAL_REDESIGN_SPEC.md) §4 (Track C).

1. **Real timestamps (Track C).** The pulse still renders `··:·· utc` placeholders
   because the fixture dates are date-only. Promoting them to ISO datetimes makes
   the whole freshness/liveness layer real. This is the deepest remaining gap.
2. **"Since your last visit" delta.** Needs a `last_seen_at` per session — the one
   net-new backend state the daily-return hook requires.
3. **Populate the receipt links** (`hubspot_url`, `artifact_url`, `transcript_url`)
   so every number is drillable — the literal "receipts over claims" promise.
4. **Standardize the four-part empty-state** across every screen (state-fact →
   reason → dated forward event → provenance stamp, amber-escalating when overdue).
5. **A few loose ends:** the `Messages` route still redirects to a nonexistent
   page (harmless, off-nav); some briefing *prose* mentions "29 April" that the
   date-shift didn't touch (it's inside the summary text, not a date field); and
   `DESIGN.md` deserves a full rewrite rather than just the superseded banner.
6. **Deploy.** When you're happy, this branch merges to `main` and goes to Vercel
   (per the earlier hosting decision) — not before your sign-off.

## The one thing to look at first

Log in and look at the **Overview**, then click through the five nav items. The
question the whole pass was built to answer: does it now read as *your* system —
quiet, premium, institutional, alive without shouting — rather than a recolored
terminal? I believe it does. Tell me where it doesn't and I'll take it from there.
