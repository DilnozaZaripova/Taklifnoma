import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code
        const hashedCode = await bcrypt.hash(code, 10);

        // Set expiry to 5 minutes from now
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user if doesn't exist
            user = await prisma.user.create({
                data: {
                    email,
                    verificationCode: hashedCode,
                    verificationExpiry: expiry,
                },
            });
        } else {
            // Update existing user with new code
            await prisma.user.update({
                where: { email },
                data: {
                    verificationCode: hashedCode,
                    verificationExpiry: expiry,
                },
            });
        }

        // For now, log the code to console (in production, send via email)
        console.log(`
═══════════════════════════════════
  VERIFICATION CODE for ${email}
  Code: ${code}
  Expires in 5 minutes
═══════════════════════════════════
    `);

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email (check console for now)",
        });
    } catch (error: any) {
        console.error("Request code error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send verification code" },
            { status: 500 }
        );
    }
}
