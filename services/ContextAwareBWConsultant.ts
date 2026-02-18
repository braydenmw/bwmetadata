/**
 * CONTEXT-AWARE BW CONSULTANT SERVICE
 * 
 * Unified system that detects context and adapts behavior:
 * - Landing Page Mode → FACT SHEET (structured factual data)
 * - Live Report Mode → PROACTIVE CHATBOT (guides through report)
 */

import { invokeAI } from './awsBedrockService';
import LiveDataService from './LiveDataService';

export type ConsultantContext = 'landing' | 'live-report';
export type ResponseFormat = 'fact-sheet' | 'chat-response';

export interface FactSheetResponse {
  format: 'fact-sheet';
  context: ConsultantContext;
  timestamp: string;
  title: string;
  topic: string;
  sections: Array<{
    heading: string;
    content: string;
    icon?: string;
  }>;
  liveData?: {
    gdp?: number;
    population?: number;
    growth?: number;
    sources: string[];
  };
  keyMetrics: Record<string, string | number>;
  confidence: number;
}

export interface ChatResponse {
  format: 'chat-response';
  context: ConsultantContext;
  timestamp: string;
  message: string;
  guidance?: string;
  suggestions?: string[];
  contextualHelp?: string;
  nextStep?: string;
}

export type ConsultantResponse = FactSheetResponse | ChatResponse;

const LANDING_PAGE_PROMPTS = {
  factSheet: (query: string, liveData?: Record<string, unknown>) => `You are BW Consultant AI - an expert analyst providing FACTUAL information.

User Query: "${query}"

${liveData ? `LIVE DATA AVAILABLE:${JSON.stringify(liveData).substring(0, 500)}` : ''}

Provide a comprehensive FACT SHEET with this structure:
{
  "title": "Clear title for the topic",
  "sections": [
    {
      "heading": "Overview",
      "content": "Factual overview"
    },
    {
      "heading": "Key Statistics",
      "content": "Important metrics and data"
    },
    {
      "heading": "Opportunities",
      "content": "Strategic opportunities"
    },
    {
      "heading": "Risks & Challenges",
      "content": "Key risks to consider"
    },
    {
      "heading": "Strategic Recommendations",
      "content": "Next steps for deeper analysis"
    }
  ],
  "keyMetrics": {
    "metric1": "value",
    "metric2": "value"
  }
}

Return VALID JSON only.`
};

const LIVE_REPORT_PROMPTS = {
  proactiveChat: (query: string, reportContext?: Record<string, unknown>) => `You are BW Consultant - a PROACTIVE GUIDE helping someone build a strategic report.

User Input: "${query}"

${reportContext ? `Current Report Context: ${JSON.stringify(reportContext).substring(0, 300)}` : ''}

Your role:
- Guide the user through report building step-by-step
- Ask clarifying questions when needed
- Suggest next actions based on what they're working on
- Provide contextual help without overwhelming
- Be conversational but purposeful

Keep response concise (2-3 sentences max) and actionable.
End with a clear suggestion or question if relevant.`
};

export class ContextAwareBWConsultant {
  /**
   * Detect context from user input and environment
   */
  static detectContext(): ConsultantContext {
    // Check if running in live report context (sidebar)
    const isInLiveReport = typeof window !== 'undefined' && 
      (window.location.pathname.includes('dashboard') || 
       window.location.pathname.includes('report') ||
       document.querySelector('[data-context="live-report"]') !== null);

    return isInLiveReport ? 'live-report' : 'landing';
  }

  /**
   * Process query and return format-appropriate response
   */
  static async processQuery(
    query: string,
    context?: ConsultantContext,
    reportData?: Record<string, unknown>
  ): Promise<ConsultantResponse> {
    const detectedContext = context || this.detectContext();
    
    if (detectedContext === 'landing') {
      return this.generateFactSheet(query);
    } else {
      return this.generateProactiveChatResponse(query, reportData);
    }
  }

  /**
   * LANDING PAGE MODE: Generate structured fact sheet
   */
  private static async generateFactSheet(query: string): Promise<FactSheetResponse> {
    // Fetch live data if location-based query
    let liveData = null;
    const locationMatch = query.match(/\b(manila|philippines|beijing|china|tokyo|japan|singapore|bangkok|mumbai|india|new york|london|paris|dubai)\b/i);
    
    if (locationMatch) {
      try {
        const intelligence = await LiveDataService.getCountryIntelligence(locationMatch[1]);
        if (intelligence.dataQuality.hasRealData) {
          liveData = {
            gdp: intelligence.economics?.gdpCurrent,
            population: intelligence.economics?.population,
            growth: intelligence.economics?.gdpGrowth,
            sources: intelligence.dataQuality.sources
          };
        }
      } catch (error) {
        console.warn('Could not fetch live data:', error);
      }
    }

    // Generate fact sheet via AI
    const prompt = LANDING_PAGE_PROMPTS.factSheet(query, liveData);
    const aiResponse = await invokeAI(prompt);

    try {
      const parsed = JSON.parse(aiResponse.text);
      return {
        format: 'fact-sheet',
        context: 'landing',
        timestamp: new Date().toISOString(),
        title: parsed.title,
        topic: query,
        sections: parsed.sections,
        keyMetrics: parsed.keyMetrics,
        liveData,
        confidence: 0.92
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        format: 'fact-sheet',
        context: 'landing',
        timestamp: new Date().toISOString(),
        title: `Analysis: ${query}`,
        topic: query,
        sections: [{
          heading: 'Analysis',
          content: aiResponse.text
        }],
        keyMetrics: {},
        liveData,
        confidence: 0.75
      };
    }
  }

