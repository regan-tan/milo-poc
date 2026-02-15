import { Router } from 'express';
import {
  sendMessage,
  getChatHistory,
  clearChat,
  setApiKey,
  getApiKeyStatus
} from '../controllers/chatController.js';

const router = Router();

// Chat endpoints
router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.post('/clear', clearChat);

export default router;
