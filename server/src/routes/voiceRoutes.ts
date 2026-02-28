import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

router.post('/transcribe', protect as any, upload.single('audio'), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided' });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname || 'audio.webm',
            contentType: req.file.mimetype,
        });

        const response = await axios.post(`${AI_SERVICE_URL}/transcribe`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        res.status(200).json(response.data);
    } catch (error: any) {
        console.error('Transcription error:', error.message);
        res.status(500).json({ message: 'Error transcribing audio', error: error.message });
    }
});

export default router;
