import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
    routes: Array<{ route: string; headers: Record<string, string> }>;
    globalHeaders: Record<string, string>;
    mimeTypes: Record<string, string>;
    responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
  };

  it('ships CSP, immutable hashed caching, manifest MIME, and a real 404 response', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("object-src 'none'");
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(config.routes.find((route) => route.route === '/sw.js')?.headers['Cache-Control']).toBe('no-cache');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    const offline = readFileSync('public/offline.html', 'utf8');
    expect(offline).toContain('<title>Offline — Deadline Packet</title>');
    expect(offline).toContain('href="/privacy"');
    expect(offline).toContain('href="/terms"');
  });
});

it('maps every declared public claim to exactly one browser test tag', () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  const browserTests = readFileSync('tests/e2e/app.spec.ts', 'utf8');
  expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm run test:e2e -- --grep @claim:${claim.id}`);
    expect(browserTests.split(`@claim:${claim.id}`).length - 1, claim.id).toBe(1);
  }
});

it('keeps the demo controls at a 44px-or-larger touch target', () => {
  const styles = readFileSync('src/styles.css', 'utf8');
  expect(styles).toMatch(/\.demo-banner > div > button \{ min-height: 48px; \}/);
});

it('ships exact plain metadata, one lifetime-license term, and a 180px Apple icon', () => {
  const html = readFileSync('index.html', 'utf8');
  const main = readFileSync('src/main.ts', 'utf8');
  const readme = readFileSync('README.md', 'utf8');
  const manifest = readFileSync('public/manifest.webmanifest', 'utf8');
  const publicCopy = [html, main, readme, manifest].join('\n');
  expect(html).toContain('content="Organize one filing period’s invoices, receipts, evidence gaps, and questions for accountant review."');
  expect(html).toContain('content="Prepare invoices, receipts, evidence gaps, and questions for accountant review."');
  expect(html).toContain('rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180"');
  expect(publicCopy).not.toMatch(/one-time license|one-time unlock|lifetime unlock|new filing folder|accountant-ready|local-first|receipts, gaps/i);
  expect(publicCopy).not.toMatch(/Evidence in order|Questions in view|scattered evidence|Not another filing portal|without fine print|app shell|service worker|not in the packet/i);
  const icon = readFileSync('public/icons/apple-touch-icon.png');
  expect(icon.subarray(1, 4).toString()).toBe('PNG');
  expect(icon.readUInt32BE(16)).toBe(180);
  expect(icon.readUInt32BE(20)).toBe(180);
});

it('records exact hashes for the disclosed generated hero and both public derivatives', () => {
  const provenance = JSON.parse(readFileSync('assets/src/deadline-packet-hero.json', 'utf8')) as {
    source_sha256: string;
    derivatives: Array<{ path: string; sha256: string }>;
  };
  const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
  expect(hash('assets/src/deadline-packet-hero.png')).toBe(provenance.source_sha256);
  expect(provenance.derivatives.map(({ path }) => path).sort()).toEqual([
    'public/assets/deadline-packet-hero.webp',
    'public/assets/deadline-packet-social.webp',
  ]);
  for (const derivative of provenance.derivatives) expect(hash(derivative.path), derivative.path).toBe(derivative.sha256);
});

it('keeps the catalog description verb-first and within 120 characters', () => {
  const description = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
  expect(description.length).toBeLessThanOrEqual(120);
  expect(description).toMatch(/^Organize\b/);
});

it('keeps every recorded copy-audit count tied to product source', () => {
  const audit = readFileSync('.factory/copy-audit.md', 'utf8');
  const source = ['index.html', 'src/main.ts', 'public/manifest.webmanifest', 'README.md']
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
    .replace(/\$\{lifetimePrice\}/g, 'US$12')
    .replace(/<[^>]*>/g, ' ')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ');
  const rows = audit.split('\n').flatMap((line) => {
    const match = line.match(/^\| (.+) \| (\d+) \|/);
    return match ? [{ copy: match[1].replace(/`/g, '').trim(), recorded: Number(match[2]) }] : [];
  });
  const displayedWordCount = (copy: string) => copy.split(/\s+/u)
    .filter((token) => token !== '—').length;

  expect(rows.length).toBeGreaterThan(30);
  for (const row of rows) {
    expect(displayedWordCount(row.copy), row.copy).toBe(row.recorded);
    expect(row.recorded, row.copy).toBeLessThanOrEqual(22);
    expect(row.copy, row.copy).not.toMatch(/\b(?:leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem|AI-powered)\b/i);
    expect(source, row.copy).toContain(row.copy.replace(/\s+/g, ' '));
  }
});
