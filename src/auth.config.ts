import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';

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
      return token;
    },
    async session({ token, session }) {
      session.idToken = token.idToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
