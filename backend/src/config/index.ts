import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key-change-it',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-it',
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    GEMINI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
};
