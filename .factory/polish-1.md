# Polish 1 — finding reconciliation

Live verification URL: <https://compliance-evidence-pack.sociobot.in>. Screens:
`qa-artifacts/polish-1-live-root-desktop.png` and
`qa-artifacts/polish-1-live-demo-mobile.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Serialized save repaint; added 10-submit race regression. | `@claim:question-retention`; live 10/10 retained. |
| F-1-2 | Replaced “complete” promise; added seed claim. | `@claim:demo-seed`; live `/demo`. |
| F-1-3 | README names observable sample contents. | `@claim:demo-seed`; live `/demo`. |
| F-1-4 | Added persisted editable date claim. | `@claim:editable-handoff-date`; live `/`. |
| F-1-5 | Added question retention claim. | `@claim:question-retention`; live `/demo`. |
| F-1-6 | Corrected demo-exit wording and behavior. | `@claim:demo-exit`; live `/demo`. |
| F-1-7 | Simplified and tested Sociobot license traffic. | `@claim:license-network-boundary`; live `/privacy`. |
| F-1-8 | Removed merchant/refund promise; retained tested checkout host. | `@claim:free-and-paid`; live `/`. |
| F-1-9 | Removed unproved retry promise. | `@claim:license-nonblocking`; live `/privacy`. |
| F-1-10 | Test now clears IndexedDB, cache, and localStorage. | `@claim:local-retention`; live `/privacy`. |
| F-1-11 | Raised visible readable text to 16 px. | `all visible readable text…`; live mobile screen. |
| F-1-12 | Tightened hero; facts finish before 900 px. | `landing and demo keep…`; live 796/827/858 px. |
| F-1-13 | Restored mobile header links. | `landing and demo keep…`; live mobile screen. |
| F-1-14 | Added product preview before How it works. | `landing and demo keep…`; live root screen. |
| F-1-15 | Put workbench h1 before drawer headings in DOM. | `landing and demo keep…`; live `/demo`. |
| F-1-16 | Removed “accountant-ready.” | copy audit; live `/`. |
| F-1-17 | Rewrote the checklist step concretely. | copy audit; live `/`. |
| F-1-18 | Named gaps and questions in the boundary copy. | copy audit; live `/`. |
| F-1-19 | Standardized “lifetime license.” | `@claim:free-and-paid`; live `/`. |
| F-1-20 | Standardized “evidence gap.” | `@claim:missing-evidence`; live `/demo`. |
| F-1-21 | Removed landing storage jargon. | copy audit; live `/`. |
| F-1-22 | Rewrote README storage sentence. | README audit; repository check. |
| F-1-23 | Rewrote README encryption sentence. | README audit; repository check. |
| F-1-24 | Rewrote demo storage explanation. | `.factory/demo.md`; live `/demo`. |
| F-1-25 | Rewrote Playwright requirement. | README audit; repository check. |
| F-1-26 | Split README build/deploy sentence. | README audit; repository check. |
| F-1-27 | Relabelled license restore disclosure. | `@claim:free-and-paid`; live `/`. |

Earlier verification findings for demo, claims, CSP/cache, titles, real 404,
manifest MIME, price, malformed imports, mobile reflow, focus, confirmation,
hidden hero loading, and copy audit are covered by the full browser suite.
