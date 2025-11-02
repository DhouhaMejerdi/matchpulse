// =============================================================================
// COMPONENT: SiteHeader
// -----------------------------------------------------------------------------
// Responsibility: Visual/header content inside the banner landmark provided by
// RootLayout. Renders brand and primary navigation. Mobile-first, tokens-first.
// Contracts: No business logic; relies on RootLayout to wrap in <header role="banner">.
// A11y: Nav has aria-label; :focus-visible is visible; aria-current for active link.
// Owner: Frontend Team • Last updated: 2025-11-02
// =============================================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/components/_header.scss';

const links = [
  { href: '/', label: 'Matches' },
  { href: '/team/demo', label: 'Teams' },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <div className="header container">
      <Link className="header__home-link" href="/" aria-label="MatchPulse home">
        <span className="header__logo" aria-hidden="true" />
        <span className="header__title">MatchPulse</span>
      </Link>

      <nav className="header__nav" aria-label="Primary">
        <ul className="header__nav-list" role="list">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <li key={l.href} className="header__nav-item">
                <Link
                  href={l.href}
                  className="header__nav-link"
                  aria-current={active ? 'page' : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
