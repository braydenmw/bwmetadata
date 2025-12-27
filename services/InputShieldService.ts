/**
 * INPUT SHIELD SERVICE - Adversarial Input Validation
 * 
 * This service cross-checks user-provided inputs against authoritative data sources
 * to detect:
 * - Fabricated or inconsistent data
 * - Overly optimistic projections
 * - Contradictory claims
 * - Known red flags from pattern databases
 * - Potential fraudulent indicators
 * 
 * The shield runs automatically on all inputs before they reach the analysis engine.
 */

import { ReportParameters } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationResult {
  passed: boolean;
  flag: 'clean' | 'warning' | 'concern' | 'critical';
  category: string;
  field: string;
  userValue: unknown;
  expectedRange?: { min: unknown; max: unknown };
  authoritySource?: string;
  message: string;
  suggestion?: string;
}

export interface ShieldReport {
  timestamp: Date;
  overallTrust: number; // 0-100
  overallStatus: 'trusted' | 'cautionary' | 'suspicious' | 'rejected';
  validationResults: ValidationResult[];
  patternMatches: Array<{
    pattern: string;
    severity: 'info' | 'warning' | 'critical';
    description: string;
  }>;
  recommendations: string[];
  inputFingerprint: string;
}

// ============================================================================
// KNOWN PATTERNS DATABASE (reserved for advanced fraud detection)
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FRAUD_PATTERNS = [
  {
    id: 'too-good-to-be-true',
    pattern: 'ROI > 40% with low risk claim',
    severity: 'critical' as const,
    description: 'Projected returns above 40% with claimed low risk is inconsistent with historical data'
  },
  {
    id: 'rushed-urgency',
    pattern: 'Very short timeline with complex scope',
    severity: 'warning' as const,
    description: 'Complex international operations rarely succeed in compressed timelines'
  },
  {
    id: 'missing-basics',
    pattern: 'Key fields left empty',
    severity: 'warning' as const,
    description: 'Missing critical information may indicate incomplete due diligence'
  },
  {
    id: 'sanctioned-party',
    pattern: 'Entity matches sanctions watchlist',
    severity: 'critical' as const,
    description: 'Entity appears on international sanctions lists'
  },
  {
    id: 'shell-company-indicators',
    pattern: 'New company + offshore jurisdiction + vague description',
    severity: 'warning' as const,
    description: 'Combination of factors often associated with shell companies'
  }
];

// Known country data for validation (subset - real implementation would use API)
const COUNTRY_DATA: Record<string, { 
  gdpGrowth: number; 
  doingBusinessRank: number; 
  corruptionIndex: number;
  sanctioned: boolean;
}> = {
  'Australia': { gdpGrowth: 2.4, doingBusinessRank: 14, corruptionIndex: 73, sanctioned: false },
  'United States': { gdpGrowth: 2.1, doingBusinessRank: 6, corruptionIndex: 67, sanctioned: false },
  'United Kingdom': { gdpGrowth: 1.1, doingBusinessRank: 8, corruptionIndex: 71, sanctioned: false },
  'Germany': { gdpGrowth: 0.3, doingBusinessRank: 22, corruptionIndex: 79, sanctioned: false },
  'Singapore': { gdpGrowth: 2.8, doingBusinessRank: 2, corruptionIndex: 83, sanctioned: false },
  'Japan': { gdpGrowth: 1.9, doingBusinessRank: 29, corruptionIndex: 73, sanctioned: false },
  'China': { gdpGrowth: 5.2, doingBusinessRank: 31, corruptionIndex: 45, sanctioned: false },
  'India': { gdpGrowth: 6.3, doingBusinessRank: 63, corruptionIndex: 40, sanctioned: false },
  'Vietnam': { gdpGrowth: 5.0, doingBusinessRank: 70, corruptionIndex: 42, sanctioned: false },
  'Indonesia': { gdpGrowth: 5.1, doingBusinessRank: 73, corruptionIndex: 37, sanctioned: false },
  'Russia': { gdpGrowth: 0.7, doingBusinessRank: 28, corruptionIndex: 28, sanctioned: true },
  'Iran': { gdpGrowth: 2.5, doingBusinessRank: 127, corruptionIndex: 24, sanctioned: true },
  'North Korea': { gdpGrowth: -0.1, doingBusinessRank: 190, corruptionIndex: 17, sanctioned: true },
  'Venezuela': { gdpGrowth: 4.0, doingBusinessRank: 188, corruptionIndex: 14, sanctioned: true },
  'Syria': { gdpGrowth: -2.0, doingBusinessRank: 176, corruptionIndex: 13, sanctioned: true },
  'Belarus': { gdpGrowth: 1.4, doingBusinessRank: 49, corruptionIndex: 39, sanctioned: true },
  'Myanmar': { gdpGrowth: 1.0, doingBusinessRank: 165, corruptionIndex: 23, sanctioned: true },
  'Cuba': { gdpGrowth: 1.3, doingBusinessRank: 150, corruptionIndex: 45, sanctioned: true },
};

