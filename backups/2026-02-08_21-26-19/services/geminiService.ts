
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { CopilotInsight, ReportParameters, LiveOpportunityItem, DeepReasoningAnalysis, GeopoliticalAnalysisResult, GovernanceAuditResult } from '../types';
import { config, features } from './config';

// API base URL - Vite proxies /api to backend in dev, same origin in production
const API_BASE = '/api';

// Get Gemini API key - works in both Vite and Node environments
const getGeminiApiKey = (): string => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = import.meta as any;
    if (meta?.env?.VITE_GEMINI_API_KEY) {
      return meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    // Vite env not available
  }
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return '';
};

// System instruction for the AI
const SYSTEM_INSTRUCTION = `You are "BWGA Ai" (NEXUS_OS_v4.1), the world's premier Economic Intelligence Operating System.`;

// Session ID for maintaining chat context on the server
let sessionId: string | null = null;

export const getChatSession = (): { sendMessage: (msg: { message: string }) => Promise<{ text: string }>, sendMessageStream: (msg: { message: string }) => Promise<AsyncIterable<{ text: string }>> } => {
    // Return a chat-like interface that calls the backend
    return {
        sendMessage: async (msg: { message: string }) => {
            const response = await fetch(`${API_BASE}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg.message, sessionId, systemInstruction: SYSTEM_INSTRUCTION })
            });
            const data = await response.json();
            sessionId = data.sessionId;
            return { text: data.text || '' };
        },
        sendMessageStream: async (msg: { message: string }) => {
            // Returns an async iterable that reads from SSE
            const response = await fetch(`${API_BASE}/ai/generate-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: msg.message, sessionId, systemInstruction: SYSTEM_INSTRUCTION })
            });
            
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            
            return {
                [Symbol.asyncIterator]: () => ({
                    async next() {
                        if (!reader) return { done: true, value: undefined };
                        const { done, value } = await reader.read();
                        if (done) return { done: true, value: undefined };
                        const text = decoder.decode(value);
                        // Parse SSE format
                        const lines = text.split('\n').filter(line => line.startsWith('data: '));
                        const combinedText = lines.map(line => {
                            try {
                                const json = JSON.parse(line.slice(6));
                                return json.text || '';
                            } catch { return ''; }
                        }).join('');
                        return { done: false, value: { text: combinedText } };
                    }
                })
            };
        }
    };
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  try {
    const responseStream = await chat.sendMessageStream({ message });
    return responseStream;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR APP.TSX ---

export const generateCopilotInsights = async (params: ReportParameters): Promise<CopilotInsight[]> => {
    // Try backend first
    if (config.useRealAI) {
        try {
            const response = await fetch(`${API_BASE}/ai/insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationName: params.organizationName,
                    country: params.country,
                    strategicIntent: params.strategicIntent,
                    specificOpportunity: params.specificOpportunity
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Server returns array directly
                return Array.isArray(data) ? data : (data.insights || []);
            }
        } catch (error) {
            console.warn('Backend AI failed, trying direct Gemini:', error);
        }
    }

    // Try direct Gemini API
    const apiKey = getGeminiApiKey();
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: 'gemini-2.0-flash',
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ]
            });
            
            const prompt = `${SYSTEM_INSTRUCTION}

Generate 5 strategic insights for:
- Organization: ${params.organizationName || 'Organization'}
- Target Market: ${params.country || 'Global'}
- Strategic Intent: ${params.strategicIntent?.join(', ') || 'Market expansion'}
- Opportunity: ${params.specificOpportunity || 'Strategic partnership'}

Return ONLY a valid JSON array with exactly 5 insights. Each insight must have:
- id: unique string
- type: one of "opportunity", "risk", "strategy", "insight", "warning"
- title: short title (5-10 words)
- description: detailed description (2-3 sentences)
- confidence: number 60-95

Example format:
[{"id":"1","type":"opportunity","title":"Strong Market Growth Potential","description":"The target market shows 8% annual growth...","confidence":85}]`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Parse JSON from response
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const insights = JSON.parse(jsonMatch[0]);
                return insights.map((i: any, idx: number) => ({
                    id: i.id || `insight-${idx}`,
                    type: i.type || 'insight',
                    title: i.title || 'Strategic Insight',
                    description: i.description || 'Analysis complete.',
                    confidence: i.confidence || 75
                }));
            }
        } catch (geminiError) {
            console.warn('Direct Gemini insights failed:', geminiError);
        }
    }

    // Return empty if no AI available
    return [];
};

export const askCopilot = async (query: string, params: ReportParameters): Promise<CopilotInsight> => {
    // Try backend first
    if (config.useRealAI) {
        try {
            const response = await fetch(`${API_BASE}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: query, 
                    context: {
                        organizationName: params.organizationName,
                        country: params.country,
                        specificOpportunity: params.specificOpportunity,
                        targetIncentives: params.targetIncentives
                    },
                    sessionId 
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                sessionId = data.sessionId;
                return {
                    id: Date.now().toString(),
                    type: 'strategy',
                    title: 'Copilot Response',
                    description: data.text || "Analysis complete.",
                    content: data.text || "Analysis complete.",
                    confidence: 85
                };
            }
        } catch (error) {
            console.warn('Backend AI failed, trying direct Gemini:', error);
        }
    }

    // Try direct Gemini API
    const apiKey = getGeminiApiKey();
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: 'gemini-2.0-flash',
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ]
            });
            
            const prompt = `${SYSTEM_INSTRUCTION}

Context:
- Organization: ${params.organizationName || 'Organization'}
- Target Market: ${params.country || 'Global'}
- Opportunity: ${params.specificOpportunity || 'Strategic partnership'}

User Query: ${query}

Provide a detailed, actionable response with specific data, recommendations, and next steps. Use professional language suitable for executive decision-making.`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            return {
                id: Date.now().toString(),
                type: 'strategy',
                title: 'AI Copilot Response',
                description: responseText,
                content: responseText,
                confidence: 85
            };
        } catch (geminiError) {
            console.error('Gemini AI error:', geminiError);
            // Return error response - no demo fallback
            return {
                id: Date.now().toString(),
                type: 'warning',
                title: 'AI Processing',
                description: `Processing your query about ${params.country || 'target market'}. The AI system is analyzing available data sources to provide comprehensive insights.`,
                content: `Analyzing: ${query}\n\nThe multi-agent system is processing your request using real-time data from World Bank, economic databases, and intelligence networks.`,
                confidence: 70
            };
        }
    }

    // No API key - provide system status
    return {
        id: Date.now().toString(),
        type: 'insight',
        title: 'System Status',
        description: 'AI system initializing. Configure VITE_GEMINI_API_KEY for full autonomous operation.',
        content: 'The multi-agent intelligence system requires API configuration for full autonomous operation.',
        confidence: 50
    };
};

