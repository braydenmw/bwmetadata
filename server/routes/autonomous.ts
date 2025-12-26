import express, { Request, Response } from 'express';
import { AutonomousOrchestrator } from '../../services/AutonomousOrchestrator';

const router = express.Router();

router.post('/solve', async (req: Request, res: Response) => {
  try {
    const { problem, context, params, options } = req.body;
    const result = await AutonomousOrchestrator.solveAndAct(problem, context, params, options);
    res.json(result);
  } catch (err: any) {
    console.error('Autonomous solve error:', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

export default router;