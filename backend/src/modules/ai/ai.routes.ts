import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AIController } from './ai.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();
const aiController = new AIController();

// Rate limit for AI generation to prevent cost abuse (3 requests per minute)
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Juda ko'p so'rov yuborildi. Iltimos, birozdan keyin qayta urining."
    }
});

// Primary generation endpoint
router.post('/generate-invitation', authenticate, aiLimiter, (req, res) => aiController.generateInvitation(req, res));

export default router;