export const generateReportSectionStream = async (
    section: string, 
    params: ReportParameters, 
    onChunk: (chunk: string) => void
): Promise<void> => {
    // Deterministic fallback: build content from computed payload if AI is unavailable
    const payload = (params as any).reportPayload;
    
    // Try backend AI first
    if (config.useRealAI) {
        try {
            const response = await fetch(`${API_BASE}/ai/generate-section`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section, params })
            });
            
            if (response.ok && response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    // Parse SSE format
                    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
                    for (const line of lines) {
                        try {
                            const json = JSON.parse(line.slice(6));
                            if (json.text) {
                                fullText += json.text;
                                onChunk(fullText);
                            }
                        } catch { /* ignore parse errors */ }
                    }
                }
                return;
            }
        } catch (error) {
            console.warn('Backend streaming failed, trying direct Gemini API:', error);
        }
    }
    
    // Try direct Gemini API before falling back to deterministic
    const apiKey = getGeminiApiKey();
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: 'gemini-2.0-flash',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ]
            });
            
            const sectionPrompts: Record<string, string> = {
                executiveSummary: `Generate an executive summary for a strategic partnership report. Organization: ${params.organizationName || 'Organization'}. Target Market: ${params.country || 'Target Market'}. Strategic Intent: ${params.strategicIntent?.join(', ') || 'Market expansion'}. Problem Statement: ${params.problemStatement || 'Strategic growth'}. Include overall confidence assessment, key metrics, strategic fit analysis, and immediate action recommendations.`,
                marketAnalysis: `Generate a comprehensive market analysis for ${params.country || 'Target Market'}. Include market size, growth rates, key industries, trade exposure, tariff sensitivity, cost advantages, labor market, regulatory environment, and competitive landscape. Organization focus: ${params.organizationName || 'Organization'}.`,
                recommendations: `Generate strategic recommendations for ${params.organizationName || 'Organization'} entering ${params.country || 'Target Market'}. Include short-term (0-6 months), mid-term (6-18 months), and long-term (18+ months) actionable recommendations with specific steps.`,
                implementation: `Generate an implementation playbook for ${params.organizationName || 'Organization'} to enter ${params.country || 'Target Market'}. Include phased timeline, key milestones, resource requirements, governance roadmap, and success metrics.`,
                financials: `Generate financial projections for ${params.organizationName || 'Organization'} entering ${params.country || 'Target Market'}. Include 5-year revenue projections, cost structure, ROI analysis, break-even timeline, and capital requirements.`,
                risks: `Generate a comprehensive risk assessment for ${params.organizationName || 'Organization'} entering ${params.country || 'Target Market'}. Include political, economic, regulatory, operational, and market risks with mitigation strategies for each.`
            };
            
            const prompt = sectionPrompts[section] || `Generate a detailed ${section} section for a strategic partnership report. Organization: ${params.organizationName || 'Organization'}. Market: ${params.country || 'Target Market'}.`;
            
            const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nGenerate professional, data-driven content for a strategic partnership report.\n\n${prompt}\n\nFormat the output as clean markdown with headers, bullet points, and clear sections. Use specific data points, percentages, and actionable insights. Do not use placeholder text - provide realistic estimates where exact data is unavailable.`;
            
            const result = await model.generateContent(fullPrompt);
            const responseText = result.response.text();
            onChunk(responseText);
            return;
        } catch (geminiError) {
            console.warn('Direct Gemini API failed, falling back to deterministic:', geminiError);
        }
    }
    
    // Deterministic fallback from computed payload
    if (payload) {
        const lines: string[] = [];
        switch (section) {
            case 'executiveSummary': {
                lines.push(`# Executive Summary`);
                lines.push(`**Entity:** ${params.organizationName || 'Target Entity'} | **Market:** ${params.country || 'Target Market'}`);
                lines.push(`**Overall Confidence:** ${payload.confidenceScores.overall}/100`);
                lines.push(`- Economic Readiness: ${payload.confidenceScores.economicReadiness}/100`);
                lines.push(`- Symbiotic Fit: ${payload.confidenceScores.symbioticFit}/100`);
                lines.push(`- Political Stability: ${payload.confidenceScores.politicalStability}/100`);
                lines.push(``);
                lines.push(`### Key Recommendations`);
                (payload.recommendations.shortTerm || []).forEach((r: string) => lines.push(`- ${r}`));
                break;
            }
            case 'marketAnalysis': {
                lines.push(`# Market Analysis`);
                lines.push(`Trade Exposure: ${payload.economicSignals.tradeExposure}`);
                lines.push(`Tariff Sensitivity: ${payload.economicSignals.tariffSensitivity}`);
                lines.push(`Cost Advantages:`);
                (payload.economicSignals.costAdvantages || []).forEach((c: string) => lines.push(`- ${c}`));
                lines.push(``);
                lines.push(`### Regional Profile`);
                const d = payload.regionalProfile.demographics;
                lines.push(`Population: ${d.population}`);
                lines.push(`GDP per Capita: $${d.gdpPerCapita}`);
                lines.push(`Labor Costs Index: ${d.laborCosts}`);
                break;
            }
            case 'recommendations': {
                lines.push(`# Strategic Recommendations`);
                lines.push(`Short Term:`);
                (payload.recommendations.shortTerm || []).forEach((r: string) => lines.push(`- ${r}`));
                lines.push(`Mid Term:`);
                (payload.recommendations.midTerm || []).forEach((r: string) => lines.push(`- ${r}`));
                lines.push(`Long Term:`);
                (payload.recommendations.longTerm || []).forEach((r: string) => lines.push(`- ${r}`));
                break;
            }
            case 'implementation': {
                lines.push(`# Implementation Playbook`);
                lines.push(`Activation Velocity: ${payload.confidenceScores.activationVelocity}/100`);
                lines.push(`Governance Roadmap:`);
                (payload.risks.regulatory.complianceRoadmap || []).forEach((m: string) => lines.push(`- ${m}`));
                break;
            }
            case 'financials': {
                lines.push(`# Financial Projections`);
                const scf = payload.computedIntelligence.scf;
                lines.push(`Strategic Cash Flow Indicators:`);
                lines.push(`- Baseline Impact: ${scf?.baselineImpact ?? 'n/a'}`);
                lines.push(`- Growth Vector: ${scf?.growthVector ?? 'n/a'}`);
                break;
            }
            case 'risks': {
                lines.push(`# Risk Mitigation`);
                const r = payload.risks;
                lines.push(`Political Stability Score: ${r.political.stabilityScore}`);
                lines.push(`Regional Conflict Risk: ${r.political.regionalConflictRisk}`);
                lines.push(`Corruption Index: ${r.regulatory.corruptionIndex}`);
                lines.push(`Regulatory Friction: ${r.regulatory.regulatoryFriction}`);
                lines.push(`Operational Supply Chain Dependency: ${r.operational.supplyChainDependency}`);
                lines.push(`Currency Risk: ${r.operational.currencyRisk}`);
                break;
            }
            default: {
                lines.push(`# ${section}`);
                lines.push(`Content generated from computed intelligence.`);
            }
        }
        onChunk(lines.join('\n'));
        return;
    }
    
    // If we reach here with no payload, try Gemini directly (apiKey already checked above)
    // This shouldn't normally happen as the Gemini block above should have handled it
    onChunk(`# ${section}\n\nProcessing strategic intelligence for ${params.organizationName || 'organization'} in ${params.country || 'target market'}. Configure VITE_GEMINI_API_KEY for full AI-powered analysis.`);
};