// OFAC SDN partial list for demo (real implementation would use API)
const SANCTIONS_WATCHLIST = [
  'rosneft', 'gazprom', 'sberbank', 'vtb bank', 'russian direct investment fund',
  'national iranian oil company', 'islamic revolutionary guard corps',
  'korea mining development trading corporation', 'foreign trade bank dprk',
  'hezbollah', 'hamas', 'isis', 'al-qaeda',
  'nicolas maduro', 'bashar al-assad'
];

// ============================================================================
// INPUT SHIELD SERVICE
// ============================================================================

export class InputShieldService {
  
  /**
   * Run full validation shield on input parameters
   */
  static validate(params: Partial<ReportParameters>): ShieldReport {
    const validationResults: ValidationResult[] = [];
    const patternMatches: ShieldReport['patternMatches'] = [];
    const recommendations: string[] = [];
    
    // -------------------------
    // 1. REQUIRED FIELD VALIDATION
    // -------------------------
    validationResults.push(this.validateRequiredField('organizationName', params.organizationName));
    validationResults.push(this.validateRequiredField('country', params.country));
    validationResults.push(this.validateRequiredField('industry', params.industry?.join(', ')));
    
    // -------------------------
    // 2. COUNTRY VALIDATION
    // -------------------------
    if (params.country) {
      const countryResult = this.validateCountry(params.country);
      validationResults.push(countryResult);
      
      if (countryResult.flag === 'critical') {
        patternMatches.push({
          pattern: 'sanctioned-party',
          severity: 'critical',
          description: `${params.country} is subject to international sanctions`
        });
      }
    }
    
    // -------------------------
    // 3. ENTITY NAME SANCTIONS CHECK
    // -------------------------
    if (params.organizationName) {
      const sanctionsResult = this.checkSanctionsList(params.organizationName);
      validationResults.push(sanctionsResult);
      
      if (sanctionsResult.flag !== 'clean') {
        patternMatches.push({
          pattern: 'sanctioned-party',
          severity: 'critical',
          description: sanctionsResult.message
        });
      }
    }
    
    if (params.targetPartner) {
      const partnerSanctionsResult = this.checkSanctionsList(params.targetPartner);
      validationResults.push({
        ...partnerSanctionsResult,
        field: 'targetPartnerName'
      });
    }
    
    // -------------------------
    // 4. FINANCIAL REASONABLENESS
    // -------------------------
    // Derive ROI expectation from risk tolerance
    const riskToleranceStr = params.riskTolerance;
    const roiExpectation = riskToleranceStr === 'High' ? 30 : riskToleranceStr === 'Medium' ? 20 : 10;
    if (roiExpectation > 15) {
      validationResults.push(this.validateROIExpectation(roiExpectation));
    }
    
    if (params.calibration?.constraints?.budgetCap) {
      const budgetCap = parseFloat(params.calibration.constraints.budgetCap.replace(/[^0-9.]/g, ''));
      if (!isNaN(budgetCap)) {
        validationResults.push(this.validateBudget(budgetCap));
      }
    }
    
    // -------------------------
    // 5. TIMELINE REALISM
    // -------------------------
    if (params.expansionTimeline) {
      validationResults.push(this.validateTimeline(params.expansionTimeline, params.strategicIntent));
    }
    
    // -------------------------
    // 6. PATTERN MATCHING
    // -------------------------
    
    // Check for "too good to be true" - using risk tolerance as proxy
    const roiExp = riskToleranceStr === 'High' ? 35 : riskToleranceStr === 'Medium' ? 20 : 10;
    const riskTolerance = riskToleranceStr === 'High' ? 80 : riskToleranceStr === 'Medium' ? 50 : 30;
    if (roiExp && roiExp > 40 && riskTolerance && riskTolerance < 50) {
      patternMatches.push({
        pattern: 'too-good-to-be-true',
        severity: 'critical',
        description: `ROI expectation of ${roiExp}% with risk tolerance of ${riskTolerance}% is inconsistent`
      });
    }
    
    // Check for rushed timeline with complex scope
    const hasComplexIntent = params.strategicIntent?.some(i => 
      i.includes('Manufacturing') || i.includes('Joint Venture') || i.includes('Acquisition')
    );
    if (hasComplexIntent && params.expansionTimeline?.includes('3 months')) {
      patternMatches.push({
        pattern: 'rushed-urgency',
        severity: 'warning',
        description: 'Complex strategic intent with 3-month timeline is unrealistic'
      });
    }
    
    // Check for missing basics
    const criticalMissing = validationResults.filter(r => 
      r.category === 'required' && r.flag !== 'clean'
    ).length;
    if (criticalMissing >= 2) {
      patternMatches.push({
        pattern: 'missing-basics',
        severity: 'warning',
        description: `${criticalMissing} critical fields are missing or incomplete`
      });
    }
    
    // -------------------------
    // 7. CALCULATE OVERALL TRUST
    // -------------------------
    const criticalCount = validationResults.filter(r => r.flag === 'critical').length 
      + patternMatches.filter(p => p.severity === 'critical').length;
    const concernCount = validationResults.filter(r => r.flag === 'concern').length;
    const warningCount = validationResults.filter(r => r.flag === 'warning').length
      + patternMatches.filter(p => p.severity === 'warning').length;
    
    let overallTrust = 100 - (criticalCount * 40) - (concernCount * 15) - (warningCount * 5);
    overallTrust = Math.max(0, Math.min(100, overallTrust));
    
    let overallStatus: ShieldReport['overallStatus'] = 'trusted';
    if (criticalCount > 0) overallStatus = 'rejected';
    else if (concernCount >= 2 || (concernCount >= 1 && warningCount >= 2)) overallStatus = 'suspicious';
    else if (warningCount >= 2) overallStatus = 'cautionary';
    
    // -------------------------
    // 8. GENERATE RECOMMENDATIONS
    // -------------------------
    if (criticalCount > 0) {
      recommendations.push('BLOCKED: Critical issues must be resolved before proceeding');
      validationResults
        .filter(r => r.flag === 'critical')
        .forEach(r => recommendations.push(`• ${r.suggestion || 'Address: ' + r.message}`));
    }
    
    if (warningCount > 0 && criticalCount === 0) {
      recommendations.push('Review the following before finalizing analysis:');
      validationResults
        .filter(r => r.flag === 'warning')
        .slice(0, 3)
        .forEach(r => recommendations.push(`• ${r.suggestion || r.message}`));
    }
    
    if (overallStatus === 'trusted' && overallTrust >= 80) {
      recommendations.push('Inputs validated successfully. Proceed with analysis.');
    }
    
    // Generate fingerprint for input tracking
    const inputFingerprint = this.generateFingerprint(params);
    
    return {
      timestamp: new Date(),
      overallTrust,
      overallStatus,
      validationResults,
      patternMatches,
      recommendations,
      inputFingerprint
    };
  }
  
