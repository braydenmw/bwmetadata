/**
 * AI Inference Route
 * Placeholder for AI inference - configure API keys when ready
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Types for AI requests
interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

router.post('/invoke', async (req: Request, res: Response) => {
  const { prompt }: AIRequest = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  res.status(503).json({ 
    error: 'AI service not configured',
    message: 'Configure an API key in .env to enable AI inference'
  });
});

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'AI Intelligence',
    status: 'ready',
    configured: false,
    message: 'Add API key to .env to activate'
  });
});

export default router;
