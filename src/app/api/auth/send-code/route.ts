import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email talab qilinadi" }, { status: 400 });
        }

        // 1. Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // 2. Store in DB
        await prisma.emailVerification.create({
            data: {
                email,
                code,
                expiresAt,
            },
        });

        // 3. Send Email
        await sendMail({
            to: email,
            subject: "Inviter.uz - Tasdiqlash kodi",
            text: `Sizning tasdiqlash kodingiz: ${code}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6b46c1;">Inviter.uz</h2>
          <p>Dasturga kirish uchun quyidagi kodni ishlating:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4c1d95;">
            ${code}
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">Kod 5 daqiqa davomida amal qiladi.</p>
        </div>
      `,
        });

        return NextResponse.json({ message: "Kod yuborildi" });
    } catch (error) {
        console.error("Send Code Error:", error);
        return NextResponse.json({ message: "Server xatoligi" }, { status: 500 });
    }
}
