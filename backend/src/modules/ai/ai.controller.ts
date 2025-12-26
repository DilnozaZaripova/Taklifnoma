import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { AIService } from './ai.service.js';
import { invitationSchema } from './validators.js';

const aiService = new AIService();

export class AIController {
    async generateInvitation(req: AuthRequest, res: Response) {
        try {
            // 1. Validate Input
            const validation = invitationSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: "Ma'lumotlar xato kiritilgan",
                    errors: validation.error.format()
                });
            }

            // 2. Generate Content
            const result = await aiService.generateInvitation(validation.data);

            // 3. Handle response
            if (result.error) {
                return res.status(503).json({
                    success: false,
                    ...result
                });
            }

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Serverda kutilmagan xatolik yuz berdi"
            });
        }
    }
}
