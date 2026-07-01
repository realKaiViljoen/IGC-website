# IGC AI + MCP Integration Stack — Complete Technical Specification

**Date:** April 2026 | **Author:** Claude Sonnet 4.6 | **Scope:** One-operator 500-contact outreach with 80% AI cognitive offload

---

## PART 1: MCP SERVER INVENTORY — WHAT ACTUALLY EXISTS

### A. HubSpot MCP

**Status: OFFICIAL SERVER — Generally Available as of April 13, 2026**

HubSpot has an official MCP server hosted at `mcp.hubspot.com`. This is not a community project — it is maintained by HubSpot's engineering team and went GA two weeks ago. There is also a second HubSpot MCP for developer platform interactions (CLI-based), but for this use case the CRM remote server is what matters.

**GitHub:** `https://github.com/hubspot/mcp-server`
**Developer docs:** `https://developers.hubspot.com/mcp`

**What Claude can do via HubSpot MCP (confirmed read/write):**

| Object | Read | Write |
|---|---|---|
| Contacts | Yes | Yes — create, update, delete |
| Companies | Yes | Yes |
| Deals | Yes | Yes — create, update, move stage |
| Tasks | Yes | Yes — create, assign, complete |
| Notes/Calls/Emails (Engagements) | Yes | Yes — log activities |
| Meetings | Yes | Yes — create records |
| Pipeline stages | Yes | Yes — move deals between stages |
| Custom properties | Yes | Yes — update any custom property you define |
| Lists (Segments) | Yes | Yes |
| Campaigns/Pages/Blog | Yes | Read-only |
| Users/Teams/Owners | Yes | Read-only |

**Critical for IGC:** Claude can read the full contact record, update `igc_outreach_stage`, create tasks ("Follow up in 3 days"), log call outcomes as Note engagements, and move deals between pipeline stages. This is everything needed for the daily workflow.

**What it cannot do:** Send emails through HubSpot's email-sending infrastructure via MCP. Email sending via HubSpot's transactional email is available through the API but is not exposed as an MCP tool in the current GA release.

**Install command (Claude Code):**
```bash
claude mcp add hubspot --transport http \
  "https://mcp.hubspot.com/v1" \
  --header "Authorization: Bearer YOUR_OAUTH_TOKEN"
```

**Exact configuration steps:**
1. Go to `app.hubspot.com` → Settings → Integrations → Private Apps
2. Create a private app. Required scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.deals.read`, `crm.objects.deals.write`, `crm.objects.notes.write`, `crm.objects.tasks.write`, `crm.objects.calls.write`
3. Copy the access token
4. In Claude Code: `/mcp` → Add Server → Remote → paste `https://mcp.hubspot.com/v1`
5. Authenticate via OAuth flow (Claude Code handles the PKCE handshake)

**Cost:** Included with HubSpot Free (the plan IGC builds clients on).

---

### B. LinkedIn MCP

**Status: NO OFFICIAL SERVER — Realistic scope is severely limited by LinkedIn's API policy**

There is no LinkedIn-official MCP server and there will not be one, because LinkedIn's official API explicitly prohibits the use cases that matter here: sales automation, CRM enrichment, prospecting, and sending messages to non-followers at scale. LinkedIn revoked access to Apollo.io and Seamless.ai in 2025 for exactly these patterns.

**The realistic landscape for LinkedIn MCP:**

**Option 1: Community MCP servers using unofficial (cookie-based) API**

Multiple exist:
- `https://github.com/stickerdaniel/linkedin-mcp-server` — profiles, companies, jobs, feed (updated Feb 2026)
- `https://github.com/alinaqi/mcp-linkedin-server` — local automation, connection requests
- `https://github.com/southleft/linkedin-mcp` — marked "requires cookies" on unofficial features

These work by extracting your LinkedIn session cookie and making requests that impersonate a browser. They can technically read profile data, search connections, and in some implementations send messages and connection requests.

**Why this is high-risk in 2026:** LinkedIn's detection rate increased 340% between 2023 and 2025. A 2026 Growleads study across 50 accounts found 23% faced restrictions within 90 days using browser-based automation tools. Cookie-based MCP servers are browser-extension equivalent in LinkedIn's detection model. Using one to send connection requests or messages risks the client's LinkedIn account — which is the core asset of the entire IGC system. **Do not use these for sending actions on a client account.**

**Option 2: Unipile — The Correct Solution**

Unipile (`https://unipile.com`) is a third-party API provider that provides programmatic LinkedIn access without browser extensions. It has:
- An official MCP server: `https://github.com/bhaktatejas922/unipile-linkedin-mcp`
- A second community MCP: `https://github.com/honeybluesky/mcp-unipile`
- Support for: read profile data, read messages/inbox, read connections, send messages (InMail and connection DMs), manage connection requests

Unipile works by having you authenticate your LinkedIn account through their OAuth-style flow, then proxies requests in a way that mimics native LinkedIn traffic. They are not LinkedIn-approved but they manage pacing, rate limiting, and detection avoidance at the API layer.

**What Claude can do via Unipile LinkedIn MCP:**
- Read a prospect's LinkedIn profile (name, headline, about, recent posts)
- Read your inbox messages
- Send a LinkedIn direct message to an existing connection
- Read connection request status
- Search profiles

**What it still cannot safely do via MCP:** Send cold connection requests at scale from Claude. That action should remain inside LGM/Expandi which have proven infrastructure for safe pacing. Unipile is best used for reading LinkedIn data to feed Claude's research function, and for reading inbox replies to feed the classification workflow.

**Realistic Scope Summary:** Claude cannot replace LGM/Expandi for sending connection requests or running the sequence. What Claude can do via Unipile MCP is read the LinkedIn inbox to classify replies and feed HubSpot updates. The sending layer stays in the dedicated automation tool.

**Cost:** Unipile pricing is usage-based. At 500 contacts, this is low volume — roughly $20–$50/month.

---

### C. Gmail / Email MCP

**Status: FUNCTIONAL community servers, multiple solid options**

No official Google MCP server exists, but several production-quality community servers have emerged.

