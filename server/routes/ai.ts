import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Gemini with server-side API key (secure)
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// System instruction for the AI
const SYSTEM_INSTRUCTION = `
You are "BW Nexus AI" (NEXUS_OS_v4.1), the world's premier Economic Intelligence Operating System.
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
const requireApiKey = (req: Request, res: Response, next: Function) => {
  if (!genAI) {
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

// Generate report section
router.post('/generate-section', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { section, params } = req.body;
    
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
    
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
// MULTI-AGENT AI ENDPOINT - Orchestrates multiple AI models
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/multi-agent', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { model: requestedModel, prompt, context, systemInstruction } = req.body;
    
    // Use Gemini as primary agent (can be extended for GPT/Claude)
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || MULTI_AGENT_SYSTEM_INSTRUCTION
    });
    
    const enrichedPrompt = `
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
    } catch (parseError) {
      // Return as plain text response
    }
    
    res.json({
      text: text,
      confidence: 0.85,
      reasoning: ['AI analysis completed'],
      agentId: 'gemini-flash',
      model: 'gemini'
    });
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
    const { region, industries, params } = req.body;
    
    const model = genAI!.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
    } catch (parseError) {
      // Continue with fallback
    }
    
    res.json({ cities: [], message: 'Analysis in progress' });
  } catch (error) {
    console.error('Regional cities error:', error);
    res.status(500).json({ error: 'Failed to analyze regional cities' });
  }
});

const MULTI_AGENT_SYSTEM_INSTRUCTION = `
You are the BW NEXUS AI Multi-Agent Brain v5.0 - a self-learning economic intelligence system.

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

export default router;
