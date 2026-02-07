import React, { useState } from 'react';
import { ArrowRight, Shield, FileText, Users, Zap, Target, CheckCircle2, Scale, Rocket, Building2, Globe, Layers, Coins, Mail, Phone, Briefcase, TrendingUp, FileCheck, Database, GitBranch, Search, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { researchLocation, type ResearchProgress } from '../services/geminiLocationService';
import { CITY_PROFILES } from '../data/globalLocationProfiles';
// OSINT search removed - using unified location research

// Command Center - Complete BWGA Landing Page

interface CommandCenterProps {
    onEnterPlatform?: () => void;
    onOpenGlobalLocationIntel?: () => void;
    onOpenMasterOrchestrator?: () => void;
    onLocationResearched?: (data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        research: any;
        city: string;
        country: string;
    }) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onEnterPlatform, onOpenGlobalLocationIntel, onOpenMasterOrchestrator, onLocationResearched }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [showCatalog, setShowCatalog] = useState(false);
    const [showFormulas, setShowFormulas] = useState(false);

    // Global Location Intelligence state - LIVE SEARCH
    const [locationQuery, setLocationQuery] = useState('');
    const [isResearchingLocation, setIsResearchingLocation] = useState(false);
    const [researchProgress, setResearchProgress] = useState<ResearchProgress | null>(null);
    const [locationResult, setLocationResult] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null);
    const [comparisonCities, setComparisonCities] = useState<Array<{ city: string; country: string; reason: string; keyMetric?: string }>>([]);
    const [researchSummary, setResearchSummary] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [liveProfile, setLiveProfile] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [researchResult, setResearchResult] = useState<any>(null);
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
                    <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                        Built from firsthand experience in regional communities. One purpose: bridging the gap between overlooked regions and global opportunity—giving every community the tools to tell their story, attract investment, and grow.
                    </p>
                    
                </div>
            </section>

            {/* Image Break 1 - Regional Community */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop" 
                    alt="Regional landscape" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
            </div>

            {/* OUR MISSION */}
            <section id="mission" className="pt-16 pb-8 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">OUR MISSION</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">Strong nations are built on strong regions.</h2>
                    
                    <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                        <p>
                            The communities that feed nations, power industries, and drive real economic activity are often the last to receive the resources they need to grow. Capital cities have teams, budgets, and connections. Regional areas have determination—but rarely the tools to match it.
                        </p>
                        <p>
                            Every nation depends on its regions—for food, resources, industry, and resilience. But when it comes to competing for investment and partnerships, regional communities are expected to play the same game with a fraction of the resources. Outside the major cities, there are people building real industries, solving real problems, and creating real opportunity. But without access to institutional-grade tools, their stories go untold and their potential stays hidden.
                        </p>
                        <p>
                            If you've ever watched a regional community work twice as hard for half the recognition, you understand the problem. The capability exists. The potential is real. What's missing are the tools to translate that into the language investors and partners expect.
                        </p>
                    </div>
                </div>
            </section>

            {/* WHY THIS PLATFORM EXISTS */}
            <section className="pt-8 pb-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">WHY THIS PLATFORM EXISTS</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
                        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-4">
                            We built this platform to change that. Every formula, every document template, every intelligence layer was crafted with one goal: giving regional communities the same strategic firepower that multinational corporations use—so their efforts are seen, their innovation gets global attention, and untapped potential is finally discovered.
                        </p>
                        <p className="text-white/50 italic text-sm">— Brayden Walls, Founder</p>
                    </div>
                </div>
            </section>

            {/* Image Break 2 - Global Business */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=400&fit=crop" 
                    alt="Modern business" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0a0a0a]" />
            </div>

            {/* OUR ORIGIN - The Story of BWGA */}
            <section id="story" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">OUR ORIGIN</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">The Story of BWGA</h2>
                    
                    <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                        <p>
                            Brayden Walls Global Advisory (BWGA) wasn't founded in a glass skyscraper in New York or London. It was born on the edge of the developing world, in a small coastal city where the gap between potential and opportunity is painfully clear.
                        </p>
                        <p>
                            For years, we watched dedicated regional leaders—mayors, local entrepreneurs, and councils—work tirelessly to attract investment to their communities. They had the vision. They had the drive. They had the raw assets. But time and again, they were ignored by global capital.
                        </p>
                        <p>
                            We realized the problem wasn't their ideas; it was their language. Wall Street and global investors speak a specific dialect of risk matrices, financial models, and feasibility studies. If you can't speak that language, you don't get a seat at the table. Wealthy corporations hire armies of consultants costing $50,000 a month to write these documents for them. Regional communities simply couldn't afford that admission fee, so they were left behind.
                        </p>
                    </div>
                    
                    <div className="mt-8 bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-6 rounded-r-xl">
                        <p className="text-base md:text-lg text-white font-light leading-relaxed">
                            We built BWGA to break that barrier. Our mission is simple: to give the underdog—the regional council, the local business, the emerging exporter—the same strategic firepower as a multinational corporation.
                        </p>
                    </div>
                </div>
            </section>

            {/* THE TECHNOLOGY */}
            <section id="technology" className="py-16 px-4 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">THE TECHNOLOGY</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">What BWGA AI Actually Is</h2>
                    
                    <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                        <p>
                            To solve this, we couldn't just use standard AI. Tools like ChatGPT are incredible, but they are essentially "text predictors"—they guess the next word in a sentence. They can write a poem, but they can't structure a billion-dollar infrastructure deal without hallucinating. We needed something fundamentally different: an AI that reasons, validates, and produces evidence you can defend in a boardroom.
                        </p>
                        <p>
                            So, we built <strong className="text-white">BWGA Intelligence AI</strong>—the world's first Sovereign-Grade Intelligence Operating System. This is not a chatbot. It is a <strong className="text-white">digital boardroom</strong>: a team of specialized AI agents that research, debate, score, and write—coordinated by two proprietary engines working in concert.
                        </p>
                        <p>
                            The first is the <strong className="text-amber-400">NSIL (Nexus Strategic Intelligence Layer)</strong>—a reasoning engine with 38 proprietary mathematical formulas that stress-test every dimension of your project, from financial viability to regulatory friction. The second is the <strong className="text-purple-400">Human Cognition Engine</strong>—7 neuroscience-based models drawn from university-level research that simulate how real decision-makers process complexity, allocate attention, and react under pressure. Together, they don't just analyze data—they anticipate how humans will respond to it.
                        </p>
                        <p>
                            What this means in practice: every feature on this page—from the instant research engine to the live report builder to the embedded consultant—is powered by this architecture. Scroll down to see each one and try them yourself.
                        </p>
                    </div>

                    {/* Platform Feature Map */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4 text-center">
                            <Search size={20} className="text-amber-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-white mb-1">BW AI Search</p>
                            <p className="text-[10px] text-white/50">Instant intelligence briefs on any city, company, or government</p>
                        </div>
                        <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4 text-center">
                            <FileCheck size={20} className="text-amber-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-white mb-1">Live Report System</p>
                            <p className="text-[10px] text-white/50">Real-time report builder with multi-agent analysis and scoring</p>
                        </div>
                        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 text-center">
                            <Users size={20} className="text-purple-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-white mb-1">BW Consultant</p>
                            <p className="text-[10px] text-white/50">Embedded AI advisor inside the live report builder</p>
                        </div>
                        <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4 text-center">
                            <GitBranch size={20} className="text-amber-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-white mb-1">Document Factory</p>
                            <p className="text-[10px] text-white/50">200+ institutional-grade reports, prospectuses, and legal templates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Break 3 - Technology */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=400&fit=crop" 
                    alt="Technology and data" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0a0a0a]" />
            </div>

            {/* THE DIFFERENCE */}
            <section id="difference" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">THE DIFFERENCE</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">What Happens When You Use It</h2>

                    <p className="text-sm text-white/70 leading-relaxed mb-8">
                        Most platforms hand you a blank page and wish you luck. This one walks with you from first question to final document—every step validated, scored, and traceable. Here is what a typical session looks like:
                    </p>

                    {/* Journey Steps — vertical timeline */}
                    <div className="relative pl-8 border-l-2 border-amber-500/30 space-y-8 mb-10">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-[2.55rem] top-0 w-8 h-8 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-amber-400 text-xs font-bold">1</span>
                            </div>
                            <h3 className="text-base font-medium mb-1">Research the Landscape</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                You type a city, company, or government into <strong className="text-amber-400">BW AI Search</strong>. In seconds, the system pulls verified data from public sources and delivers a one-page intelligence brief—demographics, GDP, leadership, infrastructure, and comparison benchmarks. You haven't left this page.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute -left-[2.55rem] top-0 w-8 h-8 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-amber-400 text-xs font-bold">2</span>
                            </div>
                            <h3 className="text-base font-medium mb-1">Define Your Opportunity</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                You enter the platform and complete the <strong className="text-amber-400">Ten-Step Intake Protocol</strong>—a structured process that captures every dimension of your project: identity, strategy, financials, risk, governance. Most users finish in 30–45 minutes. By the end, the system has a precise, measurable dataset it can trust.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-[2.55rem] top-0 w-8 h-8 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-amber-400 text-xs font-bold">3</span>
                            </div>
                            <h3 className="text-base font-medium mb-1">Watch the System Think</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Hit generate. The <strong className="text-amber-400">Live Report System</strong> activates in real time—you see the NSIL engine scoring your project across 38 formulas, five adversarial personas debating its merits, and the Human Cognition Engine pressure-testing how decision-makers will respond. Nothing is hidden. Every score, debate transcript, and reasoning chain is visible and traceable.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                            <div className="absolute -left-[2.55rem] top-0 w-8 h-8 bg-purple-500/20 border-2 border-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-purple-400 text-xs font-bold">4</span>
                            </div>
                            <h3 className="text-base font-medium mb-1">Ask Your Consultant</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                While the report builds, the <strong className="text-purple-400">BW Consultant</strong> is available inside the report builder. Ask it anything: "Why did SPI drop?", "What's the regulatory risk in the Philippines?", "How do I improve my financial readiness score?" It sees your live data and responds with context-aware guidance—like having a senior advisor watching over your shoulder.
                            </p>
                        </div>

                        {/* Step 5 */}
                        <div className="relative">
                            <div className="absolute -left-[2.55rem] top-0 w-8 h-8 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-emerald-400 text-xs font-bold">5</span>
                            </div>
                            <h3 className="text-base font-medium mb-1">Export Board-Ready Documents</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Once analysis is complete, the <strong className="text-emerald-400">Document Factory</strong> compiles everything into institutional-grade deliverables—Investment Prospectuses, Risk Matrices, LOIs, Grant Applications, Due-Diligence Packs—formatted and evidence-backed. Each document traces every recommendation back to specific data inputs, formula calculations, and persona debate transcripts.
                            </p>
                        </div>
                    </div>

                    {/* Proof: Side-by-Side Comparison */}
                    <div className="mb-6">
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-4 font-semibold">THE OUTPUT DIFFERENCE</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                <p className="text-xs text-red-400 uppercase tracking-wider mb-3 font-semibold">GENERIC AI RESPONSE</p>
                                <p className="text-sm text-white/80 italic mb-3">"This project appears promising with strong market potential. Consider securing funding and building partnerships to move forward."</p>
                                <div className="border-t border-red-500/20 pt-3">
                                    <p className="text-xs text-white/50">✗ No metrics</p>
                                    <p className="text-xs text-white/50">✗ No specific problems identified</p>
                                    <p className="text-xs text-white/50">✗ No actionable recommendations</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3 font-semibold">BWGA AI ANALYSIS</p>
                                <p className="text-sm text-white/80 mb-3">"SPI: 34%. 3 fatal flaws: undefined revenue model, $4.2M funding gap, missing regulatory pre-clearance. <strong className="text-white">Do not proceed until addressed.</strong>"</p>
                                <div className="border-t border-emerald-500/20 pt-3">
                                    <p className="text-xs text-emerald-300">✓ Quantified success probability</p>
                                    <p className="text-xs text-emerald-300">✓ Specific problems with values</p>
                                    <p className="text-xs text-emerald-300">✓ Clear go/no-go recommendation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE IMPACT */}
            <section className="py-16 px-4 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">THE IMPACT</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">Why This Matters</h2>
                    
                    <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-6 mb-6">
                        <p className="text-base text-white/90 leading-relaxed mb-4">
                            This system turns ambition into proof. Instead of a rough idea, you walk away with institutional-grade documentation—Investment Prospectuses, Risk Assessments, Legal Frameworks—that look like they came from a top-tier advisory firm. Every document comes with an audit trail showing exactly why the system made its recommendations.
                        </p>
                        <p className="text-sm text-white/70 leading-relaxed">
                            <strong className="text-white">This is the massive difference:</strong> A small town in regional Australia or a startup in Southeast Asia can finally compete on a level playing field with the biggest players in the world. It removes the "consultant tax" and ensures that great projects are judged on their merit, not on who they know or how much they paid for advice.
                        </p>
                    </div>

                    {/* What you get — concrete output list */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-amber-400 mb-3 uppercase tracking-wider">Before BWGA AI</h4>
                            <ul className="space-y-2 text-xs text-white/50">
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Weeks of manual research per target region</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> $50K+ for consultant-prepared prospectuses</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> No way to stress-test assumptions</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Documents lack traceable evidence</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-emerald-500/20 rounded-xl p-5">
                            <h4 className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">With BWGA AI</h4>
                            <ul className="space-y-2 text-xs text-white/70">
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Instant intelligence brief on any city, company, or government</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Live report built by coordinated AI agents in minutes</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 38 formulas score every dimension with reproducible math</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Audit trail from data input to final recommendation</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-5 rounded-r-xl">
                        <p className="text-sm text-white/80 leading-relaxed">
                            <strong className="text-white">What follows below</strong> is a walkthrough of every system on this page—from the structured intake protocol that captures your opportunity, to the live search engine, the formula architecture, and the document factory. Each section is functional: you can try BW AI Search right now, or enter the platform to begin building your first report.
                        </p>
                    </div>
                </div>
            </section>

            {/* Image Break 4 - Teamwork */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=400&fit=crop" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0a0a0a]" />
            </div>

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
                                    {item.gliEnabled && <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded">GLI</span>}
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
                    <h2 className="text-xl md:text-2xl font-light mb-6">Mathematical Foundation & Architecture Details</h2>
                    
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

                    {/* Real Case Study */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-6 mb-8">
                        <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3 font-semibold">CASE STUDY: FORMULAS IN ACTION</p>
                        <p className="text-sm text-white/80 leading-relaxed mb-4">
                            A regional council submitted a renewable energy partnership proposal. Initial SPI calculation returned <strong className="text-red-400">34% probability of success</strong>. The system identified 2 critical issues:
                        </p>
                        <ul className="space-y-2 text-sm text-white/70 mb-4">
                            <li className="flex items-center gap-2">
                                <span className="text-red-400">✗</span>
                                Missing grid connection feasibility study (Regulatory Friction Index flagged)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-400">✗</span>
                                Unrealistic revenue projections (Financial Readiness Index triggered)
                            </li>
                        </ul>
                        <p className="text-sm text-white/80 leading-relaxed">
                            After addressing these issues with system-guided improvements, the revised proposal scored <strong className="text-emerald-400">78% SPI</strong> — moved from "Do Not Proceed" to "Investment Ready" classification.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Database size={16} className="text-amber-400" />
                                6-Layer Architecture + Cognition
                            </h4>
                            <ul className="space-y-2 text-xs text-white/70">
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Input Validation & Governance</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Multi-Agent Adversarial Debate</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Quantitative Formula Scoring</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Monte Carlo Stress Testing</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-purple-400" /> Human Cognition Engine (7 Models)</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-amber-400" /> Output Synthesis & Provenance</li>
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
                        {showFormulas ? 'Hide Architecture' : 'View Full Architecture & 38 Formulas'}
                    </button>
                    <p className="text-sm text-amber-400 text-center mt-3 font-medium">
                        ↳ Includes proof of why this system is a world-first — and why these formulas don't exist anywhere else.
                    </p>

                    {showFormulas && (
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                            <h4 className="text-sm font-semibold text-amber-400 mb-3">NSIL Full Architecture & 38 Proprietary Formulas + Human Cognition Engine</h4>
                            
                            <div className="mb-4">
                                <h5 className="text-xs font-semibold text-white mb-2">6-Layer Processing Architecture with Cognitive Enhancement</h5>
                                <ol className="space-y-2 text-xs text-white/70">
                                    <li><strong className="text-white">Layer 1:</strong> Input Validation & Governance — Screens all inputs for completeness, consistency, and compliance with data standards</li>
                                    <li><strong className="text-white">Layer 2:</strong> Multi-Agent Adversarial Debate — 5 AI personas debate and stress-test every claim</li>
                                    <li><strong className="text-white">Layer 3:</strong> Quantitative Formula Scoring — 31 strategic formulas calculate hard metrics</li>
                                    <li><strong className="text-white">Layer 4:</strong> Monte Carlo Stress Testing — Simulates 10,000+ scenarios to test resilience</li>
                                    <li><strong className="text-purple-400">Layer 5:</strong> <strong className="text-purple-400">Human Cognition Engine</strong> — 7 neuroscience models (Wilson-Cowan neural fields, Rao & Ballard predictive coding, Friston free energy, Itti & Koch attention, emotional processing, Global Workspace consciousness, Baddeley's working memory)</li>
                                    <li><strong className="text-white">Layer 6:</strong> Output Synthesis & Provenance — Generates traceable, auditable conclusions with cognitive insights</li>
                                </ol>
                            </div>

                            {/* HUMAN COGNITION ENGINE SECTION */}
                            <div className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-purple-300 mb-3">Human Cognition Engine — 7 Neuroscience Models</h5>
                                <div className="grid md:grid-cols-2 gap-3 text-xs text-white/70">
                                    <div><strong className="text-white">Neural Field Dynamics</strong> — Wilson-Cowan equations modeling neural population activity</div>
                                    <div><strong className="text-white">Predictive Coding</strong> — Rao & Ballard hierarchical belief updating</div>
                                    <div><strong className="text-white">Free Energy Principle</strong> — Friston variational inference for action selection</div>
                                    <div><strong className="text-white">Attention Models</strong> — Itti & Koch salience mapping with winner-take-all</div>
                                    <div><strong className="text-white">Emotional Processing</strong> — Neurovisceral integration with autonomic coupling</div>
                                    <div><strong className="text-white">Consciousness Models</strong> — Global Workspace Theory for information broadcasting</div>
                                    <div><strong className="text-white">Working Memory</strong> — Baddeley's model with phonological loops and visuospatial sketchpads</div>
                                </div>
                                <p className="text-[10px] text-purple-200/60 mt-3 italic">These are university-level neuroscience equations that have never before been adapted to AI systems—providing human-like reasoning, reactions, and decision-making patterns.</p>
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

                            {/* WORLD-FIRST PROOF SECTION */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">Why This Is a World-First</h5>
                                
                                <div className="bg-black/30 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-white/80 mb-3">
                                        <strong className="text-white">Multi-agent AI frameworks exist</strong> — tools like Microsoft AutoGen, CrewAI, and LangGraph allow developers to build systems where AI agents collaborate. But these are <em>developer toolkits</em>, not end-user products. They have no built-in scoring, no document generation, no regional development focus.
                                    </p>
                                    <p className="text-xs text-white/80 mb-3">
                                        <strong className="text-white">Enterprise decision platforms exist</strong> — Palantir, Kensho, and Moody's offer sophisticated analysis. But they're locked behind enterprise contracts, inaccessible to regional councils, SMEs, or first-time exporters.
                                    </p>
                                    <p className="text-xs text-white/80">
                                        <strong className="text-white">To our knowledge, no publicly available platform combines:</strong> multi-persona adversarial analysis, quantitative viability indices, Monte Carlo stress testing, and automated institutional-grade document generation with audit trails — purpose-built for regional economic development.
                                    </p>
                                </div>

                                <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                    <p className="text-xs text-white/90 italic">
                                        "None of these indices exist as named products elsewhere. They were designed specifically for this system because no existing tool combined them, regional development has unique needs standard tools ignore, and investors demand reproducibility — not AI-generated guesswork. Every formula has defined methodology, transparent inputs, and a full audit trail."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* DESIGNED FOR EVERYONE */}
            <section className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">DESIGNED FOR EVERYONE</p>
                    <h2 className="text-xl md:text-2xl font-light mb-2">You Don't Need to Be an Expert.</h2>
                    <h2 className="text-xl md:text-2xl font-light text-amber-400 mb-6">You Just Need to Try.</h2>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-8">
                        Most strategic tools assume you already have a team, a budget, and a plan. This one doesn't. It was built for the person staring at a blank page, wondering where to even start—and for the experienced operator who's tired of reinventing the wheel every time a new opportunity lands on their desk.
                    </p>

                    {/* Preferred Guidance Level Explanation */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-5 rounded-r-xl mb-8">
                        <p className="text-xs text-amber-400 uppercase tracking-wider mb-3 font-semibold">PREFERRED GUIDANCE LEVEL</p>
                        <p className="text-sm text-white/80 leading-relaxed mb-4">
                            Before you begin, you choose how much guidance you want. This isn't a one-size-fits-all system—it's built to meet you where you are.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-amber-400 font-semibold text-sm mb-1">🧭 Orientation Mode</p>
                                <p className="text-xs text-white/60">Full explanations, step-by-step walkthroughs, and contextual help at every turn. Ideal for first-time users, community groups, or anyone new to strategic planning.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-amber-400 font-semibold text-sm mb-1">🤝 Collaborative Mode</p>
                                <p className="text-xs text-white/60">Balanced guidance with smart suggestions. You drive the process while the system surfaces insights. Built for teams, regional councils, and growing businesses.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-amber-400 font-semibold text-sm mb-1">⚡ Expert Mode</p>
                                <p className="text-xs text-white/60">Streamlined interface, minimal hand-holding, full access to advanced controls. Designed for experienced operators, government analysts, and corporate development teams.</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/50">
                            Your guidance level can be changed at any time from the sidebar. The system adapts its explanations, prompts, and recommendations accordingly—so you're never overwhelmed, and never slowed down.
                        </p>
                    </div>

                    <div className="mb-8">
                        <p className="text-xs text-amber-400 uppercase tracking-wider mb-4 font-semibold">WHO THIS IS BUILT FOR</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                                <Building2 size={24} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-medium">Regional Councils & RDAs</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                                <Scale size={24} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-medium">State & Federal Agencies</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                                <Briefcase size={24} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-medium">Businesses Looking Regional</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                                <Globe size={24} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs font-medium">First-Time Exporters</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                        Whether you're a council trying to attract new industries, a government agency evaluating investment proposals, a business exploring regional expansion, or an entrepreneur looking to export for the first time—this platform gives you the analytical firepower and document automation that was once reserved for major corporations.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <p className="text-xs text-amber-400 uppercase tracking-wider mb-4 font-semibold">THE SYSTEM DOES WHAT YOU SHOULDN'T HAVE TO</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                                <Layers size={20} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs text-white/70">Structure your thinking</p>
                            </div>
                            <div className="text-center">
                                <TrendingUp size={20} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs text-white/70">Score your viability</p>
                            </div>
                            <div className="text-center">
                                <Shield size={20} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs text-white/70">Stress-test assumptions</p>
                            </div>
                            <div className="text-center">
                                <FileText size={20} className="mx-auto mb-2 text-amber-400" />
                                <p className="text-xs text-white/70">Build your documents</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/50 text-center">
                            The complexity is hidden. What you see is clarity.
                        </p>
                    </div>
                </div>
            </section>

            {/* NEXT STEPS - Partnership & Pilot Programs */}
            <section id="pilots" className="py-16 px-4 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">NEXT STEPS</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">Partnership & Pilot Programs</h2>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-8">
                        The most effective way to demonstrate the value of BWGA AI is to apply it to real-world challenges. We propose collaborative partnerships through structured pilot programs.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <Zap size={24} className="text-amber-400 mb-3" />
                            <h3 className="text-sm font-semibold mb-2">Investment Screening Pilot</h3>
                            <p className="text-xs text-white/60">Use the platform for screening test cases with foreign investment review boards</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <TrendingUp size={24} className="text-amber-400 mb-3" />
                            <h3 className="text-sm font-semibold mb-2">Regional Development Pilot</h3>
                            <p className="text-xs text-white/60">Create investment prospectuses for target regions with economic development agencies</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <Building2 size={24} className="text-amber-400 mb-3" />
                            <h3 className="text-sm font-semibold mb-2">PPP Modeling Pilot</h3>
                            <p className="text-xs text-white/60">Model forthcoming Public-Private Partnerships with infrastructure ministries</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-5 rounded-r-xl">
                        <h3 className="text-sm font-semibold mb-2">Vision for the Future</h3>
                        <p className="text-sm text-white/70">
                            Deploy as a shared, national strategic asset—a sovereign-grade intelligence platform enhancing high-stakes decision-making across government.
                        </p>
                    </div>
                </div>
            </section>

            {/* Image Break 5 - Documents */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&h=400&fit=crop" 
                    alt="Business documents and analytics" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0a0a0a]" />
            </div>

            {/* BW AI GLOBAL SEARCH */}
            <section id="bwai-search" className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">BW AI GLOBAL SEARCH</p>
                    <h2 className="text-xl md:text-2xl font-light mb-3">Instant Intelligence on Any Region, City, Company, or Government</h2>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-8">
                        Before you can build a case, you need to understand the landscape. This is your starting point—a live AI-powered research engine that pulls verified data on any location or entity you're targeting. Enter a name, get an instant brief: demographics, leadership, economic indicators, infrastructure, and comparison benchmarks. Think of it as a search engine built for dealmakers—surfacing the intelligence that matters.
                    </p>
                    
                    {/* GLOBAL LOCATION INTELLIGENCE - Split Window Panel */}
                    <div className="bg-gradient-to-br from-slate-900 to-[#0f0f0f] border border-amber-500/30 rounded-2xl overflow-hidden mb-10">
                        <div className="grid md:grid-cols-2">
                            {/* Left Side - Photo */}
                            <div className="relative h-64 md:h-auto min-h-[300px]">
                                <img 
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop" 
                                    alt="Global Intelligence Network" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0f0f0f]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-wider font-semibold">
                                        <Globe className="w-4 h-4" />
                                        Global Coverage
                                    </div>
                                    <p className="text-white/70 text-sm mt-1">Real-time data from public sources worldwide</p>
                                </div>
                            </div>
                            
                            {/* Right Side - Information & Search */}
                            <div className="p-6 md:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center">
                                        <Search className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">BW AI Search</h3>
                                        <p className="text-xs text-white/50">Cities • Regions • Companies • Government</p>
                                    </div>
                                </div>

                                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                                    Enter any city, region, company, or government body. Receive a one-page intelligence brief with key facts, leadership, economic data, and comparison signals—instantly.
                                </p>

                                <div className="space-y-3 text-xs text-white/60 mb-5">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>Population, GDP, key industries & infrastructure</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>Leadership, government structure & key contacts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>Comparison benchmarks & investment signals</span>
                                    </div>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        data-testid="bwai-search-input"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                                        placeholder="Search any city, region, company, or government..."
                                        disabled={isResearchingLocation}
                                        className="w-full px-4 py-3 pr-36 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 text-sm"
                                    />
                                    <button
                                        data-testid="bwai-search-button"
                                        onClick={handleLocationSearch}
                                        disabled={!locationQuery.trim() || isResearchingLocation}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        {isResearchingLocation ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Researching
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-3 h-3" />
                                                Research
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Error Banner */}
                                {searchError && !isResearchingLocation && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-red-300 font-semibold">Search Error</p>
                                            <p className="text-xs text-red-200/80 mt-0.5">{searchError}</p>
                                        </div>
                                        <button
                                            onClick={() => setSearchError(null)}
                                            className="text-red-400 hover:text-red-300 text-xs font-semibold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}

                                {/* Research Progress - LIVE */}
                                {isResearchingLocation && researchProgress && (
                                    <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-purple-300 font-semibold">🔴 Live Search: {researchProgress.message}</span>
                                            <span className="text-xs text-purple-400">{Math.round(researchProgress.progress)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all duration-500"
                                                style={{ width: `${researchProgress.progress}%` }}
                                            />
                                        </div>
                                        <div className="mt-2 text-[10px] text-white/40">
                                            Fetching real-time data from World Bank, government sources, and public APIs...
                                        </div>
                                    </div>
                                )}

                                {/* Result Preview */}
                                {locationResult && !isResearchingLocation && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{locationResult.city}, {locationResult.country}</p>
                                                <p className="text-xs text-white/50">Research complete • Summary below</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const locationData = {
                                                        profile: liveProfile,
                                                        research: researchResult,
                                                        city: locationResult.city,
                                                        country: locationResult.country
                                                    };
                                                    // Both methods - legacy localStorage AND new prop callback
                                                    localStorage.setItem('gli-target', `${locationResult.city}, ${locationResult.country}`);
                                                    localStorage.setItem('gli-cached-research', JSON.stringify(researchResult));
                                                    
                                                    // New method - pass directly via callback
                                                    if (onLocationResearched) {
                                                        onLocationResearched(locationData);
                                                    }
                                                    
                                                    if (onOpenGlobalLocationIntel) {
                                                        onOpenGlobalLocationIntel();
                                                    } else if (onEnterPlatform) {
                                                        onEnterPlatform();
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg hover:bg-emerald-500/30 flex items-center gap-1"
                                            >
                                                View Full Report <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {researchSummary && (
                                            <p className="mt-3 text-xs text-white/70 leading-relaxed">{researchSummary}</p>
                                        )}
                                        {comparisonCities.length > 0 && (
                                            <div className="mt-4">
                                                <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold mb-2">Comparison Signals</div>
                                                <div className="grid gap-2">
                                                    {comparisonCities.map((comp, idx) => (
                                                        <div key={`${comp.city}-${idx}`} className="text-xs text-white/70 border border-white/10 rounded-lg p-2">
                                                            <div className="font-semibold text-white">{comp.city}, {comp.country}</div>
                                                            <div>{comp.reason}</div>
                                                            {comp.keyMetric && <div className="text-[10px] text-white/50 mt-1">{comp.keyMetric}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Break 6 - Global */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1600&h=400&fit=crop" 
                    alt="Global connections" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0a0a0a]" />
            </div>

            {/* SOLVING REAL PROBLEMS */}
            <section className="py-16 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs mb-3 font-semibold">SOLVING REAL PROBLEMS</p>
                    <h2 className="text-xl md:text-2xl font-light mb-6">Regional Challenges, Intelligent Solutions</h2>
                    
                    <div className="space-y-4 text-sm text-white/70 leading-relaxed mb-2">
                        <p>
                            This platform exists for one reason: to help capital, partnerships, and capability reach the places that are too often overlooked—despite holding extraordinary, investable potential.
                        </p>
                        <p>
                            BWGA Intelligence AI is 100% dedicated to regional growth. During this beta phase and in future subscriptions, we commit that <strong className="text-amber-400">10% of every paid transaction</strong> will be directed back into initiatives that support regional development and long-term community outcomes. This is more than an AI/human report system—it's a practical bridge between global decision-makers and real opportunities on the ground.
                        </p>
                        <p>
                            What started as an "over-engineered" idea is now a working intelligence layer designed to clarify complexity, surface what matters, and turn promising briefs into credible, defensible action. A new voice for regions. A new standard for how opportunity is evaluated—anywhere in the world.
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

                        {/* Master Orchestrator Button */}
                        <button 
                            disabled={!termsAccepted}
                            onClick={() => termsAccepted && onOpenMasterOrchestrator?.()}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mb-3 ${
                                termsAccepted 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 cursor-pointer' 
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                        >
                            🎯 Activate 100% Performance Mode
                            <Zap size={16} />
                        </button>

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
                            <div className="flex gap-3 text-xs text-white/50">
                                <a href="#" className="hover:text-white">Terms & Conditions</a>
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Ethical AI Framework</a>
                            </div>
                        </div>
                    </div>
            </section>

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
                                Nexus Intelligence OS v6.0
                            </span>
                            <span>•</span>
                            <span>NSIL Engine v3.2</span>
                            <span>•</span>
                            <span className="text-purple-400">Human Cognition Engine Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CommandCenter;
