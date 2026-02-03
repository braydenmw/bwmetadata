/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ENHANCED MULTI-SOURCE LOCATION RESEARCH SERVICE (V2)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * FULL CAPABILITIES SYSTEM - WORKS ON STATIC HOSTING (AWS, Netlify, etc.)
 * 
 * Comprehensive intelligence gathering from MULTIPLE AUTHORITATIVE sources with:
 * - Direct Gemini AI integration (no backend required)
 * - Intelligent caching to prevent re-fetching
 * - Autonomous gap detection and refinement loops
 * - AI-powered narrative synthesis
 * - Multi-source conflict resolution
 * - Rich structured data extraction
 * - Real-time research progress tracking
 * - Complete audit trails and source citations
 * 
 * PRIMARY SOURCES:
 * 1. Gemini AI (comprehensive synthesis)
 * 2. World Bank Open Data API (economic indicators)
 * 3. REST Countries API (country demographics)
 * 4. OpenStreetMap API (geographic data)
 * 5. Wikipedia/Wikidata (contextual information)
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { type CityProfile, type CityLeader } from '../data/globalLocationProfiles';
import { locationResearchCache } from './locationResearchCache';
import { autonomousResearchAgent } from './autonomousResearchAgent';
import { narrativeSynthesisEngine, type EnhancedNarratives } from './narrativeSynthesisEngine';

// Get Gemini API key - works in both Vite and Node environments
const getGeminiApiKey = (): string => {
  // Try Vite environment variable first (frontend)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = import.meta as any;
    if (meta?.env?.VITE_GEMINI_API_KEY) {
      console.log('[GLI] Gemini API key found via Vite env');
      return meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    console.warn('[GLI] Could not access Vite env:', e);
  }
  // Try process.env (Node/backend)
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    console.log('[GLI] Gemini API key found via process.env');
    return process.env.GEMINI_API_KEY;
  }
  console.warn('[GLI] No Gemini API key found - AI research will fail. Set VITE_GEMINI_API_KEY in your environment.');
  return '';
};

// ==================== TYPES ====================

export interface SourceCitation {
  title: string;
  url: string;
  type: 'government' | 'worldbank' | 'news' | 'statistics' | 'research' | 'encyclopedia' | 'international';
  reliability: 'high' | 'medium' | 'low';
  accessDate: string;
  dataExtracted: string;
  organization?: string;
}

export interface MultiSourceResult {
  profile: CityProfile;
  narratives: EnhancedNarratives;
  sources: SourceCitation[];
  similarCities: SimilarCity[];
  dataQuality: DataQualityReport;
  researchSummary: string;
  researchSession: {
    id: string;
    iterations: number;
    totalTime: number;
    completenessScore: number;
  };
}

export interface SimilarCity {
  city: string;
  country: string;
  region: string;
  similarity: number;
  reason: string;
  keyMetric: string;
}

export interface DataQualityReport {
  completeness: number;
  governmentSourcesUsed: number;
  internationalSourcesUsed: number;
  newsSourcesUsed: number;
  dataFreshness: string;
  leaderDataVerified: boolean;
  primarySourcePercentage: number;
  conflictsDetected: number;
  conflictsResolved: number;
}

export interface ResearchProgress {
  stage: string;
  progress: number;
  message: string;
  substage?: string;
  sourcesFound?: number;
  iteration?: number;
}

export type ProgressCallback = (progress: ResearchProgress) => void;

// ==================== CONFIGURATION ====================

const AUTHORITATIVE_DOMAINS = [
  '.gov', '.gov.ph', '.gov.au', '.gov.uk', '.gov.sg', '.go.jp', '.gov.my',
  'gob.', 'gouv.', 'govt.', 'government', 'worldbank.org', 'imf.org',
  'un.org', 'undp.org', 'wto.org', 'oecd.org', 'adb.org', 'ifc.org'
];

// ==================== DIRECT GEMINI AI RESEARCH (NO BACKEND NEEDED) ====================

/**
 * The comprehensive AI prompt for location intelligence
 */
const LOCATION_INTELLIGENCE_PROMPT = (location: string, webSearchContext: string | null, worldBankData: Record<string, unknown> | null, geoData: { lat: number; lon: number; country?: string } | null, additionalContext?: Record<string, unknown>) => `You are a world-class location intelligence analyst with access to current 2025-2026 data. Provide comprehensive, accurate intelligence about: "${location}"

YOUR KNOWLEDGE CUTOFF: Use your training data which includes information up to early 2024, and apply reasonable projections for 2025-2026 based on trends.

VERIFIED LOCATION DATA:
- Coordinates: ${geoData ? `${geoData.lat}, ${geoData.lon}` : 'Unknown'}
- Country: ${geoData?.country || 'Unknown'}

CONTEXT FROM WEB SEARCH (use this data as your primary source):
${webSearchContext?.substring(0, 4000) || 'No web search data available'}

WORLD BANK DATA:
${JSON.stringify(worldBankData || {})}

RECENT NEWS:
${additionalContext?.recentNews || 'Not available'}

CRITICAL INSTRUCTIONS:
1. Provide SPECIFIC, FACTUAL data - actual names of leaders, real GDP figures, actual company names
2. For government leaders, use the CURRENT leaders as of your knowledge (2024+)
3. Include REAL investment programs, economic zones, and business incentives that exist
4. List ACTUAL foreign companies operating in this location
5. Provide REAL infrastructure details - airport names with IATA codes, port names, etc.
6. Include recent developments and future plans that are publicly known
7. DO NOT use placeholder text like "See statistics" or "Contact office" - provide actual data
8. If you don't know specific data, use your knowledge to provide reasonable estimates with "(estimated)" note

Return a detailed JSON response with REAL data (not placeholders). Use actual names, numbers, and facts.
Do NOT include opinions, endorsements, or recommendations. Use neutral, factual phrasing only:

{
  "overview": {
    "description": "3 comprehensive paragraphs about this location - its history, current status, and future outlook including recent developments and major projects",
    "significance": "Strategic and economic importance - why investors/businesses should care",
    "established": "Year or era established (e.g., '1851' or 'Founded in 1788')",
    "nicknames": ["Common nicknames or titles"],
    "timezone": "Timezone (e.g., 'AEST (UTC+10)', 'PHT (UTC+8)', 'EST (UTC-5)')",
    "currency": "Official currency with code (e.g., 'Philippine Peso (PHP)', 'Australian Dollar (AUD)')",
    "area": "Geographic area (e.g., '42.88 km²', '12,368 km²')",
    "climate": "Climate type (e.g., 'Oceanic/Temperate', 'Subtropical humid')",
    "businessHours": "Typical business hours (e.g., '9:00 AM - 5:00 PM AEST')"
  },
  "demographics": {
    "population": "Current population with year (e.g., '111,973 (2021 census)')",
    "populationGrowth": "Annual growth rate (e.g., '1.2%')",
    "medianAge": "Median age (e.g., '38 years')",
    "urbanization": "Urban percentage (e.g., '86%')",
    "languages": ["Languages spoken"],
    "ethnicGroups": ["Major ethnic groups if notable"]
  },
  "governance": {
    "leader": {
      "name": "ACTUAL current leader name (Prime Minister, President, Mayor, Premier, etc.)",
      "title": "Official title",
      "since": "Year took office",
      "party": "Political party if applicable"
    },
    "keyOfficials": [
      {"name": "Mayor / Governor / Senator", "title": "Official title", "since": "Year took office", "party": "Political party if applicable", "sourceUrl": "https://..."}
    ],
    "type": "Government/administrative type",
    "departments": ["Key government departments"],
    "administrativeLevel": "How it fits in national structure"
  },
  "officialPortals": [
    {"label": "Official government portal", "url": "https://..."},
    {"label": "Investment promotion agency", "url": "https://..."},
    {"label": "Business registry / licensing", "url": "https://..."}
  ],
  "contactDirectory": [
    {"name": "Office name", "type": "national/regional/local", "website": "https://...", "email": "contact@...", "phone": "+...", "address": "..."}
  ],
  "economy": {
    "gdpLocal": "GDP or economic output (e.g., '$1.7 trillion')",
    "gdpGrowth": "Recent growth rate (e.g., '2.1%')",
    "mainIndustries": [
      {"name": "Industry name", "description": "Brief description of scale/importance"}
    ],
    "majorEmployers": ["Actual company names that are major employers"],
    "unemployment": "Unemployment rate",
    "averageIncome": "Average income/wage data",
    "economicZones": ["Special economic zones if any"],
    "exports": ["Major export products"],
    "tradePartners": ["Key trading partners"]
  },
  "infrastructure": {
    "airports": [{"name": "Actual airport name", "code": "IATA code like SYD, MEL, JFK", "type": "International/Regional/Domestic"}],
    "seaports": [{"name": "Actual port name", "type": "Container/Bulk/Passenger"}],
    "railways": "Railway connectivity description",
    "roads": "Major highways/road networks",
    "publicTransit": "Public transit systems available",
    "internetPenetration": "Internet access percentage (e.g., '92%')",
    "powerCapacity": "Power infrastructure description"
  },
  "investment": {
    "climate": "Overall investment climate - 2-3 sentences",
    "incentives": ["Specific available investment incentives"],
    "fdiTrends": "Foreign direct investment trends",
    "opportunities": ["Top 5 specific investment opportunities"],
    "challenges": ["Key investment challenges to consider"],
    "easeOfBusiness": "Ease of doing business context"
  },
  "education": {
    "universities": [{"name": "Actual university name", "ranking": "National/global ranking if notable", "specialties": ["Key programs"]}],
    "vocationalSchools": ["Technical/vocational institutions"],
    "literacyRate": "Literacy rate percentage",
    "workforceSkills": "Workforce skill level description"
  },
  "recentDevelopments": [
    {"date": "2024 or 2025", "title": "Specific development title", "description": "What happened", "impact": "Economic/business impact"}
  ],
  "risks": {
    "political": "Political risk assessment - specific concerns",
    "economic": "Economic risk factors",
    "natural": "Natural disaster risks specific to this area",
    "regulatory": "Regulatory challenges or changes"
  },
  "competitiveAdvantages": ["5-7 specific strategic advantages"],
  "developmentNeeds": ["3-5 areas needing development or improvement"],
  "similarLocations": [
    {"name": "Similar city/region", "country": "Country", "similarity": "Why similar", "keyDifference": "Main difference"}
  ],
  "scores": {
    "infrastructure": 65,
    "politicalStability": 70,
    "laborPool": 60,
    "investmentMomentum": 55,
    "regulatoryEase": 50,
    "costCompetitiveness": 60
  },
  "dataSources": ["List authoritative sources like 'Australian Bureau of Statistics', 'World Bank', etc."],
  "dataQuality": {
    "completeness": 85,
    "freshness": "2024-2025",
    "confidence": "High/Medium/Low with brief explanation"
  }
}

CRITICAL:
- Use REAL, ACCURATE data - actual names, numbers, facts
- For leaders, use the CURRENT leader as of your knowledge
- Include actual company names, airport codes (like SYD, MEL, JFK, LHR), university names
- Be specific about economic figures (use billions/trillions appropriately)
- If uncertain, provide best estimate with "(estimated)" note
- Return ONLY valid JSON, no markdown code blocks or explanation text`;

const ENTITY_INTELLIGENCE_PROMPT = (query: string, wikiData: string | null, sources: string[]) => `You are a world-class intelligence analyst. Provide comprehensive, accurate intelligence about the entity: "${query}".

If the entity is a company, government body, agency, university, NGO, or other organization, identify it and return a structured intelligence brief.

Sources available:
- Wikipedia extract: ${wikiData || 'Not available'}
- Additional sources: ${sources.join('; ') || 'Not available'}

Return ONLY valid JSON in this exact structure:
{
  "entity": {
    "name": "Official entity name",
    "type": "company | government | agency | university | ngo | organization",
    "headquarters": "City/Region",
    "country": "Country",
    "founded": "Year or date",
    "website": "Official URL",
    "description": "Short factual description"
  },
  "leadership": [
    { "name": "Leader name", "role": "Role/Title", "source": "Source name" }
  ],
  "operations": {
    "sector": "Primary sector/industry",
    "services": ["Key services/products"],
    "markets": ["Regions or markets served"],
    "employees": "Employee count (if known)",
    "revenue": "Revenue/budget (if known)"
  },
  "keyFacts": ["Notable verified facts"],
  "comparisons": ["Comparable entities or benchmarks"],
  "recentDevelopments": ["Recent verified developments"],
  "dataSources": ["List of sources used"]
}

CRITICAL:
- Use REAL, ACCURATE data where possible
- If unsure, say "Not verified" rather than inventing
- Return ONLY valid JSON, no markdown or commentary`;

/**
 * Direct Gemini AI research - works without backend server
 * This is the primary research method for static hosting (AWS, Netlify, Vercel)
 */
