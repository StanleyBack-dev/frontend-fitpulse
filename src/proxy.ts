import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const env = process.env.NODE_ENV;
  const token = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // 🔓 Em modo dev, não faz nenhuma validação
  if (env === "development") {
    return NextResponse.next();
  }

  // ✅ Em produção, aplica as regras normais
  const isAuthPage = pathname === "/";
  const isProtectedRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/ajustes") ||
    pathname.startsWith("/perfil");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};