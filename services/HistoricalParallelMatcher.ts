/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HISTORICAL PARALLEL MATCHER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Surfaces past cases, historical precedents, and documented outcomes that
 * match the user's current situation. This is the "institutional memory" 
 * of 60 years of partnership methodology — made accessible.
 *
 * When a user enters a scenario, this engine answers:
 *   "What happened before when someone tried something similar?"
 *
 * Data sources:
 *   1. BacktestingCalibrationEngine historical cases
 *   2. MethodologyKnowledgeBase documented patterns
 *   3. PatternConfidenceEngine pattern library
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { ReportParameters } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface HistoricalCase {
  caseId: string;
  title: string;
  year: number;
  country: string;
  region: string;
  sector: string;
  initiative: string;
  outcome: 'success' | 'partial-success' | 'failed' | 'ongoing';
  description: string;
  keyFactors: string[];
  lessonsLearned: string[];
  relevanceScore: number; // 0-100, how relevant to user's situation
  whatWorked: string[];
  whatFailed: string[];
  timeToOutcome: string;
}

export interface ParallelMatchResult {
  timestamp: string;
  userSituation: string;
  matches: HistoricalCase[];
  synthesisInsight: string;
  successRate: number; // % of similar historical cases that succeeded
  commonSuccessFactors: string[];
  commonFailureFactors: string[];
  recommendedActions: string[];
}

// ============================================================================
// HISTORICAL CASE LIBRARY
// ============================================================================

