// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local /api/crest (with any query string)
    localPatterns: [
      {
        pathname: "/api/crest",
        // NOTE: omit `search` to allow all query strings
      },
    ],

    // ✅ Allow remote football-data crest images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
      },
    ],

    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' data: blob https://crests.football-data.org;",
  },
  
  async redirects() {
    return [
      {
        source: "/",
        destination: "/teams",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
