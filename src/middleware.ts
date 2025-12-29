// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Defina quais rotas são protegidas (que precisam de login)
const protectedRoutes = ['/profile'];

// 2. Defina quais rotas são públicas (login, cadastro, landing page)
const publicRoutes = ['/', '/politica-de-privacidade', '/termos-de-uso'];

export function middleware(request: NextRequest) {
  // Pega o caminho atual que o usuário está tentando acessar
  const path = request.nextUrl.pathname;

  // Verifica se existe o cookie de sessão (refreshToken)
  // Nota: O nome deve ser igual ao que você definiu no REFRESH_TOKEN_COOKIE_NAME
  const token = request.cookies.get('refreshToken')?.value;

  // --- LÓGICA DE PROTEÇÃO ---

  // A. Se o usuário tenta acessar rota protegida E não tem token
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  
  if (isProtectedRoute && !token) {
    // Redireciona para a raiz (Login)
    return NextResponse.redirect(new URL('/', request.url));
  }

  // B. (Opcional) Se o usuário JÁ tem token e tenta acessar a tela de Login '/'
  // você pode querer mandar ele direto para a home
  if (path === '/' && token) {
     return NextResponse.redirect(new URL('/home', request.url));
  }

  // --- LÓGICA DE CACHE (RESOLVE O PROBLEMA DO BOTÃO VOLTAR) ---
  
  // Cria a resposta padrão para continuar o fluxo
  const response = NextResponse.next();

  // Se a rota for protegida, adicionamos headers para MATAR o cache do navegador
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  return response;
}

// Configuração do Next.js para saber onde rodar esse middleware
export const config = {
  /*
   * Matcher:
   * Filtra para rodar apenas nas rotas necessárias, ignorando:
   * - api (rotas de backend)
   * - _next/static (arquivos estáticos)
   * - _next/image (otimização de imagens)
   * - favicon.ico (ícone)
   * - imagens png/svg/jpg
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};