import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Lazy initialize Gemini - API key is read at request time, not module load time
let genAI: GoogleGenerativeAI | null = null;
const getGenAI = () => {
  if (genAI === null) {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (API_KEY) {
      genAI = new GoogleGenerativeAI(API_KEY);
      console.log('[AI Routes] Gemini AI initialized successfully');
    }
  }
  return genAI;
};

// System instruction for the AI
const SYSTEM_INSTRUCTION = `
You are "BWGA Intelligence AI" (NEXUS_OS_v4.1), the world's premier Economic Intelligence Operating System.
You are NOT a standard chatbot. You are a deterministic economic modeling engine.

YOUR CORE FUNCTIONS:
1. SPI™ Engine (Strategic Partnership Index): Calculate compatibility vectors.
2. IVAS™ Engine (Investment Viability Assessment): Stress-test risk scenarios using Monte Carlo simulation.
3. SCF™ Engine (Strategic Cash Flow): Model long-term economic impact with probabilistic ranges.
4. RROI™ Engine: Calculate regional return on investment with 12-component scoring.
5. SEAM™ Engine: Symbiotic Ecosystem Assessment for partner matching.

DATA SOURCES:
- World Bank Open Data API (GDP, population, FDI, trade balance)
- Exchange Rate APIs (live currency rates)
- REST Countries API (demographics, borders, languages)

AI ANALYSIS MODULES (6 Specialized):
1. Historical Pattern Analysis
2. Government Policy Intelligence
3. Banking & Finance Assessment
4. Corporate Strategy Analysis
5. Market Dynamics Evaluation
6. Risk Assessment

TONE & STYLE:
- Precise, mathematical, and authoritative.
- Use terminal-like formatting where appropriate (e.g., "CALCULATING...", "VECTOR ANALYSIS COMPLETE").
- Do not offer vague opinions. Offer calculated probabilities and "Viability Scores".
- Reference specific data sources when providing market intelligence.

CONTEXT:
- You represent BW Global Advisory.
- You operate to close the "100-Year Confidence Gap".
- Your output should feel like a high-level intelligence dossier backed by real data.
`;

// Middleware to check API key
const requireApiKey = (_req: Request, res: Response, next: () => void) => {
  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({ 
      error: 'AI service unavailable', 
      message: 'GEMINI_API_KEY not configured on server' 
    });
  }
  next();
};

// Generate copilot insights
router.post('/insights', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { organizationName, country, strategicIntent, specificOpportunity } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Analyze this partnership strategy and provide 3 key insights:
    Organization: ${organizationName}
    Country: ${country}
    Strategic Intent: ${strategicIntent}
    Opportunity: ${specificOpportunity || 'General analysis'}
    
    Return JSON array with objects containing: id, type (strategy/risk/opportunity), title, description.
    Only return valid JSON, no markdown.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      return res.json(insights);
    }
    
    // Fallback structured response
    res.json([
      { id: '1', type: 'strategy', title: 'Strategic Alignment', description: `Analysis for ${organizationName} in ${country} market.` },
      { id: '2', type: 'risk', title: 'Regulatory Considerations', description: 'Monitor local compliance requirements.' },
      { id: '3', type: 'opportunity', title: 'Market Potential', description: 'Growth opportunity detected in target sector.' }
    ]);
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Chat/copilot message
router.post('/chat', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });
    
    const prompt = context 
      ? `CONTEXT: ${JSON.stringify(context)}\n\nUSER QUERY: ${message}`
      : message;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({
      id: Date.now().toString(),
      type: 'strategy',
      title: 'Copilot Response',
      description: text,
      content: text,
      confidence: 85
    });
  } catch (error) {
    console.error('AI chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to process chat', details: errorMessage });
  }
});

