import React, { useState } from 'react';
import { ArrowRight, Shield, Users, Zap, CheckCircle2, Scale, Building2, Globe, Mail, Phone, Briefcase, TrendingUp, FileCheck, GitBranch, Search, X, Info, Eye, Brain } from 'lucide-react';
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
    const [showFormulas, setShowFormulas] = useState(false);
    const [showCaseStudy, setShowCaseStudy] = useState(false);
    const [showOutputDetails, setShowOutputDetails] = useState(false);
    const [showProtocolDetails, setShowProtocolDetails] = useState(false);
    const [showBlock2More, setShowBlock2More] = useState(false);
    const [showBlock3More, setShowBlock3More] = useState(false);
    const [showBlock4More, setShowBlock4More] = useState(false);
    const [showBlock5Popup, setShowBlock5Popup] = useState(false);
    const [showProofPopup, setShowProofPopup] = useState(false);
    const [activeDocument, setActiveDocument] = useState<DocumentType>(null);
    const [activeLayer, setActiveLayer] = useState<number | null>(null);

    // Global Location Intelligence state - LIVE SEARCH
    const [locationQuery, setLocationQuery] = useState('');
    const [isResearchingLocation, setIsResearchingLocation] = useState(false);
    const [researchProgress, setResearchProgress] = useState<ResearchProgress | null>(null);
    const [_locationResult, setLocationResult] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null);
    const [_comparisonCities, setComparisonCities] = useState<Array<{ city: string; country: string; reason: string; keyMetric?: string }>>([]);
    const [researchSummary, setResearchSummary] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_liveProfile, setLiveProfile] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_researchResult, setResearchResult] = useState<any>(null);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Handle location search - SIMPLIFIED Gemini-first approach
    const handleLocationSearch = async () => {
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


    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                            BW
                        </div>
                        <span className="text-lg font-light tracking-wide hidden sm:block text-slate-800">BWGA Intelligence</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-6 text-sm text-slate-600 font-medium">
                        <button onClick={() => scrollToSection('mission')} className="hover:text-blue-600 transition-colors">Mission</button>
                        <button onClick={() => scrollToSection('technology')} className="hover:text-blue-600 transition-colors">The Platform</button>
                        <button onClick={() => scrollToSection('technology')} className="hover:text-blue-600 transition-colors">The Brain</button>
                        <button onClick={() => scrollToSection('bwai-search')} className="hover:text-blue-600 transition-colors">Products</button>
                        <button onClick={() => scrollToSection('protocol')} className="hover:text-blue-600 transition-colors">Protocol</button>
                        <button onClick={() => scrollToSection('proof')} className="hover:text-blue-600 transition-colors">Proof</button>
                        <button onClick={() => scrollToSection('pilots')} className="hover:text-blue-600 transition-colors">Partnerships</button>
                    </div>
                    
                </div>
            </nav>


            {/* OUR MISSION — The opening statement */}
            <section id="mission" className="pt-36 pb-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm mb-6 font-bold">OUR MISSION</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 text-slate-900">
                        Strong nations are built<br />on strong regions.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
                        Every nation depends on its regions — for food, resources, industry, and resilience. But for too long, opportunity has been decided by proximity to capital, not by fundamentals.
                    </p>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        The capability is there. The potential is real. What has been missing are the tools. We built those tools.
                    </p>
                </div>
            </section>

            {/* Photo Banner */}
            <section className="relative z-20 min-h-[50vh] flex items-center">
                <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&q=80" 
                    alt="Regional landscape" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
                <div className="relative z-10 max-w-5xl mx-auto text-center px-4 py-16">
                    <p className="text-sky-300 uppercase tracking-[0.3em] text-base md:text-lg mb-4 font-bold">
                        BRAYDEN WALLS GLOBAL ADVISORY
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-6 text-white">
                        Built from the ground up.<br />
                        <span className="text-sky-300 font-normal">For the communities that power nations.</span>
                    </h2>
                    <button 
                        onClick={() => scrollToSection('bwai-search')}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-sky-500 border-2 border-sky-400 rounded-full text-white text-base font-bold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30"
                    >
                        <Search size={18} />
                        Try BW AI Search
                    </button>
                </div>
            </section>

            {/* OUR ORIGIN */}
            <section className="py-10 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">OUR ORIGIN</p>
                    <h2 className="text-2xl md:text-3xl font-light mb-6 text-slate-900">The Story of BWGA</h2>
                    <div className="grid md:grid-cols-2 gap-x-8 text-base text-slate-700 leading-relaxed mb-8">
                        <div className="space-y-3">
                            <p>
                                BWGA wasn&rsquo;t founded in a glass skyscraper in New York or London. It was born on the edge of the developing world, in a small coastal city where the gap between potential and opportunity is painfully clear.
                            </p>
                            <p>
                                <strong>BW Global Advisory (BWGA)</strong> is an advisory practice built from firsthand experience in regional communities &mdash; places that hold real economic potential but lack the tools, connections, and institutional visibility to compete for global investment on equal footing.
                            </p>
                            <p>
                                We watched regional leaders &mdash; mayors, entrepreneurs, councils &mdash; work tirelessly to attract investment. They had the vision, the drive, the raw assets.
                            </p>
                            <p>
                                From that observation came the question: what if you could build a system that internalised all of that methodology &mdash; 60+ years of documented practice across 150 countries &mdash; and made it available to anyone, anywhere, instantly?
                            </p>
                        </div>
                        <div className="space-y-3 mt-3 md:mt-0">
                            <p>
                                The practice exists because of a simple observation: <strong>every &ldquo;new idea&rdquo; is old somewhere.</strong> The 1963 Philippine Integrated Socioeconomic Plan, the 1978 Region 7 Five-Year Development Plan, Special Economic Zones across 80+ countries, PPP frameworks across 150+ nations &mdash; they all follow the same methodology. Growth poles. Investment incentives. Sectoral planning. Infrastructure corridors. The names update. The practice persists. <strong>The past is the solution library.</strong>
                            </p>
                            <p>
                                <strong>BWGA Intelligence AI is the answer.</strong> It is the technology arm of BW Global Advisory. Not a chatbot. Not a search engine. Not a lookup table. It is a complete digital boardroom &mdash; a system that reasons through investment, trade, and development problems using the same depth of analysis that previously required a team of senior consultants, weeks of research, and hundreds of thousands of dollars.
                            </p>
                        </div>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        That&rsquo;s not a criticism &mdash; it&rsquo;s the insight that made this system possible. If the answers already exist, scattered across decades and continents, then the real problem isn&rsquo;t knowledge. It&rsquo;s access. It&rsquo;s synthesis. It&rsquo;s the ability to take what worked in Shenzhen in 1980, in Penang in 1995, in Medell&iacute;n in 2004, and translate it into a strategic roadmap for a regional council staring at a blank page today.
                    </p>

                    {/* Personal Story — Brayden Walls */}
                    <div className="bg-white border-2 border-slate-300 rounded-sm p-8 mb-8 shadow-lg">
                        <h3 className="text-2xl font-semibold text-slate-900 mb-6">Who I am — the founder and sole developer</h3>
                        
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="md:w-2/3">
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    Hey everyone, I'm Brayden Walls, the developer behind <strong>BW NEXUS AI</strong>, and I'm thrilled to finally share this with the world. For the first time, I'm lifting the curtain on what we've built—a groundbreaking neuro-symbolic intelligence system that's not just another AI tool, but a complete rethinking of how machines can reason like humans.
                                </p>
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    For more than 16 months, I've been living, researching, and building in a place that inspired everything you see here — the Philippines. Not in a lab. Not in a corporate office. On the ground, in the communities where economic potential is enormous but the tools to unlock it simply don't exist.
                                </p>
                            </div>
                            <div className="md:w-1/3">
                                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&q=80" alt="Regional landscape" className="w-full h-64 md:h-full object-cover rounded-sm shadow-lg" />
                            </div>
                        </div>

                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            I watched the same pattern repeat everywhere: ambitious businesses exploring new frontiers with incomplete information, regional governments eager for partnerships but unable to translate their advantages into investor language, unproductive meetings built on mismatched expectations. Places like Mindanao, regional Australia, communities across the Pacific — they all wanted the same thing: to be seen, to be understood, to have a fair shot.
                        </p>

                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            So I stopped waiting for someone else to build it. I taught myself to code, studied every economic development framework I could find, and spent over a year turning that knowledge into software. What came out the other side isn't a chatbot or a dashboard — it's a complete reasoning system. One that thinks through problems the way a team of senior consultants would, but faster, cheaper, and available to anyone. What you're about to see below is what I built, how it works, and why nothing else like it exists.
                        </p>

                        <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-300 rounded-sm p-6">
                            <p className="text-lg text-slate-800 leading-relaxed italic mb-3">
                                "Every 'new idea' is old somewhere. The child learns what the parent already knows. The past isn't historical interest. The past is the solution library."
                            </p>
                            <p className="text-slate-600 text-sm font-medium">— Brayden Walls, Founder & Sole Developer</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THE PLATFORM — Professional Architecture Demonstration */}
            {/* ═══════════════════════════════════════════════════════ */}

            {/* Section 1: A WORLD FIRST + Full Story Button */}
            <section id="technology" className="py-12 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm font-bold text-center mb-6">A WORLD FIRST</p>
                    <h2 className="text-4xl md:text-5xl font-light text-center leading-tight mb-4 text-slate-900">
                        Probabilistic AI Is Not Enough.
                    </h2>
                    <p className="text-center text-2xl md:text-3xl font-light mb-12">
                        <span className="text-blue-600 font-normal">Welcome to Deterministic Intelligence.</span>
                    </p>

                    {/* ── THE NARRATIVE: What I Built and Why ── */}

                    {/* Block 1: The Problem — Photo left, narrative right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80" 
                                alt="Global intelligence data" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                Why I built this: the problem with AI today.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Most AI today &mdash; the language models behind ChatGPT, Claude, and others &mdash; is probabilistic. It guesses based on patterns. It can hallucinate facts, silently bias results, or give a different answer every time you ask the same question. It sounds confident, but it can&rsquo;t show its reasoning. And when the stakes are real &mdash; investments, policy decisions, people&rsquo;s livelihoods &mdash; guessing isn&rsquo;t good enough.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                I built BW NEXUS AI because I believed intelligence should be provable. Not generated. Not predicted. <strong>Proven.</strong> Every recommendation traceable, every output repeatable, every claim defensible. That&rsquo;s what deterministic means &mdash; and that&rsquo;s what I set out to create.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-red-50 border-l-4 border-red-400 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-red-800">Language-First AI</p>
                                    <p className="text-xs text-red-600">Sounds confident, but can hallucinate, contradict itself, and can&rsquo;t show its reasoning.</p>
                                </div>
                                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-blue-800">BW NEXUS AI</p>
                                    <p className="text-xs text-blue-600">Validates, debates, scores, simulates, and delivers &mdash; with proof behind every claim.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block 2: What sparked the NSIL — Text left, photo right */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" 
                                alt="The NSIL — what sparked development" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                What sparked this: 12 months that changed everything.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                It started with a frustration. I was watching regions with real potential — talent, resources, strategic location — get passed over because no tool existed to objectively prove their case. Investment decisions were being made on gut feel, biased reports, or whoever had the best pitch deck. I knew there had to be a better way. So I started building.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                The first thing I created was the formula engine — 38+ proprietary formulas like SPI (Strategic Positioning Index), RROI (Risk-Adjusted Return on Investment), and SEAM (Strategic Ethical Alignment Matrix). Each one designed to quantify a dimension of investment intelligence that previously relied on subjective judgement. I built the <strong>DAG Scheduler</strong> (994 lines) to execute them in parallel across 5 dependency levels, so no formula runs before its inputs are ready. That was the foundation.
                            </p>
                            <button 
                                onClick={() => setShowBlock2More(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 mt-1 transition-colors"
                            >
                                Read More ↓
                            </button>
                        </div>
                    </div>

                    {/* Block 3: The Discovery — Photo left, deep narrative right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&q=80" 
                                alt="The Brain — computational neuroscience discovery" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                Then I discovered something that changed the system forever.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                By this point, I had a working intelligence system — formulas, validation, debate, autonomous engines, reflexive analysis, all running through the NSIL pipeline. It was already producing results no other platform could match. But something was missing. The outputs were technically correct, but they lacked the instinct of a seasoned human expert — the ability to sense that a deal feels wrong even when the numbers look right, or to know which risk deserves attention when ten are competing for it.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                That’s when I found computational neuroscience — real mathematical models of how the human brain makes decisions under pressure. Models from published university research that had been sitting in academic papers for decades, never implemented in a practical system. I realised they could slot directly into the architecture I’d already built. The NSIL was designed to be extensible. So I added them.
                            </p>
                            <button 
                                onClick={() => setShowBlock3More(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 mt-1 transition-colors"
                            >
                                Read More ↓
                            </button>
                        </div>
                    </div>

                    {/* Block 4: The Autonomous & Reflexive Engines — Text left, photo right */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80" 
                                alt="Autonomous and reflexive intelligence" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                It doesn’t just answer. It thinks beyond your question — and analyses how you think.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                I created 8 autonomous engines that actively discover insights you never asked for. Creative Synthesis uses bisociation theory (608 lines) to find strategies from unrelated domains. Ethical Reasoning enforces Rawlsian fairness gates (534 lines) — if a path is unethical, it’s rejected, no matter how profitable. Self-Evolving Algorithms tune their own formula weights using gradient descent with rollback (403 lines). Scenario Simulation runs 5,000 Monte Carlo futures with causal feedback loops (504 lines).
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                Then 7 reflexive engines analyse <em>you</em>. User Signal Decoder uses Shannon’s information theory (591 lines) to detect what you repeat (what matters) and what you avoid (where anxiety lives). Regional Mirroring finds your structural twin region worldwide (612 lines). Latent Advantage Miner surfaces assets you mentioned casually that have real strategic significance (483 lines). Every finding is then translated for 5 distinct audiences — investors, government, community, partners, executives — in their own language.
                            </p>
                            <button 
                                onClick={() => setShowBlock4More(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 mt-1 transition-colors"
                            >
                                Read More ↓
                            </button>
                        </div>
                    </div>

                    {/* Block 5: Watch it Think — Photo left, text right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80" 
                                alt="Live intelligence — watch it think" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                You don’t need to understand any of this. It’s here to help you.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Everything you’ve just read — the formulas, the engines, the neuroscience models — you don’t need to understand how any of it works. You just need to know it’s there, running behind the scenes, working for you 24/7. This system was built so that you can do something you’ve only ever wished for: walk into any room — a boardroom, a government briefing, an investor meeting — and speak their language with confidence.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                This isn’t about becoming a data scientist or learning complex algorithms. It’s about having a tool that does the heavy lifting for you and gives you something real to stand behind. With belief in yourself and plenty of practice, this system helps you understand a way of thinking that changes how people see you and your ideas. It helps you speak the language of those you want to attract — investors, partners, decision-makers — and it gives you the evidence to back it up.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                The technology is real. The results are real. And it’s all here to help you succeed. That’s the only thing that matters.
                            </p>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm p-5 mb-4">
                                <p className="text-sm text-white leading-relaxed font-medium mb-4">
                                    “You don’t need to understand how the engine works to drive the car. You just need to know it will get you where you want to go — safely, reliably, every single time.”
                                </p>
                                <button 
                                    onClick={() => setShowProofPopup(true)}
                                    className="w-full py-3 bg-white/20 text-white border border-white/30 rounded-sm text-sm font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Info size={16} />
                                    See the Proof — A Real System, A Real Report
                                </button>
                            </div>
                            <button 
                                onClick={() => setShowBlock5Popup(true)}
                                className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Info size={16} />
                                See What You Get &amp; How It Works For You
                            </button>
                        </div>
                    </div>

                    {/* Block 6: Why This Matters — Full-width statement */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-sm p-8 md:p-12 mb-8">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            Why this matters. Why it&rsquo;s different.
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">
                            Traditional AI is probabilistic &mdash; it guesses based on patterns and hides its reasoning behind black boxes. BW NEXUS AI is deterministic &mdash; it proves every claim with audit trails and repeatable processes. While other systems rely on single-point estimates or smoothed-over disagreements, the NSIL preserves explicit decision points, stress-tests 5,000+ scenarios, and enforces ethical gates that reject unethical paths.
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">
                            The core problem I&rsquo;m solving is trust. Most AI can&rsquo;t be relied on for real decisions because it hallucinates, biases results, or gives inconsistent answers. This leads to bad investments, flawed strategies, and ethical lapses. BW NEXUS AI solves this by delivering intelligence that&rsquo;s traceable, repeatable, and defensible &mdash; eliminating garbage-in-garbage-out through SAT validation, grounding analysis in institutional memory, and simulating human cognition so outputs have the nuance of an experienced expert.
                        </p>
                        <p className="text-sm text-white leading-relaxed font-medium">
                            This isn&rsquo;t just technology. It&rsquo;s a paradigm shift &mdash; built to restore confidence in artificial intelligence, so people can finally make decisions they can defend in boardrooms, government briefings, and investment committees.
                        </p>
                        <p className="text-sm text-slate-400 mt-4 mb-3">Want to see every algorithm, formula, engine, and the full NSIL architecture that makes this possible?</p>
                        <button 
                            onClick={() => setShowFormulas(!showFormulas)}
                            className="inline-flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <GitBranch size={18} />
                            {showFormulas ? 'Hide Full Technical Breakdown' : 'View Full Architecture & 38+ Formulas'}
                        </button>
                    </div>



                    {showFormulas && (
                        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-sm p-6 md:p-8 space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-900">The Full Technical Breakdown: Inside the NSIL</h3>
                                <button onClick={() => setShowFormulas(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                            </div>

                            <p>The NSIL &mdash; Nexus Strategic Intelligence Layer &mdash; is the orchestration engine I invented to make AI deterministic. It&rsquo;s implemented in <span className="font-mono text-xs bg-white px-1 rounded">services/NSILIntelligenceHub.ts</span> and runs every analysis through 10 computational layers in sequence, with parallelism inside each layer where dependencies allow. Same inputs, same outputs, every time. Here&rsquo;s every layer, every formula, every engine.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 0 &mdash; The Laws (Knowledge Architecture)</h4>
                            <p>Hard-coded economic truth that the AI cannot alter. 38+ proprietary formulas defined with fixed mathematical relationships and bounded outputs, managed by a DAG Scheduler (994 lines, <span className="font-mono text-xs bg-white px-1 rounded">DAGScheduler.ts</span>). The scheduler maps every formula into a directed acyclic graph across 5 execution levels &mdash; Level 0 runs PRI, CRI, BARNA, and TCO in parallel; Level 1 feeds into SPI, RROI, NVI, RNI, CAP; Level 2 produces SEAM, IVAS, ESI, FRS, AGI, VCI; Level 3 creates the master Strategic Confidence Framework (SCF); Level 4 runs 8 autonomous intelligence indices. Results are memoised &mdash; no formula executes twice.</p>

                            <p>Three examples of what these formulas do: <strong>SPI</strong> (Strategic Positioning Index) quantifies market dominance by weighting political risk against country risk with growth-adjusted positioning. <strong>RROI</strong> (Risk-Adjusted Return on Investment) runs Monte Carlo propagation across probability-weighted scenarios &mdash; real-world variance, not a single optimistic projection. <strong>SEAM</strong> (Strategic Ethical Alignment Matrix) cross-references strategy against policy frameworks and stakeholder impact.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 1 &mdash; The Shield (Input Validation)</h4>
                            <p>A SAT Contradiction Solver I wrote (391 lines, <span className="font-mono text-xs bg-white px-1 rounded">SATContradictionSolver.ts</span>) converts inputs into propositional logic &mdash; conjunctive normal form &mdash; and runs a DPLL-based satisfiability check. Catches contradictions like claiming low risk while expecting 40%+ ROI, targeting global expansion on a small budget, or combining conservative strategy with aggressive growth targets. Each contradiction is classified by severity.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 2 &mdash; The Boardroom (Multi-Agent Debate)</h4>
                            <p>Five adversarial personas &mdash; Skeptic (1.2x weight), Advocate, Regulator, Accountant, and Operator &mdash; conduct a structured Bayesian debate (557 lines, <span className="font-mono text-xs bg-white px-1 rounded">BayesianDebateEngine.ts</span>). Each votes across four outcomes: proceed, pause, restructure, or reject. Beliefs update via Bayesian inference. Early stopping at 0.75 posterior probability or 0.02 belief delta. Disagreements resolved through Nash bargaining. Every persona&rsquo;s reasoning preserved in the audit trail.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 3 &mdash; The Engine (Formula Scoring)</h4>
                            <p>The DAG Scheduler executes the full 38+ formula suite with typed inputs, bounded outputs, component breakdowns, and execution timing. Results flow into a <span className="font-mono text-xs bg-white px-1 rounded">CompositeScoreService</span> that normalises raw data against region-specific baselines. Deterministic jitter from hash-based seeding ensures reproducibility.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 4 &mdash; Stress Testing (Scenario Simulation)</h4>
                            <p>The Scenario Simulation Engine (504 lines, <span className="font-mono text-xs bg-white px-1 rounded">ScenarioSimulationEngine.ts</span>) builds causal graphs with feedback loops, runs Monte Carlo propagation through multi-step chains with non-linear dynamics, and simulates forward outcomes using Markov chain state transitions across economic, political, social, environmental, technological, and regulatory categories.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 5 &mdash; The Brain (Human Cognition Engine)</h4>
                            <p>The Human Cognition Engine I wrote (1,307 lines, <span className="font-mono text-xs bg-white px-1 rounded">HumanCognitionEngine.ts</span>) implements 7 neuroscience models as mathematical implementations:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li><strong>Wilson-Cowan Neural Field Dynamics</strong> &mdash; Differential equations on excitatory/inhibitory neuron populations on a 50&times;50 spatial grid. Parameters: w_ee=1.5, w_ei=-1.0, w_ie=1.0, w_ii=-0.5, dt=0.01.</li>
                                <li><strong>Predictive Coding (Rao &amp; Ballard)</strong> &mdash; 3-level hierarchical belief updating with prediction error minimisation. Learning rate 0.1.</li>
                                <li><strong>Free Energy Principle (Friston)</strong> &mdash; Variational inference across 8 candidate policies, discount factor &gamma;=0.95.</li>
                                <li><strong>Attention Models (Itti &amp; Koch)</strong> &mdash; Salience maps with intensity/colour/orientation weights. Winner-take-all with inhibition of return (0.7).</li>
                                <li><strong>Emotional Processing</strong> &mdash; Neurovisceral integration theory, emotional inertia (0.8), autonomic coupling (0.6).</li>
                                <li><strong>Global Workspace Theory</strong> &mdash; Coalition formation with ignition threshold 0.6. Information broadcasting across cognitive subsystems.</li>
                                <li><strong>Baddeley&rsquo;s Working Memory</strong> &mdash; Phonological decay 0.05, visual decay 0.03, rehearsal benefit 0.2.</li>
                            </ol>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 6 &mdash; Autonomous Intelligence (8 Engines)</h4>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>Creative Synthesis</strong> (608 lines) &mdash; Koestler&rsquo;s bisociation theory + Fauconnier &amp; Turner conceptual blending.</li>
                                <li><strong>Cross-Domain Transfer</strong> &mdash; Maps biology, physics, engineering onto economics via Gentner&rsquo;s structure-mapping theory.</li>
                                <li><strong>Autonomous Goal</strong> &mdash; Detects emergent strategic goals from top-level index scores.</li>
                                <li><strong>Ethical Reasoning</strong> (534 lines) &mdash; Multi-stakeholder utility, Rawlsian fairness, Stern Review discount rates (&le;1.4%). Every recommendation must pass this gate.</li>
                                <li><strong>Self-Evolving Algorithm</strong> (403 lines) &mdash; Online gradient descent w_t+1 = w_t - &eta;&nabla;L, Thompson sampling, mutation-selection with full rollback.</li>
                                <li><strong>Adaptive Learning</strong> &mdash; Bayesian belief updates from outcome feedback.</li>
                                <li><strong>Emotional Intelligence</strong> &mdash; Prospect Theory + Russell&rsquo;s Circumplex Model for stakeholder dynamics.</li>
                                <li><strong>Scenario Simulation</strong> (504 lines) &mdash; 5,000 Monte Carlo runs with causal loop modelling and Markov state transitions.</li>
                            </ul>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layers 7&ndash;9 &mdash; Proactive, Output &amp; Reflexive</h4>
                            <p><strong>Layer 7 (Proactive):</strong> Seven engines for backtesting, drift detection, continuous learning, and proactive signal mining.</p>
                            <p><strong>Layer 8 (Output Synthesis):</strong> Provenance tracking, full audit trails, 156 letter templates, 232 document types &mdash; all populated with exact data and confidence scores.</p>
                            <p><strong>Layer 9 (Reflexive Intelligence):</strong> Seven engines that analyse the user:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>User Signal Decoder</strong> (591 lines) &mdash; Shannon&rsquo;s information-theoretic redundancy. Detects repetition, avoidance, and emotional emphasis.</li>
                                <li><strong>Internal Echo Detector</strong> &mdash; Prevents confirmation bias inside the machine itself.</li>
                                <li><strong>Investment Lifecycle Mapper</strong> &mdash; Maps project lifecycle stage, adjusts analysis accordingly.</li>
                                <li><strong>Regional Mirroring</strong> (612 lines) &mdash; Finds structural twin regions via structure-mapping across 6 dimensions.</li>
                                <li><strong>Regional Identity Decoder</strong> &mdash; Detects when authentic identity has been replaced with generic marketing language.</li>
                                <li><strong>Latent Advantage Miner</strong> (483 lines) &mdash; Surfaces casually mentioned assets with real strategic significance.</li>
                                <li><strong>Universal Translation Layer</strong> &mdash; Translates findings for 5 audiences: investors, government, community, partners, executives.</li>
                            </ul>

                            <h4 className="text-base font-bold text-slate-900 pt-4">The 38+ Proprietary Formulas</h4>
                            <div className="grid md:grid-cols-3 gap-3 mt-2">
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Core Indices</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; SPI&trade; &mdash; Success Probability Index</li>
                                        <li>&bull; RROI&trade; &mdash; Regional Return on Investment</li>
                                        <li>&bull; SEAM&trade; &mdash; Stakeholder Alignment Matrix</li>
                                        <li>&bull; PVI&trade; &mdash; Partnership Viability Index</li>
                                        <li>&bull; RRI&trade; &mdash; Regional Resilience Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Risk Formulas</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; CRPS &mdash; Composite Risk Priority Score</li>
                                        <li>&bull; RME &mdash; Risk Mitigation Effectiveness</li>
                                        <li>&bull; VaR &mdash; Value at Risk</li>
                                        <li>&bull; SRCI &mdash; Supply Chain Risk Index</li>
                                        <li>&bull; PSS &mdash; Policy Shock Sensitivity</li>
                                        <li>&bull; PRS &mdash; Political Risk Score</li>
                                        <li>&bull; DCS &mdash; Dependency Concentration</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Financial Metrics</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; IRR &mdash; Internal Rate of Return</li>
                                        <li>&bull; NPV &mdash; Net Present Value</li>
                                        <li>&bull; WACC &mdash; Weighted Cost of Capital</li>
                                        <li>&bull; DSCR &mdash; Debt Service Coverage</li>
                                        <li>&bull; FMS &mdash; Funding Match Score</li>
                                        <li>&bull; ROE &mdash; Return on Equity</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Operational Scores</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; ORS &mdash; Organizational Readiness</li>
                                        <li>&bull; TCS &mdash; Team Capability Score</li>
                                        <li>&bull; EEI &mdash; Execution Efficiency Index</li>
                                        <li>&bull; SEQ &mdash; Sequencing Integrity Score</li>
                                        <li>&bull; CGI &mdash; Capability Gap Index</li>
                                        <li>&bull; LCI &mdash; Leadership Confidence Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Market Formulas</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; MPI &mdash; Market Penetration Index</li>
                                        <li>&bull; CAI &mdash; Competitive Advantage Index</li>
                                        <li>&bull; TAM &mdash; Total Addressable Market</li>
                                        <li>&bull; SAM &mdash; Serviceable Available Market</li>
                                        <li>&bull; GRI &mdash; Growth Rate Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Governance Metrics</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; GCI &mdash; Governance Confidence Index</li>
                                        <li>&bull; CCS &mdash; Compliance Certainty Score</li>
                                        <li>&bull; TPI &mdash; Transparency Index</li>
                                        <li>&bull; ARI &mdash; Audit Readiness Index</li>
                                        <li>&bull; RFI &mdash; Regulatory Friction Index</li>
                                        <li>&bull; CIS &mdash; Counterparty Integrity Score</li>
                                        <li>&bull; ESG &mdash; Environmental Social Governance</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mt-4">
                                <p className="text-xs text-slate-700 italic">
                                    Every formula has defined methodology, transparent inputs, and a full audit trail. The 22 autonomous, proactive, and reflexive engines are backed by published mathematical theory, implemented in real TypeScript with no placeholders. This is the system I built. This is what makes it a world first.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <div className="w-full h-28 md:h-36 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=400&fit=crop&q=80" alt="Intelligence technology" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-900/20" />
            </div>

            {/* Section 4: FOUR PRODUCTS — Clean cards matching WHO THIS IS FOR */}
            <section className="py-12 px-4 bg-slate-100">
                <div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm mb-6 font-bold text-center">FOUR WAYS TO ACCESS INTELLIGENCE</p>
                    <h2 className="text-3xl md:text-4xl font-light text-center leading-tight mb-4 text-slate-900">
                        One Engine. Four Interfaces.
                    </h2>
                    <p className="text-lg text-slate-600 text-center mb-8 max-w-3xl mx-auto">
                        Everything feeds into the same core pipeline &mdash; the same 6-phase NSIL architecture, the same 38+ formulas, the same adversarial debate. We just made it accessible in four different ways depending on what you need.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                                    <Search size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">BW AI Search</h3>
                                    <p className="text-sm font-semibold text-blue-600">The Gateway.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                Search any location on earth. In seconds, the retrieval and synthesis layers assemble a structured intelligence brief &mdash; demographics, GDP, leadership, infrastructure, investment climate, constraints, and investability signals &mdash; as the entry point to deeper analysis.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">Powered by vector memory retrieval + synthesis layers</p>
                        </div>

                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                                    <FileCheck size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Live Report</h3>
                                    <p className="text-sm font-semibold text-blue-600">The War Room.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                Watch all 6 phases fire in real time. See the SAT solver validate, the 5 personas debate, the DAG scheduler execute formulas, the Wilson-Cowan cognition layer simulate, and the strategy build itself before your eyes &mdash; section by section with full traceability.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">Visualises all 6 computational layers with live audit trail</p>
                        </div>

                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 border border-indigo-300 rounded-lg flex items-center justify-center">
                                    <Users size={20} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">BW Consultant</h3>
                                    <p className="text-sm font-semibold text-indigo-600">The Partner.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                An embedded AI consultant powered by the interactive synthesis layer &mdash; clarifying inputs, challenging assumptions through the persona debate engine, and translating validated scores and analysis into actionable strategy.
                            </p>
                            <p className="text-xs text-indigo-600 font-medium">Interactive access to the adversarial debate + synthesis layers</p>
                        </div>

                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                                    <GitBranch size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Document Factory</h3>
                                    <p className="text-sm font-semibold text-blue-600">The Closer.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                The output layer turns validated, scored analysis into signed deals. Access 156 letter templates and 232 document types &mdash; LOIs, Term Sheets, RFPs, feasibility studies &mdash; all populated with your exact project data, confidence scores, and evidence trails from the pipeline.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">Board-ready documents generated from the full 6-phase pipeline</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BW AI SEARCH — Location Intelligence */}
            <section id="bwai-search" className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">BW AI SEARCH</p>
                    <h2 className="text-2xl md:text-3xl font-light mb-3 text-slate-900">Try It. Search Any Location.</h2>
                    <p className="text-base text-slate-600 leading-relaxed mb-8">
                        Type a city, region, or country below and see what comes back. The system assembles a structured intelligence brief — demographics, GDP, leadership, infrastructure, investment climate — in seconds. This is the entry point. Everything else on this page describes what happens after.
                    </p>
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                                placeholder="Search any city, region, or country..."
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={handleLocationSearch}
                            disabled={isResearchingLocation || !locationQuery.trim()}
                            className={`px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                isResearchingLocation || !locationQuery.trim()
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-500'
                            }`}
                        >
                            <Search size={16} />
                            {isResearchingLocation ? 'Researching...' : 'Research'}
                        </button>
                    </div>
                    {researchProgress && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-600">{researchProgress.message}</span>
                                <span className="text-xs text-blue-600 font-mono">{researchProgress.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${researchProgress.progress}%` }} />
                            </div>
                        </div>
                    )}
                    {searchError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                            <p className="text-sm text-red-600">{searchError}</p>
                        </div>
                    )}
                    {researchSummary && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-2">Intelligence Summary</p>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{researchSummary}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Photo Banner — Document Intelligence */}

            {/* WHO THIS IS FOR */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">WHO THIS IS FOR</p>
                    <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">You Don't Need to Be an Expert. <span className="text-blue-600 font-normal">The System Already Is.</span></h2>
                    <p className="text-base text-slate-600 leading-relaxed mb-10 max-w-3xl">
                        The people who need this most are the ones who've never had access to it. That's the point.
                    </p>

                    {/* WHO — narrative cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center"><Building2 size={20} className="text-blue-600" /></div>
                                <h3 className="text-base font-semibold text-slate-900">Regional Councils & Development Agencies</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                You know your region has potential. You've seen it your entire career. But when the investment board asks for a risk-adjusted ROI model or a stakeholder alignment matrix, the budget doesn't stretch. This system gives you the same analytical depth — scored, stress-tested, and formatted — without the consulting invoice.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">What you get: prospectuses, structural twin analysis, lifecycle mapping, advantage mining, scenario stress-testing</p>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center"><Scale size={20} className="text-blue-600" /></div>
                                <h3 className="text-base font-semibold text-slate-900">Government Agencies & Investment Boards</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                You're screening proposals, evaluating bids, or deciding which initiatives get funded. Every decision needs a defensible trail. This system stress-tests assumptions, surfaces deal-killers early, runs adversarial debate from five perspectives, and produces a documented rationale you can stand behind in scrutiny.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">What you get: scored viability assessments, ethical gates, friction analysis, traceable decision rationale</p>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center"><Briefcase size={20} className="text-blue-600" /></div>
                                <h3 className="text-base font-semibold text-slate-900">Businesses Expanding Into New Regions</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                You've outgrown your home market. You're looking at Southeast Asia, the Pacific, Latin America — but you don't know the regulatory landscape, the real cost of entry, or which local partners are credible. This system researches any location in seconds, scores your entry strategy against historical patterns, and flags what will go wrong before you commit capital.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">What you get: BW AI Search briefs, risk assessment, partner ecosystem mapping, activation timeline forecasts</p>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center"><Globe size={20} className="text-blue-600" /></div>
                                <h3 className="text-base font-semibold text-slate-900">First-Time Exporters & Regional Entrepreneurs</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                You've never written an investment prospectus. You don't know what a due diligence pack looks like. You've never seen a Monte Carlo simulation. That's fine — the system walks you through a guided 10-step intake, asks the right questions, and produces the documents that open doors. The BW Consultant AI sits alongside you at every step.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">Guided intake, built-in consultant, and step-by-step preparation — without needing a consulting team</p>
                        </div>
                    </div>

                    {/* How the system adapts */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-6 rounded-r-sm">
                        <p className="text-base text-slate-800 leading-relaxed">
                            <strong className="text-slate-900">The system adapts to you.</strong> First-time users get full walkthroughs, guided intake, and pattern confidence explained at every stage. Teams review scores together with shared workspaces. Experts get direct formula access, full audit trail export, visible DAG scheduling, and adjustable Monte Carlo parameters. Same engine — different depth based on who's driving.
                        </p>
                    </div>
                </div>
            </section>

            {/* NEXT STEPS - Partnership & Pilot Programs */}
            <section id="pilots" className="py-16 px-4 bg-slate-100">
                <div className="max-w-6xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">NEXT STEPS</p>
                    <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-4">Work With Us</h2>
                    <p className="text-base text-slate-600 mb-8 max-w-3xl">We're looking for forward-thinking organisations who want to pilot a new standard for how investment decisions get made — and help shape the platform before it goes to market.</p>
                    
                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Zap size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Investment Promotion Agencies</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">You review hundreds of investment leads a year. Most don't go anywhere. The ones that do take months of manual due diligence before you can even bring them to a board.</p>
                            <p className="text-sm text-slate-700 font-medium">Pilot the system on your next intake cycle — screen proposals in hours instead of weeks, with board-ready scoring and a defensible evidence trail from day one.</p>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Regional Economic Development</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">Your region has real assets — a port, a university, agricultural land, a diaspora network — but the investment prospectus hasn't been written, or the one you have reads like every other region in the country.</p>
                            <p className="text-sm text-slate-700 font-medium">Partner on a regional intelligence project — we'll identify what your region actually has, find your structural twins globally, and produce the documents that get you into the room with the right investors.</p>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Public-Private Partnerships</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">PPP proposals fail most often not because the project is bad, but because stakeholder alignment was assumed instead of modelled. The economics looked good on paper but nobody stress-tested the assumptions.</p>
                            <p className="text-sm text-slate-700 font-medium">Run your next PPP proposal through the system — stress-test the financials across 5,000 scenarios, model every stakeholder's incentives, and surface the deal-killers before they reach the minister's desk.</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-200 rounded-lg flex items-center justify-center">
                                    <Globe size={18} className="text-blue-700" />
                                </div>
                                <h3 className="text-sm font-bold text-blue-700">Where This Is Going</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">Every pilot teaches us something. Every partnership sharpens the intelligence. The long-term vision is a sovereign-grade national strategic asset — 22 intelligence engines working in concert, translating the same analysis into the language every stakeholder actually needs.</p>
                            <p className="text-sm text-blue-700 font-medium">Early partners don't just get access to the platform. They help define what it becomes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLVING REAL PROBLEMS — compact callout */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-6 rounded-r-sm">
                        <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">SOLVING REAL PROBLEMS</p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This platform exists to help capital, partnerships, and capability reach places that are too often overlooked — despite holding extraordinary, investable potential. During this beta phase and in future subscriptions, <strong className="text-blue-600">10% of every paid transaction</strong> goes back into initiatives that support regional development. A new voice for regions. A new standard for how opportunity is evaluated — anywhere in the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER INFO SECTION */}
            <section id="footer-info" className="py-12 px-4 bg-slate-900">
                <div className="max-w-4xl mx-auto">
                        <p className="text-xl font-semibold text-white mb-6">
                            Launch the full BW Nexus Intelligence OS to start analyzing partnership opportunities with sovereign-grade analytical depth.
                        </p>

                        {/* Terms of Engagement */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 text-left">
                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <Shield size={16} className="text-sky-300" />
                                Terms of Engagement
                            </h4>
                            <div className="space-y-2 text-sm text-white/60">
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
                                className="mt-0.5 w-4 h-4 rounded border-white/30 bg-transparent text-sky-300 focus:ring-blue-400 cursor-pointer"
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-white/60 cursor-pointer">
                                By accessing the platform, you agree to our <strong className="text-white">Terms & Conditions</strong>
                            </label>
                        </div>

                        {/* Launch Button */}
                        <button 
                            disabled={!termsAccepted}
                            onClick={() => termsAccepted && onEnterPlatform?.()}
                            className={`w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 mb-6 ${
                                termsAccepted 
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' 
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                        >
                            Launch Intelligence OS
                            <ArrowRight size={20} />
                        </button>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider mb-3">BWGA Intelligence AI</h4>
                            <p className="text-sm text-white/60 mb-4">
                                BW Global Advisory is an Australian strategic intelligence firm developing sovereign-grade AI systems for cross-border investment and regional economic development.
                            </p>
                            <div className="space-y-1 text-sm text-white/50">
                                <p className="flex items-center gap-2"><Mail size={14} /> brayden@bwglobaladvis.info</p>
                                <p className="flex items-center gap-2"><Phone size={14} /> +63 960 835 4283</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider mb-3">Development Status</h4>
                            <p className="text-sm text-white/80 mb-2"><strong>CURRENT PHASE:</strong> Research & Development</p>
                            <p className="text-sm text-white/60 mb-4">
                                BWGA AI is currently in active R&D phase, operating under Brayden Walls as a registered Australian sole trader. The platform is being developed for future commercial deployment to government and enterprise clients.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-white/50">
                                <button onClick={() => setActiveDocument('user-manual')} className="hover:text-white transition-colors">User Manual</button>
                                <button onClick={() => setActiveDocument('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
                                <button onClick={() => setActiveDocument('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                                <button onClick={() => setActiveDocument('ethics')} className="hover:text-white transition-colors">Ethical AI Framework</button>
                            </div>
                        </div>
                    </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* WHAT YOU GET — Detail Popup Modal                          */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {showOutputDetails && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setShowOutputDetails(false)}>
                    <div className="relative w-full max-w-3xl my-8 mx-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowOutputDetails(false)} className="fixed top-4 right-4 z-20 w-10 h-10 bg-stone-800 border border-stone-600 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg">
                            <X size={16} className="text-stone-300" />
                        </button>
                        <div className="bg-white rounded-sm shadow-2xl overflow-hidden">
                        <section className="py-12 px-6 md:px-8 bg-slate-100">
                            <div className="max-w-4xl mx-auto">
                            <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">WHAT YOU GET</p>
                            <h2 className="text-2xl font-light text-slate-900 mb-6">The Full Picture</h2>

                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                This is where the system becomes practical. It takes what would normally live across spreadsheets, slide decks, consultant workstreams, and weeks of revisions &mdash; and assembles it into institutional-ready deliverables.
                            </p>

                            <div className="space-y-4 text-sm text-slate-600 mb-8">
                                <p><strong className="text-slate-900">Why it exists:</strong> High-potential regional projects fail not because the opportunity isn&rsquo;t real &mdash; but because nobody packaged the case at the standard investors and governments expect. This fixes that.</p>
                                <p><strong className="text-slate-900">How it works:</strong> It fuses your intake data, scores, and risk tests into a single evidence-backed narrative.</p>
                                <p><strong className="text-slate-900">What you get:</strong> Decision-ready documents and packs that match the expectations of boards, agencies, and partners &mdash; generated from the same validated analysis.</p>
                            </div>

                            <h3 className="text-sm font-semibold text-blue-600 mb-4">Document Factory Catalog</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-2">Strategic Reports</h5>
                                    <ul className="space-y-1 text-xs text-slate-600">
                                        <li>&bull; Investment Prospectus</li>
                                        <li>&bull; Partnership Viability Assessment</li>
                                        <li>&bull; Market Entry Analysis</li>
                                        <li>&bull; Competitive Landscape Report</li>
                                        <li>&bull; Stakeholder Alignment Matrix</li>
                                        <li>&bull; Risk Assessment Report</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-2">Financial Documents</h5>
                                    <ul className="space-y-1 text-xs text-slate-600">
                                        <li>&bull; ROI Projection Model</li>
                                        <li>&bull; Financial Due Diligence Pack</li>
                                        <li>&bull; Investment Term Sheet</li>
                                        <li>&bull; Budget Allocation Framework</li>
                                        <li>&bull; Monte Carlo Simulation Report</li>
                                        <li>&bull; Sensitivity Analysis</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-2">Legal Templates</h5>
                                    <ul className="space-y-1 text-xs text-slate-600">
                                        <li>&bull; Letter of Intent (LOI)</li>
                                        <li>&bull; Memorandum of Understanding (MOU)</li>
                                        <li>&bull; Non-Disclosure Agreement</li>
                                        <li>&bull; Partnership Agreement Draft</li>
                                        <li>&bull; Grant Application Template</li>
                                        <li>&bull; Compliance Checklist</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-2">Communication Packs</h5>
                                    <ul className="space-y-1 text-xs text-slate-600">
                                        <li>&bull; Executive Summary Brief</li>
                                        <li>&bull; Board Presentation Deck</li>
                                        <li>&bull; Investor Pitch Document</li>
                                        <li>&bull; Stakeholder Update Letter</li>
                                        <li>&bull; Media Release Template</li>
                                        <li>&bull; Partner Onboarding Pack</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong className="text-slate-700">The audit trail:</strong> Every recommendation traces back to specific data inputs, formula calculations, and persona debate transcripts. This isn&rsquo;t a black box &mdash; it&rsquo;s court-defensible, investor-ready documentation of exactly why the system reached each conclusion.
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-6 rounded-r-sm">
                                <p className="text-base text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">But the system can only produce all of this if it has the right inputs.</strong> That&rsquo;s the next piece &mdash; a structured 10-step process that captures every dimension of your opportunity: identity, strategy, financials, risk, governance. It takes 30&ndash;45 minutes, and by the end, the reasoning engine has everything it needs to do its job.
                                </p>
                            </div>
                            </div>
                        </section>
                        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-sm">
                            <button 
                                onClick={() => setShowOutputDetails(false)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* TEN-STEP PROTOCOL — Detail Popup Modal                     */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {showProtocolDetails && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setShowProtocolDetails(false)}>
                    <div className="relative w-full max-w-4xl my-8 mx-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowProtocolDetails(false)} className="fixed top-4 right-4 z-20 w-10 h-10 bg-stone-800 border border-stone-600 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg">
                            <X size={16} className="text-stone-300" />
                        </button>
                        <div className="bg-white rounded-sm shadow-2xl overflow-hidden">
                        <section className="py-12 px-6 md:px-8 bg-slate-100">
                            <div className="max-w-4xl mx-auto">
                            <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">HOW YOU FEED THE BRAIN</p>
                            <h2 className="text-2xl font-light text-slate-900 mb-2">The Ten-Step Protocol</h2>
                            <p className="text-base text-blue-600 mb-4 flex items-center gap-2 font-medium">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                Most users complete this in 30-45 minutes
                            </p>

                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                Each step captures a critical dimension of your opportunity. By the end, you have clear scope, quantified assumptions, full risk visibility, and a consistent dataset the reasoning engine can trust.
                            </p>
                            <p className="text-sm text-blue-600 font-semibold mb-6">Click any step below to see the detailed data requirements.</p>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {tenStepProtocol.map((item) => (
                                    <button
                                        key={item.step}
                                        onClick={() => setActiveStep(activeStep === item.step ? null : item.step)}
                                        className={`text-left transition-all rounded-xl p-5 border-2 ${
                                            activeStep === item.step
                                                ? 'bg-blue-100 border-blue-400'
                                                : item.gliEnabled
                                                    ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                                activeStep === item.step ? 'bg-blue-600 text-white' : item.gliEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {item.step}
                                            </div>
                                            <span className="text-xs text-slate-600 font-medium">Step {item.step}</span>
                                            {item.gliEnabled && <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded font-medium">GLI</span>}
                                        </div>
                                        <h4 className="text-sm font-semibold text-slate-700 leading-tight">{item.title}</h4>
                                    </button>
                                ))}
                            </div>

                            {activeStep && (
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Step {activeStep}: {tenStepProtocol[activeStep - 1].title}</h4>
                                    <p className="text-sm text-slate-600 mb-4">{tenStepProtocol[activeStep - 1].description}</p>

                                    {tenStepProtocol[activeStep - 1].gliEnabled && tenStepProtocol[activeStep - 1].gliNote && (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                                            <p className="text-xs text-indigo-600">{tenStepProtocol[activeStep - 1].gliNote}</p>
                                        </div>
                                    )}

                                    <div className="bg-slate-100 rounded-lg p-4">
                                        <h5 className="text-xs font-semibold text-blue-600 mb-3">Data Requirements:</h5>
                                        <ul className="grid md:grid-cols-2 gap-2">
                                            {tenStepProtocol[activeStep - 1].details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                                    <CheckCircle2 size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8 mb-4">
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Most tools generate text. This system validates reality. It treats your input as a hypothesis, tests it against evidence, and then produces a defensible, board-ready package.
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    The workflow has three stages: <strong className="text-blue-600">Structured Intake</strong> (define the opportunity in measurable terms), <strong className="text-blue-600">Adversarial Analysis</strong> (stress-test with personas and scoring models), and <strong className="text-blue-600">Institutional Output</strong> (compile evidence into auditable deliverables).
                                </p>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                Once the ten-step intake is complete, your structured inputs, validated scores, and risk assessments become the raw material for the final stage: turning analysis into action.
                            </p>
                            </div>
                        </section>
                        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-sm">
                            <button 
                                onClick={() => setShowProtocolDetails(false)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 2 — Read More Popup */}
            {showBlock2More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock2More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                What sparked this: 12 months that changed everything.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                It started with a frustration. I was watching regions with real potential — talent, resources, strategic location — get passed over because no tool existed to objectively prove their case. Investment decisions were being made on gut feel, biased reports, or whoever had the best pitch deck. I knew there had to be a better way. So I started building.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                The first thing I created was the formula engine — 38+ proprietary formulas like SPI (Strategic Positioning Index), RROI (Risk-Adjusted Return on Investment), and SEAM (Strategic Ethical Alignment Matrix). Each one designed to quantify a dimension of investment intelligence that previously relied on subjective judgement. I built the <strong>DAG Scheduler</strong> (994 lines) to execute them in parallel across 5 dependency levels, so no formula runs before its inputs are ready. That was the foundation.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Then I built the validation layer — a <strong>SAT Contradiction Solver</strong> (391 lines) that converts inputs into propositional logic and catches contradictions before anything else runs. If your assumptions conflict, the system tells you immediately. No more garbage-in-garbage-out.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Next came the debate engine. I wanted the system to argue with itself — to stress-test every recommendation before it reached the user. So I built the <strong>Bayesian Debate Engine</strong> (557 lines) with 5 adversarial personas: the Skeptic hunts for deal-killers, the Advocate finds upside, the Regulator checks legality, the Accountant validates cash flow, and the Operator tests execution. Beliefs update via Bayesian inference. Disagreements are preserved, not smoothed over.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Then I added autonomous intelligence — 8 engines that think beyond the question. And reflexive intelligence — 7 engines that analyse how <em>you</em> think. Layer by layer, month by month, the system grew. I called the orchestration engine the <strong>NSIL — the Nexus Strategic Intelligence Layer</strong> — a 10-layer pipeline I invented from scratch to make all of this run deterministically.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                128 TypeScript files. 50,000 lines of code. Clean builds in under 5 seconds across 2,105 modules. Full type safety with 900+ lines of strict definitions. 209.38 kB gzipped. One person. Twelve months. Everything built from nothing.
                            </p>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 text-center">
                                    <p className="text-xl font-bold text-blue-600">13</p>
                                    <p className="text-xs text-slate-600">Core Algorithms</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 text-center">
                                    <p className="text-xl font-bold text-blue-600">38+</p>
                                    <p className="text-xs text-slate-600">Formulas</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 text-center">
                                    <p className="text-xl font-bold text-blue-600">10</p>
                                    <p className="text-xs text-slate-600">Layers</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 text-center">
                                    <p className="text-xl font-bold text-blue-600">50K</p>
                                    <p className="text-xs text-slate-600">Lines of Code</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end">
                            <button onClick={() => setShowBlock2More(false)} className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 3 — Read More Popup */}
            {showBlock3More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock3More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                Then I discovered something that changed the system forever.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                By this point, I had a working intelligence system — formulas, validation, debate, autonomous engines, reflexive analysis, all running through the NSIL pipeline. It was already producing results no other platform could match. But something was missing. The outputs were technically correct, but they lacked the instinct of a seasoned human expert — the ability to sense that a deal feels wrong even when the numbers look right, or to know which risk deserves attention when ten are competing for it.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                That’s when I found computational neuroscience — real mathematical models of how the human brain makes decisions under pressure. Models from published university research that had been sitting in academic papers for decades, never implemented in a practical system. I realised they could slot directly into the architecture I’d already built. The NSIL was designed to be extensible. So I added them.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                I wrote the <strong>Human Cognition Engine</strong> — 1,307 lines of code implementing 7 neuroscience models as faithful mathematical implementations. Not simplified approximations. The real models, running live inside the NSIL pipeline. This is what turned a powerful analytics system into something genuinely new — the first platform that doesn’t just calculate answers, but thinks about them the way a human expert would.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-2 mb-3">
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Wilson-Cowan Neural Fields</strong> — Your brain has billions of neurons, some saying “go” (excitatory) and some saying “stop” (inhibitory). These differential equations (∂u/∂t = -u + ∫ w(r-r’)·f(v) dr’) model that battle on a 50×50 grid, simulating how experts balance competing factors like profit vs. risk. The NSIL runs this live with your data.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Predictive Processing (Rao &amp; Ballard)</strong> — Our brains don’t just react; they predict. Bayesian inference across 3 hierarchical levels anticipates what comes next — like forecasting market shifts from historical precedent. Learning rate 0.1, with prediction error minimisation at every level.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Friston’s Free Energy Principle</strong> — The brain minimises “surprise” by constantly updating beliefs. Variational inference across 8 candidate policies (γ=0.95) simulates how we adapt when new information arrives — revising plans without hallucinating.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Attention Allocation (Itti &amp; Koch)</strong> — Why do you notice one risk and miss another? Salience maps with winner-take-all competition and inhibition of return (0.7) model how the brain spots what matters in a sea of data.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Emotional Valence</strong> — Prospect theory shows the pain of losing £100 hurts more than the joy of gaining £100. This assigns emotional weight to every option, flagging deals that look good on paper but feel wrong.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Global Workspace Theory</strong> — Think of your brain as an office where every department shares information through one central workspace. Coalition formation with ignition threshold 0.6 ensures all layers integrate into coherent insights.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Working Memory (Baddeley’s Model)</strong> — Human short-term memory is limited. Phonological decay 0.05, visual decay 0.03, rehearsal benefit 0.2 — this focuses outputs on the 3–5 factors that actually matter.
                                </p>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                No other platform — not Palantir, not Bloomberg Terminal, not McKinsey’s analytics — implements any of these models. BW NEXUS AI implements all seven. And they work because the NSIL was built to accommodate exactly this kind of extension — I just didn’t know these models existed when I designed it. They fit perfectly into what I’d already created.
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                That’s what makes this a world first. Not just the neuroscience. Not just the formulas. Not just the debate engine or the autonomous engines. It’s the fact that one person built an architecture flexible enough to unify all of them — and then discovered the missing piece that made it complete.
                            </p>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end">
                            <button onClick={() => setShowBlock3More(false)} className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 4 — Read More Popup */}
            {showBlock4More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock4More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                It doesn’t just answer. It thinks beyond your question — and analyses how you think.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                I created 8 autonomous engines that actively discover insights you never asked for. Creative Synthesis uses bisociation theory (608 lines) to find strategies from unrelated domains. Ethical Reasoning enforces Rawlsian fairness gates (534 lines) — if a path is unethical, it’s rejected, no matter how profitable. Self-Evolving Algorithms tune their own formula weights using gradient descent with rollback (403 lines). Scenario Simulation runs 5,000 Monte Carlo futures with causal feedback loops (504 lines).
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                Then 7 reflexive engines analyse <em>you</em>. User Signal Decoder uses Shannon’s information theory (591 lines) to detect what you repeat (what matters) and what you avoid (where anxiety lives). Regional Mirroring finds your structural twin region worldwide (612 lines). Latent Advantage Miner surfaces assets you mentioned casually that have real strategic significance (483 lines). Every finding is then translated for 5 distinct audiences — investors, government, community, partners, executives — in their own language.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-indigo-800">Autonomous Intelligence — 8 Engines</p>
                                    <p className="text-xs text-indigo-600">CRE, CDT, AGL, ETH, EVO, ADA, EMO, SIM — creative synthesis, cross-domain transfer, ethical gates, adaptive learning, Monte Carlo simulation.</p>
                                </div>
                                <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-sky-800">Reflexive Intelligence — 7 Engines</p>
                                    <p className="text-xs text-sky-600">Signal decoding, echo detection, lifecycle mapping, regional mirroring, identity decoding, latent advantage mining, universal translation.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end">
                            <button onClick={() => setShowBlock4More(false)} className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 5 — What You Get & How It Works Popup Modal */}
            {showBlock5Popup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock5Popup(false)}>
                    <div className="bg-white rounded-sm max-w-4xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                        {/* WHAT YOU GET section — styled like landing page */}
                        <section className="py-12 px-6 md:px-8 bg-slate-100 rounded-t-sm">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">WHAT YOU GET</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">So What Comes Out the Other End?</h2>
                                
                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    The output isn’t “AI text.” The output is a complete decision package: the structured case, the quantified scores, the key risks and mitigations, the stakeholder narrative, and the supporting material required to move from idea → partner conversation → formal submission.
                                </p>

                                {/* Watch it happen live */}
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                        You can watch it all happen, live.
                                    </h3>
                                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                        While the system builds your case, you can watch every step in real time. You’ll see the five expert personas debating your proposal, the scoring formulas running one by one, the risk models stress-testing your assumptions, and the final strategy assembling itself section by section. Nothing is hidden. Every score, every conclusion, every piece of evidence is visible and traceable.
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        This isn’t a black box — it’s a glass box. The same inputs will always produce the same validated output. That’s the whole point: if you can’t see how it reached its answer, why would you trust it?
                                    </p>
                                </div>

                                {/* Reassurance message */}
                                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-sm p-6 mb-6">
                                    <p className="text-base text-white leading-relaxed font-medium">
                                        The good news? You don’t need to understand how any of this works under the hood. You just need to know it’s there — working for you, 24/7 — producing rigorous, defensible, repeatable output every single time. Here’s what that actually looks like.
                                    </p>
                                </div>

                                <button 
                                    onClick={() => { setShowBlock5Popup(false); setShowOutputDetails(true); }}
                                    className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Info size={16} />
                                    More Details — Full Document Catalog &amp; Audit Trail
                                </button>
                            </div>
                        </section>

                        {/* Photo Banner — Strategic Planning */}
                        <div className="w-full h-40 md:h-52 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=400&fit=crop&q=80" alt="Strategic planning session" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-slate-900/10" />
                        </div>

                        {/* THE TEN-STEP PROTOCOL — styled like landing page */}
                        <section className="py-12 px-6 md:px-8 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">HOW YOU FEED THE BRAIN</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">The Ten-Step Protocol</h2>
                                <p className="text-base text-blue-600 mb-4 flex items-center gap-2 font-medium">
                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Most users complete this in 30-45 minutes
                                </p>

                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    Most projects fail not from lack of potential, but from incomplete preparation. The Ten-Step Protocol is the antidote — a structured process that transforms a rough idea into a complete, decision-ready input set. Each step captures a critical dimension of your opportunity: identity, strategy, market context, partnerships, financials, risks, resources, execution, governance, and final readiness.
                                </p>

                                <button 
                                    onClick={() => { setShowBlock5Popup(false); setShowProtocolDetails(true); }}
                                    className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Info size={16} />
                                    More Details — View All 10 Steps &amp; Data Requirements
                                </button>
                            </div>
                        </section>

                        {/* Close button */}
                        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-sm">
                            <button 
                                onClick={() => setShowBlock5Popup(false)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Proof of Capability — Popup Modal */}
            {showProofPopup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowProofPopup(false)}>
                    <div className="bg-white rounded-sm max-w-4xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                        {/* Header section — styled like landing page */}
                        <section className="py-12 px-6 md:px-8 bg-slate-100 rounded-t-sm">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-2 font-bold">PROOF OF CAPABILITY</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">See What the System Actually Produces</h2>
                                
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    Words are easy. Claims are everywhere. So instead of telling you what this system can do, we ran it. A real regional council, with a real 5MW solar partnership proposal, put through the full Ten-Step Protocol and processed by every layer of the NSIL engine — live, unedited, with nothing pre-approved.
                                </p>
                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    The system didn’t just score the project. It found two critical problems the council had missed entirely — a missing grid connection feasibility study and revenue projections 2.8× above the regional benchmark. It blocked the project, classified it as “Do Not Proceed,” and explained exactly why. After the council corrected these issues, the system re-ran every formula, re-debated with all five personas, and re-scored the entire proposal — upgrading it from <strong className="text-red-600">“Do Not Proceed”</strong> to <strong className="text-blue-600">“Investment Ready.”</strong>
                                </p>
                            </div>
                        </section>

                        {/* How the system built this report */}
                        <section className="py-10 px-6 md:px-8 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">What the System Did to Build This Report</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    Every score you see in the report below was computed by the NSIL engine in real time. Here’s exactly what happened behind the scenes:
                                </p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                        <p className="text-sm text-slate-700"><strong>SAT Validation</strong> — The contradiction solver checked all inputs for logical conflicts. It flagged that the council’s revenue projections contradicted regional benchmarks.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                        <p className="text-sm text-slate-700"><strong>Formula Engine</strong> — All 38+ formulas executed via the DAG Scheduler across 5 dependency levels. SPI, RROI, SCF Impact, and activation timelines were all computed from the validated inputs.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                        <p className="text-sm text-slate-700"><strong>Adversarial Debate</strong> — Five personas (Skeptic, Advocate, Regulator, Accountant, Operator) debated the proposal. The Skeptic and Regulator voted to block based on the missing feasibility study.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                        <p className="text-sm text-slate-700"><strong>Cognition Layer</strong> — Wilson-Cowan neural fields and predictive processing models simulated expert-level judgement, detecting that the deal “felt wrong” even where numbers appeared viable.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                                        <p className="text-sm text-slate-700"><strong>Scenario Simulation</strong> — 5,000 Monte Carlo futures were run to stress-test the proposal under varying market conditions, policy changes, and execution risks.</p>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                                        <p className="text-sm text-slate-700"><strong>Output Synthesis</strong> — The system compiled every score, every debate outcome, every risk flag into a single auditable document — the Live Report you can view below.</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                                    All information was sourced from the council’s own Ten-Step intake submission, cross-referenced against the system’s built-in regional benchmarks, policy databases, and historical investment performance data. Nothing was invented. Nothing was assumed. Every conclusion is traceable to a specific formula, a specific engine, and a specific line of code.
                                </p>
                            </div>
                        </section>

                        {/* The Live Test Results */}
                        <section className="py-10 px-6 md:px-8 bg-slate-100">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-blue-600 uppercase tracking-wider font-bold">LIVE TEST: SYSTEM OUTPUT DEMONSTRATION</p>
                                </div>
                                <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-sm inline-block">
                                    <p className="text-xs text-blue-600 uppercase tracking-wider font-medium">* Live test run through the actual system — Not a simulation, not an approved project</p>
                                </div>
                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    <strong className="text-slate-900">Northland Regional Council (New Zealand)</strong> submitted a 5MW solar photovoltaic partnership proposal through the Ten-Step Intake. The NSIL engine computed all scores in real time:
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                    <div className="bg-red-50 border-2 border-red-200 rounded-sm p-4">
                                        <p className="text-xs text-red-600 uppercase tracking-wider font-bold mb-2">Run 1 — Initial Assessment</p>
                                        <ul className="space-y-1 text-slate-600 text-sm">
                                            <li>SPI: <span className="text-red-600 font-bold">34%</span> (Grade D)</li>
                                            <li>RROI: <span className="text-red-600 font-bold">38/100</span></li>
                                            <li>Activation: <span className="text-red-600 font-bold">24 months</span> P50</li>
                                            <li>SCF Impact: <span className="text-red-600 font-bold">$680K</span></li>
                                            <li>Classification: <span className="text-red-600 font-bold">DO NOT PROCEED</span></li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-sm p-4">
                                        <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-2">Run 2 — After Corrections</p>
                                        <ul className="space-y-1 text-slate-600 text-sm">
                                            <li>SPI: <span className="text-blue-600 font-bold">78%</span> (Grade B)</li>
                                            <li>RROI: <span className="text-blue-600 font-bold">74/100</span></li>
                                            <li>Activation: <span className="text-blue-600 font-bold">9 months</span> P50</li>
                                            <li>SCF Impact: <span className="text-blue-600 font-bold">$1.42M</span></li>
                                            <li>Classification: <span className="text-blue-600 font-bold">INVESTMENT READY</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-sm p-4 mb-4">
                                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                                        <strong className="text-slate-700">Issues flagged by RFI:</strong> Missing grid connection feasibility study, revenue projections 2.8× above regional benchmark.
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        <strong className="text-slate-700">Corrections applied:</strong> Uploaded utility interconnection agreement, revised Y1 revenue from $4.2M to $1.4M.
                                    </p>
                                </div>

                                {/* View Full Report button */}
                                <button 
                                    onClick={() => { setShowProofPopup(false); setShowCaseStudy(true); }}
                                    className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Eye size={16} />
                                    View the Complete Live Report — Full Formula Derivation, 5-Persona Consensus &amp; Audit Trail
                                </button>
                            </div>
                        </section>

                        {/* What this means for you */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 md:p-8">
                            <p className="text-base text-white leading-relaxed font-medium">
                                This is what the system does, every time. It doesn’t guess. It doesn’t smooth things over. It finds the problems, tells you exactly what they are, and then — once you’ve fixed them — it proves you’re ready. The report below is the exact output the system produced. See for yourself.
                            </p>
                        </div>

                        {/* Close button */}
                        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-sm">
                            <button 
                                onClick={() => setShowProofPopup(false)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Document Modals */}
            <DocumentModal activeDocument={activeDocument} onClose={() => setActiveDocument(null)} />

            {/* Footer */}
            <footer className="py-8 px-4 bg-slate-900 border-t border-slate-800">
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
                            <span className="text-blue-400">Knowledge Layer Active</span>
                            <span>•</span>
                            <span className="text-indigo-400">Cognition Active</span>
                            <span>•</span>
                            <span className="text-blue-400">Autonomous Active</span>
                            <span>•</span>
                            <span className="text-slate-400">Reflexive Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CommandCenter;
