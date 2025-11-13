// =============================================================================
// PAGE SHELL: RootLayout (App Router)
// -----------------------------------------------------------------------------
// Responsibility: Global HTML skeleton (fonts, landmarks, header/main/footer);
//                 wires global styles once and exposes a skip link for
//                 keyboard users.
// Contracts: Children (server/client components) are rendered inside <main>;
//            font vars + tokens load before any Sass modules that emit CSS.
// A11y: Landmarks via semantic header/main/footer; skip link jumps to
//       #main-content; <main> is programmatically focusable for keyboard
//       users.
// Owner: Frontend Team • Last updated: 2025-11-13
// =============================================================================

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// 1) TOKENS (CSS variables) — must be first for the entire app --------------
import "@/styles/tokens/index.css";

// 2) GLOBAL SASS ENTRY — may @use modules that emit CSS ----------------------
import "@/styles/index.scss";

import SiteHeader from "@/components/layout/SiteHeader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatchPulse — Live Match Center",
  description: "Follow live fixtures, timelines, and team stats.",
};

export const viewport: Viewport = {
  // NOTE: Use a token so themeColor stays in sync with theming.
  themeColor: "var(--color-brand, #FF4D4F)",
  width: "device-width",
  initialScale: 1,
};

// -- PROPS --------------------------------------------------------------------
type RootProps = Readonly<{ children: React.ReactNode }>;

// -- RENDER -------------------------------------------------------------------
export default function RootLayout({ children }: RootProps): React.ReactElement {
  return (
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* A11Y: First tabbable element; lets keyboard users bypass the header. */}
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <SiteHeader />

        {/* A11Y: tabindex=-1 so skip link can move focus here; see BASE a11y helpers. */}
        <main id="main-content" tabIndex={-1} className="page">
          {children}
        </main>

        <footer className="container">
          <span className="small">© {new Date().getFullYear()} MatchPulse</span>
        </footer>
      </body>
    </html>
  );
}

// TODO(frontend-000): When we introduce dark mode, toggle data-theme and ensure
//                     viewport.themeColor reflects tokens for OS status bars.
