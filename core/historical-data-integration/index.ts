// Historical Data Integration Module
// Responsible for ingesting, cleaning, and structuring historical data.
import path from 'path';
import { ingestCSV, ingestJSON, ingestAPI, cleanData } from './etlPipeline';

export async function ingestData(source: string): Promise<any> {
  // Example: Try to load CSV, then JSON, then API
  try {
    if (source.endsWith('.csv')) {
      const raw = await ingestCSV(source);
      return cleanData(raw);
    }
    if (source.endsWith('.json')) {
      const raw = await ingestJSON(source);
      return cleanData(raw);
    }
    if (source.startsWith('http')) {
      const raw = await ingestAPI(source);
      return cleanData(raw);
    }
    // Default: try a local file in data folder
    const csvPath = path.resolve(__dirname, '../../data', `${source}.csv`);
    const jsonPath = path.resolve(__dirname, '../../data', `${source}.json`);
    try {
      const raw = await ingestCSV(csvPath);
      return cleanData(raw);
    } catch {}
    try {
      const raw = await ingestJSON(jsonPath);
      return cleanData(raw);
    } catch {}
    throw new Error('No data source found');
  } catch (e) {
    return { status: 'error', error: (e as Error).message, source };
  }
}
