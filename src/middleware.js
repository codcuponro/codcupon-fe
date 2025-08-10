import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect /upload for guests
  if (pathname.startsWith('/upload') && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent logged-in users from visiting /login
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/upload', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/upload', '/login'],
  // matcher: [],
};
