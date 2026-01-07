import React, { useState } from 'react';
import { 
    CheckCircle2, ShieldAlert, FileText, BarChart3, ArrowRight, X, 
    MessageSquare, Cpu, Download, Search, Lightbulb, Scale, Calculator, 
    Cog, Building2, Globe, Users, Briefcase, Brain, Target, Shield,
    TrendingUp, FileCheck, Zap, Eye, AlertTriangle, Database, GitBranch
} from 'lucide-react';

interface CommandCenterProps {
    onEnterPlatform?: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onEnterPlatform }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [activePersona, setActivePersona] = useState<number | null>(null);

    const personas = [
        { 
            name: "The Skeptic", 
            icon: Search, 
            color: "text-red-500",
            role: "Risk Hunter",
            description: "Actively searches for hidden risks, unfounded assumptions, and deal-breakers. Asks: What could go wrong? What are we missing?"
        },
        { 
            name: "The Advocate", 
            icon: Lightbulb, 
            color: "text-yellow-500",
            role: "Opportunity Finder",
            description: "Identifies competitive advantages, unique value propositions, and strategic opportunities. Asks: What makes this special? Why now?"
        },
        { 
            name: "The Regulator", 
            icon: Scale, 
            color: "text-blue-500",
            role: "Compliance Validator",
            description: "Validates legal requirements, regulatory frameworks, and policy alignment across jurisdictions. Asks: Is this permissible? What approvals are needed?"
        },
        { 
            name: "The Accountant", 
            icon: Calculator, 
            color: "text-green-500",
            role: "Financial Analyst",
            description: "Stress-tests financial projections, validates assumptions, and models probabilistic outcomes. Asks: Do the numbers work? What's the downside?"
        },
        { 
            name: "The Operator", 
            icon: Cog, 
            color: "text-purple-500",
            role: "Execution Assessor",
            description: "Evaluates implementation feasibility, resource requirements, and operational complexity. Asks: Can this actually be done? What's the timeline?"
        }
    ];

    const scoringFormulas = [
        { name: "SPI™", fullName: "Strategic Partnership Index", description: "Quantifies counterparty reliability, alignment, and partnership viability", color: "border-blue-500" },
        { name: "RROI™", fullName: "Regional Return on Investment", description: "Adjusts expected yields for location-specific risk premiums", color: "border-green-500" },
        { name: "SEAM™", fullName: "Socio-Economic Alignment Metric", description: "Measures community benefit and social license to operate", color: "border-purple-500" },
        { name: "IVAS™", fullName: "Investment Viability Assessment Score", description: "Calculates capital deployment feasibility", color: "border-amber-500" },
        { name: "SCF™", fullName: "Supply Chain Friction Index", description: "Identifies logistics and execution bottlenecks", color: "border-red-500" }
    ];

    const deliverables = [
        { name: "Strategic Assessment Report", description: "Executive summary with SPI/IVAS scores, risk analysis, and recommendations" },
        { name: "Monte Carlo Analysis", description: "P10/P50/P90 projections with Value at Risk and probability distributions" },
        { name: "Investment Memo", description: "Board-ready document with financial structure and due diligence findings" },
        { name: "Risk Brief (Skeptic's Report)", description: "Adversarial analysis of vulnerabilities and mitigation strategies" },
        { name: "Partner Matching Report", description: "Compatibility scores with recommended engagement sequencing" },
        { name: "Regulatory Compliance Matrix", description: "Jurisdiction-specific requirements and approval pathways" },
        { name: "Letter of Intent Template", description: "Pre-formatted LOI with key terms and legal considerations" },
        { name: "Complete Audit Trail", description: "Every claim traceable to source with formula transparency" }
    ];

    const systemCapabilities = [
        { icon: Brain, title: "Adversarial Reasoning", description: "Five specialized AI personas debate every opportunity, surfacing risks and advantages before stakeholders see them." },
        { icon: BarChart3, title: "Probabilistic Finance", description: "100+ Monte Carlo simulations produce P10/P50/P90 projections—not single-point guesses." },
        { icon: Database, title: "Evidence Clamping", description: "Weak evidence automatically reduces scores. The system never compensates with optimistic language." },
        { icon: FileCheck, title: "Audit Trails", description: "Every claim is traceable. Every formula is transparent. Every source is verifiable." }
    ];

    return (
        <div className="h-full w-full flex-1 bg-slate-50 overflow-y-auto" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300 mb-6">
                            <Shield size={16} className="text-green-400" />
                            Nexus Strategic Intelligence Layer v6.0
                        </div>
                        <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
                            Institutional-Grade Intelligence<br />
                            <span className="font-semibold">for Regional Investment</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Transform unstructured opportunity briefs into board-ready analysis through 
                            adversarial reasoning, probabilistic finance, and complete audit transparency.
                        </p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-3xl font-light mb-1">27</div>
                            <div className="text-sm text-slate-400">Scoring Formulas</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-3xl font-light mb-1">5</div>
                            <div className="text-sm text-slate-400">Adversarial Personas</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-3xl font-light mb-1">100+</div>
                            <div className="text-sm text-slate-400">Monte Carlo Runs</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-3xl font-light mb-1">10</div>
                            <div className="text-sm text-slate-400">Step Protocol</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What This System Does */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">What This System Does</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            BWGA AI is not a chatbot or a document generator. It's a multi-layered intelligence 
                            architecture that subjects every opportunity to the same rigor as an institutional investment committee.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {systemCapabilities.map((cap, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                                <cap.icon size={32} className="text-slate-700 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{cap.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{cap.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - 3 Steps */}
            <section className="py-16 px-8 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light mb-4">How It Works</h2>
                        <p className="text-lg text-slate-400">Three steps from brief to board-ready intelligence</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare size={28} />
                            </div>
                            <div className="text-sm text-blue-400 font-medium mb-2">STEP 1</div>
                            <h3 className="text-xl font-semibold mb-3">Describe Your Opportunity</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Input your project in plain language—any format, any skill level. 
                                The system asks clarifying questions and fills gaps through active research.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Cpu size={28} />
                            </div>
                            <div className="text-sm text-purple-400 font-medium mb-2">STEP 2</div>
                            <h3 className="text-xl font-semibold mb-3">System Validates & Debates</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Five AI personas argue your case from different angles. 
                                27 formulas score viability. 100+ Monte Carlo runs model uncertainty.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Download size={28} />
                            </div>
                            <div className="text-sm text-green-400 font-medium mb-2">STEP 3</div>
                            <h3 className="text-xl font-semibold mb-3">Download Board-Ready Artifacts</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Export investment memos, risk briefs, LOI templates—each with complete 
                                audit trails and source citations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Five-Persona Framework */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">The Five-Persona Boardroom</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Every opportunity is debated by five specialized AI reviewers operating in parallel. 
                            They disagree, challenge assumptions, and surface blind spots—before your stakeholders do.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {personas.map((persona, idx) => (
                            <div 
                                key={idx}
                                className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                                    activePersona === idx 
                                        ? 'bg-slate-900 text-white border-slate-900' 
                                        : 'bg-white border-slate-200 hover:border-slate-400'
                                }`}
                                onClick={() => setActivePersona(activePersona === idx ? null : idx)}
                            >
                                <persona.icon size={28} className={activePersona === idx ? 'text-white' : persona.color} />
                                <h3 className={`font-semibold mt-3 ${activePersona === idx ? 'text-white' : 'text-slate-900'}`}>
                                    {persona.name}
                                </h3>
                                <p className={`text-xs mt-1 ${activePersona === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {persona.role}
                                </p>
                                {activePersona === idx && (
                                    <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                                        {persona.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-slate-100 p-6 rounded-lg">
                        <p className="text-slate-700 text-center">
                            <strong>The value isn't a single score.</strong> It's seeing where the personas agree—and where conflict remains. 
                            You get the full debate transcript, so you know exactly what risks were considered.
                        </p>
                    </div>
                </div>
            </section>

            {/* 27 Scoring Formulas */}
            <section className="py-16 px-8 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">27 Proprietary Scoring Formulas</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Five core engines plus 22 derivative indices. Each produces mathematical outputs 
                            with confidence intervals—not subjective ratings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mb-8">
                        {scoringFormulas.map((formula, idx) => (
                            <div key={idx} className={`bg-white p-5 rounded-lg border-l-4 ${formula.color} shadow-sm`}>
                                <div className="text-lg font-bold text-slate-900">{formula.name}</div>
                                <div className="text-sm text-slate-600 mt-1">{formula.fullName}</div>
                                <p className="text-xs text-slate-500 mt-2">{formula.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 text-white p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                            <AlertTriangle size={24} className="text-amber-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold mb-2">Evidence Clamping Protocol</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    When evidence quality is insufficient, formulas automatically produce lower scores with wider confidence bands. 
                                    The system does not compensate with optimistic language—it tells you exactly what data is missing and blocks 
                                    document export until gaps are addressed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        +22 derivative indices: Risk Assessment, Governance Quality, ESG Compliance, Execution Readiness, 
                        Regulatory Complexity, Market Volatility, Currency Risk, Infrastructure Maturity, and more.
                    </div>
                </div>
            </section>

            {/* Monte Carlo Simulation */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-light text-slate-900 mb-4">Probabilistic Financial Analysis</h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Instead of giving you a single number, the system runs 100+ randomized scenarios 
                                to show you the full range of possible outcomes.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={20} />
                                    <span className="text-slate-700">P10 (Pessimistic) / P50 (Base) / P90 (Optimistic) projections</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={20} />
                                    <span className="text-slate-700">Value at Risk (VaR95) and Expected Shortfall</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={20} />
                                    <span className="text-slate-700">Probability of Loss calculations</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={20} />
                                    <span className="text-slate-700">Sensitivity analysis across key variables</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-lg">
                            <div className="text-sm text-slate-400 mb-4">Sample Output</div>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-light">$4.2M</div>
                                    <div className="text-xs text-slate-400 mt-1">P10 (Pessimistic)</div>
                                </div>
                                <div className="text-center border-x border-slate-700">
                                    <div className="text-2xl font-semibold text-green-400">$8.7M</div>
                                    <div className="text-xs text-slate-400 mt-1">P50 (Base Case)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-light">$14.3M</div>
                                    <div className="text-xs text-slate-400 mt-1">P90 (Optimistic)</div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm border-t border-slate-700 pt-4">
                                <span className="text-slate-400">Probability of Loss</span>
                                <span className="text-red-400 font-semibold">8%</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-slate-400">Value at Risk (95%)</span>
                                <span className="text-amber-400 font-semibold">$2.1M</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The 10-Step Protocol */}
            <section className="py-16 px-8 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light mb-4">The Ten-Step Reasoning Protocol</h2>
                        <p className="text-lg text-slate-400">
                            Every mandate passes through a structured governance sequence that enforces intellectual honesty.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {[
                            { step: 1, name: "Adversarial Input Screening", desc: "Challenge assumptions before analysis begins" },
                            { step: 2, name: "Historical Contextualization", desc: "Retrieve precedents and comparable outcomes" },
                            { step: 3, name: "Five-Persona Debate", desc: "Parallel adversarial review from multiple angles" },
                            { step: 4, name: "Mathematical Quantification", desc: "Score across 27 proprietary formulas" },
                            { step: 5, name: "Monte Carlo Simulation", desc: "100+ iterations for probabilistic outcomes" },
                            { step: 6, name: "Evidence Quality Assessment", desc: "Trace every claim to its source" },
                            { step: 7, name: "Risk-Mitigation Mapping", desc: "Pair risks with specific countermeasures" },
                            { step: 8, name: "Partner Matching & Scoring", desc: "Identify optimal counterparties" },
                            { step: 9, name: "Document Generation", desc: "Board-ready artifacts with audit trails" },
                            { step: 10, name: "Outcome Learning", desc: "Feed results back to improve future assessments" }
                        ].map((item) => (
                            <div key={item.step} className="bg-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">Step {item.step}</div>
                                <div className="font-medium text-sm mb-1">{item.name}</div>
                                <div className="text-xs text-slate-400">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What You Receive */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">What You Receive</h2>
                        <p className="text-lg text-slate-600">
                            Executable artifacts that can be sent directly to investors, presented to boards, or submitted to funding bodies.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {deliverables.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                                <FileText size={24} className="text-slate-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={20} className="text-green-600" />
                                <span className="font-semibold text-green-800">~30 Minutes</span>
                            </div>
                            <p className="text-sm text-green-700">From project brief to draft investment memo</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={20} className="text-blue-600" />
                                <span className="font-semibold text-blue-800">One Platform</span>
                            </div>
                            <p className="text-sm text-blue-700">Everything in one place—no fragmented consultants</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who This Is For */}
            <section className="py-16 px-8 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">Who This Is For</h2>
                        <p className="text-lg text-slate-600">
                            Not a replacement for professionals—a force multiplier for every skill level.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <Building2 size={32} className="text-blue-600 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Regional Agencies</h3>
                            <p className="text-sm text-slate-600">
                                Transform local knowledge into the structured intelligence global capital requires.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <TrendingUp size={32} className="text-green-600 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Capital Allocators</h3>
                            <p className="text-sm text-slate-600">
                                Screen deals globally with standardized risk and compatibility scoring.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <Briefcase size={32} className="text-amber-600 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Corporate Strategy</h3>
                            <p className="text-sm text-slate-600">
                                Pre-qualify partners and markets before committing resources.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <Users size={32} className="text-purple-600 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Advisors</h3>
                            <p className="text-sm text-slate-600">
                                Augment your practice with deep, forensic AI-driven research.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms & Access */}
            <section className="py-16 px-8 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-light text-slate-900 mb-6 text-center">Terms of Engagement</h2>
                    
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 max-h-48 overflow-y-auto text-sm text-slate-700 space-y-3">
                        <p><strong>Decision Support:</strong> BWGA AI is a decision support platform. All outputs are advisory and must be validated by qualified professionals before binding commitments.</p>
                        <p><strong>Evidence Standards:</strong> The system enforces evidence-based reasoning through the NSIL governance layer. Low-quality evidence produces clamped scores with explicit uncertainty bands.</p>
                        <p><strong>Data Privacy:</strong> Strict compliance with data sovereignty and privacy laws (GDPR, Australian Privacy Act). No user-specific data trains public models.</p>
                        <p><strong>Intellectual Property:</strong> All methodologies, formulas, and the 27-formula suite are owned by BW Global Advisory Pty Ltd. Access does not grant license or transfer of rights.</p>
                        <p><strong>Beta Notice:</strong> Platform is provided "AS IS" during R&D beta. Advisory outputs require professional validation. Liability is capped at fees paid.</p>
                    </div>

                    <div className="flex items-start gap-3 mb-8">
                        <input 
                            type="checkbox" 
                            id="acceptTerms" 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-slate-700 cursor-pointer">
                            I have read and agree to the <strong>Terms of Engagement</strong>. I understand that BWGA AI is a 
                            decision support platform in R&D beta, and all outputs require professional validation.
                        </label>
                    </div>

                    <div className="text-center">
                        <button 
                            disabled={!termsAccepted}
                            onClick={() => termsAccepted && onEnterPlatform?.()}
                            className={`inline-flex items-center gap-3 px-10 py-4 rounded-lg font-medium text-lg transition-all ${
                                termsAccepted 
                                    ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-lg hover:shadow-xl' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Launch Report System
                            <ArrowRight size={20} />
                        </button>
                        {!termsAccepted && (
                            <p className="text-sm text-slate-500 mt-3">Accept the terms above to continue</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-8 bg-slate-900 text-center">
                <p className="text-sm text-slate-400">
                    © 2026 BW Global Advisory Pty Ltd | Nexus Intelligence OS v6.0 | Melbourne, Australia | ABN 55 978 113 300
                </p>
            </footer>
        </div>
    );
};

export default CommandCenter;
