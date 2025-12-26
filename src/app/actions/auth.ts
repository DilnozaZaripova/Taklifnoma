'use server';

import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function register(formData: FormData) {
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    // In a real app, we'd add validation and verification
    try {
        const user = await prisma.user.create({
            data: {
                phone,
                email,
                role: "USER"
            }
        });

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return redirect("/dashboard");
    } catch (e) {
        return { error: "Xatolik yuz berdi. Balki bu raqam allaqachon ro'yxatdan o'tgan?" };
    }
}
