import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = process.argv[2] || 'https://compliance-evidence-pack.sociobot.in';
const evidenceDir = resolve(process.argv[3] || '.factory/qa-artifacts/polish-5-live');
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch();
const report = {
  origin,
  checkedAt: new Date().toISOString(),
  firstScreen: {},
  demo: {},
  isolation: {},
  offline: {},
  routes: {},
  assets: {},
  axe: {},
  consoleErrors: [],
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const errors = [];
const watchConsole = (page) => {
  page.on('console', (message) => { if (message.type() === 'error') errors.push({ page: page.url(), text: message.text() }); });
  page.on('pageerror', (error) => errors.push({ page: page.url(), text: String(error) }));
};
const axeRoute = async (page, label) => {
  const result = await new AxeBuilder({ page }).analyze();
  const severe = result.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact || ''));
  report.axe[label] = { violations: result.violations.length, seriousOrCritical: severe.length };
  assert(severe.length === 0, `${label} has serious or critical axe violations`);
};

try {
  for (const viewport of [{ label: 'desktop', width: 1440, height: 900 }, { label: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    watchConsole(page);
    await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1, name: 'Prepare evidence for your accountant.' }).waitFor();
    const facts = await page.locator('.hero-facts li').evaluateAll((items) => items.map((item) => ({ text: item.textContent.trim(), bottom: item.getBoundingClientRect().bottom })));
    const text = await page.locator('body').innerText();
    assert(facts.length === 3 && facts.every(({ bottom }) => bottom <= viewport.height), `${viewport.label} facts leave the first screen`);
    assert(!/Evidence in order|Questions in view|scattered evidence/i.test(text), `${viewport.label} still shows removed slogan copy`);
    await page.screenshot({ path: resolve(evidenceDir, `first-screen-${viewport.label}.png`), fullPage: false });
    report.firstScreen[viewport.label] = { title: await page.title(), facts };
    if (viewport.label === 'desktop') await axeRoute(page, 'root');
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    watchConsole(page);
    const thirdParty = [];
    page.on('request', (request) => {
      const requestOrigin = new URL(request.url()).origin;
      if (requestOrigin !== origin) thirdParty.push(request.url());
    });
    await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Try it with sample data' }).click();
    await page.getByRole('heading', { level: 1, name: 'Apr–Jun cross-border evidence' }).waitFor();
    assert(new URL(page.url()).pathname === '/demo', 'first click did not open /demo');
    assert(await page.getByLabel('Demo mode').isVisible(), 'demo banner is hidden');
    assert(await page.getByRole('button', { name: 'Reset demo' }).isVisible(), 'Reset demo is hidden');
    assert(await page.getByRole('button', { name: 'Start for real' }).isVisible(), 'Start for real is hidden');
    assert(await page.locator('.file-list > li').count() === 2, 'demo does not have two files');
    assert(await page.getByRole('complementary', { name: 'Evidence gaps' }).locator('li').count() === 4, 'demo does not have four evidence gaps');
    assert(await page.locator('.question-list > li').count() === 2, 'demo does not have two questions');
    await page.getByLabel('Business expense receipts').check();
    await page.getByRole('button', { name: 'Reset demo' }).click();
    await page.waitForFunction(() => !(document.querySelector('[data-check="demo-receipts"]'))?.checked);
    assert(!(await page.getByLabel('Business expense receipts').isChecked()), 'Reset demo did not restore sample data');
    const undersized = await page.locator('body *').evaluateAll((elements) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const text = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      return text && style.display !== 'none' && style.visibility !== 'hidden' && element.getBoundingClientRect().width > 0 && Number.parseFloat(style.fontSize) < 16
        ? [{ tag: element.tagName, text: element.textContent?.trim().slice(0, 80), size: style.fontSize }]
        : [];
    }));
    assert(undersized.length === 0, `demo has undersized text: ${JSON.stringify(undersized)}`);
    await page.screenshot({ path: resolve(evidenceDir, 'demo-mobile.png'), fullPage: true });
    await axeRoute(page, 'demo');
    report.demo = { url: page.url(), files: 2, evidenceGaps: 4, questions: 2, thirdParty, undersized };
    assert(thirdParty.length === 0, `demo contacted third parties: ${thirdParty.join(', ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    watchConsole(page);
    await page.goto(`${origin}/`);
    await page.getByRole('button', { name: 'Start your packet' }).click();
    await page.getByLabel('Packet name').fill('Round 5 real marker');
    await page.getByRole('button', { name: 'Create packet' }).click();
    await page.getByRole('heading', { level: 1, name: 'Round 5 real marker' }).waitFor();
    await page.evaluate(() => {
      localStorage.setItem('sb_license:compliance-evidence-pack', 'round-5-real-license');
      localStorage.setItem('sb_license:compliance-evidence-pack:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    });
    await page.goto(`${origin}/?demo=1`);
    await page.getByRole('heading', { level: 1, name: 'Apr–Jun cross-border evidence' }).waitFor();
    assert(await page.getByText('Unlimited packets active').count() === 0, 'demo read the real license');
    await page.getByRole('button', { name: 'Activate sample license' }).click();
    assert(await page.evaluate(() => localStorage.getItem('demo:sb_license:compliance-evidence-pack')) === 'deadline-packet-sample-license', 'demo license is not namespaced');
    assert(await page.evaluate(() => localStorage.getItem('sb_license:compliance-evidence-pack')) === 'round-5-real-license', 'demo changed the real license');
    await page.getByRole('button', { name: 'Start for real' }).click();
    await page.getByRole('heading', { level: 1, name: 'Round 5 real marker' }).waitFor();
    const demoKeys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')));
    const databases = await page.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name));
    assert(demoKeys.length === 0 && !databases.includes('deadline-packet-demo'), 'Start for real retained demo storage');
    report.isolation = { realPacket: 'Round 5 real marker', realLicenseUnchanged: true, demoKeys, databases };
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    watchConsole(page);
    await page.goto(`${origin}/demo`);
    await page.waitForFunction(async () => { await navigator.serviceWorker.ready; return true; });
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('heading', { level: 1, name: 'Apr–Jun cross-border evidence' }).waitFor();
    await page.getByLabel('Business expense receipts').check();
    await page.getByText('4 of 7 evidence groups ready').waitFor();
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export accountant ZIP' }).click();
    const download = await downloadEvent;
    const badge = page.getByText('Offline — edits still save');
    assert(await badge.isVisible(), 'offline badge is hidden');
    await page.screenshot({ path: resolve(evidenceDir, 'demo-offline-mobile.png'), fullPage: true });
    report.offline = { heading: await page.locator('h1').innerText(), edited: true, download: download.suggestedFilename(), badge: await badge.innerText() };
    await context.setOffline(false);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    watchConsole(page);
    await page.goto(`${origin}/`);
    await page.getByLabel('Primary navigation').getByRole('link', { name: 'Privacy' }).click();
    const privacyHeading = page.getByRole('heading', { level: 1, name: 'How Deadline Packet stores and sends data.' });
    assert(await privacyHeading.evaluate((heading) => heading === document.activeElement), 'Privacy h1 did not receive route focus');
    assert(await page.title() === 'Privacy — Deadline Packet', 'Privacy title is wrong');
    await axeRoute(page, 'privacy');
    await page.goBack();
    const homeHeading = page.getByRole('heading', { level: 1, name: 'Prepare evidence for your accountant.' });
    assert(await homeHeading.evaluate((heading) => heading === document.activeElement), 'home h1 did not receive Back focus');
    const routes = {};
    const discoveredLinks = new Set();
    for (const [path, title] of [['/', 'Deadline Packet — Prepare accountant evidence'], ['/demo', 'Demo — Deadline Packet'], ['/privacy', 'Privacy — Deadline Packet'], ['/terms', 'Terms — Deadline Packet']]) {
      const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
      const metadata = await page.evaluate(() => ({
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      }));
      routes[path] = { status: response?.status(), title: await page.title(), h1: await page.locator('h1').innerText(), privacyLinks: await page.getByRole('link', { name: 'Privacy' }).count(), termsLinks: await page.getByRole('link', { name: 'Terms' }).count(), metadata };
      assert(response?.status() === 200 && await page.title() === title, `${path} status or title failed`);
      assert(await page.locator('h1').count() === 1, `${path} does not have one h1`);
      assert(metadata.description === 'Organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review.', `${path} description is wrong`);
      assert(metadata.canonical === `${origin}${path}`, `${path} canonical is wrong`);
      assert(metadata.ogTitle === title && metadata.ogDescription === 'Prepare invoices, receipts, evidence gaps, and questions for accountant review.', `${path} social metadata is wrong`);
      for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href))) discoveredLinks.add(href);
      if (path === '/terms') await axeRoute(page, 'terms');
    }
    const links = {};
    for (const href of discoveredLinks) {
      const url = new URL(href);
      if (!['https:', 'http:'].includes(url.protocol)) continue;
      const response = await fetch(href, { redirect: 'manual' });
      links[href] = response.status;
      if (url.origin === origin) assert(response.status === 200, `${href} returned ${response.status}`);
      if (href === 'https://api.sociobot.in/api/v1/products/compliance-evidence-pack/checkout') assert(response.status === 303, 'checkout link did not return 303');
    }
    const missingResponse = await page.goto(`${origin}/round-5-missing`, { waitUntil: 'networkidle' });
    routes['/round-5-missing'] = { status: missingResponse?.status(), title: await page.title(), h1: await page.locator('h1').textContent() };
    assert(missingResponse?.status() === 404, 'unknown route did not return HTTP 404');
    assert(await page.title() === 'Page not found — Deadline Packet', '404 title is wrong');
    assert(await page.locator('h1').textContent() === 'Page not found.', '404 h1 is wrong');
    await page.screenshot({ path: resolve(evidenceDir, '404-desktop.png'), fullPage: true });
    await axeRoute(page, '404');
    report.routes = { pages: routes, links };
    await context.close();
  }

  {
    const html = await (await fetch(`${origin}/`, { cache: 'no-store' })).text();
    const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/index-[^"?]+\.(?:js|css))/g)].map((match) => match[1]);
    assert(assetPaths.length === 2, 'could not resolve live JS and CSS assets');
    for (const path of assetPaths) {
      const liveBytes = Buffer.from(await (await fetch(`${origin}${path}`, { cache: 'no-store' })).arrayBuffer());
      const localBytes = await readFile(resolve('dist', path.slice(1)));
      const liveSha256 = createHash('sha256').update(liveBytes).digest('hex');
      const localSha256 = createHash('sha256').update(localBytes).digest('hex');
      assert(liveSha256 === localSha256, `${path} does not match dist`);
      report.assets[path] = { bytes: liveBytes.length, liveSha256, localSha256 };
    }
  }

  const expected404NavigationErrors = errors.filter(({ page, text }) => page.endsWith('/round-5-missing') && /Failed to load resource: the server responded with a status of 404/.test(text));
  const unexpectedErrors = errors.filter((error) => !expected404NavigationErrors.includes(error));
  report.consoleErrors = { unexpected: unexpectedErrors, expected404NavigationErrors };
  assert(unexpectedErrors.length === 0, `console errors: ${unexpectedErrors.map(({ text }) => text).join(' | ')}`);
  await writeFile(resolve(evidenceDir, 'live-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
