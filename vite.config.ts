import { defineConfig, type Plugin } from 'vite';

const csp = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.sociobot.in; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https://api.sociobot.in; upgrade-insecure-requests";

function responsePolicy(): Plugin {
  const middleware = (request: { url?: string }, response: { setHeader(name: string, value: string): void }, next: () => void) => {
    response.setHeader('Content-Security-Policy', csp);
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.url?.startsWith('/assets/') || request.url?.startsWith('/icons/')) response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (request.url?.startsWith('/sw.js')) response.setHeader('Cache-Control', 'no-cache');
    if (request.url?.startsWith('/manifest.webmanifest')) response.setHeader('Content-Type', 'application/manifest+json');
    next();
  };
  return {
    name: 'deadline-packet-response-policy',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}

export default defineConfig({
  plugins: [responsePolicy()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: { host: '127.0.0.1' },
});
