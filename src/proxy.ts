import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// rotas públicas (não precisam de login)
const publicRoutes = ["/", "/termos", "/privacidade", "/visitors"];

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // chama o endpoint do backend que valida a sessão
  const response = await fetch(`${API_BASE}/api/auth/token/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { Cookie: request.headers.get("cookie") || "" },
  });

  const isAuthenticated = response.ok && (await response.json()).authenticated;

  // Se estiver na tela de login e estiver autenticado → manda pra /home
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(`${origin}/home`);
  }

  // Se for rota pública, deixa passar
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não estiver autenticado, redireciona pra /
  if (!isAuthenticated) {
    return NextResponse.redirect(`${origin}/`);
  }

  // autenticado e rota privada → segue o fluxo
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};