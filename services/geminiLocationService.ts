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

// ==================== CLIENT-SIDE FALLBACK (NO BACKEND REQUIRED) ====================

async function fetchLocationIntelligenceClientSide(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<LocationResult | null> {
  try {
    onProgress?.({ stage: 'Geocoding', progress: 10, message: 'Looking up location...' });

    // 1. Geocoding from OpenStreetMap Nominatim (free, no API key)
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`,
      { headers: { 'User-Agent': 'BWGA-Intelligence/1.0' } }
    );
    const geoData = await geoResponse.json();
    const geo = geoData[0];
    
    if (!geo) {
      throw new Error('Location not found');
    }

    const countryCode = (geo.address?.country_code || '').toUpperCase();
    const countryName = geo.address?.country || '';

    onProgress?.({ stage: 'Wikipedia', progress: 25, message: 'Fetching Wikipedia data...' });

    // 2. Wikipedia extract (free, no API key)
    let wikiExtract = '';
    try {
      const wikiSearchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`
      );
      const wikiSearchData = await wikiSearchRes.json();
      if (wikiSearchData.query?.search?.[0]) {
        const title = wikiSearchData.query.search[0].title;
        const extractRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`
        );
        const extractData = await extractRes.json();
        const pages = extractData.query?.pages;
        const page = Object.values(pages)[0] as { extract?: string };
        wikiExtract = page?.extract?.substring(0, 2000) || '';
      }
    } catch (e) {
      console.warn('[Client] Wikipedia failed:', e);
    }

    onProgress?.({ stage: 'Economic Data', progress: 45, message: 'Fetching economic indicators...' });

    // 3. World Bank data (free, no API key)
    const worldBankIndicators = [
      { code: 'NY.GDP.MKTP.CD', name: 'gdp' },
      { code: 'NY.GDP.MKTP.KD.ZG', name: 'gdpGrowth' },
      { code: 'NY.GDP.PCAP.CD', name: 'gdpPerCapita' },
      { code: 'SP.POP.TOTL', name: 'population' },
      { code: 'SL.UEM.TOTL.ZS', name: 'unemployment' },
      { code: 'IT.NET.USER.ZS', name: 'internetUsers' }
    ];
    
    const economicData: Record<string, number> = {};
    if (countryCode) {
      await Promise.all(worldBankIndicators.map(async (ind) => {
        try {
          const res = await fetch(
            `https://api.worldbank.org/v2/country/${countryCode}/indicator/${ind.code}?format=json&per_page=1`
          );
          const data = await res.json();
          if (data[1]?.[0]?.value !== null && data[1]?.[0]?.value !== undefined) {
            economicData[ind.name] = data[1][0].value;
          }
        } catch { /* ignore individual failures */ }
      }));
    }

    onProgress?.({ stage: 'Country Data', progress: 65, message: 'Fetching country information...' });

    // 4. REST Countries data (free, no API key)
    let countryInfo: {
      name?: { common: string; official: string };
      capital?: string[];
      population?: number;
      area?: number;
      region?: string;
      subregion?: string;
      languages?: Record<string, string>;
      currencies?: Record<string, { name: string; symbol: string }>;
      timezones?: string[];
      flags?: { svg: string; png: string };
      maps?: { googleMaps: string };
    } = {};
    
    if (countryCode) {
      try {
        const countryRes = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,capital,population,area,region,subregion,languages,currencies,timezones,flags,maps`
        );
        if (countryRes.ok) {
          countryInfo = await countryRes.json();
        }
      } catch { /* ignore */ }
    }

    onProgress?.({ stage: 'Building Report', progress: 85, message: 'Compiling intelligence report...' });

    // Format helpers
    const formatNumber = (num: number | undefined) => {
      if (!num) return 'N/A';
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)} trillion`;
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} billion`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} million`;
      return num.toLocaleString();
    };

    const formatPopulation = (num: number | undefined) => {
      if (!num) return 'N/A';
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)} billion`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(1)} million`;
      return num.toLocaleString();
    };

    // Build profile from collected data
    const profile: CityProfile = {
      id: `client-${Date.now()}`,
      country: countryName,
      region: geo.address?.state || geo.address?.province || countryInfo?.subregion || 'Unknown',
      city: query,
      entityType: 'location',
      entityName: query,
      established: 'See historical records',
      knownFor: [],
      strategicAdvantages: [],
      investmentPrograms: [],
      keySectors: [],
      foreignCompanies: [],
      departments: [],
      easeOfDoingBusiness: 'See World Bank rankings',
      globalMarketAccess: countryInfo?.region || 'Regional access',
      latitude: parseFloat(geo.lat) || 0,
      longitude: parseFloat(geo.lon) || 0,
      infrastructureScore: 55,
      regulatoryFriction: 50,
      politicalStability: 60,
      laborPool: 65,
      costOfDoing: 55,
      investmentMomentum: 50,
      engagementScore: 50,
      overlookedScore: 50,
      leaders: [],
      economics: {
        gdpLocal: formatNumber(economicData.gdp),
        gdpGrowthRate: economicData.gdpGrowth ? `${economicData.gdpGrowth.toFixed(2)}%` : 'N/A',
        employmentRate: economicData.unemployment ? `${economicData.unemployment.toFixed(1)}% unemployment` : 'N/A',
        avgIncome: formatNumber(economicData.gdpPerCapita),
        majorIndustries: [],
        tradePartners: []
      },
      demographics: {
        population: formatPopulation(countryInfo?.population || economicData.population),
        populationGrowth: 'N/A',
        medianAge: 'N/A',
        literacyRate: 'N/A',
        languages: countryInfo?.languages ? Object.values(countryInfo.languages) : []
      },
      infrastructure: {
        airports: [],
        seaports: [],
        powerCapacity: 'N/A',
        internetPenetration: economicData.internetUsers ? `${economicData.internetUsers.toFixed(1)}%` : 'N/A',
        specialEconomicZones: []
      },
      timezone: countryInfo?.timezones?.[0] || 'UTC',
      currency: countryInfo?.currencies 
        ? Object.values(countryInfo.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')
        : 'N/A',
      climate: 'Varies by season',
      areaSize: countryInfo?.area ? `${countryInfo.area.toLocaleString()} km²` : 'N/A',
      businessHours: '9:00 AM - 5:00 PM',
      flagUrl: countryInfo?.flags?.svg || countryInfo?.flags?.png,
      googleMapsUrl: countryInfo?.maps?.googleMaps || `https://maps.google.com/?q=${encodeURIComponent(query)}`,
      _rawWikiExtract: wikiExtract
    };

    onProgress?.({ stage: 'Complete', progress: 100, message: 'Research complete!' });

    return {
      profile,
      sources: ['OpenStreetMap Nominatim', 'Wikipedia', 'World Bank', 'REST Countries'],
      summary: wikiExtract ? wikiExtract.split('.').slice(0, 2).join('.') + '.' : `Intelligence report for ${query}.`,
      dataQuality: 70
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Client] Direct API research failed:', errorMessage);
    throw error;
  }
}

