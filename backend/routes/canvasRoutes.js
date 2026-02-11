import { Router } from 'express';
import { saveCanvas, loadCanvas, clearCanvas } from '../controllers/canvasController.js';

const router = Router();

// POST /api/canvas/save
router.post('/save', saveCanvas);

// GET /api/canvas/load
router.get('/load', loadCanvas);

// DELETE /api/canvas/clear
router.delete('/clear', clearCanvas);

export default router;
