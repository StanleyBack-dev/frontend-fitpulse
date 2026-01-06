import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// rotas públicas (sem login)
const publicRoutes = ['/', '/privacidade', '/termos', '/visitors'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // se a rota for pública, não faz checagem
  if (publicRoutes.includes(path)) return NextResponse.next();

  // protege apenas as rotas privadas
  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { Cookie: request.headers.get('cookie') || '' },
    });

    const data = await res.json();

    // se estiver autenticado, continua
    if (res.ok && data?.authenticated) return NextResponse.next();

    // senão, manda pro login
    return NextResponse.redirect(new URL('/', request.url));
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};