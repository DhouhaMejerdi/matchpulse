// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // ✅ Add wildcard pattern to allow query-string URLs from /api/crest
    localPatterns: [
      {
        pathname: '/api/crest',
        search: '*', // 👈 allow any query string (?name=..., ?size=...)
      },
    ],
    // ✅ SVG safe + local only
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: blob;",
  },
};

export default nextConfig;
