import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "database",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                domain: process.env.NODE_ENV === 'production' ? '.invite.uz' : undefined
            }
        }
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                (session.user as any).id = user.id;
                (session.user as any).role = (user as any).role;
                (session.user as any).subscriptionTier = (user as any).subscriptionTier;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
};
