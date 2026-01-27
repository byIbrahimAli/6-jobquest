import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for the session_auth cookie
  const authCookie = request.cookies.get('session_auth')

  // If the cookie is missing, redirect to the login page
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (login page)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
  ],
}
