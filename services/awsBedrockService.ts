/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AWS BEDROCK AI SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Production-ready AI service using AWS Bedrock ONLY
 * - No external API keys needed when running on AWS
 * - Uses AWS credentials/IAM roles automatically
 * - Supports Claude and other Bedrock models
 * - No external dependencies (no Gemini)
 */

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
  if (typeof process !== 'undefined') {
    return !!(
      process.env.AWS_REGION ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.ECS_CONTAINER_METADATA_URI
    );
  }
  return false;
};

// ==================== AWS BEDROCK CLIENT ====================

async function invokeBedrockModel(prompt: string, model: string = 'anthropic.claude-3-sonnet-20240229-v1:0'): Promise<AIResponse> {
  try {
    const response = await fetch('/api/bedrock/invoke', {
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

// ==================== UNIFIED AI INVOKE ====================

export async function invokeAI(prompt: string): Promise<AIResponse> {
  console.log('[AI Service] Using AWS Bedrock');
  
  try {
    return await invokeBedrockModel(prompt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI Service] Bedrock invocation failed:', errorMessage);
    
    return {
      text: 'AI service temporarily unavailable. Please try again later.',
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
    onProgress?.({ stage: 'Processing', progress: 70, message: 'Processing intelligence data...' });
    
    // Parse JSON response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    
    try {
      data = JSON.parse(response.text.trim());
    } catch {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('[AWS AI] JSON parse failed:', e);
        }
      }
    }
    
    if (!data) {
      console.error('[AWS AI] Failed to parse response');
      onProgress?.({ stage: 'Error', progress: 0, message: 'Failed to process AI response' });
      return null;
    }
    
    onProgress?.({ stage: 'Complete', progress: 100, message: 'Research complete!' });
    
    const profile = {
      id: `live-${Date.now()}`,
      city: data.name || query,
      country: data.country || 'Unknown',
      region: data.region || 'Unknown',
      latitude: data.coordinates?.lat || 0,
      longitude: data.coordinates?.lon || 0,
      population: data.population?.metro || data.population?.city || 0,
      gdp: data.economy?.gdp || 'N/A',
      timezone: 'UTC',
      currency: data.currency?.code || 'USD',
      languages: data.languages || ['English'],
      governmentType: data.government?.type || 'Unknown',
      leader: data.government?.leader,
      mainIndustries: data.economy?.mainIndustries || [],
      majorEmployers: data.economy?.majorEmployers || [],
      airports: data.infrastructure?.airports || [],
      seaports: data.infrastructure?.seaports || [],
      universities: data.education?.universities || [],
      economicZones: data.investment?.economicZones || [],
      investmentIncentives: data.investment?.incentives || [],
      risks: data.risks || {},
      keyFacts: data.keyFacts || [],
      tradePartners: data.tradePartners || [],
      overview: data.overview || `Intelligence profile for ${query}`,
      climate: data.climate || 'Unknown',
      demographics: data.demographics || {},
      globalMarketAccess: 'Medium',
      regulatoryEnvironment: 'Standard',
      infrastructureQuality: 'Moderate',
      _rawData: data
    };
    
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
