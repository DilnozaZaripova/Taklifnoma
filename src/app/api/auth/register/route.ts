import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Barcha maydonlarni to'ldiring" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Bu email allaqachon ro'yxatdan o'tgan" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return NextResponse.json(
            {
                message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
                user
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "Server xatosi" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
