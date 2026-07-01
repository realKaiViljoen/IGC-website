#!/usr/bin/env node
// IGC client schema compiler.
//
// Reads   data/schemas/{uid}.yaml
// Writes  data/clients/{uid}.ts        (a TypeScript module exporting `client: ClientData`)
//
// Runtime invariants (strict; no soft-fails):
//   - required top-level fields present
//   - every enum value legal
//   - conversations[].prospect_id resolves to an existing prospects[].id
//   - prospects[].stage is in engagement.stage_config.stages
//   - hypothesis_thread[].text length <= 140
//   - handover[].key is one of the 6 canonical keys
//   - every date string is ISO 8601 (YYYY-MM-DD or full RFC3339)
//   - engagement.data_source defaults to "manual" when missing
//
// Usage:
//   node scripts/compile-schema.mjs {uid}
//   node scripts/compile-schema.mjs --all
//
// Exit codes: 0 = success, 1 = validation / IO / argument error.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, "..")
const SCHEMA_DIR = join(ROOT, "data", "schemas")
const CLIENTS_DIR = join(ROOT, "data", "clients")

// --- Enums mirrored from types/client.ts. Update together. --------------------

const NICHE_KINDS = ["msp", "recruitment"]
const ENGAGEMENT_PHASES = ["build", "launch", "operate", "handover", "archive"]
const ENGAGEMENT_STATUSES = ["active", "on-hold", "complete"]
const DATA_SOURCES = ["manual", "live"]
const CURRENCIES = ["GBP", "USD", "ZAR"]
const ACTORS = ["kc", "automation", "client"]
const ACTIVITY_SOURCES = ["hubspot", "lgm", "gmail", "cal", "make", "manual"]
const COMMITMENT_AUTHORS = ["kc", "client"]
const HANDOVER_KEYS = [
  "outreach-sequences",
  "crm-config",
  "copy-library",
  "prospect-list",
  "landing-page",
  "sops-attestation",
]
const HANDOVER_STATES = [
  "not-started",
  "in-progress",
  "ready-for-review",
  "shipped",
  "transferred",
]
const TIERS = [1, 2, 3]

// --- Validation ---------------------------------------------------------------

class SchemaError extends Error {
  constructor(file, path, message) {
    super(`${file}: ${path} — ${message}`)
    this.name = "SchemaError"
  }
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v)
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.length > 0
}

function isIsoDate(v) {
  // Accept YYYY-MM-DD or a full ISO 8601 date-time.
  if (typeof v !== "string") return false
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(v + "T00:00:00Z")
    return !Number.isNaN(d.getTime())
  }
  const d = new Date(v)
  return !Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(v)
}

function requireField(file, obj, path, key, predicate, hint) {
  if (!(key in obj)) {
    throw new SchemaError(file, `${path}.${key}`, `missing required field`)
  }
  if (!predicate(obj[key])) {
    throw new SchemaError(file, `${path}.${key}`, hint)
  }
}

function requireEnum(file, obj, path, key, allowed) {
  if (!(key in obj)) {
    throw new SchemaError(file, `${path}.${key}`, `missing required field`)
  }
  if (!allowed.includes(obj[key])) {
    throw new SchemaError(
      file,
      `${path}.${key}`,
      `value ${JSON.stringify(obj[key])} not in ${JSON.stringify(allowed)}`,
    )
  }
}

