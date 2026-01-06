import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/privacidade', '/termos', '/visitors'];
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { Cookie: request.headers.get('cookie') || '' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.authenticated) {
        return NextResponse.next();
      }
    }
  } catch {
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};