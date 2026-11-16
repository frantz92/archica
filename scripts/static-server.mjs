// Dependency-free static server for out/, used by `npm run start`, the E2E tests and Lighthouse.
// It applies the same rules as the deployed .htaccess (scripts/lib/site-config.mjs):
// `/` redirects to the default language, directories get a trailing slash, unknown URLs
// return 404.html with status 404, and every response carries the security headers.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FORCED_TYPES, HOME_PATH, HTML_CACHE, securityHeaders } from './lib/site-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const portArgument = process.argv.indexOf('--port');
const port = Number(
  portArgument > -1 ? process.argv[portArgument + 1] : (process.env.PORT ?? 3000),
);
// WebKit upgrades http://localhost to https when the CSP says so; Chromium does not.
const upgradeInsecure = process.env.CSP_UPGRADE_INSECURE !== '0';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

if (!existsSync(join(root, 'index.html')) && !existsSync(join(root, '404.html'))) {
  console.error('out/ not found. Run `npm run build` first.');
  process.exit(1);
}

function resolveFile(pathname) {
  const target = normalize(join(root, pathname));
  if (target !== root && !target.startsWith(root + sep)) return null;
  if (!existsSync(target)) return null;
  const stats = statSync(target);
  if (stats.isFile()) return { file: target };
  if (stats.isDirectory()) {
    const index = join(target, 'index.html');
    return existsSync(index) ? { file: index, directory: true } : null;
  }
  return null;
}

function send(response, status, file, extra = {}) {
  const name = file.split(sep).pop() ?? '';
  const type = FORCED_TYPES[name] ?? TYPES[extname(file)] ?? 'application/octet-stream';
  response.writeHead(status, {
    'Content-Type': type,
    ...(type.startsWith('text/html') ? { 'Cache-Control': HTML_CACHE } : {}),
    ...Object.fromEntries(
      securityHeaders({ upgradeInsecure, preview: process.env.SITE_ENV === 'preview' }),
    ),
    ...extra,
  });
  return file;
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = '/__bad__';
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (pathname === '/') {
    response.writeHead(301, { Location: HOME_PATH }).end();
    return;
  }

  const found = resolveFile(pathname);
  if (found?.directory && !pathname.endsWith('/')) {
    response.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
    return;
  }

  const notFound = join(root, '404.html');
  const file = found ? found.file : notFound;
  const status = found ? 200 : 404;
  if (!found && !existsSync(notFound)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  send(response, status, file);
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