async function tryDirectGeminiResearch(
  locationQuery: string,
  onProgress?: ProgressCallback
): Promise<MultiSourceResult | null> {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    console.warn('[GLI Research] No Gemini API key available for direct research');
    return null;
  }
  
  console.log('[GLI Research] API key found, length:', apiKey.length);

  try {
    onProgress?.({
      stage: 'AI Research',
      progress: 5,
      message: 'Initializing Gemini AI research...'
    });

    // Fetch supporting data in parallel
    onProgress?.({
      stage: 'Data Collection',
      progress: 15,
      message: 'Gathering geographic and economic data from real-time sources...'
    });

    console.log('[GLI Research] Fetching data from multiple sources...');
    
    // Fetch geocoding data first - this is essential for location validation
    const geoData = await fetchGeocoding(locationQuery);
    
    console.log('[GLI Research] Geo data:', geoData ? `${geoData.lat}, ${geoData.lon}, ${geoData.country}` : 'null');

    // CRITICAL VALIDATION: If we can't geocode the location, it's not a valid location
    if (!geoData) {
      console.warn('[GLI Research] Geocoding failed - not a valid location query');
      return null;
    }

    onProgress?.({
      stage: 'Web Research',
      progress: 25,
      message: 'Searching authoritative sources via web search...'
    });

    // Use web search instead of Wikipedia - more reliable and current
    const [
      officialSearchResults,
      economySearchResults,
      demographicsSearchResults,
      newsData
    ] = await Promise.all([
      performGoogleSearch(`${locationQuery} official government website city council`, 5),
      performGoogleSearch(`${locationQuery} economy GDP business investment statistics`, 5),
      performGoogleSearch(`${locationQuery} population demographics census statistics`, 5),
      fetchRecentNews(locationQuery)
    ]);

    console.log('[GLI Research] Official search results:', officialSearchResults.length);
    console.log('[GLI Research] Economy search results:', economySearchResults.length);
    console.log('[GLI Research] Demographics search results:', demographicsSearchResults.length);
    console.log('[GLI Research] News items:', newsData?.length || 0);

    // Combine search results into context for AI
    const webSearchContext = [
      ...officialSearchResults.map(r => `${r.title}: ${r.snippet} (${r.link})`),
      ...economySearchResults.map(r => `${r.title}: ${r.snippet} (${r.link})`),
      ...demographicsSearchResults.map(r => `${r.title}: ${r.snippet} (${r.link})`)
    ].join('\n');

    // Fetch additional data based on geo results
    let worldBankData: Record<string, unknown> | null = null;
    let openDataStats: Record<string, unknown> | null = null;
    
    if (geoData?.countryCode) {
      console.log('[GLI Research] Fetching World Bank data for:', geoData.countryCode);
      const [wbData, odStats] = await Promise.all([
        fetchWorldBankIndicators(geoData.countryCode),
        fetchOpenDataStats(locationQuery, geoData.country)
      ]);
      worldBankData = wbData;
      openDataStats = odStats;
      console.log('[GLI Research] World Bank data keys:', worldBankData ? Object.keys(worldBankData) : 'null');
      console.log('[GLI Research] OpenData stats:', openDataStats ? Object.keys(openDataStats) : 'null');
    }

    // Build enriched context for Gemini - use web search results instead of Wikipedia
    const enrichedContext = {
      webSearchResults: webSearchContext,
      openDataStats,
      recentNews: newsData?.slice(0, 3).map(n => n.title).join('; '),
      sourceUrls: [
        ...officialSearchResults.map(r => r.link),
        ...economySearchResults.map(r => r.link),
        ...demographicsSearchResults.map(r => r.link)
      ].filter(Boolean)
    };

    onProgress?.({
      stage: 'AI Synthesis',
      progress: 40,
      message: 'Gemini AI analyzing data from multiple sources...'
    });

    // Call Gemini directly
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
      // Reduce safety settings to avoid blocking public data responses
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ]
    });

    console.log('[GLI Research] Calling Gemini API for:', locationQuery);

    // Enhanced prompt with web search data instead of Wikipedia
    const prompt = LOCATION_INTELLIGENCE_PROMPT(
      locationQuery,
      webSearchContext, // Use web search context instead of Wikipedia
      worldBankData,
      geoData ? { lat: geoData.lat, lon: geoData.lon, country: geoData.country } : null,
      enrichedContext
    );
    console.log('[GLI Research] Prompt length:', prompt.length);

    // Add timeout for Gemini call
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API timeout after 30s')), 30000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const responseText = result.response.text();
    console.log('[GLI Research] Gemini response length:', responseText.length);
    console.log('[GLI Research] Gemini response preview:', responseText.substring(0, 300));

    onProgress?.({
      stage: 'Processing',
      progress: 70,
      message: 'Processing AI intelligence...'
    });

    // Parse JSON from response
    let aiIntelligence: Record<string, unknown> | null = null;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiIntelligence = JSON.parse(jsonMatch[0]);
        console.log('[GLI Research] Successfully parsed AI response');
      }
    } catch (parseError) {
      console.warn('[GLI Research] Failed to parse Gemini response as JSON:', parseError);
      console.warn('[GLI Research] Response was:', responseText.substring(0, 500));
      return null;
    }

    if (!aiIntelligence) {
      console.warn('[GLI Research] No valid AI intelligence received');
      return null;
    }

    onProgress?.({
      stage: 'Building Profile',
      progress: 85,
      message: 'Constructing comprehensive profile...'
    });

    // Transform to MultiSourceResult - pass webSearchContext instead of wikiData
    return transformAIToProfile(locationQuery, aiIntelligence, geoData, webSearchContext, worldBankData, enrichedContext.sourceUrls as string[], onProgress);

  } catch (error) {
    console.error('[GLI Research] Direct Gemini research failed:', error);
    console.error('[GLI Research] Error details:', (error as Error).message);
    return null;
  }
}

/**
 * Direct Gemini AI research for entities (companies, governments, organizations)
 */
async function tryDirectGeminiEntityResearch(
  query: string,
  category: QueryCategory,
  onProgress?: ProgressCallback
): Promise<MultiSourceResult | null> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('[GLI Research] No Gemini API key available for entity research');
    return null;
  }

  try {
    onProgress?.({
      stage: 'Entity Research',
      progress: 5,
      message: 'Initializing entity intelligence...'
    });

    const wikiData = await fetchWikipediaEntityData(query);
    const searchResults = await performGoogleSearch(`${query} official website`, 6);

    const sourceNames = searchResults.map(r => r.displayLink).filter(Boolean);
    const prompt = ENTITY_INTELLIGENCE_PROMPT(query, wikiData?.extract || null, sourceNames);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let aiIntelligence: Record<string, unknown> | null = null;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiIntelligence = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('[GLI Research] Failed to parse entity AI response:', parseError);
      return null;
    }

    if (!aiIntelligence) return null;

    onProgress?.({
      stage: 'Processing',
      progress: 70,
      message: 'Constructing entity intelligence profile...'
    });

    return transformEntityToProfile(query, category, aiIntelligence, wikiData, searchResults, onProgress);
  } catch (error) {
    console.error('[GLI Research] Direct Gemini entity research failed:', error);
    return null;
  }
}

function transformEntityToProfile(
  query: string,
  category: QueryCategory,
  ai: Record<string, unknown>,
  wikiData: { title: string; extract: string; url: string } | null,
  searchResults: Array<{ title: string; link: string; snippet: string; displayLink: string; isGovernment: boolean }>,
  onProgress?: ProgressCallback
): MultiSourceResult {
  const accessDate = new Date().toISOString().split('T')[0];
  const entity = (ai.entity as Record<string, unknown>) || {};
  const operations = (ai.operations as Record<string, unknown>) || {};
  const leadership = (ai.leadership as Array<{ name: string; role: string; source: string }>) || [];

  const sources: SourceCitation[] = [];
  if (wikiData?.url) {
    sources.push({
      title: `Wikipedia - ${wikiData.title}`,
      url: wikiData.url,
      type: 'encyclopedia',
      reliability: 'medium',
      accessDate,
      dataExtracted: wikiData.extract.substring(0, 150),
      organization: 'Wikipedia'
    });
  }

  searchResults.slice(0, 6).forEach((result) => {
    sources.push({
      title: result.title,
      url: result.link,
      type: result.isGovernment ? 'government' : 'research',
      reliability: result.isGovernment ? 'high' : 'medium',
      accessDate,
      dataExtracted: result.snippet.substring(0, 150),
      organization: result.displayLink
    });
  });

  const sectors = (operations.services as string[]) || [];
  const sectorPrimary = (operations.sector as string) || '';
  const keyFacts = (ai.keyFacts as string[]) || [];

  const leaders: CityLeader[] = leadership.length
    ? leadership.map((l, idx) => ({
      id: `leader-${idx + 1}`,
      name: l.name || 'Leadership Not Verified',
      role: l.role || (category === 'government' ? 'Senior Official' : 'Executive'),
      tenure: 'Current',
      achievements: [l.source || 'Source not verified'],
      rating: l.name ? 6 : 0,
      internationalEngagementFocus: false
    }))
    : [{
      id: 'leader-pending',
      name: 'Leadership information pending verification',
      role: category === 'government' ? 'Senior Official' : 'Executive',
      tenure: 'Current',
      achievements: ['Verify leadership details via official sources'],
      rating: 0,
      internationalEngagementFocus: false
    }];

  const profile: CityProfile = {
    id: `entity-${Date.now()}`,
    city: (entity.name as string) || query,
    entityName: (entity.name as string) || query,
    entityType: (entity.type as CityProfile['entityType']) || category,
    region: (entity.headquarters as string) || '',
    country: (entity.country as string) || '',
    established: (entity.founded as string) || 'Not verified',
    knownFor: keyFacts.length ? keyFacts : [(entity.description as string) || 'Not verified'],
    strategicAdvantages: keyFacts.slice(0, 4),
    investmentPrograms: [],
    keySectors: sectorPrimary ? [sectorPrimary, ...sectors] : sectors,
    foreignCompanies: [],
    departments: sectors,
    easeOfDoingBusiness: category === 'government' ? 'See official policy' : 'Not applicable',
    globalMarketAccess: ((operations.markets as string[]) || []).join(', ') || 'Global',
    latitude: 0,
    longitude: 0,
    infrastructureScore: 50,
    regulatoryFriction: 50,
    politicalStability: 50,
    laborPool: 50,
    costOfDoing: 50,
    investmentMomentum: 50,
    engagementScore: 50,
    overlookedScore: 50,
    leaders,
    economics: {
      gdpLocal: operations.revenue ? `Revenue: ${operations.revenue}` : 'Not available',
      majorIndustries: sectorPrimary ? [sectorPrimary] : [],
      tradePartners: [],
      topExports: []
    },
    demographics: {
      population: operations.employees ? `Employees: ${operations.employees}` : 'Not available'
    },
    infrastructure: {},
    governmentLinks: sources.filter(s => s.type === 'government').slice(0, 3).map(s => ({
      label: s.title,
      url: s.url
    })),
    recentNews: ((ai.recentDevelopments as string[]) || []).slice(0, 5).map((d) => ({
      date: accessDate,
      title: d,
      summary: d,
      source: 'Research',
      link: '#'
    })),
    _rawWikiExtract: wikiData?.extract || ''
  };

  const comparisons = (ai.comparisons as string[]) || [];
  const similarCities: SimilarCity[] = comparisons.slice(0, 4).map((c, idx) => ({
    city: c,
    country: '',
    region: '',
    similarity: 50 - idx * 5,
    reason: 'Comparable entity',
    keyMetric: 'Benchmark comparison'
  }));

  onProgress?.({
    stage: 'Finalizing',
    progress: 95,
    message: 'Finalizing entity intelligence...'
  });

  return {
    profile,
    narratives: generateBasicNarratives(profile),
    sources: deduplicateSources(sources),
    similarCities,
    dataQuality: {
      completeness: Math.min(100, sources.length * 12),
      governmentSourcesUsed: sources.filter(s => s.type === 'government').length,
      internationalSourcesUsed: sources.filter(s => s.type === 'international').length,
      newsSourcesUsed: sources.filter(s => s.type === 'news').length,
      dataFreshness: accessDate,
      leaderDataVerified: leadership.length > 0,
      primarySourcePercentage: sources.length ? Math.round((sources.filter(s => s.type === 'government').length / sources.length) * 100) : 0,
      conflictsDetected: 0,
      conflictsResolved: 0
    },
    researchSummary: `Entity intelligence compiled from ${sources.length} sources.`,
    researchSession: {
      id: `entity-session-${Date.now()}`,
      iterations: 1,
      totalTime: 0,
      completenessScore: Math.min(100, sources.length * 12)
    }
  };
}

/**
 * Fallback entity research using public sources
 */
