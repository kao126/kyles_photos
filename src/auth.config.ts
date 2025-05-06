import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import { sha256 } from '@/lib/edge-hash';

export const authConfig = {
  providers: [Google, Twitter],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.id_token) {
        token.idToken = account?.id_token;
      }
      if (user?.email) {
        token.userId = await sha256(user.email.toLowerCase());
      }
      return token;
    },
    async session({ token, session }) {
      session.idToken = token.idToken;
      if (token.userId) {
        session.userId = token.userId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
