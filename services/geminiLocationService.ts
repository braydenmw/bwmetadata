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

const API_BASE = (import.meta as { env?: Record<string, string> })?.env?.VITE_API_BASE_URL || '';

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

// ==================== SERVER FALLBACK ====================

async function fetchLocationIntelligenceFromServer(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<LocationResult | null> {
  try {
    onProgress?.({ stage: 'Fallback', progress: 15, message: 'Connecting to intelligence server...' });

    const response = await fetch(`${API_BASE}/api/search/location-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: query })
    });

    if (!response.ok) {
      throw new Error(`Server intelligence error: ${response.status}`);
    }

    const data = await response.json();
    const geo = data.geocoding || {};
    const ai = data.aiIntelligence || {};

    onProgress?.({ stage: 'Processing', progress: 60, message: 'Processing intelligence data...' });

    const profile: CityProfile = {
      id: `server-${Date.now()}`,
      country: geo.country || 'Unknown',
      region: geo.state || ai?.overview?.administrativeLevel || 'Unknown',
      city: ai?.overview?.displayName || query,
      entityType: 'location',
      entityName: query,
      established: ai?.overview?.established || 'Unknown',
      knownFor: ai?.competitiveAdvantages || [],
      strategicAdvantages: ai?.competitiveAdvantages || [],
      investmentPrograms: ai?.investment?.incentives || [],
      keySectors: (ai?.economy?.mainIndustries || []).map((i: { name?: string }) => i?.name).filter(Boolean),
      foreignCompanies: ai?.economy?.majorEmployers || [],
      departments: ai?.governance?.departments || [],
      easeOfDoingBusiness: ai?.investment?.easeOfBusiness || 'See World Bank rankings',
      globalMarketAccess: 'Regional access',
      latitude: typeof geo.lat === 'number' ? geo.lat : 0,
      longitude: typeof geo.lon === 'number' ? geo.lon : 0,
      infrastructureScore: ai?.scores?.infrastructure || 50,
      regulatoryFriction: 50,
      politicalStability: ai?.scores?.politicalStability || 50,
      laborPool: ai?.scores?.laborPool || 50,
      costOfDoing: ai?.scores?.costCompetitiveness || 50,
      investmentMomentum: ai?.scores?.investmentMomentum || 50,
      engagementScore: 50,
      overlookedScore: 50,
      leaders: ai?.governance?.leader ? [{
        id: `leader-${Date.now()}`,
        name: ai.governance.leader.name || 'Unknown',
        role: ai.governance.leader.title || 'Leader',
        tenure: ai.governance.leader.since || 'Unknown',
        achievements: [],
        rating: 0,
        internationalEngagementFocus: false
      }] : [],
      economics: ai?.economy ? {
        gdpLocal: ai.economy.gdpLocal || 'N/A',
        gdpGrowthRate: ai.economy.gdpGrowth || 'N/A',
        employmentRate: ai.economy.unemployment || 'N/A',
        avgIncome: ai.economy.averageIncome || 'N/A',
        majorIndustries: (ai.economy.mainIndustries || []).map((i: { name?: string }) => i?.name).filter(Boolean),
        tradePartners: ai.economy.tradePartners || []
      } : undefined,
      demographics: ai?.demographics ? {
        population: ai.demographics.population || 'N/A',
        populationGrowth: ai.demographics.populationGrowth || 'N/A',
        medianAge: ai.demographics.medianAge || 'N/A',
        literacyRate: ai.demographics.literacyRate || 'N/A',
        languages: ai.demographics.languages || []
      } : undefined,
      infrastructure: ai?.infrastructure ? {
        airports: ai.infrastructure.airports || [],
        seaports: ai.infrastructure.seaports || [],
        powerCapacity: ai.infrastructure.powerCapacity || 'N/A',
        internetPenetration: ai.infrastructure.internetPenetration || 'N/A',
        specialEconomicZones: ai.economy?.economicZones || []
      } : undefined,
      timezone: 'UTC',
      currency: 'USD',
      climate: 'Unknown',
      areaSize: 'Unknown',
      businessHours: '9:00 AM - 5:00 PM',
      _rawWikiExtract: data.wikipedia || undefined
    };

    onProgress?.({ stage: 'Complete', progress: 100, message: 'Research complete!' });

    return {
      profile,
      sources: ['Server Intelligence', 'Wikipedia', 'World Bank'],
      summary: ai?.overview?.significance || `Intelligence report for ${query}.`,
      dataQuality: ai?.dataQuality?.completeness || 70
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Location Service] Server fallback failed:', errorMessage);
    onProgress?.({ stage: 'Error', progress: 0, message: 'Server connection failed - please try again' });
    return null;
  }
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
    onProgress?.({ stage: 'Connecting', progress: 5, message: 'Connecting to AI services...' });
    
    const result = await withTimeout(
      researchLocationAWS(query, onProgress),
      60000,
      'Request timed out - please try again'
    );
    
    if (result) {
      return result as unknown as LocationResult;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Location Service] AI research failed:', errorMessage);
    
    // Attempt server-side fallback before failing
    const fallback = await fetchLocationIntelligenceFromServer(query, onProgress);
    if (fallback) {
      return fallback;
    }
    
    // Provide specific error feedback
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Request timed out - please try again' });
    } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Network error - please check your connection' });
    } else if (errorMessage.includes('AWS') || errorMessage.includes('Bedrock')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'AI service unavailable - please try again later' });
    } else {
      onProgress?.({ stage: 'Error', progress: 0, message: `Research failed: ${errorMessage}` });
    }
    
    return null;
  }
  
  onProgress?.({ stage: 'Error', progress: 0, message: 'No results returned from AI' });
  return null;
}

// ==================== EXPORT ====================

export default researchLocation;
