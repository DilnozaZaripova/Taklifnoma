'use server';

// This is a placeholder for the actual Gemini API call
// In production, we would use @google/generative-ai
export async function generateInvitationText(details: any) {
    const { groomName, brideName, language, mode } = details;

    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500));

    const texts = {
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

    return texts[language as keyof typeof texts] || texts['UZ'];
}
