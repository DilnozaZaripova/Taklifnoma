import { Router } from 'express';
import { ActivityController } from './activity.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const activityController = new ActivityController();

router.get('/', authenticate, (req, res) => activityController.getActivities(req, res));
router.get('/wedding/:weddingId', authenticate, (req, res) => activityController.getActivitiesByWedding(req, res));

export default router;