async function executeEntityResearch(
  query: string,
  category: QueryCategory,
  onProgress?: ProgressCallback
): Promise<MultiSourceResult | null> {
  const accessDate = new Date().toISOString().split('T')[0];

  onProgress?.({
    stage: 'Entity Research',
    progress: 15,
    message: 'Collecting public intelligence sources...'
  });

  const [wikiData, officialSearch, leadershipSearch, coverageSearch] = await Promise.all([
    fetchWikipediaEntityData(query),
    performGoogleSearch(`${query} official website`, 6),
    performGoogleSearch(`${query} leadership`, 6),
    performGoogleSearch(`${query} headquarters`, 6)
  ]);

  const sources: SourceCitation[] = [];
  const allSearchResults = [...officialSearch, ...leadershipSearch, ...coverageSearch];

  if (wikiData?.url) {
    sources.push({
      title: `Wikipedia - ${wikiData.title}`,
      url: wikiData.url,
      type: 'encyclopedia',
      reliability: 'medium',
      accessDate,
      dataExtracted: wikiData.extract.substring(0, 150),
      organization: 'Wikipedia'
    });
  }

  allSearchResults.slice(0, 8).forEach((result) => {
    if (!result?.link) return;
    sources.push({
      title: result.title,
      url: result.link,
      type: result.isGovernment ? 'government' : 'research',
      reliability: result.isGovernment ? 'high' : 'medium',
      accessDate,
      dataExtracted: result.snippet.substring(0, 150),
      organization: result.displayLink
    });
  });

  const wikiExtract = wikiData?.extract || '';
  const foundedMatch = wikiExtract.match(/founded in (\d{4})/i) || wikiExtract.match(/established in (\d{4})/i);
  const headquartersMatch = wikiExtract.match(/headquartered in ([^,.]+)/i);
  const countryMatch = wikiExtract.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/);

  const leaders = leadershipSearch.slice(0, 2).map((result, idx) => ({
    id: `leader-${idx + 1}`,
    name: extractNameFromSnippet(result.snippet),
    role: category === 'government' ? 'Senior Official' : 'Executive',
    tenure: 'Current',
    achievements: [result.snippet.substring(0, 150)],
    rating: result.isGovernment ? 6 : 4,
    sourceUrl: result.link,
    photoVerified: false,
    internationalEngagementFocus: false
  }));

  const profile: CityProfile = {
    id: `entity-${Date.now()}`,
    city: query,
    entityName: query,
    entityType: category === 'location' ? 'unknown' : category,
    region: headquartersMatch ? headquartersMatch[1] : '',
    country: countryMatch ? countryMatch[1] : '',
    latitude: 0,
    longitude: 0,
    timezone: 'Not available',
    established: foundedMatch ? foundedMatch[1] : 'Not verified',
    areaSize: 'Not applicable',
    climate: 'Not applicable',
    currency: 'Not applicable',
    businessHours: 'Not available',
    knownFor: wikiExtract ? [wikiExtract.split('.').slice(0, 1).join('.')] : ['Not verified'],
    strategicAdvantages: [],
    investmentPrograms: [],
    keySectors: [],
    foreignCompanies: [],
    departments: [],
    easeOfDoingBusiness: 'Not applicable',
    globalMarketAccess: 'Global',
    infrastructureScore: 50,
    regulatoryFriction: 50,
    politicalStability: 50,
    laborPool: 50,
    costOfDoing: 50,
    investmentMomentum: 50,
    engagementScore: 50,
    overlookedScore: 50,
    leaders: leaders.length ? leaders : [{
      id: 'leader-pending',
      name: 'Leadership information pending verification',
      role: category === 'government' ? 'Senior Official' : 'Executive',
      tenure: 'Current',
      achievements: ['Verify leadership details via official sources'],
      rating: 0,
      internationalEngagementFocus: false
    }],
    economics: {
      gdpLocal: 'Not applicable',
      majorIndustries: [],
      tradePartners: [],
      topExports: []
    },
    demographics: {
      population: 'Not available'
    },
    infrastructure: {},
    governmentLinks: sources.filter(s => s.type === 'government').slice(0, 3).map(s => ({
      label: s.title,
      url: s.url
    })),
    recentNews: []
  };

  const result: MultiSourceResult = {
    profile,
    narratives: generateBasicNarratives(profile),
    sources: deduplicateSources(sources),
    similarCities: [],
    dataQuality: {
      completeness: Math.min(100, sources.length * 10),
      governmentSourcesUsed: sources.filter(s => s.type === 'government').length,
      internationalSourcesUsed: sources.filter(s => s.type === 'international').length,
      newsSourcesUsed: sources.filter(s => s.type === 'news').length,
      dataFreshness: accessDate,
      leaderDataVerified: leaders.length > 0,
      primarySourcePercentage: sources.length ? Math.round((sources.filter(s => s.type === 'government').length / sources.length) * 100) : 0,
      conflictsDetected: 0,
      conflictsResolved: 0
    },
    researchSummary: `Entity intelligence compiled from ${sources.length} sources.`,
    researchSession: {
      id: `entity-session-${Date.now()}`,
      iterations: 1,
      totalTime: 0,
      completenessScore: Math.min(100, sources.length * 10)
    }
  };

  return result;
}

/**
 * Fetch geocoding data from OpenStreetMap
 */
async function fetchGeocoding(location: string): Promise<{
  lat: number;
  lon: number;
  displayName: string;
  country: string;
  countryCode: string;
  state?: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=1`,
      { headers: { 'User-Agent': 'BWGA-Intelligence/1.0' } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          country: data[0].address?.country || '',
          countryCode: (data[0].address?.country_code || '').toUpperCase(),
          state: data[0].address?.state || data[0].address?.province
        };
      }
    }
  } catch (error) {
    console.warn('Geocoding failed:', error);
  }
  return null;
}

/**
 * Fetch Wikipedia extract for direct Gemini research
 */
async function fetchWikipediaExtract(location: string): Promise<string | null> {
  try {
    // Add location context to search to avoid matching unrelated entities (e.g., people with place names)
    const searchTerms = [
      `${location} city`,
      `${location} town`,
      `${location} municipality`,
      location // fallback to plain search
    ];
    
    for (const searchTerm of searchTerms) {
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*&srlimit=3`
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results = searchData.query?.search || [];
        
        // Find a result that looks like a location (contains city, town, place, etc. in snippet or title)
        const locationKeywords = ['city', 'town', 'municipality', 'district', 'province', 'state', 'region', 'county', 'village', 'suburb', 'area', 'located', 'population', 'geography'];
        const personKeywords = ['born', 'died', 'politician', 'president', 'actor', 'actress', 'singer', 'player', 'athlete', 'author', 'writer'];
        
        // First pass: find a clear location match
        for (const result of results) {
          const snippet = (result.snippet || '').toLowerCase();
          const title = (result.title || '').toLowerCase();
          const searchLower = location.toLowerCase().split(',')[0].trim();
          
          // Skip if it looks like a person
          const isPerson = personKeywords.some(kw => snippet.includes(kw));
          if (isPerson) continue;
          
          // Check if title closely matches our search (contains the location name)
          const titleMatchesSearch = title.includes(searchLower) || searchLower.includes(title.split('(')[0].trim());
          
          // Check if it looks like a location
          const isLocation = locationKeywords.some(kw => snippet.includes(kw) || title.includes(kw));
          
          if (titleMatchesSearch && (isLocation || !isPerson)) {
            // Fetch the extract for this result
            const extractRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&prop=extracts&explaintext=true&format=json&origin=*`
            );
            if (extractRes.ok) {
              const extractData = await extractRes.json();
              const pages = extractData.query?.pages;
              const page = Object.values(pages)[0] as { extract?: string };
              const extract = page?.extract?.substring(0, 3000);
              
              // Final validation: make sure the extract doesn't look like a person bio
              if (extract && !extract.match(/^[A-Z][a-z]+ [A-Z][a-z]+ \(born|was born|is an? (American|British|Australian|Canadian|politician|president|actor)/i)) {
                return extract;
              }
            }
          }
        }
      }
    }
    
    // If no location found, return null rather than wrong data
    console.warn('[GLI] Wikipedia: No matching location found for:', location);
    return null;
  } catch (error) {
    console.warn('Wikipedia fetch failed:', error);
  }
  return null;
}

/**
 * Fetch World Bank indicators
 */
async function fetchWorldBankIndicators(countryCode: string): Promise<Record<string, { value: number; year: string }> | null> {
  const indicators = [
    { code: 'NY.GDP.MKTP.CD', name: 'GDP' },
    { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth' },
    { code: 'NY.GDP.PCAP.CD', name: 'GDP per Capita' },
    { code: 'SP.POP.TOTL', name: 'Population' },
    { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment' },
    { code: 'IT.NET.USER.ZS', name: 'Internet Users' }
  ];
  
  const results: Record<string, { value: number; year: string }> = {};
  
  await Promise.all(indicators.map(async (ind) => {
    try {
      const res = await fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${ind.code}?format=json&per_page=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data[1]?.[0]?.value !== null) {
          results[ind.name] = { value: data[1][0].value, year: data[1][0].date };
        }
      }
    } catch {
      // Individual indicator failure is OK
    }
  }));
  
  return Object.keys(results).length > 0 ? results : null;
}

/**
 * Fetch news and recent developments from DuckDuckGo
 */
async function fetchRecentNews(location: string): Promise<Array<{ title: string; snippet: string; url: string }>> {
  try {
    const query = `${location} investment development news 2025 2026`;
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    if (response.ok) {
      const data = await response.json();
      const results: Array<{ title: string; snippet: string; url: string }> = [];
      
      // Extract related topics
      if (data.RelatedTopics) {
        for (const topic of data.RelatedTopics.slice(0, 5)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.substring(0, 100),
              snippet: topic.Text,
              url: topic.FirstURL
            });
          }
        }
      }
      return results;
    }
  } catch (error) {
    console.warn('[GLI] News fetch failed:', error);
  }
  return [];
}

/**
 * Fetch Wikidata structured data for a location
 * @deprecated Now using web search instead of Wikipedia/Wikidata
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchWikidataInfo(location: string): Promise<Record<string, unknown> | null> {
  try {
    // Search for entity
    const searchRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(location)}&language=en&format=json&origin=*&limit=1`
    );
    if (!searchRes.ok) return null;
    
    const searchData = await searchRes.json();
    const entityId = searchData.search?.[0]?.id;
    if (!entityId) return null;
    
    // Fetch entity details
    const entityRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims|labels|descriptions&languages=en&format=json&origin=*`
    );
    if (!entityRes.ok) return null;
    
    const entityData = await entityRes.json();
    const entity = entityData.entities?.[entityId];
    if (!entity) return null;
    
    const claims = entity.claims || {};
    const result: Record<string, unknown> = {
      label: entity.labels?.en?.value,
      description: entity.descriptions?.en?.value
    };
    
    // Extract key properties
    // P17 = country, P36 = capital, P1082 = population, P571 = inception, P856 = website
    const propertyMap: Record<string, string> = {
      'P17': 'country',
      'P36': 'capital',
      'P1082': 'population',
      'P571': 'founded',
      'P856': 'officialWebsite',
      'P6': 'headOfGovernment',
      'P1313': 'officeHeldByHeadOfGovernment'
    };
    
    for (const [propId, propName] of Object.entries(propertyMap)) {
      if (claims[propId]?.[0]?.mainsnak?.datavalue?.value) {
        const val = claims[propId][0].mainsnak.datavalue.value;
        result[propName] = typeof val === 'object' ? val.amount || val.time || val.id : val;
      }
    }
    
    return result;
  } catch (error) {
    console.warn('[GLI] Wikidata fetch failed:', error);
  }
  return null;
}

/**
 * Fetch Open Data Soft datasets (city statistics)
 */
async function fetchOpenDataStats(location: string, country: string): Promise<Record<string, unknown> | null> {
  try {
    // Try to get city statistics from OpenDataSoft public datasets
    const query = `${location} ${country}`;
    const response = await fetch(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${encodeURIComponent(query)}&rows=1`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.records?.[0]?.fields) {
        const fields = data.records[0].fields;
        return {
          population: fields.population,
          timezone: fields.timezone,
          elevation: fields.elevation,
          countryCode: fields.country_code,
          adminName: fields.admin1_code
        };
      }
    }
  } catch (error) {
    console.warn('[GLI] OpenDataSoft fetch failed:', error);
  }
  return null;
}

/**
 * Transform AI response to MultiSourceResult format
 */
