import { z } from 'zod';

export const invitationSchema = z.object({
    groom_name: z.string().min(2, "Kuyov ismi juda qisqa").max(50),
    bride_name: z.string().min(2, "Kelin ismi juda qisqa").max(50),
    wedding_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sana formati noto'g'ri (YYYY-MM-DD)"),
    wedding_location: z.string().min(3, "Manzil ko'rsatilishi shart"),
    language: z.enum(['uz', 'ru', 'en']),
    tone: z.enum(['rasmiy', 'samimiy', 'iliq']),
    style: z.enum(['klassik', 'zamonaviy', 'milliy'])
});

export type InvitationInput = z.infer<typeof invitationSchema>;
