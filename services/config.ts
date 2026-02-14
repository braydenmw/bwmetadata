// Feature flags and configuration for demo/production modes
// V6.0 - Nexus Intelligence OS - ALL LIVE DATA BY DEFAULT
export const config = {
  // AI & Backend Features - ENABLED BY DEFAULT FOR LIVE SYSTEM
  useRealAI: process.env.REACT_APP_USE_REAL_AI !== 'false', // Default TRUE
  useRealData: process.env.REACT_APP_USE_REAL_DATA !== 'false', // Default TRUE
  useRealBackend: process.env.REACT_APP_USE_REAL_BACKEND !== 'false', // Default TRUE

  // UI Features
  showDemoIndicators: process.env.REACT_APP_SHOW_DEMO_INDICATORS === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableAuth: process.env.REACT_APP_ENABLE_AUTH === 'true',

  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',

  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Multi-Agent Brain System v6.0 (Nexus Intelligence OS)
  enableMultiAgent: true,
  enableHistoricalLearning: true,
  enableRegionalCityEngine: true,
  enableDocumentIntelligence: true,
  enableLiveReportBuilder: true,
};

// Helper functions for feature detection
export const features = {
  // Check if a feature should use real implementation
  shouldUseReal: (feature: keyof typeof config): boolean => {
    return config[feature] as boolean;
  },

  // Check if we're in demo mode
  isDemoMode: (): boolean => {
    return !config.useRealAI || !config.useRealData || !config.useRealBackend;
  },

  // Get API endpoint with fallback
  getApiEndpoint: (endpoint: string): string | null => {
    if (config.useRealBackend) {
      return `${config.apiBaseUrl}${endpoint}`;
    }
    // Fallback to local processing when backend unavailable
    return null;
  },

  // Check if we should show demo indicators
  shouldShowDemoIndicator: (): boolean => {
    return config.showDemoIndicators && features.isDemoMode();
  },
};

// System status messages
export const systemMessages = {
  aiResponse: "AI analysis powered by multi-model synthesis (Gemini, GPT-4, Claude).",
  dataSource: "Processing with live data integration and intelligent caching.",
  analysis: "Analysis complete using NSIL Intelligence Hub with 5-persona reasoning.",
  generation: "Document generated with professional formatting and export options.",
};

// Legacy alias for backward compatibility
export const demoMessages = systemMessages;

export default config;
