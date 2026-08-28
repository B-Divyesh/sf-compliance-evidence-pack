# Deadline Packet — perfection-loop round 4 handoff

## Outcome

All findings from reviews 1–4 are fixed, tested, pushed, deployed, and checked
again on the cold production site. The final product repair is
`a365b70680ab0abd894742a173b0092e7871414f`; the evidence/docs commit follows
it without changing the built product. Production is
<https://compliance-evidence-pack.sociobot.in>.

Round 4 raised every final demo label to at least 16 px, made the typography
regression wait for seeded content, declared and proved cleared-data recovery
limits, corrected README language and the copy audit, and kept mobile packet
tools reachable. The night-market evidence-desk identity and offline PWA class
are unchanged.

## Verification

- Clean clone `/tmp/compliance-evidence-pack-polish4-final-tTBh10`: `npm ci`
  found zero vulnerabilities; all 24 exact claim commands passed separately.
- `npm ci && CI=1 npm test && npm run build`: TypeScript passed, 10 unit/policy
  tests passed, 32 Chromium tests passed, and `dist/` was produced.
- Claims cover isolated/resettable `?demo=1`, sample contents, storage and
  encryption, privacy/network boundaries, exports/import, offline use,
  editable dates, rapid question retention, paid/free behavior, storage
  erasure, and explicit capability limits.
- Browser coverage includes keyboard dialog/focus, History Back announcements,
  real HTTP 404, route titles/metadata/canonical tags, mobile 200% reflow,
  44 px controls, 16 px text, CSP/cache/MIME, service-worker updates, malformed
  imports, confirmation flows, and zero serious/critical axe issues.
- Live factory verifier: HTTP 200; correct title, `lang`, h1, main landmark,
  image alt text, and button names; zero console errors.
- Live route sweep: `/`, `/demo`, `/privacy`, and `/terms` return 200 with
  route-specific titles; `/polish-4-missing` returns the designed HTTP 404;
  all routes have one h1 and zero axe violations. Every internal link returned
  200; checkout returned 303.
- Live demo: two files, four evidence gaps, two questions, demo-only database
  and key, visible banner/reset/exit, no sub-16 px text, reset removes edits,
  exit removes demo storage, and no third-party request occurs.
- Live cleared-data proof: encrypted attachment, packet, file, and key exist
  before clearing; all counts are zero afterward; no recovery action or
  third-party request exists.
- Live offline proof: reload, checklist edit, full offline status, and ZIP
  download all pass.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; FCP 974 ms, LCP 1,057 ms, TBT 109 ms, CLS 0.
- Build budget: JS 56,145 B raw / 19,962 B gzip; CSS 26,408 B raw / 6,531 B
  gzip. Live JS/CSS SHA-256 values match local `dist/`.

Evidence and the per-finding matrix are in [`.factory/polish-4.md`](./polish-4.md)
and [`.factory/qa-artifacts/polish-4-live/`](./qa-artifacts/polish-4-live/).

## Run and verify

```sh
npm ci
npm test
npm run build
```

Claim-specific commands are listed in `.factory/claims.json`. The static build
root is `dist/`.

## Deployment

- Static deployment ID: `0481da0a-bb00-4181-9230-13391dbc3b1f`
- URL: <https://compliance-evidence-pack.sociobot.in>
- Final deployment completed through `/opt/fleet/lib/deploy-static.sh` with
  work-order slug `compliance-evidence-pack` and `dist/`.

## Known gaps and next steps

None. No review finding, test failure, accessibility issue, privacy leak,
offline failure, route defect, or documented acceptance gap remains.