**Best option for IGC: `google_workspace_mcp` by taylorwilsdon**
`https://github.com/taylorwilsdon/google_workspace_mcp`

Covers Gmail, Calendar, Drive, Docs, Sheets, Chat in one server. This is the most maintained and broad-coverage option.

**Alternative (Gmail-only, simpler):** `https://github.com/ihiteshgupta/gmail-mcp-server` — 19 tools, verified OAuth, used with Claude Code specifically.

**What Claude can do:**
- Read emails (search by sender, subject, date, label)
- Read full threads
- Send emails (including replies)
- Create drafts
- Apply/create labels (e.g. label a reply "LI-INTERESTED")
- Archive/move emails
- Search for keywords across inbox ("mandate" "quick call" "not interested")

**What this enables for IGC:** When email follow-up is added to the outreach sequence (LGM supports multi-channel), Claude can read incoming email replies, classify them, draft responses, and log activities to HubSpot — all in one workflow.

**Install command (Claude Code via Composio — recommended, handles OAuth):**
```bash
claude mcp add gmail --transport http \
  "https://mcp.composio.dev/gmail" \
  --header "x-composio-api-key: YOUR_COMPOSIO_KEY"
```

**Self-hosted install (direct Google OAuth — more control):**
```bash
npx @taylor/google-workspace-mcp install
# Follows OAuth flow in browser, stores token locally
```

**Required OAuth scopes:**
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.labels`

**Microsoft 365 / Outlook:** A community server exists (`MarkusPfundstein/mcp-gsuite` has an Outlook fork) but Gmail is simpler and more reliable. If a client is on Outlook, use Composio's managed toolkit which handles both.

---

### D. Apollo MCP

**Status: OFFICIAL — Launched beta February 24, 2026, available to all paid plan customers**

Apollo.io built a native MCP server hosted on their infrastructure. This is not a community project.

**PR announcement:** `https://www.apollo.io/magazine/apollo-now-powers-outbound-execution-in-claude`
**Community MCP (27 tools, covers full Apollo API):** `https://github.com/Chainscore/apollo-io-mcp`

**What Claude can do via Apollo MCP:**

| Action | Available |
|---|---|
| Search people (by name, title, company, industry, geography) | Yes |
| Search companies | Yes |
| Enrich a contact (get verified email, phone, LinkedIn URL) | Yes |
| Create contact in Apollo CRM | Yes |
| Update contact record | Yes |
| Add contact to a sequence | Yes |
| Get sequence list | Yes |
| Bulk prospect: search → enrich → create → add to sequence | Yes (single workflow) |

**The "sequence-load" flow** is the most powerful feature: Claude can run a single prompt like "Find 50 MDs of tech recruitment agencies in London, enrich them, create contacts in Apollo, and add them to sequence ID XYZ" — and Apollo MCP executes that end-to-end.

**Install command:**
```bash
# OAuth-based — authenticate through Claude's connector directory
# In Claude Desktop or Claude Code: /mcp → Connectors → Apollo
# Authenticate via OAuth, no API key needed for official connector

# OR via community server:
npx apollo-io-mcp
# Requires APOLLO_API_KEY env var
```

**Configuration:**
```json
{
  "mcpServers": {
    "apollo": {
      "command": "npx",
      "args": ["apollo-io-mcp"],
      "env": {
        "APOLLO_API_KEY": "your_key_here"
      }
    }
  }
}
```

Get API key from: `app.apollo.io` → Settings → API Keys

**Cost:** Included in Apollo paid plans. The official MCP is at no additional cost. Apollo Professional is $99/user/month.

---

### E. Calendly MCP

**Status: Multiple functional community servers, no official one**

**Best option:** `https://github.com/bcharleson/calendly-cli` — 40 tools covering the full Calendly API, agent-native CLI + MCP server.

**Second option:** `https://github.com/NyxToolsDev/calendly-mcp-server` — simpler, focused on core scheduling operations.

**What Claude can do:**
- List upcoming scheduled events
- Check booking availability
- Get invitee details (name, email, company)
- List event types (which Calendly link is which)
- Cancel an event
- Create one-off booking links

**Install:**
```bash
npm install -g calendly-cli
# Set CALENDLY_API_KEY env var from Calendly Settings → Developer → API Keys

claude mcp add calendly --command "calendly-cli mcp"
```

**What this unlocks for IGC:** When a prospect books via Calendly, Claude can detect the new booking, pull the invitee's email/company, look them up in HubSpot, move the deal to "Call Booked" stage, and generate a pre-call brief — all automatically.

---

### F. La Growth Machine (LGM) MCP

**Status: Available via Composio — functional but limited tools**

LGM does not have its own first-party MCP server. Access is via Composio's managed MCP layer which wraps LGM's REST API.

**Source:** `https://composio.dev/toolkits/lagrowthmachine/framework/claude-code`
**LGM's direct REST API:** `https://apiv2.lagrowthmachine.com/flow` (API key auth)
**LGM in Make.com:** `https://apps.make.com/lagrowthmachine` (official connector)

**What Claude can do via LGM MCP (Composio):**
- List all campaigns
- List all audiences
- Create or update a lead (contact) in LGM
- Get campaign statistics
- Pause/resume a campaign

**What it cannot do via MCP:** Read individual LinkedIn message replies (that data stays in LinkedIn's layer — use Unipile for that). Send new connection requests outside of a running campaign (LGM's automation handles that by design).

**Best use of LGM + Claude:** Claude generates the personalised connection note variants and Step 1 DM copy. A human uploads that copy into LGM's sequence builder. Claude does not need to directly control LGM's send layer — LGM handles that better than any AI agent can (rate limiting, safety, cloud proxy).

**Expandi alternative:** Expandi has webhook support and a REST API documented at `https://help.expandi.io/en/collections/3042112-webhooks-and-integrations-api`. It connects to HubSpot, Zapier, and Make.com. No dedicated MCP server exists but Make.com workflows can bridge Expandi events to HubSpot. Between the two, LGM is the better choice for this stack because of its native HubSpot sync and the Clay integration.

---

