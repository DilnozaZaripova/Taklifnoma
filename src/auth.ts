import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true, // ✅ CRITICAL: Required for Render + custom domain

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) {
            return null;
          }

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