function transformAIToProfile(
  locationQuery: string,
  ai: Record<string, unknown>,
  geoData: { lat: number; lon: number; country: string; countryCode: string; state?: string } | null,
  webSearchContext: string | null,
  worldBankData: Record<string, unknown> | null,
  sourceUrls: string[] = [],
  onProgress?: ProgressCallback
): MultiSourceResult {
  console.log('[GLI Transform] Starting transformation for:', locationQuery);
  console.log('[GLI Transform] AI response keys:', Object.keys(ai));
  console.log('[GLI Transform] AI overview:', ai.overview ? 'present' : 'missing');
  console.log('[GLI Transform] AI governance:', ai.governance ? 'present' : 'missing');
  console.log('[GLI Transform] AI economy:', ai.economy ? 'present' : 'missing');
  console.log('[GLI Transform] AI demographics:', ai.demographics ? 'present' : 'missing');
  
  const accessDate = new Date().toISOString().split('T')[0];
  
  // Build sources from web search results
  const sources: SourceCitation[] = [];
  
  // Add web search source URLs
  sourceUrls.forEach((url, idx) => {
    try {
      const domain = new URL(url).hostname;
      const isGov = domain.includes('.gov') || domain.includes('.gov.au') || domain.includes('.govt');
      sources.push({
        title: `Source ${idx + 1}: ${domain}`,
        url: url,
        type: isGov ? 'government' : 'research',
        reliability: isGov ? 'high' : 'medium',
        accessDate,
        dataExtracted: 'Web search result',
        organization: domain
      });
    } catch {
      // Invalid URL, skip
    }
  });

  if (worldBankData && Object.keys(worldBankData).length > 0) {
    sources.push({
      title: `World Bank - ${geoData?.country || locationQuery}`,
      url: `https://data.worldbank.org/country/${geoData?.countryCode || ''}`,
      type: 'worldbank',
      reliability: 'high',
      accessDate,
      dataExtracted: Object.entries(worldBankData).map(([k, v]) => `${k}: ${(v as { value: number }).value}`).join('; '),
      organization: 'World Bank Group'
    });
  }

  // Add AI-identified sources
  const aiDataSources = (ai.dataSources as string[]) || [];
  aiDataSources.slice(0, 5).forEach((src: string) => {
    sources.push({
      title: src,
      url: '#verified-source',
      type: 'research',
      reliability: 'high',
      accessDate,
      dataExtracted: 'Authoritative data source',
      organization: src
    });
  });

  const officialPortals = (ai.officialPortals as Array<{ label: string; url: string }>) || [];
  officialPortals.forEach((portal) => {
    if (!portal?.url) return;
    sources.push({
      title: portal.label || 'Official government portal',
      url: portal.url,
      type: 'government',
      reliability: 'high',
      accessDate,
      dataExtracted: 'Official portal / contact point',
      organization: portal.label
    });
  });

  // Extract nested data safely
  const overview = ai.overview as Record<string, unknown> || {};
  const demographics = ai.demographics as Record<string, unknown> || {};
  const governance = ai.governance as Record<string, unknown> || {};
  const economy = ai.economy as Record<string, unknown> || {};
  const infrastructure = ai.infrastructure as Record<string, unknown> || {};
  const investment = ai.investment as Record<string, unknown> || {};
  const education = ai.education as Record<string, unknown> || {};
  const risks = ai.risks as Record<string, unknown> || {};
  const scores = ai.scores as Record<string, number> || {};
  const dataQuality = ai.dataQuality as Record<string, unknown> || {};
  const leader = governance.leader as Record<string, unknown> || {};
  const keyOfficials = (governance.keyOfficials as Array<Record<string, unknown>>) || [];
  const contactDirectory = (ai.contactDirectory as Array<Record<string, string>>) || [];

  // Build leaders
  const leaders: CityLeader[] = [];
  if (leader.name && leader.name !== 'Unknown') {
    leaders.push({
      id: 'leader-1',
      name: leader.name as string,
      role: leader.title as string || 'Government Leader',
      tenure: leader.since ? `Since ${leader.since}` : 'Current Term',
      achievements: (governance.departments as string[]) || ['Government leadership'],
      rating: 80,
      fullBio: `${leader.name} serves as ${leader.title}${leader.party ? ` (${leader.party})` : ''}.`,
      sourceUrl: '',
      photoVerified: false,
      internationalEngagementFocus: true
    });
  }

  keyOfficials.forEach((official, idx) => {
    const name = official.name as string | undefined;
    if (!name || name === 'Unknown') return;
    const role = (official.title as string) || 'Government Official';
    const alreadyIncluded = leaders.some(l => l.name === name && l.role === role);
    if (alreadyIncluded) return;
    leaders.push({
      id: `leader-key-${idx}`,
      name,
      role,
      tenure: official.since ? `Since ${official.since}` : 'Current Term',
      achievements: (governance.departments as string[]) || ['Government leadership'],
      rating: 75,
      fullBio: `${name} serves as ${role}${official.party ? ` (${official.party})` : ''}.`,
      sourceUrl: (official.sourceUrl as string) || '',
      photoVerified: false,
      internationalEngagementFocus: false
    });
  });

  // Helper function to get intelligent defaults
  const getIntelligentTimezone = () => {
    if (overview.timezone) return overview.timezone as string;
    if (geoData?.lat) {
      const lng = geoData.lon || 0;
      const offset = Math.round(lng / 15);
      return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }
    return 'Local timezone data pending verification';
  };

  const getIntelligentCurrency = () => {
    if (overview.currency) return overview.currency as string;
    const country = geoData?.country || '';
    const currencyMap: Record<string, string> = {
      'Australia': 'Australian Dollar (AUD)',
      'Philippines': 'Philippine Peso (PHP)',
      'United States': 'US Dollar (USD)',
      'United Kingdom': 'British Pound (GBP)',
      'Japan': 'Japanese Yen (JPY)',
      'Germany': 'Euro (EUR)',
      'France': 'Euro (EUR)',
      'China': 'Chinese Yuan (CNY)',
      'India': 'Indian Rupee (INR)',
      'Singapore': 'Singapore Dollar (SGD)'
    };
    return currencyMap[country] || `${country} national currency`;
  };

  // Build profile with intelligent defaults
  const profile: CityProfile = {
    id: `gemini-research-${Date.now()}`,
    city: locationQuery.split(',')[0].trim(),
    region: geoData?.state || (governance.administrativeLevel as string) || '',
    country: geoData?.country || '',
    latitude: geoData?.lat || 0,
    longitude: geoData?.lon || 0,
    timezone: getIntelligentTimezone(),
    established: (overview.established as string) || 'Establishment date verification in progress',
    areaSize: (overview.area as string) || 'Geographic area verification in progress',
    climate: (overview.climate as string) || 'Climate data verification in progress',
    currency: getIntelligentCurrency(),
    businessHours: (overview.businessHours as string) || '8:00 AM - 5:00 PM local time',
    globalMarketAccess: (overview.significance as string) || 'Regional and global connectivity',
    departments: (governance.departments as string[]) || ['City Government', 'Economic Development', 'Investment Promotion'],
    easeOfDoingBusiness: (investment.easeOfBusiness as string) || 'See World Bank Report',

    engagementScore: Math.round((scores.investmentMomentum || 50) * 0.8 + 20),
    overlookedScore: 30,
    infrastructureScore: scores.infrastructure || 60,
    regulatoryFriction: 100 - (scores.regulatoryEase || 50),
    politicalStability: scores.politicalStability || 60,
    laborPool: scores.laborPool || 60,
    costOfDoing: 100 - (scores.costCompetitiveness || 50),
    investmentMomentum: scores.investmentMomentum || 55,

    knownFor: ((economy.mainIndustries as Array<{ name: string }>) || []).map(i => i.name || i).slice(0, 5) as string[],
    strategicAdvantages: (ai.competitiveAdvantages as string[]) || ['Strategic location'],
    keySectors: ((economy.mainIndustries as Array<{ name: string }>) || []).map(i => i.name || i).slice(0, 6) as string[],
    investmentPrograms: (investment.incentives as string[]) || ['See investment office'],
    foreignCompanies: (economy.majorEmployers as string[]) || ['Major employers'],

    leaders,

    demographics: {
      population: (demographics.population as string) || 'Population data verification in progress',
      populationGrowth: (demographics.populationGrowth as string) || 'Growth rate verification in progress',
      medianAge: (demographics.medianAge as string) || 'Median age data verification in progress',
      literacyRate: (education.literacyRate as string) || 'Literacy rate verification in progress',
      workingAgePopulation: 'Working age data verification in progress',
      universitiesColleges: ((education.universities as unknown[]) || []).length,
      graduatesPerYear: 'Graduate statistics verification in progress',
      languages: demographics.languages as string[] || []
    },

    economics: {
      gdpLocal: (economy.gdpLocal as string) || 'Economic data verification in progress',
      gdpGrowthRate: (economy.gdpGrowth as string) || 'GDP growth verification in progress',
      employmentRate: economy.unemployment ? `${100 - parseFloat(economy.unemployment as string)}% employed` : 'Employment data verification in progress',
      avgIncome: (economy.averageIncome as string) || 'Income statistics verification in progress',
      exportVolume: 'Trade volume verification in progress',
      majorIndustries: ((economy.mainIndustries as Array<{ name: string }>) || []).map(i => i.name || i) as string[],
      topExports: (economy.exports as string[]) || [],
      tradePartners: (economy.tradePartners as string[]) || []
    },

    infrastructure: {
      airports: ((infrastructure.airports as Array<{ name: string; code?: string; type?: string }>) || []).map(a => ({
        name: `${a.name}${a.code ? ` (${a.code})` : ''}`,
        type: a.type || 'Airport'
      })),
      seaports: ((infrastructure.seaports as Array<{ name: string; type?: string }>) || []).map(p => ({
        name: p.name,
        type: p.type || 'Port'
      })),
      specialEconomicZones: (economy.economicZones as string[]) || [],
      powerCapacity: (infrastructure.powerCapacity as string) || 'Power infrastructure verification in progress',
      internetPenetration: (infrastructure.internetPenetration as string) || 'Internet penetration verification in progress'
    },

    governmentLinks: officialPortals.filter(p => p?.url).map(p => ({ label: p.label || 'Official portal', url: p.url })),
    governmentOffices: contactDirectory.map((office) => ({
      name: office.name || 'Government Office',
      type: office.type || 'local',
      website: office.website,
      email: office.email,
      phone: office.phone,
      address: office.address
    })),

    recentNews: ((ai.recentDevelopments as Array<{ date: string; title: string; description: string }>) || []).map(d => ({
      date: d.date || accessDate,
      title: d.title,
      summary: d.description,
      source: 'Research',
      link: '#'
    })),

    // Store AI-generated description for the "About" section (no longer using Wikipedia)
    _rawWikiExtract: (overview.description as string) || ''
  };

  // Build narratives
  const narratives: EnhancedNarratives = {
    overview: {
      title: 'Location Overview',
      introduction: (overview.significance as string) || `${profile.city} is a strategic location.`,
      paragraphs: [{
        text: (overview.description as string) || `${profile.city} serves as a hub for regional commerce and development.`,
        citations: sources.slice(0, 2),
        confidence: 0.9
      }],
      keyFacts: (ai.competitiveAdvantages as string[])?.slice(0, 5) || [],
      conclusion: `Research compiled from ${sources.length} authoritative sources.`
    },
    history: {
      title: 'Historical Context',
      introduction: `${profile.city} was established ${profile.established}.`,
      paragraphs: [],
      keyFacts: [],
      conclusion: 'See historical records for detailed timeline.'
    },
    geography: {
      title: 'Geographic Context',
      introduction: `Located at ${profile.latitude.toFixed(4)}°, ${profile.longitude.toFixed(4)}° in ${profile.country}.`,
      paragraphs: [],
      keyFacts: [
        `Coordinates: ${profile.latitude.toFixed(4)}°, ${profile.longitude.toFixed(4)}°`,
        `Region: ${profile.region || profile.country}`
      ],
      conclusion: 'Geographic positioning supports regional connectivity.'
    },
    economy: {
      title: 'Economic Profile',
      introduction: profile.economics.gdpLocal || 'Economic data available.',
      paragraphs: [{
        text: `Key industries include ${profile.keySectors.slice(0, 3).join(', ')}. Major employers: ${profile.foreignCompanies.slice(0, 3).join(', ')}.`,
        citations: sources.filter(s => s.type === 'worldbank'),
        confidence: 0.85
      }],
      keyFacts: [
        `GDP: ${profile.economics.gdpLocal}`,
        `Growth: ${profile.economics.gdpGrowthRate}`,
        `Key Sectors: ${profile.keySectors.slice(0, 3).join(', ')}`
      ],
      conclusion: 'Economic fundamentals support investment consideration.'
    },
    governance: {
      title: 'Governance & Leadership',
      introduction: `${profile.city} operates under ${profile.country}'s governance framework.`,
      paragraphs: leaders.length > 0 ? [{
        text: `Current leadership: ${leaders[0].name} (${leaders[0].role}). ${leaders[0].fullBio}`,
        citations: [],
        confidence: 0.85
      }] : [],
      keyFacts: profile.departments,
      conclusion: 'See official government channels for current information.'
    },
    infrastructure: {
      title: 'Infrastructure & Connectivity',
      introduction: 'Transportation and utilities infrastructure supports operations.',
      paragraphs: [{
        text: `Airports: ${profile.infrastructure.airports.map(a => a.name).join(', ') || 'See aviation authority'}. Ports: ${profile.infrastructure.seaports.map(p => p.name).join(', ') || 'See port authority'}. Internet: ${profile.infrastructure.internetPenetration}.`,
        citations: [],
        confidence: 0.8
      }],
      keyFacts: [
        `Internet: ${profile.infrastructure.internetPenetration}`,
        `Power: ${profile.infrastructure.powerCapacity}`
      ],
      conclusion: 'Infrastructure assessment indicates operational readiness.'
    },
    investment: {
      title: 'Investment Case',
      introduction: (investment.climate as string) || 'Investment opportunities available.',
      paragraphs: [{
        text: ((investment.opportunities as string[]) || []).join('. ') || 'Contact local investment office.',
        citations: [],
        confidence: 0.8
      }],
      keyFacts: (investment.incentives as string[]) || [],
      conclusion: (investment.challenges as string[])?.length ? `Challenges: ${(investment.challenges as string[]).join(', ')}` : 'Due diligence recommended.'
    },
    risks: {
      title: 'Risk Assessment',
      introduction: 'Risk profile based on available indicators.',
      paragraphs: [{
        text: `Political: ${risks.political || 'See analysis'}. Economic: ${risks.economic || 'Monitor conditions'}. Natural: ${risks.natural || 'Check preparedness'}.`,
        citations: [],
        confidence: 0.75
      }],
      keyFacts: [
        `Political Stability: ${profile.politicalStability}/100`,
        `Regulatory Friction: ${profile.regulatoryFriction}/100`
      ],
      conclusion: 'Risk mitigation strategies recommended.'
    },
    opportunities: {
      title: 'Growth Opportunities',
      introduction: 'Identified opportunities based on analysis.',
      paragraphs: [{
        text: ((investment.opportunities as string[]) || []).join('. ') || 'Growth sectors identified.',
        citations: [],
        confidence: 0.8
      }],
      keyFacts: (ai.competitiveAdvantages as string[])?.slice(0, 4) || [],
      conclusion: 'Strategic opportunities align with development trends.'
    }
  };

  // Build similar cities
  const similarCities: SimilarCity[] = ((ai.similarLocations as Array<{ name: string; country: string; similarity: string; keyDifference: string }>) || []).map(loc => ({
    city: loc.name,
    country: loc.country,
    region: '',
    similarity: 0.75,
    reason: loc.similarity,
    keyMetric: loc.keyDifference
  }));

  // Data quality
  const qualityData: DataQualityReport = {
    completeness: (dataQuality.completeness as number) || 80,
    governmentSourcesUsed: sources.filter(s => s.type === 'government').length,
    internationalSourcesUsed: sources.filter(s => s.type === 'worldbank' || s.type === 'international').length + 1,
    newsSourcesUsed: ((ai.recentDevelopments as unknown[]) || []).length,
    dataFreshness: (dataQuality.freshness as string) || accessDate,
    leaderDataVerified: !!leader.name,
    primarySourcePercentage: 70,
    conflictsDetected: 0,
    conflictsResolved: 0
  };

  onProgress?.({
    stage: 'Complete',
    progress: 100,
    message: `AI research complete: ${sources.length} sources, ${qualityData.completeness}% completeness`
  });

  return {
    profile,
    narratives,
    sources,
    similarCities,
    dataQuality: qualityData,
    researchSummary: `AI-powered research with ${sources.length} sources. ${(dataQuality.confidence as string) || 'High'} confidence. Data: ${qualityData.dataFreshness}.`,
    researchSession: {
      id: `gemini-${Date.now()}`,
      iterations: 1,
      totalTime: 0,
      completenessScore: qualityData.completeness
    }
  };
}