  /**
   * LIVE REPORT MODE: Generate proactive chat response
   */
  private static async generateProactiveChatResponse(
    query: string,
    reportData?: Record<string, unknown>
  ): Promise<ChatResponse> {
    const prompt = LIVE_REPORT_PROMPTS.proactiveChat(query, reportData);
    const aiResponse = await invokeAI(prompt);

    // Extract guidance and suggestions from response
    const lines = aiResponse.text.split('\n').filter(l => l.trim());
    const message = lines.slice(0, 3).join(' ');
    
    // Parse suggestions if they exist
    const suggestions = lines
      .filter(l => l.startsWith('-') || l.startsWith('•'))
      .map(l => l.replace(/^[-•]\s*/, '').trim());

    return {
      format: 'chat-response',
      context: 'live-report',
      timestamp: new Date().toISOString(),
      message,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      guidance: this.getContextualGuidance(query),
      nextStep: this.suggestNextStep(query, reportData)
    };
  }

  /**
   * Provide contextual guidance based on query
   */
  private static getContextualGuidance(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('identity') || lowerQuery.includes('organization')) {
      return 'Focus on credibility, legal structure, and track record.';
    }
    if (lowerQuery.includes('market') || lowerQuery.includes('region')) {
      return 'Consider market size, growth rate, and competitive intensity.';
    }
    if (lowerQuery.includes('partnership') || lowerQuery.includes('partner')) {
      return 'Assess compatibility across strategic, financial, and operational dimensions.';
    }
    if (lowerQuery.includes('financial') || lowerQuery.includes('revenue')) {
      return 'Ensure financial projections are realistic and grounded in comparable cases.';
    }
    if (lowerQuery.includes('risk')) {
      return 'Identify both external risks (market, regulatory) and internal risks (execution, team).';
    }

    return 'Take your time with each step - thoroughness here saves time later.';
  }

  /**
   * Suggest next step based on context
   */
  private static suggestNextStep(query: string, reportData?: Record<string, unknown>): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('identity') && !reportData?.mandate) {
      return 'Next: Define your strategic mandate and objectives';
    }
    if (lowerQuery.includes('market') && !reportData?.financial) {
      return 'Next: Model your financial scenarios using ROI Diagnostic';
    }
    if (lowerQuery.includes('partnership') && !reportData?.risk) {
      return 'Next: Run comprehensive risk assessment';
    }
    if (reportData?.completeness < 50) {
      return 'Next: Complete the identity & mandate sections first';
    }

    return 'Continue building your report step-by-step';
  }

  /**
   * Format fact sheet for UI display (landing page)
   */
  static renderFactSheet(response: FactSheetResponse): string {
    let html = `<div class="fact-sheet">
      <h2>${response.title}</h2>`;

    response.sections.forEach(section => {
      html += `
      <div class="section">
        <h3>${section.heading}</h3>
        <p>${section.content}</p>
      </div>`;
    });

    if (response.liveData) {
      html += `<div class="live-data">
        <h3>Live Market Data</h3>
        <ul>`;
      Object.entries(response.liveData).forEach(([key, value]) => {
        if (key !== 'sources') {
          html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
      });
      html += `</ul></div>`;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Format chat response for UI display (live report sidebar)
   */
  static renderChatResponse(response: ChatResponse): string {
    let html = `<div class="chat-response">
      <p>${response.message}</p>`;

    if (response.guidance) {
      html += `<p class="guidance">💡 ${response.guidance}</p>`;
    }

    if (response.suggestions && response.suggestions.length > 0) {
      html += `<div class="suggestions">
        <p>Consider:</p>
        <ul>`;
      response.suggestions.forEach(suggestion => {
        html += `<li>${suggestion}</li>`;
      });
      html += `</ul></div>`;
    }

    if (response.nextStep) {
      html += `<p class="next-step">→ ${response.nextStep}</p>`;
    }

    html += `</div>`;
    return html;
  }
}

export default ContextAwareBWConsultant;
