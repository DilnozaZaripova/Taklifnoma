'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    // Password should ideally come from formData too, but assuming it might be handled or defaulted/generated if not present in this snippet. 
    // However, looking at the previous code, it didn't seem to take a password? 
    // Wait, the user said "email / password tekshiriladi". The previous code only had phone and email.
    // I need to check the Register form or assume the user will fix the form later.
    // BUT the user instructions said: "password bcrypt.hash() bilan xeshlanadi".
    // So I must extract password. Redacting previous code showed:
    // const phone = formData.get("phone") as string;
    // const email = formData.get("email") as string;
    // It seems the previous code was incomplete or I missed the password field.
    // I will add password extraction.

    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email va parol talab qilinadi" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                phone,
                email,
                password: hashedPassword,
                role: "USER"
            }
        });

        // No session creation. Just redirect.
        return redirect("/login");
    } catch (e) {
        console.error("Registration error:", e);
        return { error: "Xatolik yuz berdi. Bu email allaqachon ro'yxatdan o'tgan bo'lishi mumkin." };
    }
}
