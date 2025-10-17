// src/app/api/crest/route.ts
import { NextResponse } from 'next/server';

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashToHue(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  // keep it pleasant: avoid 0–30 (reds) to not clash with brand-500
  const hue = (Math.abs(h) % 300) + 30; // 30..330
  return hue;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'Team';
  const size = Math.max(24, Math.min(256, Number(searchParams.get('size')) || 64));
  const radius = size / 2;
  const fontSize = Math.floor(size * 0.42);

  const hue = hashToHue(name);
  const bg = `hsl(${hue} 70% 45%)`;
  const text = `hsl(${hue} 100% 96%)`;
  const init = initialsFrom(name);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${name} crest">
    <title>${name} crest</title>
    <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${bg}" />
    <text x="50%" y="54%" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="${text}" dy="0" dominant-baseline="middle">${init}</text>
    </svg>`.trim();

  const res = new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      // cache for a day (tweak later if crests might change)
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
  return res;
}
