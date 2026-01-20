import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// OFAC COMPLIANCE: SANCTIONED COUNTRIES (ISO 3166-1 Alpha-2 Codes)
// As of January 2026, these regions are subject to US trade restrictions
const BLOCKED_COUNTRIES = [
  'RU', // Russia
  'IR', // Iran
  'KP', // North Korea
  'CU', // Cuba
  'SY', // Syria
];

export function middleware(req: NextRequest) {
  // Extract country from Vercel's geo headers
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || 'US';

  // Check against sanctions list
  if (BLOCKED_COUNTRIES.includes(country)) {
    // Redirect to compliance notice page
    const url = req.nextUrl.clone();
    url.pathname = '/blocked';
    return NextResponse.rewrite(url);
  }

  // Allow all other traffic
  return NextResponse.next();
}

// Apply middleware to all routes except static assets and API internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
