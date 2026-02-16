import React, { useState } from 'react';
import { ArrowRight, Shield, Users, Zap, CheckCircle2, Scale, Building2, Globe, Mail, Phone, Briefcase, TrendingUp, FileCheck, GitBranch, Search, X, Info, Brain, FileText } from 'lucide-react';
import DocumentModal, { type DocumentType } from './LegalDocuments';
import { BWConsultantSearchWidget } from './BWConsultantSearchWidget';
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
    const [_showCaseStudy, _setShowCaseStudy] = useState(false);
    const [showOutputDetails, setShowOutputDetails] = useState(false);
    const [showProtocolDetails, setShowProtocolDetails] = useState(false);
    const [showBlock2More, setShowBlock2More] = useState(false);
    const [showBlock3More, setShowBlock3More] = useState(false);
    const [showBlock4More, setShowBlock4More] = useState(false);
    const [showBlock5Popup, setShowBlock5Popup] = useState(false);
    const [showProofPopup, setShowProofPopup] = useState(false);
    const [activeWorkflowStage, setActiveWorkflowStage] = useState<'intake' | 'analysis' | 'output' | null>(null);
    const [showProtocolLetters, setShowProtocolLetters] = useState(false);
    const [showUnifiedSystemOverview, setShowUnifiedSystemOverview] = useState(false);
    const [unifiedActiveTab, setUnifiedActiveTab] = useState<'protocol' | 'documents' | 'letters' | 'proof'>('protocol');
    const [activeDocument, setActiveDocument] = useState<DocumentType>(null);
    const [_activeLayer, _setActiveLayer] = useState<number | null>(null);

    // Global Location Intelligence state - LIVE SEARCH
    const [_locationQuery, _setLocationQuery] = useState('');
    const [_isResearchingLocation, _setIsResearchingLocation] = useState(false);
    const [_researchProgress, _setResearchProgress] = useState<null>(null);
    const [_locationResult, _setLocationResult] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null);
    const [_comparisonCities, _setComparisonCities] = useState<Array<{ city: string; country: string; reason: string; keyMetric?: string }>>([]);
    const [_researchSummary, _setResearchSummary] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_liveProfile, _setLiveProfile] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_researchResult, _setResearchResult] = useState<any>(null);
    const [_searchError, _setSearchError] = useState<string | null>(null);

    // Handle location search - SIMPLIFIED Gemini-first approach

    const tenStepProtocol = [
        { step: 1, title: "Identity & Foundation", description: "Establish organizational credibility, legal structure, and competitive positioning.", details: ["Organization name, type, and legal structure", "Registration/incorporation details", "Key leadership and governance structure", "Historical track record and credentials", "Competitive positioning statement", "Core competencies and differentiators"] },
        { step: 2, title: "Mandate & Strategy", description: "Define strategic vision, objectives, target partner profile, and value proposition.", details: ["Strategic vision and mission alignment", "Short, medium, and long-term objectives", "Target partner/investor profile", "Value proposition articulation", "Strategic fit assessment criteria", "Success metrics and KPIs"] },
        { step: 3, title: "Market & Context", description: "Analyze market dynamics, regulatory environment, and macro-economic factors.", details: ["Market size and growth projections", "Competitive landscape analysis", "Regulatory environment assessment", "Regulatory Friction Index (RFI) scoring", "Macro-economic factors and trends", "Industry-specific dynamics", "Regional context and opportunities"], gliEnabled: true, gliNote: "BW Intel Fact Sheet provides GDP, demographics, trade data, and regulatory friction scores" },
        { step: 4, title: "Partners & Ecosystem", description: "Map stakeholder landscape, alignment scores, and relationship dynamics.", details: ["Stakeholder identification and mapping", "Counterparty Integrity Score (CIS) verification", "Alignment score calculations", "Relationship strength assessment", "Ecosystem dependencies", "Partnership synergy analysis", "Stakeholder communication strategy"], gliEnabled: true, gliNote: "BW Intel shows major employers, foreign companies, and government contacts" },
        { step: 5, title: "Financial Model", description: "Structure investment requirements, revenue projections, and ROI scenarios.", details: ["Investment requirements breakdown", "Revenue model and projections", "Cost structure analysis", "ROI scenario modeling (base/best/worst)", "Funding sources and terms", "Financial sustainability metrics"], gliEnabled: true, gliNote: "BW Intel provides tax incentives, economic zones, and cost indicators" },
        { step: 6, title: "Risk & Mitigation", description: "Identify and quantify risks with probability/impact matrices and mitigation plans.", details: ["Risk identification and categorization", "Probability and impact assessment", "Risk matrix visualization", "Policy Shock Sensitivity (PSS) scenarios", "Mitigation strategies per risk", "Contingency planning", "Risk monitoring framework"], gliEnabled: true, gliNote: "BW Intel includes political, economic, natural, and regulatory risk assessments" },
        { step: 7, title: "Resources & Capability", description: "Assess organizational readiness, team strength, and capability gaps.", details: ["Current resource inventory", "Team capabilities assessment", "Capability gap analysis", "Training and development needs", "Resource acquisition strategy", "Organizational readiness score"], gliEnabled: true, gliNote: "BW Intel shows labor pool quality, universities, and workforce data" },
        { step: 8, title: "Execution Plan", description: "Define implementation roadmap, milestones, dependencies, and go/no-go gates.", details: ["Implementation roadmap with phases", "Milestone definitions and timelines", "Dependency mapping", "Go/no-go decision gates", "Resource allocation per phase", "Critical path identification"], gliEnabled: true, gliNote: "BW Intel provides entry timeline guidance and infrastructure readiness" },
        { step: 9, title: "Governance & Monitoring", description: "Establish oversight structure, decision matrices, and performance tracking.", details: ["Governance structure design", "Decision-making authority matrix", "Reporting cadence and format", "Performance tracking metrics", "Escalation procedures", "Audit and compliance framework"], gliEnabled: true, gliNote: "BW Intel shows government structure, leadership, and regulatory framework" },
        { step: 10, title: "Scoring & Readiness", description: "Final validation and readiness assessment with go/no-go recommendation.", details: ["Composite readiness score calculation", "Strength/weakness summary", "Final risk assessment", "Go/no-go recommendation", "Pre-launch checklist", "Success probability index (SPI)"], gliEnabled: true, gliNote: "BW Intel provides composite scores, comparison analysis, and data quality metrics" }
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
                        <button onClick={() => scrollToSection('protocol')} className="hover:text-blue-600 transition-colors">Protocol</button>
                        <button onClick={() => scrollToSection('proof')} className="hover:text-blue-600 transition-colors">Proof</button>
                        <button onClick={() => scrollToSection('pilots')} className="hover:text-blue-600 transition-colors">Partnerships</button>
                    </div>
                    
                </div>
            </nav>



            {/* OUR MISSION  -  Header with photo banner background */}
            <section id="mission" className="relative pt-36 pb-20 px-4 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&q=80" 
                    alt="Regional landscape" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <p className="text-blue-400 uppercase tracking-[0.3em] text-sm mb-6 font-bold">OUR MISSION</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 text-white">
                        Strong nations are built<br />on strong regions.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4">
                        Every nation depends on its regions &mdash; for food, resources, industry, and resilience. But for too long, opportunity has been decided by proximity to capital, not by fundamentals.
                    </p>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The capability is there. The potential is real. What has been missing are the tools. We built those tools.
                    </p>
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
                                <strong>BWGA Ai is the answer.</strong> It is the technology arm of BW Global Advisory. Not a chatbot. Not a search engine. Not a lookup table. It is a complete digital boardroom &mdash; a system that reasons through investment, trade, and development problems using the same depth of analysis that previously required a team of senior consultants, weeks of research, and hundreds of thousands of dollars.
                            </p>
                        </div>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        That&rsquo;s not a criticism &mdash; it&rsquo;s the insight that made this system possible. If the answers already exist, scattered across decades and continents, then the real problem isn&rsquo;t knowledge. It&rsquo;s access. It&rsquo;s synthesis. It&rsquo;s the ability to take what worked in Shenzhen in 1980, in Penang in 1995, in Medell&iacute;n in 2004, and translate it into a strategic roadmap for a regional council staring at a blank page today.
                    </p>

                    {/* Personal Story  -  Brayden Walls */}
                    <div className="relative rounded-sm overflow-hidden mb-8 shadow-lg border-2 border-slate-300">
                        <img 
                            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&q=80" 
                            alt="Regional landscape" 
                            className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-800/85" />
                        <div className="relative z-10 p-8 md:p-10">
                            <h3 className="text-2xl font-semibold text-white mb-6">Who I am &mdash; the founder and sole developer</h3>
                            
                            <p className="text-base text-slate-200 leading-relaxed mb-4">
                                Hey everyone, I&rsquo;m Brayden Walls, the developer behind <strong className="text-white">BWGA Ai</strong>, and I&rsquo;m thrilled to finally share this with the world. For the first time, I&rsquo;m lifting the curtain on what we&rsquo;ve built&mdash;a groundbreaking neuro-symbolic intelligence system that&rsquo;s not just another AI tool, but a complete rethinking of how machines can reason like humans.
                            </p>
                            <p className="text-base text-slate-200 leading-relaxed mb-4">
                                For more than 16 months, I&rsquo;ve been living, researching, and building in a place that inspired everything you see here &mdash; the Philippines. Not in a lab. Not in a corporate office. On the ground, in the communities where economic potential is enormous but the tools to unlock it simply don&rsquo;t exist.
                            </p>

                            <p className="text-base text-slate-200 leading-relaxed mb-4">
                                I watched the same pattern repeat everywhere: ambitious businesses exploring new frontiers with incomplete information, regional governments eager for partnerships but unable to translate their advantages into investor language, unproductive meetings built on mismatched expectations. Places like Mindanao, regional Australia, communities across the Pacific &mdash; they all wanted the same thing: to be seen, to be understood, to have a fair shot.
                            </p>

                            <p className="text-base text-slate-200 leading-relaxed mb-6">
                                So I stopped waiting for someone else to build it. I taught myself to code, studied every economic development framework I could find, and spent over a year turning that knowledge into software. What came out the other side isn&rsquo;t a chatbot or a dashboard &mdash; it&rsquo;s a complete reasoning system. One that thinks through problems the way a team of senior consultants would, but faster, cheaper, and available to anyone. What you&rsquo;re about to see below is what I built, how it works, and why nothing else like it exists.
                            </p>

                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm p-6">
                                <p className="text-lg text-white leading-relaxed italic mb-3">
                                    &ldquo;Every &lsquo;new idea&rsquo; is old somewhere. The child learns what the parent already knows. The past isn&rsquo;t historical interest. The past is the solution library.&rdquo;
                                </p>
                                <p className="text-slate-300 text-sm font-medium">&mdash; Brayden Walls, Founder &amp; Sole Developer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>







            {/* ------------------------------------------------------- */}
            {/* THE PLATFORM  -  Professional Architecture Demonstration */}
            {/* ------------------------------------------------------- */}

            {/* Section 1: A WORLD FIRST + Full Story Button */}
            <section id="technology" className="py-12 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm font-bold text-center mb-6">A WORLD FIRST</p>
                    <h2 className="text-4xl md:text-5xl font-light text-center leading-tight mb-4 text-slate-900">
                        A Neuro-Symbolic Economic Intelligence Engine
                    </h2>
                    <p className="text-center text-lg md:text-xl font-light mb-12 max-w-3xl mx-auto text-slate-600">
                        Not a chatbot. A <span className="text-blue-600 font-normal">Neuro-Symbolic Operating System</span> designed to close the &ldquo;Confidence Gap&rdquo; in high-stakes strategic decision-making.
                    </p>

                    {/* --- THE NARRATIVE: A Global Intelligence Operating System --- */}

                    {/* Block 1: The Opening Statement  -  Photo left, narrative right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80" 
                                alt="Global connectivity"
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The Problem: The Trust Gap in Artificial Intelligence
                            </h3>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                Most AI today&mdash;the language models behind ChatGPT, Claude, and others&mdash;is <strong>probabilistic</strong>. It guesses the next word based on patterns. While impressive, this approach has fatal flaws for high-stakes decision-making: it hallucinates facts, hides its reasoning, and gives different answers to the same question.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                When the stakes are real&mdash;investments, policy decisions, people&rsquo;s livelihoods&mdash;guessing isn&rsquo;t good enough. You cannot build a national strategy or a multi-million dollar investment on a &ldquo;black box&rdquo; that might be wrong.
                            </p>

                            {/* Clean two-column comparison */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="border border-slate-200 rounded-sm p-4">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Standard AI (Language-First)</p>
                                    <ul className="space-y-1.5 text-sm text-slate-600">
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Hallucinates facts (invents data)</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Hidden reasoning (Black Box)</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Inconsistent outputs</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Silent bias (Agrees with you)</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> No safety rails</li>
                                    </ul>
                                </div>
                                <div className="border-2 border-blue-500 rounded-sm p-4 bg-blue-50/50">
                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">BW Nexus AI (Logic-First)</p>
                                    <ul className="space-y-1.5 text-sm text-slate-700">
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-blue-500 mt-px flex-shrink-0" /> Validates every input (SAT logic)</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-blue-500 mt-px flex-shrink-0" /> Full audit trail (Traceable)</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-blue-500 mt-px flex-shrink-0" /> Deterministic scoring</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-blue-500 mt-px flex-shrink-0" /> Adversarial debate (Challenges you)</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-blue-500 mt-px flex-shrink-0" /> Ethical enforcement (Hard gates)</li>
                                    </ul>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowFormulas(true)}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base font-semibold transition-colors"
                            >
                                <GitBranch size={18} />
                                View Full Architecture &amp; 38+ Formulas &rarr;
                            </button>
                        </div>
                    </div>


                    {/* Block 1b: The Solution */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" 
                                alt="Intelligence You Can Prove" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The Solution: Intelligence You Can Prove
                            </h3>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                I built BW Nexus AI because I believed intelligence should be <strong>provable</strong>. Not generated. Not predicted. <em>Proven</em>.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                This is a <strong>Deterministic Intelligence Engine</strong>. It validates every input, traces every recommendation, and enforces strict ethical gates. It doesn&rsquo;t just give you an answer; it gives you the mathematical proof behind it.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                Every recommendation is traceable, every output repeatable, every claim defensible. That&rsquo;s what deterministic means&mdash;and that&rsquo;s what I set out to create.
                            </p>
                        </div>
                    </div>

                    {/* Block 2: The Origin  -  Text left, photo right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop&q=80" 
                                alt="One Person, One Year, One Idea" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The Origin: One Person, One Mission
                            </h3>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">&ldquo;12 Months That Changed Everything&rdquo;</p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                This system wasn&rsquo;t built in a corporate boardroom. It started with a frustration. I was watching regions with incredible potential&mdash;talent, resources, strategic location&mdash;get passed over by global investors simply because they didn&rsquo;t know how to &ldquo;speak the language&rdquo; of capital. They lacked the tools to objectively prove their case.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                I realized that <strong>the gap wasn&rsquo;t a lack of value; it was a lack of translation</strong>.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                So, I spent a year building the NSIL (Nexus Strategic Intelligence Layer). I started with the formula engine&mdash;38+ proprietary formulas like SPI (Strategic Positioning Index) and RROI (Risk-Adjusted Return on Investment). I built a scheduler to run them in parallel, ensuring that no formula executes until its inputs are verified. That was the foundation: a system that could quantify the unquantifiable.
                            </p>
                        </div>
                    </div>

                    {/* Block 3: The Innovation - How It Thinks */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&q=80" 
                                alt="How It Thinks" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The Innovation: How It &ldquo;Thinks&rdquo;
                            </h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">1. The Brain: Computational Neuroscience</p>
                            <p className="text-base text-slate-700 leading-relaxed mb-3">
                                Formulas were just the start. To make the system truly useful, it needed to think like a human expert. I integrated <strong>7 computational neuroscience models</strong>&mdash;real mathematical implementations of how the human brain processes complexity, allocates attention, and reacts under pressure. This allows the system to not just calculate numbers, but to understand the nuance of a deal.
                            </p>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">2. Autonomous Intelligence: Thinking Beyond the Question</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 mb-3">
                                <div><strong>Creative Synthesis:</strong> Uses bisociation theory to find strategies from unrelated domains.</div>
                                <div><strong>Ethical Reasoning:</strong> Enforces fairness gates. If a path is unethical, it is rejected, no matter how profitable.</div>
                                <div><strong>Scenario Simulation:</strong> Runs 5,000 Monte Carlo futures to stress-test your plan against economic shocks.</div>
                            </div>
                            <button 
                                onClick={() => { setUnifiedActiveTab('protocol'); setShowUnifiedSystemOverview(true); }}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base font-semibold transition-colors"
                            >
                                <Info size={16} />
                                View Complete System: Protocol, 232 Documents &amp; 156 Letters &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Block 3a: Reflexive Intelligence */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&q=80" 
                                alt="Reflexive Intelligence" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                Reflexive Intelligence: Analyzing You
                            </h3>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                The system doesn&rsquo;t just analyze the market; <strong>it analyzes you</strong>.
                            </p>
                            <ul className="text-sm text-slate-600 space-y-2 mb-2">
                                <li><strong>Signal Decoder:</strong> Detects what you repeat (what matters to you) and what you avoid (where your anxiety lives).</li>
                                <li><strong>Latent Advantage Miner:</strong> Surfaces assets you mentioned casually that have massive strategic value.</li>
                                <li><strong>Universal Translator:</strong> Translates every finding into 5 distinct languages: for Investors, Governments, Communities, Partners, and Executives.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Block 3b: The User Experience */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80" 
                                alt="Live Intelligence" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The User Experience: Live Intelligence
                            </h3>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">&ldquo;You don&rsquo;t need to be a data scientist.&rdquo;</p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                You don&rsquo;t need to understand how the engine works to drive the car. You just need to know it will get you where you want to go&mdash;safely, reliably, every single time.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                When you use BW Nexus AI, you aren&rsquo;t just typing into a chatbox. You are engaging a <strong>Digital Boardroom</strong>. Behind the scenes, 34 intelligence engines and 5 AI personas are debating your project, crunching the numbers, and stress-testing your strategy 24/7.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>The Result:</strong> You walk away with something you&rsquo;ve only ever wished for: <em>Confidence</em>.
                            </p>
                        </div>
                    </div>

                    {/* Block 3c: What You Get */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop&q=80" 
                                alt="What You Get" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                What You Walk Away With
                            </h3>
                            <ul className="text-sm text-slate-600 space-y-2 mb-3">
                                <li><strong>The Proof:</strong> A dossier that looks like it cost $100,000 to produce.</li>
                                <li><strong>The Defense:</strong> Answers to the hardest questions an investor could ask.</li>
                                <li><strong>The Strategy:</strong> A roadmap that connects your local reality to the global economy.</li>
                            </ul>
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>Audience-Specific Outputs:</strong> The system translates the same analysis into the language of whoever you need to convince&mdash;bankers (ROI focus), governments (job creation), or partners (synergy fit).
                            </p>
                        </div>
                    </div>

                    {/* Block 4: System Commitments */}
                    <div className="flex flex-col md:flex-row-reverse gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80" 
                                alt="System Commitments" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                System Commitments: Built for Trust
                            </h3>
                            <ul className="text-sm text-slate-600 space-y-2 mb-2">
                                <li><strong>The &ldquo;Reality Check&rdquo; (Calibration):</strong> The system undergoes continuous calibration via real-world historical scenarios to tune formula weights&mdash;so it learns whether &ldquo;Political Stability&rdquo; matters more for a solar farm in Vietnam or a tech startup in Poland.</li>
                                <li><strong>The &ldquo;Social Contract&rdquo; (10% Pledge):</strong> 10% of all revenue is reinvested into regional development. This system is designed to give back to the regions it analyzes, not just extract data from them.</li>
                                <li><strong>The &ldquo;Live Wire&rdquo; (Real-Time Data):</strong> Connected to World Bank and IMF feeds&mdash;if a currency crashes or law passes today, reports generated tomorrow reflect that risk automatically.</li>
                                <li><strong>Human-in-the-Loop Guardrails:</strong> For high-stakes decisions involving millions, a human expert must sign off on the AI&rsquo;s logic before final documents are issued.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Block 5: The Document Factory */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80" 
                                alt="Document Factory" 
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                The Output: The Document Factory
                            </h3>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                This system replaces the need for a legal drafter in the early stages. It doesn&rsquo;t just give you advice; it gives you <strong>Tangible Assets</strong>.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-2">
                                It auto-generates specific, legally-structured drafts:
                            </p>
                            <ul className="text-sm text-slate-600 space-y-1 mb-2">
                                <li>&bull; Letters of Intent (LOI)</li>
                                <li>&bull; Memorandums of Understanding (MOU)</li>
                                <li>&bull; Non-Disclosure Agreements (NDA)</li>
                                <li>&bull; Term Sheets</li>
                            </ul>
                            <p className="text-sm text-slate-600 italic">
                                This saves thousands of dollars in legal fees and weeks of time, allowing you to walk into a meeting with the paperwork already done.
                            </p>
                        </div>
                    </div>

                    {/* Block 6: Conclusion  -  Full-width statement */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-sm p-6 md:p-8 mb-6">
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            Conclusion: A Paradigm Shift
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed mb-2">
                            The core problem I&rsquo;m solving is <strong className="text-white">Trust</strong>. This isn&rsquo;t just technology. It is a system built to restore confidence in artificial intelligence. It empowers the &ldquo;underdogs&rdquo; of the global economy&mdash;regional councils, developing nations, and ambitious entrepreneurs&mdash;to make decisions they can legally and strategically defend in boardrooms, government briefings, and investment committees.
                        </p>
                        <p className="text-base text-white leading-relaxed font-medium">
                            The technology is real. The results are real. And it&rsquo;s all here to help you succeed.
                        </p>
                    </div>



                </div>
            </section>


            {/* BW CONSULTANT AI SEARCH - Gateway Widget */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <BWConsultantSearchWidget 
                        context="landing"
                        onSearch={(query) => {
                            console.log('Landing page search:', query);
                            if (onEnterPlatform) onEnterPlatform();
                        }}
                    />
                </div>
            </section>

            {/* Photo Banner  -  Document Intelligence */}

            {/* WHO THIS IS FOR */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">WHO THIS IS FOR</p>
                    <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">You Don't Need to Be an Expert. <span className="text-blue-600 font-normal">The System Already Is.</span></h2>
                    <p className="text-base text-slate-600 leading-relaxed mb-10 max-w-3xl">
                        The people who need this most are the ones who've never had access to it. That's the point.
                    </p>

                    {/* WHO  -  narrative cards with photos */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&q=80" alt="Regional council meeting" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center"><Building2 size={16} className="text-blue-600" /></div>
                                    <h3 className="text-sm font-bold text-white">Regional Councils & Development Agencies</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    You know your region has potential. You&rsquo;ve seen it your entire career. But when the investment board asks for a risk-adjusted ROI model or a stakeholder alignment matrix, the budget doesn&rsquo;t stretch. This system gives you the same analytical depth &mdash; scored, stress-tested, and formatted &mdash; without the consulting invoice.
                                </p>
                                <p className="text-xs text-blue-600 font-medium">What you get: prospectuses, structural twin analysis, lifecycle mapping, advantage mining, scenario stress-testing</p>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop&q=80" alt="Government investment board" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center"><Scale size={16} className="text-blue-600" /></div>
                                    <h3 className="text-sm font-bold text-white">Government Agencies & Investment Boards</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    You&rsquo;re screening proposals, evaluating bids, or deciding which initiatives get funded. Every decision needs a defensible trail. This system stress-tests assumptions, surfaces deal-killers early, runs adversarial debate from five perspectives, and produces a documented rationale you can stand behind in scrutiny.
                                </p>
                                <p className="text-xs text-blue-600 font-medium">What you get: scored viability assessments, ethical gates, friction analysis, traceable decision rationale</p>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop&q=80" alt="Business expansion" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center"><Briefcase size={16} className="text-blue-600" /></div>
                                    <h3 className="text-sm font-bold text-white">Businesses Expanding Into New Regions</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    You&rsquo;ve outgrown your home market. You&rsquo;re looking at Southeast Asia, the Pacific, Latin America &mdash; but you don&rsquo;t know the regulatory landscape, the real cost of entry, or which local partners are credible. This system researches any location in seconds, scores your entry strategy against historical patterns, and flags what will go wrong before you commit capital.
                                </p>
                                <p className="text-xs text-blue-600 font-medium">What you get: BW AI Search briefs, risk assessment, partner ecosystem mapping, activation timeline forecasts</p>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&q=80" alt="Entrepreneur working" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center"><Globe size={16} className="text-blue-600" /></div>
                                    <h3 className="text-sm font-bold text-white">First-Time Exporters & Regional Entrepreneurs</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    You&rsquo;ve never written an investment prospectus. You don&rsquo;t know what a due diligence pack looks like. You&rsquo;ve never seen a Monte Carlo simulation. That&rsquo;s fine &mdash; the system walks you through a guided 10-step intake, asks the right questions, and produces the documents that open doors. The BW Consultant AI sits alongside you at every step.
                                </p>
                                <p className="text-xs text-blue-600 font-medium">Guided intake, built-in consultant, and step-by-step preparation &mdash; without needing a consulting team</p>
                            </div>
                        </div>
                    </div>

                    {/* How the system adapts */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-6 rounded-r-sm">
                        <p className="text-base text-slate-800 leading-relaxed">
                            <strong className="text-slate-900">The system adapts to you.</strong> First-time users get full walkthroughs, guided intake, and pattern confidence explained at every stage. Teams review scores together with shared workspaces. Experts get direct formula access, full audit trail export, visible DAG scheduling, and adjustable Monte Carlo parameters. Same engine  -  different depth based on who's driving.
                        </p>
                    </div>
                </div>
            </section>

            {/* NEXT STEPS - Partnership & Pilot Programs */}
            <section id="pilots" className="py-12 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm font-bold text-center mb-6">NEXT STEPS</p>
                    <h2 className="text-4xl md:text-5xl font-light text-center leading-tight mb-4 text-slate-900">Work With Us</h2>
                    <p className="text-center text-lg md:text-xl font-light mb-12 max-w-3xl mx-auto text-slate-600">
                        We&rsquo;re looking for forward-thinking organisations who want to pilot a new standard for how investment decisions get made &mdash; and help shape the platform before it goes to market.
                    </p>

                    {/* Built on World-Class Ethics - Photo Left Block */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-6">
                        <div className="md:w-4/12">
                            <img 
                                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&q=80" 
                                alt="Global Standards and Ethics"
                                className="w-full h-full min-h-[200px] object-cover" 
                            />
                        </div>
                        <div className="md:w-8/12 bg-white p-5 md:p-6 flex flex-col justify-center">
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Global Standards and Ethics</p>
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                                Built on World-Class Ethics
                            </h3>
                            <p className="text-base text-slate-700 leading-relaxed mb-3">
                                This system doesn&rsquo;t just aim for compliance &mdash; it sets the gold standard. Every analysis is measured against IFC Performance Standards and UN SDGs, ensuring your projects meet the highest global benchmarks before you even know the local law.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>Universal Law Translator:</strong> The system operates as a Universal Translator for Law &mdash; translating your local idea into global standards, then translating global requirements back into local legal actions.
                            </p>
                        </div>
                    </div>

                    {/* IFC Performance Standards - Full Width */}
                    <div className="mb-6 pl-0 md:pl-6">
                        <div className="space-y-3">
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>1. Universal Skeleton:</strong> Before checking local law, the system applies IFC Performance Standards (PS1-PS8) &mdash; the &ldquo;Gold Standard&rdquo; used by the World Bank and 100+ global financial institutions. PS1: Environmental &amp; Social Management. PS2: Labour and Working Conditions. PS5: Land Acquisition &amp; Resettlement. PS7: Indigenous Peoples (FPIC).
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>2. Gap Analysis:</strong> The system checks your inputs against every Performance Standard, flagging exactly where you fall short &mdash; with severity ratings and business impact assessment.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                <strong>3. Local Law Hunt:</strong> Once a gap is detected, the AI searches for the specific local regulations to bridge it &mdash; with exact legal references, required forms, and enforcing agencies.
                            </p>
                        </div>
                    </div>

                    {/* Universal Access - Full Width (No Photo) */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                            Universal Access &amp; Investor Confidence
                        </h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-3">
                            <strong>Universal Access:</strong> Anyone, anywhere can start a report immediately. No need to wait for specific country laws to be programmed &mdash; the global baseline works everywhere.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-3">
                            <strong>Investor Confidence:</strong> Global investors prefer IFC Standards over local laws anyway &mdash; they&rsquo;re stricter and safer. Meeting these standards opens doors to DFI financing.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-3">
                            <strong>Safety Net:</strong> Reports can be generated (business doesn&rsquo;t stop) but with exact red flags highlighted &mdash; protecting you from illegal actions and reputational damage.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Every pilot teaches us something. Every partnership sharpens the intelligence. The long-term vision is a sovereign-grade national strategic asset &mdash; 34 intelligence engines working in concert. <strong>Early partners don&rsquo;t just get access to the platform. They help define what it becomes.</strong>
                        </p>
                    </div>

                    {/* Three Partnership Cards */}
                    <div className="grid md:grid-cols-3 gap-5 mt-8">
                        <div className="bg-white border-2 border-slate-200 rounded-sm p-6 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 border border-blue-200 rounded-sm flex items-center justify-center">
                                    <Zap size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Investment Promotion Agencies</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">You review hundreds of investment leads a year. Most don&rsquo;t go anywhere. The ones that do take months of manual due diligence before you can even bring them to a board.</p>
                            <p className="text-sm text-blue-600 font-medium">Pilot the system on your next intake cycle &mdash; screen proposals in hours instead of weeks, with board-ready scoring and a defensible evidence trail from day one.</p>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-sm p-6 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 border border-blue-200 rounded-sm flex items-center justify-center">
                                    <TrendingUp size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Regional Economic Development</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">Your region has real assets &mdash; a port, a university, agricultural land, a diaspora network &mdash; but the investment prospectus hasn&rsquo;t been written, or the one you have reads like every other region in the country.</p>
                            <p className="text-sm text-blue-600 font-medium">Partner on a regional intelligence project &mdash; we&rsquo;ll identify what your region actually has, find your structural twins globally, and produce the documents that get you into the room with the right investors.</p>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-sm p-6 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 bg-blue-100 border border-blue-200 rounded-sm flex items-center justify-center">
                                    <Building2 size={18} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Public-Private Partnerships</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">PPP proposals fail most often not because the project is bad, but because stakeholder alignment was assumed instead of modelled. The economics looked good on paper but nobody stress-tested the assumptions.</p>
                            <p className="text-sm text-blue-600 font-medium">Run your next PPP proposal through the system &mdash; stress-test the financials across 5,000 scenarios, model every stakeholder&rsquo;s incentives, and surface the deal-killers before they reach the minister&rsquo;s desk.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* SOLVING REAL PROBLEMS  -  Statement Piece */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4 font-bold">SOLVING REAL PROBLEMS</p>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 leading-relaxed">
                        This platform exists to help capital, partnerships, and capability reach places that are too often overlooked &mdash; despite holding extraordinary, investable potential.
                    </h2>
                    <div className="w-20 h-0.5 bg-white/40 mx-auto mb-6" />
                    <p className="text-lg text-white/90 leading-relaxed mb-6 max-w-3xl mx-auto">
                        During this beta phase and in future subscriptions, <strong className="text-white font-bold">10% of every paid transaction</strong> goes back into initiatives that support regional development.
                    </p>
                    <p className="text-base text-blue-100 italic">
                        A new voice for regions. A new standard for how opportunity is evaluated &mdash; anywhere in the world.
                    </p>
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
                            <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider mb-3">BWGA Ai</h4>
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
                                BWGA Ai is currently in active R&D phase, operating under Brayden Walls as a registered Australian sole trader. The platform is being developed for future commercial deployment to government and enterprise clients.
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

            {/* ----------------------------------------------------------- */}
            {/* WHAT YOU GET  -  Detail Popup Modal                          */}
            {/* ----------------------------------------------------------- */}
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

                            <h3 className="text-lg font-semibold text-blue-600 mb-2">The Document Factory Catalog</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                <strong>232 Document Types</strong> across <strong>14 Categories</strong>, plus <strong>156 Letter Templates</strong> &mdash; covering the entire lifecycle of global development projects.
                            </p>

                            {/* 14 CATEGORY STRUCTURE */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">THE 14-CATEGORY LIFECYCLE STRUCTURE</p>
                                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                                        <p className="font-bold text-emerald-700">ENTRY PHASE</p>
                                        <p className="text-slate-600">Strategy, Market, Government</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                        <p className="font-bold text-blue-700">DEAL PHASE</p>
                                        <p className="text-slate-600">Foundation, Financial, Partnership</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 rounded p-2">
                                        <p className="font-bold text-amber-700">EXECUTION PHASE</p>
                                        <p className="text-slate-600">PM, Procurement, HR, Infrastructure</p>
                                    </div>
                                    <div className="bg-rose-50 border border-rose-200 rounded p-2">
                                        <p className="font-bold text-rose-700">SAFETY PHASE</p>
                                        <p className="text-slate-600">Risk, Governance, Regulatory, ESG</p>
                                    </div>
                                </div>
                            </div>

                            {/* FULL 14-CATEGORY CATALOG */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {/* Category 1: Foundation & Legal */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">1. Foundation &amp; Legal (10 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Letter of Intent (LOI)</li>
                                        <li>&bull; Memorandum of Understanding (MOU)</li>
                                        <li>&bull; Non-Disclosure Agreement (NDA)</li>
                                        <li>&bull; Term Sheet</li>
                                        <li>&bull; Expression of Interest (EOI)</li>
                                        <li>&bull; Request for Information (RFI)</li>
                                        <li>&bull; Request for Proposal (RFP)</li>
                                        <li>&bull; Request for Quotation (RFQ)</li>
                                        <li>&bull; Invitation to Tender (ITT)</li>
                                        <li>&bull; Pre-Qualification Document</li>
                                    </ul>
                                </div>

                                {/* Category 2: Strategic Intelligence */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">2. Strategic Intelligence (12 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Executive Summary</li>
                                        <li>&bull; Strategic Brief</li>
                                        <li>&bull; Strategic Plan</li>
                                        <li>&bull; Business Case</li>
                                        <li>&bull; Feasibility Study</li>
                                        <li>&bull; Market Entry Strategy</li>
                                        <li>&bull; Growth Strategy</li>
                                        <li>&bull; Exit Strategy</li>
                                        <li>&bull; Turnaround Plan</li>
                                        <li>&bull; Transformation Roadmap</li>
                                        <li>&bull; Vision Document</li>
                                        <li>&bull; White Paper</li>
                                    </ul>
                                </div>

                                {/* Category 3: Financial & Investment */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">3. Financial &amp; Investment (19 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Financial Model (5-Year Projections)</li>
                                        <li>&bull; Investment Memo</li>
                                        <li>&bull; Investment Thesis</li>
                                        <li>&bull; Capital Raise Deck</li>
                                        <li>&bull; Private Placement Memorandum (PPM)</li>
                                        <li>&bull; Prospectus</li>
                                        <li>&bull; Bond Offering Document</li>
                                        <li>&bull; Project Finance Model</li>
                                        <li>&bull; Valuation Report</li>
                                        <li>&bull; Fairness Opinion</li>
                                        <li>&bull; Solvency Opinion</li>
                                        <li>&bull; Credit Analysis</li>
                                        <li>&bull; Cash Flow Analysis</li>
                                        <li>&bull; Budget Proposal</li>
                                        <li>&bull; Cost-Benefit Analysis</li>
                                        <li>&bull; ROI Analysis</li>
                                        <li>&bull; NPV/IRR Analysis</li>
                                        <li>&bull; Sensitivity Analysis</li>
                                        <li>&bull; Monte Carlo Simulation Report</li>
                                    </ul>
                                </div>

                                {/* Category 4: Risk & Due Diligence */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">4. Risk &amp; Due Diligence (21 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Risk Assessment Report</li>
                                        <li>&bull; Blind Spot Audit</li>
                                        <li>&bull; Risk Register</li>
                                        <li>&bull; Risk Mitigation Plan</li>
                                        <li>&bull; Due Diligence Request List</li>
                                        <li>&bull; Due Diligence Report</li>
                                        <li>&bull; Legal Due Diligence</li>
                                        <li>&bull; Financial Due Diligence</li>
                                        <li>&bull; Commercial Due Diligence</li>
                                        <li>&bull; Technical Due Diligence</li>
                                        <li>&bull; Environmental Due Diligence</li>
                                        <li>&bull; Tax Due Diligence</li>
                                        <li>&bull; HR Due Diligence</li>
                                        <li>&bull; IT Due Diligence</li>
                                        <li>&bull; Background Check Report</li>
                                        <li>&bull; Integrity Due Diligence</li>
                                        <li>&bull; Sanctions Screening Report</li>
                                        <li>&bull; AML/KYC Report</li>
                                        <li>&bull; Political Risk Assessment</li>
                                        <li>&bull; Country Risk Report</li>
                                        <li>&bull; Currency Risk Analysis</li>
                                    </ul>
                                </div>

                                {/* Category 5: Government & Policy */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">5. Government &amp; Policy (21 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Policy Brief</li>
                                        <li>&bull; Position Paper</li>
                                        <li>&bull; Regulatory Impact Assessment</li>
                                        <li>&bull; Legislative Proposal</li>
                                        <li>&bull; Cabinet Memo</li>
                                        <li>&bull; Ministerial Briefing</li>
                                        <li>&bull; Budget Submission</li>
                                        <li>&bull; Public Consultation Document</li>
                                        <li>&bull; PPP Proposal Framework</li>
                                        <li>&bull; Concession Agreement</li>
                                        <li>&bull; Sovereign Guarantee Request</li>
                                        <li>&bull; Bilateral Investment Treaty Template</li>
                                        <li>&bull; Free Trade Agreement Analysis</li>
                                        <li>&bull; Economic Impact Assessment</li>
                                        <li>&bull; Social Impact Assessment</li>
                                        <li>&bull; National Development Plan</li>
                                        <li>&bull; Sector Development Strategy</li>
                                        <li>&bull; Special Economic Zone Proposal</li>
                                        <li>&bull; Investment Promotion Brief</li>
                                        <li>&bull; Grant Application</li>
                                        <li>&bull; Subsidy Application</li>
                                    </ul>
                                </div>

                                {/* Category 6: Partnership & Consortium */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">6. Partnership &amp; Consortium (14 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Partnership Proposal</li>
                                        <li>&bull; Partnership Assessment</li>
                                        <li>&bull; Partner Comparison Matrix</li>
                                        <li>&bull; Alliance Framework</li>
                                        <li>&bull; Consortium Agreement</li>
                                        <li>&bull; Joint Venture Agreement</li>
                                        <li>&bull; Teaming Agreement</li>
                                        <li>&bull; Co-Development Agreement</li>
                                        <li>&bull; Technology Transfer Agreement</li>
                                        <li>&bull; Capacity Building Program</li>
                                        <li>&bull; Local Content Plan</li>
                                        <li>&bull; Stakeholder Mapping</li>
                                        <li>&bull; Stakeholder Engagement Strategy</li>
                                        <li>&bull; Partnership Scorecard</li>
                                    </ul>
                                </div>

                                {/* Category 7: Execution & Project Management */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">7. Execution &amp; Project Management (18 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Implementation Roadmap</li>
                                        <li>&bull; 100-Day Plan</li>
                                        <li>&bull; Project Charter</li>
                                        <li>&bull; Project Plan</li>
                                        <li>&bull; Gantt Chart</li>
                                        <li>&bull; Critical Path Analysis</li>
                                        <li>&bull; Milestone Report</li>
                                        <li>&bull; Status Report</li>
                                        <li>&bull; Lessons Learned</li>
                                        <li>&bull; Change Management Plan</li>
                                        <li>&bull; Integration Plan</li>
                                        <li>&bull; Post-Merger Integration Playbook</li>
                                        <li>&bull; Transition Plan</li>
                                        <li>&bull; Business Continuity Plan</li>
                                        <li>&bull; Disaster Recovery Plan</li>
                                        <li>&bull; Quality Management System</li>
                                        <li>&bull; Process Documentation (SOP)</li>
                                        <li>&bull; Performance Metrics (KPI Framework)</li>
                                    </ul>
                                </div>

                                {/* Category 8: Governance & Board */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">8. Governance &amp; Board Reporting (12 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Board Charter</li>
                                        <li>&bull; Steering Committee Report</li>
                                        <li>&bull; Decision Rights Matrix</li>
                                        <li>&bull; Governance Report</li>
                                        <li>&bull; Annual Report</li>
                                        <li>&bull; Quarterly Report</li>
                                        <li>&bull; Board Presentation</li>
                                        <li>&bull; Shareholder Letter</li>
                                        <li>&bull; Proxy Statement</li>
                                        <li>&bull; Committee Charter</li>
                                        <li>&bull; Board Resolution Template</li>
                                        <li>&bull; Corporate Minutes Template</li>
                                    </ul>
                                </div>

                                {/* Category 9: Human Capital */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">9. Human Capital &amp; Capability (12 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Organizational Chart</li>
                                        <li>&bull; Talent Gap Analysis</li>
                                        <li>&bull; Key Personnel Bios</li>
                                        <li>&bull; Capability Assessment</li>
                                        <li>&bull; Training Materials</li>
                                        <li>&bull; HR Due Diligence Report</li>
                                        <li>&bull; Compensation Benchmarking</li>
                                        <li>&bull; Succession Planning</li>
                                        <li>&bull; Performance Management Framework</li>
                                        <li>&bull; Employee Handbook</li>
                                        <li>&bull; Onboarding Program</li>
                                        <li>&bull; Culture Assessment</li>
                                    </ul>
                                </div>

                                {/* Category 10: Procurement & Supply Chain */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">10. Procurement &amp; Supply Chain (13 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Procurement Strategy</li>
                                        <li>&bull; Vendor Assessment Scorecard</li>
                                        <li>&bull; Supply Chain Mapping</li>
                                        <li>&bull; Tender Document</li>
                                        <li>&bull; Bid Evaluation Matrix</li>
                                        <li>&bull; Supplier Qualification</li>
                                        <li>&bull; Purchase Order Template</li>
                                        <li>&bull; Master Service Agreement</li>
                                        <li>&bull; Supply Agreement</li>
                                        <li>&bull; Distribution Agreement</li>
                                        <li>&bull; Logistics Plan</li>
                                        <li>&bull; Inventory Management</li>
                                        <li>&bull; Supplier Risk Assessment</li>
                                    </ul>
                                </div>

                                {/* Category 11: ESG & Social Impact */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">11. ESG &amp; Social Impact (19 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; ESG Report</li>
                                        <li>&bull; Sustainability Report</li>
                                        <li>&bull; Carbon Footprint Assessment</li>
                                        <li>&bull; Net Zero Roadmap</li>
                                        <li>&bull; Environmental Impact Assessment</li>
                                        <li>&bull; Social Impact Assessment</li>
                                        <li>&bull; Community Engagement Plan</li>
                                        <li>&bull; Human Rights Due Diligence</li>
                                        <li>&bull; Labor Standards Assessment</li>
                                        <li>&bull; Supply Chain Ethical Audit</li>
                                        <li>&bull; Diversity &amp; Inclusion Report</li>
                                        <li>&bull; Governance Report</li>
                                        <li>&bull; Ethics Policy / Code of Conduct</li>
                                        <li>&bull; Whistleblower Policy</li>
                                        <li>&bull; Anti-Bribery Program</li>
                                        <li>&bull; Green Bond Framework</li>
                                        <li>&bull; Social Bond Framework</li>
                                        <li>&bull; Impact Measurement Report</li>
                                        <li>&bull; UN SDG Alignment Report</li>
                                    </ul>
                                </div>

                                {/* Category 12: Regulatory & Compliance */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">12. Regulatory &amp; Compliance (16 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Permit Application</li>
                                        <li>&bull; Regulatory Clearance Timeline</li>
                                        <li>&bull; Compliance Certificate</li>
                                        <li>&bull; Regulatory Filing</li>
                                        <li>&bull; License Application</li>
                                        <li>&bull; Regulatory Pathway Document</li>
                                        <li>&bull; Compliance Checklist</li>
                                        <li>&bull; Anti-Corruption Policy</li>
                                        <li>&bull; Data Protection Policy (GDPR)</li>
                                        <li>&bull; Sanctions Clearance Certificate</li>
                                        <li>&bull; Export Control Assessment</li>
                                        <li>&bull; Customs Declaration</li>
                                        <li>&bull; Trade Compliance Report</li>
                                        <li>&bull; Regulatory Change Impact</li>
                                        <li>&bull; Audit Response Document</li>
                                        <li>&bull; Dispute Resolution Brief</li>
                                    </ul>
                                </div>

                                {/* Category 13: Communications & IR */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">13. Communications &amp; IR (17 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Press Release</li>
                                        <li>&bull; Media Kit</li>
                                        <li>&bull; Investor Presentation</li>
                                        <li>&bull; Board Presentation Deck</li>
                                        <li>&bull; Stakeholder Update</li>
                                        <li>&bull; Crisis Communication Plan</li>
                                        <li>&bull; Internal Memo</li>
                                        <li>&bull; Newsletter Template</li>
                                        <li>&bull; Case Study</li>
                                        <li>&bull; Testimonial Collection</li>
                                        <li>&bull; FAQ Document</li>
                                        <li>&bull; Talking Points</li>
                                        <li>&bull; Speech Draft</li>
                                        <li>&bull; Op-Ed Template</li>
                                        <li>&bull; Social Media Strategy</li>
                                        <li>&bull; Brand Guidelines</li>
                                        <li>&bull; Content Calendar</li>
                                    </ul>
                                </div>

                                {/* Category 14: Asset & Infrastructure */}
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">14. Asset &amp; Infrastructure (17 types)</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; Site Selection Report</li>
                                        <li>&bull; Asset Utilization Plan</li>
                                        <li>&bull; Technical Requirements Brief</li>
                                        <li>&bull; Infrastructure Assessment</li>
                                        <li>&bull; Grid Connection Study</li>
                                        <li>&bull; Engineering Study</li>
                                        <li>&bull; Feasibility Engineering</li>
                                        <li>&bull; Resource Assessment</li>
                                        <li>&bull; Reserve Report (Mining/Oil)</li>
                                        <li>&bull; Power Purchase Agreement (PPA)</li>
                                        <li>&bull; Offtake Agreement</li>
                                        <li>&bull; Construction Contract (EPC)</li>
                                        <li>&bull; O&amp;M Agreement</li>
                                        <li>&bull; Technology Roadmap</li>
                                        <li>&bull; Patent/IP Landscape Analysis</li>
                                        <li>&bull; Safety Assessment</li>
                                        <li>&bull; Equipment Specification</li>
                                    </ul>
                                </div>
                            </div>

                            {/* LETTER TEMPLATES SECTION */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-5 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">+ 156 Letter Templates</h3>
                                <p className="text-sm text-slate-300 mb-4">Professional correspondence for every stage of deal-making:</p>
                                <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-300">
                                    <div>
                                        <p className="font-semibold text-white mb-1">Outreach &amp; Introduction</p>
                                        <p>&bull; Partnership Introduction</p>
                                        <p>&bull; Investment Promotion</p>
                                        <p>&bull; Ministerial Introduction</p>
                                        <p>&bull; Trade Mission Request</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Deal &amp; Negotiation</p>
                                        <p>&bull; Commitment Confirmation</p>
                                        <p>&bull; JV Invitation</p>
                                        <p>&bull; Co-Investment Invitation</p>
                                        <p>&bull; Price Negotiation</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Operations &amp; Compliance</p>
                                        <p>&bull; Vendor Onboarding</p>
                                        <p>&bull; Audit Response</p>
                                        <p>&bull; License Renewal</p>
                                        <p>&bull; Crisis Statement</p>
                                    </div>
                                </div>
                            </div>

                            {/* PAGE LENGTH OPTIONS */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm font-semibold text-blue-800 mb-2">Flexible Page Lengths: 1 to 100 Pages</p>
                                <p className="text-xs text-slate-600">Every document can be generated at the length you need: 1-page quick brief, 10-page board report, or 100-page full documentation package.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong className="text-slate-700">The audit trail:</strong> Every recommendation traces back to specific data inputs, formula calculations, and persona debate transcripts. This isn&rsquo;t a black box &mdash; it&rsquo;s court-defensible, investor-ready documentation of exactly why the system reached each conclusion.
                                </p>
                            </div>
                            </div>
                        </section>

                        {/* --- PROOF OF CAPABILITY --- */}
                        <section className="py-10 px-6 md:px-8 bg-white border-t border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-2 font-bold">PROOF OF CAPABILITY</p>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">See the System in Action</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    Words are cheap. The best way to understand what this system produces is to see an actual report it generated &mdash; not a mockup, not a template, but the real output from a real submission. Below is a live example of a regional council that submitted a 5MW solar partnership proposal through the Ten-Step Protocol.
                                </p>
                                <button 
                                    onClick={() => { setShowOutputDetails(false); setShowProofPopup(true); }}
                                    className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-slate-700 rounded-sm text-sm font-bold hover:from-slate-700 hover:to-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Info size={16} />
                                    See the Proof &mdash; A Real System, A Real Report
                                </button>
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

            {/* ----------------------------------------------------------- */}
            {/* TEN-STEP PROTOCOL  -  Detail Popup Modal  -  REDESIGNED      */}
            {/* ----------------------------------------------------------- */}
            {showProtocolDetails && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setShowProtocolDetails(false)}>
                    <div className="relative w-full max-w-5xl my-8 mx-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowProtocolDetails(false)} className="fixed top-4 right-4 z-20 w-10 h-10 bg-stone-800 border border-stone-600 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg">
                            <X size={16} className="text-stone-300" />
                        </button>
                        <div className="bg-white rounded-sm shadow-2xl overflow-hidden">
                        
                        {/* Header */}
                        <section className="py-10 px-6 md:px-8 bg-gradient-to-r from-slate-900 to-slate-800">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-400 uppercase tracking-[0.2em] text-sm mb-3 font-bold">HOW YOU FEED THE BRAIN</p>
                                <h2 className="text-2xl md:text-3xl font-light text-white mb-2">The Ten-Step Protocol</h2>
                                <p className="text-base text-blue-300 mb-4 flex items-center gap-2 font-medium">
                                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                    Most users complete this in 30-45 minutes
                                </p>
                                <p className="text-base text-slate-300 leading-relaxed">
                                    Each step captures a critical dimension of your opportunity. By the end, you have clear scope, quantified assumptions, full risk visibility, and a consistent dataset the reasoning engine can trust.
                                </p>
                            </div>
                        </section>

                        {/* What Makes This Different */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Most tools generate text. This system validates reality.</h3>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        It treats your input as a hypothesis, tests it against evidence, and then produces a defensible, board-ready package. The workflow has <strong className="text-blue-700">three stages</strong>, each designed to transform raw ideas into rigorous, auditable intelligence.
                                    </p>
                                </div>

                                {/* Three Stages Overview  -  Clickable Cards */}
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <button 
                                        onClick={() => setActiveWorkflowStage('intake')}
                                        className="text-left bg-white border-2 border-blue-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">1</div>
                                            <span className="text-xs text-blue-600 uppercase tracking-wider font-bold">STAGE ONE</span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-700">Structured Intake</h4>
                                        <p className="text-xs text-slate-600">Define the opportunity in measurable terms through the 10-step protocol</p>
                                        <p className="text-xs text-blue-600 mt-3 font-medium group-hover:underline">Click to explore &rarr;</p>
                                    </button>

                                    <button 
                                        onClick={() => setActiveWorkflowStage('analysis')}
                                        className="text-left bg-white border-2 border-amber-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">2</div>
                                            <span className="text-xs text-amber-600 uppercase tracking-wider font-bold">STAGE TWO</span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-amber-700">Adversarial Analysis</h4>
                                        <p className="text-xs text-slate-600">Stress-test with 5 personas, 38+ formulas, and Monte Carlo simulation</p>
                                        <p className="text-xs text-amber-600 mt-3 font-medium group-hover:underline">Click to explore &rarr;</p>
                                    </button>

                                    <button 
                                        onClick={() => setActiveWorkflowStage('output')}
                                        className="text-left bg-white border-2 border-emerald-200 rounded-lg p-5 hover:border-emerald-400 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">3</div>
                                            <span className="text-xs text-emerald-600 uppercase tracking-wider font-bold">STAGE THREE</span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-emerald-700">Institutional Output</h4>
                                        <p className="text-xs text-slate-600">Compile evidence into 232 document types and 156 letter templates</p>
                                        <p className="text-xs text-emerald-600 mt-3 font-medium group-hover:underline">Click to explore &rarr;</p>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* The 10 Steps Grid */}
                        <section className="py-8 px-6 md:px-8 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-xs mb-3 font-bold">STAGE 1: STRUCTURED INTAKE</p>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">The Ten Steps</h3>
                                <p className="text-sm text-slate-600 mb-6">Click any step to see detailed data requirements:</p>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                    {tenStepProtocol.map((item) => (
                                        <button
                                            key={item.step}
                                            onClick={() => setActiveStep(activeStep === item.step ? null : item.step)}
                                            className={`text-left transition-all rounded-lg p-4 border-2 ${
                                                activeStep === item.step
                                                    ? 'bg-blue-100 border-blue-400 shadow-md'
                                                    : item.gliEnabled
                                                        ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
                                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    activeStep === item.step ? 'bg-blue-600 text-white' : item.gliEnabled ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                    {item.step}
                                                </div>
                                                {item.gliEnabled && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded font-medium">GLI</span>}
                                            </div>
                                            <h4 className="text-xs font-semibold text-slate-700 leading-tight">{item.title}</h4>
                                        </button>
                                    ))}
                                </div>

                                {/* Active Step Detail */}
                                {activeStep && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Step {activeStep}: {tenStepProtocol[activeStep - 1].title}</h4>
                                        <p className="text-sm text-slate-600 mb-4">{tenStepProtocol[activeStep - 1].description}</p>

                                        {tenStepProtocol[activeStep - 1].gliEnabled && tenStepProtocol[activeStep - 1].gliNote && (
                                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                                                <p className="text-xs text-indigo-700 font-medium"><span className="font-bold">BW Intel Integration:</span> {tenStepProtocol[activeStep - 1].gliNote}</p>
                                            </div>
                                        )}

                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Data Requirements:</h5>
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
                            </div>
                        </section>

                        {/* What Happens After Intake */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-t border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">What Happens After You Submit</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                                    Once the ten-step intake is complete, your structured inputs, validated scores, and risk assessments become the raw material for the final stage: turning analysis into action. The system runs every formula, debates every angle, and compiles everything into professional deliverables.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Shield size={16} className="text-blue-600" />
                                            What Gets Validated
                                        </h4>
                                        <ul className="space-y-2 text-xs text-slate-600">
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-0.5" /> Input contradictions (SAT Solver)</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-0.5" /> Financial projections vs benchmarks</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-0.5" /> Risk tolerance vs growth targets</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-0.5" /> Resource allocation vs timeline</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-0.5" /> Ethical compliance gates</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <FileCheck size={16} className="text-emerald-600" />
                                            What Gets Produced
                                        </h4>
                                        <ul className="space-y-2 text-xs text-slate-600">
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" /> Quantified scores with confidence intervals</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" /> Risk matrix with mitigations</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" /> Adversarial debate transcripts</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" /> Board-ready documents</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" /> Professional letter templates</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Letter Templates Button */}
                                <button 
                                    onClick={() => setShowProtocolLetters(true)}
                                    className="mt-6 w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-sm text-sm font-bold hover:from-slate-700 hover:to-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Mail size={16} />
                                    View All 156 Letter Templates
                                </button>
                            </div>
                        </section>

                        {/* Close Button */}
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

            {/* WORKFLOW STAGE DETAIL POPUPS */}
            {activeWorkflowStage && (
                <div className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" onClick={() => setActiveWorkflowStage(null)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 relative" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Stage 1: Structured Intake */}
                        {activeWorkflowStage === 'intake' && (
                            <>
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-lg px-8 py-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-200 uppercase tracking-[0.2em] text-xs font-bold mb-1">STAGE 1</p>
                                        <h3 className="text-xl font-bold text-white">Structured Intake</h3>
                                        <p className="text-blue-200 text-sm mt-1">Define the opportunity in measurable terms</p>
                                    </div>
                                    <button onClick={() => setActiveWorkflowStage(null)} className="text-blue-200 hover:text-white transition-colors p-2"><X size={24} /></button>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        The intake process forces clarity. You cannot submit vague aspirations &mdash; the system requires specific, measurable, verifiable data. This isn&rsquo;t bureaucracy; it&rsquo;s the foundation that makes everything else possible.
                                    </p>
                                    
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-blue-700 mb-3">The 10 Dimensions Captured</h4>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {tenStepProtocol.map((item) => (
                                                <div key={item.step} className="flex items-start gap-3 text-xs text-slate-600 bg-white p-3 rounded border border-blue-100">
                                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">{item.step}</span>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{item.title}</p>
                                                        <p className="text-slate-500 mt-0.5">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-2">Why This Matters</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Every downstream analysis &mdash; the formulas, the debate, the scoring &mdash; depends on the quality of inputs. Garbage in, garbage out. The structured intake ensures the reasoning engine works with complete, well-structured, internally consistent data. The same inputs will always produce the same validated output.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                                    <button onClick={() => setActiveWorkflowStage(null)} className="px-6 py-2 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all">Close</button>
                                </div>
                            </>
                        )}

                        {/* Stage 2: Adversarial Analysis */}
                        {activeWorkflowStage === 'analysis' && (
                            <>
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-amber-800 rounded-t-lg px-8 py-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-200 uppercase tracking-[0.2em] text-xs font-bold mb-1">STAGE 2</p>
                                        <h3 className="text-xl font-bold text-white">Adversarial Analysis</h3>
                                        <p className="text-amber-200 text-sm mt-1">Stress-test with personas and scoring models</p>
                                    </div>
                                    <button onClick={() => setActiveWorkflowStage(null)} className="text-amber-200 hover:text-white transition-colors p-2"><X size={24} /></button>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        Once your inputs are validated, the system attacks them from every angle. This isn&rsquo;t optimistic forecasting &mdash; it&rsquo;s rigorous stress-testing designed to find problems before the market does.
                                    </p>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-amber-700 mb-3">The Adversarial Pipeline</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 bg-white p-3 rounded border border-amber-100">
                                                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">SAT Contradiction Solver</p>
                                                    <p className="text-xs text-slate-600">Converts inputs to propositional logic (CNF) and runs DPLL satisfiability checks. Catches conflicts like &ldquo;low risk + 40% ROI&rdquo; immediately.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-white p-3 rounded border border-amber-100">
                                                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">38+ Formula Engine</p>
                                                    <p className="text-xs text-slate-600">DAG Scheduler executes SPI, RROI, SEAM, and 35+ more formulas across 5 dependency levels. Each produces bounded, auditable scores.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-white p-3 rounded border border-amber-100">
                                                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Five-Persona Bayesian Debate</p>
                                                    <p className="text-xs text-slate-600">Skeptic (1.2x weight), Advocate, Regulator, Accountant, Operator. Each votes proceed/pause/restructure/reject. Beliefs update via Bayesian inference.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 bg-white p-3 rounded border border-amber-100">
                                                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Monte Carlo Stress Testing</p>
                                                    <p className="text-xs text-slate-600">5,000 simulated futures with Markov state transitions. Tests your proposal against economic shocks, policy changes, and market shifts.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-2">The Output</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            A classification (Investment Ready, Conditional, Do Not Proceed) backed by quantified scores, persona reasoning transcripts, and specific findings that support or challenge the proposal. Nothing is smoothed over. Disagreements are preserved.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                                    <button onClick={() => setActiveWorkflowStage(null)} className="px-6 py-2 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all">Close</button>
                                </div>
                            </>
                        )}

                        {/* Stage 3: Institutional Output */}
                        {activeWorkflowStage === 'output' && (
                            <>
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-t-lg px-8 py-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-200 uppercase tracking-[0.2em] text-xs font-bold mb-1">STAGE 3</p>
                                        <h3 className="text-xl font-bold text-white">Institutional Output</h3>
                                        <p className="text-emerald-200 text-sm mt-1">Compile evidence into auditable deliverables</p>
                                    </div>
                                    <button onClick={() => setActiveWorkflowStage(null)} className="text-emerald-200 hover:text-white transition-colors p-2"><X size={24} /></button>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        The final stage transforms validated analysis into professional deliverables. Every document is populated with real data, exact scores, and traceable reasoning &mdash; not AI-generated fluff.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                                            <h4 className="text-lg font-bold text-emerald-700 mb-2">232 Document Types</h4>
                                            <p className="text-xs text-slate-600 mb-3">Across 14 categories:</p>
                                            <ul className="space-y-1.5 text-xs text-slate-600">
                                                <li>&bull; Foundation &amp; Strategic Planning</li>
                                                <li>&bull; Financial Analysis &amp; Modeling</li>
                                                <li>&bull; Risk Assessment &amp; Mitigation</li>
                                                <li>&bull; Government &amp; Policy Compliance</li>
                                                <li>&bull; Partnership &amp; Stakeholder Management</li>
                                                <li>&bull; Governance &amp; Monitoring</li>
                                                <li>&bull; ESG &amp; Sustainability Reporting</li>
                                                <li>&bull; And 7 more categories...</li>
                                            </ul>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                                            <h4 className="text-lg font-bold text-blue-700 mb-2">156 Letter Templates</h4>
                                            <p className="text-xs text-slate-600 mb-3">Professional correspondence for:</p>
                                            <ul className="space-y-1.5 text-xs text-slate-600">
                                                <li>&bull; Investment LOI &amp; EOI</li>
                                                <li>&bull; Government Applications</li>
                                                <li>&bull; Compliance Declarations</li>
                                                <li>&bull; Stakeholder Engagement</li>
                                                <li>&bull; Partnership Proposals</li>
                                                <li>&bull; Trade &amp; Export Documentation</li>
                                                <li>&bull; Crisis Communications</li>
                                                <li>&bull; And 8 more categories...</li>
                                            </ul>
                                            <button 
                                                onClick={() => { setActiveWorkflowStage(null); setShowProtocolLetters(true); }}
                                                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-sm text-xs font-bold hover:bg-blue-500 transition-all"
                                            >
                                                View Full Letter Catalog
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-2">Audit Trail &amp; Provenance</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Every number in every document traces back to a specific formula, a specific input, a specific line of reasoning. The system maintains full provenance so that any stakeholder &mdash; investor, regulator, board member &mdash; can verify exactly how each conclusion was reached.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                                    <button onClick={() => setActiveWorkflowStage(null)} className="px-6 py-2 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all">Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* PROTOCOL LETTER CATALOG POPUP */}
            {showProtocolLetters && (
                <div className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowProtocolLetters(false)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-lg px-8 py-6 flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 uppercase tracking-[0.2em] text-xs font-bold mb-1">FULL LETTER CATALOG</p>
                                <h3 className="text-xl font-bold text-white">156 Professional Letter Templates</h3>
                            </div>
                            <button onClick={() => setShowProtocolLetters(false)} className="text-blue-200 hover:text-white transition-colors p-2"><X size={24} /></button>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Investment Letters */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                                    <TrendingUp size={16} />
                                    Investment Letters (10)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; Letter of Intent (LOI) &mdash; Investment</span>
                                    <span>&bull; Letter of Intent (LOI) &mdash; Partnership</span>
                                    <span>&bull; Investor Update Letter</span>
                                    <span>&bull; Proposal Cover Letter</span>
                                    <span>&bull; Capital Call Notice</span>
                                    <span>&bull; Dividend Declaration</span>
                                    <span>&bull; Investment Commitment Letter</span>
                                    <span>&bull; Co-Investment Invitation</span>
                                    <span>&bull; Fund Launch Announcement</span>
                                    <span>&bull; Portfolio Company Update</span>
                                </div>
                            </div>

                            {/* Government Letters */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
                                    <Building2 size={16} />
                                    Government &amp; Regulatory Letters (18)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; Expression of Interest (EOI) &mdash; Government Project</span>
                                    <span>&bull; Investment Incentive Application</span>
                                    <span>&bull; Regulatory Inquiry Letter</span>
                                    <span>&bull; MoU Proposal Letter</span>
                                    <span>&bull; License Renewal Application</span>
                                    <span>&bull; Permit Application Letter</span>
                                    <span>&bull; Environmental Clearance Request</span>
                                    <span>&bull; Tax Exemption Application</span>
                                    <span>&bull; Customs Facilitation Request</span>
                                    <span>&bull; Special Economic Zone Application</span>
                                    <span>&bull; Grant Application Cover</span>
                                    <span>&bull; Subsidy Request Letter</span>
                                    <span>&bull; PPP Proposal Letter</span>
                                    <span>&bull; Sovereign Guarantee Request</span>
                                    <span>&bull; Bilateral Agreement Proposal</span>
                                    <span>&bull; Trade Mission Request</span>
                                    <span>&bull; Ministerial Introduction Letter</span>
                                    <span>&bull; Policy Submission Cover</span>
                                </div>
                            </div>

                            {/* Compliance Letters */}
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-2">
                                    <Shield size={16} />
                                    Compliance &amp; Legal Letters (12)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; AML/KYC Declaration Letter</span>
                                    <span>&bull; Compliance Assurance Letter</span>
                                    <span>&bull; Beneficial Ownership Declaration</span>
                                    <span>&bull; Sanctions Clearance Confirmation</span>
                                    <span>&bull; PEP Declaration Letter</span>
                                    <span>&bull; Source of Funds Declaration</span>
                                    <span>&bull; Audit Response Letter</span>
                                    <span>&bull; Regulatory Compliance Confirmation</span>
                                    <span>&bull; Data Protection Confirmation (GDPR)</span>
                                    <span>&bull; Anti-Corruption Compliance Letter</span>
                                    <span>&bull; Export Control Declaration</span>
                                    <span>&bull; Conflict of Interest Disclosure</span>
                                </div>
                            </div>

                            {/* Stakeholder Letters */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                                    <Users size={16} />
                                    Stakeholder &amp; Community Letters (10)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; Community Notification Letter</span>
                                    <span>&bull; Stakeholder Engagement Letter</span>
                                    <span>&bull; Public Consultation Invitation</span>
                                    <span>&bull; Impact Assessment Notification</span>
                                    <span>&bull; Community Benefit Agreement Proposal</span>
                                    <span>&bull; Local Content Commitment Letter</span>
                                    <span>&bull; Indigenous Rights Consultation</span>
                                    <span>&bull; Resettlement Notification</span>
                                    <span>&bull; Grievance Mechanism Introduction</span>
                                    <span>&bull; Employment Opportunity Announcement</span>
                                </div>
                            </div>

                            {/* Trade Letters */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                                    <Globe size={16} />
                                    Trade &amp; International Letters (14)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; Trade Inquiry Letter</span>
                                    <span>&bull; Customs/Trade Facilitation Letter</span>
                                    <span>&bull; DFI Concept Note Cover</span>
                                    <span>&bull; UN Agency Submission Letter</span>
                                    <span>&bull; Export Declaration Letter</span>
                                    <span>&bull; Import License Request</span>
                                    <span>&bull; Certificate of Origin Request</span>
                                    <span>&bull; Trade Credit Application</span>
                                    <span>&bull; Letter of Credit Request</span>
                                    <span>&bull; Shipping Instruction Letter</span>
                                    <span>&bull; Consignment Agreement Cover</span>
                                    <span>&bull; Distribution Agreement Proposal</span>
                                    <span>&bull; Agency Agreement Proposal</span>
                                    <span>&bull; Franchise Opportunity Letter</span>
                                </div>
                            </div>

                            {/* Partnership Letters */}
                            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                <h5 className="text-sm font-bold text-cyan-700 mb-3 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    Partnership &amp; Negotiation Letters (12)
                                </h5>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span>&bull; Partnership Introduction</span>
                                    <span>&bull; JV Invitation Letter</span>
                                    <span>&bull; Consortium Formation Letter</span>
                                    <span>&bull; Teaming Agreement Proposal</span>
                                    <span>&bull; Co-Development Invitation</span>
                                    <span>&bull; Technology Transfer Proposal</span>
                                    <span>&bull; Capacity Building Proposal</span>
                                    <span>&bull; Price Negotiation Letter</span>
                                    <span>&bull; Term Renegotiation Request</span>
                                    <span>&bull; Contract Extension Request</span>
                                    <span>&bull; Performance Improvement Notice</span>
                                    <span>&bull; Partnership Termination Notice</span>
                                </div>
                            </div>

                            {/* Operations & Crisis Letters */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <Zap size={16} />
                                        Operations &amp; Procurement (12)
                                    </h5>
                                    <div className="space-y-1.5 text-xs text-slate-600">
                                        <span className="block">&bull; Vendor Onboarding Letter</span>
                                        <span className="block">&bull; Supplier Qualification Request</span>
                                        <span className="block">&bull; RFP/RFQ Cover Letter</span>
                                        <span className="block">&bull; Bid Submission Cover</span>
                                        <span className="block">&bull; Contract Award Notification</span>
                                        <span className="block">&bull; Purchase Order Confirmation</span>
                                        <span className="block">&bull; Delivery Schedule Confirmation</span>
                                        <span className="block">&bull; Quality Assurance Letter</span>
                                        <span className="block">&bull; Warranty Claim Letter</span>
                                        <span className="block">&bull; Payment Release Request</span>
                                        <span className="block">&bull; Force Majeure Notification</span>
                                        <span className="block">&bull; Contract Variation Request</span>
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h5 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                                        <Scale size={16} />
                                        Crisis &amp; Communications (10)
                                    </h5>
                                    <div className="space-y-1.5 text-xs text-slate-600">
                                        <span className="block">&bull; Crisis Statement Letter</span>
                                        <span className="block">&bull; Incident Notification</span>
                                        <span className="block">&bull; Media Response Letter</span>
                                        <span className="block">&bull; Stakeholder Reassurance Letter</span>
                                        <span className="block">&bull; Regulatory Incident Report</span>
                                        <span className="block">&bull; Insurance Claim Letter</span>
                                        <span className="block">&bull; Legal Notice Response</span>
                                        <span className="block">&bull; Dispute Resolution Proposal</span>
                                        <span className="block">&bull; Settlement Offer Letter</span>
                                        <span className="block">&bull; Apology/Remediation Letter</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-5">
                                <p className="text-sm text-white">
                                    <strong>156 templates</strong> covering every stage of global deal-making &mdash; from initial outreach to crisis management. Each template includes tone guidance, required structure, and key elements tailored to the specific audience and purpose.
                                </p>
                            </div>
                        </div>
                        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                            <button onClick={() => setShowProtocolLetters(false)} className="px-6 py-2 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================== */}
            {/* UNIFIED SYSTEM OVERVIEW  -  Combined Protocol, Documents, Letters  */}
            {/* ================================================================== */}
            {showUnifiedSystemOverview && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowUnifiedSystemOverview(false)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onClick={(e) => e.stopPropagation()}>
                        {/* Sticky Header - matches Technical Breakdown */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg px-8 py-6 flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 uppercase tracking-[0.2em] text-sm font-bold mb-1">COMPLETE SYSTEM OVERVIEW</p>
                                <h3 className="text-2xl font-bold text-white">How It Works &amp; What You Get</h3>
                            </div>
                            <button onClick={() => setShowUnifiedSystemOverview(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tab Navigation - simplified */}
                        <div className="border-b border-slate-200 px-8 bg-slate-50">
                            <div className="flex flex-wrap">
                                <button 
                                    onClick={() => setUnifiedActiveTab('protocol')}
                                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${unifiedActiveTab === 'protocol' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    10-Step Protocol
                                </button>
                                <button 
                                    onClick={() => setUnifiedActiveTab('documents')}
                                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${unifiedActiveTab === 'documents' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    232 Document Types
                                </button>
                                <button 
                                    onClick={() => setUnifiedActiveTab('letters')}
                                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${unifiedActiveTab === 'letters' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    156 Letter Templates
                                </button>
                                <button 
                                    onClick={() => setUnifiedActiveTab('proof')}
                                    className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${unifiedActiveTab === 'proof' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    See Proof
                                </button>
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="p-6 md:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">

                            {/* Introduction - always visible */}
                            <p>This page explains exactly how the system works &mdash; from the moment you start entering data to the final board-ready documents it produces. Three stages: <strong>Structured Intake</strong> (the Ten-Step Protocol that captures your opportunity in measurable terms), <strong>Adversarial Analysis</strong> (38+ formulas, 5 personas debating every angle, Monte Carlo simulation), and <strong>Institutional Output</strong> (232 document types and 156 letter templates, all populated with your actual scores and reasoning).</p>

                            {/* TAB CONTENT: Protocol */}
                            {unifiedActiveTab === 'protocol' && (
                                <>
                                    <h4 className="text-lg font-bold text-slate-900 pt-2">Stage 1 &mdash; The Ten-Step Protocol</h4>
                                    <p>Most users complete this in 30-45 minutes. Each step captures a critical dimension of your opportunity. By the end, you have clear scope, quantified assumptions, full risk visibility, and a consistent dataset the reasoning engine can trust.</p>

                                    <div className="border-l-2 border-slate-300 pl-4 space-y-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 1: Opportunity Definition</p>
                                            <p className="text-slate-600">Project name, type, sector, target region, investment scale, timeline. The foundation everything else builds on.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 2: Strategic Alignment</p>
                                            <p className="text-slate-600">Alignment with national/regional policy, SDG mapping, government priority status, bilateral agreements.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 3: Market Analysis</p>
                                            <p className="text-slate-600">Demand drivers, supply gaps, competitive landscape, pricing dynamics, growth trajectory.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 4: Financial Structure</p>
                                            <p className="text-slate-600">CAPEX, OPEX, revenue model, funding mix, IRR targets, payback expectations, currency exposure.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 5: Risk Assessment</p>
                                            <p className="text-slate-600">Political, regulatory, operational, financial, environmental, social risks with probability and impact.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 6: Stakeholder Mapping</p>
                                            <p className="text-slate-600">Government bodies, investors, partners, communities, regulators &mdash; influence, interest, engagement strategy.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 7: Implementation Pathway</p>
                                            <p className="text-slate-600">Phasing, milestones, dependencies, critical path, resource requirements, decision gates.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 8: Compliance Requirements</p>
                                            <p className="text-slate-600">Permits, licenses, environmental approvals, sector-specific regulations, international standards.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 9: Partnership Terms</p>
                                            <p className="text-slate-600">Equity split, governance structure, decision rights, exit mechanisms, IP ownership, non-compete clauses.</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Step 10: Success Metrics</p>
                                            <p className="text-slate-600">KPIs, monitoring framework, reporting requirements, adjustment triggers, exit criteria.</p>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-slate-900 pt-4">Stage 2 &mdash; Adversarial Analysis</h4>
                                    <p>Once intake is complete, the system stress-tests every claim. A SAT Contradiction Solver checks for logical inconsistencies. Five adversarial personas &mdash; Skeptic, Advocate, Regulator, Accountant, Operator &mdash; debate the opportunity using Bayesian inference. 38+ proprietary formulas calculate risk-adjusted returns, stakeholder alignment, and strategic positioning. Monte Carlo simulation runs 5,000 scenarios to show you the real distribution of outcomes, not just the optimistic case.</p>

                                    <h4 className="text-lg font-bold text-slate-900 pt-4">Stage 3 &mdash; Institutional Output</h4>
                                    <p>Every score, every debate conclusion, every simulation result flows into document generation. 232 document types across 14 categories. 156 letter templates for every stage of deal-making. All populated with your actual data, exact scores, and traceable reasoning &mdash; not AI-generated placeholder text.</p>
                                </>
                            )}

                            {/* TAB CONTENT: Documents */}
                            {unifiedActiveTab === 'documents' && (
                                <>
                                    <h4 className="text-lg font-bold text-slate-900 pt-2">232 Document Types Across 14 Categories</h4>
                                    <p>Every document is populated with real data, exact scores, and traceable reasoning. Flexible page lengths from 1-page brief to 100-page full package.</p>

                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">1. Foundation &amp; Strategic (18)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Regional Profile</li>
                                                <li>&bull; Strategic Mandate</li>
                                                <li>&bull; SWOT Analysis</li>
                                                <li>&bull; Investment Prospectus</li>
                                                <li>&bull; Market Positioning</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">2. Financial Analysis (22)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Financial Model</li>
                                                <li>&bull; Investment Brief</li>
                                                <li>&bull; Pro Forma</li>
                                                <li>&bull; Cash Flow</li>
                                                <li>&bull; Valuation</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">3. Risk Assessment (15)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Risk Assessment</li>
                                                <li>&bull; Mitigation Plan</li>
                                                <li>&bull; Due Diligence Report</li>
                                                <li>&bull; Scenario Analysis</li>
                                                <li>&bull; Sensitivity Analysis</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">4. Government &amp; Policy (17)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Policy Brief</li>
                                                <li>&bull; Incentive Application</li>
                                                <li>&bull; Government Submission</li>
                                                <li>&bull; MOU Draft</li>
                                                <li>&bull; Bilateral Proposal</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">5. Partnership (16)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Partnership Assessment</li>
                                                <li>&bull; LOI</li>
                                                <li>&bull; JV Agreement</li>
                                                <li>&bull; Stakeholder Map</li>
                                                <li>&bull; Partner Profile</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">6. Execution (21)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Project Plan</li>
                                                <li>&bull; Implementation Roadmap</li>
                                                <li>&bull; Milestone Report</li>
                                                <li>&bull; Change Management</li>
                                                <li>&bull; Transition Plan</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">7. Governance &amp; Board (12)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Board Charter</li>
                                                <li>&bull; Steering Committee Report</li>
                                                <li>&bull; Annual Report</li>
                                                <li>&bull; Quarterly Report</li>
                                                <li>&bull; Decision Matrix</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">8. Human Capital (12)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Org Chart</li>
                                                <li>&bull; Talent Gap Analysis</li>
                                                <li>&bull; Capability Assessment</li>
                                                <li>&bull; HR Due Diligence</li>
                                                <li>&bull; Succession Planning</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">9. Procurement &amp; Supply (13)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Procurement Strategy</li>
                                                <li>&bull; Vendor Scorecard</li>
                                                <li>&bull; Supply Chain Mapping</li>
                                                <li>&bull; Tender Document</li>
                                                <li>&bull; Bid Matrix</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">10. ESG &amp; Social Impact (19)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; ESG Report</li>
                                                <li>&bull; Sustainability Report</li>
                                                <li>&bull; Carbon Assessment</li>
                                                <li>&bull; Environmental Impact</li>
                                                <li>&bull; Social Impact</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">11. Regulatory &amp; Compliance (16)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Permit Application</li>
                                                <li>&bull; Compliance Certificate</li>
                                                <li>&bull; Regulatory Filing</li>
                                                <li>&bull; GDPR Policy</li>
                                                <li>&bull; Sanctions Clearance</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">12. Communications &amp; IR (17)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Press Release</li>
                                                <li>&bull; Media Kit</li>
                                                <li>&bull; Investor Presentation</li>
                                                <li>&bull; Crisis Plan</li>
                                                <li>&bull; Case Study</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">13. Asset &amp; Infrastructure (17)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; Site Selection</li>
                                                <li>&bull; Technical Brief</li>
                                                <li>&bull; Infrastructure Assessment</li>
                                                <li>&bull; Grid Study</li>
                                                <li>&bull; PPA</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-1">14. Legal &amp; Agreements (17)</h5>
                                            <ul className="space-y-0.5 text-sm text-slate-600">
                                                <li>&bull; NDA</li>
                                                <li>&bull; LOI</li>
                                                <li>&bull; MOU</li>
                                                <li>&bull; Term Sheet</li>
                                                <li>&bull; Shareholder Agreement</li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAB CONTENT: Letters */}
                            {unifiedActiveTab === 'letters' && (
                                <>
                                    <h4 className="text-lg font-bold text-slate-900 pt-2">156 Letter Templates</h4>
                                    <p>Every stage of deal-making requires specific correspondence. These templates are populated with your project data, compliance status, and relevant scores.</p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Investment Letters (10)</h5>
                                            <p className="text-sm text-slate-600">LOI, Investor Update, Proposal Cover, Capital Call, Dividend Declaration, Investment Commitment, Co-Investment Invitation, Fund Launch, Portfolio Update, Exit Notification</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Government &amp; Regulatory (18)</h5>
                                            <p className="text-sm text-slate-600">EOI, Incentive Application, Regulatory Inquiry, MOU Proposal, Permit Application, Tax Exemption, Grant Application, PPP Proposal, Trade Mission Request, Embassy Introduction</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Compliance &amp; Legal (12)</h5>
                                            <p className="text-sm text-slate-600">AML/KYC Declaration, Beneficial Ownership, Sanctions Clearance, PEP Declaration, Source of Funds, Audit Response, GDPR Confirmation, Anti-Corruption Certification</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Stakeholder &amp; Community (10)</h5>
                                            <p className="text-sm text-slate-600">Community Notification, Stakeholder Engagement, Public Consultation, Impact Assessment, Community Benefit Agreement, Local Content Commitment</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Trade &amp; International (14)</h5>
                                            <p className="text-sm text-slate-600">Trade Inquiry, Customs Facilitation, DFI Concept Note, Export Declaration, Import License, Letter of Credit, Shipping Instructions, Distribution Proposal</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Partnership &amp; Negotiation (12)</h5>
                                            <p className="text-sm text-slate-600">Partnership Introduction, JV Invitation, Consortium Formation, Technology Transfer, Price Negotiation, Term Renegotiation, Contract Extension</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Operations &amp; Procurement (12)</h5>
                                            <p className="text-sm text-slate-600">Vendor Onboarding, Supplier Qualification, RFP Cover, Contract Award, Purchase Order, Delivery Confirmation, Quality Assurance, Warranty Claim</p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900 mb-2">Crisis &amp; Communications (10)</h5>
                                            <p className="text-sm text-slate-600">Crisis Statement, Incident Notification, Media Response, Stakeholder Reassurance, Insurance Claim, Legal Notice Response, Settlement Offer</p>
                                        </div>
                                    </div>

                                    <p className="pt-4">Each template includes tone guidance, required structure, and key elements tailored to the specific audience and purpose. All automatically populated with your project specifics.</p>
                                </>
                            )}

                            {/* TAB CONTENT: Proof */}
                            {unifiedActiveTab === 'proof' && (
                                <>
                                    <h4 className="text-lg font-bold text-slate-900 pt-2">See the System in Action</h4>
                                    <p>Words are cheap. The best way to understand what this system produces is to see an actual report it generated &mdash; not a mockup, not a template, but the real output from a real submission.</p>

                                    <h4 className="text-lg font-bold text-slate-900 pt-4">Real Example: Northland Regional Council</h4>
                                    <p>A regional council in New Zealand submitted a 5MW solar partnership proposal through the Ten-Step Protocol. The system ran the full pipeline &mdash; SAT validation, formula scoring, adversarial debate, Monte Carlo simulation &mdash; and produced a complete assessment package.</p>

                                    <div className="border-l-2 border-slate-300 pl-4 mt-4 space-y-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">Initial Assessment: DO NOT PROCEED</p>
                                            <p className="text-slate-600">SPI: 34% | RROI: 38/100</p>
                                            <p className="text-slate-600">Issues identified: Missing grid study, revenue projection 2.8x above benchmark</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">After Correction: INVESTMENT READY</p>
                                            <p className="text-slate-600">SPI: 78% | RROI: 74/100</p>
                                            <p className="text-slate-600">Council fixed both issues, system re-ran full analysis</p>
                                        </div>
                                    </div>

                                    <p className="pt-4">The system caught two critical errors that would have doomed the partnership. After correction, the council had a defensible investment case with full documentation.</p>

                                    <button 
                                        onClick={() => { setShowUnifiedSystemOverview(false); setShowProofPopup(true); }}
                                        className="mt-4 w-full py-3 bg-slate-900 text-white rounded text-sm font-semibold hover:bg-slate-800 transition-colors"
                                    >
                                        See the Full Report &mdash; Every Score, Every Debate, Every Output
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                            <button onClick={() => setShowUnifiedSystemOverview(false)} className="px-6 py-2 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 2  -  Read More Popup */}
            {showBlock2More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock2More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                What sparked this: 12 months that changed everything.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                It started with a frustration. I was watching regions with real potential  -  talent, resources, strategic location  -  get passed over because no tool existed to objectively prove their case. Investment decisions were being made on gut feel, biased reports, or whoever had the best pitch deck. I knew there had to be a better way. So I started building.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                The first thing I created was the formula engine  -  38+ proprietary formulas like SPI (Strategic Positioning Index), RROI (Risk-Adjusted Return on Investment), and SEAM (Strategic Ethical Alignment Matrix). Each one designed to quantify a dimension of investment intelligence that previously relied on subjective judgement. I built the <strong>DAG Scheduler</strong> to execute them in parallel across 5 dependency levels, so no formula runs before its inputs are ready. That was the foundation.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Then I built the validation layer  -  a <strong>SAT Contradiction Solver</strong> that converts inputs into propositional logic and catches contradictions before anything else runs. If your assumptions conflict, the system tells you immediately. No more garbage-in-garbage-out.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Next came the debate engine. I wanted the system to argue with itself  -  to stress-test every recommendation before it reached the user. So I built the <strong>Bayesian Debate Engine</strong> with 5 adversarial personas: the Skeptic hunts for deal-killers, the Advocate finds upside, the Regulator checks legality, the Accountant validates cash flow, and the Operator tests execution. Beliefs update via Bayesian inference. Disagreements are preserved, not smoothed over.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Then I added autonomous intelligence  -  8 engines that think beyond the question. And reflexive intelligence  -  7 engines that analyse how <em>you</em> think. Layer by layer, month by month, the system grew. I called the orchestration engine the <strong>NSIL  -  the Nexus Strategic Intelligence Layer</strong>  -  a 10-layer pipeline I invented from scratch to make all of this run deterministically.
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

            {/* Block 3  -  Read More Popup */}
            {showBlock3More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock3More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                Then I discovered something that changed the system forever.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                By this point, I had a working intelligence system  -  formulas, validation, debate, autonomous engines, reflexive analysis, all running through the NSIL pipeline. It was already producing results no other platform could match. But something was missing. The outputs were technically correct, but they lacked the instinct of a seasoned human expert  -  the ability to sense that a deal feels wrong even when the numbers look right, or to know which risk deserves attention when ten are competing for it.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                That's when I found computational neuroscience  -  real mathematical models of how the human brain makes decisions under pressure. Models from published university research that had been sitting in academic papers for decades, never implemented in a practical system. I realised they could slot directly into the architecture I'd already built. The NSIL was designed to be extensible. So I added them.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                I wrote the <strong>Human Cognition Engine</strong>  -  1,307 lines of code implementing 7 neuroscience models as faithful mathematical implementations. Not simplified approximations. The real models, running live inside the NSIL pipeline. This is what turned a powerful analytics system into something genuinely new  -  the first platform that doesn't just calculate answers, but thinks about them the way a human expert would.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-2 mb-3">
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Wilson-Cowan Neural Fields</strong>  -  Your brain has billions of neurons, some saying "go" (excitatory) and some saying "stop" (inhibitory). These differential equations (du/dt = -u + integral w(r-r').f(v) dr') model that battle on a 50 - 50 grid, simulating how experts balance competing factors like profit vs. risk. The NSIL runs this live with your data.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Predictive Processing (Rao &amp; Ballard)</strong>  -  Our brains don't just react; they predict. Bayesian inference across 3 hierarchical levels anticipates what comes next  -  like forecasting market shifts from historical precedent. Learning rate 0.1, with prediction error minimisation at every level.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Friston's Free Energy Principle</strong>  -  The brain minimises "surprise" by constantly updating beliefs. Variational inference across 8 candidate policies (gamma=0.95) simulates how we adapt when new information arrives  -  revising plans without hallucinating.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Attention Allocation (Itti &amp; Koch)</strong>  -  Why do you notice one risk and miss another? Salience maps with winner-take-all competition and inhibition of return (0.7) model how the brain spots what matters in a sea of data.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Emotional Valence</strong>  -  Prospect theory shows the pain of losing GBP100 hurts more than the joy of gaining GBP100. This assigns emotional weight to every option, flagging deals that look good on paper but feel wrong.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Global Workspace Theory</strong>  -  Think of your brain as an office where every department shares information through one central workspace. Coalition formation with ignition threshold 0.6 ensures all layers integrate into coherent insights.
                                </p>
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <strong className="text-slate-900">Working Memory (Baddeley's Model)</strong>  -  Human short-term memory is limited. Phonological decay 0.05, visual decay 0.03, rehearsal benefit 0.2  -  this focuses outputs on the 3"5 factors that actually matter.
                                </p>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                No other platform  -  not Palantir, not Bloomberg Terminal, not McKinsey's analytics  -  implements any of these models. BWGA Ai implements all seven. And they work because the NSIL was built to accommodate exactly this kind of extension  -  I just didn't know these models existed when I designed it. They fit perfectly into what I'd already created.
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                That's what makes this a world first. Not just the neuroscience. Not just the formulas. Not just the debate engine or the autonomous engines. It's the fact that one person built an architecture flexible enough to unify all of them  -  and then discovered the missing piece that made it complete.
                            </p>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end">
                            <button onClick={() => setShowBlock3More(false)} className="px-6 py-2 bg-slate-800 text-white rounded-sm text-sm font-semibold hover:bg-slate-900 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block 4  -  Read More Popup */}
            {showBlock4More && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock4More(false)}>
                    <div className="bg-white rounded-sm max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                It doesn't just answer. It thinks beyond your question  -  and analyses how you think.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                I created 8 autonomous engines that actively discover insights you never asked for. Creative Synthesis uses bisociation theory to find strategies from unrelated domains. Ethical Reasoning enforces Rawlsian fairness gates  -  if a path is unethical, it's rejected, no matter how profitable. Self-Evolving Algorithms tune their own formula weights using gradient descent with rollback. Scenario Simulation runs 5,000 Monte Carlo futures with causal feedback loops.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                Then 7 reflexive engines analyse <em>you</em>. User Signal Decoder uses Shannon's information theory to detect what you repeat (what matters) and what you avoid (where anxiety lives). Regional Mirroring finds your structural twin region worldwide. Latent Advantage Miner surfaces assets you mentioned casually that have real strategic significance. Every finding is then translated for 5 distinct audiences  -  investors, government, community, partners, executives  -  in their own language.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-indigo-800">Autonomous Intelligence  -  8 Engines</p>
                                    <p className="text-xs text-indigo-600">CRE, CDT, AGL, ETH, EVO, ADA, EMO, SIM  -  creative synthesis, cross-domain transfer, ethical gates, adaptive learning, Monte Carlo simulation.</p>
                                </div>
                                <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-sm p-3">
                                    <p className="text-xs font-bold text-sky-800">Reflexive Intelligence  -  7 Engines</p>
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

            {/* Block 5  -  What You Get & How It Works Popup Modal */}
            {showBlock5Popup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowBlock5Popup(false)}>
                    <div className="bg-white rounded-sm max-w-4xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                        {/* WHAT YOU GET section  -  styled like landing page */}
                        <section className="py-12 px-6 md:px-8 bg-slate-100 rounded-t-sm">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">WHAT YOU GET</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">So What Comes Out the Other End?</h2>
                                
                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    The output isn't "AI text." The output is a complete decision package: the structured case, the quantified scores, the key risks and mitigations, the stakeholder narrative, and the supporting material required to move from idea  partner conversation  formal submission.
                                </p>

                                {/* Watch it happen live */}
                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                        You can watch it all happen, live.
                                    </h3>
                                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                        While the system builds your case, you can watch every step in real time. You'll see the five expert personas debating your proposal, the scoring formulas running one by one, the risk models stress-testing your assumptions, and the final strategy assembling itself section by section. Nothing is hidden. Every score, every conclusion, every piece of evidence is visible and traceable.
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        This isn't a black box  -  it's a glass box. The same inputs will always produce the same validated output. That's the whole point: if you can't see how it reached its answer, why would you trust it?
                                    </p>
                                </div>

                                {/* Reassurance message */}
                                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-sm p-6 mb-6">
                                    <p className="text-base text-white leading-relaxed font-medium">
                                        The good news? You don't need to understand how any of this works under the hood. You just need to know it's there  -  working for you, 24/7  -  producing rigorous, defensible, repeatable output every single time. Here's what that actually looks like.
                                    </p>
                                </div>

                                <button 
                                    onClick={() => { setShowBlock5Popup(false); setShowOutputDetails(true); }}
                                    className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Info size={16} />
                                    More Details  -  Full Document Catalog &amp; Audit Trail
                                </button>
                            </div>
                        </section>

                        {/* Photo Banner  -  Strategic Planning */}
                        <div className="w-full h-40 md:h-52 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=400&fit=crop&q=80" alt="Strategic planning session" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-slate-900/10" />
                        </div>

                        {/* THE TEN-STEP PROTOCOL  -  styled like landing page */}
                        <section className="py-12 px-6 md:px-8 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-3 font-bold">HOW YOU FEED THE BRAIN</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">The Ten-Step Protocol</h2>
                                <p className="text-base text-blue-600 mb-4 flex items-center gap-2 font-medium">
                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Most users complete this in 30-45 minutes
                                </p>

                                <p className="text-base text-slate-700 leading-relaxed mb-6">
                                    Most projects fail not from lack of potential, but from incomplete preparation. The Ten-Step Protocol is the antidote  -  a structured process that transforms a rough idea into a complete, decision-ready input set. Each step captures a critical dimension of your opportunity: identity, strategy, market context, partnerships, financials, risks, resources, execution, governance, and final readiness.
                                </p>

                                <button 
                                    onClick={() => { setShowBlock5Popup(false); setUnifiedActiveTab('protocol'); setShowUnifiedSystemOverview(true); }}
                                    className="w-full py-3 bg-blue-600 text-white border border-blue-700 rounded-sm text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Info size={16} />
                                    More Details  -  View All 10 Steps &amp; Data Requirements
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


            {/* Proof of Capability  -  Full Report Popup Modal */}
            {showProofPopup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowProofPopup(false)}>
                    <div className="bg-white rounded-sm max-w-4xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                        {/* --- INTRODUCTION --- */}
                        <section className="py-12 px-6 md:px-8 bg-slate-100 rounded-t-sm">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-2 font-bold">PROOF OF CAPABILITY</p>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3">A Real Report From a Real Project</h2>
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    A regional council in New Zealand wanted to know: <strong>&ldquo;Should we partner with Vestas to build a 5MW solar installation?&rdquo;</strong> They submitted their project through the system, and what you&rsquo;re about to see is the complete answer &mdash; including the verdict, the reasoning, the risks identified, and exactly what they should do next.
                                </p>
                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">What you&rsquo;ll see in this report:</strong></p>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>&bull; <strong>The Question:</strong> Is this partnership viable?</li>
                                        <li>&bull; <strong>The Analysis:</strong> How the system tested and scored the proposal</li>
                                        <li>&bull; <strong>The Problems Found:</strong> Two critical issues that would have killed the deal</li>
                                        <li>&bull; <strong>The Fix:</strong> How they corrected those issues</li>
                                        <li>&bull; <strong>The Final Verdict:</strong> A clear YES/NO recommendation with reasoning</li>
                                        <li>&bull; <strong>The Next Steps:</strong> Exactly what to do now and how to proceed</li>
                                        <li>&bull; <strong>The Documents:</strong> All the paperwork generated automatically</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* --- HOW THE SYSTEM WROTE THIS --- */}
                        <section className="py-10 px-6 md:px-8 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-blue-600 uppercase tracking-[0.2em] text-sm mb-2 font-bold">HOW THIS REPORT WAS BUILT</p>
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">Every Number Has a Source. Every Conclusion Has a Trail.</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                                    The system didn&rsquo;t generate this report the way a chatbot generates text. It ran a structured analytical pipeline &mdash; the same one that runs for every user &mdash; where each layer feeds the next and nothing moves forward until it&rsquo;s been validated. Here&rsquo;s exactly how it happened:
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">The Council Submitted Their Data</p>
                                            <p className="text-sm text-slate-600">Northland Regional Council completed the Ten-Step Protocol &mdash; identity, strategic intent, market context, partners, financials, risk tolerance, resources, execution plan, governance, and final readiness. This structured submission became the raw input for every engine.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">The System Checked for Contradictions</p>
                                            <p className="text-sm text-slate-600">The SAT Contradiction Solver converted every input into propositional logic and tested for conflicts. It immediately flagged that the council&rsquo;s Year 1 revenue projection of $4.2M contradicted regional benchmarks for a 5MW solar installation by a factor of 2.8&times;. It also detected a missing grid connection feasibility study &mdash; a dependency required by two downstream formulas.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">38+ Formulas Ran Against the Validated Inputs</p>
                                            <p className="text-sm text-slate-600">The DAG Scheduler executed all formulas across 5 dependency levels. SPI (Strategic Positioning Index) scored the proposal at 34%. RROI computed a risk-adjusted return of 38/100. SCF Impact calculated $680K. Activation timeline modelled at 24 months P50. Every formula drew from the council&rsquo;s own submission and the system&rsquo;s built-in regional benchmarks.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">Five Expert Personas Debated the Proposal</p>
                                            <p className="text-sm text-slate-600">The Bayesian Debate Engine ran an adversarial debate between five personas &mdash; the Skeptic, the Advocate, the Regulator, the Accountant, and the Operator. The Skeptic and Regulator both voted to block, citing the missing feasibility study and inflated revenue as disqualifying risks. Beliefs updated via Bayesian inference. The system classified the project as &ldquo;Do Not Proceed.&rdquo;</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">The Council Fixed the Issues and Resubmitted</p>
                                            <p className="text-sm text-slate-600">Northland uploaded a utility interconnection agreement and revised Year 1 revenue from $4.2M to $1.4M. The system re-ran every formula, re-debated with all five personas, and re-scored the entire proposal. SPI jumped to 78%. RROI rose to 74/100. Classification upgraded to &ldquo;Investment Ready.&rdquo;</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                                        <div>
                                            <p className="text-sm text-slate-800 font-semibold mb-1">The Report Was Assembled Automatically</p>
                                            <p className="text-sm text-slate-600">The Output Synthesis layer compiled every score, every debate transcript, every risk flag, and every formula derivation into the structured document you see below. The Cognition Layer added expert-level contextual judgement. The Monte Carlo engine stress-tested the proposal across 5,000 futures. Nothing was invented. Every conclusion traces to a specific formula, a specific engine, and a specific line of code.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-5 rounded-r-sm">
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        <strong className="text-slate-900">Where the information came from:</strong> All data sourced from (1) the council&rsquo;s own Ten-Step intake submission, (2) the system&rsquo;s built-in regional benchmarks covering 150+ countries, (3) policy and regulatory databases embedded in the Knowledge Layer, and (4) historical investment performance patterns spanning 25&ndash;63 years of documented methodology. No external API calls. No web scraping. No hallucination.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* --- DIVIDER --- */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6 px-6 md:px-8">
                            <div className="max-w-4xl mx-auto text-center">
                                <p className="text-white/80 uppercase tracking-[0.2em] text-xs font-bold mb-1">BELOW IS THE ACTUAL SYSTEM OUTPUT</p>
                                <p className="text-white text-lg font-light">Northland Regional Council &mdash; 5MW Solar PV Partnership Assessment</p>
                            </div>
                        </div>

                        {/* Report Header */}
                        <section className="py-10 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-xs">BW</div>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">BWGA Ai &mdash; Live Report</span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-slate-900">Strategic Partnership Viability Assessment</h2>
                                        <p className="text-sm text-slate-500 mt-1">Northland Regional Council &times; Vestas Energy Solutions</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-600 font-bold uppercase">Live Test</div>
                                        <p className="text-xs text-slate-400 mt-1">Not a simulation</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Entity</p>
                                        <p className="text-sm font-semibold text-slate-900">Regional Council</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sector</p>
                                        <p className="text-sm font-semibold text-slate-900">Renewable Energy</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Project</p>
                                        <p className="text-sm font-semibold text-slate-900">5MW Solar PV</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Location</p>
                                        <p className="text-sm font-semibold text-slate-900">Northland, NZ</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Executive Summary */}
                        <section className="py-8 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Executive Summary</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    Northland Regional Council proposed a 5MW solar photovoltaic partnership with Vestas Energy Solutions to serve the Northland region&rsquo;s growing renewable energy needs. The proposal was submitted through the Ten-Step Intake Protocol and processed by the full NSIL engine. On initial assessment, the system classified the project as <strong className="text-red-600">&ldquo;Do Not Proceed&rdquo;</strong> due to two critical deficiencies: a missing grid connection feasibility study and revenue projections 2.8&times; above the established regional benchmark for installations of this scale.
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    After the council uploaded the required utility interconnection agreement and revised Year 1 revenue from $4.2M to $1.4M, the system re-ran every formula, re-convened the adversarial debate, and re-scored the proposal. The classification was upgraded to <strong className="text-blue-600">&ldquo;Investment Ready&rdquo;</strong> with a Strategic Positioning Index of 78% (Grade B).
                                </p>
                            </div>
                        </section>

                        {/* Scoring Comparison */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Quantitative Scoring &mdash; NSIL Formula Engine Output</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white border-2 border-red-200 rounded-sm p-5">
                                        <p className="text-xs text-red-600 uppercase tracking-wider font-bold mb-3">Run 1 &mdash; Initial Assessment</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Strategic Positioning Index (SPI)</span>
                                                <span className="text-sm text-red-600 font-bold">34% &mdash; Grade D</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Risk-Adjusted ROI (RROI)</span>
                                                <span className="text-sm text-red-600 font-bold">38/100</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Activation Timeline (IVAS)</span>
                                                <span className="text-sm text-red-600 font-bold">24 months P50</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Strategic Cash Flow Impact (SCF)</span>
                                                <span className="text-sm text-red-600 font-bold">$680K</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5">
                                                <span className="text-sm text-slate-600 font-semibold">Classification</span>
                                                <span className="text-sm text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">DO NOT PROCEED</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white border-2 border-blue-200 rounded-sm p-5">
                                        <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-3">Run 2 &mdash; After Corrections</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Strategic Positioning Index (SPI)</span>
                                                <span className="text-sm text-blue-600 font-bold">78% &mdash; Grade B</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Risk-Adjusted ROI (RROI)</span>
                                                <span className="text-sm text-blue-600 font-bold">74/100</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Activation Timeline (IVAS)</span>
                                                <span className="text-sm text-blue-600 font-bold">9 months P50</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                                <span className="text-sm text-slate-600">Strategic Cash Flow Impact (SCF)</span>
                                                <span className="text-sm text-blue-600 font-bold">$1.42M</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5">
                                                <span className="text-sm text-slate-600 font-semibold">Classification</span>
                                                <span className="text-sm text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">INVESTMENT READY</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Issues & Corrections */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-red-50 border border-red-200 rounded-sm p-4">
                                        <p className="text-xs text-red-600 uppercase tracking-wider font-bold mb-2">Issues Flagged by RFI Engine</p>
                                        <ul className="space-y-1.5 text-sm text-slate-700">
                                            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">&bull;</span> Missing grid connection feasibility study</li>
                                            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">&bull;</span> Revenue projections 2.8&times; above regional benchmark</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                                        <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-2">Corrections Applied</p>
                                        <ul className="space-y-1.5 text-sm text-slate-700">
                                            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&bull;</span> Uploaded utility interconnection agreement</li>
                                            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">&bull;</span> Revised Y1 revenue from $4.2M to $1.4M</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SPI Component Breakdown */}
                        <section className="py-8 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">SPI Component Breakdown &mdash; Run 2 (Post-Correction)</h3>
                                <p className="text-xs text-slate-500 mb-4">Each component is weighted and computed independently via calculateSPI() in services/engine.ts</p>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Economic Readiness', score: 82, weight: '20%', detail: 'NZ GDP per capita, regional growth rate, fiscal surplus indicators' },
                                        { name: 'Symbiotic Fit', score: 76, weight: '15%', detail: 'Council-Vestas capability alignment across 6 dimensions' },
                                        { name: 'Political Stability', score: 91, weight: '15%', detail: 'NZ governance index, regulatory quality, rule of law' },
                                        { name: 'Partner Reliability', score: 74, weight: '15%', detail: 'Vestas track record, financial health, delivery capability' },
                                        { name: 'Ethical Alignment (SEAM)', score: 85, weight: '15%', detail: 'ESG compliance, community benefit, labour standards' },
                                        { name: 'Activation Velocity', score: 68, weight: '10%', detail: 'Regulatory pathway, permit timeline, grid connection readiness' },
                                        { name: 'Infrastructure Quality', score: 72, weight: '10%', detail: 'Grid capacity, transport access, construction labour availability' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-sm border border-slate-200">
                                            <div className="w-40 flex-shrink-0">
                                                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.weight} weight</p>
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${item.score}%` }} />
                                                </div>
                                            </div>
                                            <div className="w-12 text-right">
                                                <span className="text-sm font-bold text-blue-600">{item.score}%</span>
                                            </div>
                                            <p className="text-xs text-slate-500 w-56 flex-shrink-0">{item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Adversarial Debate Outcome */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">5-Persona Adversarial Debate &mdash; Consensus Report</h3>
                                <p className="text-xs text-slate-500 mb-4">Bayesian Debate Engine (services/PersonaEngine.ts) &mdash; 818 lines. Beliefs update via Bayesian inference. Disagreements are preserved, not smoothed.</p>

                                <div className="space-y-3 mb-4">
                                    <div className="bg-white border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">The Skeptic</p>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">APPROVE (Run 2)</span>
                                        </div>
                                        <p className="text-xs text-slate-600">&ldquo;Run 1 was correctly blocked. Revenue assumptions were indefensible. With the interconnection agreement uploaded and revenue corrected to $1.4M, the grid dependency is resolved and financials are within benchmark. I approve with the condition that quarterly review gates remain active.&rdquo;</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">The Advocate</p>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">APPROVE (Run 1 &amp; 2)</span>
                                        </div>
                                        <p className="text-xs text-slate-600">&ldquo;Northland has exceptional solar irradiance (4.8 kWh/m&sup2;/day), strong community support for renewables, and a proven council track record in infrastructure delivery. This is exactly the type of regional energy partnership the system was designed to validate.&rdquo;</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">The Regulator</p>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">APPROVE (Run 2)</span>
                                        </div>
                                        <p className="text-xs text-slate-600">&ldquo;The grid connection feasibility study was a hard gate. Without it, no responsible assessor should have allowed this to proceed. Now that the interconnection agreement is in place, NZ regulatory pathway is clear &mdash; Resource Management Act compliance, lines company agreement, and Transpower approval are all achievable within the 9-month P50 timeline.&rdquo;</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">The Accountant</p>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">APPROVE (Run 2)</span>
                                        </div>
                                        <p className="text-xs text-slate-600">&ldquo;At $1.4M Y1 revenue, the project achieves a realistic 8.2% IRR over a 25-year asset life. SCF Impact of $1.42M exceeds the $1M viability threshold. Cash flow breakeven at month 38. RROI improvement from 38 to 74 reflects genuine de-risking, not cosmetic adjustment.&rdquo;</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">The Operator</p>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">APPROVE (Run 1 &amp; 2)</span>
                                        </div>
                                        <p className="text-xs text-slate-600">&ldquo;Execution risk is manageable. Vestas has delivered 15+ installations of this scale in Australasia. Council has procurement experience with civil projects. 9-month activation is tight but achievable if resource consent is fast-tracked. Labour availability in Northland is the binding constraint &mdash; recommend early contractor engagement.&rdquo;</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                                    <p className="text-sm text-blue-800 font-semibold mb-1">Consensus: 5/5 APPROVE (Run 2)</p>
                                    <p className="text-xs text-blue-600">Bayesian posterior updated across both runs. Run 1 consensus: 2/5 (Advocate + Operator). Run 2 consensus: 5/5 with conditions. Belief convergence achieved after correction of both flagged deficiencies.</p>
                                </div>
                            </div>
                        </section>

                        {/* Risk Assessment */}
                        <section className="py-8 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Risk Assessment &mdash; Monte Carlo &amp; RFI Output</h3>
                                <div className="space-y-3 mb-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-900">Monte Carlo Simulation</p>
                                            <span className="text-xs text-slate-500">5,000 scenarios</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div className="bg-white border border-slate-200 rounded p-2">
                                                <p className="text-xs text-slate-500 mb-1">P10 (Optimistic)</p>
                                                <p className="text-sm font-bold text-green-600">$1.68M SCF</p>
                                            </div>
                                            <div className="bg-white border border-blue-200 rounded p-2">
                                                <p className="text-xs text-slate-500 mb-1">P50 (Median)</p>
                                                <p className="text-sm font-bold text-blue-600">$1.42M SCF</p>
                                            </div>
                                            <div className="bg-white border border-slate-200 rounded p-2">
                                                <p className="text-xs text-slate-500 mb-1">P90 (Conservative)</p>
                                                <p className="text-sm font-bold text-amber-600">$1.08M SCF</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
                                        <p className="text-sm font-semibold text-slate-900 mb-2">Regulatory Friction Index (RFI)</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Run 1 (Pre-Correction)</p>
                                                <p className="text-sm text-red-600 font-bold">RFI: 72/100 &mdash; High Friction</p>
                                                <p className="text-xs text-slate-500 mt-1">2 bottlenecks detected, 1 hard gate triggered</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Run 2 (Post-Correction)</p>
                                                <p className="text-sm text-blue-600 font-bold">RFI: 31/100 &mdash; Low Friction</p>
                                                <p className="text-xs text-slate-500 mt-1">0 bottlenecks, 0 hard gates. Clear regulatory pathway.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Cognition Layer */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Human Cognition Engine &mdash; Expert Judgement Simulation</h3>
                                <p className="text-xs text-slate-500 mb-4">7 neuroscience models from published research, implemented as faithful mathematical engines</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs font-semibold text-slate-800 mb-1">Wilson-Cowan Neural Fields</p>
                                        <p className="text-xs text-slate-600">Run 1: Inhibitory signals dominated &mdash; risk aversion pattern detected. Run 2: Balanced excitatory/inhibitory fields. Decision confidence: 0.81</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs font-semibold text-slate-800 mb-1">Predictive Processing</p>
                                        <p className="text-xs text-slate-600">Run 1: High prediction error on revenue assumptions (2.8&times; deviation). Run 2: Prediction error minimised. Hierarchical consistency achieved across all 3 levels.</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs font-semibold text-slate-800 mb-1">Free Energy Principle</p>
                                        <p className="text-xs text-slate-600">Run 1: High surprise (missing feasibility study created unresolvable uncertainty). Run 2: Free energy minimised. Policy selection converged on &ldquo;proceed with monitoring.&rdquo;</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-sm p-3">
                                        <p className="text-xs font-semibold text-slate-800 mb-1">Emotional Valence</p>
                                        <p className="text-xs text-slate-600">Run 1: Loss aversion triggered &mdash; the $4.2M projection &ldquo;felt wrong&rdquo; even before formula scoring confirmed. Run 2: Balanced valence. Prospect theory alignment positive.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Evidence Sources */}
                        <section className="py-8 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Audit Trail &mdash; Source Code References</h3>
                                <p className="text-xs text-slate-500 mb-4">Every score is computed by implemented TypeScript. File paths and line counts are real and verifiable.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { file: 'services/engine.ts', purpose: 'calculateSPI()  -  7-component weighted scoring. computeSCF()  -  P10/P50/P90 impact.' },
                                        { file: 'services/MissingFormulasEngine.ts', purpose: 'computeRFI()  -  Regulatory Friction Index with bottleneck detection.' },
                                        { file: 'services/PersonaEngine.ts', purpose: '5-persona adversarial debate engine.' },
                                        { file: 'services/ReportOrchestrator.ts', purpose: 'Full report assembly, all engines in parallel.' },
                                        { file: 'services/algorithms/DAGScheduler.ts', purpose: 'IVAS activation timeline. SCF composite scoring. Formula dependency graph.' },
                                        { file: 'services/NSILIntelligenceHub.ts', purpose: 'Master control  -  all 22 engines orchestrated.' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                            <p className="text-xs font-mono text-blue-600 mb-1">{item.file}</p>
                                            <p className="text-xs text-slate-600">{item.purpose}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ================================================================ */}
                        {/* THE VERDICT - What This Actually Means For The User             */}
                        {/* ================================================================ */}
                        <section className="py-10 px-6 md:px-8 bg-gradient-to-r from-green-50 to-emerald-50 border-y-4 border-green-500">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-green-700 uppercase tracking-[0.15em] text-xs font-bold">FINAL VERDICT</p>
                                        <h3 className="text-2xl font-bold text-slate-900">This Project Is Ready to Move Forward</h3>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg border border-green-200 p-6 mb-6">
                                    <h4 className="text-lg font-semibold text-slate-900 mb-3">What This Means in Plain English:</h4>
                                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                                        The Northland Regional Council&rsquo;s solar partnership with Vestas has passed every test. The numbers are realistic, the risks are manageable, the regulatory path is clear, and every expert persona agrees it should proceed. <strong>This project has a 78% strategic viability score and is classified as &ldquo;Investment Ready.&rdquo;</strong>
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-3xl font-bold text-green-600">78%</p>
                                            <p className="text-xs text-slate-600">Viability Score</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-3xl font-bold text-green-600">9 mo</p>
                                            <p className="text-xs text-slate-600">To First Revenue</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-3xl font-bold text-green-600">$1.42M</p>
                                            <p className="text-xs text-slate-600">Year 1 Cash Flow</p>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-lg font-semibold text-slate-900 mb-3">What the Council Should Do Next:</h4>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Begin Formal Partner Engagement</p>
                                            <p className="text-sm text-slate-600">Use the generated Letter of Intent (LOI) to open official discussions with Vestas. The document is already structured to their expectations.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Submit to Council Board</p>
                                            <p className="text-sm text-slate-600">The Investment Prospectus and Executive Summary are ready for board presentation. All numbers are defensible and traceable.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Initiate Resource Consent Process</p>
                                            <p className="text-sm text-slate-600">The regulatory pathway is clear. Begin RMA consent applications now to hit the 9-month activation timeline.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
                                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Lock In Contractor Early</p>
                                            <p className="text-sm text-slate-600">Labour availability in Northland was flagged as the binding constraint. Early contractor engagement is critical.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Documents Generated */}
                        <section className="py-8 px-6 md:px-8 bg-white border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">Documents Generated From This Analysis</h3>
                                <p className="text-sm text-slate-600 mb-4">The system automatically produced the following documents &mdash; ready to download, share, or submit:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        'Investment Prospectus',
                                        'Executive Summary',
                                        'Letter of Intent (LOI)',
                                        'Partnership Assessment',
                                        'Risk Report',
                                        'Financial Model',
                                        'Board Presentation',
                                        'Compliance Checklist'
                                    ].map((doc, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-center">
                                            <p className="text-xs font-medium text-slate-700">{doc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* The Bottom Line */}
                        <section className="py-8 px-6 md:px-8 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-4">The Bottom Line</h3>
                                <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
                                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                                        <strong className="text-slate-900">Without this system:</strong> The council would have spent 3&ndash;6 months and $50,000&ndash;$150,000 on consultants to reach the same conclusion. They would have submitted an initial proposal with inflated revenue projections &mdash; likely rejected by investors or delayed by months of back-and-forth.
                                    </p>
                                    <p className="text-base text-slate-700 leading-relaxed">
                                        <strong className="text-slate-900">With this system:</strong> The council got instant feedback on their errors, fixed them in hours, and now has a complete, defensible investment case with all supporting documents &mdash; ready for partner engagement, board approval, and regulatory submission.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Closing statement */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 md:p-8">
                            <p className="text-base text-white leading-relaxed font-medium text-center mb-2">
                                This is what the system produces. Every time.
                            </p>
                            <p className="text-sm text-slate-300 text-center">
                                Not just scores and technical data &mdash; but a clear verdict, actionable next steps, and all the documents you need to move forward. Your project, your data, your opportunity &mdash; transformed into a decision-ready package.
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

            {/* Full Architecture & Formulas Popup */}
            {showFormulas && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowFormulas(false)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onClick={(e) => e.stopPropagation()}>
                        {/* Popup header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg px-8 py-6 flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 uppercase tracking-[0.2em] text-sm font-bold mb-1">FULL TECHNICAL BREAKDOWN</p>
                                <h3 className="text-2xl font-bold text-white">Inside the NSIL &mdash; Every Layer, Formula &amp; Engine</h3>
                            </div>
                            <button onClick={() => setShowFormulas(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                                <X size={24} />
                            </button>
                        </div>
                        {/* Popup body */}
                        <div className="p-6 md:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">

                            <p>The NSIL &mdash; Nexus Strategic Intelligence Layer &mdash; is the orchestration engine I invented to make AI deterministic. It&rsquo;s implemented in <span className="font-mono text-sm bg-slate-100 px-1 rounded">services/NSILIntelligenceHub.ts</span> and runs every analysis through 10 computational layers in sequence, with parallelism inside each layer where dependencies allow. Same inputs, same outputs, every time. <strong>34 intelligence engines</strong>, <strong>38+ proprietary formulas</strong>, and <strong>12 core algorithms</strong> working in concert. Here&rsquo;s every layer, every formula, every engine.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 0 &mdash; The Laws (Knowledge Architecture)</h4>
                            <p>Hard-coded economic truth that the AI cannot alter. 38+ proprietary formulas defined with fixed mathematical relationships and bounded outputs, managed by a DAG Scheduler (<span className="font-mono text-sm bg-slate-100 px-1 rounded">DAGScheduler.ts</span>). The scheduler maps every formula into a directed acyclic graph across 5 execution levels &mdash; Level 0 runs PRI, CRI, BARNA, and TCO in parallel; Level 1 feeds into SPI, RROI, NVI, RNI, CAP; Level 2 produces SEAM, IVAS, ESI, FRS, AGI, VCI; Level 3 creates the master Strategic Confidence Framework (SCF); Level 4 runs 8 autonomous intelligence indices. Results are memoised &mdash; no formula executes twice.</p>

                            <p>Three examples of what these formulas do: <strong>SPI</strong> (Strategic Positioning Index) quantifies market dominance by weighting political risk against country risk with growth-adjusted positioning. <strong>RROI</strong> (Risk-Adjusted Return on Investment) runs Monte Carlo propagation across probability-weighted scenarios &mdash; real-world variance, not a single optimistic projection. <strong>SEAM</strong> (Strategic Ethical Alignment Matrix) cross-references strategy against policy frameworks and stakeholder impact.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 1 &mdash; The Shield (Input Validation)</h4>
                            <p>A SAT Contradiction Solver I wrote (<span className="font-mono text-sm bg-slate-100 px-1 rounded">SATContradictionSolver.ts</span>) converts inputs into propositional logic &mdash; conjunctive normal form &mdash; and runs a DPLL-based satisfiability check. Catches contradictions like claiming low risk while expecting 40%+ ROI, targeting global expansion on a small budget, or combining conservative strategy with aggressive growth targets. Each contradiction is classified by severity.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 2 &mdash; The Boardroom (Multi-Agent Debate)</h4>
                            <p>Five adversarial personas &mdash; Skeptic (1.2x weight), Advocate, Regulator, Accountant, and Operator &mdash; conduct a structured Bayesian debate (<span className="font-mono text-sm bg-slate-100 px-1 rounded">BayesianDebateEngine.ts</span>). Each votes across four outcomes: proceed, pause, restructure, or reject. Beliefs update via Bayesian inference. Early stopping at 0.75 posterior probability or 0.02 belief delta. Disagreements resolved through Nash bargaining. Every persona&rsquo;s reasoning preserved in the audit trail.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 3 &mdash; The Engine (Formula Scoring)</h4>
                            <p>The DAG Scheduler executes the full 38+ formula suite with typed inputs, bounded outputs, component breakdowns, and execution timing. Results flow into a <span className="font-mono text-sm bg-slate-100 px-1 rounded">CompositeScoreService</span> that normalises raw data against region-specific baselines. Deterministic jitter from hash-based seeding ensures reproducibility.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 4 &mdash; Stress Testing (Scenario Simulation)</h4>
                            <p>The Scenario Simulation Engine (<span className="font-mono text-sm bg-slate-100 px-1 rounded">ScenarioSimulationEngine.ts</span>) builds causal graphs with feedback loops, runs Monte Carlo propagation through multi-step chains with non-linear dynamics, and simulates forward outcomes using Markov chain state transitions across economic, political, social, environmental, technological, and regulatory categories.</p>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 5 &mdash; The Brain (Human Cognition Engine)</h4>
                            <p>The Human Cognition Engine I wrote (<span className="font-mono text-sm bg-slate-100 px-1 rounded">HumanCognitionEngine.ts</span>) implements 7 neuroscience models as mathematical implementations:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li><strong>Wilson-Cowan Neural Field Dynamics</strong> &mdash; Differential equations on excitatory/inhibitory neuron populations on a 50&times;50 spatial grid. Parameters: w_ee=1.5, w_ei=-1.0, w_ie=1.0, w_ii=-0.5, dt=0.01.</li>
                                <li><strong>Predictive Coding (Rao &amp; Ballard)</strong> &mdash; 3-level hierarchical belief updating with prediction error minimisation. Learning rate 0.1.</li>
                                <li><strong>Free Energy Principle (Friston)</strong> &mdash; Variational inference across 8 candidate policies, discount factor &gamma;=0.95.</li>
                                <li><strong>Attention Models (Itti &amp; Koch)</strong> &mdash; Salience maps with intensity/colour/orientation weights. Winner-take-all with inhibition of return (0.7).</li>
                                <li><strong>Emotional Processing</strong> &mdash; Neurovisceral integration theory, emotional inertia (0.8), autonomic coupling (0.6).</li>
                                <li><strong>Global Workspace Theory</strong> &mdash; Coalition formation with ignition threshold 0.6. Information broadcasting across cognitive subsystems.</li>
                                <li><strong>Baddeley&rsquo;s Working Memory</strong> &mdash; Phonological decay 0.05, visual decay 0.03, rehearsal benefit 0.2.</li>
                            </ol>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layer 6 &mdash; Autonomous Intelligence (8 Engines)</h4>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>Creative Synthesis</strong> &mdash; Koestler&rsquo;s bisociation theory + Fauconnier &amp; Turner conceptual blending.</li>
                                <li><strong>Cross-Domain Transfer</strong> &mdash; Maps biology, physics, engineering onto economics via Gentner&rsquo;s structure-mapping theory.</li>
                                <li><strong>Autonomous Goal</strong> &mdash; Detects emergent strategic goals from top-level index scores.</li>
                                <li><strong>Ethical Reasoning</strong> &mdash; Multi-stakeholder utility, Rawlsian fairness, Stern Review discount rates (&le;1.4%). Every recommendation must pass this gate.</li>
                                <li><strong>Self-Evolving Algorithm</strong> &mdash; Online gradient descent w_t+1 = w_t - &eta;&nabla;L, Thompson sampling, mutation-selection with full rollback.</li>
                                <li><strong>Adaptive Learning</strong> &mdash; Bayesian belief updates from outcome feedback.</li>
                                <li><strong>Emotional Intelligence</strong> &mdash; Prospect Theory + Russell&rsquo;s Circumplex Model for stakeholder dynamics.</li>
                                <li><strong>Scenario Simulation</strong> &mdash; 5,000 Monte Carlo runs with causal loop modelling and Markov state transitions.</li>
                            </ul>

                            <h4 className="text-lg font-bold text-slate-900 pt-2">Layers 7&ndash;9 &mdash; Proactive, Output &amp; Reflexive</h4>
                            <p><strong>Layer 7 (Proactive):</strong> Seven engines for backtesting, drift detection, continuous learning, meta-cognition, and proactive signal mining.</p>
                            <p><strong>Layer 8 (Output Synthesis):</strong> Provenance tracking, full audit trails, 156 letter templates, 232 document types &mdash; all populated with exact data and confidence scores.</p>
                            <p><strong>Layer 9 (Reflexive Intelligence):</strong> Seven engines that analyse the user:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>User Signal Decoder</strong> &mdash; Shannon&rsquo;s information-theoretic redundancy. Detects repetition, avoidance, and emotional emphasis.</li>
                                <li><strong>Internal Echo Detector</strong> &mdash; Prevents confirmation bias inside the machine itself.</li>
                                <li><strong>Investment Lifecycle Mapper</strong> &mdash; Maps project lifecycle stage, adjusts analysis accordingly.</li>
                                <li><strong>Regional Mirroring</strong> &mdash; Finds structural twin regions via structure-mapping across 6 dimensions.</li>
                                <li><strong>Regional Identity Decoder</strong> &mdash; Detects when authentic identity has been replaced with generic marketing language.</li>
                                <li><strong>Latent Advantage Miner</strong> &mdash; Surfaces casually mentioned assets with real strategic significance.</li>
                                <li><strong>Universal Translation Layer</strong> &mdash; Translates findings for 5 audiences: investors, government, community, partners, executives.</li>
                            </ul>

                            <h4 className="text-lg font-bold text-slate-900 pt-4">The 12 Core Algorithm Engines</h4>
                            <p className="mb-3">Beyond the intelligence layers, 12 specialised algorithm engines power the system&rsquo;s advanced capabilities:</p>
                            <div className="grid md:grid-cols-2 gap-3 mb-6">
                                <div>
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        <li>&bull; <strong>DAG Scheduler</strong> &mdash; Directed acyclic graph execution across 5 formula levels</li>
                                        <li>&bull; <strong>SAT Contradiction Solver</strong> &mdash; DPLL-based satisfiability checking</li>
                                        <li>&bull; <strong>Bayesian Debate Engine</strong> &mdash; Multi-agent belief updating and Nash bargaining</li>
                                        <li>&bull; <strong>Human Cognition Engine</strong> &mdash; 7 neuroscience models running live</li>
                                        <li>&bull; <strong>Deep Thinking Engine</strong> &mdash; Chain-of-Thought &amp; Tree-of-Thoughts reasoning (801 lines)</li>
                                        <li>&bull; <strong>Vector Memory Index</strong> &mdash; Semantic similarity search with embedding retrieval</li>
                                    </ul>
                                </div>
                                <div>
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        <li>&bull; <strong>Frontier Intelligence Engine</strong> &mdash; Multi-round negotiation simulation (568 lines)</li>
                                        <li>&bull; <strong>Gradient Ranking Engine</strong> &mdash; Priority optimisation with gradient descent</li>
                                        <li>&bull; <strong>Optimized Agentic Brain</strong> &mdash; High-performance multi-agent coordination</li>
                                        <li>&bull; <strong>Decision Tree Synthesizer</strong> &mdash; Automated decision path generation</li>
                                        <li>&bull; <strong>Lazy Evaluation Engine</strong> &mdash; On-demand computation with memoisation</li>
                                        <li>&bull; <strong>Intelligent Document Generator</strong> &mdash; Context-aware document assembly</li>
                                    </ul>
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 pt-4">The 38+ Proprietary Formulas</h4>
                            <div className="grid md:grid-cols-3 gap-3 mt-2">
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Core Indices</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
                                        <li>&bull; SPI&trade; &mdash; Success Probability Index</li>
                                        <li>&bull; RROI&trade; &mdash; Regional Return on Investment</li>
                                        <li>&bull; SEAM&trade; &mdash; Stakeholder Alignment Matrix</li>
                                        <li>&bull; PVI&trade; &mdash; Partnership Viability Index</li>
                                        <li>&bull; RRI&trade; &mdash; Regional Resilience Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Risk Formulas</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
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
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Financial Metrics</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
                                        <li>&bull; IRR &mdash; Internal Rate of Return</li>
                                        <li>&bull; NPV &mdash; Net Present Value</li>
                                        <li>&bull; WACC &mdash; Weighted Cost of Capital</li>
                                        <li>&bull; DSCR &mdash; Debt Service Coverage</li>
                                        <li>&bull; FMS &mdash; Funding Match Score</li>
                                        <li>&bull; ROE &mdash; Return on Equity</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Operational Scores</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
                                        <li>&bull; ORS &mdash; Organizational Readiness</li>
                                        <li>&bull; TCS &mdash; Team Capability Score</li>
                                        <li>&bull; EEI &mdash; Execution Efficiency Index</li>
                                        <li>&bull; SEQ &mdash; Sequencing Integrity Score</li>
                                        <li>&bull; CGI &mdash; Capability Gap Index</li>
                                        <li>&bull; LCI &mdash; Leadership Confidence Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Market Formulas</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
                                        <li>&bull; MPI &mdash; Market Penetration Index</li>
                                        <li>&bull; CAI &mdash; Competitive Advantage Index</li>
                                        <li>&bull; TAM &mdash; Total Addressable Market</li>
                                        <li>&bull; SAM &mdash; Serviceable Available Market</li>
                                        <li>&bull; GRI &mdash; Growth Rate Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-900 mb-1">Governance Metrics</h5>
                                    <ul className="space-y-0.5 text-sm text-slate-600">
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
                                <p className="text-sm text-slate-700 italic">
                                    Every formula has defined methodology, transparent inputs, and a full audit trail. The 34 intelligence engines (8 autonomous + 7 proactive + 7 reflexive + 12 core algorithms) are backed by published mathematical theory, implemented in real TypeScript with no placeholders. 155+ service files. 50,000+ lines of code. This is the system I built. This is what makes it a world first.
                                </p>
                            </div>
                        </div>
                        {/* Close button at bottom */}
                        <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end">
                            <button 
                                onClick={() => setShowFormulas(false)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-sm text-sm font-bold hover:bg-slate-800 transition-all"
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
                            <p className="text-xs text-white/40">(c) 2026 BW Global Advisory. All rights reserved.</p>
                            <p className="text-xs text-white/30">Trading as Sole Trader (R&D Phase) | ABN 55 978 113 300 | Melbourne, Australia</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                Nexus Intelligence OS v7.0
                            </span>
                            <span>*</span>
                            <span>NSIL Engine v5.0</span>
                            <span>*</span>
                            <span className="text-blue-400">Knowledge Layer Active</span>
                            <span>*</span>
                            <span className="text-indigo-400">Cognition Active</span>
                            <span>*</span>
                            <span className="text-blue-400">Autonomous Active</span>
                            <span>*</span>
                            <span className="text-slate-400">Reflexive Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CommandCenter;