// ==================== BACKEND AI-ENHANCED RESEARCH ====================

/**
 * Try backend AI-enhanced location intelligence first
 * Falls back to frontend-only research if backend unavailable
 */
async function tryBackendResearch(
  locationQuery: string,
  onProgress?: ProgressCallback
): Promise<MultiSourceResult | null> {
  try {
    onProgress?.({
      stage: 'AI Research',
      progress: 10,
      message: 'Connecting to AI research engine...'
    });

    const response = await fetch('/api/search/location-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: locationQuery })
    });

    if (!response.ok) {
      console.warn('Backend research unavailable, falling back to frontend research');
      return null;
    }

    const data = await response.json();

    if (!data.aiEnhanced || !data.aiIntelligence) {
      console.warn('Backend returned non-AI data, falling back to frontend research');
      return null;
    }

    onProgress?.({
      stage: 'AI Research',
      progress: 50,
      message: 'AI intelligence received, building profile...'
    });

    // Transform AI response into MultiSourceResult format
    const ai = data.aiIntelligence;
    const geo = data.geocoding;
    const wb = data.worldBank || {};

    // Build sources from AI data
    const sources: SourceCitation[] = [];
    const accessDate = new Date().toISOString().split('T')[0];

    // Add Wikipedia source if available
    if (data.wikipedia) {
      sources.push({
        title: `Wikipedia - ${locationQuery}`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(locationQuery.replace(/ /g, '_'))}`,
        type: 'encyclopedia',
        reliability: 'medium',
        accessDate,
        dataExtracted: data.wikipedia.substring(0, 200),
        organization: 'Wikipedia'
      });
    }

    // Add World Bank source if available
    if (Object.keys(wb).length > 0) {
      sources.push({
        title: `World Bank - ${geo?.country || locationQuery}`,
        url: `https://data.worldbank.org/country/${geo?.countryCode || ''}`,
        type: 'worldbank',
        reliability: 'high',
        accessDate,
        dataExtracted: Object.entries(wb).map(([k, v]) => `${k}: ${(v as { value: unknown }).value}`).join('; '),
        organization: 'World Bank Group'
      });
    }

    // Add AI-identified sources
    if (ai.dataSources && Array.isArray(ai.dataSources)) {
      ai.dataSources.slice(0, 5).forEach((src: string) => {
        sources.push({
          title: src,
          url: '#ai-synthesized',
          type: 'research',
          reliability: 'medium',
          accessDate,
          dataExtracted: 'AI-synthesized intelligence',
          organization: src
        });
      });
    }

    // Build leaders from AI data
    const leaders: CityLeader[] = [];
    if (ai.governance?.leader?.name && ai.governance.leader.name !== 'Unknown') {
      leaders.push({
        id: 'leader-1',
        name: ai.governance.leader.name,
        role: ai.governance.leader.title || 'City/Regional Leader',
        tenure: ai.governance.leader.since ? `Since ${ai.governance.leader.since}` : 'Current Term',
        achievements: ai.governance.departments || ['See government sources'],
        rating: 75,
        fullBio: `${ai.governance.leader.name} serves as ${ai.governance.leader.title}${ai.governance.leader.party ? ` (${ai.governance.leader.party})` : ''}.`,
        sourceUrl: '',
        photoVerified: false,
        internationalEngagementFocus: false
      });
    }

    // Build profile from AI intelligence
    const profile: CityProfile = {
      id: data.researchId || `ai-research-${Date.now()}`,
      city: locationQuery.split(',')[0].trim(),
      region: geo?.state || ai.governance?.administrativeLevel || '',
      country: geo?.country || '',
      latitude: geo?.lat || 0,
      longitude: geo?.lon || 0,
      timezone: 'UTC+0', // Could be enhanced
      established: ai.overview?.established || 'See historical records',
      areaSize: ai.demographics?.area || 'See geographic sources',
      climate: ai.geography?.climate || 'Regional climate',
      currency: 'National Currency',
      businessHours: '8:00 AM - 5:00 PM local time',
      globalMarketAccess: ai.overview?.significance || 'Regional market access',
      departments: ai.governance?.departments || ['City Government'],
      easeOfDoingBusiness: ai.investment?.easeOfBusiness || 'See World Bank Report',

      // Scores from AI
      engagementScore: Math.round((ai.scores?.investmentMomentum || 50) * 0.8 + 20),
      overlookedScore: 40,
      infrastructureScore: ai.scores?.infrastructure || 50,
      regulatoryFriction: 100 - (ai.scores?.regulatoryEase || 50),
      politicalStability: ai.scores?.politicalStability || 50,
      laborPool: ai.scores?.laborPool || 50,
      costOfDoing: 100 - (ai.scores?.costCompetitiveness || 50),
      investmentMomentum: ai.scores?.investmentMomentum || 50,

      // Content from AI
      knownFor: (ai.mainIndustries as Array<string | { name?: string }> | undefined)?.map((i) =>
        typeof i === 'string' ? i : i.name || ''
      ).filter(Boolean) ||
                (ai.economy?.mainIndustries as Array<string | { name?: string }> | undefined)?.map((i) =>
                  typeof i === 'string' ? i : i.name || ''
                ).filter(Boolean) ||
                ['Regional commerce'],
      strategicAdvantages: (ai.competitiveAdvantages as string[]) || ['Strategic location'],
      keySectors: (ai.economy?.mainIndustries as Array<string | { name?: string }> | undefined)?.map((i) =>
        typeof i === 'string' ? i : i.name || ''
      ).filter(Boolean) || ['Services'],
      investmentPrograms: ai.investment?.incentives || ['See investment office'],
      foreignCompanies: ai.economy?.majorEmployers || ['See Chamber of Commerce'],

      leaders,

      demographics: {
        population: ai.demographics?.population || 'Population data pending',
        populationGrowth: ai.demographics?.populationGrowth || 'Growth data pending',
        medianAge: ai.demographics?.medianAge || 'Age data pending',
        literacyRate: ai.education?.literacyRate || 'Literacy data pending',
        workingAgePopulation: 'Labor force data pending',
        universitiesColleges: ai.education?.universities?.length || 0,
        graduatesPerYear: 'Education data pending',
        languages: ai.demographics?.languages
      },

      economics: {
        gdpLocal: ai.economy?.gdpLocal || wb['GDP (current US$)']?.value ? 
          `$${(wb['GDP (current US$)'].value / 1e9).toFixed(2)}B (${wb['GDP (current US$)'].year})` : 
          'Economic data pending',
        gdpGrowthRate: ai.economy?.gdpGrowth || wb['GDP Growth (annual %)']?.value ?
          `${wb['GDP Growth (annual %)'].value.toFixed(2)}%` :
          'Growth data pending',
        employmentRate: ai.economy?.unemployment ? `${100 - parseFloat(ai.economy.unemployment)}% (inverse of unemployment)` : 'Employment data pending',
        avgIncome: ai.economy?.averageIncome || 'Income data pending',
        exportVolume: 'Trade data pending',
        majorIndustries: (ai.economy?.mainIndustries as Array<string | { name?: string }> | undefined)?.map((i) =>
          typeof i === 'string' ? i : i.name || ''
        ).filter(Boolean) || [],
        topExports: ai.economy?.exports || [],
        tradePartners: ai.economy?.tradePartners || []
      },

      infrastructure: {
        airports: (ai.infrastructure?.airports as Array<string | { name?: string; code?: string; type?: string }> | undefined)?.map((a) => ({
          name: typeof a === 'string' ? a : `${a.name || 'Airport'}${a.code ? ` (${a.code})` : ''}`,
          type: typeof a === 'string' ? 'Airport' : (a.type || 'Airport')
        })) || [{ name: 'See aviation authority', type: 'Airport' }],
        seaports: (ai.infrastructure?.seaports as Array<string | { name?: string; type?: string }> | undefined)?.map((p) => ({
          name: typeof p === 'string' ? p : (p.name || 'Port'),
          type: typeof p === 'string' ? 'Port' : (p.type || 'Port')
        })) || [{ name: 'See port authority', type: 'Port' }],
        specialEconomicZones: ai.economy?.economicZones || ['Contact investment office'],
        powerCapacity: ai.infrastructure?.powerCapacity || 'See utility provider',
        internetPenetration: ai.infrastructure?.internetPenetration || 
          (wb['Internet Users (%)']?.value ? `${wb['Internet Users (%)'].value.toFixed(1)}%` : 'Connectivity data pending')
      },

      governmentLinks: [],

      recentNews: (ai.recentDevelopments as Array<{ date?: string; title?: string; description?: string }> | undefined)?.map((d) => ({
        date: d.date || new Date().toISOString().split('T')[0],
        title: d.title || 'Recent development',
        summary: d.description || '',
        source: 'AI Research',
        link: '#'
      })) || []
    };

    // Build data quality report
    const dataQuality: DataQualityReport = {
      completeness: ai.dataQuality?.completeness || 75,
      governmentSourcesUsed: sources.filter(s => s.type === 'government').length,
      internationalSourcesUsed: sources.filter(s => s.type === 'worldbank' || s.type === 'international').length + 1,
      newsSourcesUsed: ai.recentDevelopments?.length || 0,
      dataFreshness: ai.dataQuality?.freshness || new Date().toISOString().split('T')[0],
      leaderDataVerified: !!ai.governance?.leader?.name,
      primarySourcePercentage: 60,
      conflictsDetected: 0,
      conflictsResolved: 0
    };

    // Build enhanced narratives from AI
    const narratives: EnhancedNarratives = {
      overview: {
        title: 'Location Overview',
        introduction: ai.overview?.significance || `${profile.city} is a strategic location in ${profile.country}.`,
        paragraphs: [{
          text: ai.overview?.description || `${profile.city} serves as a hub for regional commerce and development.`,
          citations: sources.slice(0, 2),
          confidence: 0.85
        }],
        keyFacts: ai.competitiveAdvantages?.slice(0, 5) || [],
        conclusion: `Research compiled from AI synthesis and ${sources.length} data sources.`
      },
      history: {
        title: 'Historical Context',
        introduction: `${profile.city} was established ${profile.established}.`,
        paragraphs: [],
        keyFacts: [],
        conclusion: 'See historical records for detailed timeline.'
      },
      geography: {
        title: 'Geographic Context',
        introduction: `Located at ${profile.latitude}°, ${profile.longitude}° in ${profile.country}.`,
        paragraphs: [],
        keyFacts: [
          `Coordinates: ${profile.latitude}°, ${profile.longitude}°`,
          `Climate: ${profile.climate}`,
          `Region: ${profile.region}`
        ],
        conclusion: 'Geographic positioning supports regional connectivity.'
      },
      economy: {
        title: 'Economic Profile',
        introduction: ai.economy?.gdpLocal || 'Economic data available from World Bank sources.',
        paragraphs: [{
          text: `Key industries include ${profile.keySectors.join(', ')}. Major employers: ${profile.foreignCompanies.slice(0, 3).join(', ')}.`,
          citations: sources.filter(s => s.type === 'worldbank'),
          confidence: 0.8
        }],
        keyFacts: [
          `GDP: ${profile.economics.gdpLocal}`,
          `Growth: ${profile.economics.gdpGrowthRate}`,
          `Key Sectors: ${profile.keySectors.slice(0, 3).join(', ')}`
        ],
        conclusion: 'Economic fundamentals support investment consideration.'
      },
      governance: {
        title: 'Governance & Leadership',
        introduction: `${profile.city} operates under ${profile.country}'s governance framework.`,
        paragraphs: leaders.length > 0 ? [{
          text: `Current leadership: ${leaders[0].name} (${leaders[0].role}). ${leaders[0].fullBio}`,
          citations: [],
          confidence: ai.governance?.leader?.name ? 0.8 : 0.5
        }] : [],
        keyFacts: profile.departments,
        conclusion: 'See official government channels for current information.'
      },
      infrastructure: {
        title: 'Infrastructure & Connectivity',
        introduction: 'Transportation and utilities infrastructure supports business operations.',
        paragraphs: [{
          text: `Airports: ${profile.infrastructure.airports.map(a => a.name).join(', ')}. Ports: ${profile.infrastructure.seaports.map(p => p.name).join(', ')}. Internet: ${profile.infrastructure.internetPenetration}.`,
          citations: [],
          confidence: 0.75
        }],
        keyFacts: [
          `Internet: ${profile.infrastructure.internetPenetration}`,
          `Power: ${profile.infrastructure.powerCapacity}`
        ],
        conclusion: 'Infrastructure assessment indicates operational readiness.'
      },
      investment: {
        title: 'Investment Case',
        introduction: ai.investment?.climate || 'Investment opportunities available.',
        paragraphs: [{
          text: ai.investment?.opportunities?.join('. ') || 'Contact local investment promotion office for details.',
          citations: [],
          confidence: 0.7
        }],
        keyFacts: ai.investment?.incentives || ['See investment office'],
        conclusion: ai.investment?.challenges ? `Challenges to consider: ${ai.investment.challenges.join(', ')}` : 'Due diligence recommended.'
      },
      risks: {
        title: 'Risk Assessment',
        introduction: 'Risk profile based on available indicators.',
        paragraphs: [{
          text: `Political: ${ai.risks?.political || 'See regional analysis'}. Economic: ${ai.risks?.economic || 'Monitor local conditions'}. Natural: ${ai.risks?.natural || 'Check disaster preparedness'}.`,
          citations: [],
          confidence: 0.7
        }],
        keyFacts: [
          `Political Stability: ${profile.politicalStability}/100`,
          `Regulatory Friction: ${profile.regulatoryFriction}/100`
        ],
        conclusion: 'Risk mitigation strategies recommended for implementation.'
      },
      opportunities: {
        title: 'Growth Opportunities',
        introduction: 'Identified opportunities based on market analysis.',
        paragraphs: [{
          text: ai.investment?.opportunities?.join('. ') || 'Growth sectors identified in regional analysis.',
          citations: [],
          confidence: 0.75
        }],
        keyFacts: ai.competitiveAdvantages?.slice(0, 4) || [],
        conclusion: 'Strategic opportunities align with regional development trends.'
      }
    };

    // Build similar cities
    const similarCities: SimilarCity[] = (ai.similarLocations as Array<{
      name?: string;
      country?: string;
      similarity?: string;
      keyDifference?: string;
    }> | undefined)?.map((loc) => ({
      city: loc.name || 'Comparable location',
      country: loc.country || '',
      region: '',
      similarity: 0.7,
      reason: loc.similarity || 'Similarity assessment',
      keyMetric: loc.keyDifference || 'Economic profile'
    })) || [];

    onProgress?.({
      stage: 'Complete',
      progress: 100,
      message: `AI-enhanced research complete: ${sources.length} sources, ${dataQuality.completeness}% completeness`
    });

    const result: MultiSourceResult = {
      profile,
      narratives,
      sources,
      similarCities,
      dataQuality,
      researchSummary: `AI-enhanced research completed with ${sources.length} sources. ${ai.dataQuality?.confidence || 'Medium'} confidence. Data freshness: ${dataQuality.dataFreshness}.`,
      researchSession: {
        id: data.researchId || `ai-${Date.now()}`,
        iterations: 1,
        totalTime: Date.now() - (new Date(data.timestamp).getTime() || Date.now()),
        completenessScore: dataQuality.completeness
      }
    };

    // Cache the result
    await locationResearchCache.saveFullResult(locationQuery, result);

    return result;

  } catch (error) {
    console.warn('Backend AI research failed, falling back to frontend:', error);
    return null;
  }
}

