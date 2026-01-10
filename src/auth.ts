import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        code: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.code) {
          return null;
        }

        const email = credentials.email as string;
        const code = credentials.code as string;

        // 1. Verify code in EmailVerification table
        const verification = await prisma.emailVerification.findFirst({
          where: {
            email,
            code,
            expiresAt: { gt: new Date() }, // Check if not expired
          },
        });

        if (!verification) {
          return null;
        }

        // 2. Find or Create User
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              onboardingCompleted: false, // Flag for new users
            },
          });
        }

        // 3. Delete used verification code
        await prisma.emailVerification.delete({
          where: { id: verification.id },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
