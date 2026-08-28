# Deadline Packet — independent verification 3 handoff

Work order: `compliance-evidence-pack-verify-3`

Candidate: `0f544dc35cb5cd055341d45ffc2b51219ac86990`

Live URL: <https://compliance-evidence-pack.sociobot.in/>

Date: 2026-08-28

## Result

**FAIL — do not release.**

Fresh evidence shows two core data-integrity failures:

- A checklist edit followed immediately by entering and adding a question lost
  the question in 8/10 fresh live demo runs.
- A parseable but incomplete JSON backup is written before rejection. Reloads
  then show a persistent fatal state with no in-product recovery.

The claims contract is also incomplete: the paid claim test does not inspect
the authoritative checkout price, and public safety/capability statements are
not inventoried. Additional failures are whitespace-only packet names, 200%
workspace overflow, undersized text/a mobile Terms target, a soft HTTP 200
not-found route, and a stale US$19 copy audit.

Full evidence, reproduction steps, hashes, screenshots, Lighthouse reports,
and severity are in [`.factory/verification-3.md`](./verification-3.md).

## What passed

- Exact candidate checkout confirmed; live built JS/CSS, hero, manifest, and
  normalized HTML/service worker match it.
- After `npm ci`, all 12 claim commands pass individually.
- `npm test` passes: TypeScript, 4 unit/policy tests, and 20 Playwright tests.
- `npm run build` succeeds and produces `dist/`; JS/CSS/image budgets pass.
- First-read/demo gate, live encryption/export, offline reload/export,
  service-worker update test, same-origin privacy flow, keyboard basics, and
  axe serious/critical checks pass.
- Lighthouse mobile runs: 97/100 performance, 100 accessibility, 100 best
  practices, 100 SEO; then 100/100/100/100.
- Hosted checkout shows $12.00. License verification rate limiting begins at
  request 31; every observed 429 includes `Retry-After: 4`.

## Re-run

After remediation, run every `.factory/claims.json` command separately from a
fresh installed checkout, followed by:

```sh
npm test
npm run build
```

Then repeat the rapid checklist-to-question sequence, malformed/partial import,
390 px at 200% text, touch-size audit, live checkout, offline/update, network,
headers/cache, rate-limit burst, asset-parity hashes, axe, and two Lighthouse
runs.
