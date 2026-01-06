import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  console.log(token);
  console.log(pathname);

  const publicRoutes = ['/', '/visitors', '/privacidade', '/termos'];

  // 1. Lógica para Usuário NÃO Autenticado
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Lógica para Usuário JÁ Autenticado
  // Se ele já tem o token e tenta acessar a raiz (página de login)
  if (token && pathname === '/') {
    // Redirecione para a sua rota principal interna (ex: /dashboard ou /app)
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};