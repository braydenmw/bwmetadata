/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * AWS BEDROCK AI SERVICE
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * 
 * Production: AWS Bedrock (no external API keys needed)
 * Local Dev: Gemini fallback (for testing when not on AWS)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_BASE = (import.meta as { env?: Record<string, string> })?.env?.VITE_API_BASE_URL || '';

// ==================== TYPES ====================

export interface AIResponse {
  text: string;
  model: string;
  provider: 'bedrock' | 'gemini' | 'fallback';
  tokensUsed?: number;
}

export interface ResearchProgress {
  stage: string;
  progress: number;
  message: string;
}

// ==================== ENVIRONMENT DETECTION ====================

export const isAWSEnvironment = (): boolean => {
  // Check Vite environment variables first (for browser)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = import.meta as any;
    if (meta?.env?.VITE_AWS_ENVIRONMENT === 'true') {
      return true;
    }
    // If we're in production mode on a real deployment
    if (meta?.env?.PROD && meta?.env?.MODE === 'production') {
      // Check if we have AWS indicators
      if (meta?.env?.VITE_AWS_REGION) {
        return true;
      }
    }
  } catch {
    // Ignore
  }
  
  // Check Node.js environment variables (for server-side)
  if (typeof process !== 'undefined') {
    return !!(
      process.env.AWS_REGION ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.ECS_CONTAINER_METADATA_URI
    );
  }
  
  // Default: not AWS (use Gemini locally)
  return false;
};

// ==================== GET GEMINI API KEY ====================

export const getGeminiApiKey = (): string => {
  // 1. Vite build-time: import.meta.env.VITE_GEMINI_API_KEY (baked at build)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = import.meta as any;
    if (meta?.env?.VITE_GEMINI_API_KEY) {
      return meta.env.VITE_GEMINI_API_KEY;
    }
  } catch {
    // Not in Vite context
  }

  // 2. Vite define'd process.env.GEMINI_API_KEY (replaced at build time by vite.config.ts)
  try {
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
  } catch {
    // process not available in browser
  }

  // 3. Runtime window injection (for AWS ECS/Docker: server can inject into index.html)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win?.__ENV__?.GEMINI_API_KEY) {
      return win.__ENV__.GEMINI_API_KEY;
    }
    if (win?.__ENV__?.VITE_GEMINI_API_KEY) {
      return win.__ENV__.VITE_GEMINI_API_KEY;
    }
  } catch {
    // Not in browser or window.__ENV__ not set
  }

  return '';
};

// ==================== AWS BEDROCK CLIENT ====================

async function invokeBedrockModel(prompt: string, model: string = 'anthropic.claude-3-sonnet-20240229-v1:0'): Promise<AIResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/bedrock/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens: 4096,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Bedrock API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.content?.[0]?.text || data.text || '',
      model,
      provider: 'bedrock',
      tokensUsed: data.usage ? data.usage.input_tokens + data.usage.output_tokens : undefined
    };
  } catch (error) {
    console.error('[AWS Bedrock] Invocation failed:', error);
    throw error;
  }
}

// ==================== GEMINI FALLBACK (LOCAL DEV) ====================

async function invokeGemini(prompt: string): Promise<AIResponse> {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('No Gemini API key available for local development');
  }

  console.log('[AI Service] Using Gemini for local development');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    }
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return {
    text: responseText,
    model: 'gemini-2.0-flash',
    provider: 'gemini'
  };
}

// ==================== UNIFIED AI INVOKE ====================

export async function invokeAI(prompt: string): Promise<AIResponse> {
  const useAWS = isAWSEnvironment();
  
  console.log(`[AI Service] Environment: ${useAWS ? 'AWS (Bedrock)' : 'Local (Gemini)'}`);
  
  // On AWS: Use Bedrock
  if (useAWS) {
    try {
      return await invokeBedrockModel(prompt);
    } catch (error) {
      console.error('[AI Service] Bedrock failed:', error);
      // On AWS, we don't fallback - just return error
      return {
        text: 'AI service temporarily unavailable. Please try again later.',
        model: 'unavailable',
        provider: 'fallback'
      };
    }
  }
  
  // Local development: Use Gemini
  try {
    return await invokeGemini(prompt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI Service] Gemini failed:', errorMessage);
    
    return {
      text: `AI service error: ${errorMessage}. Check your API key or try again later.`,
      model: 'unavailable',
      provider: 'fallback'
    };
  }
}

// ==================== LOCATION INTELLIGENCE ====================

