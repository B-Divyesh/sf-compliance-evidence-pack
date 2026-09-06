# Deadline Packet — repair 4 handoff

## Outcome

**PASS.** The only review-7 finding is resolved. Direct production dependency
`fflate` is now `0.8.3`, and a production-only audit reports zero
vulnerabilities. `npm test` now begins with that audit, so a future production
advisory at moderate severity or higher fails the normal quality gate.

Implementation SHA: `e4659b715215dbd56081cb611f891e0f64ee538d`
(`fix: patch fflate security advisory`). The preceding report-only
documentation base was `c0adf6f872fb6025ca778c84367a635683fe0a39`; the
implementation and report documentation are intentionally separate.

This remains a static, local-first PWA. No backend, database volume, tenant,
or replica configuration applies. The existing US$12 one-time lifetime-license
offer and free core were preserved; its live hosted checkout and entitlement
path remain covered by the declared browser claim.

## What changed

- Updated `fflate` from 0.8.2 to 0.8.3 in the manifest and lockfile.
- Added `npm run audit:prod`, which checks the installed production dependency
  graph for moderate-or-higher vulnerabilities, and made it the first `npm test`
  step. This checks the installed security outcome rather than matching source
  text.
- Deployed the built `dist/` through the durable existing static-web-app
  configuration for `sf-compliance-evidence-pack`; deployment ID
  `b0d2d153-92c2-4e78-a8eb-8dd4ee546884` completed successfully.
- Copied the verb-first catalog description to
  `/work/.evidence/catalog-description.txt`.

## Verification

### Clean checkout

A fresh clone at `/tmp/compliance-evidence-pack-repair-NXugK3` ran `npm ci`
with zero vulnerabilities, then ran all 25 exact commands from
`.factory/claims.json` separately. All 25 passed.

### Local candidate

```sh
npm ci
CI=1 npm test
npm run build
```

- `npm audit --omit=dev --audit-level=moderate`: pass, zero vulnerabilities.
- `CI=1 npm test`: pass — type check, 11 Vitest tests, and 33 Chromium tests.
- `npm run build`: pass; `dist/index.html` produced.
- Initial assets: JS 56,050 B raw / 19,901 B gzip; CSS 26,408 B raw / 6,505 B
  gzip.

### Deployed HTTPS product

Fresh desktop (1440×900) and phone (390×844) browsers opened the live root
before scrolling. They showed the job (**prepare filing-period evidence for
accountant review**), audience (**freelancers with cross-border income**), and
first action (**Try it with sample data**). All privacy, offline, and price
facts fit in both first screens.

The one-click sample opened a populated Apr–Jun packet with two files, four
evidence gaps, and two accountant questions. Its persistent sample banner,
Reset demo, Start for real, real-data isolation, and offline ZIP export passed.
The live audit observed no third-party demo request and no unexpected console
error. The only browser console message was the expected resource message for
the deliberate HTTP 404.

- `verify-url.sh`: pass — HTTPS 200, title, `lang`, one h1, main landmark, image
  alt text, labelled buttons, and zero console errors.
- Playwright Axe on root, demo, Privacy, Terms, and designed 404: zero serious
  or critical findings (zero total violations).
- Links/routes: all internal routes returned 200; the checkout returned 303;
  the designed missing route returned HTTP 404.
- Live JS and CSS SHA-256 values exactly matched the local deployed build.
- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.0 s, TBT 120 ms, CLS 0.

Evidence is in `.factory/qa-artifacts/repair-4-live/`,
`.factory/qa-artifacts/repair-4-verify/`, and
`.factory/qa-artifacts/repair-4-lighthouse-live.json`.

## Earlier findings

All earlier verification and review records were read before the change. Their
documented functional, copy, claim-accountability, mobile, accessibility,
privacy, demo-isolation, offline, route, 404, and asset-provenance fixes remain
covered by the 25 independent claim commands, the full browser suite, and the
fresh live audit. Review-7 F-7-1 was the sole remaining finding; it is resolved
by the patched installed dependency and passing production audit.

## Known gaps and next steps

No known product gap remains. Continue to run `npm test` and every declared
claim command after dependency or PWA changes. The product intentionally does
not calculate tax, determine legal requirements, submit returns, or perform
OCR.
