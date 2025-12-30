import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/verify', (req, res) => authController.verify(req, res));

export default router;
