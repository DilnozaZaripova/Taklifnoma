import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  debug: true,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", label: "Email" },
        code: { type: "text", label: "Verification Code" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.code) {
            return null;
          }

          const email = credentials.email as string;
          const code = credentials.code as string;

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // Check if verification code exists and hasn't expired
          if (!user.verificationCode || !user.verificationExpiry) {
            return null;
          }

          // Check expiry
          if (new Date() > user.verificationExpiry) {
            return null;
          }

          // Verify code (hashed comparison)
          const isValid = await bcrypt.compare(code, user.verificationCode);
          if (!isValid) {
            return null;
          }

          // Clear verification code after successful login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              verificationCode: null,
              verificationExpiry: null,
            },
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
});
