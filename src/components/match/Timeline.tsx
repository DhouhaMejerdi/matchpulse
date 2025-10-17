'use client';
import * as React from 'react';
import type { MatchEvent } from '@/lib/api/types';

function iconFor(type: MatchEvent['type']) {
  switch (type) {
    case 'goal': return '⚽';
    case 'card': return '🟨';
    case 'sub':  return '🔄';
    case 'var':  return '🎥';
    case 'ht':   return 'HT';
    case 'ft':   return 'FT';
    default:     return '•';
  }
}

export default function Timeline({
  events,
  homeId,
  awayId,
}: {
  events: MatchEvent[];
  homeId: string;
  awayId: string;
}) {
  return (
    <div className="timeline">
      <div className="timeline__spine" aria-hidden />
      <ol className="timeline__list">
        {events.map((ev) => {
          const side = ev.teamId === homeId ? 'home' : ev.teamId === awayId ? 'away' : 'home';
          return (
            <li key={ev.id} className={`event event--${side}`}>
              <div className="event__content">
                <span className="event__minute">
                  {ev.minute}&apos;
                </span>
                <span className="event__icon" aria-hidden>{iconFor(ev.type)}</span>
                <span className="event__text">
                  <strong>{ev.player ?? ev.type.toUpperCase()}</strong>
                  {ev.note ? <span className="event__note"> — {ev.note}</span> : null}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
