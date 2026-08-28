# Deadline Packet

Prepare evidence packets for accountant review.

Deadline Packet organizes one filing period’s invoices, receipts, statements,
evidence gaps, notes, and questions. It exports them for accountant review. It
does not calculate tax, decide legal requirements, submit returns, or run OCR.

Live product: <https://compliance-evidence-pack.sociobot.in>

One-click demo: <https://compliance-evidence-pack.sociobot.in/demo>

## What it does

- Stores packet details and attached files in this browser.
- When supported, your browser encrypts attached files before storing them.
- Builds an evidence-gap list from the editable checklist.
- Exports an accountant ZIP, PDF index, and JSON backup you can import.
- Keeps edits and exports working offline after the first visit.
- Includes one packet free. A US$12 lifetime license adds unlimited packets and duplication.

The app does not upload packet contents automatically. The app contacts
Sociobot only when you buy or verify a lifetime license. Clearing browser site
data removes local packets, so keep an exported backup somewhere safe.

## Try the isolated demo

Open `/demo` or `/?demo=1`. It opens an Apr–Jun cross-border packet with two
sample files, four evidence gaps, and two accountant questions. Demo changes
stay in separate browser storage, including sample license state. Sample
license activation never contacts Sociobot. **Reset demo** restores the sample.
**Start for real** deletes demo changes and opens your real workspace. See
[the demo contract](./.factory/demo.md).

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

No backend or environment variable is required.

## Test and build

The project requires Playwright 1.58.2. If Chromium is missing, run
`npx playwright install chromium`.

```sh
npm test
npm run build
```

`npm test` checks types, unit tests, and browser tests. Claim-specific
commands are listed in [`.factory/claims.json`](./.factory/claims.json). The
production build lands in `dist/`, with `index.html` at its root.

## Deploy

Build with `npm run build` and deploy `dist/` as a static site. The build includes
pages for the demo, policies, and 404 errors. It also includes offline app files
and Azure Static Web Apps configuration. The factory owns DNS and infrastructure.

## Project map

- `src/main.ts` — screens, demo seed, routing, and interaction logic.
- `src/db.ts` — stores and encrypts real and demo data separately in the browser.
- `src/export.ts` — ZIP, PDF, and JSON generation.
- `public/sw.js` — caches the app for offline use and installs updates.
- `.factory/design.md` — product visual system and asset provenance.
- `.factory/handoff.md` — exact release verification evidence.

## Privacy and law

Read the in-app `/privacy` and `/terms` pages. The software is an organizational
tool, not tax, accounting, or legal advice.

## License

MIT — see [LICENSE](./LICENSE).