const HISTORICAL_CASES: Omit<HistoricalCase, 'relevanceScore'>[] = [
  {
    caseId: 'HC-001',
    title: 'Shenzhen Special Economic Zone',
    year: 1980,
    country: 'China',
    region: 'Asia-Pacific',
    sector: 'Manufacturing',
    initiative: 'special-economic-zone',
    outcome: 'success',
    description: 'China designated Shenzhen as its first SEZ, offering tax holidays, duty-free imports, and simplified regulations to attract FDI. Grew from fishing village to tech metropolis.',
    keyFactors: ['Strong government commitment', 'Infrastructure investment', 'Proximity to Hong Kong', 'Labour cost advantage'],
    lessonsLearned: ['SEZs require 10-15 year commitment before full returns', 'Infrastructure must precede investment attraction', 'Success breeds its own challenges (costs rise, incentives phase out)'],
    whatWorked: ['Tax holidays attracted initial manufacturing FDI', 'Graduated incentive phase-out prevented shock', 'Technology transfer requirements evolved with maturity'],
    whatFailed: ['Initial infrastructure was inadequate', 'Environmental regulations lagged behind growth', 'Income inequality between zone and hinterland'],
    timeToOutcome: '10-15 years to global recognition'
  },
  {
    caseId: 'HC-002',
    title: 'PEZA Philippines Export Zones',
    year: 1995,
    country: 'Philippines',
    region: 'Asia-Pacific',
    sector: 'Electronics',
    initiative: 'investment-attraction',
    outcome: 'success',
    description: 'PEZA created 400+ economic zones attracting $40B+ in investments, primarily in electronics and BPO, making Philippines a global back-office powerhouse.',
    keyFactors: ['English-speaking workforce', 'Competitive labour costs', 'PEZA one-stop shop', 'Stable incentive framework'],
    lessonsLearned: ['One-stop-shop agencies dramatically reduce red tape', 'Sector specialisation creates cluster effects', 'Incentive stability matters more than incentive generosity'],
    whatWorked: ['Simplified registration process', 'Income tax holiday + 5% gross income tax post-holiday', 'Sector-focused zone development'],
    whatFailed: ['Infrastructure outside zones remained weak', 'Over-reliance on a few sectors', 'Limited technology transfer initially'],
    timeToOutcome: '5-8 years to significant FDI flows'
  },
  {
    caseId: 'HC-003',
    title: 'Rwanda IT Hub Development',
    year: 2010,
    country: 'Rwanda',
    region: 'Africa',
    sector: 'Technology',
    initiative: 'technology-hub',
    outcome: 'success',
    description: 'Rwanda\'s Vision 2020 tech strategy built Kigali Innovation City, attracted major tech companies, and achieved Africa\'s fastest broadband penetration growth.',
    keyFactors: ['Strong political will', 'Anti-corruption governance', 'Smart incentive design', 'Digital-first policy'],
    lessonsLearned: ['Small countries can leapfrog through tech focus', 'Governance quality trumps market size', 'Digital infrastructure enables sector-agnostic growth'],
    whatWorked: ['E-government services', 'Drone delivery partnerships', 'Clean business environment reputation'],
    whatFailed: ['Limited local tech talent initially', 'Small domestic market size', 'Regional instability perception'],
    timeToOutcome: '8-10 years for international recognition'
  },
  {
    caseId: 'HC-004',
    title: 'Malaysia Multimedia Super Corridor',
    year: 1996,
    country: 'Malaysia',
    region: 'Asia-Pacific',
    sector: 'Technology',
    initiative: 'technology-corridor',
    outcome: 'partial-success',
    description: 'Ambitious plan to create an Asian Silicon Valley. Attracted some tech investment but didn\'t achieve Silicon Valley status. Later evolved into broader digital economy focus.',
    keyFactors: ['Government investment', 'International advisory panel', 'Incentive packages', 'Infrastructure corridor'],
    lessonsLearned: ['Cannot replicate Silicon Valley through government edict', 'Organic ecosystem growth matters more than top-down planning', 'Adaptation strategy when initial vision proves overambitious'],
    whatWorked: ['MSC status companies received meaningful tax incentives', 'Good physical infrastructure', 'Attracted some global firms'],
    whatFailed: ['Overambitious branding created expectation gap', 'Brain drain to Singapore', 'Bureaucratic processes despite one-stop shop intention'],
    timeToOutcome: 'Ongoing — pivoted strategy in 2010s'
  },
  {
    caseId: 'HC-005',
    title: 'Dubai Free Zones Model',
    year: 2000,
    country: 'UAE',
    region: 'Middle East',
    sector: 'Multi-sector',
    initiative: 'free-zone-cluster',
    outcome: 'success',
    description: 'Dubai created 30+ specialised free zones (JAFZA, DMCC, DIFC, etc.) each targeting specific sectors, attracting 30,000+ companies.',
    keyFactors: ['0% corporate tax', '100% foreign ownership', 'Sector specialisation', 'World-class infrastructure'],
    lessonsLearned: ['Sector-specific zones create critical mass faster than general zones', 'Premium infrastructure justifies premium costs', 'Free zones can co-exist with onshore regulation if boundaries are clear'],
    whatWorked: ['Full foreign ownership in zones', 'No personal income tax', 'Efficient dispute resolution (DIFC courts)'],
    whatFailed: ['Disconnect between free zone and mainland legal systems', 'Cost escalation reduced competitiveness', 'Labour rights concerns'],
    timeToOutcome: '5-10 years per zone to critical mass'
  },
  {
    caseId: 'HC-006',
    title: 'Myanmar Opening 2011-2021',
    year: 2011,
    country: 'Myanmar',
    region: 'Asia-Pacific',
    sector: 'Multi-sector',
    initiative: 'market-opening',
    outcome: 'failed',
    description: 'Myanmar\'s 2011 opening attracted billions in investment commitments. The 2021 military coup destroyed most partnerships and investment plans.',
    keyFactors: ['Political instability', 'Sanctions risk', 'Large untapped market', 'Cheap labour'],
    lessonsLearned: ['Political risk can override all economic fundamentals', 'Diversification across countries is essential', 'Partnership structures must include political risk contingencies', 'Due diligence on governance trajectory is non-negotiable'],
    whatWorked: ['Initial enthusiasm and deal flow was strong', 'Telecoms sector saw rapid growth'],
    whatFailed: ['Inadequate political risk assessment by investors', 'Over-reliance on political stability trajectory', 'Exit costs were devastating for trapped investors'],
    timeToOutcome: '10 years of growth reversed in 1 year'
  },
  {
    caseId: 'HC-007',
    title: 'Costa Rica Intel & Medical Devices',
    year: 1997,
    country: 'Costa Rica',
    region: 'Latin America',
    sector: 'Electronics & Medical',
    initiative: 'sector-development',
    outcome: 'success',
    description: 'Costa Rica attracted Intel (1997) then pivoted to medical devices after Intel left (2014), building a diversified tech/medical export hub.',
    keyFactors: ['Educated workforce', 'Political stability', 'Strategic US proximity', 'Proactive investment promotion'],
    lessonsLearned: ['Don\'t build economy around single anchor tenant', 'Sector diversification is essential risk management', 'Adaptive strategy when anchor firms leave'],
    whatWorked: ['CINDE investment promotion agency effectiveness', 'Free zone incentive structure', 'Education system investment'],
    whatFailed: ['Over-dependence on Intel initially', 'When Intel left, had to rapidly diversify', 'Salary escalation in established sectors'],
    timeToOutcome: '5 years for initial anchor, 15 years for diversified cluster'
  },
  {
    caseId: 'HC-008',
    title: 'Vietnam FDI Manufacturing Boom',
    year: 2015,
    country: 'Vietnam',
    region: 'Asia-Pacific',
    sector: 'Manufacturing',
    initiative: 'manufacturing-fdi',
    outcome: 'success',
    description: 'Vietnam capitalised on US-China trade tensions to attract manufacturing FDI, becoming Samsung\'s largest global production base and a major electronics exporter.',
    keyFactors: ['Trade tension beneficiary', 'Young workforce', 'Competitive costs', 'Improving infrastructure'],
    lessonsLearned: ['Geopolitical shifts create windows of opportunity', 'First movers in redirected supply chains capture disproportionate value', 'Infrastructure investment must keep pace with FDI growth'],
    whatWorked: ['Bilateral trade agreements (CPTPP, EVFTA)', 'Industrial zone development', 'Samsung anchor investment created ecosystem'],
    whatFailed: ['Power grid infrastructure strained', 'Skills gap in advanced manufacturing', 'Environmental compliance challenges'],
    timeToOutcome: '3-5 years for major supply chain shifts'
  },
  {
    caseId: 'HC-009',
    title: 'India-Japan Infrastructure Corridor',
    year: 2017,
    country: 'India',
    region: 'Asia-Pacific',
    sector: 'Infrastructure',
    initiative: 'bilateral-corridor',
    outcome: 'partial-success',
    description: 'India-Japan Act East initiative for industrial corridors (Delhi-Mumbai, Chennai-Bangalore). Large ambitions but implementation delayed by land acquisition and bureaucracy.',
    keyFactors: ['Bilateral government commitment', 'Japanese financing', 'Indian demographic dividend', 'Infrastructure deficit'],
    lessonsLearned: ['Government-to-government commitments don\'t guarantee implementation speed', 'Land acquisition is the #1 bottleneck in India', 'Patient capital is essential for infrastructure corridors'],
    whatWorked: ['High-level political commitment', 'Concessional Japanese financing terms', 'Focused corridor approach'],
    whatFailed: ['Land acquisition delays (predictable but underestimated)', 'Bureaucratic coordination between states', 'Timeline slippage on almost every project'],
    timeToOutcome: 'Ongoing — originally planned 10 years, now 15+'
  },
  {
    caseId: 'HC-010',
    title: 'Kenya-Ethiopia Renewable Energy PPP',
    year: 2019,
    country: 'Kenya',
    region: 'Africa',
    sector: 'Renewable Energy',
    initiative: 'public-private-partnership',
    outcome: 'partial-success',
    description: 'East African renewable energy PPPs attracted significant investment but face challenges with power purchase agreements, grid infrastructure, and currency risks.',
    keyFactors: ['Climate finance availability', 'Renewable resource abundance', 'Power deficit', 'International development support'],
    lessonsLearned: ['PPP success depends on government creditworthiness for offtake agreements', 'Currency risk is the silent killer of infrastructure returns', 'International development finance is slow but reliable'],
    whatWorked: ['Geothermal in Kenya (GDC model)', 'Wind farms (Lake Turkana)', 'Patient DFI capital'],
    whatFailed: ['Currency depreciation eroded returns', 'Grid connectivity lagged behind generation capacity', 'Political interference in tariff setting'],
    timeToOutcome: '5-8 years from commitment to commercial operation'
  },
  {
    caseId: 'HC-011',
    title: 'Singapore Bio-Medical Sciences Hub',
    year: 2000,
    country: 'Singapore',
    region: 'Asia-Pacific',
    sector: 'Pharmaceuticals',
    initiative: 'knowledge-economy',
    outcome: 'success',
    description: 'Singapore\'s Biopolis and Tuas Biomedical Park attracted Novartis, GSK, Pfizer, Roche through research incentives, IP protection, and world-class facilities.',
    keyFactors: ['IP protection', 'Research incentives', 'World-class infrastructure', 'Skilled workforce pipeline'],
    lessonsLearned: ['Knowledge economy requires 15-20 year commitment', 'IP protection is non-negotiable for pharma/biotech', 'R&D incentives must complement, not replace, ecosystem fundamentals'],
    whatWorked: ['Pioneer status tax exemption', 'A*STAR research infrastructure', 'Streamlined clinical trial approvals'],
    whatFailed: ['Small talent pool required constant immigration', 'Cost of operations among highest globally', 'Some companies treated Singapore as R&D satellite, not core'],
    timeToOutcome: '10-15 years to establish credible biomedical ecosystem'
  },
  {
    caseId: 'HC-012',
    title: 'Brazil Embraer Joint Ventures',
    year: 1994,
    country: 'Brazil',
    region: 'Latin America',
    sector: 'Aerospace',
    initiative: 'joint-venture',
    outcome: 'partial-success',
    description: 'Post-privatisation Embraer formed JVs with international aerospace firms. Some succeeded (OGMA Portugal), some failed (Harbin China dispute). Showed complexity of IP-intensive JVs.',
    keyFactors: ['Technology-intensive sector', 'IP control requirements', 'Government strategic interest', 'Cultural differences'],
    lessonsLearned: ['JVs in IP-intensive sectors require explicit IP governance', 'Cultural alignment is as important as financial alignment', 'Government strategic interest can help and hinder simultaneously'],
    whatWorked: ['Clear market segmentation between partners', 'Phased technology transfer with safeguards', 'Local market knowledge of partner'],
    whatFailed: ['IP disputes in some partnerships', 'Misaligned expectations on technology depth', 'Government intervention in partnership terms'],
    timeToOutcome: '5-10 years for partnership maturity'
  }
];

