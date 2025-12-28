import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow request to proceed immediately if token exists
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/habits/:path*', '/sleep/:path*', '/analytics/:path*', '/settings/:path*'],
};



