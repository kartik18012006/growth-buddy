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
      if (account?.provider === 'google' && user?.email) {
        try {
          // Set a timeout for database operations to prevent long delays
          const dbPromise = (async () => {
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
          })();

          // Wait max 5 seconds for DB operation, then allow sign-in anyway
          await Promise.race([
            dbPromise,
            new Promise((resolve) => setTimeout(resolve, 5000))
          ]);
          
          return true;
        } catch (error) {
          console.error('⚠️ Error in signIn callback (allowing sign-in anyway):', error);
          // Always allow sign-in even if DB operations fail
          return true;
        }
      }
      if (!user?.email) {
        console.error('❌ No email provided in user object');
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      // Don't block session creation on DB operations
      if (session.user?.email) {
        try {
          // Set timeout for session callback to prevent delays
          const sessionPromise = (async () => {
            await connectDB();
            const user = await User.findOne({ email: session.user.email });
            if (user) {
              session.user.id = user._id.toString();
              session.user.name = user.name;
            }
          })();

          // Wait max 2 seconds for DB operation
          await Promise.race([
            sessionPromise,
            new Promise((resolve) => setTimeout(resolve, 2000))
          ]);
        } catch (error) {
          // Log error but don't block session creation
          console.error('⚠️ Error in session callback:', error);
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
