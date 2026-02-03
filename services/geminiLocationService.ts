/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AWS BEDROCK LOCATION INTELLIGENCE SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PRODUCTION-READY - AWS BEDROCK ONLY
 * - Uses AWS Bedrock (Claude) for all AI operations
 * - No external API dependencies
 * - No rate limits when properly configured on AWS
 * - Multi-agent capable through AWS
 */

import { type CityProfile } from '../data/globalLocationProfiles';
import { researchLocationAWS } from './awsBedrockService';

// ==================== TYPES ====================

export interface LocationResult {
  profile: CityProfile;
  sources: string[];
  summary: string;
  dataQuality: number;
}

export interface ResearchProgress {
  stage: string;
  progress: number;
  message: string;
}

// ==================== TIMEOUT WRAPPER ====================

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// ==================== MAIN RESEARCH FUNCTION ====================

export async function researchLocation(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<LocationResult | null> {
  
  console.log('[Location Service] Starting AWS Bedrock research for:', query);
  
  try {
    onProgress?.({ stage: 'Connecting', progress: 5, message: 'Connecting to AWS Bedrock...' });
    
    const result = await withTimeout(
      researchLocationAWS(query, onProgress),
      60000,
      'Request timed out - please try again'
    );
    
    if (result) {
      return result as unknown as LocationResult;
    }
    
    onProgress?.({ stage: 'Error', progress: 0, message: 'No results returned from AI' });
    return null;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Location Service] AWS Bedrock research failed:', errorMessage);
    
    // Provide specific error feedback
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Request timed out - please try again' });
    } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Network error - please check your connection' });
    } else if (errorMessage.includes('AWS') || errorMessage.includes('Bedrock')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'AWS service unavailable - please try again later' });
    } else {
      onProgress?.({ stage: 'Error', progress: 0, message: `Research failed: ${errorMessage}` });
    }
    
    throw new Error(errorMessage);
  }
}

// ==================== EXPORT ====================

export default researchLocation;
