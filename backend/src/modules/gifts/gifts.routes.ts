import { Router } from 'express';
import { GiftsController } from './gifts.controller';

const router = Router();
const controller = new GiftsController();

router.post('/', controller.createGift.bind(controller));
router.get('/:weddingId', controller.getGiftsByWedding.bind(controller));

export default router;
