


import React, { useState } from 'react';
import { ReportParameters } from '../types';
import type { EcosystemPulse } from '../services/EventBus';
import FormulaDeepDiveModal from './FormulaDeepDiveModal';
import CatalogModal from './CatalogModal';
// Inline Letters Catalog Modal to avoid import resolution issues
interface LettersCatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LettersCatalogModal: React.FC<LettersCatalogModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-3xl bg-white rounded-sm shadow-2xl border border-stone-200">
                <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">Letters & Documents — Full Library</h3>
                    <button onClick={onClose} className="text-stone-600 hover:text-stone-900 text-xs">Close</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-stone-700 space-y-4">
                    <p className="text-stone-600">Browse a representative selection of letters and document templates. These bind to your live model to generate production‑ready drafts in seconds.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Letters</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Introductory Outreach Letters (Formal / Friendly / Executive)</li>
                                <li>Partner Introduction Letters (Government / Corporate / Investor)</li>
                                <li>Engagement Follow‑ups (Reminder / Scheduling / Clarification)</li>
                                <li>Support Letters (Policy / Banking / Consortium)</li>
                                <li>Investor Interest Letters (Soft / Firm)</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Foundation Documents</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Letter of Intent (LOI)</li>
                                <li>Memorandum of Understanding (MOU)</li>
                                <li>Non‑Disclosure Agreement (NDA)</li>
                                <li>Term Sheet</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Strategic</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Business Case</li>
                                <li>Feasibility Study</li>
                                <li>White Paper</li>
                                <li>Market Entry Strategy</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Financial & Investment</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Financial Model</li>
                                <li>Private Placement Memorandum (PPM)</li>
                                <li>Valuation Report</li>
                                <li>Monte Carlo Simulation Pack</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Risk & Due Diligence</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Due Diligence Report</li>
                                <li>AML/KYC Checklist</li>
                                <li>Sanctions Screening Report</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
                            <p className="font-semibold text-stone-900 mb-2">Government & Policy</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Policy Brief</li>
                                <li>Cabinet Memo</li>
                                <li>PPP Framework Outline</li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-xs text-stone-600">For a sector‑specific catalog and letter templates, open the Category Index or contact BW Consultant support.</p>
                </div>
            </div>
        </div>
    );
};
import GovernancePanel from './GovernancePanel';
import { ReportViewer } from './ReportViewer';
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
    const [showFormulaModal, setShowFormulaModal] = useState(false);
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [showLettersModal, setShowLettersModal] = useState(false);
        // Modal state for scenario-tailored sample package (letter + full report)
        const [showSampleModal, setShowSampleModal] = useState(false);
        const [activeSampleTab, setActiveSampleTab] = useState<'letter' | 'report'>('letter');

        const SAMPLE_NSIL = `
        <analysis_report mode="Discovery">
            <executive_summary>
                <overall_score>85</overall_score>
                <key_findings>Regional port readiness;High policy alignment;Trustee + telemetry reduces integrity risk;Cold-chain throughput provides export lift</key_findings>
                <strategic_outlook>Gensan cold-chain hub viable with probity controls; staged rollout mitigates procurement anomalies.</strategic_outlook>
            </executive_summary>
            <match_score value="83" confidence="High">
                <rationale>Japanese investor capabilities match local logistics and agribusiness potential; trustee governance reduces friction.</rationale>
            </match_score>
            <scenario name="Pilot 20-Container Run" probability="48">
                <drivers>Trusted permitting, Inspector rotation, Digital seals</drivers>
                <regional_impact>Jobs uptick; HACCP skill transfer; export volume stability.</regional_impact>
                <recommendation>Deploy RFID and digital seals; double-blind vendor selection; milestone escrow tied to evidence packs.</recommendation>
            </scenario>
            <phase name="Pilot" duration="3m" cost="$0.5M">
                <milestones>JV LOI, Trustee appointed, Telemetry live</milestones>
                <resources>Cold-chain ops team, Inspectors, Compliance unit</resources>
            </phase>
            <metadata>
                <case_id>GENSAN-COLDCHAIN-NSIL-001</case_id>
                <generated_at>2026-01-01T00:00:00Z</generated_at>
                <version>v1.0</version>
                <confidence_level>High</confidence_level>
            </metadata>
        </analysis_report>`;
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
                        <p>BW Global AI is more than an incremental improvement on existing analytical tools; it represents a fundamental leap forward in decision-making technology. By fusing a suite of proprietary mathematical engines with a multi-layered autonomous reasoning architecture, it provides a capability that has, until now, not existed: an active, adversarial, and continuously learning AI reasoning partner.</p>
                        <p>It is a system designed to combat bias, embrace uncertainty, and deliver auditable, explainable, and actionable strategic intelligence. It is a world-first.</p>
                    </div>
                </section>

                {/* 4. The Solution */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Introducing BW Global AI</h2>
                    <p className="text-stone-600 text-sm mb-3">A Strategic Intelligence and Execution Platform.</p>
                    <div className="space-y-3 text-stone-700 text-sm max-w-4xl">
                        <p>BW Global AI is best understood as a hybrid platform that merges the analytical mind of a top-tier consulting firm with the productive power of a high-end document automation factory. It is a unified environment designed to guide a user from the earliest stages of strategic conception all the way through to the generation of execution-ready deliverables.</p>
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

                {/* 8. Document Factory — Simple Overview & Quick Actions */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Document Factory: Explainable, Governed Outputs</h2>
                    <p className="text-stone-600 text-sm mb-4">The system converts a validated model into ready‑to‑send documents. Every output is traceable to assumptions, scores, and evidence — with approvals and change history logged.</p>

                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="rounded-sm border border-stone-200 p-6 bg-white">
                            <h3 className="text-sm font-bold text-stone-900 mb-2">How it works</h3>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-2">
                                <li><span className="font-semibold">Template binding:</span> Parameters → templates (LOI, NDA, Term Sheet, Policy Brief).</li>
                                <li><span className="font-semibold">Live recalculation:</span> Change inputs → regenerate sections + redlines.</li>
                                <li><span className="font-semibold">Provenance:</span> Sources, assumptions, and sensitivity ranges attached.</li>
                                <li><span className="font-semibold">Approvals:</span> Role‑based gating before export and outreach.</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 p-6 bg-white">
                                                        <h3 className="text-sm font-bold text-stone-900 mb-2">Quick access</h3>
                                                        <div className="grid grid-cols-2 gap-3">
                                                                <button
                                                                    onClick={() => setShowLettersModal(true)}
                                                                    className="bg-bw-navy text-white py-3 px-4 rounded-sm text-xs font-bold tracking-wide hover:bg-bw-gold hover:text-bw-navy transition-colors"
                                                                    title="View full letters & documents"
                                                                >
                                                                    Letters & Documents Catalog
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowCatalogModal(true)}
                                                                    className="bg-white text-bw-navy border border-bw-navy py-3 px-4 rounded-sm text-xs font-bold tracking-wide hover:bg-bw-navy hover:text-white transition-colors"
                                                                    title="View category index"
                                                                >
                                                                    Category Index (24+)
                                                                </button>
                                                        </div>
                                                        <p className="text-xs text-stone-600 mt-3">Pop‑up windows show the full library and category index.</p>
                        </div>
                    </div>

                                        {/* Descriptive overview */}
                                        <div className="rounded-sm border border-stone-200 p-6 bg-white mb-6 space-y-3 text-sm text-stone-700">
                                                <h3 className="text-sm font-bold text-stone-900">The Document Factory: From Analysis to Actionable Deliverables</h3>
                                                <p>A validated strategy is useless if it remains trapped in a dashboard. The BW Nexus AI platform includes a powerful Document Factory designed to convert analytical insights into professional, execution‑ready deliverables instantly. This capability closes the gap between decision and action, enabling teams to move with unprecedented speed.</p>
                                                <p>The platform's library contains over 200 unique document types and 150 letter templates across 14 distinct categories, covering the full spectrum of strategic, legal, financial, and operational needs. This includes, but is not limited to:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li><span className="font-semibold">Foundation Documents:</span> LOI, MOU, NDA, Term Sheets.</li>
                                                    <li><span className="font-semibold">Strategic Documents:</span> Business Cases, Feasibility Studies, White Papers, Market Entry Strategies.</li>
                                                    <li><span className="font-semibold">Financial & Investment Documents:</span> Financial Models, PPMs, Valuation Reports, Monte Carlo Simulations.</li>
                                                    <li><span className="font-semibold">Risk & Due Diligence Documents:</span> Due Diligence Reports, AML/KYC Checklists, Sanctions Screening Reports.</li>
                                                    <li><span className="font-semibold">Government & Policy Documents:</span> Policy Briefs, Cabinet Memos, PPP Frameworks.</li>
                                                </ul>
                                                <p>When a user requests a document, the system automatically populates the template with relevant data and analysis from their live model, producing a production‑ready draft in seconds. This transforms the platform from a mere analytical tool into a true execution engine.</p>
                                        </div>

                    {/* Production specs + provenance preview intentionally removed per request */}
                </section>

                {/* Scenario Spotlight — Overview (no modal, single action) */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Scenario Spotlight: General Santos (Mindanao)</h2>
                    <p className="text-stone-600 text-sm mb-4">Regional port and agribusiness hub facing integrity and security challenges impacting investor confidence.</p>
                    <div className="rounded-sm border border-stone-200 p-6 bg-white">
                        <div className="grid md:grid-cols-2 gap-6 text-sm text-stone-700">
                            <div>
                                <p><span className="font-semibold">City:</span> General Santos (Mindanao; regional port and agribusiness hub)</p>
                                <p><span className="font-semibold">Deal:</span> Japanese cold-chain and export logistics investor planning a $45M regional hub (portside cold storage, reefer trucking, HACCP-certified processing)</p>
                                <p><span className="font-semibold">Department:</span> DOTr Regional Operations with LGU coordination</p>
                                <p><span className="font-semibold">Issues:</span> Smuggling interference, opaque permitting, vendor collusion</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Solution:</span> Integrity Pact; independent trustee; RFID + digital seals; clean-room inspector rotation; double‑blind procurement; milestone escrow with evidence packs.</p>
                                <p className="mt-2"><span className="font-semibold">Outcome:</span> Minute-level assurance; anomaly rate under 0.5%; capital unlock; local jobs.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => { setActiveSampleTab('letter'); setShowSampleModal(true); }}
                                className="bg-bw-navy text-white py-3 px-4 rounded-sm text-xs font-bold tracking-wide hover:bg-bw-gold hover:text-bw-navy transition-colors"
                            >
                                View Sample Package (Letter + Report)
                            </button>
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
                            <p className="text-sm text-stone-700">BW Global AI treats a strategic plan not as a document, but as a living, dynamic simulation. Change one input, and the entire system—risks, scores, documents—recalibrates instantly. It offers an active, adversarial, and continuously learning AI reasoning partner that is available 24/7.</p>
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

                {/* Governance & Provenance */}
                <section className="p-10 border-t border-stone-200">
                    <GovernancePanel reportId={reportId} />
                </section>
                {/* Scenario Sample Modal: Letter + Report (tabs) */}
                {showSampleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setShowSampleModal(false)} />
                        <div className="relative z-10 w-full max-w-4xl bg-white rounded-sm shadow-2xl border border-stone-200">
                            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900">Scenario Package — General Santos Cold‑Chain Hub</h3>
                                    <p className="text-xs text-stone-600">City: General Santos (Mindanao) · Investor: Japanese cold‑chain & export logistics · Dept: DOTr + LGU</p>
                                </div>
                                <button onClick={() => setShowSampleModal(false)} className="text-stone-600 hover:text-stone-900 text-xs">Close</button>
                            </div>
                            <div className="px-4 pt-3 flex items-center gap-2 border-b border-stone-200">
                                <button
                                    className={`text-xs font-bold px-3 py-2 rounded-sm ${activeSampleTab === 'letter' ? 'bg-bw-navy text-white' : 'bg-stone-100 text-stone-700'}`}
                                    onClick={() => setActiveSampleTab('letter')}
                                >Letter</button>
                                <button
                                    className={`text-xs font-bold px-3 py-2 rounded-sm ${activeSampleTab === 'report' ? 'bg-bw-navy text-white' : 'bg-stone-100 text-stone-700'}`}
                                    onClick={() => setActiveSampleTab('report')}
                                >Full Report</button>
                            </div>
                            <div className="p-4 max-h-[70vh] overflow-y-auto">
                                {activeSampleTab === 'letter' ? (
                                    <div className="prose prose-stone max-w-none">
                                        <div className="border border-stone-200 rounded-md p-6">
                                            <div className="mb-4">
                                                <h4 className="text-lg font-serif font-bold text-stone-900">Letter of Intent — General Santos Cold‑Chain Hub</h4>
                                                <p className="text-xs text-stone-600">Date: 01 Jan 2026</p>
                                            </div>
                                            <div className="text-sm text-stone-700 space-y-4">
                                                <p>To: Department of Transportation (DOTr), Regional Operations — with coordination to the General Santos LGU</p>
                                                <p>From: Japanese Cold‑Chain & Export Logistics JV</p>
                                                <p>Subject: Establishment of a $45M Regional Cold‑Chain and Export Logistics Hub (Portside cold storage, reefer trucking, HACCP‑certified processing)</p>
                                                <p>We intend to establish a regional cold‑chain logistics hub in General Santos (Mindanao), a critical agribusiness and port node. Current investor confidence is constrained by integrity and security risks including smuggling interference, opaque permitting, and vendor collusion. To address these, we propose a jointly governed architecture with the following controls:</p>
                                                <ul className="list-disc pl-5">
                                                    <li>Integrity Pact and independent trustee oversight to separate decision rights from vendor access.</li>
                                                    <li>RFID and digital seals across containers and critical workflows with live anomaly alerting.</li>
                                                    <li>Clean‑room inspector rotation and double‑blind procurement to reduce capture risk.</li>
                                                    <li>Milestone escrow tied to evidence packs and tamper‑evident provenance.</li>
                                                </ul>
                                                <p>With these measures, we forecast minute‑level assurance, anomaly rates under 0.5%, and a durable unlock of capital flows and jobs. We request DOTr’s facilitation for permits and operational interfaces, and LGU’s support in site selection and coordination.</p>
                                                <p>Upon acceptance, we will proceed with a 3‑month pilot (estimated $0.5M), including LOI confirmation, trustee appointment, and telemetry activation, followed by staged scale‑up.</p>
                                                <p>Sincerely,<br/>Japanese Cold‑Chain & Export Logistics JV</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <ReportViewer nsilContent={SAMPLE_NSIL} />
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
                                <LettersCatalogModal isOpen={showLettersModal} onClose={() => setShowLettersModal(false)} />
            </div>
        </div>
    );
};

export default CommandCenter;

