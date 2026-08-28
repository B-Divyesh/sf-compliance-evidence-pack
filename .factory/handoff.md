# Deadline Packet — adversarial review 3 handoff

## Outcome

Review 3 is complete with verdict **FAIL**. Product source was not changed.
The review is recorded in `.factory/review-3.md`.

## Findings left for repair

- **F-3-1 blocking:** demo mode reads and writes the unprefixed real
  `sb_license:*` localStorage keys.
- **F-3-2 blocking:** the privacy-page license-storage promise has no
  `claims.json` entry/test.
- **F-3-3 blocking:** earlier F-1-19 remains half-fixed; README and live notices
  still mix lifetime license, one-time license, and unlock.
- **F-3-4 major:** the offline status badge is CSS-hidden below 760 px.
- **F-3-5 minor:** the seed summary says “1 open questions.”
- **F-3-6 minor:** meta/social descriptions use “calm,” “local-first,” and
  “gaps” instead of plain **evidence gaps** wording.
- **F-3-7 minor:** `apple-touch-icon` points to a 192×192 asset, not the
  required 180×180 asset.
- **F-3-8 minor:** the create dialog calls a packet “New filing folder.”

## Verification performed

- Fresh live Chromium contexts at 390×844 and 1440×900 confirmed the job,
  audience, and first action before scrolling. The three mobile fact bottoms
  are 751.19, 781.98, and 837.58 px.
- Entered the live demo in one click. Reset restored the seed and preserved a
  valid real packet. Start for real removed demo packet data and reopened the
  real packet. Offline reload/edit/ZIP export worked with same-origin requests.
- Proved F-3-1 live by reading a seeded real license in `/demo`, then restoring
  a demo license and observing the unprefixed token/verdict survive demo exit.
- Created clean clone `/tmp/compliance-evidence-pack-review3-ZNbO9h`, ran
  `npm ci`, and ran all 22 exact commands from `.factory/claims.json`
  separately: all passed.
- `CI=1 npm test` passed: 7 Vitest/policy tests and 30 Chromium tests.
- `npm run build` passed and produced `dist/`; JS is 54,324 bytes raw / 19.76
  kB gzip. Live JS/CSS SHA-256 values match the clean build.
- Live crawl found all internal links at 200 and checkout at the expected 303.
  Unknown route returned a designed HTTP 404.
- Playwright axe found zero serious/critical issues on root, demo, privacy,
  terms, and 404. `/opt/fleet/lib/verify-url.sh` reported correct title, lang,
  h1, main, alt labels, and zero console errors.
- Read and reconciled every earlier review, polish report, verification report,
  and prior handoff. F-2-1 is fixed; F-1-19 is reopened through F-3-3.

## Reproduce

```sh
npm ci
npm test
npm run build
```

Open <https://compliance-evidence-pack.sociobot.in/demo> in a fresh browser
context. For F-3-1, seed `sb_license:compliance-evidence-pack` before opening
the demo, or restore a license inside the demo, then inspect localStorage after
**Start for real**.

## Next step

Repair all eight findings, add the missing sandbox and claim regressions,
deploy, and run the full first-read review again from fresh contexts.
