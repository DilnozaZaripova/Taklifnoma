import { Router } from 'express';
import { TableController } from './tables.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const tableController = new TableController();

router.post('/', authenticate, (req, res) => tableController.createTable(req, res));
router.get('/wedding/:weddingId', authenticate, (req, res) => tableController.getTablesByWedding(req, res));
router.get('/wedding/:weddingId/stats', authenticate, (req, res) => tableController.getStats(req, res));
router.put('/:id', authenticate, (req, res) => tableController.updateTable(req, res));
router.delete('/:id', authenticate, (req, res) => tableController.deleteTable(req, res));
router.post('/guests', authenticate, (req, res) => tableController.addGuest(req, res));
router.delete('/guests/:guestId', authenticate, (req, res) => tableController.removeGuest(req, res));

export default router;
