import { GoogleGenerativeAI } from "@google/generative-ai";
import db from '../../config/db';
import { config } from '../../config/index.js';
import { AIPromptBuilder } from './prompt_builder.js';
import { InvitationInput } from './validators.js';
import { randomUUID } from 'crypto';

interface InvitationResponse {
    title: string;
    body_text: string;
    closing_quote: string;
}

export class AIService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        if (!config.GEMINI_API_KEY) {
            console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables.");
        }
        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || '');
    }

    async generateInvitation(data: InvitationInput) {
        // Step A: Secure the API Key
        if (!config.GEMINI_API_KEY) {
            console.error("API Key missing");
            return {
                generated_text: "Tizimda texnik xatolik: API kaliti topilmadi.",
                language: data.language,
                ai_generated: false,
                error: true
            };
        }

        const model = this.genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.7,
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

                if (!text) {
                    throw new Error("AI javob qaytarmadi");
                }

                // Step B: Clean the Response (Robust Regex to remove markdown)
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                console.log("Cleaned AI Response:", text);

                // Parse JSON response
                let invitationData: InvitationResponse;
                try {
                    invitationData = JSON.parse(text);
                } catch (parseError) {
                    console.error("JSON parse error:", parseError);
                    console.error("Raw AI response was:", text);

                    invitationData = {
                        title: `${data.groom_name} va ${data.bride_name}ning to'yi`,
                        body_text: text,
                        closing_quote: "Baxtli bo'linglar!"
                    };
                }

                // Format final text
                const formattedText = `${invitationData.title}\n\n${invitationData.body_text}\n\n${invitationData.closing_quote}`;

                // Save to database
                const id = randomUUID();
                await db.insert('invitations', {
                    id,
                    content: formattedText,
                    language: data.language,
                    aiGenerated: true,
                    createdAt: new Date().toISOString()
                });

                return {
                    generated_text: formattedText,
                    title: invitationData.title,
                    body_text: invitationData.body_text,
                    closing_quote: invitationData.closing_quote,
                    language: data.language,
                    ai_generated: true
                };

            } catch (error: any) {
                attempts++;
                console.error(`Gemini AI Attempt ${attempts} failed:`, error.message);

                if (attempts === maxAttempts) {
                    // Step C: Fallback Mode after all retries fail
                    const fallbackText = this.generateFallbackInvitation(data);
                    return {
                        generated_text: fallbackText,
                        title: "Taklifnoma",
                        body_text: fallbackText,
                        closing_quote: "Baxt va omad tilaymiz!",
                        language: data.language,
                        ai_generated: false,
                        error: false // Soft fail for user experience
                    };
                }

                // Wait before retrying (exponential backoff: 1s, 2s, etc.)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        // Should not reach here due to fallback in loop, but just in case
        return { generated_text: this.generateFallbackInvitation(data), ai_generated: false, error: false };
    }

    private generateFallbackInvitation(data: InvitationInput): string {
        const dateFormatted = new Date(data.wedding_date).toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `${data.groom_name} va ${data.bride_name}ning to'yi

Hurmatli mehmonlar!

Farzandlarimiz ${data.groom_name} va ${data.bride_name}ning to'y marosimiga sizni samimiy qadrdonlik bilan taklif etamiz.

Sana: ${dateFormatted}
Manzil: ${data.wedding_location}

Sizning qadrli ishtirokingizsiz bu baxt yarim bo'lur edi.

Baxt va omad tilaymiz!`;
    }
}
