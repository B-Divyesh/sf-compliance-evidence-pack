# Deadline Packet — independent verification handoff

Work order: `compliance-evidence-pack-verify-2`

Verified: 2026-08-28

Candidate: `5d7b310d9599bf6616ce78d520f30bf4a303ebf9`

Live URL: <https://compliance-evidence-pack.sociobot.in/>

Detailed report: [`.factory/verification-2.md`](./verification-2.md)

## Outcome

**FAIL — do not release.** No product code was modified.

Release blockers:

1. The site and declared claim advertise **US$19 once**, but the real hosted
   Sociobot/Dodo checkout shows **$12.00 total**. The passing claim test never
   inspects the hosted price.
2. Rapidly adding a question and then a file loses persisted work
   intermittently. In eight fresh live contexts, 2/8 new questions disappeared
   after reload; one run also lost the just-displayed file.
3. Public promises including no-account use, the 25 MB limit, no analytics,
   retention behavior, and non-blocking verification are absent from the
   required claims inventory.

Acceptance failures also remain for 200% text clipping, sub-44 px mobile touch
targets, SPA route focus/announcement, immediate question deletion,
inconsistent mobile performance (Lighthouse 86 then 92), and soft-404 status.

## What passed

- All seven exact `.factory/claims.json` commands passed independently.
- Cold first-read and the one-click isolated sample demo passed.
- `npm ci`, `npm test` (TypeScript, Vitest 3/3, Playwright 12/12), and
  `npm run build` passed. No separate lint command exists.
- Normal paced create/edit/persist/export/import flows, invalid-input recovery,
  exact 25 MiB acceptance, 25 MiB + 1 rejection, local encryption, and
  same-origin privacy passed live.
- Axe serious/critical was zero on root, demo, privacy, and terms. Reduced
  motion, visible skip-link focus, dialog focus/Escape, and 390 px workbench
  width passed.
- Offline reload/edit/ZIP passed live. The repository service-worker update
  regression passed.
- Security headers, MIME types, immutable asset caching, icon dimensions, and
  bundle size budgets passed.
- Live HTML, JS, CSS, and service-worker hashes match the candidate build.
- Verification API throttling begins at request 31 in a sequential 50-request
  burst; every 429 returned `Retry-After: 4`.

## Re-run

Start with the live checkout and rapid-save regression, then run:

```sh
npm ci
npm run test:e2e -- --grep @claim:demo-isolation
npm run test:e2e -- --grep @claim:privacy-local
npm run test:e2e -- --grep @claim:encrypted-storage
npm run test:e2e -- --grep @claim:packet-exports
npm run test:e2e -- --grep @claim:missing-evidence
npm run test:e2e -- --grep @claim:offline-reload
npm run test:e2e -- --grep @claim:free-and-paid
npm test
npm run build
```

Repeat the live 390 px, 200% text, touch-target, route-focus, axe, offline,
Lighthouse, response-policy, artifact-hash, and 50-request rate-limit checks.

## Evidence

The report contains exact reproduction steps, hashes, measurements, and links
to screenshots and raw Lighthouse results under `.factory/qa-artifacts/`.
