import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: "Email and code are required" },
                { status: 400 }
            );
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.verificationCode || !user.verificationExpiry) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired code" },
                { status: 400 }
            );
        }

        // Check expiry
        if (new Date() > user.verificationExpiry) {
            return NextResponse.json(
                { success: false, message: "Code has expired. Please request a new one" },
                { status: 400 }
            );
        }

        // Trigger NextAuth sign in with credentials
        // This will use the CredentialsProvider to verify the code
        const result = await signIn("credentials", {
            email,
            code,
            redirect: false,
        });

        if (result?.error) {
            return NextResponse.json(
                { success: false, message: "Invalid verification code" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Successfully authenticated",
            redirectUrl: "/dashboard",
        });
    } catch (error: any) {
        console.error("Verify code error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify code" },
            { status: 500 }
        );
    }
}
