import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store in EmailVerification table
        await prisma.emailVerification.create({
            data: {
                email,
                code, // Store raw code temporarily (or hash it if preferred, but user example showed simplistic storage, we will store raw for now based on auth.ts logic provided by user in step 430 which had simple comparison `where: { email, code }`)
                // Wait, the auth.ts user provided in STEP 430:
                // const record = await prisma.emailVerification.findFirst({ where: { email, code, ... } })
                // This implies PLAIN TEXT code storage if we use findFirst with code directly. 
                // My previous auth.ts (Step 444) uses `findFirst({ where: { email, code, ... } })`. 
                // So I must store plain text code here to match. 
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        // Send email with code
        await sendMail({
            to: email,
            subject: "Inviter.uz tasdiqlash kodi",
            text: `Sizning tasdiqlash kodingiz: ${code}. Kod 5 daqiqa amal qiladi.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4B0082;">Inviter.uz</h2>
          <p>Sizning tasdiqlash kodingiz:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">Kod 5 daqiqa davomida amal qiladi.</p>
        </div>
      `,
        });

        // Console log for debug (optional, can remove in strict production if wanted)
        console.log(`CODE SENT TO ${email}: ${code}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Send code error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
