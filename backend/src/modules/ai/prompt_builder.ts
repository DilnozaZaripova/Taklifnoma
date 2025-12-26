export class AIPromptBuilder {
    static buildInvitationPrompt(data: {
        groomName: string;
        brideName: string;
        weddingDate: string;
        weddingLocation: string;
        language: string;
        tone: string;
        style: string;
    }): string {
        const { groomName, brideName, weddingDate, weddingLocation, language, tone, style } = data;

        // System instruction for structured JSON output
        const systemInstruction = `You are a professional wedding poet and copywriter with deep knowledge of Uzbek traditions and customs. Your goal is to write a wedding invitation text that respects cultural values and creates an emotional connection.`;

        // Tone guidelines
        const toneGuidelines = {
            samimiy: "Use warm, friendly, and intimate language. Address guests as close friends and family.",
            rasmiy: "Use respectful, formal language with traditional phrases like 'taklif qilamiz' and 'hurmat bilan'.",
            iliq: "Use a balanced tone that is warm yet respectful, suitable for all types of guests."
        };

        // Style guidelines
        const styleGuidelines = {
            milliy: "Incorporate traditional Uzbek wedding phrases and cultural references. Use poetic expressions common in Uzbek wedding traditions.",
            klassik: "Use timeless, elegant language that has been used in wedding invitations for generations.",
            zamonaviy: "Use modern, concise language while maintaining respect for tradition."
        };

        const prompt = `${systemInstruction}

**Task**: Generate a wedding invitation text in pure JSON format.

**Input Data**:
- Groom: ${groomName}
- Bride: ${brideName}
- Date: ${weddingDate}
- Location: ${weddingLocation}
- Language: ${language} (Uzbek in Latin script)
- Tone: ${tone} - ${toneGuidelines[tone as keyof typeof toneGuidelines] || toneGuidelines.samimiy}
- Style: ${style} - ${styleGuidelines[style as keyof typeof styleGuidelines] || styleGuidelines.milliy}

**Output Format**: Return ONLY a JSON object with these exact fields:
{
  "title": "A short, elegant title for the invitation (5-10 words)",
  "body_text": "The main invitation text (3-5 sentences, respectful and warm)",
  "closing_quote": "A traditional Uzbek blessing or poetic closing line"
}

**Critical Requirements**:
1. Return ONLY the JSON object, no markdown formatting, no \`\`\`json tags
2. All text must be in Uzbek (Latin script) 
3. If tone is 'rasmiy', use respectful words: 'hurmat bilan', 'taklif etamiz', 'sharafli'
4. If style is 'milliy', include traditional Uzbek wedding blessings
5. Keep the text concise but emotionally rich
6. Do NOT include any explanation or comments outside the JSON

**Example Output** (structure only, create unique content):
{"title":"Baxtli oilaning tashkil topishi munosabati bilan","body_text":"Hurmatli mehmonlar! Farzandlarimiz ${groomName} va ${brideName}ning to'yiga sizni samimiy qadrdonlik bilan taklif etamiz. Ularning hayotidagi eng muhim kun sizning qadrli ishtirokingizsiz yarim bo'lur edi.","closing_quote":"Oyoq ostida toshlar ipak bo'lsin!"}`;

        return prompt.trim();
    }
}
