/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * METHODOLOGY KNOWLEDGE BASE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The internal reference library. When the system encounters a question,
 * it checks this knowledge base BEFORE reaching for external sources.
 *
 * This is the "parent" knowledge — accumulated from decades of documented
 * practice. The system looks here first, reaches outward only when this
 * is insufficient.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MethodologyEntry {
  id: string;
  domain: string;
  principle: string;
  stableForYears: number;
  applicableCountries: number;
  description: string;
  keyInsights: string[];
  commonMistakes: string[];
  whatAlwaysWorks: string[];
  whatNeverWorks: string[];
  standardTimelines: Record<string, string>;
  standardCostRanges: Record<string, string>;
  governmentBehaviourPattern: string;
  investorBehaviourPattern: string;
}

export interface CountryIntelligence {
  country: string;
  region: string;
  investmentFramework: string;
  keyAgencies: string[];
  incentiveStructure: string;
  typicalTimeline: string;
  knownChallenges: string[];
  whatWorksHere: string[];
  historicalContext: string;
}

export interface SectorIntelligence {
  sector: string;
  globalTrend: string;
  emergingMarketContext: string;
  typicalInvestmentRange: string;
  standardStructure: string;
  regulatoryPattern: string;
  knownRisks: string[];
  successFactors: string[];
}

// ============================================================================
// METHODOLOGY KNOWLEDGE BASE
// ============================================================================

export class MethodologyKnowledgeBase {

  // ──────────────────────────────────────────────────────────────────────────
  // CORE METHODOLOGY ENTRIES
  // ──────────────────────────────────────────────────────────────────────────

