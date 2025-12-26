import { Router } from 'express';
import { MediaController } from './media.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const router = Router();
const controller = new MediaController();

// 'file' matches the formData field name from frontend
router.post('/upload', upload.single('file'), controller.uploadMedia.bind(controller));
router.get('/:weddingId', controller.getMediaByWedding.bind(controller));

export default router;
