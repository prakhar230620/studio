import { NextResponse } from 'next/server';

// No-op middleware: we no longer use locale routing or next-intl.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};