  private static METHODOLOGIES: MethodologyEntry[] = [
    {
      id: 'METH-001',
      domain: 'Investment Attraction',
      principle: 'Incentive packages follow universal structure: tax holidays, import duty exemptions, simplified registration, and infrastructure support.',
      stableForYears: 58,
      applicableCountries: 140,
      description: 'Every country that actively seeks foreign investment uses the same structural toolkit. The specific rates vary; the structure does not.',
      keyInsights: [
        'Tax holiday duration is the primary negotiation variable (typically 4-8 years)',
        'Import duty exemptions on capital equipment are near-universal',
        'Tiered incentives (higher for less-developed areas) are standard practice',
        'Performance-based incentives (employment targets, export ratios) are gaining ground',
        'Incentive regimes are reviewed every 5-10 years but structural changes are rare',
      ],
      commonMistakes: [
        'Assuming incentives are unique to one country when they are standard globally',
        'Overvaluing tax holidays without considering effective tax rate post-holiday',
        'Ignoring regulatory compliance costs that offset incentive value',
        'Failing to negotiate beyond the published incentive schedule',
      ],
      whatAlwaysWorks: [
        'Requesting incentive comparison across competing locations',
        'Negotiating timeline extensions for significant employment creation',
        'Structuring phased investment to maximise incentive utilisation',
        'Engaging with investment promotion agency early in process',
      ],
      whatNeverWorks: [
        'Assuming published incentives apply automatically without application',
        'Expecting incentives alone to compensate for poor infrastructure',
        'Treating incentive regimes as permanent — they all have sunset provisions',
        'Ignoring local content requirements attached to incentive packages',
      ],
      standardTimelines: {
        'Application to approval': '2-6 months',
        'Approval to first benefit realisation': '3-12 months',
        'Total incentive period': '4-8 years typical, up to 15 for strategic projects',
        'Renewal/review cycle': '5-10 years',
      },
      standardCostRanges: {
        'Application and registration': '$5,000 - $50,000',
        'Compliance and reporting': '$10,000 - $30,000/year',
        'Professional advisory (legal/tax)': '$20,000 - $100,000',
      },
      governmentBehaviourPattern: 'Governments will always start with the standard published package. Everything beyond that requires negotiation leverage — typically employment commitments, technology transfer, or strategic sector alignment.',
      investorBehaviourPattern: 'Investors compare 3-5 competing locations and use incentive packages as a tiebreaker rather than a primary selection criterion. Infrastructure and labour availability dominate the decision.',
    },
    {
      id: 'METH-002',
      domain: 'Regional Development Planning',
      principle: 'Medium-term plans with sectoral breakdown, regional allocation, and infrastructure prioritisation. The framework has not changed since the 1960s.',
      stableForYears: 63,
      applicableCountries: 120,
      description: 'Every developing and middle-income country produces medium-term development plans that follow the same structure. The names and administration labels change; the methodology persists.',
      keyInsights: [
        'Plan cycles are 5-6 years, tied to political terms',
        'Sectoral categories are always: agriculture, industry, services, infrastructure',
        'Decentralisation is always stated as a goal; centralisation is the persistent reality',
        'Growth centre designation is universal — growth pole theory from the 1950s',
        'Regional disparity measurements use the same GRDP-per-capita methodology globally',
      ],
      commonMistakes: [
        'Treating each new plan as a genuine departure from the previous one',
        'Assuming stated decentralisation goals will materialise in budget allocations',
        'Overlooking that infrastructure priorities follow political, not purely economic, logic',
        'Ignoring subnational development plans which often carry more operational relevance',
      ],
      whatAlwaysWorks: [
        'Aligning project proposals with the current administration plan language',
        'Engaging with regional development councils, not just national agencies',
        'Referencing specific plan targets and KPIs in project documentation',
        'Building on existing infrastructure corridors rather than proposing new ones',
      ],
      whatNeverWorks: [
        'Expecting a new administration to continue the previous one\'s specific projects',
        'Treating national plan targets as guaranteed budget commitments',
        'Assuming regional offices have the same authority as national offices',
        'Proposing projects that contradict the current plan priorities, regardless of merit',
      ],
      standardTimelines: {
        'Plan preparation': '12-18 months before term start',
        'Plan validity': '5-6 years',
        'Mid-term review': 'Year 3',
        'Project pipeline inclusion': '6-12 months lead time required',
      },
      standardCostRanges: {
        'Feasibility study': '$50,000 - $500,000',
        'Environmental impact assessment': '$30,000 - $200,000',
        'Project preparation facility': '$100,000 - $2M',
      },
      governmentBehaviourPattern: 'New administrations rebrand predecessor programmes but rarely abandon the underlying projects or methodologies. Alignment with current branding is essential for approval.',
      investorBehaviourPattern: 'Investors who reference the development plan in their proposals get faster approvals. The plan is the vocabulary of government decision-making.',
    },
    {
      id: 'METH-003',
      domain: 'Due Diligence and Feasibility',
      principle: 'The components of a feasibility study have been standardised since the UNIDO methodology of the 1970s.',
      stableForYears: 50,
      applicableCountries: 150,
      description: 'Market analysis, technical feasibility, financial projections, risk assessment, environmental impact, social impact, institutional analysis. This structure is universal.',
      keyInsights: [
        'UNIDO feasibility study format is the global standard, still',
        'World Bank and ADB require the same components with minor variations',
        'Private sector due diligence follows the same structure under different labels',
        'Financial projections always require base, optimistic, and pessimistic scenarios',
        'Environmental and social impact assessment requirements are converging globally',
      ],
      commonMistakes: [
        'Inventing a new feasibility structure when the standard is established and expected',
        'Underestimating the time and cost of a proper feasibility study',
        'Treating financial projections as single-point estimates rather than ranges',
        'Omitting institutional/governance analysis — the section most likely to kill a project',
      ],
      whatAlwaysWorks: [
        'Following the UNIDO structure — reviewers expect it',
        'Including sensitivity analysis showing what breaks the project',
        'Producing executive summaries that stand alone as decision documents',
        'Getting independent verification of key market assumptions',
      ],
      whatNeverWorks: [
        'Submitting feasibility studies without financial projections',
        'Using only optimistic scenarios',
        'Omitting risk assessment or treating risks as unlikely',
        'Producing feasibility studies longer than 100 pages without clear executive summary',
      ],
      standardTimelines: {
        'Pre-feasibility': '4-8 weeks',
        'Full feasibility': '3-6 months',
        'Environmental assessment': '4-12 months',
        'Review and approval': '2-6 months after submission',
      },
      standardCostRanges: {
        'Pre-feasibility study': '$20,000 - $80,000',
        'Full feasibility study': '$100,000 - $500,000',
        'Environmental impact assessment': '$50,000 - $300,000',
        'Independent verification': '$30,000 - $100,000',
      },
      governmentBehaviourPattern: 'Government reviewers check feasibility studies against the expected format. Missing sections trigger immediate rejection or delay, regardless of project quality.',
      investorBehaviourPattern: 'Institutional investors will not proceed without a feasibility study that meets international standards. The format matters as much as the content.',
    },
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // COUNTRY INTELLIGENCE PROFILES
  // ──────────────────────────────────────────────────────────────────────────

  private static COUNTRIES: CountryIntelligence[] = [
    {
      country: 'Philippines',
      region: 'Southeast Asia',
      investmentFramework: 'CREATE Act (2021), BOI Strategic Investment Priorities Plan, PEZA for zone-based investments',
      keyAgencies: ['Board of Investments (BOI)', 'PEZA', 'NEDA', 'BSP', 'SEC'],
      incentiveStructure: '4-7 year income tax holiday for registered projects; enhanced deductions; customs duty exemptions for capital equipment',
      typicalTimeline: 'BOI registration: 2-4 months. PEZA registration: 3-6 months. Full operational setup: 6-18 months.',
      knownChallenges: [
        'Infrastructure quality outside Metro Manila and CALABARZON',
        'Regulatory complexity across national, regional, and LGU levels',
        'Foreign ownership restrictions in certain sectors (60/40 rule)',
        'Power costs among highest in ASEAN',
      ],
      whatWorksHere: [
        'IT-BPM sector — Philippines is #2 globally',
        'Engaging with LGU leadership directly for local permits',
        'Aligning with PDP (Philippine Development Plan) priorities for faster approval',
        'Export-oriented manufacturing in PEZA zones for simplified customs',
      ],
      historicalContext: 'Regional development planning since 1963. 12 administrative regions (1972), expanded to 17. Growth centre strategy has consistently favoured NCR-adjacent regions. IT-BPM emerged 2000s as genuine regional employment driver.',
    },
    {
      country: 'Vietnam',
      region: 'Southeast Asia',
      investmentFramework: 'Investment Law (2020), Special investment incentives for priority sectors and locations',
      keyAgencies: ['Ministry of Planning and Investment', 'Provincial People\'s Committees', 'Agency for Enterprise Development'],
      incentiveStructure: '2-4 year tax exemption, 50% reduction for 4-9 following years; land rental exemptions in industrial zones',
      typicalTimeline: 'Investment registration certificate: 15-45 days (fast by ASEAN standards). Full setup: 3-12 months.',
      knownChallenges: [
        'Land use rights system (no private land ownership)',
        'Labour cost escalation in established zones (Ho Chi Minh City, Hanoi)',
        'Intellectual property enforcement improving but inconsistent',
        'Dual approval system (national + provincial) for larger investments',
      ],
      whatWorksHere: [
        'Manufacturing for export — electronics, textiles, food processing',
        'Locating in second-tier provinces for better incentives and lower costs',
        'Samsung, Intel supply chain proximity for electronics sector',
        'Infrastructure improvement trajectory — rapid multi-year improvement',
      ],
      historicalContext: 'Doi Moi economic reforms (1986). Rapid industrialisation model. Growth concentrated in Hanoi-Hai Phong and Ho Chi Minh City corridors. Second-tier cities emerging as competitive alternatives.',
    },
    {
      country: 'Indonesia',
      region: 'Southeast Asia',
      investmentFramework: 'Omnibus Law on Job Creation (2020), Positive Investment List replacing Negative Investment List',
      keyAgencies: ['BKPM (Investment Coordinating Board)', 'Ministry of Investment', 'Special Economic Zone Councils'],
      incentiveStructure: 'Tax holiday 5-20 years for pioneer industries; tax allowance (30% of investment deducted over 6 years); SEZ fiscal incentives',
      typicalTimeline: 'OSS (Online Single Submission) registration: 1-3 months. Full operational: 6-24 months depending on sector and location.',
      knownChallenges: [
        'Decentralisation has created regulatory fragmentation across 34 provinces',
        'Logistics costs high due to archipelago geography',
        'Labour regulations vary significantly by province',
        'Nickel downstreaming policy creating export restrictions',
      ],
      whatWorksHere: [
        'Resource-based processing (nickel, palm oil, rubber)',
        'Digital economy — Gojek, Tokopedia demonstrate market size',
        'Engaging with provincial governments for operational permits',
        'Java-centric initially, then expanding to resource-rich outer islands',
      ],
      historicalContext: 'Guided economy (1966-1998). Reformasi and decentralisation post-1998. Omnibus Law (2020) represents most significant regulatory reform in decades. Infrastructure push under current administration.',
    },
    {
      country: 'Australia',
      region: 'Oceania',
      investmentFramework: 'FIRB (Foreign Investment Review Board) screening, state-level investment attraction programmes',
      keyAgencies: ['Austrade', 'FIRB', 'State Investment Agencies (Invest NSW, Invest Victoria, etc.)'],
      incentiveStructure: 'Limited federal tax incentives; state-level payroll tax reductions, land deals, infrastructure co-investment; R&D tax incentive (43.5% refundable offset)',
      typicalTimeline: 'FIRB approval: 30-90 days. State-level negotiation: 2-6 months. Operational setup: 3-12 months.',
      knownChallenges: [
        'High labour costs relative to ASEAN',
        'Small domestic market (26M population)',
        'Regional areas face workforce attraction challenges',
        'Regulatory compliance standards high; compliance costs significant for international entrants',
      ],
      whatWorksHere: [
        'Regional Australia has genuine opportunity gaps and willing local government',
        'R&D tax incentive is globally competitive for innovation-oriented investments',
        'Critical minerals processing — government actively seeking investment',
        'Agricultural technology and food processing for export to Asia',
      ],
      historicalContext: 'Regional development has been a persistent challenge. Population concentrated in 5 coastal capitals. Regional Development Australia network provides local coordination. Skills shortage in regional areas is the primary constraint.',
    },
    {
      country: 'New Zealand',
      region: 'Oceania',
      investmentFramework: 'Overseas Investment Act (2005, amended 2021), Callaghan Innovation grants, Regional Growth Fund',
      keyAgencies: ['NZTE', 'Callaghan Innovation', 'Regional Economic Development agencies'],
      incentiveStructure: 'Limited tax incentives; R&D tax credit (15%); Provincial Growth Fund for regional projects; co-investment through NZGCP',
      typicalTimeline: 'OIO consent (if required): 2-6 months. Setup: 2-8 months.',
      knownChallenges: [
        'Very small domestic market (5.1M population)',
        'Geographic isolation adds logistics cost',
        'Overseas investment screening for sensitive land and significant business assets',
        'Skilled labour shortages in technical and specialist roles',
      ],
      whatWorksHere: [
        'Agricultural technology and premium food/beverage',
        'Renewable energy — high percentage of renewable electricity',
        'Regional councils actively seeking industry diversification',
        'Strong intellectual property protection and rule of law',
      ],
      historicalContext: 'Economic reforms from 1984 onwards. Regional economic development via regional councils and economic development agencies. Tourism-dependent regions diversifying post-COVID.',
    },
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // SECTOR INTELLIGENCE
  // ──────────────────────────────────────────────────────────────────────────

  private static SECTORS: SectorIntelligence[] = [
    {
      sector: 'Renewable Energy',
      globalTrend: 'Solar and wind costs have fallen 85-90% since 2010. Grid parity achieved in most markets. Battery storage emerging as next cost curve.',
      emergingMarketContext: 'Emerging markets represent 70% of projected clean energy investment growth. Rural electrification and industrial decarbonisation driving demand.',
      typicalInvestmentRange: '$5M-$500M per project depending on technology and capacity',
      standardStructure: 'Project finance with 70-80% debt, 20-30% equity. Power Purchase Agreement (PPA) as revenue anchor. EPC contractor for construction.',
      regulatoryPattern: 'Feed-in tariffs giving way to competitive auctions. Grid connection approval is the primary regulatory bottleneck.',
      knownRisks: [
        'Grid curtailment when generation exceeds transmission capacity',
        'PPA counterparty credit risk in emerging markets',
        'Land acquisition and community consent timelines',
        'Technology obsolescence risk for 20-25 year project life',
      ],
      successFactors: [
        'Secured grid connection agreement before financial close',
        'Creditworthy PPA offtaker (utility or corporate)',
        'Local community engagement from project initiation',
        'Proven EPC contractor with regional track record',
      ],
    },
    {
      sector: 'IT-BPM / Business Process Outsourcing',
      globalTrend: 'Global market $350B+. Shifting from cost arbitrage to value-added services. AI augmentation replacing low-end process work.',
      emergingMarketContext: 'Philippines (#2), India (#1), Vietnam (emerging). English proficiency, timezone compatibility, and cultural affinity are key differentiators.',
      typicalInvestmentRange: '$500K-$50M for seat capacity buildout',
      standardStructure: 'Build-own-operate or lease from developer. Revenue based on FTE pricing ($800-$2,500/month per agent depending on complexity).',
      regulatoryPattern: 'PEZA/BOI registration for tax incentives. Data privacy compliance (local + client jurisdiction). Labour law compliance for shift work.',
      knownRisks: [
        'Attrition rates 25-40% annually in mature markets',
        'Salary escalation 8-12% annually in competitive locations',
        'AI/automation displacement of routine process work',
        'Single-client concentration risk',
      ],
      successFactors: [
        'Location in tier-2 city with university pipeline',
        'Multi-client portfolio from year 2',
        'Investment in employee development and retention programmes',
        'Compliance infrastructure for data privacy from day one',
      ],
    },
    {
      sector: 'Agriculture and Agribusiness',
      globalTrend: 'Global food demand growing 1.5-2% annually. Precision agriculture, vertical farming, and supply chain traceability are transformation vectors.',
      emergingMarketContext: 'Smallholder fragmentation limits productivity. Aggregation, cold chain, and market access are the primary intervention points.',
      typicalInvestmentRange: '$100K-$50M depending on value chain position',
      standardStructure: 'Contract farming, cooperative aggregation, or direct operation. Revenue from commodity sales, processing margin, or export premium.',
      regulatoryPattern: 'Land use regulations, export permits, food safety certification (HACCP/GlobalGAP), phytosanitary requirements for export.',
      knownRisks: [
        'Weather and climate variability — the fundamental agricultural risk',
        'Price volatility for commodity crops',
        'Land tenure uncertainty in reform-affected areas',
        'Post-harvest loss (20-40% in emerging markets)',
      ],
      successFactors: [
        'Secured offtake agreement or market access before production',
        'Cold chain and logistics infrastructure investment',
        'Compliance with export destination food safety standards',
        'Smallholder integration with fair pricing mechanisms',
      ],
    },
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // QUERY METHODS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Look up methodology for a given domain.
   */
  static findMethodology(domain: string): MethodologyEntry | undefined {
    const lower = domain.toLowerCase();
    return this.METHODOLOGIES.find(m =>
      m.domain.toLowerCase().includes(lower) ||
      m.principle.toLowerCase().includes(lower)
    );
  }

  /**
   * Get all methodology entries.
   */
  static getAllMethodologies(): MethodologyEntry[] {
    return [...this.METHODOLOGIES];
  }

  /**
   * Look up country intelligence.
   */
  static findCountry(country: string): CountryIntelligence | undefined {
    const lower = country.toLowerCase();
    return this.COUNTRIES.find(c => c.country.toLowerCase() === lower);
  }

  /**
   * Get all country profiles.
   */
  static getAllCountries(): CountryIntelligence[] {
    return [...this.COUNTRIES];
  }

  /**
   * Look up sector intelligence.
   */
  static findSector(sector: string): SectorIntelligence | undefined {
    const lower = sector.toLowerCase();
    return this.SECTORS.find(s =>
      s.sector.toLowerCase().includes(lower) ||
      lower.includes(s.sector.toLowerCase().split('/')[0].trim())
    );
  }

  /**
   * Get all sector profiles.
   */
  static getAllSectors(): SectorIntelligence[] {
    return [...this.SECTORS];
  }

  /**
   * Comprehensive lookup: given report parameters, return all
   * relevant internal knowledge (methodology + country + sector).
   */
  static lookupAll(params: { country?: string; industry?: string[]; problemStatement?: string }): {
    methodologies: MethodologyEntry[];
    countryIntel: CountryIntelligence | undefined;
    sectorIntel: SectorIntelligence[];
    internalKnowledgeAvailable: boolean;
  } {
    const countryIntel = params.country ? this.findCountry(params.country) : undefined;

    const sectorIntel: SectorIntelligence[] = [];
    if (params.industry) {
      for (const ind of params.industry) {
        const found = this.findSector(ind);
        if (found) sectorIntel.push(found);
      }
    }

    // Find applicable methodologies from problem statement
    const methodologies: MethodologyEntry[] = [];
    const problemLower = (params.problemStatement || '').toLowerCase();
    for (const meth of this.METHODOLOGIES) {
      const keywords = meth.domain.toLowerCase().split(' ');
      if (keywords.some(kw => problemLower.includes(kw))) {
        methodologies.push(meth);
      }
    }

    // Also add methodologies that contextually apply
    if (countryIntel) {
      // Regional development always applies when a country is selected
      const rdp = this.METHODOLOGIES.find(m => m.id === 'METH-002');
      if (rdp && !methodologies.includes(rdp)) methodologies.push(rdp);
    }

    return {
      methodologies,
      countryIntel,
      sectorIntel,
      internalKnowledgeAvailable: methodologies.length > 0 || !!countryIntel || sectorIntel.length > 0,
    };
  }

  /**
   * Generate a knowledge briefing for the user — what the system
   * already knows before the user tells it anything.
   */
  static generateKnowledgeBriefing(params: { country?: string; industry?: string[] }): string {
    const lookup = this.lookupAll(params);
    const lines: string[] = [];

    if (!lookup.internalKnowledgeAvailable) {
      return 'The knowledge base does not have specific embedded intelligence for this combination. Standard analytical methods will be applied.';
    }

    lines.push('**Internal Knowledge Assessment**\n');

    if (lookup.countryIntel) {
      const c = lookup.countryIntel;
      lines.push(`**${c.country} (${c.region})**`);
      lines.push(`Framework: ${c.investmentFramework}`);
      lines.push(`Typical timeline: ${c.typicalTimeline}`);
      lines.push(`Key agencies: ${c.keyAgencies.join(', ')}`);
      lines.push(`What works: ${c.whatWorksHere.slice(0, 2).join('; ')}`);
      lines.push(`Challenges: ${c.knownChallenges.slice(0, 2).join('; ')}`);
      lines.push('');
    }

    for (const s of lookup.sectorIntel) {
      lines.push(`**${s.sector}**`);
      lines.push(`Global trend: ${s.globalTrend.substring(0, 120)}...`);
      lines.push(`Investment range: ${s.typicalInvestmentRange}`);
      lines.push(`Key risks: ${s.knownRisks.slice(0, 2).join('; ')}`);
      lines.push('');
    }

    for (const m of lookup.methodologies) {
      lines.push(`**Methodology: ${m.domain}** (stable ${m.stableForYears} years, ${m.applicableCountries} countries)`);
      lines.push(`Principle: ${m.principle.substring(0, 150)}...`);
      lines.push('');
    }

    return lines.join('\n');
  }
}
