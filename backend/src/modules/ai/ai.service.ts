import { GoogleGenerativeAI } from "@google/generative-ai";
import db from '../../config/db';
import { config } from '../../config/index.js';
import { AIPromptBuilder } from './prompt_builder.js';
import { InvitationInput } from './validators.js';
import { randomUUID } from 'crypto';

// Improved Structured Response Interface with New Keys
interface InvitationResponse {
    headline: string;
    invitation_body: string; // New Key
    footer_quote: string;    // New Key
    // Mapped for compatibility
    main_body?: string;
    footer_note?: string;
    bismillah?: string; // Optional now, or we can generate one
}

export class AIService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        if (!config.GEMINI_API_KEY) {
            console.error("FATAL ERROR: GEMINI_API_KEY is not set.");
        }
        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || '');
    }

    async generateInvitation(data: InvitationInput) {
        if (!config.GEMINI_API_KEY) {
            return {
                error: true,
                message: "Tizimda texnik xatolik: API kaliti topilmadi."
            };
        }

        const model = this.genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.8, // Balanced for "Polite Host"
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        });

        const prompt = AIPromptBuilder.buildInvitationPrompt({
            groomName: data.groom_name,
            brideName: data.bride_name,
            weddingDate: data.wedding_date,
            weddingLocation: data.wedding_location,
            language: data.language,
            tone: data.tone,
            style: data.style
        });

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                if (!text) throw new Error("AI javob qaytarmadi");

                // Clean markdown
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                let invitationData: InvitationResponse;
                try {
                    invitationData = JSON.parse(text);
                } catch (parseError) {
                    console.error("JSON parse error:", parseError);
                    invitationData = {
                        headline: "Visol Oqshomi",
                        invitation_body: text,
                        footer_quote: "Baxtli bo'linglar!"
                    };
                }

                // Compatibility Mapping
                // Map new polite keys to old frontend keys so current UI still works, 
                // but we will update UI to use new keys too.
                const finalData = {
                    ...invitationData,
                    bismillah: "Bismillahir Rohmanir Rohim", // Add static or extract if needed
                    main_body: invitationData.invitation_body,
                    footer_note: invitationData.footer_quote,
                    intro_poem: "" // AI might include poem in body now, or we can leave empty
                };

                // Formatted text for legacy
                const formattedText = `${finalData.headline}\n\n${finalData.main_body}\n\n${finalData.footer_note}`;

                // Save to DB
                const id = randomUUID();
                await db.insert('invitations', {
                    id,
                    content: formattedText,
                    meta: JSON.stringify(finalData),
                    language: data.language,
                    aiGenerated: true,
                    createdAt: new Date().toISOString()
                });

                return {
                    success: true,
                    data: {
                        id, // Critical for Guest Portal Link
                        ...finalData,
                        generated_text: formattedText,
                        ai_generated: true
                    }
                };

            } catch (error: any) {
                attempts++;
                console.error(`Gemini AI Attempt ${attempts} failed:`, error.message);

                if (attempts === maxAttempts) {
                    const fallbackData = this.generateFallbackInvitation(data);
                    return {
                        success: true,
                        data: {
                            ...fallbackData,
                            generated_text: "Fallback Text",
                            ai_generated: false,
                            error: false
                        }
                    };
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        return { success: false, message: "AI generation failed." };
    }

    private generateFallbackInvitation(data: InvitationInput): any {
        const dateFormatted = new Date(data.wedding_date).toLocaleDateString('uz-UZ', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        return {
            headline: "Nikoh To'yi",
            bismillah: "Bismillahir Rohmanir Rohim",
            main_body: `Hurmatli mehmonlar!\n\nBizning quvonchli kunimizda, ${dateFormatted} sanasida, ${data.wedding_location} restoranida yoziladigan dasturxonimizga lutfan taklif etamiz.\n\nSizning tashrifingiz biz uchun sharafdir.`,
            footer_note: "Keling, quvonchimizga sherik bo'ling!",
            invitation_body: `Hurmatli mehmonlar!\n\nBizning quvonchli kunimizda, ${dateFormatted} sanasida, ${data.wedding_location} restoranida yoziladigan dasturxonimizga lutfan taklif etamiz.\n\nSizning tashrifingiz biz uchun sharafdir.`,
            footer_quote: "Keling, quvonchimizga sherik bo'ling!"
        };
    }
}
