import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email va parol kiritilishi shart');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error('Email yoki parol noto\'g\'ri');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Email yoki parol noto\'g\'ri');
                }

                if (!user.emailVerified) {
                    // Optional: Block login if not verified? 
                    // User requested: "Agar email yuborish muvaffaqiyatli bo'lmasa: tasdiqlash sahifasiga O'TKAZMA".
                    // But if user IS created but not verified, we generally want to allow login but restrict access or show verify prompt.
                    // For now, let's allow return user, frontend can check emailVerified.
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
                    emailVerified: user.emailVerified
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                if (!user.email) return false;

                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    // Create new user via Google
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            fullName: user.name || "Foydalanuvchi",
                            emailVerified: true, // Auto-verify Google users
                            provider: "google",
                            role: "USER"
                        }
                    });
                } else {
                    // Link account logic if needed, or just allow.
                    // If user exists with credentials, we allow Google login to merge?
                    // Safer to just update provider or ensure emailVerified is true if logging in via Google
                    if (!existingUser.emailVerified) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { emailVerified: true, provider: 'google' } // Upgrade trust
                        });
                    }
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                // For Google Auth, 'user' id is the Google ID, not our DB ID.
                // We must fetch users from DB to get the real UUID.
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email as string }
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.emailVerified = dbUser.emailVerified;
                }
            } else if (token.email) {
                // Subsequent API calls - verify user still exists/get fresh role
                // Optional: Only fetch if critical, but for 'settings' syncing it helps.
                // For performance we can skip, but to be robust let's fetch if fields missing
                if (!token.id || !token.role) {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: token.email }
                    });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                        token.emailVerified = dbUser.emailVerified;
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).emailVerified = token.emailVerified;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login', // Redirect to login page on error
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
