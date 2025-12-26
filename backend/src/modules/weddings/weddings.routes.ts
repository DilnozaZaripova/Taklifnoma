import { Router } from 'express';
import { WeddingsController } from './weddings.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();
const weddingsController = new WeddingsController();

router.post('/', authenticate, (req, res) => weddingsController.create(req, res));
router.get('/my', authenticate, (req, res) => weddingsController.getMyWeddings(req, res));
router.get('/:slug', (req, res) => weddingsController.getBySlug(req, res));

export default router;
