// Continuous Learning Module
// Responsible for logging outcomes, analyzing feedback, and retraining models.
// TODO: Integrate reinforcement/online learning frameworks.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { retrainModel } from './mlPipeline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTCOME_LOG = path.resolve(__dirname, 'outcome_log.json');

export function logOutcome(taskId: string, outcome: any): void {
  let log: any[] = [];
  if (fs.existsSync(OUTCOME_LOG)) {
    log = JSON.parse(fs.readFileSync(OUTCOME_LOG, 'utf-8'));
  }
  log.push({ taskId, outcome, timestamp: new Date().toISOString() });
  fs.writeFileSync(OUTCOME_LOG, JSON.stringify(log, null, 2));
}

export function retrainModels(): void {
  // Load log and retrain
  if (fs.existsSync(OUTCOME_LOG)) {
    const log = JSON.parse(fs.readFileSync(OUTCOME_LOG, 'utf-8'));
    retrainModel(log);
  }
}
