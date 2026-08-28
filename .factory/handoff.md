# Deadline Packet — review 4 handoff

## Outcome

Adversarial first-read review 4 is complete against commit
`29d862e3069b7a223daef4bc9e0b0e56c8b84986` and the live product.

Verdict: **FAIL** with seven findings. The primary blocker reopens F-1-11:
twelve meaningful demo labels render at 13.3333 px despite the documented 16 px
minimum, while the existing regression test inspects the loading shell too
early and passes. A second blocker records an unlisted cleared-data recovery
claim on `/privacy`. Product code was not changed.

Full evidence and concrete remediations are in `.factory/review-4.md`.

## Verification performed

- Fresh 390×844 and 1440×900 cold first reads.
- One-click live demo, realistic seed, Reset demo, Start for real, real-data
  isolation, demo license isolation, and request-log checks.
- Live service-worker-controlled offline reload, edit, status, and ZIP export.
- Every one of the 23 exact `.factory/claims.json` commands from clean clone
  `/tmp/compliance-evidence-pack-review4-raWuna`: all passed.
- `CI=1 npm test`: 9 unit/policy and 31 Chromium tests passed.
- `npm run build`: passed and produced `dist/`; JS is 56,145 B raw / 19,962 B
  gzip, CSS is 26,330 B raw / 6,512 B gzip.
- Live route metadata, 404, crawl, back/focus announcement, 200% reflow,
  reduced motion, target sizes, and axe-core checks.
- Live JavaScript and CSS SHA-256 values match the local build.
- Every earlier review/polish/handoff finding was checked in live behavior and
  code; F-1-11 is reopened, all other numbered earlier findings are fixed.

## Artifacts

- `.factory/review-4.md`
- `.factory/qa-artifacts/review-4-first-read-mobile.png`
- `.factory/qa-artifacts/review-4-first-read-desktop.png`
- `.factory/qa-artifacts/review-4-demo-mobile.png`
- `.factory/qa-artifacts/review-4-demo-offline-mobile.png`

## Known gaps and next steps

Fix F-4-1 through F-4-7 before acceptance. In particular, make every final
demo label at least 16 px, wait for the seeded workspace in the typography
test, and either test/list or remove the cleared-data recovery guarantee. Then
deploy and repeat the full live review. No infrastructure, billing, or product
source changes were made in this review.
