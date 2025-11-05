// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow /api/crest and any query string (e.g. ?team=manchester-city)
    localPatterns: [
      {
        pathname: '/api/crest',
        // NOTE: omit `search` to allow all query strings
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: blob;",
  },
};

export default nextConfig;
