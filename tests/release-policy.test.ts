import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
    routes: Array<{ route: string; headers: Record<string, string> }>;
    globalHeaders: Record<string, string>;
    mimeTypes: Record<string, string>;
    navigationFallback: { rewrite: string };
  };

  it('ships CSP, immutable hashed caching, manifest MIME, and SPA fallback', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("object-src 'none'");
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(config.routes.find((route) => route.route === '/sw.js')?.headers['Cache-Control']).toBe('no-cache');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.navigationFallback.rewrite).toBe('/index.html');
  });
});

it('keeps the demo controls at a 44px-or-larger touch target', () => {
  const styles = readFileSync('src/styles.css', 'utf8');
  expect(styles).toMatch(/\.demo-banner > div > button \{ min-height: 48px; \}/);
});
