'use client';
import React from 'react';
import StatusBadge from '@/components/match/StatusBadge';
import { STATUS_MAP, type StatusCode } from '@/lib/status/statusMap';

export default function StatusPreviewPage() {
  const codes = Object.keys(STATUS_MAP) as StatusCode[];

  return (
    <main
      style={{
        padding: '2rem',
        background: 'var(--surface-2, #f2f5fa)',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--ink-900, #0b0f1a)',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Match Status Preview
      </h1>

      <ul style={{ display: 'grid', gap: '1rem', listStyle: 'none', padding: 0 }}>
        {codes.map((code) => (
          <li key={code}>
            <StatusBadge code={code} />{' '}
            <span style={{ marginLeft: '0.5rem', color: 'var(--muted-600, #5b6475)' }}>
              {STATUS_MAP[code].description ?? 'Preview'}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