function validate(file, raw) {
  if (!isPlainObject(raw)) {
    throw new SchemaError(file, "(root)", "schema must be a YAML mapping at the top level")
  }

  // --- Top-level required fields.
  requireField(file, raw, "", "uid", isNonEmptyString, "must be a non-empty string")
  requireField(file, raw, "", "company", isNonEmptyString, "must be a non-empty string")
  requireField(file, raw, "", "contactName", isNonEmptyString, "must be a non-empty string")
  requireField(file, raw, "", "contactEmail", isNonEmptyString, "must be a non-empty string")
  requireField(file, raw, "", "role", isNonEmptyString, "must be a non-empty string")
  requireField(file, raw, "", "engagement", isPlainObject, "must be a mapping")
  requireField(file, raw, "", "prospects", Array.isArray, "must be an array")
  requireField(file, raw, "", "conversations", Array.isArray, "must be an array")
  requireField(file, raw, "", "commitments", Array.isArray, "must be an array")
  requireField(file, raw, "", "activity", Array.isArray, "must be an array")
  requireField(file, raw, "", "hypothesis_thread", Array.isArray, "must be an array")
  requireField(file, raw, "", "handover", Array.isArray, "must be an array")
  requireField(file, raw, "", "briefings", Array.isArray, "must be an array")

  // --- Engagement.
  const e = raw.engagement
  requireField(file, e, "engagement", "title", isNonEmptyString, "must be a non-empty string")
  requireField(file, e, "engagement", "startDate", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
  requireField(
    file,
    e,
    "engagement",
    "totalDays",
    (v) => Number.isInteger(v) && v > 0,
    "must be a positive integer",
  )
  requireEnum(file, e, "engagement", "phase", ENGAGEMENT_PHASES)
  requireEnum(file, e, "engagement", "status", ENGAGEMENT_STATUSES)
  requireField(file, e, "engagement", "consultant", isNonEmptyString, "must be a non-empty string")
  requireField(file, e, "engagement", "timezone", isNonEmptyString, "must be an IANA timezone")
  requireField(
    file,
    e,
    "engagement",
    "guarantee_target",
    (v) => Number.isInteger(v) && v > 0,
    "must be a positive integer (typically 5)",
  )
  // data_source defaults to "manual" when missing.
  if (!("data_source" in e) || e.data_source === null) {
    e.data_source = "manual"
  }
  if (!DATA_SOURCES.includes(e.data_source)) {
    throw new SchemaError(
      file,
      "engagement.data_source",
      `value ${JSON.stringify(e.data_source)} not in ${JSON.stringify(DATA_SOURCES)}`,
    )
  }
  // day seed: optional. Default to 1; runtime recomputes anyway.
  if (!("day" in e) || e.day === null || e.day === undefined) {
    e.day = 1
  }
  if (!Number.isInteger(e.day) || e.day < 1) {
    throw new SchemaError(file, "engagement.day", "if set, must be an integer >= 1")
  }

  // --- stage_config.
  requireField(file, e, "engagement", "stage_config", isPlainObject, "must be a mapping")
  const sc = e.stage_config
  requireEnum(file, sc, "engagement.stage_config", "niche", NICHE_KINDS)
  requireField(
    file,
    sc,
    "engagement.stage_config",
    "stages",
    (v) => Array.isArray(v) && v.length > 0 && v.every(isNonEmptyString),
    "must be a non-empty array of strings",
  )
  requireField(
    file,
    sc,
    "engagement.stage_config",
    "guarantee_qualifier_label",
    isNonEmptyString,
    "must be a non-empty string",
  )
  requireField(
    file,
    sc,
    "engagement.stage_config",
    "qualified_stage_index",
    (v) => Number.isInteger(v) && v >= 0 && v < sc.stages.length,
    `must be an integer index into stages[] (0..${sc.stages.length - 1})`,
  )

  const validStages = sc.stages
  const stageList = JSON.stringify(validStages)

  // --- Prospects.
  const prospectIds = new Set()
  raw.prospects.forEach((p, i) => {
    const path = `prospects[${i}]`
    if (!isPlainObject(p)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, p, path, "id", isNonEmptyString, "must be a non-empty string")
    if (prospectIds.has(p.id)) {
      throw new SchemaError(file, `${path}.id`, `duplicate prospect id ${JSON.stringify(p.id)}`)
    }
    prospectIds.add(p.id)
    requireField(file, p, path, "company", isNonEmptyString, "must be a non-empty string")
    requireField(file, p, path, "name", isNonEmptyString, "must be a non-empty string")
    requireField(file, p, path, "role", isNonEmptyString, "must be a non-empty string")
    requireField(file, p, path, "stage", isNonEmptyString, "must be a non-empty string")
    if (!validStages.includes(p.stage)) {
      throw new SchemaError(
        file,
        `${path}.stage`,
        `value ${JSON.stringify(p.stage)} not in stage_config.stages. Valid values: ${stageList}`,
      )
    }
    requireField(file, p, path, "last_touch", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(
      file,
      p,
      path,
      "estimated_contract_value_cents",
      (v) => Number.isInteger(v) && v >= 0,
      "must be a non-negative integer (minor units / pence)",
    )
    requireEnum(file, p, path, "currency", CURRENCIES)
    if ("tier" in p && p.tier !== null && !TIERS.includes(p.tier)) {
      throw new SchemaError(file, `${path}.tier`, `must be 1, 2, or 3 if set`)
    }
    if ("hubspot_deal_url" in p && p.hubspot_deal_url !== null && !isNonEmptyString(p.hubspot_deal_url)) {
      throw new SchemaError(file, `${path}.hubspot_deal_url`, "must be a non-empty string if set")
    }
    if ("apollo_id" in p && p.apollo_id !== null && !isNonEmptyString(p.apollo_id)) {
      throw new SchemaError(file, `${path}.apollo_id`, "must be a non-empty string if set")
    }
  })

  // --- Conversations.
  const conversationIds = new Set()
  raw.conversations.forEach((c, i) => {
    const path = `conversations[${i}]`
    if (!isPlainObject(c)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, c, path, "id", isNonEmptyString, "must be a non-empty string")
    if (conversationIds.has(c.id)) {
      throw new SchemaError(file, `${path}.id`, `duplicate conversation id ${JSON.stringify(c.id)}`)
    }
    conversationIds.add(c.id)
    requireField(file, c, path, "prospect_id", isNonEmptyString, "must be a non-empty string")
    if (!prospectIds.has(c.prospect_id)) {
      throw new SchemaError(
        file,
        `${path}.prospect_id`,
        `${JSON.stringify(c.prospect_id)} does not reference an existing prospects[].id`,
      )
    }
    requireField(file, c, path, "held_at", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(file, c, path, "qualified", (v) => typeof v === "boolean", "must be boolean")
    requireField(
      file,
      c,
      path,
      "counts_toward_guarantee",
      (v) => typeof v === "boolean",
      "must be boolean",
    )
    if ("tier" in c && c.tier !== null && !TIERS.includes(c.tier)) {
      throw new SchemaError(file, `${path}.tier`, "must be 1, 2, or 3 if set")
    }
    if (
      "qualification_notes" in c &&
      c.qualification_notes !== null &&
      !isNonEmptyString(c.qualification_notes)
    ) {
      throw new SchemaError(file, `${path}.qualification_notes`, "must be a non-empty string if set")
    }
    if ("transcript_url" in c && c.transcript_url !== null && !isNonEmptyString(c.transcript_url)) {
      throw new SchemaError(file, `${path}.transcript_url`, "must be a non-empty string if set")
    }
  })

  // --- Commitments.
  raw.commitments.forEach((m, i) => {
    const path = `commitments[${i}]`
    if (!isPlainObject(m)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, m, path, "promise", isNonEmptyString, "must be a non-empty string")
    requireField(file, m, path, "due", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(file, m, path, "met", (v) => typeof v === "boolean", "must be boolean")
    requireEnum(file, m, path, "author", COMMITMENT_AUTHORS)
    if ("met_at" in m && m.met_at !== null && m.met_at !== undefined && !isIsoDate(m.met_at)) {
      throw new SchemaError(file, `${path}.met_at`, "must be ISO 8601 (YYYY-MM-DD) if set")
    }
    if (m.met === true && !m.met_at) {
      throw new SchemaError(file, `${path}.met_at`, "required when met is true")
    }
  })

  // --- Activity.
  raw.activity.forEach((a, i) => {
    const path = `activity[${i}]`
    if (!isPlainObject(a)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, a, path, "date", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(file, a, path, "entry", isNonEmptyString, "must be a non-empty string")
    if ("actor" in a && a.actor !== null && a.actor !== undefined) {
      if (!ACTORS.includes(a.actor)) {
        throw new SchemaError(
          file,
          `${path}.actor`,
          `value ${JSON.stringify(a.actor)} not in ${JSON.stringify(ACTORS)}`,
        )
      }
    }
    if ("source" in a && a.source !== null && a.source !== undefined) {
      if (!ACTIVITY_SOURCES.includes(a.source)) {
        throw new SchemaError(
          file,
          `${path}.source`,
          `value ${JSON.stringify(a.source)} not in ${JSON.stringify(ACTIVITY_SOURCES)}`,
        )
      }
    }
    if ("link" in a && a.link !== null && a.link !== undefined && !isNonEmptyString(a.link)) {
      throw new SchemaError(file, `${path}.link`, "must be a non-empty string if set")
    }
  })

  // --- Hypothesis thread.
  raw.hypothesis_thread.forEach((h, i) => {
    const path = `hypothesis_thread[${i}]`
    if (!isPlainObject(h)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, h, path, "id", isNonEmptyString, "must be a non-empty string")
    requireField(file, h, path, "created_at", isIsoDate, "must be ISO 8601 (date-time)")
    requireField(file, h, path, "text", isNonEmptyString, "must be a non-empty string")
    if (h.text.length > 140) {
      throw new SchemaError(
        file,
        `${path}.text`,
        `length is ${h.text.length}; must be <= 140 characters`,
      )
    }
    requireField(file, h, path, "fix_action", isNonEmptyString, "must be a non-empty string")
    requireField(file, h, path, "fix_date", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    if (h.author !== "kc") {
      throw new SchemaError(file, `${path}.author`, `must be "kc"`)
    }
  })

  // --- Handover.
  const seenKeys = new Set()
  raw.handover.forEach((h, i) => {
    const path = `handover[${i}]`
    if (!isPlainObject(h)) throw new SchemaError(file, path, "must be a mapping")
    requireEnum(file, h, path, "key", HANDOVER_KEYS)
    if (seenKeys.has(h.key)) {
      throw new SchemaError(file, `${path}.key`, `duplicate handover key ${JSON.stringify(h.key)}`)
    }
    seenKeys.add(h.key)
    requireField(file, h, path, "name", isNonEmptyString, "must be a non-empty string")
    requireEnum(file, h, path, "state", HANDOVER_STATES)
    if ("shipped_at" in h && h.shipped_at !== null && h.shipped_at !== undefined && !isIsoDate(h.shipped_at)) {
      throw new SchemaError(file, `${path}.shipped_at`, "must be ISO 8601 (YYYY-MM-DD) if set")
    }
    if (
      "transferred_at" in h &&
      h.transferred_at !== null &&
      h.transferred_at !== undefined &&
      !isIsoDate(h.transferred_at)
    ) {
      throw new SchemaError(file, `${path}.transferred_at`, "must be ISO 8601 (YYYY-MM-DD) if set")
    }
    if ("artifact_url" in h && h.artifact_url !== null && h.artifact_url !== undefined && !isNonEmptyString(h.artifact_url)) {
      throw new SchemaError(file, `${path}.artifact_url`, "must be a non-empty string if set")
    }
  })

  // --- Briefings.
  raw.briefings.forEach((b, i) => {
    const path = `briefings[${i}]`
    if (!isPlainObject(b)) throw new SchemaError(file, path, "must be a mapping")
    requireField(file, b, path, "id", isNonEmptyString, "must be a non-empty string")
    requireField(file, b, path, "week_of", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(file, b, path, "loom_url", isNonEmptyString, "must be a non-empty string")
    requireField(file, b, path, "written_summary_md", isNonEmptyString, "must be a non-empty string")
    requireField(
      file,
      b,
      path,
      "authored_by_kc_at",
      isIsoDate,
      "must be ISO 8601 (date-time)",
    )
    if (
      "loom_duration_seconds" in b &&
      b.loom_duration_seconds !== null &&
      b.loom_duration_seconds !== undefined &&
      !(Number.isInteger(b.loom_duration_seconds) && b.loom_duration_seconds >= 0)
    ) {
      throw new SchemaError(
        file,
        `${path}.loom_duration_seconds`,
        "must be a non-negative integer if set",
      )
    }
    if (
      "loom_thumbnail" in b &&
      b.loom_thumbnail !== null &&
      b.loom_thumbnail !== undefined &&
      !isNonEmptyString(b.loom_thumbnail)
    ) {
      throw new SchemaError(file, `${path}.loom_thumbnail`, "must be a non-empty string if set")
    }
  })

  // --- Optional next_briefing.
  if ("next_briefing" in raw && raw.next_briefing !== null && raw.next_briefing !== undefined) {
    const nb = raw.next_briefing
    if (!isPlainObject(nb)) {
      throw new SchemaError(file, "next_briefing", "if set, must be a mapping")
    }
    requireField(file, nb, "next_briefing", "date", isIsoDate, "must be ISO 8601 (YYYY-MM-DD)")
    requireField(file, nb, "next_briefing", "description", isNonEmptyString, "must be a non-empty string")
  }

  return raw
}

// --- Output serialization -----------------------------------------------------

// Build a typed ClientData object out of the validated YAML, in a stable key order.
// We construct by hand rather than dumping arbitrary YAML so the output is:
//   (a) canonical (diff-stable),
//   (b) free of YAML-specific coercions,
//   (c) limited to declared ClientData fields (anything unknown is dropped cleanly).
function project(raw) {
  const stripUndefined = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

  const engagement = stripUndefined({
    title: raw.engagement.title,
    startDate: raw.engagement.startDate,
    day: raw.engagement.day,
    totalDays: raw.engagement.totalDays,
    phase: raw.engagement.phase,
    status: raw.engagement.status,
    consultant: raw.engagement.consultant,
    timezone: raw.engagement.timezone,
    stage_config: {
      niche: raw.engagement.stage_config.niche,
      stages: raw.engagement.stage_config.stages.slice(),
      guarantee_qualifier_label: raw.engagement.stage_config.guarantee_qualifier_label,
      qualified_stage_index: raw.engagement.stage_config.qualified_stage_index,
    },
    guarantee_target: raw.engagement.guarantee_target,
    data_source: raw.engagement.data_source,
  })

  const prospects = raw.prospects.map((p) =>
    stripUndefined({
      id: p.id,
      company: p.company,
      name: p.name,
      role: p.role,
      stage: p.stage,
      last_touch: p.last_touch,
      estimated_contract_value_cents: p.estimated_contract_value_cents,
      currency: p.currency,
      hubspot_deal_url: p.hubspot_deal_url ?? undefined,
      apollo_id: p.apollo_id ?? undefined,
      tier: p.tier ?? undefined,
    }),
  )

  const conversations = raw.conversations.map((c) =>
    stripUndefined({
      id: c.id,
      prospect_id: c.prospect_id,
      held_at: c.held_at,
      qualified: c.qualified,
      tier: c.tier ?? undefined,
      transcript_url: c.transcript_url ?? undefined,
      qualification_notes: c.qualification_notes ?? undefined,
      counts_toward_guarantee: c.counts_toward_guarantee,
    }),
  )

  const commitments = raw.commitments.map((m) =>
    stripUndefined({
      promise: m.promise,
      due: m.due,
      met: m.met,
      met_at: m.met_at ?? undefined,
      author: m.author,
    }),
  )

  const activity = raw.activity.map((a) =>
    stripUndefined({
      date: a.date,
      entry: a.entry,
      actor: a.actor ?? undefined,
      source: a.source ?? undefined,
      link: a.link ?? undefined,
    }),
  )

  const hypothesis_thread = raw.hypothesis_thread.map((h) =>
    stripUndefined({
      id: h.id,
      created_at: h.created_at,
      text: h.text,
      fix_action: h.fix_action,
      fix_date: h.fix_date,
      author: h.author,
    }),
  )

  const handover = raw.handover.map((h) =>
    stripUndefined({
      key: h.key,
      name: h.name,
      state: h.state,
      shipped_at: h.shipped_at ?? undefined,
      transferred_at: h.transferred_at ?? undefined,
      artifact_url: h.artifact_url ?? undefined,
    }),
  )

  const briefings = raw.briefings.map((b) =>
    stripUndefined({
      id: b.id,
      week_of: b.week_of,
      loom_url: b.loom_url,
      loom_thumbnail: b.loom_thumbnail ?? undefined,
      loom_duration_seconds: b.loom_duration_seconds ?? undefined,
      written_summary_md: b.written_summary_md,
      authored_by_kc_at: b.authored_by_kc_at,
    }),
  )

  const out = {
    uid: raw.uid,
    company: raw.company,
    contactName: raw.contactName,
    contactEmail: raw.contactEmail,
    role: raw.role,
    engagement,
    prospects,
    conversations,
    commitments,
    activity,
    hypothesis_thread,
    handover,
    briefings,
  }

  if (raw.next_briefing) {
    out.next_briefing = {
      date: raw.next_briefing.date,
      description: raw.next_briefing.description,
    }
  }

  return out
}

function serializeToTs(uid, projected) {
  // JSON.stringify gives us canonical output; TS accepts it verbatim as an object literal.
  const body = JSON.stringify(projected, null, 2)
  return [
    `// AUTO-GENERATED FROM data/schemas/${uid}.yaml`,
    `// DO NOT EDIT BY HAND. Run \`npm run compile-schema ${uid}\` to regenerate.`,
    "",
    `import type { ClientData } from "@/types/client"`,
    "",
    `export const client: ClientData = ${body}`,
    "",
  ].join("\n")
}

// --- CLI ----------------------------------------------------------------------

function compileOne(uid) {
  const schemaPath = join(SCHEMA_DIR, `${uid}.yaml`)
  if (!existsSync(schemaPath)) {
    throw new Error(`schema not found: ${schemaPath}`)
  }
  const yamlText = readFileSync(schemaPath, "utf8")

  let raw
  try {
    // JSON_SCHEMA disables the `!!timestamp` implicit resolver so that
    // bare dates like 2026-04-07 stay as strings instead of being coerced to Date.
    raw = yaml.load(yamlText, { schema: yaml.JSON_SCHEMA })
  } catch (err) {
    throw new Error(`YAML parse error in ${schemaPath}: ${err.message}`)
  }

  validate(schemaPath, raw)

  if (raw.uid !== uid) {
    throw new SchemaError(
      schemaPath,
      "uid",
      `value ${JSON.stringify(raw.uid)} does not match filename ${JSON.stringify(uid)}`,
    )
  }

  const projected = project(raw)
  const outPath = join(CLIENTS_DIR, `${uid}.ts`)
  writeFileSync(outPath, serializeToTs(uid, projected), "utf8")
  process.stdout.write(
    `Compiled data/schemas/${uid}.yaml → data/clients/${uid}.ts\n`,
  )
}

function compileAll() {
  if (!existsSync(SCHEMA_DIR)) {
    throw new Error(`schema directory not found: ${SCHEMA_DIR}`)
  }
  const files = readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".yaml"))
  if (files.length === 0) {
    process.stdout.write(`No YAML schemas found in ${SCHEMA_DIR}\n`)
    return
  }
  for (const f of files.sort()) {
    compileOne(f.replace(/\.yaml$/, ""))
  }
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    process.stderr.write(
      "Usage:\n  node scripts/compile-schema.mjs {uid}\n  node scripts/compile-schema.mjs --all\n",
    )
    process.exit(1)
  }

  try {
    if (args[0] === "--all") {
      compileAll()
    } else {
      compileOne(args[0])
    }
  } catch (err) {
    process.stderr.write(`${err.message}\n`)
    process.exit(1)
  }
}

main()