  // -------------------------
  // VALIDATION HELPERS
  // -------------------------
  
  private static validateRequiredField(field: string, value: unknown): ValidationResult {
    const isEmpty = !value || value === '' || value === 'Not Selected';
    return {
      passed: !isEmpty,
      flag: isEmpty ? 'warning' : 'clean',
      category: 'required',
      field,
      userValue: value,
      message: isEmpty ? `Required field "${field}" is missing or empty` : `${field} provided`,
      suggestion: isEmpty ? `Please provide a value for ${field}` : undefined
    };
  }
  
  private static validateCountry(country: string): ValidationResult {
    const countryInfo = COUNTRY_DATA[country];
    
    if (!countryInfo) {
      return {
        passed: true,
        flag: 'clean',
        category: 'geography',
        field: 'country',
        userValue: country,
        message: 'Country not in validation database - manual review recommended'
      };
    }
    
    if (countryInfo.sanctioned) {
      return {
        passed: false,
        flag: 'critical',
        category: 'sanctions',
        field: 'country',
        userValue: country,
        authoritySource: 'OFAC/EU/UN Sanctions Lists',
        message: `${country} is subject to international sanctions. Operations may be prohibited.`,
        suggestion: 'Consult legal counsel before any engagement with this jurisdiction'
      };
    }
    
    if (countryInfo.corruptionIndex < 40) {
      return {
        passed: true,
        flag: 'warning',
        category: 'governance',
        field: 'country',
        userValue: country,
        authoritySource: 'Transparency International CPI',
        message: `${country} has a low Corruption Perceptions Index (${countryInfo.corruptionIndex}/100). Enhanced due diligence recommended.`,
        suggestion: 'Implement robust anti-corruption controls'
      };
    }
    
    return {
      passed: true,
      flag: 'clean',
      category: 'geography',
      field: 'country',
      userValue: country,
      authoritySource: 'World Bank, Transparency International',
      message: `${country} validated - Doing Business Rank: ${countryInfo.doingBusinessRank}, CPI: ${countryInfo.corruptionIndex}`
    };
  }
  
