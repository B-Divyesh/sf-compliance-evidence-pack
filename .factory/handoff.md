# Deadline Packet — review 2 handoff

## Outcome

Independent first-read review 2 is complete. The review is **FAIL** for one remaining major responsive finding: at 390 × 844, the landing price fact begins below the initial viewport. See `review-2.md` (F-2-1) for exact geometry and the required regression test.

## What was checked

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900, with review screenshots under `qa-artifacts/`.
- One-click live demo, seeded content, Reset demo, Start for real, demo/real store separation, same-origin network flow, and offline reload/export.
- All 22 `.factory/claims.json` commands from the clean installed checkout: passed.
- `npm test`: passed (TypeScript, 7 unit/policy tests, 30 Chromium tests).
- `npm run build`: passed and produced `dist/`.
- Direct metadata, 404, crawl, route behavior, history, and visual-system checks.

## Files changed

- Added `.factory/review-2.md`.
- Added three review screenshots under `.factory/qa-artifacts/`.
- Replaced this handoff with the review-2 outcome.

## Next step

Fit the third hero fact into the 390 × 844 initial viewport and add the stated geometry assertion. Re-run the full review after deployment.
