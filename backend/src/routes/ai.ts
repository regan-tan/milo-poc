import { Router, Request, Response } from 'express';
import { transformSlide } from '../services/openaiClient';
import type { TransformSlideRequest } from '../types';

const router = Router();

/**
 * POST /api/transform-slide
 * Body: { html: string, css: string, prompt: string }
 * Returns: { html: string, css: string }
 */
router.post('/transform-slide', async (req: Request, res: Response) => {
  const { html, css, prompt } = req.body as Partial<TransformSlideRequest>;

  // ---------- Validation ----------
  if (typeof html !== 'string' || typeof css !== 'string' || typeof prompt !== 'string') {
    res.status(400).json({
      error: 'Invalid request body. Expected { html: string, css: string, prompt: string }.',
    });
    return;
  }

  if (!prompt.trim()) {
    res.status(400).json({ error: 'Prompt must not be empty.' });
    return;
  }

  // ---------- Transform ----------
  try {
    const result = await transformSlide({ html, css, instruction: prompt });
    res.json(result);
  } catch (err) {
    console.error('transform-slide error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