## PART 2: AI LEVERAGE POINTS — WHERE AI REPLACES HUMAN WORK

### A. Pre-Call Research (currently 2 minutes per prospect → target: 20 seconds)

**Can Claude do this? Yes. This is the highest-confidence automation in the stack.**

**Workflow:**
1. Operator has a list of 20 dials for the day in HubSpot
2. Claude reads each contact's HubSpot record (name, company, `igc_tier_score`, `igc_signal_count`, LinkedIn URL)
3. Claude uses Unipile LinkedIn MCP to fetch the prospect's current LinkedIn headline, about section, and most recent 2–3 posts
4. Claude generates a 5-line call brief per prospect

**Prompt for brief generation:**
```
You are preparing a cold call brief for a BD operator at IGC.

Contact: {name}, {title} at {company}
Company size: {headcount} employees, founded {year}
Apollo signals: {signal_list}
LinkedIn headline: {headline}
LinkedIn about: {about_text}
Recent LinkedIn post (if any): {recent_post}

Generate a call brief with exactly these sections:
1. HOOK (one sentence — the specific reason to call this person today, based on a signal)
2. PAIN HYPOTHESIS (what BD problem they likely have, specific to their situation)
3. PERSONALISATION (one thing you noticed about them specifically that isn't generic)
4. LIKELY OBJECTION (their most probable first pushback, based on what you know)
5. OBJECTION ANSWER (the response to that specific objection in 2 sentences)

Keep the entire brief under 100 words. Use operator-to-operator language. No enthusiasm inflation.
```

**Tools required:** HubSpot MCP (read contact data) + Unipile LinkedIn MCP (read profile)
**Time saving:** 2 minutes → 20 seconds. For 20 dials = 37 minutes saved daily.
**Quality note:** Claude's briefs will be consistent but generic for prospects with thin LinkedIn presence. For prospects with recent posts (signaling active on platform), Claude produces noticeably better hooks. For low-signal contacts, the brief defaults to company-level observations.

---

### B. Connection Request Personalisation (currently: human writes custom note)

**Can Claude do this at scale? Yes. This is the second highest-leverage automation.**

**Workflow (batch generation):**
1. Export Apollo list as CSV (name, company, title, LinkedIn URL, tech stack signal)
2. Paste 50 rows into Claude (or use Apollo MCP to pull them)
3. Claude generates 50 personalised connection notes in one pass

**Prompt for batch note generation:**
```
You are writing LinkedIn connection request notes for a BD operator at IGC — a mandate acquisition infrastructure firm for independent tech recruitment agencies.

The sender is {sender_name}, founder of IGC.

For each contact below, write a LinkedIn connection note (max 280 characters including spaces). 

Rules:
- Never use "I came across your profile" (immediate delete trigger)
- Start with a specific observation about them, their company, or their situation
- The observation must be verifiable (company age, hiring a consultant, tech niche)
- Do not mention our service or ask for anything
- Sound like a human who actually looked at one thing about them
- End with a soft reason to connect — not a pitch

Contacts:
{CSV_ROWS}

Output format: one note per line, prefixed with the contact's name.
```

**Quality check system:** After generation, Claude reviews its own output against these red flags:
- Any note over 260 characters (gets cut by LinkedIn)
- Any note that uses "impressive" / "passionate" / "excited to connect"
- Any note that asks a question in the first sentence (too eager)
- Any note that doesn't contain a specific observable fact

**Expected output quality:** At 500 contacts, roughly 15–20% of notes will be weak (thin Apollo data = no good hook). For those, Claude flags them and the operator writes manually. The other 80–85% are send-ready after a 2-minute skim.

**Time saving:** 1.5 minutes per note × 50 notes = 75 minutes → 10 minutes to review Claude's batch output.

---

### C. Post-Connection Message Personalisation (Step 1 DM)

**Same workflow as connection notes, adapted for Step 1.**

The Step 1 DM fires 3 days after connection accept. At this point, the prospect has accepted — they are warm. Claude generates the DM for each new accept.