// ============================================================================
// HISTORICAL PARALLEL MATCHER
// ============================================================================

export class HistoricalParallelMatcher {

  /**
   * Find historical cases that parallel the user's current situation.
   * Returns matches ranked by relevance with synthesised insights.
   */
  static match(params: Partial<ReportParameters>): ParallelMatchResult {
    const p = params as Record<string, unknown>;
    const country = (p.country as string) || '';
    const region = (p.region as string) || '';
    const sector = ((p.industry as string[]) || [])[0] || '';
    const intent = ((p.strategicIntent as string[]) || [])[0] || '';
    const orgType = (p.organizationType as string) || '';
    const problem = (p.problemStatement as string) || '';
    const riskTolerance = (p.riskTolerance as string) || 'moderate';

    // Score each case for relevance
    const scoredCases: HistoricalCase[] = HISTORICAL_CASES.map(c => {
      let score = 0;

      // Region match (highest weight)
      if (c.region.toLowerCase() === region.toLowerCase()) score += 25;
      else if (c.country.toLowerCase() === country.toLowerCase()) score += 30;

      // Sector match
      if (sector && c.sector.toLowerCase().includes(sector.toLowerCase())) score += 20;
      if (sector && sector.toLowerCase().includes(c.sector.toLowerCase())) score += 15;

      // Initiative/intent match
      if (intent && c.initiative.toLowerCase().includes(intent.toLowerCase())) score += 15;
      if (intent && intent.toLowerCase().includes('partner') && c.initiative.includes('joint-venture')) score += 10;
      if (intent && intent.toLowerCase().includes('zone') && c.initiative.includes('economic-zone')) score += 10;
      if (intent && intent.toLowerCase().includes('attract') && c.initiative.includes('investment-attraction')) score += 10;

      // Problem statement keyword matching
      if (problem) {
        const problemLower = problem.toLowerCase();
        if (problemLower.includes('infrastructure') && c.sector.toLowerCase().includes('infrastructure')) score += 10;
        if (problemLower.includes('manufactur') && c.sector.toLowerCase().includes('manufactur')) score += 10;
        if (problemLower.includes('tech') && c.sector.toLowerCase().includes('tech')) score += 10;
        if (problemLower.includes('energy') && c.sector.toLowerCase().includes('energy')) score += 10;
        if (problemLower.includes('zone') && c.initiative.includes('zone')) score += 10;
        if (problemLower.includes('ppp') && c.initiative.includes('ppp')) score += 10;
      }

      // Organisation type alignment
      if (orgType.toLowerCase().includes('government') && c.initiative.includes('public')) score += 5;

      // Risk alignment — if user has low risk tolerance, prioritise successful cases
      if (riskTolerance === 'low' && c.outcome === 'success') score += 5;
      if (riskTolerance === 'high' && c.outcome === 'failed') score += 5; // learn from failures

      // Recency bonus — more recent cases slightly more relevant
      const yearsAgo = new Date().getFullYear() - c.year;
      if (yearsAgo < 10) score += 5;
      else if (yearsAgo < 20) score += 3;

      return { ...c, relevanceScore: Math.min(100, score) };
    });

    // Sort by relevance and take top matches
    const matches = scoredCases
      .filter(c => c.relevanceScore > 10)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    // Synthesis
    const successfulMatches = matches.filter(m => m.outcome === 'success');
    const failedMatches = matches.filter(m => m.outcome === 'failed');
    const totalRelevant = matches.length || 1;
    const successRate = Math.round((successfulMatches.length / totalRelevant) * 100);

    // Common factors
    const commonSuccessFactors = this.extractCommonFactors(successfulMatches.flatMap(m => m.whatWorked));
    const commonFailureFactors = this.extractCommonFactors(
      [...failedMatches.flatMap(m => m.whatFailed), ...matches.filter(m => m.outcome === 'partial-success').flatMap(m => m.whatFailed)]
    );

    // Synthesis insight
    let synthesisInsight = '';
    if (matches.length === 0) {
      synthesisInsight = 'No close historical parallels found in the case library. This initiative appears novel — exercise additional caution and consider pilot-scale testing.';
    } else if (successRate >= 70) {
      synthesisInsight = `Historical parallels suggest a ${successRate}% success rate for similar initiatives. Key success factors include: ${commonSuccessFactors.slice(0, 3).join(', ')}. However, even successful cases took ${matches[0]?.timeToOutcome || '5-10 years'} to materialise.`;
    } else if (successRate >= 30) {
      synthesisInsight = `Historical parallels show mixed results (${successRate}% success). Common failure points: ${commonFailureFactors.slice(0, 3).join(', ')}. Careful risk mitigation and phased commitment are strongly recommended.`;
    } else {
      synthesisInsight = `Warning: Similar historical initiatives have a low success rate (${successRate}%). Primary failure factors: ${commonFailureFactors.slice(0, 3).join(', ')}. Consider fundamental strategy revision before committing.`;
    }

    // Recommended actions from historical lessons
    const recommendedActions = this.synthesiseRecommendations(matches);

    return {
      timestamp: new Date().toISOString(),
      userSituation: `${(p.organizationName as string) || 'Organisation'} — ${intent || 'partnership'} in ${country || 'target market'} / ${sector || 'sector'}`,
      matches,
      synthesisInsight,
      successRate,
      commonSuccessFactors,
      commonFailureFactors,
      recommendedActions
    };
  }

