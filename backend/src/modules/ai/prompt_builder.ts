export interface InvitationPromptData {
    groomName: string;
    brideName: string;
    weddingDate: string;
    weddingLocation: string;
    language: string;
    tone: string;
    style: string;
}

export class AIPromptBuilder {
    private static metaphors = [
        "The Stars (Yulduzlar): Focus on destiny writing their names in the sky.",
        "The Garden (Bo'g'): Focus on blooming love, spring, and roots.",
        "Destiny's Voyage (Taqdir Kemasi): Focus on a journey starting together.",
        "Pure Tradition (Sof An'ana): Focus on ancestral blessings and heritage."
    ];

    static buildInvitationPrompt(data: InvitationPromptData): string {
        // 1. Random Metaphor Selection
        const metaphor = this.metaphors[Math.floor(Math.random() * this.metaphors.length)];

        return `
ROLE: You are an expert Uzbek Wedding Coordinator and Polite Host.
INPUT DATA:
- Groom: ${data.groomName}
- Bride: ${data.brideName}
- Date: ${data.weddingDate}
- Location: ${data.weddingLocation}
- Tone: ${data.tone}
- Language: ${data.language}

INSTRUCTIONS:
1. **Mandatory Inclusion:** You MUST naturally embed the Location ('${data.weddingLocation}') and Date ('${data.weddingDate}') into the text. Do not just list them at the bottom.
2. **The 'Lutfan' Rule:** You must use the phrase 'lutfan taklif etamiz' or 'sizni intizorlik bilan kutamiz' in the sentence where you mention the venue.
3. **Metaphor:** Use "${metaphor}" as the underlying creative theme for the opening.
4. **Tone Check:** Ensure the transition from poetry to the logistical details (time/place) is smooth and grammatically correct in Uzbek.

OUTPUT FORMAT: You MUST return strictly valid JSON with these keys:
{
  "headline": "Short, elegant title (e.g., 'Visol Oqshomi')",
  "invitation_body": "3-4 paragraphs. Start with a poetic opening based on the '${metaphor}' theme. Then, in the MIDDLE paragraph, explicitly say something like: 'Ushbu quvonchli kunimizda sizni ${data.weddingDate} kuni ${data.weddingLocation} restoranida yoziladigan dasturxonimizga lutfan taklif etamiz.' (Ensure grammatical correctness). End with a warm closing.",
  "footer_quote": "A short philosophical quote about happiness or love."
}
`;
    }
}