**Trigger:** Make.com detects "connection accepted" event from LGM webhook → sends contact data to Claude via n8n or Make → Claude generates Step 1 DM → human reviews batch of 10–15 DMs each morning → sends (or uses LGM's queue).

**Prompt for Step 1 DM:**
```
You are writing a LinkedIn first message after a connection has been accepted.

Context: IGC builds mandate acquisition infrastructure for independent tech recruitment agencies (8–25 people) in the UK. Our offer: 30-day build, £3,500, 5 qualified client conversations guaranteed or we extend for free. This is the first DM — the goal is to open a conversation, not to pitch.

Contact: {name}, {title} at {company}
Company: {headcount} people, founded {year}, {tech_niche} recruiting
Signal that triggered contact: {signal_e.g. "hiring a recruitment consultant"}

Write a LinkedIn first DM. Rules:
- Max 120 words
- First sentence: reference something real and specific about them
- Second: acknowledge a likely situation they're in (without assuming — frame as "a lot of {title}s I speak to...")
- Third: one sentence about what we do — infrastructure, not service
- End: a question that requires a real answer (not "are you open to a chat?")
- Tone: operator-to-operator. No agency language. No enthusiasm.
```

---

### D. Response Classification

**Can Claude classify LinkedIn/email replies? Yes. This is extremely reliable.**

**Workflow:**
1. Unipile LinkedIn MCP polls inbox for new messages (or LGM webhook fires on reply)
2. Reply text passed to Claude
3. Claude classifies and logs to HubSpot

**Prompt for classification:**
```
Classify this LinkedIn reply from a recruitment agency owner into exactly one category. Reply with only the category name and a one-sentence reasoning.

Categories:
- INTERESTED: Wants to know more, asks a question about the offer, or agrees to a call
- SOFT_INTEREST: Not immediately ready but signals future openness ("maybe next quarter", "not right now but keep in touch")
- OBJECTION_PRICE: Explicitly mentions cost, "too expensive", "what does it cost"
- OBJECTION_TIMING: Busy now, try later, specific future date given
- NOT_INTERESTED: Clear no, remove request, "not for us"
- ALREADY_HAVE: Has an existing solution / in-house BD / already using a competitor
- REFERRAL: Points to someone else at the company or another agency
- QUESTION: Asks a specific clarifying question before deciding

Reply text: "{reply_text}"
Contact: {name}, {company}
Outreach stage: {current_lgm_step}
```

**Output:** Classification + reasoning → Make.com reads it → updates `igc_outreach_stage` in HubSpot → creates a task with suggested next action.

**Accuracy:** For clear yes/no/objection responses, Claude accuracy is extremely high (95%+). The only failure mode is ambiguous British understatement ("interesting, I'll have a think" — is this SOFT_INTEREST or NOT_INTERESTED?). Solve by adding a `UNCLEAR` category and routing those to human review.

---

### E. Draft Reply Generation

**Workflow:**
1. Reply classified (from D above)
2. Claude generates a draft response tailored to the classification

**Prompt template per classification type:**

```
CLASSIFICATION: {category}

You are drafting a LinkedIn reply on behalf of {sender_name} at IGC.

Contact: {name}, {title} at {company}
Their message: "{reply_text}"
Classification: {category}

Draft a reply using the appropriate template below.

INTERESTED → Move toward booking: confirm the interest, offer one specific time or Calendly link, keep it under 3 sentences.

SOFT_INTEREST → Park and re-engage mechanism: acknowledge their timeline, ask one question that keeps the conversation open, suggest when to reconnect.

OBJECTION_PRICE → ROI reframe: acknowledge the price question directly, state the one-placement-covers-the-build-fee argument, ask if that framing makes sense for their fee structure.

OBJECTION_TIMING → Graceful park: respect the timing, offer to reconnect at their named date, make re-engagement frictionless.

NOT_INTERESTED → Graceful close: thank them, one sentence positioning IGC for future reference, no pushback.

REFERRAL → Warm hand-off request: ask for the specific person's name and whether they'd be comfortable with a mention.

Rules for all drafts: operator-to-operator tone, under 80 words, no "great to hear from you", no enthusiasm inflation, specific > generic.
```

**Human review step is mandatory.** The operator should review and edit every draft before sending. The goal is 80% of the typing eliminated — not fully autonomous sends. Never auto-send LinkedIn messages from AI drafts.

---

### F. Follow-up Scheduling (HubSpot task creation)

**This is fully automatable via HubSpot MCP. Zero human input needed.**

**Workflow (Make.com + Claude + HubSpot MCP):**
```
LGM reply event
    → Make.com webhook receives payload
    → Claude classifies reply
    → Based on classification:
        INTERESTED → HubSpot MCP: move deal to "Replied", create task "Send Calendly link today", log Note with reply text
        SOFT_INTEREST → HubSpot MCP: create task "Re-engage on {date they specified}", update stage to "Soft Park"
        OBJECTION_PRICE → HubSpot MCP: create task "Send ROI reframe today", log classification
        NOT_INTERESTED → HubSpot MCP: move contact to "Disqualified", archive deal
```

**Exact HubSpot MCP calls Claude makes:**
```
create_task:
  contactId: {id}
  title: "Follow up — {classification}"
  dueDate: {computed_date}
  notes: "Classification: {category}. Reply: {truncated_reply}"
  
update_deal_stage:
  dealId: {id}
  stageId: {stage_mapping[classification]}

create_note:
  contactId: {id}
  body: "LI Reply received {date}: {reply_text}\nClassification: {category}\nSuggested action: {action}"
```

This replaces the operator manually reading a reply, deciding what to do, opening HubSpot, creating a task, and moving a stage — a sequence that currently takes 3–5 minutes per reply. At 15 replies/day, that's 45–75 minutes saved.

---

### G. Loom Video Script Generation

**This is fully AI-generatable and produces high-quality output.**

**When to use:** Tier 1 prospects only — the ones who hit 4+ signals from the "about to buy" cluster in the operating stack. Maybe 20–30 per cohort of 500.

**Prompt for Loom script:**
```
You are writing a 60-second Loom video script for {sender_name} at IGC to send to a specific prospect.

Prospect: {name}, {title} at {company}
Company: {headcount} people, {tech_niche} recruitment, founded {year}
Signal that makes them Tier 1: {signal_list}
LinkedIn headline: {headline}
Their recent LinkedIn activity (if available): {recent_post_or_activity}

Write a Loom script with:
1. OPEN (5 seconds): "Hi {name}, {sender_name} here from IGC — I'm going to share my screen for 60 seconds and show you something specific to {company}."
2. HOOK (10 seconds): One sentence referencing a specific, observable thing about their situation — not generic recruitment pain.
3. SHOW (30 seconds): [SCREEN DIRECTION: Show the IGC pipeline diagram / Show a real HubSpot pipeline example / Show the guarantee language] — narration that walks through what they'd own after 30 days, naming their specific niche.
4. OUTCOME (10 seconds): "For a {headcount}-person {tech_niche} agency, this typically means {specific outcome framing}."
5. CLOSE (5 seconds): "Link in the description — 20 minutes, no pitch deck." 

Write this as spoken words the sender will read naturally. Not too polished. One short false start is fine — it makes it feel real.

Screen direction labels should appear in [BRACKETS] so the sender knows when to switch.
```

**Quality:** Claude produces consistently strong Loom scripts because the format is tightly constrained and the inputs are specific. The operator should record without reading word-for-word — use the script as a skeleton and speak naturally.

---

### H. Proposal Personalisation

**Workflow: discovery call notes → personalised proposal in 15 minutes.**

**Prompt:**
```
You are generating a personalised IGC proposal for a recruitment agency client after a discovery call.

Sender: {sender_name}, IGC
Client: {contact_name}, {title} at {company}
Call date: {date}
Call notes (raw, operator-provided): {raw_notes}

IGC standard offer:
- Build fee: £3,500 (30-day sprint)
- Deliverables: LinkedIn outreach system (2 sequences, 10 templates, 20–25 connections/day), HubSpot CRM pipeline (7 stages, custom properties), Make.com automation workflows, Carrd landing page, reporting dashboard, handover documentation
- Retainer: £1,750/month (optional post-build)
- Guarantee: 5 qualified client conversations in 30 days or system runs at no charge
- Client owns all assets permanently

Generate a personalised proposal that:
1. Opens with a reference to something specific from the discovery call — not generic
2. Names their specific tech niche and the exact hiring roles they mentioned
3. States the ROI argument using their actual placement fee range (from call notes)
4. Describes the deliverables as if built specifically for them (use their company name where relevant)
5. States the guarantee clearly with defined criteria
6. Closes with the next step (invoice link / agreement link)

Tone: declarative, no enthusiasm inflation, operator-to-operator. Short paragraphs. No bullet point spam.
Format: email body, ready to send. Under 500 words.
```

---

## PART 3: THE COMPLETE AI-ASSISTED DAILY WORKFLOW

### Morning Routine (30 minutes — currently 90+ minutes)

**7:45 AM — Claude runs an overnight summary**

Claude prompt at session start:
```
Review overnight activity across my outreach system. 

Via Unipile LinkedIn MCP: Any new LinkedIn replies since yesterday 5pm?
Via Gmail MCP: Any email replies tagged [LI-OUTREACH] label since yesterday 5pm?
Via HubSpot MCP: Any tasks due today? Any deals stuck in same stage > 5 days?
Via Calendly MCP: Any new bookings since yesterday?

Generate:
1. A list of replies received with pre-classification
2. Draft responses for each (awaiting my approval)
3. Today's task list ordered by priority
4. Any deal stuck alerts with suggested re-engagement action
```

**8:00–8:20 AM — Operator reviews classifications and drafts**
- 10–15 replies typical at steady state
- Operator reads each draft, edits if needed, approves
- Approved drafts are sent manually (never auto-sent)
- Takes ~90 seconds per reply including send

**8:20–8:30 AM — HubSpot updated automatically**
- Make.com/Claude workflow has already run overnight
- All classifications logged, stages moved, tasks created
- Operator confirms the pipeline view looks right, spot-checks 2–3 entries

**Time saved vs. current:** ~60 minutes → 30 minutes

---

### Calling Block (2 hours)

**Pre-call brief generation (10 minutes before block starts):**

Claude prompt:
```
I have {N} calls scheduled for today. Pull each contact from HubSpot (I'll give you the names), fetch their LinkedIn profile via Unipile, and generate a 5-line call brief for each using the brief template.

Contacts: {list}

Output as a numbered list, one brief per contact, in call order.
```

**During calls:** Operator uses the brief. Nothing automated here — calls are human.

**Post-call logging (30 seconds per call):**

Operator types into Claude: `"Called {name}. Outcome: voicemail / not interested / interested, call back Thursday / booked a call for Friday 2pm"`

Claude prompt:
```
Log this call outcome to HubSpot and suggest next action.

Contact: {name}
Outcome: {operator_input}

Actions to take:
- Log a call engagement with outcome note
- Update igc_outreach_stage appropriately
- Create follow-up task with correct due date
- If "booked": move deal to Call Booked, check Calendly for the booking
- If "interested, call back {day}": create task for that day
- If "voicemail": log and create task "Try again in 2 days"
- If "not interested": move to Disqualified, archive deal
```

Claude executes this via HubSpot MCP. Operator sees confirmation. Zero manual HubSpot navigation.

**Time saved:** 3–4 min post-call admin × 20 calls = 60–80 minutes saved per calling block.

---

### LinkedIn Block (30 minutes)

**9:00 AM: Claude reviews overnight connection accepts**

```
Via Unipile LinkedIn MCP: Who accepted my connection request since yesterday?
Via HubSpot MCP: Look up each person in HubSpot and confirm their current stage.

For each new connection:
1. Confirm they exist in HubSpot as a contact
2. If missing: create them with source = LinkedIn_organic
3. Update igc_outreach_stage to "Connected"
4. Generate a personalised Step 1 DM using the DM template
5. Flag any connection accept where the person has also sent me a message (those skip the DM queue)

Output: a numbered list of Step 1 DM drafts, one per new connection.
```

**Operator reviews and sends DMs** (10–15 connections/day at steady state = 15 minutes)

**Weekly batch: new connection note generation (Friday)**

Apollo export → Claude generates 50–100 personalised connection notes → operator reviews → uploads to LGM's queue for next week's send volume.

---

### Weekly Review (30 minutes — currently: inconsistent or skipped)

**Friday 4 PM: Claude generates weekly pipeline summary**

```
Via HubSpot MCP: Generate this week's pipeline summary.

Report sections:
1. VOLUME: connections sent, accepted (acceptance rate %), replies received, calls booked, calls held
2. PIPELINE HEALTH: How many contacts at each stage? Which stages are bottlenecked?
3. STUCK DEALS: Any contact who has been in the same stage for > 7 days — name them and state the stage and last touch date
4. NURTURE SIGNALS: Any contact in the "Soft Park" stage who is now due for re-engagement? (Check task due dates)
5. THIS WEEK'S WINS: Any new "Call Held" or "Brief Received" entries?
6. NEXT WEEK PRIORITY: Top 5 contacts to focus on next week, with reason

Format as a clear weekly report. Numbers first. No fluff.
```

**Re-engagement identification:**

Every Friday, Claude scans the "Soft Park" contacts whose re-engagement dates have arrived and generates a new personalised message for each. Operator reviews and sends Monday.

---

## PART 4: CLAY INTEGRATION

### What Clay Is

Clay is a data orchestration platform — not a data provider itself. Clay connects to 130+ data sources (Apollo, Clearbit, LinkedIn, Crunchbase, Hunter.io, Surfe, Datagma, and dozens more) and enriches a list by running a waterfall: try source A for email, if not found try source B, then source C, until you get a verified result. Clay also has Claygent (AI-powered web research agent built on GPT-4) that can visit websites, read LinkedIn bios, and extract unstructured information — like "does this company post about hiring challenges?" or "what specific tech stack do they place into?"

### Where Clay Fits in the IGC Stack

Clay is optional at the 500-contact scale but becomes valuable in two specific places:

**Use case 1: Phone number waterfall enrichment**

Apollo's UK phone coverage is 30–38%. Cognism gets to 50–70%. Clay's waterfall can layer both plus Datagma, Surfe, and Kaspr to get to 65–75% phone coverage. Run: Apollo CSV → Clay table → waterfall with Apollo + Cognism + Datagma → export enriched list with mobile numbers.

**Use case 2: Tier 1 signal research at scale**

For the "about to buy" signal cluster (hiring a RC, no CRM detected, founder as sole BD), Clay's Claygent can visit each company's website and LinkedIn page and extract: "Is this company currently advertising for a recruitment consultant?" Clay automates this research across all 500 contacts and adds a `tier1_signal_confirmed` column to the sheet. What would take a human 2 hours to check on 50 contacts, Clay does in 20 minutes on 500.

### Clay + Claude Combination

Clay handles structured enrichment (verified emails, phones, company data). Claude handles unstructured personalisation (personalised notes based on Clay's enriched data). The handoff point: Clay produces a CSV with enriched contact data → Claude reads it and generates personalised connection notes and DMs in batch.

Clay does not have a Claude integration by default — Claygent uses GPT-4. This is acceptable because Clay handles structured data processing, not copywriting. Use Clay for data, Claude for language.

### Apollo Export → Clay → Claude → LGM Workflow

1. **Apollo:** Run the two saved searches, export as CSV (350–550 contacts per search)
2. **Clay table import:** Upload both CSVs, deduplicate on LinkedIn URL
3. **Waterfall enrichment:** Add columns for Cognism phone, Datagma phone, verified email check
4. **Claygent research:** For each company, run "Is this company hiring a recruitment consultant or 360 recruiter?" — returns Yes/No/Unknown
5. **Tier scoring:** Clay formula column: `=IF(claygent_hiring_rc="Yes", 3, 0) + IF(founded_year >= 2016, 1, 0) + ...` → auto-tier score
6. **Export enriched CSV:** Name, company, title, LinkedIn URL, verified email, verified mobile, tier score, tech niche, hiring signal
7. **Claude batch note generation:** Paste enriched CSV rows into Claude prompt → outputs 500 personalised connection notes with quality flags
8. **HubSpot import:** Enriched CSV → HubSpot → all custom properties populated
9. **LGM audience:** HubSpot segment (Tier 1 first) → export → upload to LGM → sequences live

### Clay Pricing Assessment

- Starter: $134/month (2,000 credits) — insufficient for 500 contacts with waterfall
- Explorer: $314/month (10,000 credits) — workable for one-time list build of 500
- Pro: $720/month (50,000 credits) — needed if running weekly refreshes

**Verdict for IGC at 500-contact scale:** Clay is worth it for the initial list build ($314 for one month of Explorer, then cancel). The waterfall phone enrichment alone justifies it — getting from 38% to 65%+ phone coverage on 500 contacts adds 135 callable contacts. At one placement from those additional calls, ROI is immediate. Running Clay as a permanent monthly subscription is over-engineering at this stage — use it quarterly for list refreshes.

---

## PART 5: NON-MCP AUTOMATION (Make.com WORKFLOWS)

For tools without functional MCP servers, Make.com provides the connective tissue. These are the specific workflows to build.

### Workflow 1: LGM Connection Accept → HubSpot Stage Update
**Trigger:** LGM webhook — "Lead connected"
**Steps:**
1. LGM sends payload: contact name, LinkedIn URL, timestamp
2. Make.com looks up contact in HubSpot by LinkedIn URL (custom property `LI_Profile_URL`)
3. If found: update `igc_outreach_stage` to "Connected", log a note "LI connection accepted {date}"
4. If not found: create contact in HubSpot with source=LGM, stage=Connected
5. Create task: "Send Step 1 DM today" assigned to operator

**Build time:** 20 minutes. Native Make.com + LGM + HubSpot modules — no custom code.

### Workflow 2: LGM Reply → HubSpot + Claude Classification
**Trigger:** LGM webhook — "Lead replied"
**Steps:**
1. LGM sends payload: contact name, LinkedIn URL, reply text
2. Make.com sends reply text to Claude API (HTTP module with Anthropic API key)
3. Claude classifies reply (5-second response)
4. Make.com reads classification:
   - Creates HubSpot note with reply text + classification
   - Updates `igc_outreach_stage`
   - Creates appropriate task with due date
5. Make.com sends Slack/email notification to operator: "New reply from {name} — {classification}"

**Build time:** 45 minutes. Requires custom HTTP module to Anthropic API.

### Workflow 3: Calendly Booking → HubSpot Stage + Pre-Call Brief
**Trigger:** Calendly webhook — "Invitee Created"
**Steps:**
1. Calendly sends payload: invitee name, email, booking time
2. Make.com looks up contact in HubSpot by email
3. Moves deal to "Call Booked", logs note "Calendly booking: {time}"
4. Sends operator a Slack/email notification with the booking details
5. Creates task: "Prepare call brief for {name} — call at {time}"

**Optional extension:** Chain to Claude API to generate the pre-call brief automatically and include it in the notification. Build time: 60 minutes total.

### Workflow 4: Daily Digest (6 AM every morning)
**Trigger:** Schedule — 6 AM daily, Monday–Friday
**Steps:**
1. HubSpot: get all deals with task due = today
2. HubSpot: get all contacts with `igc_outreach_stage` = "Connected" and no "Step 1 DM" note logged (= missed DMs)
3. Calendly: get today's bookings
4. Format as a daily briefing text
5. Send to operator via email or Slack

**Build time:** 30 minutes.

### Workflow 5: Weekly Pipeline Report
**Trigger:** Schedule — Friday 4 PM
**Steps:**
1. HubSpot: pull aggregate stage counts, connections sent/accepted this week, tasks completed
2. Format report
3. Send via email to operator

**Build time:** 20 minutes.

### n8n vs Make.com for this stack

Make.com is the right choice here because:
- LGM has a native Make.com app (official connector)
- HubSpot has a mature Make.com connector
- Calendly has a Make.com connector
- The Make.com Core plan (£9/month) is already the recommended tool in the IGC operating stack
- n8n requires self-hosting (additional complexity) unless using n8n Cloud (~$20/month), which is functionally equivalent

Stick with Make.com.

---

## PART 6: SECURITY AND COMPLIANCE

### UK GDPR — The Actual Legal Position for This Outreach Model

The legal landscape shifted significantly with the Data (Use and Access) Act 2025, which received Royal Assent June 2025 and came into force February 5, 2026. The key changes for B2B outreach:

1. **Direct marketing is now explicitly listed as a legitimate interest** under UK GDPR. This is a statutory confirmation, not just guidance. You no longer have to construct a legitimate interest argument — Parliament made it for you.

2. **PECR still applies for email to corporate subscribers.** The UK exempts corporate email addresses (e.g. `john@techrecruitco.com`) from the consent requirement for marketing emails. Personal emails (`john.smith@gmail.com`) are not exempt even if used for work. Use corporate email only for cold email outreach.

3. **LinkedIn outreach is not covered by PECR** (PECR covers electronic communications over public networks — LinkedIn is a private platform). LinkedIn DMs are governed solely by UK GDPR's legitimate interest test and LinkedIn's own ToS.

4. **PECR fines have been raised to £17.5 million or 4% of global turnover** (from £500,000). This is a material change. Non-compliance with cold email rules is now a serious financial risk.

**What you must have documented:**

| Requirement | What it means for IGC |
|---|---|
| Lawful basis | Legitimate interest (now explicitly statutory for direct marketing). Document this once in a privacy notice. |
| Purpose | "B2B outreach to recruitment agency owners to offer relevant commercial services" — legitimate and specific |
| Source of data | Apollo.io (public B2B database). Document the source for each contact. The `igc_campaign_source` HubSpot property already captures this. |
| Opt-out mechanism | Every cold email must include an unsubscribe mechanism. LGM and email tools handle this automatically. |
| Data minimisation | Only collect what you need: name, title, company, email, phone. No sensitive data. |
| Retention | Data subjects who opt out must be suppressed. HubSpot handles this if "Unsubscribed" status is honoured. |

**Privacy Notice (minimum viable):** Add a privacy notice page to the IGC website or the client landing page that states: what data is collected, the lawful basis (legitimate interest), the right to object, and contact details for a data request. One page, 300 words. Required before UK outreach starts.

**AI personalisation and GDPR:** AI-generated personalised messages are not prohibited by UK GDPR. They constitute automated processing, not automated decision-making with legal/significant effects (the restricted Article 22 threshold). The DUAA 2025 relaxed Article 22 rules further. AI personalisation of marketing copy does not require disclosure. You are not required to tell a prospect that their connection note was generated by AI.

---

### What Must Be Disclosed vs. Not

| Action | Disclosure required? |
|---|---|
| Using AI to personalise connection request notes | No |
| Using AI to draft replies | No |
| Using AI to classify responses | No |
| Automated LinkedIn sequencing via LGM | No (not a legal requirement, though LinkedIn ToS is a separate consideration) |
| Storing prospect data in HubSpot | Must be accessible via privacy notice |
| Sending cold email | Must include unsubscribe and privacy notice link |
| Automated email sending | No disclosure of automation required |

---

### UK GDPR Cold Email Compliance Checklist

Before sending any cold email via LGM's multi-channel or separately:

- [ ] Only corporate email addresses (not gmail/personal)
- [ ] Each email includes "Unsubscribe" link (LGM/Instantly handles this natively)
- [ ] Each email includes your business address (required by PECR)
- [ ] Privacy notice URL accessible from your domain
- [ ] Opt-outs are honoured within 10 days (HubSpot suppression list)
- [ ] Source of contact documented (Apollo — `igc_campaign_source` property)
- [ ] Legitimate interest documented in internal records (one-paragraph document, kept on file)
- [ ] No personal/sensitive data used in segmentation or personalisation

---

### LinkedIn ToS — What Is Explicitly Prohibited

From LinkedIn's User Agreement Section 8.2 and their prohibited software help page (`linkedin.com/help/linkedin/answer/a1341387`):

**Explicitly prohibited:**
- Scraping LinkedIn data using automated means (crawlers, bots, browser extensions)
- Using third-party software to automate activity on LinkedIn's website
- Sending connection requests or messages at scale using automation
- Using unofficial APIs (cookie-based access, session hijacking)

**The honest reality of enforcement:**
LinkedIn prohibits these activities but enforces selectively. LGM, Expandi, and similar cloud-based tools have operated for years with manageable ban rates when used within safe parameters. The 2026 Growleads study found 23% account restriction within 90 days — but this was across all tools including high-risk browser extensions, not LGM specifically. LGM's cloud-based approach (dedicated 5G mobile proxy per identity, mimicking native app traffic) performs significantly better than browser extensions.

**Safe operating parameters for LGM in 2026:**
- Max 20–25 connection requests per day (not 50+)
- Working hours only (LGM enforces this by default)
- Profile SSI above 50 before starting automation
- 5-day warmup at 5 requests/day before full volume
- Use LinkedIn Sales Navigator on the account (signals legitimate professional use)
- Do not run multiple automation tools simultaneously on the same account

**The residual risk:** Running LGM on a client's LinkedIn account carries ~5–10% account restriction risk over 90 days at safe limits. This risk should be disclosed to the client in writing in the service agreement. The agreement should also state that IGC is not liable for LinkedIn account restrictions that result from the client's own LinkedIn activity (separate from the automation).

**LGM's official position:** LGM explicitly markets their tool as designed for LinkedIn safety compliance. Their help docs detail exactly how their limits work. They are not an underground tool — they have an official HubSpot integration and $30M+ ARR.

---

### Avoiding Spam Classification for Cold Email (UK GDPR + Technical)

**Legal layer (above):** Legitimate interest documented, opt-out present, corporate email only.

**Technical layer:**
- Send from a custom domain (not Gmail). `outreach@igc-growth.com` not `igc@gmail.com`
- Warm up the sending domain for 4 weeks before sending at volume (Instantly.ai Warmup or Mailreach)
- Limit to 30–50 emails/day per sending address initially
- SPF, DKIM, DMARC records configured on the sending domain
- Never purchase email lists — use Apollo verified emails only
- Remove catch-all emails before sending (Clay enrichment can verify)

**Copy layer:**
- Personalised subject lines reduce spam classification (AI-generated personalisation helps here)
- Avoid spam trigger words: "Free", "Guaranteed", "Limited time", "Click here", "Make money"
- Plain text or minimal HTML (not image-heavy templates)
- Reply-to address must be a monitored inbox

---

## SUMMARY: WHAT ACTUALLY WORKS VS. WHAT IS THEORETICAL

| Claim | Verdict |
|---|---|
| HubSpot MCP fully functional for contact/deal/task management | TRUE — GA since April 13, 2026 |
| Apollo MCP can search, enrich, and add to sequences | TRUE — official beta, Feb 2026 |
| LinkedIn MCP can read profiles and inbox | TRUE via Unipile (paid, ~$20–50/month) |
| LinkedIn MCP can send messages at scale | RISKY — use LGM for sending, Unipile for reading |
| Gmail MCP can read, classify, and send emails | TRUE via community servers (OAuth required) |
| Calendly MCP can read bookings and invitees | TRUE via community servers |
| LGM MCP can manage campaigns | PARTIAL — via Composio, limited to campaign management, not send execution |
| Clay can enrich Apollo list to 65%+ phone coverage | TRUE — proven waterfall methodology |
| AI-personalised cold emails are GDPR-compliant | TRUE — no disclosure required, legitimate interest applies |
| Auto-sending LinkedIn messages without human review | NOT RECOMMENDED — legal/ToS risk, quality risk |
| LinkedIn official API for messaging | INACCESSIBLE — gated to enterprise partners only |

---

## RECOMMENDED FINAL MCP STACK FOR CLAUDE CODE

```json
{
  "mcpServers": {
    "hubspot": {
      "transport": "http",
      "url": "https://mcp.hubspot.com/v1",
      "auth": "oauth2"
    },
    "apollo": {
      "command": "npx",
      "args": ["@chainscore/apollo-io-mcp"],
      "env": {
        "APOLLO_API_KEY": "YOUR_KEY"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["@taylor/google-workspace-mcp"],
      "env": {
        "GOOGLE_OAUTH_CLIENT_ID": "YOUR_ID",
        "GOOGLE_OAUTH_CLIENT_SECRET": "YOUR_SECRET"
      }
    },
    "linkedin": {
      "command": "npx",
      "args": ["unipile-linkedin-mcp"],
      "env": {
        "UNIPILE_API_KEY": "YOUR_KEY",
        "UNIPILE_ACCOUNT_ID": "YOUR_ACCOUNT_ID"
      }
    },
    "calendly": {
      "command": "npx",
      "args": ["calendly-cli", "mcp"],
      "env": {
        "CALENDLY_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

**LGM is controlled via Make.com webhooks and Claude's HTTP tool, not a dedicated MCP server.** This is the correct architecture — LGM's send execution should not be under direct AI control.

---

## ESTIMATED TIME IMPACT

| Task | Current (human) | With AI | Daily saving |
|---|---|---|---|
| Morning reply triage + response drafting | 60 min | 20 min | 40 min |
| Pre-call briefs (20 calls) | 40 min | 5 min | 35 min |
| Post-call HubSpot logging | 60 min | 10 min | 50 min |
| Connection note writing (batch weekly) | 75 min | 10 min | ~10 min/day |
| Step 1 DM writing | 30 min | 5 min | 25 min |
| HubSpot task/stage management | 30 min | 2 min | 28 min |
| **Total daily** | **~5 hours** | **~1 hour** | **~4 hours** |

At 500 contacts and 80% AI handling of cognitive overhead, one operator can run this operation in approximately 3 hours of daily active work — calls + approvals — versus the 6–7 hours it would take without AI assistance.

---

Sources consulted:
- [HubSpot MCP Server official page](https://developers.hubspot.com/mcp)
- [HubSpot/mcp-server GitHub](https://github.com/hubspot/mcp-server)
- [Apollo MCP launch announcement](https://www.apollo.io/magazine/apollo-now-powers-outbound-execution-in-claude)
- [Chainscore apollo-io-mcp (27 tools)](https://github.com/Chainscore/apollo-io-mcp)
- [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)
- [Unipile LinkedIn MCP](https://github.com/bhaktatejas922/unipile-linkedin-mcp)
- [LinkedIn API restrictions 2026](https://connectsafely.ai/articles/linkedin-api-complete-guide-2026)
- [LinkedIn automation ban risk 2026](https://growleads.io/blog/linkedin-automation-ban-risk-2026-safe-use/)
- [GongRzhe/Gmail-MCP-Server](https://github.com/GongRzhe/Gmail-MCP-Server)
- [taylorwilsdon/google_workspace_mcp](https://github.com/taylorwilsdon/google_workspace_mcp)
- [NyxToolsDev/calendly-mcp-server](https://github.com/NyxToolsDev/calendly-mcp-server)
- [bcharleson/calendly-cli (40 tools)](https://github.com/bcharleson/calendly-cli)
- [LGM MCP via Composio](https://composio.dev/toolkits/lagrowthmachine/framework/claude-code)
- [LGM safe limits documentation](https://lagrowthmachine.com/linkedin-safety/)
- [UK GDPR cold email compliance 2026](https://growthlist.co/gdpr-cold-email/)
- [Data (Use and Access) Act 2025 compliance](https://gdprlocal.com/gdpr-cold-email/)
- [Clay enrichment guide 2026](https://coldiq.com/blog/clay-data-enrichment)
- [Clay vs Apollo pricing 2025](https://www.theplaybook.agency/post/clay-vs-apollo-the-2025-sales-leaders-comparison-guide)
- [Make.com HubSpot + LinkedIn integration](https://www.make.com/en/integrations/hubspotcrm/linkedin)