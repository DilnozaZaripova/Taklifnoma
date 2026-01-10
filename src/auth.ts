import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.code) {
            return null;
          }

          const email = credentials.email as string;
          const code = credentials.code as string;

          // Find valid verification record
          const record = await prisma.emailVerification.findFirst({
            where: {
              email,
              code,
              expiresAt: { gt: new Date() },
            },
          });

          if (!record) {
            return null;
          }

          // Find or create user
          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              emailVerified: new Date(),
            },
          });

          // Delete used verification code
          await prisma.emailVerification.deleteMany({
            where: { email },
          });

          return {
            id: user.id,
            email: user.email || "",
            name: user.name || "",
          };
        } catch (err) {
          console.error("AUTH ERROR:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