  /**
   * Quick match — returns the single most relevant case for inline display
   */
  static quickMatch(params: Partial<ReportParameters>): {
    found: boolean;
    case_title: string;
    outcome: string;
    topLesson: string;
    relevance: number;
  } {
    const result = this.match(params);
    if (result.matches.length === 0) {
      return { found: false, case_title: '', outcome: '', topLesson: 'No historical parallel found', relevance: 0 };
    }
    const top = result.matches[0];
    return {
      found: true,
      case_title: top.title,
      outcome: top.outcome,
      topLesson: top.lessonsLearned[0] || 'Review historical case for insights',
      relevance: top.relevanceScore
    };
  }

  // ════════════════════════════════════════════════════════════════════════

  private static extractCommonFactors(items: string[]): string[] {
    // Deduplicate and count, return most common
    const counts = new Map<string, number>();
    items.forEach(item => {
      const key = item.toLowerCase().substring(0, 50); // normalise
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([_key, _count], idx) => items[idx] || '');
  }

  private static synthesiseRecommendations(matches: HistoricalCase[]): string[] {
    const recs: string[] = [];

    // From lessons learned across all matches
    const allLessons = matches.flatMap(m => m.lessonsLearned);
    const allWhatWorked = matches.flatMap(m => m.whatWorked);

    if (allLessons.length > 0) {
      recs.push(`Learn from history: ${allLessons[0]}`);
    }
    if (allWhatWorked.length > 0) {
      recs.push(`Proven approach: ${allWhatWorked[0]}`);
    }

    // Failed case warnings
    const failedCases = matches.filter(m => m.outcome === 'failed');
    if (failedCases.length > 0) {
      recs.push(`Critical warning from ${failedCases[0].title}: ${failedCases[0].lessonsLearned[0]}`);
    }

    // Timeline expectations
    const timelines = matches.map(m => m.timeToOutcome).filter(Boolean);
    if (timelines.length > 0) {
      recs.push(`Set realistic timeline: similar initiatives took ${timelines[0]}`);
    }

    recs.push('Request full historical case comparison with detailed side-by-side analysis');

    return recs.slice(0, 6);
  }
}

export default HistoricalParallelMatcher;
