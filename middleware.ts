import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/habits/:path*', '/sleep/:path*', '/analytics/:path*', '/settings/:path*'],
};