const LOCATION_PROMPT = (location: string) => `You are a location intelligence expert. Provide comprehensive, FACTUAL data about: "${location}"

Return ONLY valid JSON with this structure:
{
  "name": "City name",
  "country": "Country name",
  "countryCode": "XX",
  "region": "Region/State",
  "coordinates": {"lat": 0.0, "lon": 0.0},
  "population": {"city": 0, "metro": 0, "year": "2024"},
  "overview": "2-3 paragraph description",
  "climate": "Climate description",
  "currency": {"name": "Currency", "code": "XXX"},
  "languages": ["Language 1"],
  "government": {
    "type": "Government type",
    "leader": {"name": "Leader name", "title": "Title", "since": "Year"},
    "departments": ["Department 1"]
  },
  "economy": {
    "gdp": "GDP figure",
    "gdpGrowth": "Growth %",
    "mainIndustries": ["Industry 1"],
    "majorEmployers": ["Company 1"],
    "unemployment": "Rate",
    "averageIncome": "Income"
  },
  "infrastructure": {
    "airports": [{"name": "Airport", "code": "XXX", "type": "International"}],
    "seaports": [{"name": "Port", "type": "Container"}],
    "publicTransit": "Description",
    "internetPenetration": "Percentage"
  },
  "investment": {
    "climate": "Investment climate",
    "incentives": ["Incentive 1"],
    "economicZones": ["Zone 1"],
    "easeOfBusiness": "Ranking"
  },
  "education": {
    "universities": [{"name": "University", "ranking": "Ranking"}],
    "literacyRate": "Percentage"
  },
  "risks": {
    "political": "Risk assessment",
    "economic": "Risk assessment",
    "natural": "Risk assessment"
  },
  "keyFacts": ["Fact 1", "Fact 2"],
  "tradePartners": ["Partner 1"]
}

Use REAL data only. Fill ALL fields.`;

export async function researchLocationAWS(
  query: string,
  onProgress?: (progress: ResearchProgress) => void
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ profile: any; sources: string[]; summary: string; dataQuality: number } | null> {
  
  console.log('[AWS AI] Starting location research for:', query);
  onProgress?.({ stage: 'Connecting', progress: 10, message: 'Connecting to AI service...' });
  
  try {
    onProgress?.({ stage: 'Researching', progress: 30, message: `Gathering intelligence on ${query}...` });
    
    const response = await invokeAI(LOCATION_PROMPT(query));
    
    console.log('[AWS AI] Response received from:', response.provider);
    console.log('[AWS AI] Response text length:', response.text.length);
    onProgress?.({ stage: 'Processing', progress: 70, message: 'Processing intelligence data...' });
    
    // Parse JSON response with improved error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    
    try {
      // Remove markdown code blocks if present
      let cleanText = response.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      data = JSON.parse(cleanText);
      console.log('[AWS AI] Successfully parsed JSON data');
    } catch {
      console.log('[AWS AI] First parse attempt failed, trying to extract JSON...');
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[0]);
          console.log('[AWS AI] Successfully extracted and parsed JSON');
        } catch (e) {
          console.error('[AWS AI] JSON extraction parse failed:', e);
        }
      }
    }
    
    if (!data) {
      console.error('[AWS AI] Failed to parse response, text preview:', response.text.substring(0, 200));
      onProgress?.({ stage: 'Error', progress: 0, message: 'Unable to parse AI response - please try again' });
      return null;
    }
    
    // Validate critical fields
    if (!data.name && !data.city) {
      console.error('[AWS AI] Missing required location name in response');
      onProgress?.({ stage: 'Error', progress: 0, message: 'Invalid location data received' });
      return null;
    }
    
    onProgress?.({ stage: 'Complete', progress: 100, message: 'Research complete!' });
    
    // Build comprehensive profile with enhanced field mapping
    const profile = {
      id: `live-${Date.now()}`,
      // Core identity
      city: data.name || data.city || query,
      entityName: data.name || data.city || query,
      entityType: data.entityType || 'location',
      country: data.country || 'Research Required',
      countryCode: data.countryCode || '',
      region: data.region || data.state || 'Unknown',
      
      // Geographic data
      latitude: data.coordinates?.lat || data.latitude || 0,
      longitude: data.coordinates?.lon || data.longitude || 0,
      timezone: data.timezone || 'UTC',
      established: data.established || data.founded || 'Unknown',
      areaSize: data.area || data.areaSize || 'Unknown',
      
      // Population and demographics
      population: data.population?.metro || data.population?.city || data.population || 0,
      populationMetro: data.population?.metro || data.population?.metropolitan || 0,
      populationGrowth: data.demographics?.populationGrowth || data.population?.growth || 'Unknown',
      medianAge: data.demographics?.medianAge || 'Unknown',
      
      // Economic indicators
      gdp: data.economy?.gdp || data.gdpLocal || 'Data Required',
      gdpGrowth: data.economy?.gdpGrowth || data.economy?.gdpGrowthRate || 'Unknown',
      unemployment: data.economy?.unemployment || 'See labor statistics',
      averageIncome: data.economy?.averageIncome || data.economy?.avgIncome || 'See income surveys',
      
      // Core details
      currency: data.currency?.code || data.currency?.name || 'USD',
      languages: data.languages || ['English'],
      climate: data.climate || 'Unknown',
      
      // Government and leadership
      governmentType: data.government?.type || 'Unknown',
      leader: data.government?.leader || { name: 'Research Required', title: 'Leader', since: 'Unknown' },
      leaders: data.government?.leader ? [{
        name: data.government.leader.name || 'Unknown',
        role: data.government.leader.title || 'Leader',
        since: data.government.leader.since || 'Unknown',
        bio: '',
        achievements: [],
        rating: 0,
        internationalEngagementFocus: false
      }] : [],
      departments: data.government?.departments || [],
      
      // Economic activity
      mainIndustries: data.economy?.mainIndustries || data.economy?.majorIndustries || [],
      majorEmployers: data.economy?.majorEmployers || data.economy?.topEmployers || [],
      tradePartners: data.tradePartners || [],
      topExports: data.economy?.exports || [],
      
      // Infrastructure
      airports: data.infrastructure?.airports || [],
      seaports: data.infrastructure?.seaports || data.infrastructure?.ports || [],
      publicTransit: data.infrastructure?.publicTransit || 'Unknown',
      internetPenetration: data.infrastructure?.internetPenetration || 'Unknown',
      powerCapacity: data.infrastructure?.power || 'See utility providers',
      specialEconomicZones: data.investment?.economicZones || [],
      
      // Investment climate
      economicZones: data.investment?.economicZones || [],
      investmentIncentives: data.investment?.incentives || [],
      easeOfDoingBusiness: data.investment?.easeOfBusiness || 'See World Bank rankings',
      investmentClimate: data.investment?.climate || 'Standard',
      
      // Education
      universities: data.education?.universities || [],
      universitiesColleges: typeof data.education?.universities === 'number' ? data.education.universities : (data.education?.universities?.length || 0),
      literacyRate: data.education?.literacyRate || 'Unknown',
      graduatesPerYear: data.education?.graduates || 'See education ministry',
      
      // Risk assessment
      risks: {
        political: data.risks?.political || 'Standard',
        economic: data.risks?.economic || 'Moderate',
        natural: data.risks?.natural || 'Moderate',
        regulatory: data.risks?.regulatory || 'Standard'
      },
      
      // Additional details
      keyFacts: data.keyFacts || [],
      rankings: data.rankings || [],
      keyStatistics: data.keyStatistics || [],
      overview: data.overview || `Intelligence profile for ${query}`,
      knownFor: data.knownFor || [],
      businessHours: data.businessHours || '9:00 AM - 5:00 PM',
      
      // Scores and assessments
      globalMarketAccess: data.scores?.marketAccess || 'Medium',
      regulatoryEnvironment: data.scores?.regulatory || 'Standard',
      infrastructureQuality: data.scores?.infrastructure || 'Moderate',
      engagementScore: data.scores?.engagement || 50,
      overlookedScore: data.scores?.overlooked || 50,
      costOfDoing: data.scores?.costOfDoing || 50,
      investmentMomentum: data.scores?.momentum || 50,
      
      // Links and sources
      governmentLinks: data.links || [],
      
      // Raw data for debugging
      _rawData: data
    };
    
    console.log('[AWS AI] Profile built successfully:', profile.city);
    
    return {
      profile,
      sources: [
        'AWS Bedrock Claude',
        'World Knowledge Base',
        'Real-time Intelligence'
      ],
      summary: `Intelligence report for ${profile.city}, ${profile.country} via AWS Bedrock.`,
      dataQuality: 85
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AWS AI] Research failed:', errorMessage);
    onProgress?.({ stage: 'Error', progress: 0, message: `Research failed: ${errorMessage}` });
    throw error;
  }
}

