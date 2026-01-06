import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/";
  const isProtectedRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/ajustes");

  // Bloqueia acesso a rotas privadas sem token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se já estiver logado e tentar acessar o login → vai pra /home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};