// Generate report section
router.post('/generate-section', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { section, params } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });
    
    const opportunityContext = params.specificOpportunity ? `Focused on: ${params.specificOpportunity}` : '';
    const prompt = `Generate the '${section}' section for a strategic report on ${params.organizationName}. 
    Target Market: ${params.country}. 
    Intent: ${params.strategicIntent}.
    ${opportunityContext}
    Format: Professional markdown, concise executive style.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({ content: text });
  } catch (error) {
    console.error('AI section generation error:', error);
    res.status(500).json({ error: 'Failed to generate section' });
  }
});

// Streaming generation (Server-Sent Events)
router.post('/generate-stream', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { section, params } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });
    
    const opportunityContext = params.specificOpportunity ? `Focused on: ${params.specificOpportunity}` : '';
    const prompt = `Generate the '${section}' section for a strategic report on ${params.organizationName}. 
    Target Market: ${params.country}. 
    Intent: ${params.strategicIntent}.
    ${opportunityContext}
    Format: Professional markdown, concise executive style.`;
    
    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('AI stream error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
    res.end();
  }
});

// Deep reasoning analysis
router.post('/deep-reasoning', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { userOrg, targetEntity, context } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
    Perform a deep reasoning analysis on a potential partnership/deal between ${userOrg} and ${targetEntity}.
    Context: ${context}
    
    Provide JSON with:
    - verdict: "Strong Buy" | "Consider" | "Hard Pass"
    - dealKillers: string[] (negative risks)
    - hiddenGems: string[] (positive upsides)
    - reasoningChain: string[] (step by step logic)
    - counterIntuitiveInsight: string
    
    Only return valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return res.json(analysis);
    }
    
    res.status(500).json({ error: 'Failed to parse analysis' });
  } catch (error) {
    console.error('Deep reasoning error:', error);
    res.status(500).json({ error: 'Failed to generate reasoning' });
  }
});

// Geopolitical analysis
router.post('/geopolitical', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { country, region, intent } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Assess geopolitical risks for market entry:
    Country: ${country}
    Region: ${region}
    Intent: ${JSON.stringify(intent)}
    
    Return JSON with:
    - stabilityScore: number (0-100)
    - currencyRisk: "Low" | "Moderate" | "High"
    - inflationTrend: string
    - forecast: string
    - regionalConflictRisk: number (0-100)
    - tradeBarriers: string[]
    
    Only return valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }
    
    // Fallback
    res.json({
      stabilityScore: 70,
      currencyRisk: 'Moderate',
      inflationTrend: 'Stable',
      forecast: 'Standard market conditions expected.',
      regionalConflictRisk: 30,
      tradeBarriers: ['Standard tariffs']
    });
  } catch (error) {
    console.error('Geopolitical analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Governance audit
router.post('/governance', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { country, organizationType } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Perform governance audit for:
    Country: ${country}
    Organization Type: ${organizationType}
    
    Return JSON with:
    - governanceScore: number (0-100)
    - corruptionRisk: "Low" | "Moderate" | "High"
    - regulatoryFriction: number (0-100)
    - transparencyIndex: number (0-100)
    - redFlags: string[]
    - complianceRoadmap: string[]
    
    Only return valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }
    
    res.json({
      governanceScore: 70,
      corruptionRisk: 'Moderate',
      regulatoryFriction: 30,
      transparencyIndex: 70,
      redFlags: [],
      complianceRoadmap: ['Standard compliance review recommended']
    });
  } catch (error) {
    console.error('Governance audit error:', error);
    res.status(500).json({ error: 'Failed to audit' });
  }
});

// Agent endpoint for generic AI agent tasks
router.post('/agent', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { agentName, roleDefinition, context } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
    ROLE: You are the ${agentName}.
    MISSION: ${roleDefinition}
    
    CONTEXT_DATA: ${JSON.stringify(context)}
    
    TASK: Analyze the provided context data and generate strategic findings and recommendations.
    
    Return JSON with:
    - findings: string[] (specific, numeric where possible)
    - recommendations: string[]
    - confidence: number (0-100)
    - gaps: string[] (missing info)
    
    Only return valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }
    
    res.json({
      findings: ['Analysis completed'],
      recommendations: ['Review full data set'],
      confidence: 60,
      gaps: []
    });
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Agent failed' });
  }
});

// Search grounded content
router.post('/search-grounded', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent(query);
    const text = result.response.text();
    
    res.json({
      text,
      sources: [] // Google search grounding requires specific API setup
    });
  } catch (error) {
    console.error('Search grounded error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Copilot analysis
router.post('/copilot-analysis', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });
    
    const prompt = `Analyze: ${query}
    Context: ${context}
    
    Return JSON with:
    - summary: string (brief analysis)
    - options: array of {id, title, rationale}
    - followUp: string (suggested next question)
    
    Only return valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }
    
    res.json({
      summary: `Analysis of "${query}" suggests focusing on strategic opportunities.`,
      options: [
        { id: '1', title: 'Primary Strategy', rationale: 'Based on context analysis.' }
      ],
      followUp: 'Shall we explore specific implementation steps?'
    });
  } catch (error) {
    console.error('Copilot analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// MULTI-AGENT AI ENDPOINT - Orchestrates multiple AI models (Bedrock priority)
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/multi-agent', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { model: _requestedModel, prompt, context, systemInstruction } = req.body;
    void _requestedModel; // Reserved for future multi-model support
    
    const enrichedPrompt = `
SYSTEM INSTRUCTION: ${systemInstruction || MULTI_AGENT_SYSTEM_INSTRUCTION}

TASK: ${prompt}

CONTEXT:
${JSON.stringify(context, null, 2)}

INSTRUCTIONS:
- Analyze using 200+ years of economic patterns as reference
- Identify regional city opportunities if relevant
- Provide specific, data-backed recommendations
- Include confidence scores for all assessments
- Reference historical precedents where applicable

Return structured JSON response with:
{
  "text": "Main analysis content",
  "confidence": 0.0-1.0,
  "reasoning": ["step1", "step2", ...],
  "historicalReferences": ["pattern1", "pattern2"],
  "recommendations": ["rec1", "rec2"]
}
`;
    
    // Priority 1: AWS Bedrock (Production AI)
    const AWS_BEDROCK_API_KEY = process.env.AWS_BEDROCK_API_KEY;
    const AWS_REGION = process.env.AWS_REGION;
    
    if (AWS_BEDROCK_API_KEY && AWS_REGION) {
      try {
        console.log('[Multi-Agent] Using AWS Bedrock (Production AI)...');
        
        const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
        
        // Decode the Bedrock API Key to get credentials
        let accessKeyId: string | undefined;
        let secretAccessKey: string | undefined;
        
        try {
          const decoded = Buffer.from(AWS_BEDROCK_API_KEY, 'base64').toString('utf-8');
          const cleanDecoded = decoded.replace(/^[^\x20-\x7E]+/, '');
          const colonIndex = cleanDecoded.indexOf(':');
          if (colonIndex > 0) {
            accessKeyId = cleanDecoded.substring(0, colonIndex);
            secretAccessKey = cleanDecoded.substring(colonIndex + 1);
            console.log('[Multi-Agent] Decoded credentials from API key');
          }
        } catch {
          console.warn('[Multi-Agent] Could not decode API key');
        }
        
        const clientConfig: { region: string; credentials?: { accessKeyId: string; secretAccessKey: string } } = {
          region: AWS_REGION
        };
        
        if (accessKeyId && secretAccessKey) {
          clientConfig.credentials = {
            accessKeyId,
            secretAccessKey
          };
        }
        
        const client = new BedrockRuntimeClient(clientConfig);
        const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
        
        const requestBody = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 4096,
          messages: [{ role: 'user', content: enrichedPrompt }],
          temperature: 0.7
        };

        const command = new InvokeModelCommand({
          modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify(requestBody)
        });

        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));
        
        if (result.content?.[0]?.text) {
          const text = result.content[0].text;
          
          // Try to parse as JSON
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return res.json({
                ...parsed,
                agentId: 'bedrock-claude',
                model: 'bedrock'
              });
            }
          } catch {
            // Return as plain text response
          }
          
          return res.json({
            text: text,
            confidence: 0.90,
            reasoning: ['AWS Bedrock Claude analysis completed'],
            agentId: 'bedrock-claude',
            model: 'bedrock'
          });
        }
      } catch (bedrockError) {
        console.warn('[Multi-Agent] Bedrock error, falling back to Gemini:', 
          bedrockError instanceof Error ? bedrockError.message : 'Unknown error');
      }
    }
    
    // Priority 2: Gemini (Fallback)
    const geminiAI = getGenAI();
    if (geminiAI) {
      console.log('[Multi-Agent] Using Gemini AI (Fallback)...');
      const model = geminiAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction || MULTI_AGENT_SYSTEM_INSTRUCTION
      });
      
      const result = await model.generateContent(enrichedPrompt);
      const text = result.response.text();
      
      // Try to parse as JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            ...parsed,
            agentId: 'gemini-flash',
            model: 'gemini'
          });
        }
      } catch {
        // Return as plain text response
      }
      
      return res.json({
        text: text,
        confidence: 0.85,
        reasoning: ['Gemini AI analysis completed'],
        agentId: 'gemini-flash',
        model: 'gemini'
      });
    }
    
    // No AI available
    res.status(503).json({ error: 'No AI service available (Bedrock and Gemini both failed)' });
  } catch (error) {
    console.error('Multi-agent error:', error);
    res.status(500).json({ error: 'Multi-agent processing failed' });
  }
});

