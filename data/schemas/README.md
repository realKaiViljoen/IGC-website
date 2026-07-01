# data/schemas

YAML source of truth for client engagements flagged `data_source: manual`.

## What this directory is

One YAML file per client: `data/schemas/{uid}.yaml`. The file encodes the full `ClientData` object the portal renders — engagement, prospects, conversations, commitments, activity, hypothesis thread, handover pack, weekly briefings.

The compiler at `scripts/compile-schema.mjs` validates each schema and emits the typed TypeScript fixture at `data/clients/{uid}.ts`. The dashboard imports from there.

## Authoring a new client

1. Copy an existing file (e.g. `igc-msp-demo-001.yaml`) to `{new-uid}.yaml`.
2. Edit every field. The `uid:` inside the YAML must match the filename.
3. Add an entry for the same `uid` in `lib/auth/clients.ts` (email + bcrypt hash + contactName).
4. Compile:
   ```bash
   npm run compile-schema -- {new-uid}
   ```

On success the compiler writes `data/clients/{new-uid}.ts`. On failure it prints a one-line error and exits non-zero — no partial write.

## Compile everything

```bash
npm run compile-schemas:all
```

## What the compiler validates

Shape, enums, cross-references (prospect ids resolve), stage validity, uniqueness of ids, date format, hypothesis text length (≤ 140), handover keys, commitment coherence, filename-uid match. See `docs/design/report-schema-spec.md` for the full list.

## Full authoring spec

`docs/design/report-schema-spec.md` — every field, every enum, every constraint, with a complete example.
