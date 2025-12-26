// Feature flags and configuration for demo/production modes
// V5.0 - Multi-Agent Brain System - ALL LIVE DATA BY DEFAULT
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
  
  // Multi-Agent Brain System v5.0
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
  getApiEndpoint: (endpoint: string): string => {
    if (config.useRealBackend) {
      return `${config.apiBaseUrl}${endpoint}`;
    }
    return null; // Will use mock data
  },

  // Check if we should show demo indicators
  shouldShowDemoIndicator: (): boolean => {
    return config.showDemoIndicators && features.isDemoMode();
  },
};

// Demo mode messages and indicators
export const demoMessages = {
  aiResponse: "This is a demo response. Real AI analysis will be available when backend is implemented.",
  dataSource: "Using demo data. Real-time data integration coming soon.",
  analysis: "Demo analysis complete. Full AI-powered insights available in production.",
  generation: "Document generated with demo content. Real templates available soon.",
};

export default config;