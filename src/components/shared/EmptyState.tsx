'use client';
import * as React from 'react';

type Props = {
  title: string;
  hint?: string;
};

export default function EmptyState({ title, hint }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="card"
      style={{
        padding: 16,
        display: 'grid',
        placeItems: 'center',
        gap: 8,
        textAlign: 'center',
      }}
    >
      {/* simple placeholder “image” */}
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 48,
          borderRadius: 10,
          background: 'var(--ui-200)',
          boxShadow: 'var(--shadow-sm)',
        }}
      />
      <p className="p" style={{ margin: 0, fontWeight: 600 }}>{title}</p>
      {hint ? (
        <p className="small" style={{ margin: 0, color: 'var(--muted-600)' }}>{hint}</p>
      ) : null}
    </div>
  );
}