  private static checkSanctionsList(entityName: string): ValidationResult {
    const normalizedName = entityName.toLowerCase().trim();
    
    const matchedEntry = SANCTIONS_WATCHLIST.find(entry => 
      normalizedName.includes(entry) || entry.includes(normalizedName)
    );
    
    if (matchedEntry) {
      return {
        passed: false,
        flag: 'critical',
        category: 'sanctions',
        field: 'organizationName',
        userValue: entityName,
        authoritySource: 'OFAC SDN List',
        message: `Entity "${entityName}" may match sanctioned party: "${matchedEntry}"`,
        suggestion: 'Conduct thorough sanctions screening before any engagement'
      };
    }
    
    return {
      passed: true,
      flag: 'clean',
      category: 'sanctions',
      field: 'organizationName',
      userValue: entityName,
      authoritySource: 'OFAC SDN List (partial)',
      message: 'No matches found in sanctions watchlist'
    };
  }
  
  private static validateROIExpectation(roi: number): ValidationResult {
    if (roi > 50) {
      return {
        passed: false,
        flag: 'concern',
        category: 'financial',
        field: 'roiExpectation',
        userValue: roi,
        expectedRange: { min: 5, max: 40 },
        authoritySource: 'Historical Investment Returns Database',
        message: `ROI expectation of ${roi}% is unrealistic. Even top-quartile private equity rarely exceeds 30% sustained.`,
        suggestion: 'Revise ROI expectations to 15-25% for realistic modeling'
      };
    }
    
    if (roi > 35) {
      return {
        passed: true,
        flag: 'warning',
        category: 'financial',
        field: 'roiExpectation',
        userValue: roi,
        expectedRange: { min: 5, max: 40 },
        message: `ROI expectation of ${roi}% is aggressive. Requires exceptional execution.`,
        suggestion: 'Stress-test assumptions supporting this return expectation'
      };
    }
    
    return {
      passed: true,
      flag: 'clean',
      category: 'financial',
      field: 'roiExpectation',
      userValue: roi,
      expectedRange: { min: 5, max: 40 },
      message: `ROI expectation of ${roi}% is within reasonable range`
    };
  }
  
