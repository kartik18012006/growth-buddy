import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Get environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

// Validate required environment variables (log warnings, don't throw in production)
if (!googleClientId) {
  console.error('❌ GOOGLE_CLIENT_ID is not set');
}
if (!googleClientSecret) {
  console.error('❌ GOOGLE_CLIENT_SECRET is not set');
}
if (!nextAuthSecret) {
  console.error('❌ NEXTAUTH_SECRET is not set');
}
if (!nextAuthUrl) {
  console.warn('⚠️ NEXTAUTH_URL is not set');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || 'missing-client-id',
      clientSecret: googleClientSecret || 'missing-client-secret',
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user
            await User.create({
              email: user.email,
              name: user.name || 'User',
              emailVerified: true,
              lastLoginAt: new Date(),
            });
          } else {
            // Update existing user
            existingUser.lastLoginAt = new Date();
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
          session.user.name = user.name;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {

