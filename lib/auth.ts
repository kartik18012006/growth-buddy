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
    async jwt({ token, user, account }) {
      // Store user info in token - no DB lookup for performance
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user?.email) {
        // Run DB operations asynchronously without blocking sign-in
        // Use setImmediate to run after response is sent
        setImmediate(async () => {
          try {
            await connectDB();
            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
              await User.create({
                email: user.email,
                name: user.name || 'User',
                emailVerified: true,
                lastLoginAt: new Date(),
              });
              console.log('✅ New user created:', user.email);
            } else {
              existingUser.lastLoginAt = new Date();
              await existingUser.save();
              console.log('✅ User updated:', user.email);
            }
          } catch (error) {
            console.error('⚠️ Error in background user sync:', error);
          }
        });
        
        return true;
      }
      if (!user?.email) {
        console.error('❌ No email provided in user object');
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      // Use token data instead of DB lookup for performance
      if (token && session.user) {
        session.user.id = token.id as string;
        if (token.name) {
          session.user.name = token.name as string;
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
};
