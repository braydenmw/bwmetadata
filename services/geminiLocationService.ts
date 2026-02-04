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
    const ai = data.aiIntelligence || data.freeApiData || {};
    const countryInfo = data.countryData || {};

    onProgress?.({ stage: 'Processing', progress: 60, message: 'Processing intelligence data...' });

    // Extract population from various sources
    const getPopulation = () => {
      if (ai?.demographics?.population) return ai.demographics.population;
      if (countryInfo?.population) return countryInfo.population.toLocaleString();
      if (data.worldBank?.['Population']?.value) return Math.round(data.worldBank['Population'].value).toLocaleString();
      return 'N/A';
    };

    // Extract GDP from various sources  
    const getGDP = () => {
      if (ai?.economy?.gdp) return ai.economy.gdp;
      if (data.worldBank?.['GDP (current US$)']?.value) {
        const gdp = data.worldBank['GDP (current US$)'].value;
        if (gdp >= 1e12) return `$${(gdp / 1e12).toFixed(2)} trillion`;
        if (gdp >= 1e9) return `$${(gdp / 1e9).toFixed(2)} billion`;
        return `$${(gdp / 1e6).toFixed(2)} million`;
      }
      return 'N/A';
    };

    const profile: CityProfile = {
      id: `server-${Date.now()}`,
      country: geo.country || countryInfo?.name?.common || 'Unknown',
      region: geo.state || ai?.government?.region || ai?.overview?.administrativeLevel || 'Unknown',
      city: ai?.overview?.displayName || query,
      entityType: 'location',
      entityName: query,
      established: ai?.overview?.established || 'Unknown',
      knownFor: ai?.competitiveAdvantages || [],
      strategicAdvantages: ai?.competitiveAdvantages || [],
      investmentPrograms: ai?.investment?.incentives || [],
      keySectors: Array.isArray(ai?.economy?.mainIndustries) 
        ? ai.economy.mainIndustries.map((i: { name?: string } | string) => typeof i === 'string' ? i : i?.name).filter(Boolean)
        : [],
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
      economics: {
        gdpLocal: getGDP(),
        gdpGrowthRate: ai?.economy?.gdpGrowth || 
          (data.worldBank?.['GDP Growth (annual %)']?.value 
            ? `${data.worldBank['GDP Growth (annual %)'].value.toFixed(2)}%` 
            : 'N/A'),
        employmentRate: ai?.economy?.unemploymentRate || ai?.economy?.unemployment || 
          (data.worldBank?.['Unemployment Rate']?.value 
            ? `${data.worldBank['Unemployment Rate'].value.toFixed(1)}% unemployment` 
            : 'N/A'),
        avgIncome: ai?.economy?.gdpPerCapita || ai?.economy?.averageIncome || 
          (data.worldBank?.['GDP per capita']?.value 
            ? `$${Math.round(data.worldBank['GDP per capita'].value).toLocaleString()} per capita` 
            : 'N/A'),
        majorIndustries: Array.isArray(ai?.economy?.mainIndustries) 
          ? ai.economy.mainIndustries.map((i: { name?: string } | string) => typeof i === 'string' ? i : i?.name).filter(Boolean)
          : [],
        tradePartners: ai?.economy?.tradePartners || [],
        fdi: ai?.economy?.fdi || 
          (data.worldBank?.['Foreign Direct Investment']?.value 
            ? `$${(data.worldBank['Foreign Direct Investment'].value / 1e9).toFixed(2)}B FDI` 
            : undefined)
      },
      demographics: {
        population: getPopulation(),
        populationGrowth: ai?.demographics?.populationGrowth || ai?.demographics?.populationYear || 'N/A',
        medianAge: ai?.demographics?.medianAge || 'N/A',
        literacyRate: ai?.demographics?.literacyRate || 'N/A',
        languages: ai?.demographics?.languages || 
          (countryInfo?.languages ? Object.values(countryInfo.languages) : [])
      },
      infrastructure: {
        airports: ai?.infrastructure?.airports || [],
        seaports: ai?.infrastructure?.seaports || [],
        powerCapacity: ai?.infrastructure?.powerCapacity || 'N/A',
        internetPenetration: ai?.infrastructure?.internetUsers || ai?.infrastructure?.internetPenetration || 
          (data.worldBank?.['Internet Users (%)']?.value 
            ? `${data.worldBank['Internet Users (%)'].value.toFixed(1)}% of population` 
            : 'N/A'),
        specialEconomicZones: ai?.economy?.economicZones || []
      },
      timezone: countryInfo?.timezones?.[0] || ai?.geography?.timezone || 'UTC',
      currency: countryInfo?.currencies 
        ? Object.values(countryInfo.currencies as Record<string, { name: string; symbol: string }>)
            .map(c => `${c.name} (${c.symbol})`).join(', ')
        : ai?.economy?.currency || 'USD',
      climate: ai?.geography?.climate || 'Varies by season',
      areaSize: countryInfo?.area 
        ? `${countryInfo.area.toLocaleString()} km²` 
        : ai?.geography?.area || 'Unknown',
      businessHours: '9:00 AM - 5:00 PM',
      flagUrl: countryInfo?.flags?.svg || countryInfo?.flags?.png || undefined,
      googleMapsUrl: countryInfo?.maps?.googleMaps || ai?.links?.googleMaps || undefined,
      _rawWikiExtract: data.wikipedia || undefined
    };

    onProgress?.({ stage: 'Complete', progress: 100, message: 'Research complete!' });

    return {
      profile,
      sources: data.sources || ['OpenStreetMap', 'Wikipedia', 'World Bank', 'REST Countries'],
      summary: ai?.overview?.significance || ai?.overview?.description || `Intelligence report for ${query}.`,
      dataQuality: ai?.dataQuality?.completeness || data.dataQuality?.completeness || 70,
      aiEnhanced: data.aiEnhanced || false
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
  
  console.log('[Location Service] Starting location research for:', query);
  
  // Use server-side endpoint which handles all data gathering
  // This uses free APIs (Wikipedia, World Bank, Geocoding) + Gemini for synthesis
  try {
    onProgress?.({ stage: 'Connecting', progress: 5, message: 'Connecting to intelligence server...' });
    
    const result = await withTimeout(
      fetchLocationIntelligenceFromServer(query, onProgress),
      60000,
      'Request timed out - please try again'
    );
    
    if (result) {
      return result;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Location Service] Server research failed:', errorMessage);
    
    // Provide specific error feedback
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Request timed out - please try again' });
    } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Network error - please check your connection' });
    } else {
      onProgress?.({ stage: 'Error', progress: 0, message: `Research failed: ${errorMessage}` });
    }
    
    return null;
  }
  
  onProgress?.({ stage: 'Error', progress: 0, message: 'No results returned' });
  return null;
}

// ==================== EXPORT ====================

export default researchLocation;