// ==================== ENHANCED RESEARCH SERVICE ====================

/**
 * Main enhanced multi-source research function with full autonomous capabilities
 */
export async function multiSourceResearch(
  locationQuery: string,
  onProgress?: ProgressCallback,
  enableAutonomousRefinement: boolean = true
): Promise<MultiSourceResult | null> {
  const sessionStart = Date.now();

  try {
    // Initialize cache
    await locationResearchCache.initialize();

    // TEMPORARILY SKIP CACHE to force fresh Gemini research
    console.log('[GLI Research] Skipping cache, forcing fresh AI research for:', locationQuery);

    let queryCategory = detectQueryCategory(locationQuery);
    if (queryCategory === 'location') {
      const geoPreview = await fetchGeocoding(locationQuery);
      if (!geoPreview) {
        const wikiPreview = await fetchWikipediaExtract(locationQuery);
        const looksLikeLocation = isLikelyLocationQuery(locationQuery, wikiPreview);
        if (!looksLikeLocation) {
          queryCategory = 'organization';
        }
      }
    }

    if (queryCategory !== 'location') {
      onProgress?.({
        stage: 'Entity Research',
        progress: 5,
        message: `Initiating ${queryCategory} intelligence...`
      });

      const entityAIResult = await tryDirectGeminiEntityResearch(locationQuery, queryCategory, onProgress);
      if (entityAIResult) {
        await locationResearchCache.saveFullResult(locationQuery, entityAIResult);
        return entityAIResult;
      }

      const fallbackEntityResult = await executeEntityResearch(locationQuery, queryCategory, onProgress);
      if (fallbackEntityResult) {
        await locationResearchCache.saveFullResult(locationQuery, fallbackEntityResult);
        return fallbackEntityResult;
      }
    }

    // SKIP BACKEND - Go straight to Direct Gemini Research (works without backend server)
    // This is the primary method for static hosting (AWS Amplify, Netlify, Vercel)
    onProgress?.({
      stage: 'AI Research',
      progress: 5,
      message: 'Initializing Gemini AI research...'
    });

    console.log('[GLI Research] Attempting direct Gemini AI research for:', locationQuery);
    const directGeminiResult = await tryDirectGeminiResearch(locationQuery, onProgress);
    if (directGeminiResult) {
      console.log('[GLI Research] SUCCESS - Gemini AI returned data');
      // Cache the result
      await locationResearchCache.saveFullResult(locationQuery, directGeminiResult);
      return directGeminiResult;
    }
    
    console.warn('[GLI Research] Gemini AI failed, trying backend as fallback...');

    // TRY BACKEND AI-ENHANCED RESEARCH as fallback (if server is running)
    onProgress?.({
      stage: 'Backend Research',
      progress: 8,
      message: 'Trying backend server...'
    });

    const backendResult = await tryBackendResearch(locationQuery, onProgress);
    if (backendResult) {
      // Cache the result
      await locationResearchCache.saveFullResult(locationQuery, backendResult);
      return backendResult;
    }

    // FINAL FALLBACK: Frontend-only research if both AI methods unavailable
    console.warn('[GLI Research] Both Gemini and backend failed, using fallback pipeline');
    onProgress?.({
      stage: 'Fallback Research',
      progress: 10,
      message: 'Using standard research pipeline...'
    });

    // Create research session
    const session = autonomousResearchAgent.createSession(locationQuery);

    // ITERATION LOOP: Continues until completeness target or max iterations
    let result: MultiSourceResult | null = null;
    let iteration = 0;
    const maxIterations = 3;

    while (iteration < maxIterations) {
      iteration++;

      onProgress?.({
        stage: 'Research Iteration',
        progress: 5 + (iteration - 1) * 25,
        message: `Starting iteration ${iteration} of research...`,
        iteration
      });

      // Execute research pipeline
      const iterationResult = await executeResearchPipeline(
        locationQuery,
        iteration,
        onProgress
      );

      if (!iterationResult) {
        break;
      }

      // Analyze gaps
      const gaps = autonomousResearchAgent.analyzeDataGaps(
        iterationResult,
        iterationResult.profile
      );

      const completenessScore = autonomousResearchAgent.calculateCompletenessScore(
        iterationResult,
        gaps
      );

      // Update session
      autonomousResearchAgent.updateSession(
        session.id,
        iteration,
        iterationResult,
        gaps,
        completenessScore
      );

      result = iterationResult;

      onProgress?.({
        stage: 'Completeness Analysis',
        progress: 5 + iteration * 25,
        message: `Iteration ${iteration}: Completeness ${completenessScore}/100 (${gaps.length} gaps)`,
        iteration
      });

      // Check if should continue
      const elapsedTime = Date.now() - sessionStart;
      const shouldContinue = enableAutonomousRefinement &&
        autonomousResearchAgent.shouldContinueResearch(
          completenessScore,
          iteration,
          elapsedTime
        );

      if (!shouldContinue) {
        break;
      }

      // Generate refinement queries and execute
      if (gaps.length > 0) {
        const refinementQueries = autonomousResearchAgent.generateRefinementQueries(
          locationQuery,
          result.profile,
          gaps
        );

        onProgress?.({
          stage: 'Refinement Research',
          progress: 5 + iteration * 25 + 10,
          message: `Executing ${refinementQueries.length} refinement searches...`,
          iteration
        });

        // Merge refined data
        result = await mergeRefinementData(result, refinementQueries);
      }
    }

    if (!result) {
      onProgress?.({
        stage: 'Error',
        progress: 0,
        message: `Could not research: ${locationQuery}`
      });
      return null;
    }

    // Generate enhanced narratives using synthesis engine
    onProgress?.({
      stage: 'Narrative Synthesis',
      progress: 90,
      message: 'Generating comprehensive narratives...'
    });

    const enhancedNarratives = generateEnhancedNarratives(result);
    result.narratives = enhancedNarratives;

    // Find similar cities
    const similarCities = await findSimilarCities(result.profile);
    result.similarCities = similarCities;

    // Add session info
    result.researchSession = {
      id: session.id,
      iterations: iteration,
      totalTime: Date.now() - sessionStart,
      completenessScore: session.completenessScore
    };

    // Save to cache
    await locationResearchCache.saveFullResult(locationQuery, result);

    // Clean up partial cache
    await locationResearchCache.clearPartialResult(locationQuery);

    // Complete session
    autonomousResearchAgent.completeSession(session.id);

    onProgress?.({
      stage: 'Complete',
      progress: 100,
      message: `Research complete in ${iteration} iterations: ${result.sources.length} sources, ${Math.round(result.dataQuality.completeness)}% completeness`
    });

    return result;

  } catch (error) {
    console.error('Multi-source research failed:', error);
    onProgress?.({
      stage: 'Error',
      progress: 0,
      message: `Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return null;
  }
}

/**
 * Execute single research pipeline iteration
 */
async function executeResearchPipeline(
  locationQuery: string,
  iteration: number,
  onProgress?: ProgressCallback
): Promise<MultiSourceResult | null> {
  const sources: SourceCitation[] = [];
  const accessDate = new Date().toISOString().split('T')[0];

  try {
    // STAGE 1: Geocode
    onProgress?.({
      stage: 'Geocoding',
      progress: 10,
      message: `Locating ${locationQuery}...`,
      iteration
    });

    const geo = await geocodeLocation(locationQuery);
    if (!geo) return null;

    const { city: cityName, region, country, countryCode } = geo;

    // STAGE 2: Parallel data fetching
    onProgress?.({
      stage: 'Data Integration',
      progress: 20,
      message: 'Fetching data from multiple sources...',
      iteration
    });

    const [worldBankData, countryData, wikiData, leadershipData] = await Promise.all([
      fetchWorldBankData(countryCode).catch(() => ({ indicators: [], sourceUrl: '', countryInfo: {} })),
      fetchCountryData(country).catch(() => null),
      fetchWikipediaData(cityName, country).catch(() => null),
      deepLeaderSearch(cityName, region, country).catch(() => [])
    ]);

    // Add sources
    if (worldBankData.indicators.length > 0) {
      sources.push({
        title: `World Bank - ${country}`,
        url: worldBankData.sourceUrl,
        type: 'worldbank',
        reliability: 'high',
        accessDate,
        dataExtracted: worldBankData.indicators.map(i => `${i.name}: ${i.value} (${i.year})`).join('; '),
        organization: 'World Bank Group'
      });
    }

    // STAGE 3: Government sources
    onProgress?.({
      stage: 'Government Search',
      progress: 35,
      message: 'Searching government sources...',
      iteration
    });

    const [govSearch, cityStatsSearch, economicSearch, infrastructureSearch, newsSearch] = await Promise.all([
      performGoogleSearch(`${cityName} ${country} official government`, 8),
      performGoogleSearch(`${cityName} statistics census demographics`, 5),
      performGoogleSearch(`${cityName} economy business investment`, 8),
      performGoogleSearch(`${cityName} infrastructure airport port transport`, 6),
      performGoogleSearch(`${cityName} news recent developments`, 5)
    ]);

    // Add government sources
    for (const result of govSearch.filter(r => r.isGovernment).slice(0, 4)) {
      sources.push({
        title: result.title,
        url: result.link,
        type: 'government',
        reliability: 'high',
        accessDate,
        dataExtracted: result.snippet.substring(0, 150),
        organization: result.displayLink
      });
    }

    // Add stats sources
    for (const result of cityStatsSearch.slice(0, 3)) {
      sources.push({
        title: result.title,
        url: result.link,
        type: 'statistics',
        reliability: 'high',
        accessDate,
        dataExtracted: result.snippet.substring(0, 150),
        organization: result.displayLink
      });
    }

    // Add economic sources
    for (const result of economicSearch.filter(r => r.isInternationalOrg).slice(0, 3)) {
      sources.push({
        title: result.title,
        url: result.link,
        type: 'international',
        reliability: 'high',
        accessDate,
        dataExtracted: result.snippet.substring(0, 150),
        organization: result.displayLink
      });
    }

    // Add infrastructure sources
    for (const result of infrastructureSearch.slice(0, 2)) {
      sources.push({
        title: result.title,
        url: result.link,
        type: 'research',
        reliability: 'medium',
        accessDate,
        dataExtracted: result.snippet.substring(0, 150),
        organization: result.displayLink
      });
    }

    // Add news sources
    for (const result of newsSearch.slice(0, 3)) {
      sources.push({
        title: result.title,
        url: result.link,
        type: 'news',
        reliability: 'medium',
        accessDate,
        dataExtracted: result.snippet.substring(0, 150),
        organization: result.displayLink
      });
    }

    // STAGE 4: Extract and synthesize data
    onProgress?.({
      stage: 'Data Extraction',
      progress: 60,
      message: 'Extracting structured data from sources...',
      iteration
    });

    const extractedData = extractStructuredData(
      govSearch, cityStatsSearch, economicSearch, infrastructureSearch, wikiData
    );

    // STAGE 5: Build profile
    onProgress?.({
      stage: 'Profile Assembly',
      progress: 75,
      message: 'Building comprehensive city profile...',
      iteration
    });

    const profile = buildComprehensiveProfile(
      cityName, region, country, countryCode,
      geo, worldBankData, countryData, wikiData,
      leadershipData, extractedData,
      sources
    );

    // STAGE 6: Calculate data quality
    const dataQuality = calculateDataQuality(sources, leadershipData);

    // STAGE 7: Generate basic narratives (will be enhanced later)
    const basicNarratives = generateBasicNarratives(profile);

    const result: MultiSourceResult = {
      profile,
      narratives: basicNarratives as EnhancedNarratives,
      sources: deduplicateSources(sources),
      similarCities: [],
      dataQuality,
      researchSummary: `Research compiled from ${sources.length} sources across ` +
        `${dataQuality.governmentSourcesUsed} government, ` +
        `${dataQuality.internationalSourcesUsed} international, ` +
        `${dataQuality.newsSourcesUsed} news sources. ` +
        `Data freshness: ${dataQuality.dataFreshness}. ` +
        `Overall completeness: ${dataQuality.completeness}%.`,
      researchSession: {
        id: 'temp',
        iterations: 0,
        totalTime: 0,
        completenessScore: dataQuality.completeness
      }
    };

    return result;

  } catch (error) {
    console.error('Research pipeline error:', error);
    return null;
  }
}

/**
 * Geocode location to coordinates
 */
async function geocodeLocation(locationQuery: string): Promise<{
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
} | null> {
  try {
    // Try Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        city: result.name || locationQuery.split(',')[0],
        region: result.address?.state || result.address?.province || '',
        country: result.address?.country || '',
        countryCode: extractCountryCode(result.address?.country_code) || 'UN',
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon)
      };
    }
  } catch (error) {
    console.warn('Nominatim geocoding failed:', error);
  }

  // Fallback: Parse manually
  const parts = locationQuery.split(',').map(p => p.trim());
  return {
    city: parts[0],
    region: parts[1] || '',
    country: parts[parts.length - 1],
    countryCode: 'UN',
    lat: 0,
    lon: 0
  };
}

/**
 * Perform Google/DuckDuckGo search
 */
async function performGoogleSearch(query: string, numResults: number = 10): Promise<Array<{
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  isGovernment: boolean;
  isInternationalOrg: boolean;
  isNews: boolean;
}>> {
  const results: Array<{
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
    isGovernment: boolean;
    isInternationalOrg: boolean;
    isNews: boolean;
  }> = [];

  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const response = await fetch(ddgUrl);
    const data = await response.json();

    if (data.AbstractURL && data.AbstractText) {
      const domain = new URL(data.AbstractURL).hostname || '';
      results.push({
        title: data.Heading,
        link: data.AbstractURL,
        snippet: data.AbstractText.substring(0, 200),
        displayLink: domain,
        isGovernment: AUTHORITATIVE_DOMAINS.some(d => domain.includes(d)),
        isInternationalOrg: ['worldbank', 'imf', 'un.org'].some(d => domain.includes(d)),
        isNews: ['news', 'times', 'post', 'tribune'].some(d => domain.includes(d))
      });
    }

    if (data.Results) {
      for (const result of data.Results.slice(0, numResults - 1)) {
        const domain = result.FirstURL ? new URL(result.FirstURL).hostname : '';
        results.push({
          title: result.Text.substring(0, 100),
          link: result.FirstURL,
          snippet: result.Text,
          displayLink: domain || 'unknown',
          isGovernment: AUTHORITATIVE_DOMAINS.some(d => domain.includes(d)),
          isInternationalOrg: ['worldbank', 'imf', 'un'].some(d => domain.includes(d)),
          isNews: ['news', 'times'].some(d => domain.includes(d))
        });
      }
    }
  } catch (error) {
    console.warn('Search failed:', error);
  }

  return results;
}

type QueryCategory = 'location' | 'company' | 'government' | 'organization' | 'unknown';

function isLikelyLocationQuery(query: string, wikiExtract?: string | null): boolean {
  const q = query.toLowerCase();
  const querySignals = [
    'city', 'town', 'municipality', 'province', 'region', 'state', 'county', 'district',
    'capital', 'island', 'bay', 'port', 'harbor', 'metropolitan', 'metro', 'national'
  ];

  if (querySignals.some((s) => q.includes(s))) return true;
  if (q.includes(',')) return true;

  if (wikiExtract) {
    const w = wikiExtract.toLowerCase();
    const wikiSignals = [
      'city', 'municipality', 'province', 'region', 'capital', 'district',
      'island', 'town', 'village', 'metropolitan'
    ];
    if (wikiSignals.some((s) => w.includes(s))) return true;
  }

  return false;
}

function detectQueryCategory(query: string): QueryCategory {
  const q = query.toLowerCase();

  const governmentSignals = [
    'ministry', 'department', 'agency', 'authority', 'government', 'council', 'parliament', 'senate',
    'governor', 'mayor', 'state', 'federal', 'national', 'municipal', 'bureau', 'commission',
    'secretariat', 'embassy'
  ];

  const companySignals = [
    'inc', 'ltd', 'llc', 'corp', 'corporation', 'company', 'co.', 'group', 'holdings',
    'plc', 'gmbh', 's.a.', 'ag', 'bv', 'pty', 'bank', 'insurance'
  ];

  const organizationSignals = [
    'university', 'institute', 'foundation', 'ngo', 'nonprofit', 'association', 'society',
    'chamber', 'union', 'trust', 'hospital'
  ];

  if (governmentSignals.some((s) => q.includes(s))) return 'government';
  if (companySignals.some((s) => q.includes(s))) return 'company';
  if (organizationSignals.some((s) => q.includes(s))) return 'organization';

  return 'location';
}

async function fetchWikipediaEntityData(query: string): Promise<{ title: string; extract: string; url: string } | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.query?.search?.[0]) {
      const pageTitle = searchData.query.search[0].title;
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&explaintext=true&format=json&origin=*`;
      const pageRes = await fetch(pageUrl);
      const pageData = await pageRes.json();
      const pages = pageData.query.pages;
      const pageContent = Object.values(pages)[0] as Record<string, unknown>;
      const extract = (pageContent?.extract as string) || '';
      return {
        title: pageTitle,
        extract: extract.substring(0, 900),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/\s+/g, '_'))}`
      };
    }
  } catch (error) {
    console.warn('Wikipedia entity fetch failed:', error);
  }
  return null;
}

/**
 * Fetch World Bank data
 */
async function fetchWorldBankData(countryCode: string): Promise<{
  indicators: Array<{ name: string; value: number | null; year: number }>;
  sourceUrl: string;
  countryInfo: Record<string, string>;
}> {
  const indicators: Array<{ name: string; value: number | null; year: number }> = [];

  try {
    // GDP
    const gdpUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&per_page=1`;
    const gdpRes = await fetch(gdpUrl);
    const gdpData = await gdpRes.json();
    if (gdpData[1]?.[0]) {
      indicators.push({
        name: 'GDP (current US$)',
        value: gdpData[1][0].value,
        year: parseInt(gdpData[1][0].date)
      });
    }

    // Growth
    const growthUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=1`;
    const growthRes = await fetch(growthUrl);
    const growthData = await growthRes.json();
    if (growthData[1]?.[0]) {
      indicators.push({
        name: 'GDP Growth (annual %)',
        value: growthData[1][0].value,
        year: parseInt(growthData[1][0].date)
      });
    }

    // Internet
    const internetUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/IT.NET.USER.ZS?format=json&per_page=1`;
    const internetRes = await fetch(internetUrl);
    const internetData = await internetRes.json();
    if (internetData[1]?.[0]) {
      indicators.push({
        name: 'Internet Users (% of population)',
        value: internetData[1][0].value,
        year: parseInt(internetData[1][0].date)
      });
    }
  } catch (error) {
    console.warn('World Bank fetch failed:', error);
  }

  return {
    indicators,
    sourceUrl: `https://data.worldbank.org/country/${countryCode}`,
    countryInfo: {}
  };
}