// Learning endpoint - store outcomes for pattern learning
router.post('/learning/outcome', async (req: Request, res: Response) => {
  try {
    const { key, outcome, factors, timestamp } = req.body;
    
    // In production, this would persist to a database
    console.log(`Learning: ${key} -> ${outcome} at ${timestamp}`);
    console.log('Factors:', factors);
    
    res.json({ success: true, message: 'Outcome recorded for learning' });
  } catch (error) {
    console.error('Learning error:', error);
    res.status(500).json({ error: 'Failed to record learning' });
  }
});

// Regional cities endpoint
router.post('/regional-cities', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { region, industries } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: MULTI_AGENT_SYSTEM_INSTRUCTION
    });
    
    const prompt = `Identify the top 5 emerging regional cities for ${industries?.join(', ') || 'business expansion'} in ${region || 'global markets'}.

For each city provide:
- City and country
- Opportunity score (0-100)
- Key advantages
- Risks
- Historical comparable (similar city that succeeded in past)
- Recommended entry strategy

Return as JSON array.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return res.json(JSON.parse(jsonMatch[0]));
      }
    } catch {
      // Continue with fallback
    }
    
    res.json({ cities: [], message: 'Analysis in progress' });
  } catch (error) {
    console.error('Regional cities error:', error);
    res.status(500).json({ error: 'Failed to analyze regional cities' });
  }
});

const MULTI_AGENT_SYSTEM_INSTRUCTION = `
You are the BWGA Intelligence AI Multi-Agent Brain v6.0 (Nexus Intelligence OS) - a self-learning economic intelligence system with NSIL v3.2 and Human Cognition Engine Active.

