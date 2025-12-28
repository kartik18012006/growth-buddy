import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile", // Calendar scopes removed for public access. Re-add after Google verification.
          // To re-enable Calendar: add "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
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
              googleCalendarConnection: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                tokenExpiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
                connectedAt: new Date(),
              },
            });
          } else {
            // Update existing user
            existingUser.lastLoginAt = new Date();
            if (account.access_token) {
              if (!existingUser.googleCalendarConnection) {
                existingUser.googleCalendarConnection = {};
              }
              existingUser.googleCalendarConnection.accessToken = account.access_token;
              existingUser.googleCalendarConnection.refreshToken = account.refresh_token;
              existingUser.googleCalendarConnection.tokenExpiresAt = account.expires_at
                ? new Date(account.expires_at * 1000)
                : undefined;
              existingUser.googleCalendarConnection.connectedAt = new Date();
            }
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};

