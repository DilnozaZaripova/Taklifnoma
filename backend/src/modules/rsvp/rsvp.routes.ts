import { Router } from 'express';
import { RSVPController } from './rsvp.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const rsvpController = new RSVPController();

// Public route - anyone can submit RSVP
router.post('/', (req, res) => rsvpController.createRSVP(req, res));

// Protected routes - wedding owner only
router.get('/wedding/:weddingId', authenticate, (req, res) => rsvpController.getRSVPsByWedding(req, res));
router.put('/:id', authenticate, (req, res) => rsvpController.updateRSVP(req, res));
router.delete('/:id', authenticate, (req, res) => rsvpController.deleteRSVP(req, res));

export default router;