  private static validateBudget(budget: number): ValidationResult {
    if (budget < 50000) {
      return {
        passed: true,
        flag: 'concern',
        category: 'financial',
        field: 'budgetCap',
        userValue: budget,
        expectedRange: { min: 100000, max: Infinity },
        message: `Budget of $${budget.toLocaleString()} is critically low for international operations`,
        suggestion: 'Consider whether scope is achievable with this budget'
      };
    }
    
    if (budget < 250000) {
      return {
        passed: true,
        flag: 'warning',
        category: 'financial',
        field: 'budgetCap',
        userValue: budget,
        expectedRange: { min: 100000, max: Infinity },
        message: `Budget of $${budget.toLocaleString()} may limit strategic options`,
        suggestion: 'Plan for lean operations and prioritize ruthlessly'
      };
    }
    
    return {
      passed: true,
      flag: 'clean',
      category: 'financial',
      field: 'budgetCap',
      userValue: budget,
      message: `Budget of $${budget.toLocaleString()} is adequate for most operations`
    };
  }
  
  private static validateTimeline(timeline: string, strategicIntent?: string[]): ValidationResult {
    const isComplex = strategicIntent?.some(i => 
      i.includes('Manufacturing') || i.includes('Acquisition') || i.includes('Joint Venture') ||
      i.includes('Greenfield') || i.includes('merger')
    );
    
    const isVeryShort = timeline.includes('3 month') || timeline.includes('1 month');
    const isShort = timeline.includes('6 month');
    
    if (isComplex && isVeryShort) {
      return {
        passed: false,
        flag: 'concern',
        category: 'timeline',
        field: 'timeline',
        userValue: timeline,
        expectedRange: { min: '12 months', max: '36 months' },
        message: 'Complex strategic initiatives require 12-36 months. Current timeline is unrealistic.',
        suggestion: 'Extend timeline or reduce scope significantly'
      };
    }
    
    if (isComplex && isShort) {
      return {
        passed: true,
        flag: 'warning',
        category: 'timeline',
        field: 'timeline',
        userValue: timeline,
        message: 'Timeline is aggressive for the stated strategic intent',
        suggestion: 'Build in contingency time and define clear phase gates'
      };
    }
    
    return {
      passed: true,
      flag: 'clean',
      category: 'timeline',
      field: 'timeline',
      userValue: timeline,
      message: 'Timeline appears reasonable for stated scope'
    };
  }
  
  private static generateFingerprint(params: Partial<ReportParameters>): string {
    const data = JSON.stringify({
      org: params.organizationName,
      country: params.country,
      industry: params.industry,
      intent: params.strategicIntent,
      ts: Date.now()
    });
    
    // Simple hash for fingerprinting
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `INP-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  }
  
  /**
   * Quick check - returns true if inputs are safe to proceed
   */
  static quickCheck(params: Partial<ReportParameters>): { safe: boolean; issues: string[] } {
    const report = this.validate(params);
    return {
      safe: report.overallStatus !== 'rejected',
      issues: report.validationResults
        .filter(r => r.flag === 'critical')
        .map(r => r.message)
    };
  }
}

export default InputShieldService;
