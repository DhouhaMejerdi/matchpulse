// =============================================================================
// PAGE SHELL: RootLayout (App Router)
// -----------------------------------------------------------------------------
// Responsibility: Global HTML skeleton (fonts, landmarks, header/main/footer),
// wires global styles once, and exposes a skip link for keyboard users.
// Ensure global CSS load order. Tokens must load before any
// Sass modules that might emit CSS (reset/typography/a11y).
// Contracts: Children are server/client components rendered inside <main>.
// A11y: Landmarks (banner/main/contentinfo); visible :focus-visible ring;
//        skip link jumps to #main-content; honors prefers-reduced-motion.
// Owner: Frontend Team • Last updated: 2025-11-02
// =============================================================================

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// 1) TOKENS (CSS variables) — must be first for the entire app
import "@/styles/tokens/index.css";

// 2) GLOBAL SASS ENTRY — may @use modules that emit CSS
import "@/styles/index.scss";
import SiteHeader from "@/components/layout/SiteHeader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatchPulse — Live Match Center",
  description: "Follow live fixtures, timelines, and team stats.",
};

export const viewport: Viewport = {
  // NOTE: use a token to align with theming; fallback is allowed by spec
  themeColor: "var(--color-brand, #FF4D4F)",
  width: "device-width",
  initialScale: 1,
};

// -- PROPS --------------------------------------------------------------------
type RootProps = Readonly<{ children: React.ReactNode }>;

// -- RENDER -------------------------------------------------------------------
export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* A11Y: Visually hidden until focus; first tabbable for quick navigation */}
        <a className="skip-link" href="#main-content">Skip to main content</a>

        {/* NOTE: Banner landmark wraps the site header for SR clarity */}
        <header role="banner">
          <SiteHeader />
        </header>

        {/* A11Y: Main landmark + target for the skip link */}
        <main id="main-content" role="main" className="page">
          {children}
        </main>

        <footer role="contentinfo" className="container">
          <span className="small">© {new Date().getFullYear()} MatchPulse</span>
        </footer>
      </body>
    </html>
  );
}

// TODO(frontend-000): When we introduce dark mode, toggle data-theme and ensure
//                    themeColor reflects tokens for OS status bars.
