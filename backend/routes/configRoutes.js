import { Router } from 'express';
import { setApiKey, getApiKeyStatus } from '../controllers/chatController.js';

const router = Router();

// API key management
router.post('/openai-key', setApiKey);
router.get('/openai-key/status', getApiKeyStatus);

export default router;
