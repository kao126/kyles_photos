// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt';

// JWT を拡張
declare module 'next-auth/jwt' {
  interface JWT {
    idToken: string;
    userId: string;
  }
}

// Session を拡張
declare module 'next-auth' {
  interface Session {
    idToken: string;
    userId: string;
  }
}
