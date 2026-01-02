


import React, { useState } from 'react';
import { ReportParameters } from '../types';
import type { EcosystemPulse } from '../services/EventBus';
// Inline Letters Catalog Modal to avoid import resolution issues
// (Inline Letters catalog modal removed for full narrative replacement)
import GovernancePanel from './GovernancePanel';
// Removed API pipeline; using sample modal preview
import { 
    Play, CheckCircle2, ShieldAlert, 
    Globe, Lock, ArrowRight, Layers
} from 'lucide-react';

interface CommandCenterProps {
    savedReports: ReportParameters[];
    onCreateNew: () => void;
    onLoadReport: (report: ReportParameters) => void;
    onOpenInstant: () => void;
    onOpenSimulator: () => void;
    onOpenReportGenerator: () => void;
    onOpenScenarioReport: () => void;
    ecosystemPulse?: EcosystemPulse | null;
    reportId?: string;
}

// Removed step timeline and scenario payload; using a simple sample document preview instead

const CommandCenter: React.FC<CommandCenterProps> = ({ 
    onCreateNew,
    onOpenSimulator,
    reportId
}) => {
    const [accepted, setAccepted] = useState(false);
    // Recorded chunks are handled inline; no need to track separately

    // All pipeline demo and recording logic removed

    return (
        <div className="h-full w-full flex-1 bg-stone-50 flex items-start justify-center p-6 pt-16 pb-24 font-sans overflow-y-auto">
            <div className="max-w-6xl w-full bg-white shadow-2xl border border-stone-200 rounded-sm overflow-hidden flex flex-col">
                {/* 1. Header & Catchment (Hero) */}
                <section className="bg-bw-navy text-white p-12">
                    <div className="flex items-center gap-2 text-bw-gold font-bold tracking-widest text-xs uppercase mb-4">
                        <Layers size={14} /> BW Global AI Command Center
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">A National Strategic Asset</h1>
                    <p className="text-bw-gold font-semibold mb-6">A sovereign-grade intelligence platform designed to enhance the quality and speed of high-stakes decision-making.</p>
                    <div className="text-gray-200 text-sm leading-relaxed border-l-2 border-bw-gold pl-6 max-w-3xl">
                        <p className="mb-2">Our ultimate vision is for BW Global AI to be deployed as a shared, national strategic asset — a secure, sovereign-grade intelligence platform utilized across government, companies, and banking organizations of any size to enhance the quality and speed of high-stakes decision-making.</p>
                        <p>Designed to create partnerships across sectors and geographies, BW Global AI is 100% regional-focused. It reduces bottlenecks in big cities by channeling growth to high-potential regions where capacity can be built deliberately and equitably.</p>
                    </div>
                </section>

                {/* The Problem: The Global Understanding Gap */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Problem: The Global Understanding Gap</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>In the 21st century, governments and institutions face a landscape of unprecedented complexity. Decisions concerning economic policy, foreign investment, and regional development are fraught with interconnected risks, hidden variables, and the pervasive threat of cognitive bias.</p>
                        <p>The traditional tools for navigating this landscape are broken:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Consulting: Months-long engagements produce static reports that are outdated the moment they are printed. You pay for hours, not outcomes.</li>
                            <li>Dashboards &amp; Analytics: They show you what happened, but provide no system to decide what to do next. They require clean data and cannot reason about human intent.</li>
                            <li>AI Chatbots &amp; LLMs: They generate plausible language with zero accountability, making them unusable for high-stakes decisions where every assumption must be defended.</li>
                            <li>Simulation Software: These tools operate in silos, require rare expertise, and break when reality shifts, locking insights away from those who need them most.</li>
                        </ul>
                        <p>This isn’t a theoretical problem. It’s the hidden tax on every major decision, leading to stalled projects, wasted capital, and missed opportunities that can define a nation’s trajectory for a generation. This is the cost of the Global Understanding Gap.</p>
                    </div>
                </section>

                {/* The Breakthrough: Making Intent Computable */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Breakthrough: Making Intent Computable</h2>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p><span className="font-semibold">The Unsolved Problem:</span> Every consequential decision starts with a human mandate—goals in natural language, competing objectives, political realities, and unknowns.</p>
                        <p><span className="font-semibold">The Fatal Truth:</span> Human intent is not computable.</p>
                        <p><span className="font-semibold">The Shift:</span> Until now.</p>
                        <p>The core discovery was not more data. It was realizing that intent itself must be structured—without losing its connection to reality—before true intelligence can exist. BW Global AI is more than an incremental improvement; it represents a fundamental leap forward in decision-making technology. It is a world-first.</p>
                    </div>
                </section>

                {/* The Solution: Introducing BW Global AI */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Solution: Introducing BW Global AI</h2>
                    <p className="text-stone-600 text-sm mb-3">A Strategic Intelligence and Execution Platform.</p>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p>BW Global AI is a new class of system that functions as a digital consultant combined with a high-end document automation factory. It transforms a user’s inputs—their mission, constraints, risk appetite, and strategic goals—into a live, interactive decision model.</p>
                        <p>The platform does not simply store data; it reads it, simulates outcomes, stress-tests assumptions, finds hidden risks, and proposes auditable, evidence-backed fixes. It is built for speed without sacrificing rigor, delivering in minutes what once took months, and providing a level of analytical depth previously accessible only to the world’s largest organizations.</p>
                    </div>
                </section>

                {/* How It Works: The NSIL Architecture */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">How It Works: The NSIL Architecture</h2>
                    <p className="text-stone-700 text-sm max-w-4xl">Our technology is a governed, adversarial, and continuously learning system. It is powered by two core components working in symbiosis: the Nexus Strategic Intelligence Layer (NSIL) and the Agentic Brain.</p>
                </section>

                {/* Rigor from the Start: 10-Step Framework */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Rigor from the Start: 10-Step Framework</h2>
                    <p className="text-stone-600 text-sm mb-4">This is the governed workflow that takes a mandate from ambiguity to auditable, decision-grade outputs.</p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-stone-700 max-w-4xl">
                        <li><span className="font-semibold">Intake &amp; Goals Capture</span> — objectives, stakeholders, constraints, and risk appetite.</li>
                        <li><span className="font-semibold">Guardrails</span> — policy, sanctions, ethics, and data-quality checks.</li>
                        <li><span className="font-semibold">Evidence Harvest</span> — normalize sources; bind citations for provenance.</li>
                        <li><span className="font-semibold">Contradiction Scan</span> — SPI™ preflight identifies incoherence and missing logic.</li>
                        <li><span className="font-semibold">Adversarial Debate</span> — role-based personas challenge assumptions; contradictions cannot pass silently.</li>
                        <li><span className="font-semibold">Counterfactual Lab</span> — shocks across rates, liquidity, partners, policy, and supply chain.</li>
                        <li><span className="font-semibold">Scoring &amp; Explainability</span> — 21 formulas compute resilience; each score ships with drivers and citations.</li>
                        <li><span className="font-semibold">Decision Packet &amp; Controls</span> — thresholds, actions, and monitoring hooks assembled for governance.</li>
                        <li><span className="font-semibold">Live Deliverables Binding</span> — LOI/NDA/Term Sheet/Briefs regenerate on change.</li>
                        <li><span className="font-semibold">Governance &amp; Provenance</span> — approvals, change history, export guardrails, and audit trails.</li>
                    </ol>
                    <div className="mt-6 rounded-sm border border-amber-200 bg-amber-50 p-4 text-amber-900 text-xs max-w-4xl">
                        <p className="font-bold">Rate &amp; Liquidity Stress — Explicit Gates</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Rates: Δ+30bps / Δ+90bps → DSCR/ICR thresholds gate recommendations.</li>
                            <li>Liquidity: FX/CSR/IRP lanes tested; funding staged with evidence packs.</li>
                        </ul>
                    </div>
                </section>

                {/* Part 1: The Brain — NSIL */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Part 1: The Brain — The Nexus Strategic Intelligence Layer (NSIL)</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>NSIL is the autonomous reasoning engine that treats every plan as a living simulation. It is a five-layer reasoning stack that wraps around our 21 proprietary mathematical formulas, ensuring every output is both explainable and robust.</p>
                        <p className="font-semibold text-stone-900">The 5-Layer Reasoning Stack:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">The Adversarial Input Shield:</span> Before analysis begins, this layer acts as a gatekeeper. It cross-references user claims against external authoritative data (World Bank, sanctions lists) and flags contradictions, preventing the “garbage in, garbage out” problem.</li>
                            <li><span className="font-semibold">The Multi-Perspective Reasoning Engine:</span> NSIL spawns five specialist AI personas to debate the plan from every angle, systematically eliminating cognitive bias and forcing trade-offs into the open.</li>
                            <li><span className="font-semibold">The Counterfactual Lab:</span> The system automatically generates “what if?” scenarios to test the strategy’s robustness against market shifts, partner failures, and geopolitical shocks, quantifying the potential cost of making the wrong choice.</li>
                            <li><span className="font-semibold">The Scoring Engines:</span> With validated inputs, the system runs its full suite of 21 proprietary mathematical formulas (including SPI™, RROI™, and SEAM™) to produce hard, quantitative scores for the plan.</li>
                            <li><span className="font-semibold">The Learning Loop:</span> The system tracks the real-world outcomes of its recommendations, allowing it to recalibrate its models, identify new patterns of success, and measure its own confidence over time.</li>
                        </ul>
                    </div>
                </section>

                {/* Part 2: The Executor — The Agentic Brain */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Part 2: The Executor — The Agentic Brain</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>Most systems wait for instructions. BW Global AI works. The Agentic Brain is the persistent digital worker that executes the governance protocols of NSIL.</p>
                        <p><span className="font-semibold">How it works with NSIL:</span> Think of NSIL as the constitution—the rules of reasoning, debate, and scoring. The Agentic Brain is the executive branch that proactively enforces that constitution. It owns the case, progresses it continuously, challenges weak assumptions, and refuses to proceed on incomplete logic.</p>
                        <p><span className="font-semibold">Why it’s different:</span> This is agentic AI applied not to simple tasks, but to judgment. It anticipates your next question, prepares analyses in the background, and acts as a proactive member of your team, not a passive tool. This active, governed reasoning is what makes the system unique.</p>
                    </div>
                </section>

                {/* What You Get: From Mandate to Actionable Intelligence */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">What You Get: From Mandate to Actionable Intelligence</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>A validated strategy is useless if it remains trapped in a dashboard. From a single mandate, BW Global AI generates a suite of decision-grade assets and can instantly convert the analysis into professional, execution-ready deliverables.</p>
                        <p className="font-semibold text-stone-900">Key Outputs Include:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>A living, interactive decision model.</li>
                            <li>An assumptions and verification register.</li>
                            <li>Quantified confidence scores (SPI™, RROI™, SEAM™).</li>
                            <li>Risk and mitigation maps.</li>
                            <li>Phased execution roadmaps.</li>
                            <li>
                                Investor- and Regulator-Grade Documents, including a library of over 200 document types and 150 letter templates across 14 categories:
                                <div className="mt-2 grid md:grid-cols-2 gap-2">
                                    <div><span className="font-semibold">Foundation:</span> Letters of Intent (LOI), Memorandums of Understanding (MOU), Term Sheets.</div>
                                    <div><span className="font-semibold">Strategic:</span> Business Cases, Feasibility Studies, White Papers.</div>
                                    <div><span className="font-semibold">Financial:</span> Full Financial Models, Private Placement Memorandums (PPM).</div>
                                    <div><span className="font-semibold">Government:</span> Policy Briefs, Cabinet Memos, Public-Private Partnership (PPP) Frameworks.</div>
                                </div>
                            </li>
                            <li>Change one assumption—a budget, a timeline, a partner—and the entire system of models and documents instantly updates. This was not previously possible.</li>
                        </ul>
                    </div>
                </section>

                {/* Proof Point: Scenario Spotlight */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Proof Point: Scenario Spotlight</h2>
                    <div className="rounded-sm border border-stone-200 p-6 bg-white text-sm text-stone-700 space-y-3">
                        <p><span className="font-semibold">City:</span> General Santos, Mindanao (a regional port and agribusiness hub).</p>
                        <p><span className="font-semibold">Deal:</span> A Japanese investor plans a $45M cold-chain logistics hub.</p>
                        <p><span className="font-semibold">Issues:</span> The project faces smuggling interference, opaque permitting, and vendor collusion, causing investor confidence to collapse.</p>
                        <div className="pt-3 border-t border-stone-200 space-y-2">
                            <p className="font-semibold text-stone-900">The BW Global AI Solution:</p>
                            <p>The system models an “Integrity Pact” with an independent trustee, RFID and digital seals for supply chain transparency, a clean-room inspector rotation to break collusion, and milestone-based escrow releases tied to evidence packs.</p>
                        </div>
                        <div className="pt-3 border-t border-stone-200 space-y-2">
                            <p className="font-semibold text-stone-900">The Outcome:</p>
                            <p>Minute-level assurance is achieved. The anomaly rate drops below 0.5%. Investor capital is unlocked, and local jobs are created.</p>
                        </div>
                    </div>
                </section>

                {/* Why It's Different */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Why It’s Different: A World-First Capability</h2>
                    <p className="text-stone-700 text-sm max-w-4xl mb-6">BW Global AI is not just another tool; it’s an active reasoning partner. It does not just present data; it interrogates it, debates it, and transforms it into a coherent strategic argument.</p>
                    <div className="overflow-x-auto border border-stone-200 rounded-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 text-stone-900">
                                <tr>
                                    <th className="text-left font-bold p-3 border-b border-stone-200">Feature</th>
                                    <th className="text-left font-bold p-3 border-b border-stone-200">Consulting Firms</th>
                                    <th className="text-left font-bold p-3 border-b border-stone-200">Dashboards / BI</th>
                                    <th className="text-left font-bold p-3 border-b border-stone-200">GenAI Chatbots</th>
                                    <th className="text-left font-bold p-3 border-b border-stone-200">BWGA Intelligence AI</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-700">
                                {[ 
                                    ['Primary Output', 'Static PDF Reports', 'Historical Charts', 'Text / Conversation', 'Living Decision Model'],
                                    ['Reasoning Type', 'Human Expert', 'Descriptive Stats', 'Probabilistic Text', 'Governed Neuro-Symbolic'],
                                    ['Speed', 'Weeks / Months', 'Instant (Data only)', 'Instant', 'Instant'],
                                    ['Adversarial Checks', 'Manual / Ad-hoc', 'None', 'None (Hallucinates)', 'Systematic (5 Personas)'],
                                    ['Math Rigor', 'Excel Models', 'Visualizations', 'None', '21 Proprietary Formulas'],
                                    ['Auditability', 'Low (Opinion)', 'High (Data)', 'Low (Black Box)', 'High (Traceable Logic)'],
                                    ['Self-Learning', 'No', 'No', 'No', 'Yes (Outcome Tracker)'],
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="p-3 border-b border-stone-200 align-top">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Who We Are & Who It's For */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Who We Are &amp; Who It’s For</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p><span className="font-semibold">Built by BW Global Advisory:</span> BW Global Advisory (BWGA) is an independent Australian initiative, founded and solely developed by Brayden Walls. It was born from immersive, on‑the‑ground research in regional Philippines — and the lived reality of what actually breaks deals and stalls development — translated into a repeatable system.</p>
                        <div>
                            <p className="font-semibold text-stone-900 mb-2">Who This Is For:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Government &amp; Policy Leaders shaping national economic strategy.</li>
                                <li>Institutional Investors &amp; DFIs deploying capital into complex markets.</li>
                                <li>Corporate Strategists planning market entry, JVs, or supply chain resilience.</li>
                                <li>Regional Development Agencies seeking to attract investment with verifiable proof.</li>
                                <li>Banks &amp; Financial Institutions from local credit unions to global banks.</li>
                                <li>Companies of any size pursuing regional expansion.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Start Your Journey */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Start Your Journey</h2>
                    <p className="text-stone-700 text-sm max-w-4xl">Define your mandate, then let the system show you what’s possible. The bee meets the flower: when fit is governed and evidence is live, regions bloom sustainably.</p>
                </section>

                {/* Governance & Provenance */}
                <section className="p-10 border-t border-stone-200">
                    <GovernancePanel reportId={reportId} />
                </section>
                {/* Scenario sample modal removed */}

                {/* Compact closing line integrated into CTA */}

                {/* Terms of Engagement & Compliance */}
                <section className="p-10 border-t border-stone-200">
                    <h3 className="text-bw-navy font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-bw-gold" /> Terms of Engagement & Compliance
                    </h3>
                    <div className="space-y-4 text-xs text-stone-700 bg-white p-6 rounded-sm border border-stone-200 max-h-[320px] overflow-y-auto shadow-inner">
                        <p><strong className="text-stone-900 block mb-1">1. Strategic Decision Support</strong> BW Global AI is a sovereign-grade decision support platform. All outputs are advisory and must be validated by qualified professionals before binding commitments.</p>
                        <p><strong className="text-stone-900 block mb-1">2. Reasoning Governance (NSIL)</strong> The NSIL layer governs analysis via adversarial input screening, multi-perspective debate, counterfactual simulation, scoring engines, and a learning loop. This prevents false confidence and enforces explainability.</p>
                        <p><strong className="text-stone-900 block mb-1">3. Data Privacy & Sovereignty</strong> Strict compliance with data sovereignty and privacy laws. Sensitive intents and operational data are segregated. No user-specific data trains public models.</p>
                        <p><strong className="text-stone-900 block mb-1">4. Model Limits & Accountability</strong> The 21-formula suite (including SPI™, RROI™, SEAM™, etc.) exposes fragility and leverage; it does not predict the future. Users retain final accountability for decisions.</p>
                        <p><strong className="text-stone-900 block mb-1">5. Compliance & Ethics</strong> The Regulator persona continuously checks legality, ethics, sanctions, and policy alignment. Outputs include audit trails for traceability.</p>
                        <p><strong className="text-stone-900 block mb-1">6. Liability &amp; IP Protection</strong> All intellectual property, methodologies, orchestration primitives, and the 21-formula suite (including SPI™, RROI™, SEAM™, IVAS™, SCF™) are owned by BW Global Advisory (BWGA). Access or evaluation does not grant any license or transfer of rights. You agree to keep non‑public materials confidential, use them solely for evaluation, and not disclose, copy, reverse‑engineer, or use the system to build a competing product; any feedback becomes BWGA property. Beta/R&amp;D notice: the platform is provided “AS IS” without warranties; advisory outputs require professional validation. To the extent permitted by law, BWGA disclaims indirect, incidental, consequential, and punitive damages; total liability is capped at fees paid for the specific service. Misuse of IP may cause irreparable harm; BWGA may seek injunctive relief in addition to other remedies.</p>
                    </div>
                    <div className="mt-6 flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer select-none group">
                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${accepted ? 'bg-bw-navy border-bw-navy' : 'bg-white border-stone-300 group-hover:border-bw-navy'}`}>
                                {accepted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                            <span className="text-sm font-bold text-stone-700">I have read and accept the Terms of Engagement.</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={onCreateNew}
                                disabled={!accepted}
                                className="flex-1 bg-bw-navy text-white py-4 px-6 rounded-sm font-bold text-sm uppercase tracking-wide flex items-center justify-between gap-2 hover:bg-bw-gold hover:text-bw-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg group"
                            >
                                <span className="flex items-center gap-3">{!accepted ? <Lock size={16} /> : <Play size={16} />} Define Your Mandate</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={onOpenSimulator}
                                className="flex-1 bg-white text-stone-600 border border-stone-300 py-4 px-6 rounded-sm font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-stone-100 hover:text-stone-900 transition-all"
                            >
                                <Globe size={14} />
                                View System Monitor
                            </button>
                        </div>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-2">© 2026 BW Global Advisory. Nexus Intelligence OS v6.0 — Melbourne, Australia.</p>
                </section>
                {/* (No modals; full narrative replacement) */}
            </div>
        </div>
    );
};

export default CommandCenter;

