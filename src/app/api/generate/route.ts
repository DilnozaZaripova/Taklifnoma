import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { groomName, brideName, language, mode } = body;

        // In a real production environment, this is where you call the Gemini API
        // using process.env.GOOGLE_GENERATIVE_AI_API_KEY.
        // For this demo, we use a structured response that mimics the AI's logic.

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set. Using fallback generation.");
        }

        const variations = {
            UZ: [
                `Assalomu alaykum! Azizlar, sizlarni qadrdon farzandlarimiz ${groomName} va ${brideName}ning visol oqshomiga lutfan taklif etamiz.`,
                `Muhabbat qasridagi ilk qadam... ${groomName} & ${brideName}. Keling, bu quvonchli kunimizda birga bo'laylik.`,
                `Ikki qalb, bir taqdir. Aziz mehmonlar, ${groomName} va ${brideName}ning nikoh to'yiga xush kelibsiz!`
            ],
            RU: [
                `Дорогие друзья! Приглашаем вас разделить нашу радость на свадьбе ${groomName} и ${brideName}.`,
                `С любовью и уважением, ${groomName} & ${brideName}. Будем рады видеть вас на торжестве!`,
                `Два сердца, одна судьба. Добро пожаловать на свадьбу ${groomName} и ${brideName}!`
            ],
            EN: [
                `Dear family and friends! We invite you to celebrate the wedding of ${groomName} and ${brideName}.`,
                `With love, ${groomName} & ${brideName}. Join us on our special day!`,
                `Two hearts, one destiny. Welcome to the wedding of ${groomName} and ${brideName}!`
            ]
        };

        const result = variations[language as keyof typeof variations] || variations['UZ'];

        return NextResponse.json({ success: true, texts: result });
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }
}
