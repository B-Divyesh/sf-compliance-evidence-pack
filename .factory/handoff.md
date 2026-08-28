# Deadline Packet — adversarial review 1 handoff

## Outcome

**FAIL.** The complete review is in [review-1.md](./review-1.md). No product
code was modified.

The release blocker is a live form-render race: immediately submitting an
accountant question after changing a checklist item lost the question in 2 of
10 fresh contexts. The claims inventory and 16 px type baseline are also still
incomplete, and the review records structure and copy findings.

## What was done

- Opened the live product cold at 390×844 and 1440×900 and recorded the
  unscrolled first-read result.
- Audited every landing/README copy unit with word counts and rewrites.
- Exercised the seeded demo, reset, real/demo storage isolation, exit, offline
  reload, and network boundary.
- Ran all 17 claim commands separately after `npm ci` in a fresh temporary
  clone.
- Rechecked every earlier verification finding against live behavior and the
  byte-matching source build.
- Crawled links and checked routing, titles, h1s, metadata, canonical URLs,
  404, focus/Back behavior, 390 px/200% reflow, targets, reduced motion, and
  axe serious/critical results.
- Checked the brief for missed import/export, sync, and AI leverage.

Evidence screenshots are in `.factory/qa-artifacts/review-1-*.png`.

## Verification run

```sh
npm test
npm run build
```

Results:

- `npm test`: PASS — 5 Vitest tests and 24 Playwright tests.
- `npm run build`: PASS — `dist/` produced.
- Initial JavaScript: 53,023 bytes raw / 19,440 bytes gzip.
- Fresh Lighthouse 12.7.0 mobile: Performance 100, Accessibility 100, FCP/LCP
  1.0 s, TBT 0 ms, CLS 0.
- All 17 exact `.factory/claims.json` commands: PASS individually.
- Live/root/demo/privacy/terms/404 axe scans: zero serious/critical issues.
- Live and built JS, CSS, and social-image SHA-256 values: identical.

## Known gaps and next steps

1. Fix F-1-1's checklist-to-question render race and replace the one-iteration
   regression with deterministic race coverage plus repetition.
2. Resolve every unlisted or partly tested claim in F-1-2 through F-1-10.
3. Restore the documented 16 px minimum, desktop first-screen facts, mobile
   navigation, landing product preview, and demo heading order.
4. Apply the copy rewrites and terminology normalization in F-1-16 through
   F-1-27.
5. Re-run the entire adversarial checklist from fresh contexts. Do not rely on
   the currently passing suite as proof that the rapid interaction is safe.