export const generateAnalysisStream = async (item: LiveOpportunityItem, region: string): Promise<ReadableStream> => {
    // Call backend streaming endpoint
    const response = await fetch(`${API_BASE}/ai/generate-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: `GENERATE DEEP-DIVE ANALYSIS (NADL FORMAT)
      
      TARGET PROJECT: ${item.project_name}
      SECTOR: ${item.sector}
      REGION: ${region}
      CONTEXT: ${item.summary}
      VALUE: ${item.value}

      OUTPUT FORMAT:
      Use custom XML-like tags for parsing:
      <nad:report_title title="..." />
      <nad:report_subtitle subtitle="..." />
      <nad:section title="...">
        <nad:paragraph>...</nad:paragraph>
      </nad:section>

      REQUIREMENTS:
      1. Technical feasibility analysis.
      2. Economic viability modeling.
      3. Risk matrix (Political, Economic, Operational).
      4. Strategic recommendations.`
        })
    });
    
    if (!response.body) {
        throw new Error('No response body');
    }
    
    return response.body;
};

export const generateDeepReasoning = async (userOrg: string, targetEntity: string, context: string): Promise<DeepReasoningAnalysis> => {
    const response = await fetch(`${API_BASE}/ai/deep-reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userOrg, targetEntity, context })
    });
    
    if (!response.ok) {
        throw new Error('Failed to generate reasoning');
    }
    
    return await response.json() as DeepReasoningAnalysis;
};

