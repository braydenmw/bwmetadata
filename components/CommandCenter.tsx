import React, { useState } from 'react';
import type { EcosystemPulse } from '../services/EventBus';
import {
    ArrowRight,
    CheckCircle2,
    Lock,
    Play,
    ShieldAlert,
    BookOpen,
    X,
    Brain,
    Database,
    Layers,
    Users,
    Activity,
    Scale,
    FileText,
    GraduationCap,
    Briefcase,
    Target,
    Cpu,
    GitBranch
} from 'lucide-react';

interface CommandCenterProps {
    ecosystemPulse?: EcosystemPulse;
    onOpenReportGenerator: () => void;
}

// ============================================================================
// FORMULA REFERENCE PAPER MODAL (Word-style)
// ============================================================================
const FormulaDeepDiveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-slate-50 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                            <Brain className="w-5 h-5 text-slate-900" />
                        </div>
                        <div>
                            <div className="text-slate-950 font-bold text-lg">BW Nexus AI: System Whitepaper</div>
                            <div className="text-slate-600 text-xs">The Architecture of Agentic Regional Intelligence</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded hover:bg-slate-100">
                        <X className="w-5 h-5 text-slate-700" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto px-8 py-10 prose prose-slate prose-sm lg:prose-base">
                        
                        <h2 className="text-3xl font-serif !text-slate-900">BW Nexus AI: A Hybrid Intelligence Platform</h2>
                        <p>BW Nexus AI is best understood as a hybrid platform that merges the analytical mind of a top-tier consulting firm with the productive power of a high-end document automation factory. It is a unified environment designed to guide a user from the earliest stages of strategic conception all the way through to the generation of execution-ready deliverables. The system is architected to perform two primary functions in a continuous loop: <strong>Analysis</strong> and <strong>Execution</strong>.</p>
                        <p>The <strong>Analysis function</strong> is driven by the NSIL brain, which ingests user inputs and transforms them into a live decision model. This model produces a rich tapestry of diagnostic outputs: quantitative scores with confidence bands, qualitative narratives explaining the "why" behind the numbers, adversarial debate logs, and probabilistic stress tests. The goal of this function is to achieve strategic clarity and build unshakeable confidence in the chosen path.</p>
                        <p>The <strong>Execution function</strong> takes this validated strategy and translates it into the practical instruments needed to bring it to life. The platform's Document Factory can auto-generate a vast library of over 200 document types and 150 letter templates across 14 categories—from legal frameworks like Letters of Intent and Term Sheets to financial models, investor pitch decks, and government outreach correspondence. This seamless integration of analysis and execution eliminates the friction and delay that typically exists between making a decision and acting on it.</p>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">The 9-Section Comprehensive Intake Framework: Rigor from the Start</h3>
                        <p>The quality of any analysis is dictated by the quality of its inputs. To ensure maximum rigor, BW Nexus AI utilizes a 9-section comprehensive intake framework that guides the user through a structured process of strategic definition. This is not a simple form; it is a professional-grade system development framework that forces the user to consider every critical dimension of their plan. The nine sections are:</p>
                        <ol>
                            <li><strong>Identity & Foundation:</strong> Establishes organizational credibility.</li>
                            <li><strong>Mandate & Strategy:</strong> Defines the vision and measures of success.</li>
                            <li><strong>Market & Context:</strong> Analyzes the external forces at play.</li>
                            <li><strong>Partners & Ecosystem:</strong> Evaluates partner fit and stakeholder landscape.</li>
                            <li><strong>Financial Model:</strong> Builds a complete, multi-scenario financial picture.</li>
                            <li><strong>Risk & Mitigation:</strong> Systematically identifies and plans for risks.</li>
                            <li><strong>Resources & Capability:</strong> Audits the team's ability to execute.</li>
                            <li><strong>Execution Plan:</strong> Creates a realistic, gated implementation roadmap.</li>
                            <li><strong>Governance & Monitoring:</strong> Establishes ongoing decision-making structures.</li>
                        </ol>
                        <p>This structured intake does more than just collect data; it forces strategic clarity. A built-in validation engine scores the completeness of the intake, providing a "Readiness Score" that prevents users from proceeding with a half-baked plan. This ensures that the NSIL brain is always working with a comprehensive, well-considered set of inputs, dramatically improving the accuracy and relevance of its outputs.</p>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">The Document Factory: From Analysis to Actionable Deliverables</h3>
                        <p>A validated strategy is useless if it remains trapped in a dashboard. The BW Nexus AI platform includes a powerful Document Factory designed to convert analytical insights into professional, execution-ready deliverables instantly. This capability closes the gap between decision and action, enabling teams to move with unprecedented speed.</p>
                        <p>The platform's library contains over 200 unique document types and 150 letter templates across 14 distinct categories, covering the full spectrum of strategic, legal, financial, and operational needs. This includes, but is not limited to:</p>
                        <ul>
                            <li><strong>Foundation Documents:</strong> Letters of Intent (LOI), Memorandums of Understanding (MOU), Non-Disclosure Agreements (NDA), Term Sheets.</li>
                            <li><strong>Strategic Documents:</strong> Business Cases, Feasibility Studies, White Papers, Market Entry Strategies.</li>
                            <li><strong>Financial & Investment Documents:</strong> Full Financial Models, Private Placement Memorandums (PPM), Valuation Reports, Monte Carlo Simulations.</li>
                            <li><strong>Risk & Due Diligence Documents:</strong> Comprehensive Due Diligence Reports, AML/KYC Checklists, Sanctions Screening Reports.</li>
                            <li><strong>Government & Policy Documents:</strong> Policy Briefs, Cabinet Memos, Public-Private Partnership (PPP) Frameworks.</li>
                        </ul>
                        <p>When a user requests a document, the system automatically populates the template with the relevant data and analysis from their live model, producing a production-ready draft in seconds. This capability transforms the platform from a mere analytical tool into a true execution engine.</p>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">Adaptive Elevation: A Platform for All Skill Levels</h3>
                        <p>Recognizing that strategic initiatives involve stakeholders with varying levels of expertise, BW Nexus AI is built with an "Adaptive Elevation" interface. The system intelligently adjusts the guidance, controls, and data presentation based on the user's profile.</p>
                        <ul>
                            <li><strong>For Beginners (e.g., early-stage founders, junior analysts):</strong> The system provides detailed, step-by-step guidance, explains complex concepts with examples, and proactively suggests fields to consider. The interface is supportive and educational, designed to build capability as well as analyze a plan.</li>
                            <li><strong>For Operators (e.g., project managers, growth teams):</strong> The platform presents structured workflows, operational checklists, and detailed implementation plans. The focus is on execution feasibility, resource allocation, and timeline management.</li>
                            <li><strong>For Executives (e.g., CEOs, investors, government ministers):</strong> The system delivers compressed analytics, high-level dashboards, and direct controls. It surfaces the most critical insights and decision points, allowing for rapid assessment and decisive action.</li>
                        </ul>
                        <p>This adaptive approach ensures that every user, regardless of their role or experience level, receives the precise level of detail and control they need to be effective, making BW Nexus AI a single, unified platform for the entire organization.</p>

                        <h2 className="text-2xl font-serif !text-slate-900 mt-16">Introduction to the Nexus Strategic Intelligence Layer (NSIL)</h2>
                        <p>The true heart of the BW Nexus AI platform is the Nexus Strategic Intelligence Layer, or NSIL. It is what elevates the system from a sophisticated calculator to a genuine reasoning partner. NSIL is not a single algorithm but a complex, multi-layered architecture designed to mimic the cognitive processes of a diverse team of human experts. When a user submits their strategic plan, NSIL does not just store the inputs; it ingests them into a structured state, builds a dynamic simulation of the plan's ecosystem, and then begins a rigorous process of challenge, analysis, and refinement. The goal of NSIL is to produce recommendations that are not only mathematically sound but also strategically resilient, ethically considered, and operationally feasible. Its architecture is designed for full transparency, ensuring that every conclusion can be audited and traced back to its underlying evidence—the antithesis of a "black box" system.</p>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">The Five-Layer Autonomous Reasoning Stack</h3>
                        <p>NSIL's power comes from its unique five-layer reasoning stack. These are not deep, monolithic layers but rather thin, orchestrated reasoning shells that wrap around the core mathematical engines. This design preserves the explainability of the underlying formulas while enabling highly sophisticated adversarial and counterfactual reasoning. The process flows sequentially through these five layers.</p>
                        <div className="space-y-4 mt-6">
                            <details className="bg-white p-4 rounded-lg border border-slate-200" open>
                                <summary className="font-bold cursor-pointer text-base">Layer 1: The Adversarial Input Shield (Pre-Flight Validation)</summary>
                                <p className="mt-2 text-slate-700">Before any analysis begins, every piece of user-provided information passes through the Input Shield. This layer acts as a gatekeeper, protecting the integrity of the entire system. It cross-references claims against external authoritative data sources, such as World Bank governance indicators, OFAC sanctions lists, and real-time market data. It checks for internal contradictions within the user's plan, flags high-risk patterns associated with fraud or over-optimism, and ensures all critical context is present. Weak or suspicious inputs are flagged with clear explanations, preventing the "garbage in, garbage out" problem that plagues so many analytical systems.</p>
                            </details>
                            <details className="bg-white p-4 rounded-lg border border-slate-200">
                                <summary className="font-bold cursor-pointer text-base">Layer 2: The Multi-Perspective Reasoning Engine (The Persona Debate)</summary>
                                <p className="mt-2 text-slate-700">Once inputs are validated, NSIL spawns five distinct AI "personas," each programmed with a different cognitive motivation. These personas evaluate the strategic plan in parallel, creating a structured, evidence-backed debate. This adversarial process is designed to systematically eliminate cognitive biases and illuminate the problem from all possible angles. The findings of this debate form the qualitative core of the system's analysis.</p>
                            </details>
                            <details className="bg-white p-4 rounded-lg border border-slate-200">
                                <summary className="font-bold cursor-pointer text-base">Layer 3: The Counterfactual Lab (Answering "What If?")</summary>
                                <p className="mt-2 text-slate-700">NSIL then moves beyond analyzing the proposed plan to simulating alternative realities. The Counterfactual Lab automatically generates and evaluates a range of different scenarios. It answers critical "what if" questions: What if the primary assumptions are wrong? What if market conditions shift dramatically? What if we choose a different partner? What if we do nothing at all? The lab produces scenario deltas, probability distributions, and a "regret analysis" that quantifies the potential cost of making the wrong choice. This provides decision-makers with a full understanding of the trade-offs and the robustness of their chosen strategy.</p>
                            </details>
                            <details className="bg-white p-4 rounded-lg border border-slate-200">
                                <summary className="font-bold cursor-pointer text-base">Layer 4: The Scoring Engines (The Mathematical Core)</summary>
                                <p className="mt-2 text-slate-700">With the benefit of the validated inputs, persona debate, and counterfactual analysis, the system then runs its full suite of 21 proprietary mathematical formulas. These engines produce the hard quantitative scores for the plan, including the overall Success Probability Index (SPI™), Regional Return on Investment (RROI™), and Strategic Cash Flow (SCF™). Because these calculations are run after the adversarial and counterfactual analysis, the inputs are far more robust and the resulting scores are a more accurate reflection of reality.</p>
                            </details>
                            <details className="bg-white p-4 rounded-lg border border-slate-200">
                                <summary className="font-bold cursor-pointer text-base">Layer 5: The Learning Loop (Continuous Improvement)</summary>
                                <p className="mt-2 text-slate-700">The final layer ensures that NSIL is not a static system but one that continuously learns and improves. It tracks the user's decisions, and later, the real-world outcomes of those decisions. By comparing its predictions to actual results, the system recalibrates the internal weightings of its mathematical models, identifies patterns of success and failure, and measures its own over- or under-confidence. This feedback loop allows the platform's accuracy and predictive power to grow with every engagement.</p>
                            </details>
                        </div>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">How Personas Work: The Skeptic, Advocate, Regulator, Accountant, and Operator</h3>
                        <p>The Multi-Perspective Reasoning Engine is central to NSIL's ability to overcome bias. The five personas are:</p>
                        <ul>
                            <li><strong>The Skeptic:</strong> This persona's sole motivation is to find the reasons a plan will fail. It actively searches for deal-killers, unstated assumptions, over-optimism, and hidden downside risks. It constructs and analyzes the worst-case scenario and calculates the overall probability of failure.</li>
                            <li><strong>The Advocate:</strong> As a direct counterpoint to the Skeptic, the Advocate's motivation is to find all potential upside. It identifies hidden synergies, optionality, and strategic levers that could be used to increase value. It constructs the best-case scenario and seeks to uncover opportunities that others may have missed.</li>
                            <li><strong>The Regulator:</strong> This persona is concerned with legality, ethics, and compliance. It checks the proposed plan against sanctions lists, legal precedents, and regulatory requirements in the target jurisdiction. It estimates clearance timelines and flags any potential ethical or compliance-related concerns.</li>
                            <li><strong>The Accountant:</strong> Focused on economic durability, the Accountant validates all financial projections. It stress-tests cash flow models, analyzes margin integrity, calculates break-even timing, and provides an overall rating of the plan's financial viability.</li>
                            <li><strong>The Operator:</strong> This persona is grounded in the realities of execution. It tests the plan's feasibility by examining the required team capabilities, supply chain robustness, and infrastructure needs. It identifies operational gaps and assesses the realism of the implementation plan.</li>
                        </ul>
                        <p>The outputs from these five personas are then synthesized. Agreements between them form the basis for high-confidence recommendations. Disagreements are explicitly recorded and presented to the user as key decision points, ensuring that uncertainty is made transparent, not hidden behind a veneer of false certainty.</p>

                        <h3 className="text-xl font-serif !text-slate-900 mt-12">How NSIL Learns: Motivation Detection, Outcome Tracking, and Calibration</h3>
                        <p>NSIL's ability to improve over time is driven by a sophisticated learning architecture. This is not abstract machine learning, but a structured, auditable process.</p>
                        <ul>
                            <li><strong>Motivation Detection:</strong> The system learns the user's individual decision-making profile. It observes which types of evidence the user prioritizes, their tolerance for risk, and their strategic goals. Over time, it adjusts how it frames insights to be most effective for that specific user, for example, by leading with the quantitative data for an analytical user or with the strategic narrative for a visionary one.</li>
                            <li><strong>Outcome Tracking:</strong> This is the core of the learning loop. The platform allows users to record the actual outcomes of their decisions. Did the partnership succeed? What was the actual ROI? How long did activation really take? This real-world data is the ground truth against which the system's predictions are measured.</li>
                            <li><strong>Calibration:</strong> By comparing its predictions to these outcomes, NSIL continuously recalibrates the internal weights of its scoring models. It identifies where its forecasts were overconfident or underconfident and adjusts its algorithms accordingly. This process is transparent, with the system providing "Learning Insights" that explain what has been adjusted and why, ensuring the user always understands how the system's "thinking" is evolving.</li>
                        </ul>
                        <p>This multi-faceted learning process ensures that BW Nexus AI is not a static tool but a true partner that grows smarter and more attuned to the user's context with every single decision.</p>

                        <h2 className="text-2xl font-serif !text-slate-900 mt-16">The Mathematical Core: The 21 Proprietary Formulas</h2>
                        <p>A core philosophy of BW Nexus AI is that the most robust decisions arise from the fusion of rigorous quantitative analysis and nuanced qualitative insight. The platform operationalizes this by pairing every mathematical output with AI-written narratives that explain the results in plain language. The numbers provide the objective "what," while the narratives, informed by the persona debates, provide the contextual "why." This ensures that users are never left staring at a score without understanding the drivers behind it. The system's mathematical framework is built upon 21 proprietary formulas, comprising 5 primary engines and 16 derivative models, all designed to work in concert to provide a holistic view of any strategic initiative which incorporate the Agentic Brain and the NSIL together.</p>

                        <div className="mt-8 text-xs text-slate-500 text-center">
                            © 2025 BW Global Advisory. This whitepaper describes proprietary methods and is provided for explanation and user orientation.
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-end flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800">
                        Close Whitepaper
                    </button>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 ${className}`}>
        {children}
    </div>
);

const CommandCenter: React.FC<CommandCenterProps> = ({ onOpenReportGenerator }) => {
    const [accepted, setAccepted] = useState(false);
    const [showFormulaModal, setShowFormulaModal] = useState(false);

    return (
        <div className="flex-1 w-full h-full min-h-0 overflow-y-auto bg-slate-100 font-sans text-slate-800 custom-scrollbar">
            <div className="max-w-6xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 space-y-16">

                {/* 1. Header & The Big Idea */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 leading-tight mb-14 pb-2">
                        BW Nexus AI — Proactive Agentic Intelligence OS
                    </h1>

                    <div className="mt-10 mb-4">
                        <p className="text-lg md:text-xl text-blue-900 max-w-3xl mx-auto font-semibold mb-4">
                            A new era for regional development intelligence.
                        </p>

                        <p className="text-base md:text-lg max-w-3xl mx-auto mb-4 text-blue-900">
                            Around the world, a persistent <span className="font-bold text-blue-900">Global Understanding Gap</span> obscures genuine opportunity.
                        </p>

                        <p className="text-base md:text-lg max-w-3xl mx-auto mb-4 text-blue-900">
                            Fueled by fragmented data, outdated perceptions, and a lack of investor-grade tools, this gap systematically hinders development in the regional economies that form the backbone of national prosperity.
                        </p>

                        <p className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed mt-6">
                            BW Nexus AI is not a passive dashboard and not a standard chatbot. It is a proactive, agentic digital worker that begins reasoning the moment you start engaging — via your BW Consultant — listening, learning context, and responding with structured, decision-grade intelligence.<br/>
                            Built 100% for regional development connection, it helps reduce the misunderstanding of places and break away from typical markets.<br/>
                            The goal is simple: turn a mandate into clarity, fast, with explainable math and traceable reasoning.
                        </p>
                    </div>
                </div>

                {/* 1.5 About BWGA (short, not a book) */}
                <Section>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Built by BW Global Advisory</h2>
                        <p className="text-slate-600 mt-2 max-w-4xl mx-auto leading-relaxed">
                            BW Global Advisory (BWGA) is an independent Australian initiative, founded and solely developed by <strong>Brayden Walls</strong>.
                            It was born from immersive, on‑the‑ground research in regional Philippines — and the lived reality of what actually breaks deals and stalls development — translated into a repeatable system.
                        </p>
                    </div>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-5 rounded-lg border border-slate-200 border-l-4 border-blue-400">
                            <h4 className="font-semibold text-blue-800">Mission</h4>
                            <p className="text-xs text-blue-700 mt-1">To bridge the Global Understanding Gap by providing AI‑enhanced intelligence that illuminates regional economic potential, facilitates symbiotic partnerships, and ensures community‑centered development outcomes.</p>
                        </div>
                        <div className="bg-emerald-50 p-5 rounded-lg border border-slate-200 border-l-4 border-emerald-400">
                            <h4 className="font-semibold text-emerald-800">Ethical AI‑Human Symbiosis</h4>
                            <p className="text-xs text-emerald-700 mt-1">AI amplifies human insight, but human expertise remains indispensable for context, ethics, and trust. Nexus AI is designed to <strong>augment, not replace</strong>, human judgment.</p>
                        </div>
                    </div>
                </Section>

                {/* 2. The Clarity Engine & 9-Step Intake */}
                <div id="workflow">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900">Your Clarity Engine: From Mandate to Intelligence in Minutes</h2>
                        <p className="text-slate-600 mt-2 max-w-3xl mx-auto">
                            BW Nexus AI is a proactive digital worker that transforms strategic goals into investor-ready intelligence through a simple workflow.
                            Inside the platform, you work in a <strong>live workspace</strong>. The moment you start, you and your BW Consultant begin building a living draft. Every selection becomes structured material that compiles into multi-page deliverables.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-white via-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm text-left max-w-5xl mx-auto mb-10">
                        <div className="text-slate-900 font-bold text-lg">Example (regional investment)</div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2 text-slate-600 text-sm leading-relaxed">
                                A regional city may be trying to attract investment into industries like <span className="font-semibold text-slate-800">agribusiness</span>, <span className="font-semibold text-slate-800">clean energy</span>, <span className="font-semibold text-slate-800">logistics</span>, or <span className="font-semibold text-slate-800">tourism</span> — but faces fragmented information, outdated perceptions, and uncertainty about partners, approvals, and timelines.
                                Nexus turns the mandate into a structured case: a draft narrative is built live as you complete the intake, then refined into an outreach pack that can help “break the ice” with investors and partners.
                            </div>
                            <div className="col-span-1 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-300">
                                <div className="text-xs text-blue-800 font-semibold">Use Case</div>
                                <div className="text-xs text-blue-700 mt-1">Live intake → structured case → outreach pack to engage partners and investors.</div>
                            </div>
                        </div>
                    </div>

                    <Section>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900">The 9-Step System Development Intake (What You Fill In)</h3>
                            <p className="text-slate-600 mt-2 max-w-4xl mx-auto">
                                These are the nine structured sections inside the platform. Your selections here become the raw material for debate, scoring, and the final deliverables.
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">1. Identity</div>
                                <div className="text-xs text-slate-500 mt-1">Captures org type/stage, capacity bands, and mission ownership/clearance context.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> entity baseline + constraints anchor for the entire case.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">2. Mandate</div>
                                <div className="text-xs text-slate-500 mt-1">Defines vision, horizon, weighted objectives, problem statement, and non‑negotiables.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> mandate brief + objective weighting for scoring.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">3. Market</div>
                                <div className="text-xs text-slate-500 mt-1">Sets geographies, trends, barriers, infrastructure, and opportunity sizing assumptions.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> market readiness drivers + evidence checklist.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">4. Partners</div>
                                <div className="text-xs text-slate-500 mt-1">Defines archetypes, stakeholder influence vs alignment, dependencies, and partner profile.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> SEAM stakeholder map inputs + partner‑fit criteria.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">5. Financial</div>
                                <div className="text-xs text-slate-500 mt-1">Builds scenarios, capex/opex assumptions, incentives, payback and return bands.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> RROI ranges + scenario table + viability narrative.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">6. Risks</div>
                                <div className="text-xs text-slate-500 mt-1">Captures categories, likelihood/impact, mitigation actions, owners, and monitoring.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> risk register + mitigation plan + red‑flag list.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">7. Capabilities</div>
                                <div className="text-xs text-slate-500 mt-1">Assesses team depth, technical maturity, capability gaps, and support needs.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> capability assessment + gap‑closure plan.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">8. Execution</div>
                                <div className="text-xs text-slate-500 mt-1">Defines phased roadmap, gates, owners, budgets, buffers, and activation sequencing.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> implementation roadmap + IVAS activation profile.</div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <div className="font-semibold text-slate-800">9. Governance</div>
                                <div className="text-xs text-slate-500 mt-1">Sets decision rights, cadence, KPIs, compliance checks, and accountability structure.</div>
                                <div className="text-xs text-slate-700 mt-2"><strong>Creates:</strong> governance operating model + audit trail backbone.</div>
                            </div>
                        </div>
                        <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 flex items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="text-slate-900 font-bold">What this produces (simply)</div>
                                <div className="text-slate-700 text-sm mt-2 leading-relaxed">
                                    A complete, investor‑grade deliverable pack: an executive summary, scorecards (SPI™, RROI™, SEAM™, IVAS™, SCF™), debate outcomes, a risk register, and an implementation narrative — structured for boards, partners, and regulators.
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => setShowFormulaModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>Explore Full Methodology & 21 Formulas</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-10 text-slate-900 font-bold text-lg text-center">How the 9-Step Intake Becomes a Living, Auditable Report</div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            <strong>Structure:</strong> Your intake becomes a case model (objectives, constraints, stakeholders, scenarios, risks, execution, governance).<br/>
                            <strong>Validate:</strong> The system flags missing constraints, contradictions, and uncertainty so you can see what must be verified.<br/>
                            <strong>Debate:</strong> Five specialist personas pressure‑test upside, downside, compliance, unit economics, and feasibility.<br/>
                            <strong>Stress‑test:</strong> Counterfactual “what if?” checks expose fragility, timeline risk, and dependency failures.<br/>
                            <strong>Score:</strong> The 21‑formula suite quantifies drivers, pressure points, and confidence from your inputs.<br/>
                            <strong>Synthesize:</strong> Narratives, section plans, and templates are assembled for your target audience (boards, partners, regulators).<br/>
                            <strong>Deliver:</strong> The draft compiles into multi‑page intelligence reports, comparisons, and outreach letters designed to break the ice.<br/>
                            Throughout the workflow, Nexus maintains an <strong>assumptions + verification register</strong> (what’s known, what’s uncertain, and what must be validated) so partners and decision‑makers can see exactly where confidence comes from.
                        </div>
                        <div className="mt-10 text-slate-900 font-bold text-lg text-center">Adaptive Elevation: A Platform for All Skill Levels</div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            Recognizing that strategic initiatives involve stakeholders with varying levels of expertise, BW Nexus AI is built with an "Adaptive Elevation" interface. The system intelligently adjusts the guidance, controls, and data presentation based on the user's profile.
                            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6 mb-4">
                                <div className="flex-1 bg-blue-50 border-l-4 border-blue-400 rounded-md p-4 shadow-sm">
                                    <div className="font-bold text-blue-700 text-base mb-1">For Beginners</div>
                                    <div className="text-slate-700 text-sm">The system provides detailed, step-by-step guidance, explains complex concepts with examples, and proactively suggests fields to consider. The interface is supportive and educational, designed to build capability as well as analyze a plan.</div>
                                </div>
                                <div className="flex-1 bg-green-50 border-l-4 border-green-400 rounded-md p-4 shadow-sm">
                                    <div className="font-bold text-green-700 text-base mb-1">For Operators</div>
                                    <div className="text-slate-700 text-sm">The platform presents structured workflows, operational checklists, and detailed implementation plans. The focus is on execution feasibility, resource allocation, and timeline management.</div>
                                </div>
                                <div className="flex-1 bg-yellow-50 border-l-4 border-yellow-400 rounded-md p-4 shadow-sm">
                                    <div className="font-bold text-yellow-700 text-base mb-1">For Executives</div>
                                    <div className="text-slate-700 text-sm">The system delivers compressed analytics, high-level dashboards, and direct controls. It surfaces the most critical insights and decision points, allowing for rapid assessment and decisive action.</div>
                                </div>
                            </div>
                            <div className="mt-2">
                                This adaptive approach ensures that every user, regardless of their role or experience level, receives the precise level of detail and control they need to be effective, making BW Nexus AI a single, unified platform for the entire organization.
                            </div>
                        </div>
                        <div className="mt-10 text-slate-900 font-bold text-lg text-center">The Document Factory: Instant, Professional Deliverables</div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            The BW Nexus AI platform includes a powerful Document Factory designed to convert analytical insights into professional, execution-ready deliverables instantly. This capability closes the gap between decision and action, enabling teams to move with unprecedented speed.<br/>
                            The platform's library contains over 200 unique document types and 150 letter templates across 14 distinct categories, covering the full spectrum of strategic, legal, financial, and operational needs.
                        </div>
                        <div className="mt-10 text-slate-900 font-bold text-lg text-center">Inside the Agentic Brain: The Heart and Brains of Why This All Works</div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            <p className="mb-4">
                                The Agentic Brain is the operating “digital worker” inside BW Nexus AI that does the end-to-end work of turning a person’s raw context into a structured, decision‑grade deliverable pack. It is not a chatbot that waits for a prompt and returns a single answer; it is an orchestrated workflow engine that continuously builds a case as the user engages.
                            </p>
                            <p className="mb-4 border-l-4 border-blue-200 pl-4 bg-blue-50">
                                The Agentic Brain’s job is to take messy real-world information—goals, constraints, political realities, partner dynamics, uncertainty, and incomplete data—and convert it into a structured case model that can be validated, pressure‑tested, quantified, and written into a report that survives scrutiny. It behaves like an internal advisory team compressed into a repeatable system: it asks for missing constraints, challenges assumptions, proposes alternatives, and progresses the work instead of passively responding.
                            </p>
                            <p>
                                The Agentic Brain uses the 9-step intake as its structured data foundation, because this is what makes the system computable and repeatable. Each step captures a category of decision information (Identity, Mandate, Market, Partners, Financial, Risks, Capabilities, Execution, Governance) and converts it into structured variables: objectives and weights, constraints, scenarios, assumptions, evidence requirements, stakeholders and influence, risk items and mitigations, capability gaps, timeline gates, and governance controls. This becomes a living dataset—an evolving “case file”—rather than disconnected notes. Once the dataset exists, the Agentic Brain can run the same reasoning workflow every time, producing consistent outputs that can be audited and explained.
                            </p>
                        </div>
                        <div className="mt-10 text-slate-900 font-bold text-lg text-center">What is NSIL?</div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            <p className="mb-4">
                                NSIL (the Nexus Strategic Intelligence Layer) is the orchestration loop the Agentic Brain runs on that dataset. NSIL is the repeatable lifecycle:
                                <span className="inline-flex gap-2 ml-2 align-middle">
                                    <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded">Validate</span>
                                    <span className="text-slate-500 font-bold">→</span>
                                    <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">Debate</span>
                                    <span className="text-slate-500 font-bold">→</span>
                                    <span className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded">Score</span>
                                    <span className="text-slate-500 font-bold">→</span>
                                    <span className="bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded">Synthesize</span>
                                    <span className="text-slate-500 font-bold">→</span>
                                    <span className="bg-pink-100 text-pink-800 font-semibold px-2 py-1 rounded">Deliver</span>
                                </span>
                            </p>
                            <div className="mb-4">
                                <p className="mb-2"><strong>Validate:</strong> NSIL checks completeness, detects contradictions, and flags uncertainty, ensuring the system doesn’t confidently build on missing or conflicting inputs.</p>
                                <p className="mb-2"><strong>Debate:</strong> It runs multi‑perspective reasoning (the specialist personas) to force trade-offs into the open—upside vs downside, speed vs compliance, ambition vs feasibility—so blind spots are surfaced before partners or boards find them.</p>
                                <p className="mb-2"><strong>Score:</strong> NSIL applies the proprietary scoring engines and indices to quantify what normally remains vague: probability drivers, pressure points, return ranges, alignment friction, activation risk, and confidence.</p>
                                <p className="mb-2"><strong>Synthesize:</strong> It converts the validated, debated, and scored case into structured narrative that matches the math and the evidence, producing sections that decision-makers actually use.</p>
                                <p className="mb-2"><strong>Deliver:</strong> It compiles the living draft into a report pack: scorecards, debate outcomes, risk register, execution roadmap, governance model, and next steps.</p>
                            </div>
                            <p className="mb-4">
                                The formula suite is the quantitative backbone that the Agentic Brain uses during the “score” phase to translate narrative into explainable numbers. The primary engines (SPI™, RROI™, SEAM™, IVAS™, SCF™) provide the main “hard outputs”: success probability posture, risk-adjusted return logic, stakeholder alignment and friction mapping, activation/timeline feasibility, and an overall confidence grade that becomes the “board answer” (proceed/pause/restructure with reasons). The derivative indices extend that core scoring into specialist diagnostics—so the system can pinpoint why something is strong or weak, what lever to pull, and what will break first under stress. The key point is that the formulas are not decorative metrics; they are the mechanism that turns complex context into measurable drivers and pressure points, which makes the final narrative defensible.
                            </p>
                            <p className="mb-4">
                                The algorithm layer is what makes the Agentic Brain fast, consistent, and scalable rather than slow and ad hoc. Algorithms handle the mechanics that allow the same reasoning to run reliably: memory retrieval to reuse relevant prior context and prior decisions, contradiction checks to prevent inconsistent cases from proceeding, parallel execution so multiple analyses can run at once, early stopping so debate and analysis converge efficiently, and structured synthesis that selects the right report template and section plan for the target audience. This is what lets the system operate like an OS: it doesn’t just “generate text,” it manages a workflow, updates the case as inputs change, and keeps outputs consistent across sessions.
                            </p>
                            <p className="mt-4 text-blue-900">
                                <strong>All of this working together is what makes the system different:</strong> the Agentic Brain converts human information into structure; NSIL enforces a repeatable reasoning lifecycle; the formulas quantify drivers and confidence in an explainable way; and the algorithms make the workflow fast, consistent, and memory‑augmented. The result is a proactive intelligence pipeline that continuously turns a person’s inputs into an investor‑grade structured report—not a one-off response—while keeping validation, traceability, and decision usability at the center.
                            </p>
                        </div>
                    </Section>
                </div>

                {/* 3. Inside the Agentic Brain (how it does it) */}
                {/* Removed duplicate short 'Inside the Agentic Brain' caption (button moved earlier) */}

                {/* 7. About BWGA */}
                <Section>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Built by BW Global Advisory</h2>
                        <div className="mt-4 max-w-4xl mx-auto pt-2" style={{ fontFamily: "Papyrus, fantasy, 'Patrick Hand', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
                            <p className="text-lg md:text-xl text-slate-800 leading-relaxed">
                                BW Global Advisory (BWGA) is an independent Australian initiative, founded and solely developed by <strong>Brayden Walls</strong>.
                                It was born from immersive, on‑the‑ground research in regional Philippines — and the lived reality of what actually breaks deals and stalls development — translated into a repeatable system.
                            </p>
                            <p className="text-lg md:text-xl text-slate-800 mt-3 leading-relaxed">
                                <strong>BW Global Advisory is not here to compete with anyone, but to work alongside everyone who wants to change the way the world sees regional cities and the people who live there.</strong> Our mission is to offer a solution that opens doors for all—making it possible for anyone, from anywhere, to access a system that saves time and money, and brings opportunity to those who have been left out. Where once only a few could afford this level of insight, now it is open to all.
                            </p>
                            <p className="text-lg md:text-xl text-slate-800 mt-3 leading-relaxed">
                                This is for those who see, those who know, and—most importantly—for those who want to build true partnerships for a better life in their city, so no one feels left behind. We believe in empowering communities, fostering collaboration, and making sure every voice has a chance to be heard and every region has a chance to thrive.
                            </p>
                            <div className="mt-6 text-right">
                                <div className="inline-block align-middle">
                                    <svg width="320" height="80" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Signature">
                                        <defs>
                                            <filter id="inkShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feDropShadow dx="0" dy="1" stdDeviation="0.6" flood-color="#0b1220" flood-opacity="0.25"/>
                                            </filter>
                                        </defs>
                                        <text x="0" y="56" font-family="'Great Vibes', 'Dancing Script', cursive" font-size="48" fill="#0b1220" filter="url(#inkShadow)">Brayden Walls</text>
                                    </svg>
                                </div>
                                <div className="text-slate-700 text-base mt-1">Developer &amp; Founder</div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* 8. CTA & Terms of Engagement */}
                <Section>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Ready to See with Absolute Clarity?</h2>
                        <p className="text-slate-600 mt-2 max-w-3xl mx-auto">
                            Start your journey: define your mandate, then let the system show you what’s possible.
                            The BW Consultant reacts immediately as you engage — listening, learning context, and responding with structured intelligence.
                        </p>
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">To proceed, please review and accept the Terms of Engagement. This ensures you understand the scope, capabilities, and limitations of the platform.</p>
                    </div>

                    <div className="mt-8 max-w-4xl mx-auto">
                        <h3 className="text-slate-950 font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-slate-700" />
                            Terms of Engagement & Business Disclaimer
                        </h3>
                        <div className="space-y-4 text-xs text-slate-600 bg-slate-50 p-5 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
                            <p className="font-bold text-slate-950 mb-2">Important Business Disclaimer</p>
                            <p className="leading-relaxed mb-3">Strategic Intelligence Briefs are prepared by BW Global Advisory (ABN 55 978 113 300) using our proprietary AI-Human analytical capabilities. Analysis is based on publicly available data, BWGA's AI Economic Strategy Engine (Nexus v6.0), and regional insights gathered by our advisory team. While every effort is made to ensure accuracy at the time of generation, all briefs are illustrative, intended for strategic discussion, and do not constitute financial, legal, or investment advice. Users are advised to conduct comprehensive independent due diligence before making any investment or partnership decisions.</p>
                            <p className="font-bold text-slate-950 mb-2">Terms of Engagement</p>
                            <p>1. <strong>Acceptance & Commercial License:</strong> By accessing the BW Nexus AI platform (v6.0), you acknowledge and accept these Terms of Engagement in full. Upon completion of payment, Strategic Intelligence Reports and associated deliverables become the intellectual property of the commissioning party. BW Global Advisory (ABN 55 978 113 300) retains rights to anonymized, aggregated data solely for system improvement and research purposes.</p>
                            <p>2. <strong>Decision Support Tool — Not Financial Advice:</strong> The Nexus OS provides probabilistic insights, data-driven analysis, and strategic recommendations. It is expressly NOT a final decision authority and does NOT constitute financial, legal, tax, or investment advice. All outputs are advisory in nature. Users must exercise independent judgment, verify all critical findings, and seek qualified professional advice before making binding commitments.</p>
                            <p>3. <strong>Due Diligence Requirement:</strong> Users acknowledge their responsibility to conduct comprehensive independent due diligence before acting on any analysis, recommendation, or insight provided by this platform. BW Global Advisory provides strategic intelligence to inform decisions—not to replace the professional judgment of qualified advisors.</p>
                            <p>4. <strong>Proprietary Intellectual Property:</strong> All system architecture, algorithms, formulas, workflows, user interfaces, and the unique “agentic” methodology—including but not limited to SPI™, RROI™, SEAM™, IVAS™, SCF™, and the entire BW Nexus AI platform—are the exclusive and proprietary intellectual property of BW Global Advisory. Any attempt to copy, reverse engineer, decompile, or create derivative works is strictly prohibited.</p>
                            <p>5. <strong>Limitation of Liability:</strong> To the maximum extent permitted by applicable law, BW Global Advisory, its directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from use of the platform or reliance on its outputs. In all circumstances, total aggregate liability shall not exceed fees actually paid for the specific report or service in question.</p>
                            <p className="font-semibold mt-3 text-slate-900">Terms Version 6.0 | Effective December 2025 | BW Global Advisory (ABN 55 978 113 300) | Sydney, Australia</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <label className="flex items-start gap-4 cursor-pointer select-none group mb-6 p-4 rounded-lg transition-colors hover:bg-slate-50">
                                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${accepted ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                    {accepted && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                                <span className="text-sm text-slate-700">I have read, understood, and accept the Terms of Engagement. I acknowledge this is a decision-support tool and does not constitute financial, legal, or investment advice. All final decisions remain my responsibility.</span>
                            </label>

                            <div className="text-center">
                                <button
                                    onClick={onOpenReportGenerator}
                                    disabled={!accepted}
                                    className="bg-blue-600 text-white py-4 px-10 rounded-lg font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none group w-full sm:w-auto mx-auto"
                                >
                                    {!accepted ? <Lock size={20} /> : <Play size={20} />}
                                    <span>Define Your First Mandate</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </Section>

                <div className="text-center pt-8">
                    <p className="text-xs text-slate-600">© 2025 BW Global Advisory (ABN 55 978 113 300). All Rights Reserved.</p>
                    <p className="text-xs text-slate-500 mt-1">Nexus Intelligence OS v6.0 | Sydney, Australia</p>
                </div>
            </div>
            
            {/* Formula Deep Dive Modal */}
            <FormulaDeepDiveModal 
                isOpen={showFormulaModal} 
                onClose={() => setShowFormulaModal(false)} 
            />
        </div>
    );
};

export default CommandCenter;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        