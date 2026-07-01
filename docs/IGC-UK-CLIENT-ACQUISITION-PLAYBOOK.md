# IGC — UK Client Acquisition Playbook
**Insight Growth Consulting | Market: United Kingdom | Niche: Independent IT MSPs**
**Compiled: April 2026 | Status: Master Operational Reference**

> This is the single document that governs how IGC finds, converts, and retains clients. It does not replace the sub-documents — it orchestrates them. Read this first. Consult sub-documents for word-for-word scripts.

---

## DOCUMENT MAP

| Document | What It Contains | When to Read It |
|---|---|---|
| **This document** | System architecture, email sequences, sales process, qualification rules, daily rhythm | Once to internalise. Refer to specific sections as needed. |
| `IGC-UK-OPERATING-STACK.md` | ICP definition, Apollo filter spec, pricing, service delivery, positioning | Before building lead lists and before any sales conversation |
| `IGC-UK-OUTREACH-PLAYBOOK.md` | 90-day prospect calendar, decision tree, HubSpot client BD pipeline, nurture/walk-away rules | Before first outreach to a new cohort |
| `IGC-UK-LINKEDIN-SYSTEM.md` | Connection request variants, 5-step DM sequence, Loom strategy, LinkedIn profile spec | Before setting up LGM sequences |
| `IGC-UK-COLD-CALL-SYSTEM.md` | All call branches word-for-word, voicemail scripts, gatekeeper handling, price negotiation, post-call protocol | Before first call session |
| `IGC-UK-PROPOSAL-AND-SALES-SYSTEM.md` | Full proposal copy, negotiation rules, objection handling, client agreement clauses, onboarding sequence | After a positive discovery call |
| `IGC-UK-AI-MCP-STACK.md` | MCP server setup, AI workflow automation, daily AI-assisted rhythm, Make.com workflows, UK GDPR compliance | When setting up the technology stack |

---

## PART 1 — THE SYSTEM ARCHITECTURE

### How the pieces fit

```
APOLLO LEAD LIST (500 contacts, Tier 1–3)
        ↓
LGM LINKEDIN SEQUENCE (connection request + 5-step DM over 21 days)
        ↓ parallel ↓
COLD CALL BLOCK (Days 5, 8, 12 — max 3 attempts per prospect)
        ↓ parallel ↓
EMAIL SEQUENCE (Days 10, 14, 21 — follow-up to voicemail + value delivery)
        ↓
RESPONSE → CLASSIFICATION → HubSpot stage update (automated via Make.com + Claude)
        ↓
DISCOVERY CALL (20 minutes, qualification + needs assessment)
        ↓
PROPOSAL DELIVERY (Loom + DocSend PDF, same day or next morning)
        ↓
FOLLOW-UP SEQUENCE (48h / 5d / 10d)
        ↓
CLOSED WON → Onboarding → Build → Retainer
CLOSED LOST / NOT NOW → Nurture sequence (monthly, 6 months)
```

### The volume math

- **Input:** 50 new prospects per week (10/day Monday–Friday)
- **Active simultaneous:** Max 50 at any time
- **LinkedIn acceptance rate:** 28–38% → 14–19 connections per week
- **Reply rate (all channels):** 8–14% of contacts reached → 4–7 replies per week
- **Discovery call conversion:** 40–60% of replies → 2–4 calls per week
- **Proposal-to-close:** 25–35% → 0.5–1.4 closed clients per week
- **Target:** 2 new MSP clients/month minimum to hit revenue targets

At £3,500 per client: 2 clients/month = £7,000. Plus retainer compounding.

---

## PART 2 — QUALIFICATION CRITERIA

### The Hard Qualifiers (All Must Be True)

A prospect is a genuine prospect if they meet ALL of these:

1. **5–50 employees (sweetspot 8–25)** — under 5 = survival mode, unpredictable budget; over 50 = likely already has or is about to hire a dedicated BD/sales person
2. **Independent (not part of a group or holding company)** — consolidated MSPs and holdco-backed groups have central BD teams; independents don't
3. **Genuine MSP** — delivers managed IT services, IT support, helpdesk, cybersecurity, Microsoft/cloud infrastructure. Not break-fix only. Not an IT staffing or IT recruitment firm. Uses RMM/PSA tooling (ConnectWise, Autotask, Datto, Kaseya) as operational backbone
4. **UK-based** — London, Manchester, Birmingham, Leeds, Bristol, Edinburgh, Reading, Cambridge priority order
5. **Founded 2013–2022** — established enough to have recurring MRR and client references, early enough to still need systematic BD infrastructure
6. **Owner-led BD** — MD/Founder/Owner/CEO is the sole or primary business development person
7. **No full-time BD or sales hire confirmed** — if they hired a sales director or BD manager in the last 90 days, disqualify (they've already bought the alternative)

### The Tier System (From Operating Stack)

| Tier | Signal Cluster | Priority |
|---|---|---|
| **Tier 1** | 4+ signals including: open job posting for engineer/account manager/service desk staff; no dedicated sales hire visible on LinkedIn; founded 2016–2021; active LinkedIn presence (MD posting about growth, services, hiring); MSP-specific tooling confirmed (ConnectWise/Autotask/Datto/Kaseya) | Same-day LinkedIn + call |
| **Tier 2** | 2–3 signals | Standard sequence Day 0 |
| **Tier 3** | 1 signal or ICP-match only | Standard sequence, lower call priority |

### Disqualification Criteria (Any One = Remove)

- Just hired a dedicated sales or BD director (LinkedIn shows new hire in last 90 days)
- Part of a group/network/holding company (description mentions "part of X group" or "an X company")
- Pure IT staffing or IT recruitment firm (not an MSP — they place contractors, they don't manage client infrastructure)
- Break-fix only — no recurring managed service revenue
- Fewer than 5 employees (survivalist, no money for BD infrastructure)
- Primary geography outside UK (ignore US, ANZ, EU offices of UK-registered firms where the delivery sits abroad)
- Publicly struggling (LinkedIn posts about hardship, recent negative press, redundancy announcements)
- Contact is not MD/Founder/Owner/CEO — do not pitch to IT managers, service desk leads, technical directors, or operations managers. They cannot authorise a £3,500 spend and will not champion the project internally

---

## PART 3 — THE SELLING PIPELINE (IGC's Own HubSpot Pipeline)

This is **separate** from the Client BD Pipeline that IGC builds for clients. This tracks IGC's own sales process.

### Pipeline Stages

| Stage | Definition | Max Time Before Alert |
|---|---|---|
| **Prospect Identified** | Contact in Apollo, Tier scored, not yet contacted | — |
| **Outreach Active** | LGM sequence live and/or call attempts made | 21 days |
| **Replied** | Any response received — positive, objection, or negative. Record MSP's BD situation, pain points, and objections verbatim in Notes using MSP language ("contract pipeline," "new managed service logos," "SMB decision-maker") | 3 days |
| **Discovery Call Booked** | Calendly booking confirmed. Confirm ahead of the call that the attendee is the MD/Founder/Owner/CEO — not a service desk manager, technical lead, or ops director | 2 days |
| **Discovery Call Held** | Call completed, outcome noted | 24 hours |
| **Proposal Sent** | DocSend link delivered | 5 business days |
| **Negotiation** | Active back-and-forth on terms/price | 7 days |
| **Closed Won** | Invoice paid, onboarding started | — |
| **Closed Lost** | Explicit no, timing issue, or disqualification | — |
| **Nurture** | Not now — monthly touch scheduled | 90 days (check re-engagement) |
| **Disqualified** | Hard disqualifier confirmed | — |

### Required Custom Properties (IGC Selling Pipeline)

Create these in HubSpot under the Deal object:

| Property Name | Type | Values |
|---|---|---|
| `igc_tier_score` | Number | 1, 2, 3 |
| `igc_signal_count` | Number | 1–7 |
| `igc_outreach_channel` | Dropdown | LinkedIn_first / Call_first / Email_first |
| `igc_discovery_call_date` | Date | — |
| `igc_proposal_sent_date` | Date | — |
| `igc_proposal_viewed` | Checkbox | Yes/No |
| `igc_objection_type` | Dropdown | Price / Timing / Have_solution / Not_interested / Other |
| `igc_nurture_next_touch` | Date | — |
| `igc_campaign_cohort` | Text | e.g. "April 2026 Cohort A" |
| `igc_msp_tooling` | Dropdown | ConnectWise / Autotask / Datto / Kaseya / Other / Unknown |
| `igc_msp_headcount_band` | Dropdown | 5–10 / 11–25 / 26–50 |

### Stage Transition Rules

**Prospect Identified → Outreach Active:** LGM sequence loaded, connection request queued.

**Outreach Active → Replied:** Any response logged — even negative. Log the reply text verbatim in Notes.

**Replied → Discovery Call Booked:** Prospect agrees to 20-minute call. Create Calendly link immediately. Do not delay. Before the call, confirm attendee is the MD/Founder/Owner.

**Discovery Call Booked → Discovery Call Held:** After the call. Log: qualified/unqualified, key pain (contract pipeline, referral dependence, capacity for BD), objections raised, next step agreed.

**Discovery Call Held → Proposal Sent:** Send same day or next morning. Never delay >24 hours. Record DocSend link in Notes.

**Proposal Sent → Negotiation:** They respond with a pricing or scope question. Not a no — an engagement.

**Proposal Sent → Closed Lost / Nurture:** After 10-day follow-up sequence completes with no response or explicit decline.

**Any stage → Disqualified:** As soon as a hard disqualifier is confirmed. Do not attempt re-engagement for 12 months minimum.

---

## PART 4 — COMPLETE EMAIL SEQUENCES

### Sequence 1: Cold Outreach Email (Before First Call)

**When to send:** Day 0 — same day as LinkedIn connection request, sent to corporate email address from Apollo. Only send if you have a verified corporate email. Never send to personal Gmail/Hotmail.

**Subject line options (test A/B):**
- A: `[Company name] — new contract pipeline question`
- B: `Quick question for [first name]`
- C: `Independent MSPs in [their city] — something worth 2 minutes`

**Body:**

> Hi [First name],
>
> Sent you a connection request on LinkedIn — thought it was worth reaching out directly too.
>
> I work with independent IT MSPs like [Company name] to build systematic client acquisition infrastructure. The problem I see most often: the MD is the only BD engine, and when engineers are busy delivering, new business stops. When referrals slow, there's no pipeline to fall back on.
>
> What we build in 30 days: a LinkedIn outreach system targeting the MDs and Directors at SMBs in your patch who need managed IT services, connected to a CRM and automated follow-up workflows. You own everything. No ongoing dependency on us.
>
> One new managed service contract at typical MSP rates covers the build entirely.
>
> Not a pitch — just checking whether this is a problem you're dealing with right now.
>
> [Your name]
> IGC

**CTA:** No link in first email. The goal is a reply or a call.

**Follow-up if no reply in 5 days:**

> Hi [First name],
>
> Following up on my note from last week.
>
> If new contract pipeline isn't a pain point right now — no problem, I won't persist.
>
> If it is, I'm happy to walk through what we've built for other IT MSPs in [their city/region] and whether the approach would fit your situation.
>
> 20 minutes, no deck.
>
> [Your name] / IGC

---

### Sequence 2: Post-Discovery Call (Interested, No Commitment)

**When to send:** Within 2 hours of the discovery call ending. Sent before the proposal.

**Subject:** `[Company name] — call notes and next step`

> Hi [First name],
>
> Good call. Here's what I took away:
>
> **The situation:** [One sentence summary — e.g. "Owner-led BD, currently referral-only, 12 engineers delivering well but no proactive outreach producing new managed service contracts."]
>
> **What you've tried:** [One sentence — e.g. "LinkedIn content, occasional networking events, some past work with a marketing agency, inconsistent results."]
>
> **What the system addresses:** LinkedIn outreach running daily at 20–25 touches into MDs, Finance Directors and Operations Directors at 10–200 employee UK businesses in your patch, connected to a CRM that surfaces the right conversations, with automation handling the follow-up. You spend time on calls with qualified SMB decision-makers, not admin.
>
> I'm going to put together a proposal that matches what we discussed. You'll have it [tomorrow morning / this afternoon].
>
> One thing I want to confirm before I write it up: is [specific assumption from call] still accurate, or did I get something wrong?
>
> [Your name] / IGC

**Psychology note:** The confirmation question at the end is not courtesy — it keeps them psychologically engaged and gives you a reason to iterate the proposal to their exact situation. It also signals operator-to-operator directness, which lands harder with MSP MDs who talk to vendors all day and can spot a generic pitch immediately.

---

### Sequence 3: Proposal Follow-Up Sequence

**Setup:** Send proposal via DocSend (tracked). Email DocSend link via Gmail (logged in HubSpot). Note send timestamp.

---

**Email 1 — Proposal Delivery (Day 0)**

**Subject:** `[Company name] — managed services BD build proposal + Loom`

> Hi [First name],
>
> Proposal is attached, and I've done a 3-minute Loom walking through the parts specific to [Company name]: [DocSend link]
>
> Loom: [Loom link]
>
> The Loom is worth watching before you read the doc — it cuts through the detail and shows you specifically what the system looks like for a [headcount]-person MSP running on [ConnectWise/Autotask/Datto/Kaseya].
>
> The proposal is 5 pages. The number is on page 4.
>
> If you want to talk through anything, I have time [tomorrow morning / this afternoon / Thursday].
>
> [Your name] / IGC

---

**Email 2 — 48-Hour Follow-Up (Day 2)**

*Only send if no response and DocSend shows they've opened it.*

**Subject:** `[Company name] — anything I should clarify?`

> Hi [First name],
>
> Checking in on the proposal. I can see you've had a look — if anything's unclear or the numbers need adjusting on your end, worth a quick conversation before you decide.
>
> Anything I should know?
>
> [Your name] / IGC

*If DocSend shows they have NOT opened it:*

**Subject:** `[Company name] — not sure if this landed`

> Hi [First name],
>
> Not sure if the proposal email made it through — just in case: [DocSend link]
>
> Worth 4 minutes if new managed service contract pipeline is still on your radar.
>
> [Your name] / IGC

---

**Email 3 — 5-Day Follow-Up (Day 5)**

**Subject:** `Still relevant for [Company name]?`

> Hi [First name],
>
> Haven't heard back — which usually means one of three things: too busy, wrong timing, or the proposal didn't land right.
>
> Which is it?
>
> Happy to adjust if the approach needs tweaking. Or if the timing's genuinely off, just say so — I'll note it and reach back out when it makes sense.
>
> [Your name] / IGC

**Psychology note:** The "which is it?" direct question is more effective than "let me know if you have questions." It requires a real answer and signals that you're not chasing approval — you're trying to understand. MSP MDs respond well to directness; they work in an industry full of vendor fluff and appreciate not being one more person on a soft follow-up list.

---

**Email 4 — 10-Day Final Chase (Day 10)**

**Subject:** `[Company name] — last note on this`

> Hi [First name],
>
> Last follow-up on the proposal.
>
> If the timing or budget situation has changed, I'd rather know than assume. If it's a no, that's fine — just say so and I'll stop following up.
>
> If it's a "not yet" — reply with when, and I'll set a reminder and reach back out then instead.
>
> [Your name] / IGC

**After Day 10 with no response:** Move to Nurture. No further follow-up on this proposal cycle. Do not send a fifth email.

**If DocSend shows 3+ opens in the first 48 hours with no reply:** Send this instead of Email 2:

> Hi [First name],
>
> Looks like you've had a close look at the proposal — there's something in it that's worth the time, or something that needs clarifying.
>
> What's the sticking point?
>
> [Your name] / IGC

---

### Sequence 4: Ghost Re-Engagement (Was Warm, Went Cold — 14+ Days Silence)

**When to send:** 14+ days after last contact with no response. Prospect had shown interest (replied, booked a call that didn't happen, or engaged positively at some point).

**Email:**

**Subject:** `[First name] — circling back`

> Hi [First name],
>
> It's been a couple of weeks since we last spoke. Not going to recap everything — you know what we do.
>
> I just wanted to check whether the new business situation has changed, or whether the timing's shifted.
>
> One question: is owner-led BD still the main new business model at [Company name] right now?
>
> [Your name] / IGC

**If they reply:** Start fresh. Do not reference the original proposal. Treat it as a new discovery conversation. Book another call.

**If no reply after 7 days:** One more attempt — LinkedIn DM only:

> [First name] — circled back by email, wanted to check here too. If the timing's genuinely off, just say and I'll park it. If there's something worth a quick conversation, I'm around.

**If no response to DM:** Move to Nurture sequence. This prospect is no longer actively warm.

---

### Sequence 5: Nurture Sequence (Said "Not Now, Maybe in 3 Months")

**Purpose:** Stay visible. One touch per month. Never pitch in nurture. The goal is to be the first person they think of when the timing shifts.

**Hard rules for nurture emails:**
- No ask. No CTA. No link to the proposal.
- One useful piece of information per email.
- Under 100 words.
- Reply-inviting (ends with a question or observation that makes reply feel natural, not obligatory).

---

**Nurture Month 1 (30 days after they said "not now")**

**Subject:** `UK managed services — one number worth knowing`

> Hi [First name],
>
> Thought this was relevant to [Company name]: independent MSPs relying purely on referrals are seeing new contract volumes drop 20–30% year-on-year as SMBs increasingly get approached by proactive competitors, larger MSPs, and cybersecurity-led entrants. The MSPs holding ground are the ones that shifted from reactive to proactive BD — running systematic outreach rather than waiting on inbound.
>
> Not a pitch. Just something I've noticed talking to a lot of MSPs your size.
>
> How's new contract pipeline looking at your end?
>
> [Your name] / IGC

---

**Nurture Month 2 (60 days after)**

**Subject:** `Something that worked for an MSP in [their region]`

> Hi [First name],
>
> One thing that's been consistent across MSPs I've worked with: the first two weeks of a systematic LinkedIn outreach campaign always feel slow. Acceptance rates are around 30%, replies are single digits. By week 6, the pipeline starts compounding — connected SMB decision-makers start booking calls, engineers get pulled into scoping conversations, and the MD stops being the only source of new logos.
>
> The MSPs that bail in week 3 never see that inflection point.
>
> Where are you with new business at the moment — still the same situation as when we spoke?
>
> [Your name] / IGC

---

**Nurture Month 3 (90 days — re-evaluation touch)**

**Subject:** `[First name] — three months on`

> Hi [First name],
>
> We spoke about three months ago. You said the timing wasn't right.
>
> Just checking: has anything changed on the new business side? New engineers on the bench, a contract renewal cycle coming up, or a push to win more direct SMB logos?
>
> If the situation's the same, no problem — happy to check back in another quarter. If something's shifted, worth a 20-minute conversation.
>
> [Your name] / IGC

**After month 3:** If no reply to the re-evaluation email: pause nurture. Attempt one LinkedIn DM. If no response: set a 90-day task to re-evaluate whether to attempt again.

---

### Sequence 6: Post-Decline Re-Engagement (They Said No)

**Hold period:** Minimum 6 months before re-approaching after an explicit "no."

**Exception:** If their business situation visibly changes (hiring more engineers, expanding into cybersecurity/cloud/compliance, a job posting for an account manager, announcing a new office or region), bring forward to 3 months.

**Re-engagement email:**

**Subject:** `[Company name] — update worth flagging`

> Hi [First name],
>
> We spoke about six months ago and the answer was no — I respected that and left it there.
>
> I'm reaching back out because [SPECIFIC TRIGGER — e.g. "I noticed you've hired two new engineers" / "I saw you're expanding into cybersecurity / managed SOC services" / "I noticed you're looking for an account manager" / "you've opened a second office in [city]"].
>
> That tells me the new business situation at [Company name] might look different now.
>
> If I'm wrong, tell me — I won't persist. If there's something worth a conversation, I've got time [this week / next week].
>
> [Your name] / IGC

**If no response to re-engagement:** One LinkedIn DM, then archive. Some prospects are permanent no's. Respect that.

---

## PART 5 — SALES CYCLE AND PROCESS RULES

### The Ideal Sales Cycle

**Total target: 14–21 days from first touch to signed agreement**

| Stage | Day Range | What Must Happen |
|---|---|---|
| First touch | Day 0 | LinkedIn + email same day |
| First call attempt | Day 5 | Dial during 10:00–12:00 BST |
| Discovery call held | Day 7–12 | Must be scheduled within 48h of reply |
| Proposal delivered | Day 13–14 | Same day or morning after discovery call |
| Proposal follow-up | Day 15–21 | Sequence 3 above |
| Closed or Nurture | Day 21 | Explicit outcome recorded in HubSpot |

**Rule:** A deal that reaches Day 21 with no clear next step is not "pending." It is either Nurture or Closed Lost. Make the call and move it.

### When to Advance, Hold, or Disqualify

**Advance immediately when:**
- They reply with any positive signal (question, interest, booking a call)
- They open the proposal 3+ times within 48 hours
- They send a direct objection (price, timing) — this is engagement, not rejection

**Hold (do not advance or close) when:**
- They said "not now but [specific date]" — schedule the touch and wait
- They have not responded to any of the first 3 touches — continue sequence
- You are waiting for them to review the proposal — allow minimum 48 hours

**Disqualify immediately when:**
- They explicitly say no or ask to be removed from contact
- You confirm a hard disqualifier (see Part 2)
- They become hostile (one hostile response = permanent removal, no re-approach)
- The company appears to be closing, in distress, or being acquired into a group

### Qualification Gate for Discovery Calls

Do not book a discovery call until the prospect has demonstrated genuine interest (asked a question, replied positively, or accepted your cold call and engaged for 2+ minutes). A discovery call booked with an unqualified prospect wastes 20 minutes and pollutes the pipeline.

**Minimum to qualify for discovery call:**
- Confirmed ICP match (genuine MSP, 5–50 employees, UK-based, independent)
- Expressed or implied new business pain (in conversation or via the signal cluster)
- MD/Founder/Owner/CEO on the call (not a service desk manager, technical lead, or ops director)

### Discovery Call Objective

The discovery call is not a pitch. It is a qualification conversation. The pitch follows after you have confirmed:
1. The problem exists and is felt (they articulate new business / contract pipeline / BD as a pain)
2. They have decision-making authority (MD/Founder/Owner/CEO on the call)
3. The budget reality is workable (no immediate hard stop — £3,500 is not going to break them)
4. The timing is close (not 12+ months out, not "after we finish migrating everyone off [legacy RMM]")

If all four are true: send the proposal. If any are uncertain: get clarity before sending.

---

## PART 6 — OBJECTION HANDLING FRAMEWORK

The universal principle: **acknowledge → reframe → question back**.

Never defend. Never argue. Never use "I understand" as filler — it sounds scripted. Acknowledge the specific concern, reframe with the correct lens, then ask a question that moves them forward.

### The Six Common Objections

**1. "It's too expensive."**

Acknowledge: "Fair to raise — let's look at the number directly."
Reframe: "£3,500 is a one-time build cost. One new 30-seat managed service contract at £1,500–£2,500/month is £18,000–£30,000/year in ARR. The maths is: the system pays for itself on the first contract it generates. Every contract after that is pure margin, and because managed services are recurring, it compounds year on year."
Question: "What would need to be true about the economics for this to make sense?"

Floor rule: Never go below £3,000 build / £1,500/month retainer. Payment split (50/50 at start and Day 15) is available for genuine cash flow constraints only — not as a general discount.

**2. "Not the right time."**

Acknowledge: "Timing matters — I'm not going to push you into something that doesn't fit your calendar."
Reframe: "The MSPs I see most affected by timing pressure are the ones who waited until referrals dried up — or until a big client churned and they suddenly had a revenue gap with no pipeline to fill it. The build takes 30 days. If you start in [month], you have a running system by [month + 30 days]."
Question: "What's specifically making now difficult? Is it operational bandwidth on the service desk side, or is it something on the revenue side?"

**3. "We already have a marketing agency / LinkedIn strategy / BD person."**

Acknowledge: "Good to know — I don't want to replace something that's working."
Reframe: "The question isn't whether you have LinkedIn activity or a marketing retainer — it's whether you have a system generating consistent managed service contract conversations. A LinkedIn strategy and a client acquisition system are different things. Most MSP marketing agencies produce content and social posts; very few run systematic, CRM-connected outreach to named SMB decision-makers in your target patch."
Question: "What does your current pipeline look like in terms of new SMB conversations per month — real ones, with the MD or Finance Director on the other side?"

Let them answer. If the number is low (or they can't give one): "So the system isn't producing at the level you need — is that fair?"

**4. "I don't know enough about you yet."**

This is a research/trust objection. It means they want proof before committing.

Response: "That's a completely reasonable position. The UK MSP community is small and well-networked — I'd be suspicious of anyone I hadn't vetted either. What would give you enough confidence — is it talking to an MSP we've built a similar system for, seeing what the final deliverable looks like end-to-end, or understanding the guarantee in more detail?"

Then deliver exactly what they asked for. No more, no less. Do not oversell. Do not dump every asset you have. Give them the specific thing they asked for and let them come back with the next question.

**5. "What if it doesn't work?"**

Acknowledge: "Good question to ask upfront."
Reframe: "The guarantee exists for exactly this scenario. 5 qualified prospect conversations in 30 days, or the retainer continues free until you hit 5. 'Qualified' is defined in the agreement: two-way exchange with an MD/FD/Ops Director at an in-patch SMB, confirmed IT pain or contract review timing, agreed next step. The count is tracked in HubSpot — we review it together every Friday so there's no ambiguity."
Question: "Does the guarantee structure address the risk, or is there a specific failure mode you're worried about that I haven't covered?"

**6. "We tried something like this before and it didn't work."**

This is the highest-risk objection because it carries emotional weight. An MSP MD who's been burned by a marketing agency, a lead-gen vendor, or an in-house "growth hire" that didn't pan out is emotionally primed to reject anything that smells similar.

Acknowledge: "That's a meaningful data point — tell me more about what you tried. I want to understand what didn't work before I claim this is different."

Let them explain. Then:

"The most common reasons MSP BD systems fail are three things: the wrong targeting (connecting with IT managers who aren't the economic buyer, or SMBs too small to need managed services), the wrong message (sounding like a vendor pitching services rather than a peer-level conversation about IT risk and cost), or no follow-through (the system runs for 3 weeks and stops before the compounding effect kicks in). Which of those was the issue for you?"

Use their answer to position the IGC approach directly against the failure mode they experienced. If it was targeting: walk them through the Apollo filter logic for SMB decision-makers. If it was messaging: show them the peer-level DM sequences. If it was follow-through: explain the 30-day minimum + retainer safety net.

---

## PART 7 — PSYCHOLOGY AND POSITIONING PRINCIPLES

### Why This Offer Works On This ICP

The MSP MD is experiencing a specific psychological state: **competence anxiety combined with optionality blindness**. They are excellent at their core function — delivering IT services, managing infrastructure, solving technical problems at pace — but feel inadequate at BD. And they don't know how to fix it because every solution they've tried required them to become something they're not (a content creator, a cold emailer, a marketer, a LinkedIn personality).

MSP owners live in a world where the technical bar is high and the sales bar is invisible. They can describe a Microsoft 365 tenant migration in their sleep but freeze when asked "what's your pipeline worth this quarter?" IGC's offer does not ask them to become something different. It installs infrastructure that runs around them.

**Four psychological levers in the offer:**

**1. Endowment Effect:** "You own everything permanently." The moment they mentally categorise the system — the LinkedIn sequences, the HubSpot CRM, the landing page, the Make.com automations, the reporting dashboard — as theirs (not a subscription they're renting), the perceived value increases and the switching cost of not buying it becomes a loss rather than a foregone gain. MSPs understand ownership viscerally because their whole model is built on long-term client ownership; this framing speaks their language.

**2. Loss Framing:** "One new managed service contract covers the build fee." The question in their head is not "is £3,500 worth it?" — it is "can I afford to miss the contracts this system would generate?" Frame it as what they're losing without it, not what they're gaining with it. For an MSP, one new 30-seat SMB client at £1,500–£2,500/month represents £18k–£30k of ARR that compounds year after year. The build fee is rounding error against that number.

**3. Authority and Specificity:** The guarantee is defined precisely (not "results guaranteed" — "5 qualified prospect conversations in 30 days, tracked in HubSpot, reviewed together weekly"). The timeline is exact (30 days). The deliverables are named (5 components, each described: LinkedIn sequences, landing page, HubSpot CRM, Make.com automations, reporting dashboard). Specificity signals competence. Vagueness signals risk. MSP MDs evaluate every vendor through a "do they actually know what they're doing?" lens because they get pitched by cowboy IT vendors constantly; specificity cuts through that filter.

**4. Social Proof via Pain Mirror:** The discovery call question "what does your current new business pipeline look like?" is not just qualification — it is anchoring. When they describe their own BD pain out loud ("honestly, it's referrals and hope"), they have committed to the frame that the problem exists. They are then more consistent (Commitment and Consistency principle) in evaluating a solution. This is especially powerful with MSP MDs because they rarely articulate BD pain out loud to anyone — engineers don't ask, service desk leads don't ask, and family doesn't understand. Getting them to say it in a peer conversation is therapeutic in itself.

### What Not to Do (ICP-Specific Pitfalls)

- **Never use "excited" or "passionate about technology."** This is a market where operators talk to operators. Enthusiasm signals you've never run a business. MSP MDs also spend their day fighting vendor pitches full of "excited to partner with you" — do not sound like the next one.
- **Never name a case study that can't be verified.** The UK MSP community is small and well-networked — MSPs know each other through peer groups (TubbTalk, Ingram Micro SMB Alliance, MSP Mastermind, Connectwise IT Nation UK), vendor events, and Slack/Discord communities. Fabricated social proof destroys credibility permanently and news travels fast.
- **Never pitch scope creep.** The 30-day build is fixed. If they want more (extra sequences, extra integrations, a custom dashboard, a second target segment like enterprise or vertical-specific), the answer is "that's a second sprint — let's complete the first one first." Scope creep = quality dilution.
- **Never discount on the first objection.** The first price objection is almost always a test, not a genuine constraint. MSP MDs test vendors the same way they test suppliers — push on price, see if it holds. If you cave immediately, they conclude the service isn't worth the stated price. Reframe first. If they object a second time with specifics: then evaluate.
- **Never chase.** More than 4 follow-up touches on a non-responding prospect signals desperation. The email sequences above are designed to be the last professional word, not an escalation ladder.
- **Never talk down to them about IT.** They know more than you about the technical side — RMM platforms, cybersecurity frameworks, Microsoft licensing, compliance requirements. Do not try to impress them with technical knowledge, and do not attempt to explain their own industry back to them. Stay firmly in the BD/commercial lane where you have expertise they don't.

---

## PART 8 — DAILY AND WEEKLY OPERATING RHYTHM

### Daily Schedule (3-Hour Active Work Block)

**7:45–8:20 AM — Morning Triage (Claude-assisted)**
- Claude reviews overnight LinkedIn replies (Unipile MCP) and emails (Gmail MCP)
- Classifications generated automatically, draft responses queued
- HubSpot tasks surfaced for the day
- Operator reviews and approves drafts (not auto-sent)
- 15–20 new connection accepts have Step 1 DM queued for review

**8:20–10:00 AM — LinkedIn Admin**
- Send approved Step 1 DMs (10–15 typical at steady state)
- Review LGM sequence health (acceptance rate, delivery)
- Reply to any inbox messages manually if Claude's draft needed adjustment

**10:00–12:00 PM — Call Block**
- 20 dials maximum (Tier 1 priority, then Tier 2)
- Call brief for each contact (Claude-generated, reviewed pre-block) — includes MSP headcount, RMM/PSA platform if known, signal cluster, any LinkedIn context
- Post-call: speak outcome into Claude prompt → HubSpot auto-updated
- Time-of-day: 10:00–12:00 BST optimal for UK MSP MDs (after the morning service desk stand-up, before the lunchtime crisis calls)

**4:00–5:30 PM (Tuesday and Thursday only) — Second Call Window**
- Second-attempt calls only (first attempt failed, trying a different time)
- 10 dials maximum

**Ad hoc (any time) — Proposal and Follow-Up**
- Send proposals within 24 hours of discovery call
- Proposal follow-up sequence managed by Gmail drafts, reviewed and sent manually
- Never queue auto-send on proposals

### Weekly Rhythm

| Day | Priority |
|---|---|
| **Monday** | Load new cohort into LGM (50 contacts, Tier 1 first). Review pipeline. Send nurture emails scheduled for the week. |
| **Tuesday** | Call block (10:00–12:00 + 16:00–17:30). Process Monday accepts. |
| **Wednesday** | Call block. Review proposal pipeline — any stuck deals? |
| **Thursday** | Call block. LinkedIn DM sends for mid-week connection accepts. |
| **Friday** | Weekly pipeline review (Claude-generated). Write next week's connection notes (batch AI generation, 50 notes, 10-minute review). Identify any nurture contacts re-engagement dates arriving next week. |

### Weekly Review Metrics (Healthy Thresholds)

| Metric | Healthy | Warning | Action |
|---|---|---|---|
| Connections sent | 40–50 | <30 | Check LGM is running |
| Acceptance rate | 28–38% | <20% | Revise connection note copy |
| Reply rate (all channels) | 8–14% | <5% | Audit message sequence |
| Discovery calls booked | 2–4 | <1 for 2+ weeks | Escalate call volume or check discovery CTA |
| Proposals sent | 1–2 | 0 for 2 weeks | Investigate call quality |
| Closed clients | 0.5–1/week | 0 for 4+ weeks | Audit discovery call → proposal conversion |

**Two consecutive weeks below any "Warning" threshold → diagnose before adding volume. Adding volume to a broken funnel compounds the problem.**

---

## PART 9 — GUARANTEED SETUP CHECKLIST

Complete in this order before sending the first connection request.

### Technology Stack

- [ ] LinkedIn Sales Navigator active on outreach LinkedIn account
- [ ] LGM account created, LinkedIn account connected via cloud (not browser extension)
- [ ] LGM 5-day warmup complete (5 requests/day, Days 1–5)
- [ ] Apollo Professional account active, UK MSP filters saved (see Operating Stack — SIC codes 6201/6202/6311, keywords "managed services," "managed IT," "IT support," MSP-specific tooling signals)
- [ ] Cognism account active for phone enrichment (export from Apollo, enrich in Cognism)
- [ ] HubSpot free account created, Selling Pipeline configured (11 stages, custom properties including `igc_msp_tooling` and `igc_msp_headcount_band`)
- [ ] Make.com Core account active (£9/month)
- [ ] Gmail MCP configured in Claude Code (OAuth complete)
- [ ] HubSpot MCP configured in Claude Code (OAuth complete, all scopes)
- [ ] Apollo MCP configured in Claude Code (API key)
- [ ] Calendly account active, 20-minute "Intro Call" event type created
- [ ] DocSend account active for proposal tracking
- [ ] Carrd Pro active for future client landing pages (can defer to first client)

### MCP Configuration

See `IGC-UK-AI-MCP-STACK.md` for exact install commands and configuration JSON. The stack to configure in Claude Code before Day 1:

```json
{
  "mcpServers": {
    "hubspot": { "transport": "http", "url": "https://mcp.hubspot.com/v1", "auth": "oauth2" },
    "apollo": { "command": "npx", "args": ["@chainscore/apollo-io-mcp"], "env": { "APOLLO_API_KEY": "..." } },
    "gmail": { "command": "npx", "args": ["@taylor/google-workspace-mcp"] },
    "linkedin": { "command": "npx", "args": ["unipile-linkedin-mcp"], "env": { "UNIPILE_API_KEY": "..." } },
    "calendly": { "command": "npx", "args": ["calendly-cli", "mcp"], "env": { "CALENDLY_API_KEY": "..." } }
  }
}
```

### Content Preparation

- [ ] LinkedIn profile updated (see LinkedIn System doc — headline positioning IGC as "Client acquisition systems for independent UK IT MSPs", banner, featured section, summary)
- [ ] 3 connection request note variants written and tested (Variants A, B, C from LinkedIn System doc — all MSP-specific)
- [ ] 5-step DM sequence loaded in LGM (word-for-word from LinkedIn System doc, all references to managed services/contracts/engineers)
- [ ] First cohort of 50 connection notes generated by Claude (batch generation, reviewed — verify each references the specific MSP's tooling, patch, or hiring signal)
- [ ] Cold call brief format tested on first 5 contacts
- [ ] IGC domain email configured (outreach@igc-growth.com), SPF/DKIM/DMARC set, 2-week warmup complete

### Legal

- [ ] Privacy notice page live on IGC website (lawful basis: legitimate interest, right to object, data request contact)
- [ ] Legitimate interest documentation written (one paragraph, on file — not published)
- [ ] All outreach emails include physical address and unsubscribe link (LGM handles this automatically)

---

## PART 10 — FAILURE MODES AND HOW TO DIAGNOSE THEM

### Failure Mode 1: High connection volume, low acceptance rate (<20%)

**Cause:** Connection notes are too generic, too long, or obviously templated. MSP MDs are pitched constantly by lead-gen vendors and can spot a templated note in 2 seconds.

**Fix:** Run Claude batch re-generation with stronger signal-based hooks — reference specific job postings, tooling stack, patch geography, or a recent LinkedIn post they made. Test Variant A vs B vs C. Check LinkedIn SSI score — if below 45, LGM performance degrades. Verify the sender profile looks like a peer operator, not a salesperson.

### Failure Mode 2: Good acceptance rate, low reply rate to DMs (<8%)

**Cause:** Step 1 DM is pitching too fast or is too long. UK MSP operators recognise sequence templates immediately — they see the same vendor outreach patterns across every ConnectWise/Datto/Microsoft partner portal.

**Fix:** Shorten Step 1. Make it a genuine question about their situation, not a setup for your offer. Remove any language that sounds like a sales sequence ("I'd love to connect," "helping MSPs scale," "would you be open to"). Replace with direct operator-to-operator tone.

### Failure Mode 3: Good reply rate, low discovery call booking rate (<40% of replies)

**Cause:** Replies are interest signals, but the response fails to book the call. Asking "would you be open to a chat?" gets soft deflection. The call booking ask is too tentative.

**Fix:** Direct close: "I have time [day] at [time] or [day] at [time] — which works?" Two options, not open-ended. MSP MDs have fragmented calendars and will choose the easier path; make booking trivially easy.

### Failure Mode 4: Good call rate, low proposal send rate (<60% of calls)

**Cause:** Discovery calls are ending without a clear qualifying outcome. Either: you're not asking the qualification questions (is the MD actually on the call? Is there real BD pain? Is £3,500 a workable number?), or you're pitching to unqualified prospects who are "interested but not ready."

**Fix:** Stop sending proposals to unqualified prospects. A call that ends with "interesting, let me think about it" is not a proposal trigger. Only send a proposal when you can confirm all four qualifying gates (Part 5). If you're consistently hitting calls where the IT manager or ops director is there instead of the MD, tighten the pre-call qualification email.

### Failure Mode 5: Good proposal rate, low close rate (<25%)

**Cause:** Either the proposal is unclear on price/guarantee, or the follow-up sequence is too passive.

**Fix:** Review proposal opens in DocSend. If they're opening repeatedly without replying: the price is likely the sticking point — trigger the 3+ opens variant email (Sequence 3, above). If they're not opening: the email isn't getting through or the subject line isn't working. Check spam placement for the outreach@igc-growth.com domain — MSPs often run tight email filtering on their own inboxes and vendor domains sometimes end up quarantined.

### Failure Mode 6: Market exhaustion (running out of qualified prospects)

**Apollo data for UK MSP ICP:** approximately 1,800–2,400 qualifying independent MSPs in the 5–50 employee band across the UK. At 50 new contacts/week = 36–48 weeks before the primary list is exhausted. Protect the Tier 3 reserve.

**Mitigation:** At 70% list penetration (~1,200–1,700 contacts reached), slow volume and increase quality. Shift to re-engagement of previous nurture contacts. Add adjacent ICP segments (51–75 employees; MSPs founded 2023–2024; MSPs pivoting from pure break-fix into managed services) to extend the addressable market. Consider adjacent ICP: UK IT consultancies transitioning to MSP model, or Microsoft Solutions Partners doing managed services under 50 heads.

---

*This document is the living operational centre of IGC's UK client acquisition system. Update it when rules change. Do not let it drift from practice — if a script evolves, update it here.*
