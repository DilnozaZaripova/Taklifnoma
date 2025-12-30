import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import weddingRoutes from './modules/weddings/weddings.routes';
import aiRoutes from './modules/ai/ai.routes';
import giftRoutes from './modules/gifts/gifts.routes';
import mediaRoutes from './modules/media/media.routes';
import adminRoutes from './modules/admin/admin.routes';
import userRoutes from './modules/user/user.routes';
import rsvpRoutes from './modules/rsvp/rsvp.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import activityRoutes from './modules/activity/activity.routes';
import tableRoutes from './modules/tables/tables.routes';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tables', tableRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Root Route (Welcome Message)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Taklifnoma API is running 🚀',
        docs: '/api/docs',
        serverTime: new Date().toISOString()
    });
});

export default app;
