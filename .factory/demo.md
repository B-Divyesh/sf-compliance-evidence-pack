# Deadline Packet demo contract

## Entry points

- Production: <https://compliance-evidence-pack.sociobot.in/demo>
- Equivalent query entry: `/?demo=1`
- Local: `http://127.0.0.1:5173/demo`

The cold landing exposes **Try it with sample data** in one click.

## Sample

The demo opens an Apr–Jun 2026 cross-border evidence packet for a fictional
freelancer. It includes an accountant contact, a review note, seven checklist
items, four visible evidence gaps, two accountant questions, and two sample
files. Files contain explicit sample text and no real person’s data.

## Isolation and reset

Demo changes stay in a separate browser store named `deadline-packet-demo` and
use the localStorage key prefix `demo:`. Real work uses a different browser
store and non-demo current-packet key. Demo mode never reads or writes real
packet stores.

The persistent banner identifies demo mode. **Reset demo** clears only demo
stores and reseeds the original sample. **Start for real** deletes demo changes
before loading the real workspace. Browser-context teardown also provides a
clean verifier sandbox.

## Claim verification

Every command in `.factory/claims.json` begins from `/demo`. The tests cover
isolation, local-only network behavior, encryption, exports/import, live gaps,
offline reload/edit/export, and the paid boundary.