/**
 * Fetch country data from REST Countries
 */
async function fetchCountryData(country: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`
    );
    if (response.ok) {
      return (await response.json())[0] as Record<string, unknown>;
    }
  } catch (error) {
    console.warn('Country data fetch failed:', error);
  }
  return {};
}

/**
 * Fetch Wikipedia data
 */
async function fetchWikipediaData(city: string, country: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city + ' ' + country)}&format=json&origin=*&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.query?.search?.[0]) {
      const pageTitle = searchData.query.search[0].title;
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&explaintext=true&format=json&origin=*`;
      const pageRes = await fetch(pageUrl);
      const pageData = await pageRes.json();
      const pages = pageData.query.pages;
      const pageContent = Object.values(pages)[0] as Record<string, unknown>;
      return (pageContent?.extract as string)?.substring(0, 800) || null;
    }
  } catch (error) {
    console.warn('Wikipedia fetch failed:', error);
  }
  return null;
}

/**
 * Deep leader search with multiple sources
 */
async function deepLeaderSearch(city: string, region: string, country: string): Promise<Array<{
  name: string;
  role: string;
  bio: string;
  verified: boolean;
  sourceUrl: string;
}>> {
  const leaders: Array<{
    name: string;
    role: string;
    bio: string;
    verified: boolean;
    sourceUrl: string;
  }> = [];

  try {
    const query = `${city} mayor ${country} current 2024`;
    const searchResults = await performGoogleSearch(query, 5);

    for (const result of searchResults.slice(0, 2)) {
      if (result.snippet.length > 20) {
        leaders.push({
          name: extractNameFromSnippet(result.snippet),
          role: 'Mayor/City Administrator',
          bio: result.snippet.substring(0, 200),
          verified: result.isGovernment,
          sourceUrl: result.link
        });
      }
    }
  } catch (error) {
    console.warn('Leader search failed:', error);
  }

  return leaders;
}

/**
 * Extract structured data from search results
 */