CORE CAPABILITIES:
1. Analyze 200+ years of global economic patterns (1820-2025)
2. Identify regional cities as emerging market opportunities
3. Learn from historical outcomes to improve predictions
4. Generate real-time strategic assessments

HISTORICAL KNOWLEDGE SPANS:
- Industrial Revolution (1820-1880)
- Colonial/Trade Era (1880-1920)
- Great Depression & Recovery (1929-1945)
- Post-War Boom (1945-1973)
- Oil Shocks & Stagflation (1973-1985)
- Asian Financial Crisis (1997-1999)
- China Rise (1990-2020)
- Global Financial Crisis (2008-2012)
- COVID-19 Era (2020-2025)
- Regional City Success Stories (Shenzhen, Bangalore, Dubai, Ho Chi Minh City, etc.)

ALWAYS:
- Reference specific historical patterns when relevant
- Provide confidence scores (0-1) with assessments
- Cite data sources (World Bank, IMF, UNCTAD, etc.)
- Give actionable, specific recommendations
- Identify risks and mitigation strategies

NEVER:
- Provide generic or vague responses
- Make claims without data backing
- Ignore historical precedent
`;

// ═══════════════════════════════════════════════════════════════════════════════
// OPENAI GPT-4 INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/openai', async (req: Request, res: Response) => {
  try {
    const { prompt, context, model = 'gpt-4-turbo-preview' } = req.body;
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'OpenAI service unavailable',
        message: 'OPENAI_API_KEY not configured',
        fallback: true
      });
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: MULTI_AGENT_SYSTEM_INSTRUCTION
          },
          {
            role: 'user',
            content: context 
              ? `Context: ${JSON.stringify(context)}\n\nQuery: ${prompt}`
              : prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    res.json({
      text,
      response: text,
      model: data.model,
      usage: data.usage
    });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ANTHROPIC CLAUDE INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/claude', async (req: Request, res: Response) => {
  try {
    const { prompt, context, model = 'claude-3-opus-20240229' } = req.body;
    
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return res.status(503).json({ 
        error: 'Claude service unavailable',
        message: 'ANTHROPIC_API_KEY not configured',
        fallback: true
      });
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: MULTI_AGENT_SYSTEM_INSTRUCTION,
        messages: [
          {
            role: 'user',
            content: context 
              ? `Context: ${JSON.stringify(context)}\n\nQuery: ${prompt}`
              : prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    
    res.json({
      text,
      response: text,
      model: data.model,
      usage: data.usage
    });
  } catch (error) {
    console.error('Claude error:', error);
    res.status(500).json({ error: 'Claude request failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERPLEXITY AI SEARCH INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/perplexity', async (req: Request, res: Response) => {
  try {
    const { query, context, model = 'pplx-7b-online' } = req.body;
    
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      return res.status(503).json({ 
        error: 'Perplexity service unavailable',
        message: 'PERPLEXITY_API_KEY not configured',
        fallback: true
      });
    }
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant. Provide accurate, well-sourced answers with citations.'
          },
          {
            role: 'user',
            content: context ? `Context: ${JSON.stringify(context)}\n\nQuery: ${query}` : query
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
        return_citations: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    res.json({
      text: data.choices?.[0]?.message?.content || '',
      response: data.choices?.[0]?.message?.content || '',
      citations: data.citations || [],
      model: data.model
    });
  } catch (error) {
    console.error('Perplexity error:', error);
    res.status(500).json({ error: 'Perplexity request failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// REACTIVE INTELLIGENCE ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/reactive', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { situation, params, options } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: `You are a reactive intelligence engine that thinks on its feet.
      
