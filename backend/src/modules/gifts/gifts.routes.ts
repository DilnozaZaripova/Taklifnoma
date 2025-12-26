import { Router } from 'express';
import { GiftsController } from './gifts.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const giftsController = new GiftsController();

router.post('/:weddingId', (req, res) => giftsController.sendGift(req, res));
router.get('/:weddingId', authenticate, (req, res) => giftsController.listByWedding(req, res));

export default router;
