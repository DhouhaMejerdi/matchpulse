'use client';
import React from 'react';

type Props = {
  minute?: number | null; // if provided, shows “• 23’”; otherwise just “Live”
  className?: string;
};

export default function LiveMeta({ minute, className }: Props) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="live-dot" aria-hidden="true" />
      <span>Live{typeof minute === 'number' ? ` • ${minute}’` : ''}</span>
    </span>
  );
}
