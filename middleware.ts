import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage');
  const isAuth = token?.value.includes('isAuthenticated":"true');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isAdminPage = request.nextUrl.pathname.startsWith('/dashboard/admin');
  
  // Redirect to login if trying to access protected routes without auth
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Redirect to dashboard if trying to access auth pages while authenticated
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};