import express from 'express';
import { chatWithGemini } from '../controllers/chatController';

const router = express.Router();

router.post('/', chatWithGemini); // Public or protected depending on needs. Public for website chatbot.

export default router;