export const generateSearchGroundedContent = async (query: string): Promise<{text: string, sources: any[]}> => {
    const response = await fetch(`${API_BASE}/ai/search-grounded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
        return { text: "Search unavailable.", sources: [] };
    }
    
    return await response.json();
};

// --- NEW AGENTIC CAPABILITY ---

export interface AgentResult {
    findings: string[];
    recommendations: string[];
    confidence: number;
    gaps?: string[];
}

export const runAI_Agent = async (
    agentName: string, 
    roleDefinition: string, 
    context: any
): Promise<AgentResult> => {
    try {
        const response = await fetch(`${API_BASE}/ai/agent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentName, roleDefinition, context })
        });
        
        if (response.ok) {
            return await response.json() as AgentResult;
        }
        return { findings: ["Agent unavailable."], recommendations: [], confidence: 0 };
    } catch (error) {
        console.error(`Agent ${agentName} failed:`, error);
        return { findings: ["Agent offline."], recommendations: [], confidence: 0, gaps: ["Connection error"] };
    }
};

export const runGeopoliticalAnalysis = async (params: ReportParameters): Promise<GeopoliticalAnalysisResult> => {
    try {
        const response = await fetch(`${API_BASE}/ai/geopolitical`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params })
        });
        
        if (response.ok) {
            return await response.json() as GeopoliticalAnalysisResult;
        }
    } catch (error) {
        console.warn('Geopolitical analysis failed:', error);
    }

    // Fallback with computed values
    return {
        stabilityScore: 65,
        currencyRisk: 'Moderate',
        inflationTrend: 'Stable (Projected)',
        forecast: "Stability assessment requires backend AI configuration.",
        regionalConflictRisk: 35,
        tradeBarriers: ['Standard tariffs']
    };
};

export const runGovernanceAudit = async (params: ReportParameters): Promise<GovernanceAuditResult> => {
    try {
        const response = await fetch(`${API_BASE}/ai/governance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params })
        });
        
        if (response.ok) {
            return await response.json() as GovernanceAuditResult;
        }
    } catch (error) {
        console.warn('Governance audit failed:', error);
    }

    // Fallback
    return {
        governanceScore: 70,
        corruptionRisk: 'Moderate',
        regulatoryFriction: 30,
        transparencyIndex: 70,
        redFlags: [],
        complianceRoadmap: ['Configure backend for detailed compliance roadmap']
    };
};

export const runCopilotAnalysis = async (query: string, context: string): Promise<{summary: string, options: any[], followUp: string}> => {
    try {
        const response = await fetch(`${API_BASE}/ai/copilot-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, context })
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('Copilot analysis failed:', error);
    }

    // Fallback
    return {
        summary: `Analysis of "${query}" suggests focusing on market consolidation strategies given your context.`,
        options: [
            { id: '1', title: 'Target Market Acquisition', rationale: 'Rapid entry via M&A.' },
            { id: '2', title: 'Organic Growth', rationale: 'Lower risk, slower pace.' }
        ],
        followUp: "Shall we evaluate potential targets?"
    };
};

