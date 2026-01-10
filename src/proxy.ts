import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function validateRefreshToken(refreshToken: string) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { cookie: `refreshToken=${refreshToken}` },
    });
    if (!res.ok) return false;

    const data = await res.json();
    return data.authenticated;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const env = process.env.NODE_ENV;
  const token = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  if (env === "development") return NextResponse.next();

  const isAuthPage = pathname === "/";
  const isProtectedRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/ajustes") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/saude") ||
    pathname.startsWith("/historico")
    ;

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const valid = await validateRefreshToken(token);
    if (!valid) {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  if (isAuthPage && token) {
    const valid = await validateRefreshToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      const res = NextResponse.next();
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};