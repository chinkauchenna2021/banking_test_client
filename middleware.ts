import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/faq',
    '/calculator'
  ].some((publicPath) => path.startsWith(publicPath));

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If trying to access protected path without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If trying to access auth pages with token
  if (
    isPublicPath &&
    path.startsWith('/auth') &&
    token &&
    !path.includes('/reset-password')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)'
  ]
};
