/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/auth.config';

export default async function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const host = headers.get('host') || nextUrl.host || '';

  // Check if request is coming via admin subdomain (e.g. admin.healthghuru.com)
  const isAdminSubdomain = host.startsWith('admin.');
  const pathname = nextUrl.pathname;

  // Handles requests on the admin subdomain
  if (isAdminSubdomain) {
    // Allow API routes to pass through directly
    if (pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    // Rewrite requests to /admin path internally if they don't already start with /admin
    if (!pathname.startsWith('/admin')) {
      const targetPath = `/admin${pathname === '/' ? '' : pathname}`;
      const rewriteUrl = nextUrl.clone();
      rewriteUrl.pathname = targetPath;

      // Check auth if trying to access protected admin route
      if (targetPath !== '/admin/login') {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
          const loginUrl = new URL('/login', req.url);
          loginUrl.searchParams.set('callbackUrl', pathname + nextUrl.search);
          return NextResponse.redirect(loginUrl);
        }
      }

      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // Standard route protection for /admin path (if accessed on main domain, e.g. healthghuru.com/admin)
  const isAdminRoute = (pathname === '/admin' || pathname.startsWith('/admin/')) && pathname !== '/admin/login';

  if (isAdminRoute) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname + nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, assets, and images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};