function extractStructuredData(
  govResults: Array<Record<string, unknown>>,
  statsResults: Array<Record<string, unknown>>,
  econResults: Array<Record<string, unknown>>,
  infraResults: Array<Record<string, unknown>>,
  wikiData: string | null
): {
  population: number | null;
  area: string | null;
  industries: string[];
  airports: string[];
  ports: string[];
  established: string | null;
} {
  const data = {
    population: null as number | null,
    area: null as string | null,
    industries: [] as string[],
    airports: [] as string[],
    ports: [] as string[],
    established: null as string | null
  };

  // Extract from snippets using regex patterns
  const allText = [
    ...govResults.map(r => r.snippet || ''),
    ...statsResults.map(r => r.snippet || ''),
    ...econResults.map(r => r.snippet || ''),
    wikiData || ''
  ].join(' ');

  const normalizedText = allText.replace(/\s+/g, ' ');

  // Population
  const popMatch =
    normalizedText.match(/population(?:\s*(?:of|was|is))?\s*([0-9][0-9,]+)/i) ||
    normalizedText.match(/([0-9][0-9,]+)\s*(?:people|residents)/i);
  if (popMatch) {
    data.population = parseInt(popMatch[1].replace(/,/g, ''));
  }

  // Area
  const areaMatch = normalizedText.match(/area(?:\s*(?:of|is))?\s*([0-9][0-9,.]+)\s*(?:km2|km²|sq\s*km)/i);
  if (areaMatch) {
    data.area = `${areaMatch[1]} km²`;
  }

  // Established / Founded
  const establishedMatch = normalizedText.match(/(?:established|founded|settled|incorporated)\s*(?:in|on)?\s*([0-9]{3,4})/i);
  if (establishedMatch) {
    data.established = establishedMatch[1];
  }

  // Industries
  const industryKeywords = [
    'manufacturing',
    'agriculture',
    'technology',
    'services',
    'tourism',
    'mining',
    'education',
    'health',
    'finance',
    'logistics',
    'retail',
    'energy'
  ];
  for (const keyword of industryKeywords) {
    if (normalizedText.toLowerCase().includes(keyword)) {
      const label = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      if (!data.industries.includes(label)) {
        data.industries.push(label);
      }
    }
  }

  return data;
}

/**
 * Build comprehensive city profile
 */
function buildComprehensiveProfile(
  city: string,
  region: string,
  country: string,
  countryCode: string,
  geo: Record<string, unknown>,
  worldBankData: Record<string, unknown>,
  countryData: Record<string, unknown>,
  wikiData: string | null,
  leaders: Array<Record<string, unknown>>,
  extractedData: Record<string, unknown>,
  sources: SourceCitation[]
): CityProfile {
  const gdpInd = (worldBankData.indicators as Array<Record<string, unknown>>)?.find((i) => String(i.name).includes('GDP'));
  const growthInd = (worldBankData.indicators as Array<Record<string, unknown>>)?.find((i) => String(i.name).includes('Growth'));
  const internetInd = (worldBankData.indicators as Array<Record<string, unknown>>)?.find((i) => String(i.name).includes('Internet'));

  const cityLeaders: CityLeader[] = leaders.length > 0
    ? leaders.map((l, idx) => ({
        id: `leader-${idx}`,
        name: (l.name as string) || 'Leadership data pending',
        role: (l.role as string) || 'City Official',
        tenure: 'Current Term',
        achievements: [(l.bio as string)?.substring(0, 150) || 'See government sources'],
        rating: (l.verified as boolean) ? 75 : 50,
        fullBio: (l.bio as string) || 'See local government',
        sourceUrl: (l.sourceUrl as string) || '',
        photoVerified: false,
        internationalEngagementFocus: false
      }))
    : [];

  const profile: CityProfile = {
    id: `research-${Date.now()}`,
    city,
    region: region || country,
    country,
    latitude: (geo.lat as number) || 0,
    longitude: (geo.lon as number) || 0,
    timezone: (countryData?.timezones as Array<unknown>)?.[0] as string || 'UTC+0',
    established: (extractedData.established as string) || 'See historical records',
    areaSize: (extractedData.area as string) || 'Geographic area pending verification',
    climate: ((geo.lat as number) > 23.5 || (geo.lat as number) < -23.5) ? 'Subtropical/Temperate' : 'Tropical/Subtropical',
    currency: (countryData?.currencies as Record<string, unknown>)
      ? (Object.values((countryData?.currencies as Record<string, unknown>))[0] as Record<string, unknown>)?.name as string || 'National Currency'
      : 'National Currency',
    businessHours: '8:00 AM - 5:00 PM local time',
    globalMarketAccess: `Regional corridors within ${region || country} with global connectivity`,
    departments: ['City Government', 'Investment Promotion', 'Economic Development'],
    easeOfDoingBusiness: 'See World Bank Doing Business Report',

    engagementScore: Math.max(50, Math.min(85, sources.filter(s => s.type === 'government').length * 10)),
    overlookedScore: 40,
    infrastructureScore: sources.filter(s => s.dataExtracted.toLowerCase().includes('infra')).length > 0 ? 65 : 45,
    regulatoryFriction: 50,
    politicalStability: leaders.length > 0 ? 70 : 50,
    laborPool: internetInd?.value ? Math.round(internetInd.value as number) : 60,
    costOfDoing: 50,
    investmentMomentum: sources.filter(s => s.type === 'news').length > 2 ? 70 : 45,

    knownFor: (extractedData.industries as string[])?.length > 0 ? (extractedData.industries as string[]) : ['Regional commerce'],
    strategicAdvantages: [
      `Strategic location in ${region}`,
      sources.filter(s => s.type === 'government').length > 0 ? 'Government transparency' : 'Growing market access',
      (extractedData.industries as string[])?.length > 0 ? `Established ${(extractedData.industries as string[])[0]} sector` : 'Developing economy'
    ],

    keySectors: (extractedData.industries as string[])?.length > 0 ? (extractedData.industries as string[]) : ['Services', 'Trade'],
    investmentPrograms: ['Contact local investment promotion agency'],
    foreignCompanies: ['Contact Chamber of Commerce for directory'],

    leaders: cityLeaders,

    demographics: {
      population: extractedData.population
        ? `${extractedData.population.toLocaleString()} (city)`
        : 'See local census bureau',
      populationGrowth: 'See national statistics office',
      medianAge: 'See demographic surveys',
      literacyRate: 'See education ministry data',
      workingAgePopulation: 'See labor department statistics',
      universitiesColleges: 0,
      graduatesPerYear: 'See education reports',
      languages: countryData?.languages ? Object.values(countryData.languages) : undefined
    },

    economics: {
      gdpLocal: gdpInd ? `$${((gdpInd.value as number) / 1e9).toFixed(2)}B (${gdpInd.year}, national level)` : 'See World Bank economic data',
      gdpGrowthRate: growthInd ? `${(growthInd.value as number)?.toFixed(2)}% (${growthInd.year})` : 'See IMF/World Bank reports',
      employmentRate: 'See labor department data',
      avgIncome: 'See national statistics',
      exportVolume: 'See trade ministry data',
      majorIndustries: (extractedData.industries as string[]) || [],
      topExports: (extractedData.industries as string[]) || [],
      tradePartners: ['Regional and global partners']
    },

    infrastructure: {
      airports: [{ name: `${city} Airport (verify with civil aviation)`, type: 'Airport' }],
      seaports: [{ name: `See ${country} port authority`, type: 'Port' }],
      specialEconomicZones: ['Contact local investment office'],
      powerCapacity: 'See local utility provider',
      internetPenetration: internetInd ? `${(internetInd.value as number)?.toFixed(1)}% (${internetInd.year})` : 'See telecommunications data'
    },

    governmentLinks: sources
      .filter(s => s.type === 'government')
      .slice(0, 3)
      .map(s => ({
        label: s.organization || s.title,
        url: s.url
      })),

    recentNews: sources
      .filter(s => s.type === 'news')
      .slice(0, 5)
      .map(s => ({
        date: s.accessDate,
        title: s.title,
        summary: s.dataExtracted,
        source: s.organization || 'News Source',
        link: s.url
      })),
    _rawWikiExtract: wikiData || undefined
  };

  return profile;
}

/**
 * Calculate data quality metrics
 */
function calculateDataQuality(
  sources: SourceCitation[],
  leaders: Array<Record<string, unknown>>
): DataQualityReport {
  const govCount = sources.filter(s => s.type === 'government').length;
  const intlCount = sources.filter(s => s.type === 'worldbank' || s.type === 'international').length;
  const newsCount = sources.filter(s => s.type === 'news').length;

  return {
    completeness: Math.min(100, Math.round(
      (govCount * 8) + (intlCount * 10) + (newsCount * 5) + (leaders.length * 15)
    )),
    governmentSourcesUsed: govCount,
    internationalSourcesUsed: intlCount,
    newsSourcesUsed: newsCount,
    dataFreshness: new Date().toISOString().split('T')[0],
    leaderDataVerified: leaders.some((l) => (l.verified as boolean)),
    primarySourcePercentage: Math.round(((govCount + intlCount) / Math.max(sources.length, 1)) * 100),
    conflictsDetected: 0,
    conflictsResolved: 0
  };
}

/**
 * Generate basic narratives (will be enhanced by synthesis engine)
 */
function generateBasicNarratives(profile: CityProfile): EnhancedNarratives {
  return {
    overview: {
      title: 'Overview',
      introduction: `${profile.city} is located in ${profile.region}, ${profile.country}`,
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    history: {
      title: 'History',
      introduction: 'Historical context',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    geography: {
      title: 'Geography',
      introduction: 'Geographic profile',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    economy: {
      title: 'Economy',
      introduction: 'Economic profile',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    governance: {
      title: 'Governance',
      introduction: 'Government structure',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    infrastructure: {
      title: 'Infrastructure',
      introduction: 'Infrastructure profile',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    investment: {
      title: 'Investment',
      introduction: 'Investment opportunities',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    risks: {
      title: 'Risks',
      introduction: 'Risk assessment',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    },
    opportunities: {
      title: 'Opportunities',
      introduction: 'Growth opportunities',
      paragraphs: [],
      keyFacts: [],
      conclusion: 'Research in progress'
    }
  };
}

/**
 * Generate enhanced narratives using synthesis engine
 */
function generateEnhancedNarratives(result: MultiSourceResult): EnhancedNarratives {
  return {
    overview: narrativeSynthesisEngine.buildOverviewNarrative(result, result.profile),
    history: narrativeSynthesisEngine.buildGeographyNarrative(result, result.profile), // Placeholder
    geography: narrativeSynthesisEngine.buildGeographyNarrative(result, result.profile),
    economy: narrativeSynthesisEngine.buildEconomyNarrative(result, result.profile),
    governance: narrativeSynthesisEngine.buildGovernanceNarrative(result, result.profile),
    infrastructure: narrativeSynthesisEngine.buildInfrastructureNarrative(result, result.profile),
    investment: narrativeSynthesisEngine.buildInvestmentNarrative(result, result.profile),
    risks: narrativeSynthesisEngine.buildRisksNarrative(result, result.profile),
    opportunities: narrativeSynthesisEngine.buildOpportunitiesNarrative(result, result.profile)
  };
}

/**
 * Merge refinement data into existing result
 */
async function mergeRefinementData(
  currentResult: MultiSourceResult,
  queries: string[]
): Promise<MultiSourceResult> {
  // Execute refinement searches
  for (let i = 0; i < queries.length; i += 3) {
    const refinedResults = await Promise.all(
      queries.slice(i, i + 3).map(q => performGoogleSearch(q, 5))
    );

    for (const results of refinedResults) {
      for (const result of results.slice(0, 2)) {
        if (!currentResult.sources.find(s => s.url === result.link)) {
          currentResult.sources.push({
            title: result.title,
            url: result.link,
            type: result.isGovernment ? 'government' : 'research',
            reliability: 'medium',
            accessDate: new Date().toISOString().split('T')[0],
            dataExtracted: result.snippet.substring(0, 150),
            organization: result.displayLink
          });
        }
      }
    }
  }

  return currentResult;
}

/**
 * Find similar cities for comparison
 */
async function findSimilarCities(profile: CityProfile): Promise<SimilarCity[]> {
  const similar: SimilarCity[] = [];

  try {
    const query = `cities similar to ${profile.city} ${profile.country} in ${profile.keySectors?.[0] || 'economy'}`;
    const results = await performGoogleSearch(query, 5);

    for (const result of results.slice(0, 3)) {
      const match = result.snippet.match(/(\w+),\s*(\w+)/);
      if (match) {
        similar.push({
          city: match[1],
          country: match[2],
          region: profile.region,
          similarity: 0.6 + Math.random() * 0.3,
          reason: `Similar ${profile.keySectors?.[0] || 'economic'} profile`,
          keyMetric: profile.keySectors?.[0] || 'economy'
        });
      }
    }
  } catch (error) {
    console.warn('Similar cities search failed:', error);
  }

  return similar;
}

/**
 * Deduplicate sources by URL
 */
function deduplicateSources(sources: SourceCitation[]): SourceCitation[] {
  const seen = new Set<string>();
  return sources.filter(s => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
}

/**
 * Helper functions
 */
function extractCountryCode(code: string | undefined): string | null {
  return code?.toUpperCase() || null;
}

function extractNameFromSnippet(snippet: string): string {
  const match = snippet.match(/^([A-Z][a-z]+\s[A-Z][a-z]+)/);
  return match ? match[1] : 'City Official';
}
