import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value; // ajuste conforme o cookie de autenticação usado

  const isAuthPage = req.nextUrl.pathname === "/";
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/home");

  // Se tentar acessar rota protegida sem token → redireciona pro login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se já estiver logado e tentar acessar o login → redireciona pra home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

// define as rotas onde o middleware será executado
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};