// src/app/api/crest/route.ts
import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// ROUTE: /api/crest
// Responsibility: Redirect team crest requests to static image files
// Contracts: Accepts ?team=<slug>; maps to /images/crests/<slug>.png
// A11y: N/A (image endpoint; consumed by next/image)
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const team = url.searchParams.get('team');

  if (!team) {
    return NextResponse.json(
      { error: 'Missing "team" query parameter' },
      { status: 400 }
    );
  }

  // For now we simply redirect to a static file in /public/images/crests
  // Example: /images/crests/manchester-city.png
  const target = new URL(`/images/crests/${team}.png`, url.origin);

  return NextResponse.redirect(target.toString(), 302);
}
