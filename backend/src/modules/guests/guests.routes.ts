import { Router } from 'express';
import { GuestController } from './guests.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const guestController = new GuestController();

// Public route - guest can view invitation via token
router.get('/link/:token', (req, res) => guestController.getGuestByToken(req, res));

// Protected routes
router.post('/', authenticate, (req, res) => guestController.createGuest(req, res));
router.get('/wedding/:weddingId', authenticate, (req, res) => guestController.getGuestsByWedding(req, res));
router.get('/wedding/:weddingId/stats', authenticate, (req, res) => guestController.getStats(req, res));
router.put('/:id', authenticate, (req, res) => guestController.updateGuest(req, res));
router.delete('/:id', authenticate, (req, res) => guestController.deleteGuest(req, res));

export default router;
