import { Router } from 'express';
import { MediaController } from './media.controller';

const router = Router();
const mediaController = new MediaController();

router.post('/:weddingId', (req, res) => mediaController.upload(req, res));
router.get('/:weddingId', (req, res) => mediaController.getByWedding(req, res));

export default router;
