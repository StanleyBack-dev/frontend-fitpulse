import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/politica-de-privacidade', '/termos-de-uso']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}