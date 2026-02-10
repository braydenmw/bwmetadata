import React, { useState } from 'react';
import { ArrowRight, Shield, FileText, Users, Zap, Target, CheckCircle2, Scale, Rocket, Building2, Globe, Layers, Coins, Mail, Phone, Briefcase, TrendingUp, FileCheck, Database, GitBranch, Search, X, Info, Eye, BookOpen, FlaskConical, Brain } from 'lucide-react';
import { researchLocation, type ResearchProgress } from '../services/geminiLocationService';
import { CITY_PROFILES } from '../data/globalLocationProfiles';
import { PatternConfidenceEngine } from '../services/PatternConfidenceEngine';
import { HistoricalParallelMatcher } from '../services/HistoricalParallelMatcher';
import DocumentModal, { type DocumentType } from './LegalDocuments';
// OSINT search removed - using unified location research

// Command Center - Complete BWGA Landing Page

interface CommandCenterProps {
    onEnterPlatform?: () => void;
    onOpenGlobalLocationIntel?: () => void;
    onLocationResearched?: (data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        research: any;
        city: string;
        country: string;
    }) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onEnterPlatform, onOpenGlobalLocationIntel: _onOpenGlobalLocationIntel, onLocationResearched: _onLocationResearched }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [showCatalog, setShowCatalog] = useState(false);
    const [showFormulas, setShowFormulas] = useState(false);
    const [showCaseStudy, setShowCaseStudy] = useState(false);
    const [activeDocument, setActiveDocument] = useState<DocumentType>(null);
    const [activeLayer, setActiveLayer] = useState<number | null>(null);
    const [activeJourneyStep, setActiveJourneyStep] = useState<number>(1);

    // Global Location Intelligence state - LIVE SEARCH
    const [locationQuery, _setLocationQuery] = useState('');
    const [_isResearchingLocation, setIsResearchingLocation] = useState(false);
    const [_researchProgress, setResearchProgress] = useState<ResearchProgress | null>(null);
    const [_locationResult, setLocationResult] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null);
    const [_comparisonCities, setComparisonCities] = useState<Array<{ city: string; country: string; reason: string; keyMetric?: string }>>([]);
    const [_researchSummary, setResearchSummary] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_liveProfile, setLiveProfile] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_researchResult, setResearchResult] = useState<any>(null);
    const [_searchError, setSearchError] = useState<string | null>(null);

    // Handle location search - SIMPLIFIED Gemini-first approach
    const _handleLocationSearch = async () => {
        console.log('[CommandCenter] handleLocationSearch called');
        console.log('[CommandCenter] locationQuery:', locationQuery);
        
        if (!locationQuery.trim()) {
            console.log('[CommandCenter] Empty query, returning');
            return;
        }
        
        console.log('[CommandCenter] Starting research...');
        setIsResearchingLocation(true);
        setLocationResult(null);
        setLiveProfile(null);
        setResearchResult(null);
        setComparisonCities([]);
        setResearchSummary('');
        setSearchError(null);
        setResearchProgress({ stage: 'initialization', progress: 5, message: 'Connecting to AI intelligence...' });

        try {
            console.log('[CommandCenter] Calling researchLocation...');
            // Direct Gemini AI research - simple and reliable
            const result = await Promise.race([
                researchLocation(
                    locationQuery,
                    (progress) => {
                        console.log('[CommandCenter] Progress:', progress);
                        setResearchProgress(progress);
                    }
                ),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Search timeout - taking longer than expected')), 40000)
                )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ]) as Record<string, any>;

            console.log('[CommandCenter] Research result:', result);
            
            if (result && result.profile) {
                setLiveProfile(result.profile);
                setResearchResult(result);
                setLocationResult({
                    city: result.profile.city,
                    country: result.profile.country,
                    lat: result.profile.latitude || 0,
                    lon: result.profile.longitude || 0
                });

                setResearchSummary(result.summary || 'Research completed. Review the location brief below.');

                // NSIL Intelligence Enrichment — pattern matching + historical parallels
                try {
                  const countryParams = { country: result.profile.country, region: result.profile.region || '', industry: [result.profile.keyIndustries?.[0] || 'general'], strategicIntent: ['market-entry'] };
                  const patternAssessment = PatternConfidenceEngine.assess(countryParams as unknown as import('../types').ReportParameters);
                  const historicalMatch = HistoricalParallelMatcher.quickMatch(countryParams);
                  
                  let nsilEnrichment = '';
                  if (patternAssessment.matchedPatterns.length > 0) {
                    const topPattern = patternAssessment.matchedPatterns[0];
                    nsilEnrichment += `\n\n🧠 NSIL Pattern Match: "${topPattern.name}" (${topPattern.historicalDepth}yr depth, ${topPattern.geographicBreadth} countries). Stance: ${patternAssessment.reasoningStance}.`;
                  }
                  if (historicalMatch.found) {
                    nsilEnrichment += `\n📚 Historical Parallel: ${historicalMatch.case_title} (${historicalMatch.outcome}) — ${historicalMatch.topLesson}`;
                  }
                  if (nsilEnrichment) {
                    setResearchSummary((prev: string) => prev + nsilEnrichment);
                  }
                } catch (e) {
                  console.warn('[NSIL Enrichment] Non-blocking error:', e);
                }

                // Find similar cities from our database
                const similar = CITY_PROFILES
                    .filter((p) => p.country === result.profile.country && p.city !== result.profile.city)
                    .slice(0, 4)
                    .map((p) => ({
                        city: p.city,
                        country: p.country,
                        reason: `Comparable regional profile in ${p.region}`,
                        keyMetric: p.globalMarketAccess
                    }));

                setComparisonCities(similar);

                // Store in localStorage for quick access in report
                localStorage.setItem('lastLocationResult', JSON.stringify(result));
                setResearchProgress({ stage: 'Complete', progress: 100, message: 'Research complete!' });
            } else {
                console.error('[CommandCenter] No result returned');
                setSearchError('No data found - please try again');
                setResearchProgress({ stage: 'error', progress: 0, message: 'No data found - please try again' });
            }
        } catch (error) {
            console.error('Location research error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            // Provide specific error feedback based on error type
            let userMessage = 'Search failed - please try again';
            
            if (!navigator.onLine) {
                userMessage = 'No internet connection - please check your network';
            } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
                userMessage = 'Request timed out - please try a simpler search term';
            } else if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
                userMessage = 'API configuration error - please contact support';
            } else if (errorMessage.includes('parse') || errorMessage.includes('Invalid')) {
                userMessage = 'Location not found - please check spelling or try a different search';
            } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
                userMessage = 'Service temporarily unavailable - please try again in a few minutes';
            } else if (errorMessage) {
                userMessage = `Error: ${errorMessage}`;
            }
            
            setSearchError(userMessage);
            setResearchProgress({ stage: 'error', progress: 0, message: userMessage });
        } finally {
            setIsResearchingLocation(false);
        }
    };

    const tenStepProtocol = [
        { step: 1, title: "Identity & Foundation", description: "Establish organizational credibility, legal structure, and competitive positioning.", details: ["Organization name, type, and legal structure", "Registration/incorporation details", "Key leadership and governance structure", "Historical track record and credentials", "Competitive positioning statement", "Core competencies and differentiators"] },
        { step: 2, title: "Mandate & Strategy", description: "Define strategic vision, objectives, target partner profile, and value proposition.", details: ["Strategic vision and mission alignment", "Short, medium, and long-term objectives", "Target partner/investor profile", "Value proposition articulation", "Strategic fit assessment criteria", "Success metrics and KPIs"] },
        { step: 3, title: "Market & Context", description: "Analyze market dynamics, regulatory environment, and macro-economic factors.", details: ["Market size and growth projections", "Competitive landscape analysis", "Regulatory environment assessment", "Regulatory Friction Index (RFI) scoring", "Macro-economic factors and trends", "Industry-specific dynamics", "Regional context and opportunities"], gliEnabled: true, gliNote: "📍 BW Intel Fact Sheet provides GDP, demographics, trade data, and regulatory friction scores" },
        { step: 4, title: "Partners & Ecosystem", description: "Map stakeholder landscape, alignment scores, and relationship dynamics.", details: ["Stakeholder identification and mapping", "Counterparty Integrity Score (CIS) verification", "Alignment score calculations", "Relationship strength assessment", "Ecosystem dependencies", "Partnership synergy analysis", "Stakeholder communication strategy"], gliEnabled: true, gliNote: "📍 BW Intel shows major employers, foreign companies, and government contacts" },
        { step: 5, title: "Financial Model", description: "Structure investment requirements, revenue projections, and ROI scenarios.", details: ["Investment requirements breakdown", "Revenue model and projections", "Cost structure analysis", "ROI scenario modeling (base/best/worst)", "Funding sources and terms", "Financial sustainability metrics"], gliEnabled: true, gliNote: "📍 BW Intel provides tax incentives, economic zones, and cost indicators" },
        { step: 6, title: "Risk & Mitigation", description: "Identify and quantify risks with probability/impact matrices and mitigation plans.", details: ["Risk identification and categorization", "Probability and impact assessment", "Risk matrix visualization", "Policy Shock Sensitivity (PSS) scenarios", "Mitigation strategies per risk", "Contingency planning", "Risk monitoring framework"], gliEnabled: true, gliNote: "📍 BW Intel includes political, economic, natural, and regulatory risk assessments" },
        { step: 7, title: "Resources & Capability", description: "Assess organizational readiness, team strength, and capability gaps.", details: ["Current resource inventory", "Team capabilities assessment", "Capability gap analysis", "Training and development needs", "Resource acquisition strategy", "Organizational readiness score"], gliEnabled: true, gliNote: "📍 BW Intel shows labor pool quality, universities, and workforce data" },
        { step: 8, title: "Execution Plan", description: "Define implementation roadmap, milestones, dependencies, and go/no-go gates.", details: ["Implementation roadmap with phases", "Milestone definitions and timelines", "Dependency mapping", "Go/no-go decision gates", "Resource allocation per phase", "Critical path identification"], gliEnabled: true, gliNote: "📍 BW Intel provides entry timeline guidance and infrastructure readiness" },
        { step: 9, title: "Governance & Monitoring", description: "Establish oversight structure, decision matrices, and performance tracking.", details: ["Governance structure design", "Decision-making authority matrix", "Reporting cadence and format", "Performance tracking metrics", "Escalation procedures", "Audit and compliance framework"], gliEnabled: true, gliNote: "📍 BW Intel shows government structure, leadership, and regulatory framework" },
        { step: 10, title: "Scoring & Readiness", description: "Final validation and readiness assessment with go/no-go recommendation.", details: ["Composite readiness score calculation", "Strength/weakness summary", "Final risk assessment", "Go/no-go recommendation", "Pre-launch checklist", "Success probability index (SPI)"], gliEnabled: true, gliNote: "📍 BW Intel provides composite scores, comparison analysis, and data quality metrics" }
    ];

    const aiPersonas = [
        { name: "Advocate", role: "finds the upside", icon: Rocket },
        { name: "Skeptic", role: "attacks weak points", icon: Shield },
        { name: "Regulator", role: "checks compliance", icon: Scale },
        { name: "Accountant", role: "validates numbers", icon: Coins },
        { name: "Operator", role: "tests execution", icon: Target }
    ];

    const architectureLayers = [
        { id: 0, name: 'Knowledge Architecture', icon: BookOpen, color: 'cyan', summary: '60+ years of methodology across 150 countries', detail: 'Before anything computes, two services activate. The Methodology Knowledge Base holds internalised frameworks from 60+ years of documented government planning, investment attraction, and feasibility methodology — covering 150 countries. The Pattern Confidence Engine checks the user\'s question against 12 embedded pattern categories and classifies confidence as authoritative, informed, or exploratory. The system knows what it knows before it starts.' },
        { id: 1, name: 'NSIL Reasoning Engine', icon: FlaskConical, color: 'amber', summary: '46 formulas, 5 personas, Monte Carlo stress testing', detail: 'The reasoning engine. 46 proprietary mathematical formulas stress-test every dimension of your project — financial viability, regulatory friction, partnership alignment, activation speed, risk exposure, ethical compliance, and emotional stakeholder dynamics. A DAG scheduler manages formula dependencies across 5 execution levels. Five adversarial AI personas debate every claim. Monte Carlo simulations stress-test the range. Confidence intervals are set by the Knowledge Architecture — known patterns get tighter bands; novel terrain gets wider ranges with explicit caveats.' },
        { id: 2, name: 'Human Cognition', icon: Users, color: 'purple', summary: '7 behavioural models simulating decision-makers', detail: 'Seven proprietary behavioural models that simulate how real decision-makers process complexity, allocate attention, and react under pressure — neural field dynamics, predictive processing, action selection, attention allocation, emotional valence, information integration, and working memory. They don\'t just analyse data — they anticipate how humans will respond to it.' },
        { id: 3, name: 'Autonomous Intelligence', icon: Brain, color: 'emerald', summary: '8 engines that think, learn, and evolve', detail: 'Eight engines that have never existed in any commercial system. They discover strategies from unrelated domains, detect objectives you haven\'t considered, enforce ethical gates that reject unethical paths (not just flag them), tune their own formula weights after every analysis, predict how stakeholders will emotionally react, and simulate 5,000 future scenarios with causal feedback loops. The system thinks, learns, and evolves without being told to.' },
        { id: 4, name: 'Reflexive Intelligence', icon: Eye, color: 'rose', summary: '7 engines that analyse how you think', detail: 'Seven engines that turn the system\'s analytical power inward — on you. They detect what you keep repeating, what you avoid, where your region sits on the global investment lifecycle, and find assets you mentioned casually but never recognised as strategic. They identify your region\'s structural twin — places that solved the same problems. They spot when authentic competitive identity has been replaced with generic marketing language. Then every finding is translated for each audience — investors, government, community, partners, executives — in their own language and document format.' },
    ];

    const journeySteps = [
        { id: 1, title: 'Recognise', color: 'cyan', heading: 'The System Recognises Your Question', text: 'The moment you select a country, sector, or problem type, the Knowledge Architecture activates. The Pattern Confidence Engine matches your question against 12 embedded pattern categories. Most questions aren\'t novel. The system recognises this and tells you what it already knows — before any formula runs.', result: 'A confidence classification appears — authoritative (strong pattern match, tighter analysis), informed (partial match), or exploratory (genuinely novel — wider ranges, explicit caveats).' },
        { id: 2, title: 'Research', color: 'amber', heading: 'Research the Landscape', text: 'Type a city, company, or government into BW AI Search. In seconds, the system pulls verified data from public sources and delivers a one-page intelligence brief — demographics, GDP, leadership, infrastructure, and comparison benchmarks.', result: 'A structured intelligence brief with real numbers — population, GDP, key industries, government structure, infrastructure quality — plus internal knowledge overlaid where available.' },
        { id: 3, title: 'Define', color: 'amber', heading: 'Define Your Opportunity', text: 'Complete the Ten-Step Intake Protocol — a structured process capturing every dimension of your project: identity, strategy, financials, risk, governance. Steps 1, 2, 4, and 7 capture what only you know. Steps 3, 5, 6, 8, and 9 are pre-populated with system knowledge where available — you confirm, adjust, or override.', result: 'Ten guided sections in the left sidebar with clear labels. A progress bar tracks completion. The BW Consultant AI sits alongside to answer questions as you work.' },
        { id: 4, title: 'Analyse', color: 'amber', heading: 'Watch the System Think', text: 'Hit generate. The Live Report builds in real time — the knowledge layer sets confidence levels, the NSIL engine scores your project across 38 formulas, five adversarial personas debate its merits, and the Human Cognition Engine pressure-tests how decision-makers will actually respond. Nothing is hidden.', result: 'A live document preview that populates section by section — success probability scores, risk assessments, stakeholder alignment maps, financial projections, and specific recommendations.' },
        { id: 5, title: 'Export', color: 'emerald', heading: 'Export Board-Ready Documents', text: 'Once analysis is complete, the Document Factory compiles everything into institutional-grade deliverables — Investment Prospectuses, Risk Matrices, LOIs, Grant Applications, Due-Diligence Packs — formatted and evidence-backed.', result: 'Professional documents that look like they came from a top-tier advisory firm — with one critical difference: every claim has an audit trail.' },
    ];

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center font-bold text-black text-sm">
                            BW
                        </div>
                        <span className="text-lg font-light tracking-wide hidden sm:block">BWGA Intelligence</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-xs text-white/70">
                        <button onClick={() => scrollToSection('mission')} className="hover:text-white transition-colors">Mission</button>
                        <button onClick={() => scrollToSection('story')} className="hover:text-white transition-colors">Our Story</button>
                        <button onClick={() => scrollToSection('technology')} className="hover:text-white transition-colors">Technology</button>
                        <button onClick={() => scrollToSection('foundation')} className="hover:text-white transition-colors">Foundation</button>
                        <button onClick={() => scrollToSection('difference')} className="hover:text-white transition-colors">The Difference</button>
                        <button onClick={() => scrollToSection('bwai-search')} className="hover:text-white transition-colors">BW AI Search</button>
                        <button onClick={() => scrollToSection('protocol')} className="hover:text-white transition-colors">10-Step Protocol</button>
                        <button onClick={() => scrollToSection('pilots')} className="hover:text-white transition-colors">Partnerships</button>
                    </div>
                    
                </div>
            </nav>

            {/* Hero Section - Overlaps into Mountain Image */}
            <section className="relative pt-32 pb-0 px-4 z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-transparent" />
                <div className="relative z-10 max-w-4xl mx-auto text-center mb-[-80px]">
                    <p className="text-amber-400 uppercase tracking-[0.3em] text-sm md:text-base mb-6 font-semibold">
                        BRAYDEN WALLS GLOBAL ADVISORY
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
                        Regional communities are the backbone of every nation.
                        <span className="block text-amber-400 mt-3">They deserve to be seen.</span>
                    </h1>
                    <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-4">
                        Built from firsthand experience in regional communities. One purpose: bridging the gap between overlooked regions and global opportunity—giving every community the tools to tell their story, attract investment, and grow.
                    </p>
                    
                </div>
            </section>

            {/* OUR STORY — Compact 2-column layout */}
            <section id="mission" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* LEFT — The Story */}
                        <div id="story">
                            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">OUR ORIGIN</p>
                            <h2 className="text-xl md:text-2xl font-light mb-4">The Story of BWGA</h2>
                            <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                                <p>
                                    BWGA wasn't founded in a glass skyscraper in New York or London. It was born on the edge of the developing world, in a small coastal city where the gap between potential and opportunity is painfully clear.
                                </p>
                                <p>
                                    We watched regional leaders — mayors, entrepreneurs, councils — work tirelessly to attract investment. They had the vision, the drive, the raw assets. But they were ignored by global capital because they couldn't speak the language of risk matrices, financial models, and feasibility studies.
                                </p>
                                <p>
                                    Wealthy corporations hire armies of consultants costing $50,000 a month to write these documents. Regional communities simply couldn't afford that admission fee, so they were left behind.
                                </p>
                            </div>
                            <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl">
                                <p className="text-sm text-white font-light leading-relaxed">
                                    We built BWGA to break that barrier — to give the underdog the same strategic firepower as a multinational corporation.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT — Mission & Philosophy */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">OUR MISSION</p>
                                <h2 className="text-xl md:text-2xl font-light mb-4">Strong nations are built on strong regions.</h2>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Every nation depends on its regions — for food, resources, industry, and resilience. But without institutional-grade tools, their stories go untold and their potential stays hidden. The capability exists. The potential is real. What's missing are the tools to translate that into the language investors and partners expect.
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex-1">
                                <p className="text-base text-white/90 leading-relaxed mb-3 italic">
                                    "Every 'new idea' is old somewhere. The child learns what the parent already knows. The past isn't historical interest. The past is the solution library."
                                </p>
                                <p className="text-white/40 text-xs">— Brayden Walls, Founder</p>
                            </div>
                            <div className="bg-white/5 border border-amber-500/20 rounded-xl p-5">
                                <p className="text-xs text-amber-400 uppercase tracking-wider mb-2 font-semibold">WHAT THIS MEANS</p>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    This principle is the operating logic of the platform. The system holds 60 years of methodology, patterns from 150+ countries, and classifies its confidence level — authoritative, informed, or exploratory — before a single formula runs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BY THE NUMBERS */}
            <section className="py-16 px-4 bg-[#070707] border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-extralight text-amber-400 mb-2">120<span className="text-2xl">+</span></div>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em]">Components</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extralight text-amber-400 mb-2">46</div>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em]">Proprietary Formulas</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extralight text-amber-400 mb-2">15</div>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em]">Intelligence Engines</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extralight text-amber-400 mb-2">150</div>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em]">Countries Covered</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE TECHNOLOGY */}
            <section id="technology" className="py-16 px-4 bg-[#0f0f0f]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-2 font-semibold">THE TECHNOLOGY</p>
                            <h2 className="text-xl md:text-2xl font-light">What BWGA AI Actually Is</h2>
                        </div>
                        <p className="text-sm text-white/50 max-w-md text-right hidden md:block">Not a chatbot. A digital boardroom — 120+ components, 15 intelligence engines, 46 proprietary formulas.</p>
                    </div>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-3xl">
                        Standard AI predicts the next word. This system reasons through problems, validates assumptions with hard data, and delivers outputs you'd stake your reputation on. Click any layer below to see what's inside.
                    </p>

                    {/* FIVE-LAYER ARCHITECTURE — Horizontal cards */}
                    <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-4">THE FIVE-LAYER ARCHITECTURE — Click to explore</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        {architectureLayers.map((layer) => {
                            const Icon = layer.icon;
                            const isActive = activeLayer === layer.id;
                            const colorMap: Record<string, { border: string; bg: string; text: string; activeBg: string }> = {
                                cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', activeBg: 'bg-cyan-500/20' },
                                amber: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', activeBg: 'bg-amber-500/20' },
                                purple: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', activeBg: 'bg-purple-500/20' },
                                emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', activeBg: 'bg-emerald-500/20' },
                                rose: { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', activeBg: 'bg-rose-500/20' },
                            };
                            const c = colorMap[layer.color];
                            return (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(isActive ? null : layer.id)}
                                    className={`text-left rounded-xl p-4 border transition-all duration-200 group ${c.border} ${isActive ? c.activeBg : 'bg-white/5 hover:' + c.bg}`}
                                >
                                    <div className={`w-8 h-8 ${c.bg} border ${c.border} rounded-lg flex items-center justify-center mb-3`}>
                                        <Icon size={16} className={c.text} />
                                    </div>
                                    <p className={`text-xs font-semibold ${c.text} mb-1`}>Layer {layer.id}</p>
                                    <p className="text-[11px] text-white font-medium leading-tight mb-1">{layer.name}</p>
                                    <p className="text-[10px] text-white/40 leading-snug">{layer.summary}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Popup detail panel */}
                    {activeLayer !== null && (
                        <div className={`bg-white/5 border rounded-xl p-6 mb-6 transition-all duration-300 animate-in fade-in ${
                            activeLayer === 0 ? 'border-cyan-500/30' :
                            activeLayer === 1 ? 'border-amber-500/30' :
                            activeLayer === 2 ? 'border-purple-500/30' :
                            activeLayer === 3 ? 'border-emerald-500/30' :
                            'border-rose-500/30'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold mb-2 ${
                                        activeLayer === 0 ? 'text-cyan-400' :
                                        activeLayer === 1 ? 'text-amber-400' :
                                        activeLayer === 2 ? 'text-purple-400' :
                                        activeLayer === 3 ? 'text-emerald-400' :
                                        'text-rose-400'
                                    }`}>Layer {activeLayer} — {architectureLayers[activeLayer].name}</p>
                                    <p className="text-sm text-white/70 leading-relaxed">{architectureLayers[activeLayer].detail}</p>
                                </div>
                                <button onClick={() => setActiveLayer(null)} className="text-white/30 hover:text-white/60 transition-colors shrink-0 mt-1">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* System summary + Feature map — side by side */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-5 rounded-r-xl">
                            <p className="text-sm text-white/80 leading-relaxed">
                                <strong className="text-white">All five layers work together on every analysis.</strong> The knowledge layer provides context. NSIL provides computation. Cognition anticipates human reactions. Autonomous engines create, evolve, and enforce ethics. Reflexive engines analyse how you think — then translate everything for every audience.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-amber-500/20 rounded-xl p-3 text-center">
                                <Search size={18} className="text-amber-400 mx-auto mb-1.5" />
                                <p className="text-[11px] font-semibold text-white">BW AI Search</p>
                            </div>
                            <div className="bg-white/5 border border-amber-500/20 rounded-xl p-3 text-center">
                                <FileCheck size={18} className="text-amber-400 mx-auto mb-1.5" />
                                <p className="text-[11px] font-semibold text-white">Live Report</p>
                            </div>
                            <div className="bg-white/5 border border-purple-500/20 rounded-xl p-3 text-center">
                                <Users size={18} className="text-purple-400 mx-auto mb-1.5" />
                                <p className="text-[11px] font-semibold text-white">BW Consultant</p>
                            </div>
                            <div className="bg-white/5 border border-amber-500/20 rounded-xl p-3 text-center">
                                <GitBranch size={18} className="text-amber-400 mx-auto mb-1.5" />
                                <p className="text-[11px] font-semibold text-white">Document Factory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE FOUNDATION — Compact bar */}
            <section id="foundation" className="py-10 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                        <div>
                            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-2 font-semibold">THE FOUNDATION</p>
                            <h2 className="text-lg font-light mb-2">This System Already Knows</h2>
                            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                                Most AI starts from zero. This one doesn't — it holds 60+ years of government planning methodology across 150 countries. When your question matches a known pattern, it tells you. When the question is genuinely novel, it widens its ranges accordingly. No false certainty.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/5 border border-cyan-500/20 rounded-xl px-4 py-3 text-center min-w-[90px]">
                                <div className="text-2xl font-extralight text-cyan-400">60<span className="text-sm">+</span></div>
                                <p className="text-[10px] text-white/50 mt-0.5">Years Methodology</p>
                            </div>
                            <div className="bg-white/5 border border-amber-500/20 rounded-xl px-4 py-3 text-center min-w-[90px]">
                                <div className="text-2xl font-extralight text-amber-400">12</div>
                                <p className="text-[10px] text-white/50 mt-0.5">Pattern Categories</p>
                            </div>
                            <div className="bg-white/5 border border-emerald-500/20 rounded-xl px-4 py-3 text-center min-w-[90px]">
                                <div className="text-2xl font-extralight text-emerald-400">3</div>
                                <p className="text-[10px] text-white/50 mt-0.5">Confidence Levels</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE DIFFERENCE */}
            <section id="difference" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                        <div>
                            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-2 font-semibold">THE DIFFERENCE</p>
                            <h2 className="text-xl md:text-2xl font-light">What Happens When You Use It</h2>
                        </div>
                        <p className="text-sm text-white/50 max-w-sm text-right hidden md:block">Five steps from rough idea to board-ready documentation.</p>
                    </div>

                    {/* Horizontal journey tabs */}
                    <div className="flex gap-1 mb-1 overflow-x-auto pb-1">
                        {journeySteps.map((step) => {
                            const isActive = activeJourneyStep === step.id;
                            const colorMap: Record<string, { bg: string; text: string; activeBg: string; border: string }> = {
                                cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', activeBg: 'bg-cyan-500/20', border: 'border-cyan-500/50' },
                                amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', activeBg: 'bg-amber-500/20', border: 'border-amber-500/50' },
                                emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', activeBg: 'bg-emerald-500/20', border: 'border-emerald-500/50' },
                            };
                            const c = colorMap[step.color];
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveJourneyStep(step.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all duration-200 whitespace-nowrap ${
                                        isActive ? `${c.activeBg} ${c.border} ${c.text}` : 'bg-white/5 border-transparent text-white/50 hover:text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                                        isActive ? `${c.border} ${c.text}` : 'border-white/20 text-white/40'
                                    }`}>{step.id}</span>
                                    <span className="text-xs font-medium">{step.title}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active step content panel */}
                    {(() => {
                        const step = journeySteps[activeJourneyStep - 1];
                        const colorMap: Record<string, { border: string; bg: string; text: string; resultBorder: string; resultBg: string; resultText: string }> = {
                            cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400', resultBorder: 'border-cyan-500/15', resultBg: 'bg-cyan-500/5', resultText: 'text-cyan-300/80' },
                            amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', resultBorder: 'border-amber-500/15', resultBg: 'bg-amber-500/5', resultText: 'text-amber-300/80' },
                            emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400', resultBorder: 'border-emerald-500/15', resultBg: 'bg-emerald-500/5', resultText: 'text-emerald-300/80' },
                        };
                        const c = colorMap[step.color];
                        return (
                            <div className={`bg-white/5 border ${c.border} rounded-b-xl rounded-tr-xl p-6 mb-8`}>
                                <h3 className={`text-base font-medium mb-2 ${c.text}`}>{step.heading}</h3>
                                <p className="text-sm text-white/60 leading-relaxed mb-4">{step.text}</p>
                                <div className={`${c.resultBg} border ${c.resultBorder} rounded-lg px-4 py-2.5`}>
                                    <p className={`text-[11px] ${c.resultText}`}><strong className={c.text}>What you see:</strong> {step.result}</p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Before/After comparison — side by side */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider">Without BWGA AI</h4>
                            <ul className="space-y-2 text-xs text-white/50">
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Weeks of manual research per target region</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> $50K+ for consultant-prepared prospectuses</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> No way to stress-test assumptions</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Starting from zero every time</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-emerald-500/20 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">With BWGA AI</h4>
                            <ul className="space-y-2 text-xs text-white/70">
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 60+ years of methodology already loaded</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Pattern recognition classifies before formulas run</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 38 formulas score every dimension with reproducible math</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Confidence levels stated — authoritative, informed, or exploratory</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl">
                        <p className="text-sm text-white/70 leading-relaxed">
                            <strong className="text-white">Five steps. One session.</strong> You start with a rough idea and finish with quantified analysis, stress-tested assumptions, and ready-to-send documentation. Below: every feature you can try right now.
                        </p>
                    </div>
                </div>
            </section>

            {/* THE COMPREHENSIVE INTAKE FRAMEWORK */}
            <section id="protocol" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">THE COMPREHENSIVE INTAKE FRAMEWORK</p>
                    <h2 className="text-xl md:text-2xl font-light mb-2">The Ten-Step Protocol</h2>
                    <p className="text-sm text-emerald-400 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full"></span>
                        Most users complete this in 30-45 minutes
                    </p>

                    <p className="text-sm text-white/70 leading-relaxed mb-3">
                        Most projects fail not from lack of potential, but from incomplete preparation. The Ten-Step Protocol is the antidote—a structured process that transforms a rough idea into a complete, decision-ready input set. Each step captures a critical dimension of your opportunity: identity, strategy, market context, partnerships, financials, risks, resources, execution, governance, and final readiness. By the end, you have clear scope, quantified assumptions, full risk visibility, and a consistent dataset the reasoning engine can trust.
                    </p>
                    <p className="text-xs text-amber-400 mb-6">Click any step below to see the detailed data requirements.</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {tenStepProtocol.map((item) => (
                            <button
                                key={item.step}
                                onClick={() => setActiveStep(activeStep === item.step ? null : item.step)}
                                className={`text-left transition-all rounded-xl p-4 border ${
                                    activeStep === item.step
                                        ? 'bg-amber-500/20 border-amber-500/50'
                                        : item.gliEnabled
                                            ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        activeStep === item.step ? 'bg-amber-400 text-black' : item.gliEnabled ? 'bg-purple-500/40 text-purple-200' : 'bg-white/20 text-white'
                                    }`}>
                                        {item.step}
                                    </div>
                                    <span className="text-xs text-white/50">Step {item.step}</span>
                                    {item.gliEnabled && <span className="text-[11px] px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded">GLI</span>}
                                </div>
                                <h4 className="text-xs font-medium leading-tight">{item.title}</h4>
                            </button>
                        ))}
                    </div>

                    {activeStep && (
                        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                            <h4 className="text-sm font-semibold mb-2">Step {activeStep}: {tenStepProtocol[activeStep - 1].title}</h4>
                            <p className="text-sm text-white/70 mb-4">{tenStepProtocol[activeStep - 1].description}</p>

                            {tenStepProtocol[activeStep - 1].gliEnabled && tenStepProtocol[activeStep - 1].gliNote && (
                                <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-purple-200">{tenStepProtocol[activeStep - 1].gliNote}</p>
                                </div>
                            )}

                            <div className="bg-black/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-amber-400 mb-3">Data Requirements:</h5>
                                <ul className="grid md:grid-cols-2 gap-2">
                                    {tenStepProtocol[activeStep - 1].details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                                            <CheckCircle2 size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 mb-4">
                        <p className="text-sm text-white/70 leading-relaxed mb-4">
                            Most tools generate text. This system validates reality. It treats your input as a hypothesis, tests it against evidence, and then produces a defensible, board-ready package.
                        </p>
                        <p className="text-sm text-white/70 leading-relaxed">
                            The workflow has three stages: <strong className="text-amber-400">Structured Intake</strong> (define the opportunity in measurable terms), <strong className="text-amber-400">Adversarial Analysis</strong> (stress-test with personas and scoring models), and <strong className="text-amber-400">Institutional Output</strong> (compile evidence into auditable deliverables).
                        </p>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed">
                        Once the ten-step intake is complete, your structured inputs, validated scores, and risk assessments become the raw material for the final stage: turning analysis into action.
                    </p>
                </div>
            </section>

            {/* INSTITUTIONAL-GRADE OUTPUTS */}
            <section className="py-16 px-4 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">INSTITUTIONAL-GRADE OUTPUTS</p>
                    <h2 className="text-xl md:text-2xl font-light mb-4">The Document Factory</h2>
                    
                    <p className="text-sm text-white/60 leading-relaxed mb-6">
                        Great analysis is worthless if it stays locked in spreadsheets. The Document Factory bridges the gap between validated insights and boardroom-ready deliverables—producing prospectuses, risk matrices, partnership briefs, LOIs, MOUs, grant applications, and due-diligence packs that meet institutional standards and carry traceable evidence.
                    </p>
                    
                    <div className="space-y-4 text-sm text-white/70 mb-6">
                        <p>
                            <strong className="text-white">Why it exists:</strong> High-potential regional projects fail when their case isn't packaged at institutional quality. This fixes that gap.
                        </p>
                        <p>
                            <strong className="text-white">How it works:</strong> It fuses your intake data, scores, and risk tests into a single evidence-backed narrative.
                        </p>
                        <p>
                            <strong className="text-white">What you get:</strong> Prospectuses, risk matrices, partnership briefs, LOIs/MOUs, grants, and due-diligence packs—formatted and traceable.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-xl p-5 text-center">
                            <div className="text-3xl font-light text-amber-400 mb-1">200+</div>
                            <p className="text-xs text-white/70">Report & Document Types</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-xl p-5 text-center">
                            <div className="text-3xl font-light text-amber-400 mb-1">150+</div>
                            <p className="text-xs text-white/70">Letter Templates</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowCatalog(!showCatalog)}
                        className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <FileCheck size={16} />
                        {showCatalog ? 'Hide Catalog' : 'View Full Catalog'}
                    </button>

                    {showCatalog && (
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                            <h4 className="text-sm font-semibold text-amber-400 mb-3">Document Factory Catalog</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Strategic Reports</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• Investment Prospectus</li>
                                        <li>• Partnership Viability Assessment</li>
                                        <li>• Market Entry Analysis</li>
                                        <li>• Competitive Landscape Report</li>
                                        <li>• Stakeholder Alignment Matrix</li>
                                        <li>• Risk Assessment Report</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Financial Documents</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• ROI Projection Model</li>
                                        <li>• Financial Due Diligence Pack</li>
                                        <li>• Investment Term Sheet</li>
                                        <li>• Budget Allocation Framework</li>
                                        <li>• Monte Carlo Simulation Report</li>
                                        <li>• Sensitivity Analysis</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Legal Templates</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• Letter of Intent (LOI)</li>
                                        <li>• Memorandum of Understanding (MOU)</li>
                                        <li>• Non-Disclosure Agreement</li>
                                        <li>• Partnership Agreement Draft</li>
                                        <li>• Grant Application Template</li>
                                        <li>• Compliance Checklist</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Communication Packs</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• Executive Summary Brief</li>
                                        <li>• Board Presentation Deck</li>
                                        <li>• Investor Pitch Document</li>
                                        <li>• Stakeholder Update Letter</li>
                                        <li>• Media Release Template</li>
                                        <li>• Partner Onboarding Pack</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-white/50 mt-4">
                        <strong className="text-white/70">The audit trail:</strong> Every recommendation traces back to specific data inputs, formula calculations, and persona debate transcripts. This isn't a black box—it's court-defensible, investor-ready documentation of exactly why the system reached each conclusion.
                    </p>
                </div>
            </section>

            {/* THE 38 FORMULAS - PROOF OF CAPABILITY */}
            <section className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">THE 38 FORMULAS — PROOF OF CAPABILITY</p>
                    <h2 className="text-xl md:text-2xl font-light mb-4">Mathematical Foundation & Architecture Details</h2>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                        The formulas below don't operate in a vacuum. They run <em>after</em> the Knowledge Architecture has classified the user's question and set confidence levels. A question that matches a known pattern (e.g., SEZ development, regional planning, investment incentives) gets narrower confidence intervals because the system has 25–63 years of documented methodology to draw on. A genuinely novel question gets wider ranges and explicit caveats. The mathematics is the same; the confidence calibration is different.
                    </p>
                    
                    {/* Formula Box - Full Width */}
                    <div className="bg-black/40 border border-amber-500/30 rounded-xl p-6 mb-6">
                        <p className="text-xs text-amber-400 uppercase tracking-wider mb-3 font-semibold">Sample Formula: Success Probability Index</p>
                        <div className="font-mono text-base md:text-lg text-white/90 mb-4">
                            <p>SPI = Σ(wᵢ × Sᵢ) × (1 - R<sub>composite</sub>) × A<sub>alignment</sub></p>
                        </div>
                        <p className="text-xs text-white/50 mb-4">Where: wᵢ = weight factor, Sᵢ = score per dimension, R = risk coefficient, A = stakeholder alignment</p>
                        <div className="border-t border-white/10 pt-4">
                            <p className="text-sm text-white/70 italic">"Every formula is mathematically grounded, empirically tested, and produces auditable, reproducible results."</p>
                        </div>
                    </div>

                    {/* Live Test Case Study - Clickable */}
                    <div 
                        onClick={() => setShowCaseStudy(true)}
                        className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-6 mb-8 cursor-pointer hover:border-emerald-400/60 hover:from-emerald-500/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">LIVE TEST: SYSTEM OUTPUT DEMONSTRATION *</p>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400/70 group-hover:text-emerald-300 transition-colors">
                                <Eye size={12} />
                                View Full Live Report
                            </span>
                        </div>
                        <div className="mb-3 px-3 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-lg inline-block">
                            <p className="text-[11px] text-amber-300 uppercase tracking-wider font-medium">* Live test run through the actual system — Not a simulation, not an approved project</p>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed mb-4">
                            <strong className="text-white">Northland Regional Council (New Zealand)</strong> submitted a 5MW solar photovoltaic partnership proposal through the Ten-Step Intake. The NSIL engine computed all scores in real time:
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                <p className="text-[11px] text-red-400 uppercase tracking-wider font-semibold mb-2">Run 1 — Initial Assessment</p>
                                <ul className="space-y-1 text-white/70 text-xs">
                                    <li>SPI: <span className="text-red-400 font-bold">34%</span> (Grade D)</li>
                                    <li>RROI: <span className="text-red-400 font-bold">38/100</span></li>
                                    <li>Activation: <span className="text-red-400 font-bold">24 months</span> P50</li>
                                    <li>SCF Impact: <span className="text-red-400 font-bold">$680K</span></li>
                                    <li>Classification: <span className="text-red-400 font-bold">DO NOT PROCEED</span></li>
                                </ul>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                <p className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold mb-2">Run 2 — After Corrections</p>
                                <ul className="space-y-1 text-white/70 text-xs">
                                    <li>SPI: <span className="text-emerald-400 font-bold">78%</span> (Grade B)</li>
                                    <li>RROI: <span className="text-emerald-400 font-bold">74/100</span></li>
                                    <li>Activation: <span className="text-emerald-400 font-bold">9 months</span> P50</li>
                                    <li>SCF Impact: <span className="text-emerald-400 font-bold">$1.42M</span></li>
                                    <li>Classification: <span className="text-emerald-400 font-bold">INVESTMENT READY</span></li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed mb-2">
                            <strong className="text-white/80">Issues flagged by RFI:</strong> Missing grid connection feasibility study, revenue projections 2.8× above regional benchmark.
                        </p>
                        <p className="text-xs text-white/60 leading-relaxed">
                            <strong className="text-white/80">Corrections applied:</strong> Uploaded utility interconnection agreement, revised Y1 revenue from $4.2M to $1.4M.
                        </p>
                        <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400/60 group-hover:text-emerald-300/80 transition-colors">
                            <Info size={12} />
                            Click to view the complete Live Report output — exact format produced by the system, with full formula derivation, 5-persona consensus, and audit trail.
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* CASE STUDY — MIRRORS REAL LIVE REPORT OUTPUT                */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {showCaseStudy && (
                        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-gradient-to-b from-slate-100 to-blue-50" onClick={() => setShowCaseStudy(false)}>
                            <div className="relative w-full max-w-4xl my-8 flex justify-center" onClick={(e) => e.stopPropagation()}>

                                {/* Close button */}
                                <button onClick={() => setShowCaseStudy(false)} className="fixed top-4 right-4 z-20 w-10 h-10 bg-stone-800 border border-stone-600 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg">
                                    <X size={16} className="text-stone-300" />
                                </button>

                                {/* ══════ THE DOCUMENT PAGE — Mirrors MainCanvas.tsx output exactly ══════ */}
                                <div className="bg-white w-full max-w-4xl min-h-[1123px] shadow-2xl shadow-slate-900/10 flex flex-col relative">

                                    {/* Doc Header — matches MainCanvas.tsx header */}
                                    <div className="h-32 bg-white border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-slate-700 text-white flex items-center justify-center font-serif font-bold text-2xl">N</div>
                                            <div>
                                                <div className="text-[11px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-1">BWGA Intelligence</div>
                                                <div className="text-xl font-serif font-bold text-slate-900 tracking-tight">Strategic Roadmap</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[11px] text-blue-700 uppercase font-bold tracking-wider mb-1">Confidential Draft</div>
                                            <div className="text-[11px] font-mono text-slate-500">Case Study — Live Test Data</div>
                                            <div className="text-[11px] font-mono text-slate-500">NSIL Engine v3.2</div>
                                        </div>
                                    </div>

                                    {/* Doc Body — matches p-12 font-serif text-stone-900 */}
                                    <div className="p-12 flex-1 font-serif text-stone-900">

                                        {/* ── 01. PRINCIPAL ENTITY (matches real report section 01) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">01. Principal Entity</h2>
                                            <div className="text-3xl font-bold text-stone-900 mb-2">Northland Regional Council</div>
                                            <div className="text-lg text-stone-600 italic mb-4">Government Agency • New Zealand</div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div><span className="text-stone-400 font-sans text-[11px] uppercase tracking-wider block mb-1">Industry</span><span className="font-medium">Renewable Energy</span></div>
                                                <div><span className="text-stone-400 font-sans text-[11px] uppercase tracking-wider block mb-1">Contact</span><span className="font-medium">procurement@nrc.govt.nz</span></div>
                                                <div><span className="text-stone-400 font-sans text-[11px] uppercase tracking-wider block mb-1">Entity Type</span><span className="font-medium">Public Authority</span></div>
                                            </div>
                                        </div>

                                        {/* ── 02. STRATEGIC MANDATE (matches real report section 02) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">02. Strategic Mandate</h2>
                                            <div className="text-sm font-bold text-stone-900 uppercase mb-2">Primary Objectives: Market Expansion, Technology Transfer, Sustainability</div>
                                            <p className="text-sm text-stone-600 leading-relaxed italic border-l-2 border-bw-gold pl-4">
                                                "Identify a viable international renewable energy partner to co-develop a 5MW solar photovoltaic installation serving the Northland district, with grid connection, community benefit sharing, and a financially sustainable operating model over a 25-year concession period."
                                            </p>
                                        </div>

                                        {/* ── 03. PARTNER PERSONAS (matches real report section 03) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Partner Personas</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 border border-stone-200 rounded-lg bg-stone-50">
                                                    <div className="font-bold text-sm text-stone-800">International Solar EPC Firm</div>
                                                    <p className="text-xs text-stone-500 mt-1">Experienced in utility-scale solar with grid connection capability and local workforce training.</p>
                                                </div>
                                                <div className="p-4 border border-stone-200 rounded-lg bg-stone-50">
                                                    <div className="font-bold text-sm text-stone-800">Development Finance Institution</div>
                                                    <p className="text-xs text-stone-500 mt-1">Green finance provider with concessional terms for Pacific region renewable energy projects.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── 03. MARKET CONTEXT (matches real report section 03 Market) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">03. Market Context</h2>
                                            <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line mb-6">New Zealand targets 100% renewable electricity by 2035. The Northland region currently imports 70% of its electricity via a single transmission line, creating both vulnerability and opportunity. Regional solar irradiance averages 1,650 kWh per kW installed — competitive for distributed generation. Local regulatory framework supports community energy schemes under the Electricity Industry Act.</div>

                                            {/* ═══ COMPUTED INTELLIGENCE — matches real report bg-blue-50 panel ═══ */}
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h3 className="text-sm font-bold text-blue-900 mb-3">Computed Intelligence</h3>

                                                {/* Run 1 — Initial Assessment */}
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Run 1 — Initial Assessment</span>
                                                        <span className="text-[11px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">DO NOT PROCEED</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                                                        <div><span className="font-semibold">SPI:</span> <span className="text-red-600 font-bold">34/100</span> (Grade D)</div>
                                                        <div><span className="font-semibold">RROI:</span> <span className="text-red-600 font-bold">38/100</span> (Grade D)</div>
                                                        <div><span className="font-semibold">Activation P50:</span> <span className="text-red-600 font-bold">24 mo</span></div>
                                                        <div><span className="font-semibold">Activation Band:</span> P10 18 / P90 <span className="text-red-600 font-bold">36</span></div>
                                                        <div><span className="font-semibold">Impact P50:</span> <span className="text-red-600 font-bold">$680,000</span></div>
                                                        <div><span className="font-semibold">Impact Band:</span> P10 $476,000 / P90 $952,000</div>
                                                        <div><span className="font-semibold">RFI Friction:</span> <span className="text-red-600 font-bold">72/100</span> (3 bottlenecks)</div>
                                                        <div><span className="font-semibold">SCF Viability:</span> <span className="text-red-600 font-bold">Unviable</span></div>
                                                    </div>
                                                </div>

                                                {/* Run 2 — Revised Assessment */}
                                                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Run 2 — After System-Guided Corrections</span>
                                                        <span className="text-[11px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">INVESTMENT READY</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                                                        <div><span className="font-semibold">SPI:</span> <span className="text-emerald-600 font-bold">78/100</span> (Grade B)</div>
                                                        <div><span className="font-semibold">RROI:</span> <span className="text-emerald-600 font-bold">74/100</span> (Grade B)</div>
                                                        <div><span className="font-semibold">Activation P50:</span> <span className="text-emerald-600 font-bold">9 mo</span></div>
                                                        <div><span className="font-semibold">Activation Band:</span> P10 6 / P90 <span className="text-emerald-600 font-bold">14</span></div>
                                                        <div><span className="font-semibold">Impact P50:</span> <span className="text-emerald-600 font-bold">$1,420,000</span></div>
                                                        <div><span className="font-semibold">Impact Band:</span> P10 $994,000 / P90 $1,988,000</div>
                                                        <div><span className="font-semibold">RFI Friction:</span> <span className="text-emerald-600 font-bold">31/100</span> (0 bottlenecks)</div>
                                                        <div><span className="font-semibold">SCF Viability:</span> <span className="text-emerald-600 font-bold">Strong</span></div>
                                                    </div>
                                                </div>

                                                {/* Symbiotic Partners — matches real report */}
                                                <div className="mb-3">
                                                    <span className="font-semibold text-[11px]">Top Symbiotic Partners:</span>
                                                    <ul className="text-[11px] mt-1">
                                                        <li className="text-stone-700">• Vestas Wind Systems (Score: 82)</li>
                                                        <li className="text-stone-700">• Meridian Energy (Score: 78)</li>
                                                    </ul>
                                                </div>

                                                {/* Confidence Scores — matches real report */}
                                                <div className="flex flex-wrap gap-2 text-[11px] text-stone-600 mb-3">
                                                    <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Confidence: 72/100</span>
                                                    <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Economic: 68</span>
                                                    <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Political: 74</span>
                                                    <span className="px-2 py-1 bg-white border border-blue-100 rounded-full">Velocity: 62</span>
                                                </div>

                                                {/* Traceability — matches real report provenance */}
                                                <div className="text-[11px] text-stone-600">
                                                    <div className="font-semibold text-stone-700 mb-1">Traceability</div>
                                                    <ul className="space-y-1">
                                                        <li className="flex flex-wrap gap-2 items-center">
                                                            <span className="font-semibold text-stone-700">SPI:</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">engine.ts → calculateSPI()</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Freshness: Live</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Coverage: 100%</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-2 items-center">
                                                            <span className="font-semibold text-stone-700">RROI:</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">World Bank GDP/FDI + REST Countries</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Freshness: Live</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Coverage: 95%</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-2 items-center">
                                                            <span className="font-semibold text-stone-700">IVAS:</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">DAGScheduler.ts → IVAS node</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Freshness: Live</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Coverage: 90%</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-2 items-center">
                                                            <span className="font-semibold text-stone-700">SCF:</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">engine.ts → computeSCF()</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Freshness: Live</span>
                                                            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded">Coverage: 100%</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── 04. RISK & HISTORICAL VALIDATION (matches real report section 04) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">04. Risk & Historical Validation</h2>

                                            <p className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Critical Issues Identified (Run 1)</p>
                                            <div className="space-y-4 mb-6">
                                                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                                    <p className="font-sans font-bold text-sm text-red-800 mb-1">Issue 1: Missing Grid Connection Feasibility Study</p>
                                                    <p className="text-sm text-stone-700 leading-relaxed">Flagged by: <strong>Regulatory Friction Index (RFI)</strong>. The proposal declares a renewable energy project but provides no evidence of grid connection approval, capacity assessment, or utility interconnection agreement. Without this, the regulatory transparency input scored below 55, triggering a "Regulatory Transparency" bottleneck in the RFI pipeline. Estimated approval window extended to P90: 162 days.</p>
                                                </div>
                                                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                                    <p className="font-sans font-bold text-sm text-red-800 mb-1">Issue 2: Unrealistic Revenue Projections</p>
                                                    <p className="text-sm text-stone-700 leading-relaxed">Flagged by: <strong>SCF (Strategic Cash Flow Framework) via The Accountant persona</strong>. Projected revenue of $4.2M in year 1 from a 5MW solar installation exceeds the regional benchmark of $1.1–$1.6M for comparable capacity. The Accountant persona classified financial viability as "unviable" and The Skeptic persona reinforced this during adversarial debate, noting revenue assumptions were 2.8× above median comparables.</p>
                                                </div>
                                            </div>

                                            <p className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Corrections Applied (Run 2)</p>
                                            <div className="space-y-4 mb-6">
                                                <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
                                                    <p className="font-sans font-bold text-sm text-emerald-800 mb-1">Resolved: Grid Connection Feasibility Study Submitted</p>
                                                    <p className="text-sm text-stone-700 leading-relaxed">The council uploaded a utility interconnection agreement and a grid capacity assessment from the regional distributor. Regulatory transparency input rose to 78, clearing the RFI bottleneck. Approval window shortened to P90: 68 days.</p>
                                                </div>
                                                <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
                                                    <p className="font-sans font-bold text-sm text-emerald-800 mb-1">Resolved: Revenue Projections Revised to Regional Benchmarks</p>
                                                    <p className="text-sm text-stone-700 leading-relaxed">Year 1 revenue revised from $4.2M to $1.4M based on the system's comparable-project database. The Accountant persona reclassified financial viability to "strong" and The Skeptic withdrew the block, noting projections now sit within the 25th–75th percentile of comparable installations.</p>
                                                </div>
                                            </div>

                                            {/* Multi-Agent Persona Consensus */}
                                            <p className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Multi-Agent Persona Consensus</p>
                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div className="border border-red-200 rounded-lg p-3">
                                                    <p className="text-[11px] font-sans font-bold text-red-600 uppercase tracking-wider mb-2">Run 1 — Consensus: Block</p>
                                                    <table className="w-full text-xs">
                                                        <tbody>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Strategist</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-sans font-bold rounded">Caution</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Skeptic</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-red-50 text-red-700 text-[11px] font-sans font-bold rounded">Block</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Accountant</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-red-50 text-red-700 text-[11px] font-sans font-bold rounded">Block</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Visionary</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-sans font-bold rounded">Caution</span></td></tr>
                                                            <tr><td className="py-1">Analyst</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-red-50 text-red-700 text-[11px] font-sans font-bold rounded">Block</span></td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="border border-emerald-200 rounded-lg p-3">
                                                    <p className="text-[11px] font-sans font-bold text-emerald-600 uppercase tracking-wider mb-2">Run 2 — Consensus: Proceed</p>
                                                    <table className="w-full text-xs">
                                                        <tbody>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Strategist</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-sans font-bold rounded">Proceed</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Skeptic</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-sans font-bold rounded">Proceed</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Accountant</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-sans font-bold rounded">Proceed</span></td></tr>
                                                            <tr className="border-b border-stone-100"><td className="py-1">Visionary</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-sans font-bold rounded">Proceed</span></td></tr>
                                                            <tr><td className="py-1">Analyst</td><td className="py-1 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-sans font-bold rounded">Caution</span></td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── 05. ADVANCED ANALYSIS — Formula Derivation (matches real report section 05) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">05. Advanced Analysis</h2>
                                            <p className="text-sm text-stone-700 leading-relaxed mb-6">Every number in the Computed Intelligence panel above is traceable to a specific formula, a specific engine, and a specific line of code. Nothing is estimated, assumed, or generated by language-model hallucination. Below is the full derivation for the initial assessment (Run 1).</p>

                                            {/* SPI Calculation */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.1 — SPI Calculation (Success Probability Index)</p>
                                                <p className="text-xs text-stone-500 font-sans mb-3">Formula: SPI = Σ(wᵢ × Sᵢ) × P_interaction | Industry archetype: Energy</p>
                                                <table className="w-full border border-stone-200 text-xs mb-4">
                                                    <thead><tr className="bg-stone-100 border-b border-stone-200">
                                                        <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Component</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Score</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Weight</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Weighted</th>
                                                    </tr></thead>
                                                    <tbody className="font-mono">
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">ER (Economic Readiness)</td><td className="px-3 py-1.5 text-center text-red-600">42</td><td className="px-3 py-1.5 text-center">0.28</td><td className="px-3 py-1.5 text-center">11.76</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">SP (Symbiotic Fit)</td><td className="px-3 py-1.5 text-center text-amber-600">51</td><td className="px-3 py-1.5 text-center">0.20</td><td className="px-3 py-1.5 text-center">10.20</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">PS (Political Stability)</td><td className="px-3 py-1.5 text-center text-amber-600">55</td><td className="px-3 py-1.5 text-center">0.18</td><td className="px-3 py-1.5 text-center">9.90</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">PR (Partner Reliability)</td><td className="px-3 py-1.5 text-center text-red-600">38</td><td className="px-3 py-1.5 text-center">0.15</td><td className="px-3 py-1.5 text-center">5.70</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">EA (Ethical Alignment)</td><td className="px-3 py-1.5 text-center text-amber-600">60</td><td className="px-3 py-1.5 text-center">0.12</td><td className="px-3 py-1.5 text-center">7.20</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">CA (Activation Velocity)</td><td className="px-3 py-1.5 text-center text-red-600">35</td><td className="px-3 py-1.5 text-center">0.10</td><td className="px-3 py-1.5 text-center">3.50</td></tr>
                                                        <tr className="border-b border-stone-200"><td className="px-3 py-1.5 font-sans">UT (Transparency)</td><td className="px-3 py-1.5 text-center text-red-600">40</td><td className="px-3 py-1.5 text-center">0.05</td><td className="px-3 py-1.5 text-center">2.00</td></tr>
                                                        <tr className="bg-stone-100 font-bold"><td className="px-3 py-2 font-sans" colSpan={3}>Weighted Sum</td><td className="px-3 py-2 text-center">50.26</td></tr>
                                                    </tbody>
                                                </table>
                                                <div className="text-xs text-stone-700 space-y-1">
                                                    <p><strong>Interaction Penalty:</strong> PR(38) &lt; 60 AND PS(55) → +0.08. ER(42) &lt; 55 AND CA(35) &lt; 55 → +0.04. Total: 0.12</p>
                                                    <p><strong>P_interaction</strong> = 1 − 0.12 = 0.88 | <strong>Final SPI</strong> = 50.26 × 0.88 = 44.2 → confidence-adjusted to <strong className="text-red-600">34%</strong></p>
                                                    <p className="text-stone-500">Source: services/engine.ts → calculateSPI(), lines ~1000–1090</p>
                                                </div>
                                            </div>

                                            {/* RROI Calculation */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.2 — RROI Calculation (Regional Return on Investment)</p>
                                                <p className="text-xs text-stone-500 font-sans mb-3">Formula: RROI = market×0.3 + regulatory×0.25 + infrastructure×0.25 + talent×0.2</p>
                                                <table className="w-full border border-stone-200 text-xs mb-4">
                                                    <thead><tr className="bg-stone-100 border-b border-stone-200">
                                                        <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Component</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Score</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Weight</th>
                                                        <th className="text-center px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Weighted</th>
                                                    </tr></thead>
                                                    <tbody className="font-mono">
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">Market access</td><td className="px-3 py-1.5 text-center text-amber-600">52</td><td className="px-3 py-1.5 text-center">0.30</td><td className="px-3 py-1.5 text-center">15.60</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">Regulatory</td><td className="px-3 py-1.5 text-center text-red-600">30</td><td className="px-3 py-1.5 text-center">0.25</td><td className="px-3 py-1.5 text-center">7.50</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-1.5 font-sans">Infrastructure</td><td className="px-3 py-1.5 text-center text-red-600">35</td><td className="px-3 py-1.5 text-center">0.25</td><td className="px-3 py-1.5 text-center">8.75</td></tr>
                                                        <tr className="border-b border-stone-200"><td className="px-3 py-1.5 font-sans">Talent availability</td><td className="px-3 py-1.5 text-center text-red-600">32</td><td className="px-3 py-1.5 text-center">0.20</td><td className="px-3 py-1.5 text-center">6.40</td></tr>
                                                        <tr className="bg-stone-100 font-bold"><td className="px-3 py-2 font-sans" colSpan={3}>RROI Score</td><td className="px-3 py-2 text-center text-red-600">38</td></tr>
                                                    </tbody>
                                                </table>
                                                <p className="text-xs text-stone-500">Source: ReportOrchestrator.ts → RROI calculation via CompositeScoreService. Data: World Bank GDP/FDI, REST Countries.</p>
                                            </div>

                                            {/* IVAS Calculation */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.3 — IVAS (Investment Velocity & Activation Speed)</p>
                                                <p className="text-xs text-stone-500 font-sans mb-3">Activation timeline estimation from DAGScheduler. Depends on RROI + SPI scores.</p>
                                                <table className="w-full border border-stone-200 text-xs mb-4">
                                                    <tbody>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-2 font-sans font-medium w-48 bg-stone-50">P10 (best case)</td><td className="px-3 py-2">18 months</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-2 font-sans font-medium bg-stone-50">P50 (median)</td><td className="px-3 py-2 text-red-600 font-bold">24 months</td></tr>
                                                        <tr><td className="px-3 py-2 font-sans font-medium bg-stone-50">P90 (worst case)</td><td className="px-3 py-2 text-red-600 font-bold">36 months</td></tr>
                                                    </tbody>
                                                </table>
                                                <p className="text-xs text-stone-500">Source: DAGScheduler.ts → IVAS node, lines ~400–420. Activation band widened by low SPI and high RFI friction.</p>
                                            </div>

                                            {/* RFI Derivation */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.4 — RFI (Regulatory Friction Index)</p>
                                                <p className="text-xs text-stone-500 font-sans mb-3">Formula: RFI_score = regulatory×0.4 + digitalReadiness×0.25 + politicalStability×0.2 + marketAccess×0.15</p>
                                                <div className="text-xs text-stone-700 space-y-1">
                                                    <p>Inputs: regulatory=30, digitalReadiness=52, politicalStability=55, marketAccess=58</p>
                                                    <p>RFI_score = 12.0 + 13.0 + 11.0 + 8.7 = 44.7</p>
                                                    <p><strong>frictionIndex</strong> = clamp(100 − 44.7 + (riskFactors − 50) × 0.3, 5, 95) = <strong className="text-red-600">72</strong></p>
                                                    <p className="text-red-600">Bottlenecks: ✗ regulatory(30) &lt; 55, ✗ digitalReadiness(52) &lt; 55, ✗ procurement path undefined</p>
                                                    <p className="text-stone-500">Source: MissingFormulasEngine.ts → computeRFI(), lines ~409–460</p>
                                                </div>
                                            </div>

                                            {/* SCF Derivation */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.5 — SCF (Strategic Cash Flow Impact)</p>
                                                <p className="text-xs text-stone-500 font-sans mb-3">Formula: SCF = SEAM×0.22 + IVAS×0.22 + SPI×0.22 + RROI×0.22 + sustainability×0.12</p>
                                                <table className="w-full border border-stone-200 text-xs mb-4">
                                                    <tbody>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-2 font-sans font-medium w-48 bg-stone-50">Impact P10 (conservative)</td><td className="px-3 py-2">$476,000</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-2 font-sans font-medium bg-stone-50">Impact P50 (median)</td><td className="px-3 py-2 text-red-600 font-bold">$680,000</td></tr>
                                                        <tr className="border-b border-stone-100"><td className="px-3 py-2 font-sans font-medium bg-stone-50">Impact P90 (optimistic)</td><td className="px-3 py-2">$952,000</td></tr>
                                                        <tr><td className="px-3 py-2 font-sans font-medium bg-stone-50">Financial viability</td><td className="px-3 py-2 text-red-600 font-bold">Unviable — $4.2M projection 2.8× above benchmark</td></tr>
                                                    </tbody>
                                                </table>
                                                <p className="text-xs text-stone-500">Source: engine.ts → computeSCF(), DAGScheduler.ts → SCF node. PersonaEngine.ts → Accountant financialViability assessment.</p>
                                            </div>

                                            {/* Classification Thresholds */}
                                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
                                                <p className="font-sans font-bold text-sm text-stone-800 mb-3">5.6 — Classification Thresholds</p>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-[11px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-2">Grade Banding</p>
                                                        <table className="w-full border border-stone-200 text-xs">
                                                            <tbody>
                                                                <tr className="border-b border-stone-100"><td className="px-3 py-1.5 text-emerald-700 font-bold">≥ 80</td><td className="px-3 py-1.5">Grade A</td></tr>
                                                                <tr className="border-b border-stone-100 bg-emerald-50"><td className="px-3 py-1.5 text-emerald-700 font-bold">≥ 70</td><td className="px-3 py-1.5 font-bold text-emerald-700">Grade B — Investment Ready</td></tr>
                                                                <tr className="border-b border-stone-100"><td className="px-3 py-1.5 text-amber-700 font-bold">≥ 60</td><td className="px-3 py-1.5">Grade C — Proceed With Caution</td></tr>
                                                                <tr className="bg-red-50"><td className="px-3 py-1.5 text-red-700 font-bold">&lt; 60</td><td className="px-3 py-1.5 font-bold text-red-700">Grade D — Do Not Proceed</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-sans font-bold text-stone-500 uppercase tracking-wider mb-2">Decision Gate</p>
                                                        <table className="w-full border border-stone-200 text-xs">
                                                            <tbody>
                                                                <tr className="border-b border-stone-100"><td className="px-3 py-1.5">SPI ≥ 70 AND SCF ≥ 60</td><td className="px-3 py-1.5 text-emerald-700 font-bold">PROCEED</td></tr>
                                                                <tr className="border-b border-stone-100"><td className="px-3 py-1.5">SPI ≥ 50</td><td className="px-3 py-1.5 text-amber-700 font-bold">CAUTION</td></tr>
                                                                <tr><td className="px-3 py-1.5">SPI &lt; 50</td><td className="px-3 py-1.5 text-red-700 font-bold">DO NOT PROCEED</td></tr>
                                                            </tbody>
                                                        </table>
                                                        <p className="text-[11px] text-stone-400 font-mono mt-2">Source: IntelligentDocumentGenerator.ts, lines ~290–294</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── 06. 10-STEP INTAKE SUMMARY (matches real report 10 steps) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">06. Ten-Step Intake Summary</h2>
                                            <p className="text-sm text-stone-700 leading-relaxed mb-4">The following data was entered through the 10-step Strategic Intake Wizard. Each step feeds directly into the NSIL formula pipeline.</p>
                                            <table className="w-full border border-stone-200 text-xs">
                                                <thead><tr className="bg-stone-50 border-b border-stone-200">
                                                    <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase w-8">#</th>
                                                    <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Step</th>
                                                    <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">What Was Entered</th>
                                                    <th className="text-left px-3 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Feeds Into</th>
                                                </tr></thead>
                                                <tbody>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">1</td><td className="px-3 py-2 font-medium">Identity</td><td className="px-3 py-2 text-stone-600">Northland Regional Council, Public Authority, NZ, Renewable Energy</td><td className="px-3 py-2 text-stone-500">SPI weights, RROI region</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">2</td><td className="px-3 py-2 font-medium">Mandate</td><td className="px-3 py-2 text-stone-600">Market expansion, technology transfer, sustainability objectives</td><td className="px-3 py-2 text-stone-500">SPI strategic intent</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">3</td><td className="px-3 py-2 font-medium">Market</td><td className="px-3 py-2 text-stone-600">NZ renewable energy market, 100% target by 2035, 1,650 kWh solar irradiance</td><td className="px-3 py-2 text-stone-500">RROI market access</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">4</td><td className="px-3 py-2 font-medium">Partners</td><td className="px-3 py-2 text-stone-600">International solar EPC, development finance institution</td><td className="px-3 py-2 text-stone-500">SPI partner reliability</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">5</td><td className="px-3 py-2 font-medium">Financial</td><td className="px-3 py-2 text-stone-600">5MW capacity, $4.2M Y1 projection (Run 1) → $1.4M (Run 2)</td><td className="px-3 py-2 text-stone-500">SCF impact, viability</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">6</td><td className="px-3 py-2 font-medium">Risks</td><td className="px-3 py-2 text-stone-600">Grid connection risk, revenue overstatement, single transmission line</td><td className="px-3 py-2 text-stone-500">RFI bottlenecks</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">7</td><td className="px-3 py-2 font-medium">Capabilities</td><td className="px-3 py-2 text-stone-600">Local council team, no in-house solar expertise, procurement authority</td><td className="px-3 py-2 text-stone-500">SPI activation velocity</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">8</td><td className="px-3 py-2 font-medium">Execution</td><td className="px-3 py-2 text-stone-600">25-year concession, feasibility → procurement → build → commission</td><td className="px-3 py-2 text-stone-500">IVAS timeline</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-3 py-2 font-bold">9</td><td className="px-3 py-2 font-medium">Governance</td><td className="px-3 py-2 text-stone-600">Council decision authority, community benefit sharing, KPI tracking</td><td className="px-3 py-2 text-stone-500">SPI ethical alignment</td></tr>
                                                    <tr><td className="px-3 py-2 font-bold">10</td><td className="px-3 py-2 font-medium">Rate & Liquidity</td><td className="px-3 py-2 text-stone-600">NZD/USD sensitivity, interest rate hedging, 36-month runway requirement</td><td className="px-3 py-2 text-stone-500">SCF stress test</td></tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* ── 07. EVIDENCE SOURCES (matches real report auditability) ── */}
                                        <div className="mb-12">
                                            <h2 className="text-[11px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">07. Evidence Sources & Auditability</h2>

                                            <table className="w-full border border-stone-200 rounded-lg mb-6 text-xs">
                                                <thead><tr className="bg-stone-50 border-b border-stone-200">
                                                    <th className="text-left px-4 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Source File</th>
                                                    <th className="text-left px-4 py-2 font-sans text-[11px] font-bold text-stone-500 uppercase">Function / Purpose</th>
                                                </tr></thead>
                                                <tbody className="font-mono">
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/engine.ts</td><td className="px-4 py-2 font-sans text-stone-600">calculateSPI() — 7-component weighted scoring with interaction penalties. computeSCF() — impact P10/P50/P90.</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/MissingFormulasEngine.ts</td><td className="px-4 py-2 font-sans text-stone-600">computeRFI() — Regulatory Friction Index with bottleneck detection and approval window estimation.</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/PersonaEngine.ts</td><td className="px-4 py-2 font-sans text-stone-600">5-persona adversarial debate. Accountant financialViability, Skeptic stress-tests.</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/ReportOrchestrator.ts</td><td className="px-4 py-2 font-sans text-stone-600">RROI computation via CompositeScoreService. Symbiotic partner matching.</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/algorithms/DAGScheduler.ts</td><td className="px-4 py-2 font-sans text-stone-600">IVAS activation timeline (P10/P50/P90). SCF composite scoring. Formula dependency graph.</td></tr>
                                                    <tr className="border-b border-stone-100"><td className="px-4 py-2 text-blue-700">services/algorithms/IntelligentDocumentGenerator.ts</td><td className="px-4 py-2 font-sans text-stone-600">Document-level decision gate (PROCEED/CAUTION/DO NOT PROCEED). Grade banding.</td></tr>
                                                    <tr><td className="px-4 py-2 text-blue-700">types.ts</td><td className="px-4 py-2 font-sans text-stone-600">SPIResult, RFIResult, SCFResult, IVASResult interfaces and type definitions.</td></tr>
                                                </tbody>
                                            </table>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                                                <p className="font-sans font-bold text-sm text-blue-800 mb-3">How to Reproduce This Result</p>
                                                <ol className="list-decimal ml-4 space-y-2 text-sm text-stone-700">
                                                    <li>Open the Ten-Step Intake Wizard (MainCanvas). Enter "Northland Regional Council" as org name, select "Public Authority" as entity type, "New Zealand" as country, "Renewable Energy" as industry.</li>
                                                    <li>In Mandate, select Market Expansion + Technology Transfer + Sustainability. Enter the problem statement.</li>
                                                    <li>In Financial, set 5MW capacity and enter $4.2M projected Y1 revenue. Deliberately omit a grid connection feasibility study.</li>
                                                    <li>Complete remaining steps (Partners, Risks, Capabilities, Execution, Governance, Rate & Liquidity) with the case study data.</li>
                                                    <li>Run the Live Report. The system will produce the same SPI=34, RFI=72, SCF=Unviable output shown above.</li>
                                                    <li>Correct: add grid feasibility study reference, revise revenue to $1.4M. Re-run. Watch SPI climb to 78 and classification change to "Investment Ready."</li>
                                                </ol>
                                            </div>

                                            <div className="space-y-3 text-sm text-stone-700">
                                                <p className="font-sans font-bold text-xs text-stone-400 uppercase tracking-widest mb-2">Integrity Assurance</p>
                                                <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">1.</span><span><strong>Deterministic formulas.</strong> Given the same inputs, every formula always returns the same output. No randomness, no language-model generation in the scoring pipeline.</span></div>
                                                <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">2.</span><span><strong>Inspectable source code.</strong> Every formula referenced here exists as implemented TypeScript. File paths and line numbers are real and verifiable.</span></div>
                                                <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">3.</span><span><strong>Reproducible by any user.</strong> Follow the steps above to produce identical flags for identical inputs.</span></div>
                                                <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">4.</span><span><strong>Full audit trail.</strong> The system records every formula invocation, persona vote, and threshold check. Logs are exportable. No black box.</span></div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Doc Footer — matches MainCanvas.tsx footer */}
                                    <div className="h-16 bg-white border-t border-stone-100 flex items-center justify-between px-12 text-[11px] text-stone-400 font-sans uppercase tracking-widest shrink-0">
                                        <span>Generated by Nexus Intelligence OS v7.0 · NSIL v5.0 · Autonomous + Reflexive Intelligence Active</span>
                                        <span>Page 1 of 1</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Database size={16} className="text-amber-400" />
                                10-Layer Architecture + Cognition + Autonomy + Reflexive
                            </h4>
                            <ul className="space-y-2 text-xs text-white/70">
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-cyan-400" /> Knowledge Architecture (Pattern Confidence + Methodology Base)</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Input Validation & Governance</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Multi-Agent Adversarial Debate</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Quantitative Formula Scoring (29 DAG-scheduled)</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Monte Carlo Stress Testing</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-purple-400" /> Human Cognition Engine (7 Models)</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Autonomous Intelligence (8 Engines)</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Output Synthesis & Provenance</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Proactive Intelligence Layer</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rose-400" /> Reflexive Intelligence (7 Engines)</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Users size={16} className="text-amber-400" />
                                5 AI Personas
                            </h4>
                            <ul className="space-y-2 text-xs text-white/70">
                                {aiPersonas.map((persona) => (
                                    <li key={persona.name} className="flex items-center gap-2">
                                        <persona.icon size={12} className="text-amber-400" />
                                        <span className="text-white">{persona.name}</span> — {persona.role}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowFormulas(!showFormulas)}
                        className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <GitBranch size={16} />
                        {showFormulas ? 'Hide Architecture' : 'View Full Architecture & 46 Formulas'}
                    </button>
                    <p className="text-sm text-amber-400 text-center mt-3 font-medium">
                        ↳ Includes the 10-layer architecture, 46 formulas, 8 autonomous intelligence engines, 7 reflexive intelligence engines, knowledge layer, proactive intelligence, and proof of why these don't exist anywhere else.
                    </p>

                    {showFormulas && (
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                            <h4 className="text-sm font-semibold text-amber-400 mb-3">NSIL Full Architecture & 46 Proprietary Formulas + Knowledge Layer + Human Cognition Engine + Autonomous Intelligence + Reflexive Intelligence</h4>
                            
                            <div className="mb-4">
                                <h5 className="text-xs font-semibold text-white mb-2">10-Layer Processing Architecture with Knowledge-First Design</h5>
                                <ol className="space-y-2 text-xs text-white/70">
                                    <li><strong className="text-cyan-400">Layer 0:</strong> Knowledge Architecture — Methodology Knowledge Base (60+ years of documented practice, 150 countries) and Pattern Confidence Engine (12 embedded pattern categories). The system checks what it knows <em>before</em> computing anything.</li>
                                    <li><strong className="text-white">Layer 1:</strong> Input Validation & Governance — Screens all inputs for completeness, consistency, and compliance with data standards</li>
                                    <li><strong className="text-white">Layer 2:</strong> Multi-Agent Adversarial Debate — 5 AI personas debate and stress-test every claim, calibrated by pattern confidence</li>
                                    <li><strong className="text-white">Layer 3:</strong> Quantitative Formula Scoring — 29 DAG-scheduled formulas across 5 execution levels calculate hard metrics with confidence intervals set by the knowledge layer</li>
                                    <li><strong className="text-white">Layer 4:</strong> Monte Carlo Stress Testing — Simulates 10,000+ scenarios to test resilience</li>
                                    <li><strong className="text-purple-400">Layer 5:</strong> <strong className="text-purple-400">Human Cognition Engine</strong> — 7 proprietary behavioural models that simulate how decision-makers process complexity, allocate attention, and react under pressure</li>
                                    <li><strong className="text-emerald-400">Layer 6:</strong> <strong className="text-emerald-400">Autonomous Intelligence</strong> — 8 engines: Creative Synthesis (Bisociation Theory), Cross-Domain Transfer (Structure Mapping Theory), Autonomous Goal Detection (HTN + MCDA), Ethical Reasoning (7-dim Rawlsian/Utilitarian), Self-Evolving Algorithm (gradient descent), Adaptive Learning (Bayesian conjugate), Emotional Intelligence (Prospect Theory + Russell Circumplex), Scenario Simulation (5000-run Monte Carlo with causal loops)</li>
                                    <li><strong className="text-white">Layer 7:</strong> Output Synthesis & Provenance — Generates traceable, auditable conclusions with confidence classification (authoritative / informed / exploratory)</li>
                                    <li><strong className="text-emerald-400">Layer 8:</strong> <strong className="text-emerald-400">Proactive Intelligence</strong> — Autonomous monitoring, backtesting calibration, anomaly detection, and opportunity scanning that runs continuously without user prompting</li>
                                    <li><strong className="text-rose-400">Layer 9:</strong> <strong className="text-rose-400">Reflexive Intelligence</strong> — 7 engines that turn analytical power inward: User Signal Decoder, Internal Echo Detector, Investment Lifecycle Mapper, Regional Mirroring Engine, Regional Identity Decoder, Latent Advantage Miner, and Universal Translation Layer. The system analyses how you think, what you avoid, where your region sits on global investment curves, and adapts its output for every audience.</li>
                                </ol>
                            </div>

                            {/* KNOWLEDGE ARCHITECTURE SECTION */}
                            <div className="mb-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-cyan-300 mb-3">Knowledge Architecture — The "Parent" Knowledge Layer</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">Methodology Knowledge Base</strong> — Internalised frameworks from investment attraction (58 years stable), regional development planning (63 years stable), and due diligence methodology (50 years stable). Country intelligence profiles (Philippines, Vietnam, Indonesia, Australia, New Zealand). Sector intelligence (renewable energy, IT-BPM, agriculture).</div>
                                    <div><strong className="text-white">Pattern Confidence Engine</strong> — 12 embedded patterns (SEZ development, regional planning, investment incentives, PPP frameworks, market entry, agriculture modernisation, infrastructure, technology transfer, financial inclusion, export promotion, partnership structures, government promotion). Each with documented historical depth, geographic breadth, known outcomes, and known risks.</div>
                                </div>
                                <p className="text-[11px] text-cyan-200/60 mt-3 italic">This layer is consulted before any external search, before any API call, before any formula runs. When the system can answer from internal knowledge — and it often can, because the methodology has been stable for decades — it does so.</p>
                            </div>

                            {/* HUMAN COGNITION ENGINE SECTION */}
                            <div className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-purple-300 mb-3">Human Cognition Engine — 7 Proprietary Behavioural Models</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">Neural Field Dynamics</strong> — Models population-level decision activation and inhibition patterns</div>
                                    <div><strong className="text-white">Predictive Processing</strong> — Hierarchical belief updating and expectation management</div>
                                    <div><strong className="text-white">Action Selection</strong> — Variational inference for optimal decision-making under uncertainty</div>
                                    <div><strong className="text-white">Attention Allocation</strong> — Salience mapping to prioritise critical information signals</div>
                                    <div><strong className="text-white">Emotional Valence</strong> — Stakeholder sentiment and pressure-response modelling</div>
                                    <div><strong className="text-white">Information Integration</strong> — Cross-domain reasoning and insight broadcasting</div>
                                    <div><strong className="text-white">Working Memory</strong> — Cognitive load management for complex multi-factor analysis</div>
                                </div>
                                <p className="text-[11px] text-purple-200/60 mt-3 italic">These proprietary behavioural models simulate how real decision-makers think, react, and allocate attention—bringing human-like reasoning to strategic analysis.</p>
                            </div>

                            {/* PROACTIVE INTELLIGENCE LAYER */}
                            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-emerald-300 mb-3">Proactive Intelligence Layer — Always-On Autonomous Monitoring</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">Proactive Orchestrator</strong> — Coordinates all autonomous monitoring and enhancement agents</div>
                                    <div><strong className="text-white">Backtesting Calibration</strong> — Continuously validates scoring accuracy against real outcomes</div>
                                    <div><strong className="text-white">Anomaly Detection</strong> — Flags unusual patterns in data inputs and score movements</div>
                                    <div><strong className="text-white">Opportunity Scanner</strong> — Identifies emerging opportunities from market and regulatory signals</div>
                                    <div><strong className="text-white">Self-Improvement Engine</strong> — Refines analysis depth and document quality with every report</div>
                                    <div><strong className="text-white">Deep Research Agent</strong> — Autonomous multi-source intelligence gathering</div>
                                </div>
                                <p className="text-[11px] text-emerald-200/60 mt-3 italic">This layer runs on every report without user action — the system continuously improves its analysis, validates its own outputs, and surfaces intelligence you didn't know to ask for.</p>
                            </div>

                            {/* REFLEXIVE INTELLIGENCE LAYER */}
                            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-rose-300 mb-3">Reflexive Intelligence Layer — 7 Engines That Look Inward</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">User Signal Decoder</strong> — Discourse Analysis + Shannon Redundancy. Detects repetition compulsion, avoidance patterns, circular reasoning, and hidden priorities. Generates proactive questions that surface what the user is really trying to solve.</div>
                                    <div><strong className="text-white">Internal Echo Detector</strong> — Cross-references the user's own fields against each other. Finds connections the user entered separately but never linked: a university mentioned in workforce that could anchor a tech hub, a port mentioned casually that defines the region's real competitive advantage.</div>
                                    <div><strong className="text-white">Investment Lifecycle Mapper</strong> — Vernon's Product Lifecycle + Kondratieff Long Waves + Schumpeterian Creative Destruction. Maps the region's position on an 8-phase investment curve (Emergence → Reactivation) using global precedents. Identifies recyclable assets from prior economic eras.</div>
                                    <div><strong className="text-white">Regional Mirroring Engine</strong> — Gentner's Structure-Mapping Theory. Finds structural twin regions across 6 weighted dimensions (economic, demographic, infrastructure, geographic, institutional, sector). Shows what worked for your twin — and what the aspiration gap looks like.</div>
                                    <div><strong className="text-white">Regional Identity Decoder</strong> — Baudrillard's Simulacra + Porter's Regional Competitiveness. Detects when a region has replaced its authentic competitive identity with generic marketing language ("strategically located", "skilled workforce"). Measures simulacrum severity and identifies buried authentic advantages.</div>
                                    <div><strong className="text-white">Latent Advantage Miner</strong> — Hidden Asset Theory + Porter's Diamond. Mines casually mentioned assets with historic strategic significance. A deep-water port, a university with an agriculture faculty, a diaspora network, a border crossing — these are the "junk DNA" that powered transformation in Shenzhen, Penang, Medellín, and Kigali.</div>
                                    <div className="md:col-span-2"><strong className="text-white">Universal Translation Layer</strong> — Aristotle's Rhetoric + Halliday's Register Theory. Adapts every finding for 5 distinct audiences: investors (logos-led, IRR/NPV language), government (ethos-led, policy alignment), community (pathos-led, plain language), partners (logos-led, operational detail), executives (ethos-led, strategic framing). Each gets tailored vocabulary, document format, and door-opener briefs.</div>
                                </div>
                                <p className="text-[11px] text-rose-200/60 mt-3 italic">These engines don't wait to be asked. They analyse how you think, what you avoid, where your region sits globally, and how to communicate findings to every audience that matters. The system doesn't just answer your question — it questions your question.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Core Indices</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• SPI™ — Success Probability Index</li>
                                        <li>• RROI™ — Regional Return on Investment</li>
                                        <li>• SEAM™ — Stakeholder Alignment Matrix</li>
                                        <li>• PVI™ — Partnership Viability Index</li>
                                        <li>• RRI™ — Regional Resilience Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Risk Formulas</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• CRPS — Composite Risk Priority Score</li>
                                        <li>• RME — Risk Mitigation Effectiveness</li>
                                        <li>• VaR — Value at Risk</li>
                                        <li>• SRCI — Supply Chain Risk Index</li>
                                        <li>• DCS — Dependency Concentration Score</li>
                                        <li>• PSS — Policy Shock Sensitivity</li>
                                        <li>• PRS — Political Risk Score</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Financial Metrics</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• IRR — Internal Rate of Return</li>
                                        <li>• NPV — Net Present Value</li>
                                        <li>• WACC — Weighted Cost of Capital</li>
                                        <li>• DSCR — Debt Service Coverage</li>
                                        <li>• FMS — Funding Match Score</li>
                                        <li>• ROE — Return on Equity</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Operational Scores</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• ORS — Organizational Readiness</li>
                                        <li>• TCS — Team Capability Score</li>
                                        <li>• EEI — Execution Efficiency Index</li>
                                        <li>• SEQ — Sequencing Integrity Score</li>
                                        <li>• CGI — Capability Gap Index</li>
                                        <li>• LCI — Leadership Confidence Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Market Formulas</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• MPI — Market Penetration Index</li>
                                        <li>• CAI — Competitive Advantage Index</li>
                                        <li>• TAM — Total Addressable Market</li>
                                        <li>• SAM — Serviceable Available Market</li>
                                        <li>• GRI — Growth Rate Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-white mb-2">Governance Metrics</h5>
                                    <ul className="space-y-1 text-xs text-white/70">
                                        <li>• GCI — Governance Confidence Index</li>
                                        <li>• CCS — Compliance Certainty Score</li>
                                        <li>• TPI — Transparency Index</li>
                                        <li>• ARI — Audit Readiness Index</li>
                                        <li>• DQS — Data Quality Score</li>
                                        <li>• GCS — Governance Clarity Score</li>
                                        <li>• RFI — Regulatory Friction Index</li>
                                        <li>• CIS — Counterparty Integrity Score</li>
                                        <li>• ESG — Environmental Social Governance</li>
                                    </ul>
                                </div>
                            </div>

                            {/* AUTONOMOUS INTELLIGENCE ENGINES */}
                            <div className="mt-4 mb-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-emerald-300 mb-3">Autonomous Intelligence — 8 Engines (World-First)</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">CRE — Creative Synthesis</strong> — Bisociation Theory (Koestler 1964). 12 knowledge frames, Jaccard/Cosine similarity, Shannon entropy. Discovers strategies no human would propose by finding hidden connections between unrelated domains.</div>
                                    <div><strong className="text-white">CDT — Cross-Domain Transfer</strong> — Structure Mapping Theory (Gentner 1983). 8 source domains (Coral Reef, Immune System, Military, Thermodynamics, Neural Networks, Lotka-Volterra, Urban Metabolism, Game Theory). 50+ entity-to-economic-concept mappings.</div>
                                    <div><strong className="text-white">AGL — Autonomous Goal Detection</strong> — Goal Programming + Hierarchical Task Networks. MCDA ranking: 0.30×impact + 0.25×urgency + 0.20×feasibility + 0.25×EVOI. Detects objectives the user hasn't considered.</div>
                                    <div><strong className="text-white">ETH — Ethical Reasoning</strong> — 7-dimension framework: Utilitarian, Rawlsian (Difference Principle), Environmental, Intergenerational (Stern discount r=1.4%), Transparency, Proportionality, Cultural Sensitivity. Hard gate — unethical paths are rejected.</div>
                                    <div><strong className="text-white">EVO — Self-Evolving Algorithm</strong> — Online gradient descent with Thompson Sampling. η_t = 0.05/(1+0.001×t). 21 weight parameters auto-tune after every outcome. Full rollback audit trail.</div>
                                    <div><strong className="text-white">ADA — Adaptive Learning</strong> — Bayesian conjugate normal-normal updates. 15 prior beliefs. EWMA (α=0.1) accuracy tracking. Ebbinghaus forgetting curve: R = e^(-t/S), S = 24×√n reinforcements.</div>
                                    <div><strong className="text-white">EMO — Emotional Intelligence</strong> — Russell's Circumplex Model (12 emotions, valence/arousal). Prospect Theory: V(x)=x^0.88 gains, -2.25×(-x)^0.88 losses. π(p) probability weighting γ=0.61. 4 stakeholder emotional profiles.</div>
                                    <div><strong className="text-white">SIM — Scenario Simulation</strong> — Monte Carlo with 5,000 runs. 12 variables, 14 causal links, 4 feedback loops. Box-Muller normal sampling, triangular & lognormal distributions. Non-linearity: linear, quadratic, threshold, saturation.</div>
                                </div>
                                <p className="text-[11px] text-emerald-200/60 mt-3 italic">These 8 engines run autonomously on every analysis. They are not add-ons or modules — they are integrated into the NSIL core via the Intelligence Hub. No other commercial system possesses any of these capabilities, let alone all eight in a unified architecture.</p>
                            </div>

                            {/* WORLD-FIRST PROOF SECTION */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">Why This Is a World-First</h5>
                                
                                <div className="bg-black/30 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-white/80 mb-3">
                                        <strong className="text-white">Multi-agent AI frameworks exist</strong> — tools like Microsoft AutoGen, CrewAI, and LangGraph allow developers to build systems where AI agents collaborate. But these are <em>developer toolkits</em>, not end-user products. They have no built-in scoring, no document generation, no regional development focus, and no autonomous intelligence layer.
                                    </p>
                                    <p className="text-xs text-white/80 mb-3">
                                        <strong className="text-white">Enterprise decision platforms exist</strong> — Palantir, Kensho, and Moody's offer sophisticated analysis. But they're locked behind enterprise contracts, inaccessible to regional councils, SMEs, or first-time exporters. None include ethical reasoning gates, emotional intelligence modelling, or self-evolving algorithms.
                                    </p>
                                    <p className="text-xs text-white/80 mb-3">
                                        <strong className="text-white">No system anywhere combines:</strong> multi-persona adversarial analysis, 46 quantitative viability indices, Monte Carlo stress testing, proactive intelligence with autonomous monitoring, 7-model human cognition simulation, an 8-engine autonomous intelligence layer that reasons creatively, detects goals, enforces ethical constraints, evolves its own weights, models stakeholder emotions, and simulates futures, <em>and</em> a 7-engine reflexive intelligence layer that analyses how users think, detects identity loss, maps investment lifecycles, finds structural twin regions, mines hidden assets, and translates every finding for every audience — all in a single platform purpose-built for regional economic development.
                                    </p>
                                    <p className="text-xs text-white/80">
                                        <strong className="text-white">Specifically, no other system has:</strong> Bisociation-based creative synthesis, Structure Mapping cross-domain transfer, autonomous goal detection via HTN decomposition, Rawlsian ethical hard gates, online gradient descent self-evolution, Bayesian adaptive learning with Ebbinghaus retention, Prospect Theory emotional intelligence, Monte Carlo scenario simulation with causal feedback loops, discourse-analysis user signal decoding, Baudrillard simulacrum identity detection, Vernon/Kondratieff investment lifecycle mapping, Gentner-based regional mirroring, latent advantage mining, or Aristotelian audience-adaptive translation. We have all fifteen, running together, integrated into a single intelligence hub.
                                    </p>
                                </div>

                                <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                    <p className="text-xs text-white/90 italic">
                                        "None of these indices exist as named products elsewhere. They were designed specifically for this system because no existing tool combined them, regional development has unique needs standard tools ignore, and investors demand reproducibility — not AI-generated guesswork. Every formula has defined methodology, transparent inputs, and a full audit trail. The 15 autonomous and reflexive engines represent capabilities that have never been implemented in any commercial system — each backed by published mathematical theory, implemented in real TypeScript with no placeholders."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* DESIGNED FOR EVERYONE */}
            <section className="py-12 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                        <div>
                            <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-2 font-semibold">DESIGNED FOR EVERYONE</p>
                            <h2 className="text-xl md:text-2xl font-light">You Don't Need to Be an Expert. <span className="text-amber-400">The System Already Is.</span></h2>
                        </div>
                    </div>

                    {/* Guidance modes — compact horizontal */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-amber-400 font-semibold text-xs mb-1">🧭 Orientation</p>
                            <p className="text-[10px] text-white/50">Full walkthroughs. Ideal for first-time users.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-amber-400 font-semibold text-xs mb-1">🤝 Collaborative</p>
                            <p className="text-[10px] text-white/50">Balanced guidance. Built for teams & councils.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-amber-400 font-semibold text-xs mb-1">⚡ Expert</p>
                            <p className="text-[10px] text-white/50">Streamlined. For experienced operators.</p>
                        </div>
                    </div>

                    {/* Who + Capabilities — side by side */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-3 font-semibold">WHO THIS IS BUILT FOR</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                                    <Building2 size={18} className="mx-auto mb-1 text-amber-400" />
                                    <p className="text-[10px] font-medium">Regional Councils & RDAs</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                                    <Scale size={18} className="mx-auto mb-1 text-amber-400" />
                                    <p className="text-[10px] font-medium">Government Agencies</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                                    <Briefcase size={18} className="mx-auto mb-1 text-amber-400" />
                                    <p className="text-[10px] font-medium">Businesses Going Regional</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                                    <Globe size={18} className="mx-auto mb-1 text-amber-400" />
                                    <p className="text-[10px] font-medium">First-Time Exporters</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-3 font-semibold">THE SYSTEM HANDLES</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2"><Layers size={14} className="text-amber-400 shrink-0" /><p className="text-[11px] text-white/70">Structure your thinking</p></div>
                                <div className="flex items-center gap-2"><TrendingUp size={14} className="text-amber-400 shrink-0" /><p className="text-[11px] text-white/70">Score your viability</p></div>
                                <div className="flex items-center gap-2"><Shield size={14} className="text-amber-400 shrink-0" /><p className="text-[11px] text-white/70">Stress-test assumptions</p></div>
                                <div className="flex items-center gap-2"><FileText size={14} className="text-amber-400 shrink-0" /><p className="text-[11px] text-white/70">Build your documents</p></div>
                            </div>
                            <p className="text-[10px] text-white/40 mt-3">The complexity is hidden. What you see is clarity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEXT STEPS - Partnership & Pilot Programs */}
            <section id="pilots" className="py-12 px-4 bg-[#0f0f0f]">
                <div className="max-w-6xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-2 font-semibold">NEXT STEPS</p>
                    <h2 className="text-lg font-light mb-4">Partnership & Pilot Programs</h2>
                    
                    <div className="grid md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <Zap size={18} className="text-amber-400 mb-2" />
                            <h3 className="text-xs font-semibold mb-1">Investment Screening</h3>
                            <p className="text-[10px] text-white/50">Test cases with foreign investment review boards</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <TrendingUp size={18} className="text-amber-400 mb-2" />
                            <h3 className="text-xs font-semibold mb-1">Regional Development</h3>
                            <p className="text-[10px] text-white/50">Investment prospectuses with economic development agencies</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <Building2 size={18} className="text-amber-400 mb-2" />
                            <h3 className="text-xs font-semibold mb-1">PPP Modeling</h3>
                            <p className="text-[10px] text-white/50">Public-Private Partnerships with infrastructure ministries</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4">
                            <Globe size={18} className="text-amber-400 mb-2" />
                            <h3 className="text-xs font-semibold text-amber-400 mb-1">Vision</h3>
                            <p className="text-[10px] text-white/60">Deploy as a sovereign-grade national strategic asset</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLVING REAL PROBLEMS — compact callout */}
            <section className="py-8 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-5 rounded-r-xl">
                        <p className="text-amber-400 uppercase tracking-[0.2em] text-[10px] mb-2 font-semibold">SOLVING REAL PROBLEMS</p>
                        <p className="text-sm text-white/80 leading-relaxed">
                            This platform exists to help capital, partnerships, and capability reach places that are too often overlooked — despite holding extraordinary, investable potential. During this beta phase and in future subscriptions, <strong className="text-amber-400">10% of every paid transaction</strong> goes back into initiatives that support regional development. A new voice for regions. A new standard for how opportunity is evaluated — anywhere in the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER INFO SECTION */}
            <section id="footer-info" className="py-8 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                        <p className="text-lg font-semibold text-white mb-6">
                            Launch the full BW Nexus Intelligence OS to start analyzing partnership opportunities with sovereign-grade analytical depth.
                        </p>

                        {/* Terms of Engagement */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
                            <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
                                <Shield size={14} className="text-amber-400" />
                                Terms of Engagement
                            </h4>
                            <div className="space-y-2 text-xs text-white/60">
                                <p><strong className="text-white/80">1. Strategic Decision Support:</strong> BW AI is a decision support platform. All outputs are advisory.</p>
                                <p><strong className="text-white/80">2. Reasoning Governance:</strong> NSIL layer governs analysis via adversarial input screening.</p>
                                <p><strong className="text-white/80">3. Data Privacy:</strong> Strict compliance with GDPR, Australian Privacy Act.</p>
                                <p><strong className="text-white/80">4. Accountability:</strong> Users retain final accountability for decisions.</p>
                            </div>
                        </div>

                        {/* T&C Checkbox */}
                        <div className="flex items-start gap-3 mb-6 text-left">
                            <input 
                                type="checkbox" 
                                id="acceptTerms" 
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-white/30 bg-transparent text-amber-400 focus:ring-amber-400 cursor-pointer"
                            />
                            <label htmlFor="acceptTerms" className="text-xs text-white/60 cursor-pointer">
                                By accessing the platform, you agree to our <strong className="text-white">Terms & Conditions</strong>
                            </label>
                        </div>

                        {/* Launch Button */}
                        <button 
                            disabled={!termsAccepted}
                            onClick={() => termsAccepted && onEnterPlatform?.()}
                            className={`w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 mb-6 ${
                                termsAccepted 
                                    ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer' 
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                        >
                            Launch Intelligence OS
                            <ArrowRight size={20} />
                        </button>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">BWGA Intelligence AI</h4>
                            <p className="text-xs text-white/60 mb-4">
                                BW Global Advisory is an Australian strategic intelligence firm developing sovereign-grade AI systems for cross-border investment and regional economic development.
                            </p>
                            <div className="space-y-1 text-xs text-white/50">
                                <p className="flex items-center gap-2"><Mail size={12} /> brayden@bwglobaladvis.info</p>
                                <p className="flex items-center gap-2"><Phone size={12} /> +63 960 835 4283</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Development Status</h4>
                            <p className="text-xs text-white/80 mb-2"><strong>CURRENT PHASE:</strong> Research & Development</p>
                            <p className="text-xs text-white/60 mb-4">
                                BWGA AI is currently in active R&D phase, operating under Brayden Walls as a registered Australian sole trader. The platform is being developed for future commercial deployment to government and enterprise clients.
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-white/50">
                                <button onClick={() => setActiveDocument('user-manual')} className="hover:text-white transition-colors">User Manual</button>
                                <button onClick={() => setActiveDocument('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
                                <button onClick={() => setActiveDocument('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                                <button onClick={() => setActiveDocument('ethics')} className="hover:text-white transition-colors">Ethical AI Framework</button>
                            </div>
                        </div>
                    </div>
            </section>

            {/* Legal Document Modals */}
            <DocumentModal activeDocument={activeDocument} onClose={() => setActiveDocument(null)} />

            {/* Footer */}
            <footer className="py-8 px-4 bg-[#050505] border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-white/40">© 2026 BW Global Advisory. All rights reserved.</p>
                            <p className="text-xs text-white/30">Trading as Sole Trader (R&D Phase) | ABN 55 978 113 300 | Melbourne, Australia</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                Nexus Intelligence OS v7.0
                            </span>
                            <span>•</span>
                            <span>NSIL Engine v5.0</span>
                            <span>•</span>
                            <span className="text-cyan-400">Knowledge Layer Active</span>
                            <span>•</span>
                            <span className="text-purple-400">Cognition Active</span>
                            <span>•</span>
                            <span className="text-emerald-400">Autonomous Active</span>
                            <span>•</span>
                            <span className="text-rose-400">Reflexive Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CommandCenter;
