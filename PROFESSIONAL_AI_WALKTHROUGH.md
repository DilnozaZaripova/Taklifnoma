# Walkthrough: Professional AI Invitation Module

I have fully refactored the AI functionality into a standalone, production-ready module that guarantees security, scalability, and high-quality results.

## 🛠️ Architecture: The AI Module (`backend/src/modules/ai/`)
The module is divided into specialized components for maximum clean-code compliance:

1.  **Prompt Builder (`prompt_builder.ts`)**: 
    - Separates logic for prompt engineering.
    - Handles tone (rasmiy, samimiy, iliq) and style (klassik, zamonaviy, milliy).
    - Ensures cultural alignment for Uzbek, Russian, and English invitations.
2.  **Validators (`validators.ts`)**: 
    - Uses **Zod** for strict input sanitization.
    - Validates names, dates, locations, and ENUM values (language, tone, style).
3.  **Service (`ai.service.ts`)**: 
    - Manages direct communication with the **Google Gemini Pro API**.
    - Includes fallback logic and structured error handling.
4.  **Controller (`ai.controller.ts`)**: 
    - Orchestrates the request lifecycle.
    - Standardizes API responses with clear success/error flags.
5.  **Routes (`ai.routes.ts`)**: 
    - Exposes the `POST /api/ai/generate-invitation` endpoint.
    - Protected by **Authentication** and **Rate Limiting**.

## 🛡️ Security Features
- **Backend-Only**: The Gemini API key remains strictly on the server in `.env`.
- **Rate Limiting**: Integrated `express-rate-limit` to prevent API abuse and cost spikes (set to 3 requests per minute per user).
- **Validation**: Strict schema validation prevents malicious input injection.

## 🚀 API Endpoint Usage
**Endpoint**: `POST /api/ai/generate-invitation`
**Headers**: `Authorization: Bearer <token>`
**Body**:
```json
{
  "groom_name": "Alisher",
  "bride_name": "Madina",
  "wedding_date": "2025-08-15",
  "wedding_location": "Shosh Saroyi, Toshkent",
  "language": "uz",
  "tone": "samimiy",
  "style": "zamonaviy"
}
```

This module is no longer a "demo" but a core engine for your startup's premium UX.
