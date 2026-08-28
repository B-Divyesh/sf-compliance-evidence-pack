# Copy audit

Audited 2026-08-28 after perfection-loop round 4. Counts use displayed tokens:
split on whitespace, ignore a standalone em dash, and keep hyphenated terms
and prices as one token. Every landing sentence is at or below 22 words. No
banned marketing term appears in visitor-facing copy. The release-policy test
recounts every row and checks each phrase against the product source.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Evidence in order. | 3 | Pass |
| Questions in view. | 3 | Pass |
| Prepare evidence for your accountant. | 5 | Pass; verb-first job |
| For freelancers with cross-border income, organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 18 | Pass; audience and change |
| Try it with sample data | 5 | Pass; primary action |
| Start your packet | 3 | Pass; real first step |
| The sample opens with files, evidence gaps, and accountant questions. | 10 | Pass |
| No account. | 2 | Pass |
| Data stays in this browser. | 5 | Pass |
| Works offline after your first visit. | 6 | Pass |
| One packet free. | 3 | Pass |
| Unlimited use costs US$12 once. | 5 | Pass |
| Import a JSON backup | 4 | Pass; result-naming action |

## Landing remainder

| Copy | Words | Result |
| --- | ---: | --- |
| From scattered evidence to one reviewable handoff. | 7 | Pass |
| See the evidence gaps before handoff. | 6 | Pass |
| Files, checklist states, and questions stay together in one packet. | 10 | Pass |
| Open the sample packet | 4 | Pass; result-naming action |
| Choose your own handoff date. | 5 | Pass |
| See which checklist items are still missing. | 7 | Pass |
| ZIP + PDF index for review. | 6 | Pass |
| Not another filing portal. | 4 | Pass |
| Deadline Packet doesn’t calculate tax, interpret rules, or submit anything. | 10 | Pass |
| It keeps evidence gaps and accountant questions in the same packet. | 11 | Pass |
| Stored in this browser | 4 | Pass |
| Attachments included in your ZIP | 5 | Pass |
| Evidence gaps follow the checklist | 5 | Pass |
| Open questions stay beside the files | 6 | Pass |
| Your first complete packet is free; unlimited packets and duplication require the lifetime license. | 14 | Pass |
| Checkout opens on Sociobot/Dodo. | 4 | Pass |

## Dialog, metadata, and footer

| Copy | Words | Result |
| --- | ---: | --- |
| New packet | 2 | Pass; one product term |
| Use the date you want the packet with your accountant—not a statutory deadline. | 13 | Pass |
| This creates an organizational checklist, not a filing or legal determination. | 11 | Pass |
| Prepare filing-period evidence for accountant review. | 6 | Pass |
| Original still-life artwork was AI-generated for Deadline Packet. | 8 | Pass; provenance disclosure |
| Organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review. | 13 | Pass; search description |
| Prepare invoices, receipts, evidence gaps, and questions for accountant review. | 10 | Pass; social description |
| Organize filing-period evidence and questions for accountant review. | 8 | Pass; install description |

## Demo additions

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved to your real packets. | 10 | Pass |
| This sample activation stays in the demo and never contacts Sociobot. | 11 | Pass; covered by `demo-isolation` |
| Activate sample license | 3 | Pass; result-naming action |
| Sample lifetime license activated. | 4 | Pass |
| Demo changes still stay separate. | 5 | Pass |

## README corrections

| Copy | Words | Result |
| --- | ---: | --- |
| `npm test` checks types, unit tests, and browser tests. | 9 | Pass; names the checks that run |
| If Chromium is missing, run `npx playwright install chromium`. | 9 | Pass; direct setup instruction |
| `src/db.ts` — stores and encrypts real and demo data separately in the browser. | 12 | Pass; behavior before implementation |
| `public/sw.js` — caches the app for offline use and installs updates. | 10 | Pass; behavior before implementation |

## Terminology

| Concept | One public term |
| --- | --- |
| A filing-period workspace | packet |
| A required document group not marked ready | evidence gap |
| The recipient | accountant |
| The downloadable archive | accountant ZIP |
| The isolated sample workspace | demo |
| The paid entitlement | lifetime license |

“One-time purchase” appears only as the payment cadence in Terms. It is not
used as the entitlement name. Implementation names remain only in technical
documentation and code.
