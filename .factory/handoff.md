# Deadline Packet — polish 1 handoff

## Outcome

Perfection-loop round 1 is complete. All 27 findings in `review-1.md`, every
earlier verification defect reconciled there, and the controller’s deterministic
deadline failure are fixed and verified locally and live. Repair commit:
`9d9021057420e2fd227a9c68990747d51f6a31df`.

## Final repair

- Dates now render in deterministic day-month-year order, including the required
  `20 Nov 2026` summary.
- Saving packet details waits for IndexedDB, repaints immediately, and reports a
  useful storage error on failure.
- Draft values and open disclosures survive asynchronous dashboard repaints.
  This extends the earlier rapid-question repair to packet details and lifetime
  license restoration.
- The editable-date claim now asserts creation, visible replacement, the stored
  IndexedDB value, the post-reload summary, and the reopened field.
- The claims policy test requires every declared claim ID to have exactly one
  matching browser tag and the documented exact command.
- The catalog description is now: “Organize filing-period evidence and questions
  for accountant review.” It starts with a verb and is under 120 characters.

## Verification

- Clean clone: `/tmp/compliance-evidence-pack-clean-AxD8Jl` at
  `9d9021057420e2fd227a9c68990747d51f6a31df`; `npm ci` passed with zero
  vulnerabilities. All 22 commands from `.factory/claims.json` passed
  separately, 1/1 each.
- `CI=1 npm test`: PASS — TypeScript, 7 Vitest unit/policy tests, and all 30
  Playwright Chromium tests.
- `npm run build`: PASS — `dist/index.html` exists. Initial JS is 54.32 kB raw /
  19.76 kB gzip; CSS is 25.98 kB raw / 6.43 kB gzip; hero WebP is 95.96 kB.
- The 30 browser tests cover exports/import, isolation, privacy interception,
  encrypted storage, storage clearing, offline reload/edit/ZIP, update prompts,
  race stress, date persistence, billing boundaries, malformed data recovery,
  keyboard focus, axe, 200% reflow, 44 px targets, 16 px text, reduced motion,
  metadata, routing, and HTTP 404 policy.
- `/opt/fleet/lib/verify-url.sh`: PASS live with HTTP 200, title, `lang=en`, one
  h1, main landmark, complete alt/button labels, and zero console errors.
- Live Playwright axe scans: zero serious/critical findings on `/`, `/?demo=1`,
  `/privacy`, `/terms`, and the designed 404.
- Live deadline exercise: created `15 Oct 2026`, saved `2026-11-20`, saw
  `20 Nov 2026`, reloaded, saw `20 Nov 2026` again, and reopened an input value
  of `2026-11-20`.
- Live demo exercise: `/?demo=1` opened the isolated seeded workspace; Reset
  demo restored the sample; the only database was `deadline-packet-demo`; an
  offline reload accepted a checklist edit and downloaded the accountant ZIP.
- Live routing: root/demo/privacy/terms returned 200; the unknown route returned
  404; SPA navigation moved focus to main and Back restored the root title.
- Lighthouse 12.7.0 mobile: Performance 100, Accessibility 100, FCP 0.9 s,
  LCP 1.0 s, Speed Index 0.9 s, TBT 0 ms, CLS 0.

Evidence is in `.factory/qa-artifacts/polish-1-retry2-*` and the full mapping is
in `.factory/polish-1.md`.

## Deployment

Deployed the exact `dist/` artifact with:

```sh
/opt/fleet/lib/deploy-static.sh compliance-evidence-pack dist
```

Azure deployment ID: `77b24693-dc20-4517-b745-e2239c0fc597`.

Live: <https://compliance-evidence-pack.sociobot.in>

The live `index-2dbtwmAS.js` SHA-256 is
`ced0ab77ab298cc8536d49fafb64419fe85e961f868638940cfb49d1d0a7dd67`.
The live `index-BrXjDZNm.css` SHA-256 is
`4b06edd7a32ab26caa4c70c91bc5c0061ae346c0fe2bc1085a7b82c7d1d1a236`.
Both byte-match the local production build.

## Known gaps

None.
