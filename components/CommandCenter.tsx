


import React, { useState } from 'react';
import { ReportParameters } from '../types';
import type { EcosystemPulse } from '../services/EventBus';
import FormulaDeepDiveModal from './FormulaDeepDiveModal';
import CatalogModal from './CatalogModal';
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
    onOpenReportGenerator?: () => void;
    ecosystemPulse?: EcosystemPulse | null;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ 
    onCreateNew,
    onOpenSimulator
}) => {
    const [accepted, setAccepted] = useState(false);
    const [showFormulaModal, setShowFormulaModal] = useState(false);
    const [showCatalogModal, setShowCatalogModal] = useState(false);

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
                        <p className="mb-2">Our ultimate vision is for BW Nexus AI to be deployed as a shared, national strategic asset — a secure, sovereign-grade intelligence platform utilized across government, companies, and banking organizations of any size to enhance the quality and speed of high-stakes decision-making.</p>
                        <p>Designed to create partnerships across sectors and geographies, BW Nexus AI is 100% regional-focused. It reduces bottlenecks in big cities by channeling growth to high-potential regions where capacity can be built deliberately and equitably.</p>
                    </div>
                </section>

                {/* 2. The Problem */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Strategic Imperative: Decision-Making in a Complex World</h2>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p>In the 21st century, governments and institutions face a landscape of unprecedented complexity. Decisions concerning economic policy, foreign investment, national security, and regional development are fraught with interconnected risks, hidden variables, and the pervasive threat of cognitive bias.</p>
                        <p>The traditional tools for navigating this landscape—months-long consulting engagements, static reports, and siloed expert opinions—are proving increasingly inadequate. They are slow, prohibitively expensive, and often produce a single-point forecast that fails to account for real-world volatility.</p>
                        <p>This results in missed opportunities, unforeseen crises, and the inefficient allocation of a nation's most precious resources: its capital, its talent, and its time.</p>
                        <p className="font-semibold">The Imperative: A new paradigm for decision-making is required—one that is dynamic, rigorous, transparent, and adaptive.</p>
                    </div>
                </section>

                {/* 3. Proof of Innovation */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Unsolved Problem</h2>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p><span className="font-semibold">Every consequential decision starts with a human mandate.</span> <span className="text-stone-900 font-semibold">Fatal truth:</span> Human intent is not computable.</p>
                        <p className="font-semibold">The Shift: Until now.</p>
                        <p>BW Nexus AI is more than an incremental improvement on existing analytical tools; it represents a fundamental leap forward in decision-making technology. By fusing a suite of proprietary mathematical engines with a multi-layered autonomous reasoning architecture, it provides a capability that has, until now, not existed: an active, adversarial, and continuously learning AI reasoning partner.</p>
                        <p>It is a system designed to combat bias, embrace uncertainty, and deliver auditable, explainable, and actionable strategic intelligence. It is a world-first.</p>
                    </div>
                </section>

                {/* 4. The Solution */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Introducing BW Nexus AI</h2>
                    <p className="text-stone-600 text-sm mb-3">A Strategic Intelligence and Execution Platform.</p>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p>BW Nexus AI is best understood as a hybrid platform that merges the analytical mind of a top-tier consulting firm with the productive power of a high-end document automation factory. It is a unified environment designed to guide a user from the earliest stages of strategic conception all the way through to the generation of execution-ready deliverables.</p>
                        <p><span className="font-semibold">Core Function:</span> It transforms a user's inputs—their mission, constraints, risk appetite, and strategic goals—into a live, interactive decision model. The platform does not simply store data; it reads it, simulates outcomes, stress-tests assumptions, finds hidden risks, and proposes auditable, evidence-backed fixes.</p>
                    </div>
                </section>

                {/* 5. Who We Are */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Built by BW Global Advisory</h2>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p>BW Global Advisory (BWGA) is an independent Australian initiative, founded and solely developed by Brayden Walls. It was born from immersive, on‑the‑ground research in regional Philippines — and the lived reality of what actually breaks deals and stalls development — translated into a repeatable system.</p>
                        <p><span className="font-semibold">Mission:</span> To bridge the Global Understanding Gap by providing AI‑enhanced intelligence that illuminates regional economic potential, facilitates symbiotic partnerships, and ensures community-centered development outcomes.</p>
                    </div>
                </section>

                {/* 6. How We Do This (NSIL) */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Core Innovation: Nexus Strategic Intelligence Layer (NSIL)</h2>
                    <p className="text-stone-600 text-sm mb-3">NSIL treats every business plan, investment thesis, or policy initiative as a living simulation.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">The 5-Layer Autonomous Reasoning Stack</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li><span className="font-semibold">Adversarial Input Shield:</span> Cross-references claims against external data and flags contradictions before analysis begins.</li>
                                <li><span className="font-semibold">Multi-Perspective Reasoning Engine:</span> Spawns five specialist AI personas to debate the plan in parallel.</li>
                                <li><span className="font-semibold">Counterfactual Lab:</span> Simulates "what if?" scenarios to test robustness against market shifts or partner failures.</li>
                                <li><span className="font-semibold">Scoring Engines:</span> Runs 21 proprietary mathematical formulas (SPI™, RROI™, SEAM™) to produce hard quantitative scores.</li>
                                <li><span className="font-semibold">Learning Loop:</span> Tracks decisions and outcomes to recalibrate accuracy over time.</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">The 5 AI Personas (The Debate Team)</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li><span className="font-semibold">The Skeptic:</span> Finds deal-killers and hidden downside risks.</li>
                                <li><span className="font-semibold">The Advocate:</span> Identifies hidden synergies and value levers.</li>
                                <li><span className="font-semibold">The Regulator:</span> Checks legality, ethics, and compliance.</li>
                                <li><span className="font-semibold">The Accountant:</span> Validates financial viability and unit economics.</li>
                                <li><span className="font-semibold">The Operator:</span> Tests execution feasibility and team capability.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-stone-700 text-sm max-w-3xl">NSIL + the Agentic Brain constitute a world-first decision-making architecture: governed, adversarial, continuously learning, and fully auditable.</p>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setShowFormulaModal(true)}
                                className="inline-flex items-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-800 hover:bg-blue-100 transition-colors"
                            >
                                <span>Explore Full Methodology &amp; 21 Formulas</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 6a. Agentic AI — The Nexus Brain */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Agentic AI: How the Brain Works with NSIL</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">Agentic Brain Operations</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li>Owns the case: persists context, prepares analyses in the background, and advances work without waiting for prompts.</li>
                                <li>Prepares proactively: anticipates next questions, assembles evidence, and surfaces contradictions for review.</li>
                                <li>Maintains traceability: writes structured logs so every judgment has a provenance trail.</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">Interplay: NSIL + Agentic Brain</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li>NSIL governs reasoning quality (debate, counterfactuals, scoring, learning); the Agentic Brain executes this governance continuously.</li>
                                <li>Inputs flow through the Adversarial Shield → Personas Debate → Counterfactual Lab → Scoring Engines, while the Brain orchestrates tasks.</li>
                                <li>Outputs are explainable and auditable: every score links to assumptions, every recommendation cites sources.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 max-w-4xl text-stone-700 text-sm space-y-3">
                        <p><span className="font-semibold">The Agentic Brain:</span> Most systems wait for instructions. BW Global AI works. The Agentic Brain is a persistent digital worker that owns the case, progresses it continuously, challenges weak assumptions, and refuses to proceed on incomplete logic.</p>
                        <p>This means the system anticipates your next question, prepares analyses in the background, and acts as a proactive member of your team, not a passive tool waiting for a command.</p>
                        <p className="font-semibold">This is agentic AI applied not to tasks — but to judgment. That distinction is new.</p>
                        <p>It is not a black box: every step is governed by NSIL’s explicit reasoning protocols and is fully traceable. It is a self‑learning system that hunts for information, surfaces contradictions, and improves its own accuracy over time.</p>
                    </div>
                </section>

                {/* 7. How To Use It (9-Section Framework) */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Rigor from the Start: The 9-Section Framework</h2>
                    <p className="text-stone-600 text-sm mb-3">The quality of any analysis is dictated by the quality of its inputs.</p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            'Identity & Foundation: Organizational credibility.',
                            'Mandate & Strategy: Vision and success measures.',
                            'Market & Context: External forces.',
                            'Partners & Ecosystem: Stakeholder fit.',
                            'Financial Model: Multi-scenario viability.',
                            'Risk & Mitigation: Systematic risk planning.',
                            'Resources & Capability: Execution readiness.',
                            'Execution Plan: Gated roadmap.',
                            'Governance & Monitoring: Decision structures.'
                        ].map((item, i) => (
                            <div key={i} className="rounded-sm border border-stone-200 p-4 bg-stone-50 text-sm text-stone-700">{item}</div>
                        ))}
                    </div>
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                        {[
                            'For Beginners: Step-by-step educational guidance.',
                            'For Operators: Structured workflows and checklists.',
                            'For Executives: Compressed analytics and decision dashboards.'
                        ].map((item, i) => (
                            <div key={i} className="rounded-sm border border-stone-200 p-4 bg-white text-xs text-stone-700">{item}</div>
                        ))}
                    </div>
                </section>

                {/* 8. Outcomes */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Document Factory: From Analysis to Action</h2>
                    <p className="text-stone-600 text-sm mb-3">A validated strategy is useless if it remains trapped in a dashboard. Nexus turns analysis into action with governed, live documents.</p>
                    <div className="rounded-sm border border-stone-200 p-6 bg-white mb-6 space-y-3">
                        <p className="text-sm text-stone-700"><span className="font-semibold">Live recalculation:</span> Change one assumption; the entire set — risks, scores, timelines, capital stacks, and instrument drafts — updates instantly.</p>
                        <p className="text-sm text-stone-700"><span className="font-semibold">Guided delivery:</span> A BW Consultant orchestrates outreach, evidence, approvals, and versioning with full traceability.</p>
                        <p className="text-sm text-stone-700"><span className="font-semibold">Explainable by design:</span> Every output carries a <span className="italic">why chain</span> — definitions, drivers, sensitivities, and citations.</p>
                    </div>
                    <div className="rounded-sm border border-stone-200 p-6 bg-stone-50 mb-6">
                        <h3 className="text-sm font-bold text-stone-900 mb-2">Partnership Matchmaking</h3>
                        <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                            <li><span className="font-semibold">Fit vectors:</span> Mandate, sector, geography, capacity, compliance/ethics — scored and updated live.</li>
                            <li><span className="font-semibold">Outreach sequencer:</span> Timing‑aware intros and letters with privacy‑safe routing.</li>
                            <li><span className="font-semibold">Negotiation workspace:</span> One‑click NDAs, LOIs, and terms aligned to objectives and risk.</li>
                            <li><span className="font-semibold">Evidence locker:</span> Shared artifacts with provenance for compliance reviews.</li>
                        </ul>
                        <p className="text-xs text-stone-600 mt-3">Flow: Discover → Assess → Engage → Negotiate → Close</p>
                    </div>
                    <div className="rounded-sm border border-stone-200 p-6 bg-white mb-6">
                        <h3 className="text-sm font-bold text-stone-900 mb-2">Operational Signals</h3>
                        <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                            <li><span className="font-semibold">Outcome examples:</span> Signed LOI in 10–14 days; syndication outline under 30 days; policy brief v1 in 48 hours.</li>
                            <li><span className="font-semibold">Approvals &amp; versioning:</span> Redlines, approvals, and sign‑offs tracked with timestamps and role attribution.</li>
                            <li><span className="font-semibold">Roles &amp; collaboration:</span> Executive, Operator, Legal/Compliance, and BW Consultant handoffs within one workspace.</li>
                            <li><span className="font-semibold">Exports &amp; integrations:</span> PDF, DOCX, CSV, email packs; optional API push to DMS/CRM.</li>
                            <li><span className="font-semibold">Compliance guardrails:</span> KYC/AML, sanctions, ESG checks run before outreach; blockers are visible and fixable.</li>
                            <li><span className="font-semibold">Provenance banner:</span> Each document includes sources, assumptions, sensitivity ranges, and change history.</li>
                        </ul>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">Capabilities</h3>
                            <p className="text-sm text-stone-700">Auto‑generates 200+ document types and 180+ letter templates across 24+ categories.</p>
                            <p className="text-xs text-stone-600 mt-2">Need specifics? <button className="underline text-bw-navy" onClick={() => setShowCatalogModal(true)}>Request the full catalog</button> and we’ll tailor the pack to your sector.</p>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li><span className="font-semibold">Foundation:</span> LOIs, MOUs, NDAs, Term Sheets.</li>
                                <li><span className="font-semibold">Strategic:</span> Business Cases, Feasibility Studies, White Papers.</li>
                                <li><span className="font-semibold">Financial:</span> Financial Models, Valuation Reports.</li>
                                <li><span className="font-semibold">Risk:</span> Due Diligence Reports, Sanctions Screening.</li>
                                <li><span className="font-semibold">Government:</span> Policy Briefs, Cabinet Memos.</li>
                            </ul>
                            <p className="text-xs text-stone-600 mt-3">Plus more across 24+ categories. Show only what’s relevant; <button className="underline text-bw-navy" onClick={() => setShowCatalogModal(true)}>open the full catalog</button> when needed.</p>
                        </div>
                    </div>
                </section>

                {/* 9. Technology & Differentiation */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Why The Old Model Cannot Be Fixed</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">The Problem Domain</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li>Consulting: High cost, high latency. Produces static reports that are obsolete upon delivery.</li>
                                <li>Human Bias: Vulnerable to groupthink, confirmation bias, and misaligned incentives.</li>
                                <li>The "Invisible Giant": Traditional models overlook regional opportunities due to a lack of granular data.</li>
                                <li>Static Tools: Spreadsheets and slides cannot react to new information or stress-test themselves.</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-6 bg-stone-50">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">The BW Difference</h3>
                            <p className="text-sm text-stone-700">BW Nexus AI treats a strategic plan not as a document, but as a living, dynamic simulation. Change one input, and the entire system—risks, scores, documents—recalibrates instantly. It offers an active, adversarial, and continuously learning AI reasoning partner that is available 24/7.</p>
                        </div>
                    </div>
                </section>

                {/* 10. Target Audience & Call to Action */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">Who This Is For</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-700">
                        {[
                            'Government & Policy Leaders: Shaping national economic strategy.',
                            'Institutional Investors: Deploying capital into complex markets.',
                            'Corporate Strategists: Planning market entry and JVs.',
                            'Regional Development Agencies: Attracting investment with verifiable proof.',
                            'Banks & Financial Institutions: From local credit unions to global banks.',
                            'Companies of any size: SMEs to multinationals pursuing regional expansion.',
                            'NGOs & Development Finance: Structuring public-private partnerships with provable outcomes.'
                        ].map((item, i) => (
                            <div key={i} className="rounded-sm border border-stone-200 p-4 bg-white">{item}</div>
                        ))}
                    </div>
                    <p className="text-stone-700 text-xs mt-3">Built to create partnerships across sectors and geographies, with a 100% regional focus to reduce bottlenecks in big cities.</p>
                    <p className="text-stone-600 text-xs mt-3">Start your journey: define your mandate, then let the system show you what’s possible.</p>
                    <p className="text-stone-600 text-[11px] mt-2 italic">The bee meets the flower: when fit is governed and evidence is live, regions bloom sustainably.</p>
                </section>

                {/* Compact closing line integrated into CTA */}

                {/* Terms of Engagement & Compliance */}
                <section className="p-10 border-t border-stone-200">
                    <h3 className="text-bw-navy font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-bw-gold" /> Terms of Engagement & Compliance
                    </h3>
                    <div className="space-y-4 text-xs text-stone-700 bg-white p-6 rounded-sm border border-stone-200 max-h-[320px] overflow-y-auto shadow-inner">
                        <p><strong className="text-stone-900 block mb-1">1. Strategic Decision Support</strong> BW Nexus AI is a sovereign-grade decision support platform. All outputs are advisory and must be validated by qualified professionals before binding commitments.</p>
                        <p><strong className="text-stone-900 block mb-1">2. Reasoning Governance (NSIL)</strong> The NSIL layer governs analysis via adversarial input screening, multi-perspective debate, counterfactual simulation, scoring engines, and a learning loop. This prevents false confidence and enforces explainability.</p>
                        <p><strong className="text-stone-900 block mb-1">3. Data Privacy & Sovereignty</strong> Strict compliance with data sovereignty and privacy laws. Sensitive intents and operational data are segregated. No user-specific data trains public models.</p>
                        <p><strong className="text-stone-900 block mb-1">4. Model Limits & Accountability</strong> The 21-formula suite (SPI™, RROI™, SEAM™, etc.) exposes fragility and leverage; it does not predict the future. Users retain final accountability for decisions.</p>
                        <p><strong className="text-stone-900 block mb-1">5. Compliance & Ethics</strong> The Regulator persona continuously checks legality, ethics, sanctions, and policy alignment. Outputs include audit trails for traceability.</p>
                        <p><strong className="text-stone-900 block mb-1">6. Liability &amp; IP Protection</strong> All intellectual property, methodologies, orchestration primitives, and the 21‑formula suite (including SPI™, RROI™, SEAM™, IVAS™, SCF™) are owned by BW Global Advisory (BWGA). Access or evaluation does not grant any license or transfer of rights. You agree to keep non‑public materials confidential, use them solely for evaluation, and not disclose, copy, reverse‑engineer, or use the system to build a competing product; any feedback becomes BWGA property. Beta/R&amp;D notice: the platform is provided “AS IS” without warranties; advisory outputs require professional validation. To the extent permitted by law, BWGA disclaims indirect, incidental, consequential, and punitive damages; total liability is capped at fees paid for the specific service. Misuse of IP may cause irreparable harm; BWGA may seek injunctive relief in addition to other remedies.</p>
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
                {/* Modal render */}
                <FormulaDeepDiveModal isOpen={showFormulaModal} onClose={() => setShowFormulaModal(false)} />
                <CatalogModal isOpen={showCatalogModal} onClose={() => setShowCatalogModal(false)} />
            </div>
        </div>
    );
};

export default CommandCenter;