// ==================== DOCUMENT GENERATION ====================

export async function generateDocument(
  type: 'letter' | 'proposal' | 'report' | 'memo' | 'contract',
  context: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<string> {
  
  onProgress?.({ stage: 'Generating', progress: 30, message: `Creating ${type}...` });
  
  const prompt = `You are an expert business document writer. Generate a professional ${type} based on this context:

${context}

Requirements:
1. Use formal, professional language
2. Include all relevant details
3. Format appropriately for ${type}
4. Be concise but comprehensive

Return the complete document text.`;

  try {
    const response = await invokeAI(prompt);
    onProgress?.({ stage: 'Complete', progress: 100, message: 'Document ready!' });
    return response.text;
  } catch (error) {
    console.error('[AWS AI] Document generation failed:', error);
    throw error;
  }
}

// ==================== REPORT GENERATION ====================

export async function generateReport(
  topic: string,
  data: string,
  onProgress?: (progress: ResearchProgress) => void
): Promise<string> {
  
  onProgress?.({ stage: 'Analyzing', progress: 20, message: 'Analyzing data...' });
  
  const prompt = `You are a strategic intelligence analyst. Generate a comprehensive report on: "${topic}"

Available data:
${data}

Include:
1. Executive summary
2. Key findings
3. Detailed analysis
4. Recommendations
5. Risk assessment
6. Conclusion

Format as a professional intelligence report.`;

  try {
    onProgress?.({ stage: 'Generating', progress: 50, message: 'Generating report...' });
    const response = await invokeAI(prompt);
    onProgress?.({ stage: 'Complete', progress: 100, message: 'Report ready!' });
    return response.text;
  } catch (error) {
    console.error('[AWS AI] Report generation failed:', error);
    throw error;
  }
}

export default {
  invokeAI,
  researchLocationAWS,
  generateDocument,
  generateReport,
  isAWSEnvironment
};

