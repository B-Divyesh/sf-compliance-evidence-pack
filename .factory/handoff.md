# Deadline Packet — perfection-loop round 5 handoff

## Outcome

All findings from reviews 1–5 are resolved and the repaired PWA is live at
<https://compliance-evidence-pack.sociobot.in>. The repair keeps the original
night-market evidence-desk visual system and local-first PWA architecture.

Round 5 removed the remaining slogan and metaphor copy, gave every route its
literal heading, moved SPA route focus to the new h1, completed the free-packet
claim through an unlicensed 100% packet with an attachment and inspected ZIP,
and added cryptographic evidence for the public artwork provenance statement.
The isolated `?demo=1` path, reset, exit, real-data boundary, mobile tools,
offline workflow, titles, metadata, real 404, legal links, and all earlier
repairs were rechecked without regression.

## Release evidence

- Repair commit: `758ecb0b55b77186eeb8cc1f1b0ea6634bab4d55`.
- Azure Static Web Apps deployment:
  `ff8f9599-7b8f-4bdf-b84e-e10ad902ae5a`.
- Clean clone: `/tmp/compliance-evidence-pack-polish5-clean-1THc7H` at the
  repair commit. `npm ci` found zero vulnerabilities.
- Every one of the 25 exact commands in `.factory/claims.json` passed
  separately in that clone.
- The subsequent clean-clone `CI=1 npm test` passed 11 unit/policy tests and
  all 33 Chromium tests. This includes browser, axe, keyboard, 200% zoom,
  16 px type, 44 px targets, privacy request logging, offline reload/export,
  PWA update, malformed-data recovery, and demo-isolation coverage.
- `npm run build` produced `dist/`. Initial JavaScript is 56,043 B raw /
  20.04 kB gzip. CSS is 26,408 B raw / 6.50 kB gzip.
- The factory URL verifier returned 200 in 1,422 ms with the correct title,
  `lang=en`, one h1, main landmark, image alt text, labelled buttons, and zero
  console errors: `.factory/qa-artifacts/polish-5-live/verify/verify.json`.
- The cold live audit checked first screens at 390×844 and 1440×900, direct
  routes, SPA focus and Back, metadata, all links, HTTP 404, demo/reset/exit,
  real packet and license isolation, offline edit/export, mobile type, axe, and
  asset hashes: `.factory/qa-artifacts/polish-5-live/live-report.json`.
- Live axe results: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and
  the designed 404.
- Live JavaScript and CSS byte-match `dist/` with SHA-256 values
  `41ea4a1816b5f13f73152e02540722ccf5954a7ff9fc7a89bee264fa56354680`
  and `bd15702f933a84729f53561316ff2eb299f32dafc79f237b2cd20b46fa8312a8`.
- Lighthouse 12.7.0 mobile: Performance 97, Accessibility 100, Best Practices
  100, SEO 100, FCP 991 ms, LCP 998 ms, TBT 190.5 ms, and CLS 0.

Screenshots are under `.factory/qa-artifacts/polish-5-live/`: mobile and
desktop first screens, the complete mobile demo, the offline mobile demo, and
the designed 404. The complete ID-by-ID evidence map is
`.factory/polish-5.md`.

## Run and verify

```sh
npm ci
CI=1 npm test
npm run build
node scripts/live-audit.mjs https://compliance-evidence-pack.sociobot.in .factory/qa-artifacts/polish-5-live
```

Run every exact `test` command in `.factory/claims.json` separately from a
fresh clone when repeating release verification.

## Known gaps

None. No product, claim, accessibility, privacy, offline, routing, copy,
responsive-layout, or deployment finding remains open.
