
import { CopilotInsight, ReportParameters, LiveOpportunityItem, DeepReasoningAnalysis, GeopoliticalAnalysisResult, GovernanceAuditResult } from '../types';
import { config, features, demoMessages } from './config';

// API base URL - Vite proxies /api to backend in dev, same origin in production
const API_BASE = '/api';

// System instruction for the AI
const SYSTEM_INSTRUCTION = `You are "BW Nexus AI" (NEXUS_OS_v4.1), the world's premier Economic Intelligence Operating System.`;

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
            console.warn('Backend AI failed, falling back:', error);
        }
    }

    // In production without AI, do not inject demo insights
    return [];
};

export const askCopilot = async (query: string, params: ReportParameters): Promise<CopilotInsight> => {
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
            console.warn('Backend AI failed, falling back:', error);
        }
    }

    // Demo mode fallback
    return {
        id: Date.now().toString(),
        type: 'strategy',
        title: 'Demo Copilot Response',
        description: demoMessages.aiResponse,
        content: demoMessages.aiResponse,
        confidence: 75,
        ...(features.shouldShowDemoIndicator() && { isDemo: true })
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
            console.warn('Backend streaming failed, falling back to deterministic:', error);
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
    
    // Fallback: minimal content
    onChunk(`# ${section}\n\nPlease configure AI backend for enhanced content generation.`);
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
