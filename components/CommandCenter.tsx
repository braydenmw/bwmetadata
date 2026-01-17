import React, { useState } from 'react';
import { 
    CheckCircle2, ShieldAlert, FileText, BarChart3, ArrowRight, X, 
    MessageSquare, Cpu, Download, Search, Lightbulb, Scale, Calculator, 
    Cog, Building2, Globe, Users, Briefcase, Brain, Target, Shield,
    TrendingUp, FileCheck, Zap, Eye, AlertTriangle, Database, GitBranch, CreditCard
} from 'lucide-react';

interface CommandCenterProps {
    onEnterPlatform?: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onEnterPlatform }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [activePersona, setActivePersona] = useState<number | null>(null);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    const personas = [
        { 
            name: "The Advocate", 
            icon: Lightbulb, 
            color: "text-yellow-500",
            role: "Opportunity Finder",
            description: "Identifies competitive advantages, unique value propositions, and strategic opportunities. Asks: What makes this special? Why now?"
        },
        { 
            name: "The Skeptic", 
            icon: Search, 
            color: "text-red-500",
            role: "Risk Hunter",
            description: "Actively searches for hidden risks, unfounded assumptions, and deal-breakers. Asks: What could go wrong? What are we missing?"
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
                            <span><strong>NSIL</strong> — Nexus Strategic Intelligence Layer: The Ten-Step Protocol v6.0</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
                            Institutional-Grade Intelligence<br />
                            <span className="font-semibold">for Regional Investment</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Transform unstructured opportunity briefs into board-ready analysis through 
                            adversarial reasoning, probabilistic finance, and complete audit transparency.
                        </p>
                        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                <strong className="text-green-400">NSIL (Nexus Strategic Intelligence Layer)</strong> is the governance architecture 
                                that orchestrates 27 scoring formulas, 5 adversarial personas, and 100+ Monte Carlo simulations 
                                into a unified decision-support system with complete audit transparency.
                            </p>
                        </div>
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
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">From Rough Brief to Board‑Ready Package</div>
                        <h2 className="text-3xl font-light mb-4 text-slate-900">From Rough Brief to Board‑Ready Package</h2>
                        <p className="text-lg text-slate-700 max-w-4xl mx-auto mb-6">
                            Start with a simple brief; leave the heavy lifting to NSIL. Our intake converts your narrative into structured hypotheses, runs adversarial multi‑persona reasoning, applies rigorous scoring and scenario engines, and composes a complete, auditable decision package—fast, repeatable, and governance‑ready.
                        </p>
                        <div className="bg-white border border-slate-100 rounded-lg p-4 max-w-3xl mx-auto">
                            <p className="text-sm text-slate-600">
                                <strong className="text-green-600">10‑STEP PROTOCOL</strong> — An institutional intake and audit protocol ensures every conclusion is traceable, falsifiable, and recomputable when assumptions change.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare size={28} className="text-blue-600" />
                            </div>
                            <div className="text-sm text-blue-600 font-medium mb-2">STEP 1</div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900">Intake & Validation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Submit your opportunity in plain language. Input checks and evidence validation capture assumptions and surface gaps to be resolved.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Cpu size={28} className="text-purple-600" />
                            </div>
                            <div className="text-sm text-purple-600 font-medium mb-2">STEP 2</div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900">Adversarial Analysis</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Five specialist personas debate the case; scored formulas and Monte Carlo scenarios quantify risk and upside across plausible futures.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Download size={28} className="text-green-600" />
                            </div>
                            <div className="text-sm text-green-600 font-medium mb-2">STEP 3</div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900">Board‑Ready Deliverables</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Receive investment memos, LOIs, negotiation term sheets and explainability contracts—each with drivers, formulas and citations for audit and governance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Architecture & Intelligence Framework */}
            <section className="py-16 px-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 mb-4">
                            <GitBranch size={12} />
                            Technical Deep Dive
                        </div>
                        <h2 className="text-3xl font-light mb-4">BWGA Intelligence AI: Technical Architecture Report</h2>
                        <p className="text-sm text-slate-500 mb-4">Technical Report · January 2026</p>
                        <div className="inline-block bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 mb-4">
                            <span className="text-lg font-bold text-white">NSIL</span>
                            <span className="text-slate-300 ml-2">— Nexus Strategic Intelligence Layer</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-3xl mx-auto mb-4">
                            A Neuro-Symbolic Decision-Support Architecture for Cross-Border Partnership Intelligence
                        </p>
                        <p className="text-xs text-slate-500 mb-6">Brayden Walls Global Advisory · Research &amp; Development Division</p>
                        <p className="text-lg text-slate-400 max-w-4xl mx-auto">
                            <strong className="text-white">TECHNICAL FOUNDATION</strong>
                            <span className="text-slate-300"> — </span>
                            The proprietary reasoning engine behind every analysis. NSIL doesn't just generate text—it runs structured debates between five specialized AI personas,
                            applies 27 mathematical formulas to score your opportunity, and executes Monte Carlo simulations to model what could go wrong.
                            Every conclusion comes with a complete audit trail: which formula, which inputs, which persona raised the flag.
                        </p>
                        <div className="mt-6 grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left">
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">5-Layer Architecture</h4>
                                <ul className="text-xs text-slate-400 space-y-1">
                                    <li>• Input &amp; Governance</li>
                                    <li>• Multi-Agent Reasoning</li>
                                    <li>• Quantitative Scoring</li>
                                    <li>• Output Intelligence</li>
                                    <li>• Continuous Learning</li>
                                </ul>
                            </div>
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left">
                                <h4 className="text-sm font-semibold text-purple-400 mb-2">5 AI Personas</h4>
                                <ul className="text-xs text-slate-400 space-y-1">
                                    <li>• Advocate (Opportunity)</li>
                                    <li>• Skeptic (Risk)</li>
                                    <li>• Regulator (Compliance)</li>
                                    <li>• Accountant (Finance)</li>
                                    <li>• Operator (Execution)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 border border-blue-500 text-sm text-white cursor-pointer transition-all">
                                View Full Architecture &amp; 27 Formulas
                            </button>
                        </div>
                    </div>

                    {/* Architecture Layers */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Database size={20} className="text-blue-400" />
                                </div>
                                <h3 className="font-semibold">Input & Governance</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>10-step structured intake protocol</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Multi-select capability mapping</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Evidence quality validation gates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Automatic gap detection & prompting</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Brain size={20} className="text-purple-400" />
                                </div>
                                <h3 className="font-semibold">Multi-Agent Reasoning</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>5 specialized adversarial personas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Parallel debate orchestration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Consensus & dissent tracking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Full debate transcript capture</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <BarChart3 size={20} className="text-green-400" />
                                </div>
                                <h3 className="font-semibold">Quantification & Output Layer</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>27-formula scoring suite</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>100+ Monte Carlo simulations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>P10/P50/P90 probability distributions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>Board-ready document generation</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 27 Formula Suite Breakdown */}
                    <div className="bg-slate-800 rounded-lg p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6 text-center">The 27-Formula Scoring Suite</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-sm font-medium text-blue-400 mb-3">Core Indices (5)</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li>• <strong className="text-white">SPI™</strong> — Strategic Partnership Index</li>
                                    <li>• <strong className="text-white">RROI™</strong> — Regional Return on Investment</li>
                                    <li>• <strong className="text-white">SEAM™</strong> — Socio-Economic Alignment Metric</li>
                                    <li>• <strong className="text-white">IVAS™</strong> — Investment Viability Assessment</li>
                                    <li>• <strong className="text-white">SCF™</strong> — Strategic Cash Flow Impact</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-purple-400 mb-3">Risk Derivatives (10)</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li>• Political Stability Score</li>
                                    <li>• Currency Volatility Index</li>
                                    <li>• Operational Complexity Rating</li>
                                    <li>• Legal/Regulatory Friction</li>
                                    <li>• Environmental Risk Factor</li>
                                    <li>• Reputational Risk Quotient</li>
                                    <li>• Technology Dependency Score</li>
                                    <li>• Concentration Risk Index</li>
                                    <li>• Counterparty Risk Rating</li>
                                    <li>• Market Timing Sensitivity</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-green-400 mb-3">Compatibility Metrics (12)</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li>• Partner Readiness Level (14 stages)</li>
                                    <li>• Governance Quality Index</li>
                                    <li>• ESG Compliance Score</li>
                                    <li>• Execution Readiness Rating</li>
                                    <li>• Infrastructure Maturity</li>
                                    <li>• Cultural Alignment Score</li>
                                    <li>• Strategic Fit Index</li>
                                    <li>• Resource Complementarity</li>
                                    <li>• Timeline Compatibility</li>
                                    <li>• Value Creation Potential</li>
                                    <li>• Exit Pathway Viability</li>
                                    <li>• Long-term Sustainability</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Clamping */}
                    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle size={24} className="text-amber-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-amber-300 mb-2">Evidence Clamping Protocol</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    The NSIL governance layer automatically clamps scores when evidence quality is insufficient. 
                                    Weak or missing data produces lower scores with wider confidence bands. The system never compensates 
                                    with optimistic language—it explicitly flags what data is missing and can block document export 
                                    until critical gaps are addressed. Every claim is traceable to its source.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Five-Persona Framework */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-slate-900 mb-4">5-Layer Architecture & 5 AI Personas</h2>
                        <div className="inline-block bg-indigo-100 border border-indigo-200 rounded-lg px-4 py-2 mb-4">
                            <span className="text-sm font-bold text-indigo-800">NSIL</span>
                            <span className="text-indigo-600 ml-2">= Nexus Strategic Intelligence Layer</span>
                        </div>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            The NSIL framework operates through five interconnected layers of autonomous reasoning and five specialized
                            personas. Each layer builds on the previous, ensuring comprehensive analysis that surfaces risks, opportunities,
                            and strategic insights before stakeholders review the opportunity.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
                        <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">5-Layer Architecture</div>
                        <div className="grid md:grid-cols-5 gap-4 text-sm text-slate-700">
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-semibold">Input & Governance</div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-semibold">Multi-Agent Reasoning</div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-semibold">Quantitative Scoring</div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-semibold">Output Intelligence</div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-semibold">Continuous Learning</div>
                        </div>
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
                        <h2 className="text-3xl font-light mb-4">10-STEP PROTOCOL → OUTPUTS</h2>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-sm text-green-300 mb-4">
                            <Zap size={16} />
                            <span>Document Factory</span>
                        </div>
                        <p className="text-lg text-slate-400 max-w-4xl mx-auto">
                            Complete the guided intake protocol, and the platform generates a full suite of professional documents—investment memos, risk assessments, partnership briefs, LOI templates—each scored and fully populated with your data. <strong className="text-white">No consulting fees. No waiting weeks.</strong>
                        </p>
                        <p className="text-sm text-slate-500 mt-4">Click any step to see details</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
                            <div className="text-3xl font-light text-white">200+</div>
                            <div className="text-xs text-slate-400 mt-1">Report &amp; Document Types</div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
                            <div className="text-3xl font-light text-white">150+</div>
                            <div className="text-xs text-slate-400 mt-1">Letter Templates</div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
                            <div className="text-3xl font-light text-white">12</div>
                            <div className="text-xs text-slate-400 mt-1">Sample Reports</div>
                        </div>
                    </div>

                    <div className="mb-10 flex flex-wrap gap-3 justify-center text-xs text-slate-300">
                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">View Full Catalog</span>
                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">12 Sample Reports</span>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {[
                            { step: 1, name: "Identity & Mandate", desc: "Define your organization and strategic objectives", details: "Establishes who you are, your organizational type, mandate authority, and key strategic objectives. This step ensures the system understands your context, regulatory environment, and decision-making constraints before analysis begins." },
                            { step: 2, name: "Market & Sector Focus", desc: "Specify target industries and geographic regions", details: "Identifies your target markets, industry sectors, and geographic preferences. The system uses this to contextualize risk factors, regulatory requirements, and opportunity filters specific to your chosen domains." },
                            { step: 3, name: "Partner Persona Mapping", desc: "Define ideal counterparty characteristics", details: "Creates a detailed profile of your ideal partner including size, capabilities, cultural alignment, and strategic fit. This enables the Partner Matching Engine to score compatibility across 14 readiness levels and 8+ fit criteria." },
                            { step: 4, name: "Financial Parameters", desc: "Set investment bounds and return expectations", details: "Configures your financial envelope including minimum/maximum investment sizes, target IRR, acceptable risk tolerance, and funding sources. These parameters drive the Monte Carlo simulations and RROI calculations." },
                            { step: 5, name: "Risk Profiling", desc: "Identify and prioritize risk categories", details: "Maps your risk tolerance across 10 categories (Political, Currency, Operational, etc.). The Risk Brief generation weights concerns based on your profile, and The Skeptic persona focuses adversarial review accordingly." },
                            { step: 6, name: "Capability Assessment", desc: "Inventory your organizational strengths", details: "Documents your existing capabilities, resources, and competitive advantages. This enables gap analysis against partner requirements and ensures recommendations account for your execution capacity." },
                            { step: 7, name: "Execution Preferences", desc: "Define deal structure and timeline expectations", details: "Specifies preferred partnership structures (JV, M&A, licensing, etc.), timeline constraints, governance requirements, and exit considerations. This shapes the LOI templates and investment memo recommendations." },
                            { step: 8, name: "Governance Requirements", desc: "Outline compliance and approval frameworks", details: "Captures your internal approval processes, compliance requirements, stakeholder alignment needs, and reporting obligations. Ensures generated documents align with your organizational governance standards." },
                            { step: 9, name: "Rate & Liquidity Settings", desc: "Configure financial modeling parameters", details: "Sets currency preferences, discount rates, liquidity requirements, and stress-test scenarios. These inputs drive the probabilistic financial analysis and Value at Risk calculations." },
                            { step: 10, name: "Document Generation", desc: "Generate board-ready artifacts with audit trails", details: "Produces the complete suite of deliverables: Investment Memos, Risk Briefs, Partner Match Reports, LOI Templates, and Monte Carlo Analysis—each with full source citations and formula transparency." }
                        ].map((item) => (
                            <div 
                                key={item.step} 
                                className={`bg-slate-800 p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-700 ${expandedStep === item.step ? 'ring-2 ring-blue-400' : ''}`}
                                onClick={() => setExpandedStep(expandedStep === item.step ? null : item.step)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs text-slate-500">Step {item.step}</div>
                                    <Eye size={12} className={`${expandedStep === item.step ? 'text-blue-400' : 'text-slate-600'}`} />
                                </div>
                                <div className="font-medium text-sm mb-1">{item.name}</div>
                                <div className="text-xs text-slate-400">{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Expanded Step Detail */}
                    {expandedStep && (
                        <div className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {expandedStep}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {[
                                        "Identity & Mandate", "Market & Sector Focus", "Partner Persona Mapping",
                                        "Financial Parameters", "Risk Profiling", "Capability Assessment",
                                        "Execution Preferences", "Governance Requirements", "Rate & Liquidity Settings",
                                        "Document Generation"
                                    ][expandedStep - 1]}
                                </h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                                {[
                                    "Establishes who you are, your organizational type, mandate authority, and key strategic objectives. This step ensures the system understands your context, regulatory environment, and decision-making constraints before analysis begins.",
                                    "Identifies your target markets, industry sectors, and geographic preferences. The system uses this to contextualize risk factors, regulatory requirements, and opportunity filters specific to your chosen domains.",
                                    "Creates a detailed profile of your ideal partner including size, capabilities, cultural alignment, and strategic fit. This enables the Partner Matching Engine to score compatibility across 14 readiness levels and 8+ fit criteria.",
                                    "Configures your financial envelope including minimum/maximum investment sizes, target IRR, acceptable risk tolerance, and funding sources. These parameters drive the Monte Carlo simulations and RROI calculations.",
                                    "Maps your risk tolerance across 10 categories (Political, Currency, Operational, etc.). The Risk Brief generation weights concerns based on your profile, and The Skeptic persona focuses adversarial review accordingly.",
                                    "Documents your existing capabilities, resources, and competitive advantages. This enables gap analysis against partner requirements and ensures recommendations account for your execution capacity.",
                                    "Specifies preferred partnership structures (JV, M&A, licensing, etc.), timeline constraints, governance requirements, and exit considerations. This shapes the LOI templates and investment memo recommendations.",
                                    "Captures your internal approval processes, compliance requirements, stakeholder alignment needs, and reporting obligations. Ensures generated documents align with your organizational governance standards.",
                                    "Sets currency preferences, discount rates, liquidity requirements, and stress-test scenarios. These inputs drive the probabilistic financial analysis and Value at Risk calculations.",
                                    "Produces the complete suite of deliverables: Investment Memos, Risk Briefs, Partner Match Reports, LOI Templates, and Monte Carlo Analysis—each with full source citations and formula transparency."
                                ][expandedStep - 1]}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">BW GLOBAL ADVISORY</div>
                    <h2 className="text-3xl font-light text-slate-900 mb-4">Introducing the World’s First NSIL‑Powered Strategic Intelligence Platform</h2>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-4xl mx-auto text-left mb-6">
                        <p className="text-slate-700 leading-relaxed mb-4">
                            BW Global Advisory presents a purpose‑built, auditable intelligence platform that behaves like an expert team and delivers board‑ready outcomes in minutes. At its core is the proprietary <strong className="text-slate-900">NSIL brain</strong> — a neuro‑symbolic intelligence layer that fuses advanced pattern recognition with formal, explainable logic. This is not a generic chatbot; it is a governed, falsifiable decision system you can trust.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            The platform ingests your brief, validates inputs, spawns an adversarial, multi‑persona debate, applies proprietary scoring and scenario engines, and delivers auditable artifacts—term sheets, LOIs, executive summaries, and explainability contracts that show exactly why each recommendation was made.
                        </p>
                        <p className="text-green-700 font-semibold mb-2">
                            <Zap size={18} className="inline-block mr-2 text-green-500" />
                            <span>Now with Frontier Intelligence — 10 Next‑Gen Capabilities</span>
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 text-sm mb-2">
                            <li><strong>Agentic Self‑Learning</strong> — Institutional memory and continuous learning for improved recommendations.</li>
                            <li><strong>Adversarial Multi‑Persona Reasoning</strong> — Boardroom‑style debate to reveal failure modes and decision drivers.</li>
                            <li><strong>Autonomous Negotiation Simulation</strong> — Multi‑round negotiation modelling with term‑sheet outputs and outcome probabilities.</li>
                            <li><strong>Explainability Contracts</strong> — Inputs, formulas, confidence and citations accompany every conclusion for audit readiness.</li>
                            <li><strong>Synthetic Foresight (128 Scenarios)</strong> — Deep scenario stress‑testing and instant impact propagation.</li>
                            <li><strong>Stakeholder Simulation</strong> — Models influence pathways and persuasion dynamics across stakeholders.</li>
                            <li><strong>Multimodal Fusion</strong> — Integrates text, numeric, geospatial and temporal signals into unified insights.</li>
                            <li><strong>What‑If Sandbox</strong> — Instant scenario adjustments with system‑wide propagation.</li>
                            <li><strong>Governance Auto‑Update</strong> — Proposes governance and compliance updates when conditions change.</li>
                        </ul>
                        <p className="text-slate-700 text-xs mt-4">
                            <strong>Update: January 2026 —</strong> All 10 frontier capabilities are now fully integrated, making BWGA AI the most advanced, auditable, and proactive decision‑support platform for cross‑border investment and partnership intelligence.
                        </p>
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

            {/* Beta Access & Partnership */}
            <section className="py-16 px-8 bg-gradient-to-br from-slate-100 to-slate-200 border-t border-slate-300">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-slate-600 mb-6 shadow-sm border border-slate-200">
                        <Shield size={16} className="text-blue-500" />
                        <span>BWGA Intelligence AI</span>
                    </div>
                    
                    <h2 className="text-3xl font-light text-slate-900 mb-2">
                        Strategic Partnership Intelligence
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                        BW Global Advisory is an Australian strategic intelligence firm developing sovereign-grade 
                        AI systems for cross-border investment and regional economic development.
                    </p>

                    <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 max-w-xl mx-auto">
                        <h3 className="text-xl font-medium text-slate-900 mb-2">
                            Beta Support Contribution
                        </h3>
                        <div className="text-4xl font-light text-slate-900 mb-4">
                            $100 <span className="text-lg text-slate-500">AUD</span>
                        </div>
                        
                        <ul className="text-sm text-slate-600 text-left mb-6 space-y-2 max-w-xs mx-auto">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">&#10003;</span>
                                <span>Early access to BWGA Intelligence AI beta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">&#10003;</span>
                                <span>Priority onboarding and setup support</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">&#10003;</span>
                                <span>Direct feedback channel with development team</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">&#10003;</span>
                                <span>100% refundable if not accepted into beta</span>
                            </li>
                        </ul>

                        <button 
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <CreditCard size={18} />
                            Join Beta Program
                        </button>

                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            This is a beta support contribution, not an investment or equity purchase.<br />
                            Full refund available if your application is not accepted.
                        </p>
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

            {/* Recent Updates Section - 16/01/2026 */}
            <section className="py-16 px-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-sm text-green-300 mb-4">
                            <Zap size={16} />
                            <span>System Update</span>
                        </div>
                        <h2 className="text-3xl font-light mb-4">Recent Updates — 16 January 2026</h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                            Major platform enhancement introducing <strong className="text-white">Frontier Intelligence Capabilities</strong> — 
                            ten next-generation features that transform BWGA AI into a more advanced, autonomous, and predictive system.
                        </p>
                    </div>

                    {/* What Changed Overview */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-10">
                        <h3 className="text-xl font-semibold mb-4 text-center">What This Update Delivers</h3>
                        <p className="text-slate-300 text-center max-w-3xl mx-auto mb-6">
                            The January 2026 update introduces the <strong className="text-white">FrontierIntelligenceEngine</strong> — a new computational layer that adds 
                            autonomous negotiation simulation, multi-persona evolution tracking, institutional memory, regulatory monitoring, 128-scenario foresight analysis, 
                            stakeholder influence mapping, explainability contracts, multimodal fusion, what-if sandboxing, and governance auto-update capabilities. 
                            These features work together to provide unprecedented depth in strategic decision support.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <span>All 10 frontier capabilities integrated into the main analysis pipeline</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <span>Deterministic seeded RNG ensures reproducible results across sessions</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <span>Full integration with OptimizedAgenticBrain and ReportOrchestrator</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <span>Live insights now include frontier intelligence in real-time</span>
                            </div>
                        </div>
                    </div>

                    {/* The 10 Frontier Capabilities */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-blue-400">1</div>
                                <h4 className="font-semibold">Autonomous Negotiation Simulation</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Simulates multi-round negotiations between parties, generating term sheets, tracking concessions, and predicting outcomes with confidence scores. 
                                Models strategic bargaining positions and identifies optimal deal structures.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-purple-400">2</div>
                                <h4 className="font-semibold">Persona Evolution Tracking</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Tracks how each of the 5 AI personas' positions evolve across analysis phases. Captures initial stance, evidence-driven shifts, 
                                final positions, and the key factors that influenced each persona's conclusions.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-green-400">3</div>
                                <h4 className="font-semibold">Institutional Memory</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Learns from similar past deals to provide contextual intelligence. Surfaces precedent cases, historical lessons, 
                                sector-specific insights, and pattern-based recommendations based on accumulated organizational knowledge.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-amber-400">4</div>
                                <h4 className="font-semibold">Regulatory Pulse</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Monitors regulatory environments in real-time. Tracks recent changes, pending legislation, enforcement trends, 
                                and compliance requirements specific to your target jurisdictions and sectors.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-red-400">5</div>
                                <h4 className="font-semibold">Synthetic Foresight (128 Scenarios)</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Generates 128 synthetic future scenarios using Monte Carlo-style simulation. Each scenario models different combinations of 
                                market conditions, regulatory changes, and execution outcomes to stress-test strategic assumptions.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-cyan-400">6</div>
                                <h4 className="font-semibold">Stakeholder Simulation</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Maps stakeholder positions, influence levels, and potential reactions. Simulates how different stakeholder groups 
                                might respond to proposals, identifying allies, blockers, and persuasion strategies.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-pink-400">7</div>
                                <h4 className="font-semibold">Explainability Contracts</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Every analytical conclusion includes a formal explainability contract: input factors, calculation methodology, 
                                confidence intervals, known limitations, and conditions under which the conclusion would change.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-orange-400">8</div>
                                <h4 className="font-semibold">Multimodal Fusion</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Integrates multiple data modalities (text, numerical, geospatial, temporal) into unified intelligence. 
                                Weights different sources by reliability and recency, producing coherent cross-modal insights.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-teal-400">9</div>
                                <h4 className="font-semibold">What-If Sandbox</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Interactive scenario modeling environment. Adjust key variables (investment size, timeline, partner profile) 
                                and instantly see how changes propagate through all scoring formulas and risk assessments.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-lime-400">10</div>
                                <h4 className="font-semibold">Governance Auto-Update</h4>
                            </div>
                            <p className="text-sm text-slate-400">
                                Automatically proposes governance framework updates based on detected regulatory changes, emerging best practices, 
                                and institutional learning. Ensures compliance frameworks stay current without manual intervention.
                            </p>
                        </div>
                    </div>

                    {/* System Architecture Changes */}
                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-xl p-8 mb-10">
                        <h3 className="text-xl font-semibold mb-6 text-center">How This Changes the Overall System</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-light text-blue-400 mb-2">Before</div>
                                <p className="text-sm text-slate-400">
                                    5 personas + 27 formulas + 100 simulations. Powerful but reactive—analysis based on current inputs only.
                                </p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                                <ArrowRight size={32} className="text-green-400" />
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-light text-green-400 mb-2">After</div>
                                <p className="text-sm text-slate-400">
                                    Same foundation + 10 frontier capabilities + 128 foresight scenarios. Proactive, predictive, and self-improving.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 grid md:grid-cols-4 gap-4 text-center">
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-2xl font-light text-white">10</div>
                                <div className="text-xs text-slate-400">New Capabilities</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-2xl font-light text-white">128</div>
                                <div className="text-xs text-slate-400">Foresight Scenarios</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-2xl font-light text-white">15+</div>
                                <div className="text-xs text-slate-400">New Type Definitions</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-2xl font-light text-white">567</div>
                                <div className="text-xs text-slate-400">Lines of New Code</div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Implementation */}
                    <div className="bg-slate-800 rounded-lg p-6">
                        <h4 className="font-semibold mb-4 text-center">Technical Implementation Summary</h4>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h5 className="text-blue-400 font-medium mb-2">New Engine</h5>
                                <ul className="space-y-1 text-slate-400">
                                    <li>• <code className="text-xs bg-slate-700 px-1 rounded">FrontierIntelligenceEngine.ts</code> — Core frontier intelligence module</li>
                                    <li>• Exports <code className="text-xs bg-slate-700 px-1 rounded">computeFrontierIntelligence()</code> function</li>
                                    <li>• Deterministic seeded RNG for reproducibility</li>
                                    <li>• Full integration with existing algorithm suite</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-purple-400 font-medium mb-2">Integration Points</h5>
                                <ul className="space-y-1 text-slate-400">
                                    <li>• <code className="text-xs bg-slate-700 px-1 rounded">OptimizedAgenticBrain.ts</code> — Phase 6 frontier computation</li>
                                    <li>• <code className="text-xs bg-slate-700 px-1 rounded">ReportOrchestrator.ts</code> — Frontier data in report payloads</li>
                                    <li>• <code className="text-xs bg-slate-700 px-1 rounded">MultiAgentBrainSystem.ts</code> — Live
                </p>
            </footer>
        </div>
    );
};

export default CommandCenter;