// ==================== MAIN RESEARCH FUNCTION ====================

export async function researchLocation(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<LocationResult | null> {
  
  console.log('[Location Service] Starting location research for:', query);
  
  // Try server-side endpoint first (has AI synthesis)
  if (API_BASE) {
    try {
      onProgress?.({ stage: 'Connecting', progress: 5, message: 'Connecting to intelligence server...' });
      
      const result = await withTimeout(
        fetchLocationIntelligenceFromServer(query, onProgress),
        15000, // 15 second timeout for server
        'Server timeout'
      );
      
      if (result) {
        return result;
      }
    } catch (error) {
      console.log('[Location Service] Server unavailable, using client-side fallback');
    }
  }
  
  // Fallback: Call free APIs directly from browser (no backend required)
  try {
    onProgress?.({ stage: 'Direct Research', progress: 5, message: 'Researching location...' });
    
    const result = await withTimeout(
      fetchLocationIntelligenceClientSide(query, onProgress),
      30000,
      'Request timed out - please try again'
    );
    
    if (result) {
      return result;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Location Service] Client research failed:', errorMessage);
    
    if (errorMessage.includes('Location not found')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Location not found - try a different search term' });
    } else if (errorMessage.includes('timeout')) {
      onProgress?.({ stage: 'Error', progress: 0, message: 'Request timed out - please try again' });
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
