import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';

/**
 * CSP without nonces is a deliberate choice (BLUEPRINT §10): the site has no forms,
 * no user data and no third-party scripts, and nonces would force dynamic rendering.
 */
function buildContentSecurityPolicy(): string {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'"];
  const frameSrc: string[] = [];
  const imgSrc = ["'self'", 'data:', 'blob:'];
  const fontSrc = ["'self'"];
  const styleSrc = ["'self'", "'unsafe-inline'"];

  if (isDev) {
    scriptSrc.push("'unsafe-eval'", 'https://va.vercel-scripts.com');
  }
  if (isPreview) {
    scriptSrc.push('https://vercel.live');
    connectSrc.push('https://vercel.live', 'wss://ws-us3.pusher.com');
    frameSrc.push('https://vercel.live');
    imgSrc.push('https://vercel.live', 'https://vercel.com');
    fontSrc.push('https://vercel.live', 'https://assets.vercel.com');
    styleSrc.push('https://vercel.live');
  }

  const directives: Array<[string, string[]]> = [
    ['default-src', ["'self'"]],
    ['script-src', scriptSrc],
    ['style-src', styleSrc],
    ['img-src', imgSrc],
    ['font-src', fontSrc],
    ['connect-src', connectSrc],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    ['form-action', ["'self'"]],
    ['frame-ancestors', ["'none'"]],
  ];
  if (frameSrc.length > 0) {
    directives.push(['frame-src', frameSrc]);
  }

  const parts = directives.map(([name, values]) => `${name} ${values.join(' ')}`);
  // In development the site runs over plain HTTP, so upgrading requests would break it.
  if (!isDev) {
    parts.push('upgrade-insecure-requests');
  }
  return parts.join('; ');
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/', destination: '/pl', permanent: true }];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: buildContentSecurityPolicy() },
          // No includeSubDomains / preload until it is confirmed that no archica.pl subdomain runs on HTTP.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