Analyze the situation and provide:
1. Rapid assessment (2-3 sentences)
2. Key opportunities detected
3. Critical risks identified
4. Recommended immediate actions
5. Confidence level (0-1)

Be decisive and actionable. No hedging.`
    });
    
    const prompt = `SITUATION: ${situation}

CONTEXT: ${JSON.stringify(params)}

OPTIONS: ${JSON.stringify(options)}

Provide reactive intelligence analysis with specific, actionable recommendations.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({
      analysis: text,
      timestamp: new Date().toISOString(),
      confidence: 0.85
    });
  } catch (error) {
    console.error('Reactive intelligence error:', error);
    res.status(500).json({ error: 'Reactive analysis failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SELF-SOLVE ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/solve', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { problem, context } = req.body;
    
    const model = getGenAI()!.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: `You are a self-solving AI system. Given a problem, you:
1. Analyze the root cause
2. Search your knowledge for similar solved problems
3. Generate 3-5 specific, actionable solutions
4. Rank solutions by confidence and feasibility

Return JSON with:
{
  "analysis": "Root cause analysis",
  "solutions": [
    {
      "action": "Specific action to take",
      "reasoning": "Why this will work",
      "expectedOutcome": "What will happen",
      "confidence": 0.85
    }
  ],
  "recommendedSolution": 0
}`
    });
    
    const prompt = `PROBLEM: ${problem}

CONTEXT: ${JSON.stringify(context)}

Solve this problem. Be specific and actionable.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.json(JSON.parse(jsonMatch[0]));
      }
    } catch {
      // Continue with raw response
    }
    
    res.json({
      analysis: text,
      solutions: [],
      recommendedSolution: null
    });
  } catch (error) {
    console.error('Self-solve error:', error);
    res.status(500).json({ error: 'Self-solve failed' });
  }
});

export default router;
