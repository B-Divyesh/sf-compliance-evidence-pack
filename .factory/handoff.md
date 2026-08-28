# Deadline Packet — adversarial review 5 handoff

## Outcome

Review 5 is complete and the verdict is **FAIL** with ten findings. No product
code was modified. The first-read gate, live one-click demo, sandbox isolation,
offline workflow, declared claim commands, build, route responses, links,
metadata, axe checks, and visual identity all pass.

Two blocking claim-accountability issues remain: the free-tier claim test does
not complete/export the advertised “complete packet,” and the public AI-art
provenance statement is missing from `.factory/claims.json`. SPA navigation
also focuses `<main>` instead of the new h1. Seven plain-words/heading defects
remain. Exact evidence and rewrites are in
[`review-5.md`](./review-5.md).

## Verification completed

- Fresh live Chromium at 390×844 and 1440×900, without scrolling.
- Live demo seed, sample-license isolation, Reset demo, Start for real, request
  log, and unchanged real packet check.
- Live offline reload, edit, status, and accountant ZIP download.
- All 24 exact claim commands from a clean clone at commit
  `367e07fc0866a4371183e170f9adb5e544379cad`; all returned zero.
- `CI=1 npm test && npm run build`: 10 unit/policy tests and 32 browser tests
  passed; `dist/` was produced.
- Live root/demo/privacy/terms/404 metadata, canonical, one-h1, header/footer,
  link crawl, History Back, focus, announcements, and axe sweep.
- Factory URL verifier: 200, 796 ms load, correct title/lang/main/alt/buttons,
  and zero console errors.
- Live JS/CSS SHA-256 values match the clean build.

Evidence is in `.factory/qa-artifacts/review-5-*` and the complete report is
`.factory/review-5.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Run each exact claim command from `.factory/claims.json` separately. For live
review, use `/demo` in a fresh context and record all requests through reset,
exit, offline reload, edit, and export.

## Known gaps and next steps

Fix F-5-1 through F-5-10 without weakening the existing demo, privacy, offline,
or visual behavior. Add claim coverage for the exact free-tier and provenance
wording, focus the route h1, replace the flagged copy, deploy, and repeat the
full review. Infrastructure, DNS, and billing were not changed.
