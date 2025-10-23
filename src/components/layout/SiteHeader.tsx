'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Matches' },
  { href: '/team/demo', label: 'Teams' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="container" style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
      <Link href="/" className="h2" aria-label="MatchPulse home">MatchPulse</Link>
      <nav aria-label="Primary" style={{ display: 'flex', gap: 12 }}>
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href} className="small" aria-current={active ? 'page' : undefined}
              style={{ padding: '6px 10px', borderRadius: 8, background: active ? 'var(--ui-200)' : 'transparent' }}>
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
