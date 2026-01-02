


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
                {/* Hero */}
                <section className="bg-bw-navy text-white p-12">
                    <div className="flex items-center gap-2 text-bw-gold font-bold tracking-widest text-xs uppercase mb-4">
                        <Layers size={14} /> BW Nexus AI Command Center
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Architecture of an Autonomous Reasoning Partner</h1>
                    <p className="text-bw-gold font-semibold mb-6">A Strategic Intelligence &amp; Execution Platform for decisions that must survive scrutiny.</p>
                    <div className="text-gray-200 text-sm leading-relaxed border-l-2 border-bw-gold pl-6 max-w-3xl space-y-3">
                        <p className="text-bw-gold font-semibold">The strategic imperative is clear: decision-making is now too complex, too fast, and too consequential for static work products.</p>
                        <p>Governments and institutions are being asked to make high-stakes choices across economic policy, investment, security, procurement, and regional development — inside a landscape of interconnected risks, hidden variables, and cognitive bias.</p>
                        <p>Traditional tools — months-long consulting engagements, static reports, and siloed expert opinions — are often too slow, too expensive, and too brittle under real-world volatility. They frequently produce a single-point forecast with no auditable chain of custody, no live regeneration, and no enforceable governance controls.</p>
                        <p className="text-white"><span className="font-semibold">BW Nexus AI changes the work product.</span> You provide the mandate, constraints, and risk appetite. The system builds a live decision model, stress-tests assumptions, runs adversarial challenge, executes the 21-formula suite, and outputs a governed decision packet — with controls, evidence requirements, and export gating.</p>
                    </div>
                </section>

                {/* What makes it different */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Why This Matters (Now)</h2>
                    <p className="text-stone-600 text-sm mb-6">The global direction is clear: trustworthy AI requires transparency, robustness, and accountability — not just convincing language.</p>
                    <div className="rounded-sm border border-stone-200 bg-white p-6 text-sm text-stone-700 space-y-4 max-w-4xl">
                        <p>Across jurisdictions, risk frameworks and AI governance standards are converging on the same requirements: explainability, traceability, safety, and accountability. Frameworks like the NIST AI Risk Management Framework and the OECD AI Principles are explicit about the need for transparency, robustness, and accountability — especially in high-impact settings.</p>
                        <p className="font-semibold text-stone-900">What breaks in the real world:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">Consulting</span> produces static artifacts that age instantly and are expensive to refresh.</li>
                            <li><span className="font-semibold">Dashboards / BI</span> describe what happened, but don’t generate governed decisions under uncertainty.</li>
                            <li><span className="font-semibold">GenAI chat</span> generates persuasive language without a verifiable decision chain.</li>
                        </ul>
                        <p className="font-semibold text-stone-900">BW Nexus AI is not a writing system. It is an autonomous reasoning partner:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">It refuses bad inputs</span> — contradictions, missing basics, and sanctions red flags are surfaced before analysis.</li>
                            <li><span className="font-semibold">It debates your plan</span> — Skeptic, Advocate, Regulator, Accountant, Operator (and records disagreement instead of faking certainty).</li>
                            <li><span className="font-semibold">It runs the 21-formula suite</span> — core engines + derivative indices; each score emits drivers, pressure points, and a confidence band.</li>
                            <li><span className="font-semibold">It outputs an executable packet</span> — controls, actions, evidence requirements, and export readiness.</li>
                            <li><span className="font-semibold">It enforces governance</span> — provenance is logged, approvals are staged, exports can be blocked until approved.</li>
                        </ul>
                        <p className="font-semibold text-stone-900">Result: a decision chain that can survive scrutiny — not just presentation.</p>
                    </div>
                </section>

                {/* NSIL stack */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Core Innovation: NSIL (Nexus Strategic Intelligence Layer)</h2>
                    <p className="text-stone-600 text-sm mb-6">NSIL is the platform’s autonomous reasoning engine. It treats each mandate as a live simulation and governs the path from intake → analysis → export.</p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">Layer 1 — Adversarial Input Shield</h3>
                            <p className="text-sm text-stone-700 mb-3">Pre-flight validation catches contradictions, missing basics, unrealistic projections, and sanctions-style red flags before they contaminate the decision record.</p>
                            <p className="text-xs text-stone-500">Outputs: trust score, status (trusted → rejected), flagged fields, and remediation steps.</p>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">Layer 2 — Multi-Perspective Debate</h3>
                            <p className="text-sm text-stone-700 mb-3">Five personas evaluate the plan in parallel: Skeptic, Advocate, Regulator, Accountant, Operator.</p>
                            <p className="text-xs text-stone-500">Outputs: consensus, dissent points, and the exact issues to resolve before “yes”.</p>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">Layer 3 — 21-Formula Execution</h3>
                            <p className="text-sm text-stone-700 mb-3">Core engines and derivative indices run as inspectable calculations with weights, thresholds, and confidence gating — so stakeholders can challenge the drivers, not argue about vibes.</p>
                            <p className="text-xs text-stone-500">Outputs: scores, drivers, pressure points, and confidence bands.</p>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">Layer 4 — Counterfactual & Stress Testing</h3>
                            <p className="text-sm text-stone-700 mb-3">The system generates alternative scenarios and tests how fragile the strategy is under adverse conditions.</p>
                            <p className="text-xs text-stone-500">Outputs: worst-case deltas, regrets, and the highest-impact mitigations.</p>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6 md:col-span-2">
                            <h3 className="font-bold text-stone-900 mb-2">Layer 5 — Synthesis Into Governable Outputs</h3>
                            <p className="text-sm text-stone-700">All signals are synthesized into a recommendation, then converted into a <span className="font-semibold text-stone-900">decision packet</span> (controls, actions, evidence list, export readiness) with provenance and approval workflow.</p>
                        </div>
                    </div>
                </section>

                {/* The 21 formulas */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The 21-Formula Suite (Inspectability Is the Product)</h2>
                    <p className="text-stone-600 text-sm mb-6">This is the engine room. The suite turns strategic intent into quantified scores with drivers, confidence gating, and remediation actions.</p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">5 Primary Engines</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-stone-700">
                                <li><span className="font-semibold">SPI</span> — partner fit via weighted signals and constraints.</li>
                                <li><span className="font-semibold">RROI</span> — regional return with downside-adjusted resilience.</li>
                                <li><span className="font-semibold">SEAM</span> — ecosystem / stakeholder alignment and friction mapping.</li>
                                <li><span className="font-semibold">IVAS</span> — viability under uncertainty bands (scenario variance).</li>
                                <li><span className="font-semibold">SCF</span> — strategic cash-flow impact with confidence framing.</li>
                            </ul>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">16 Derivative Indices</h3>
                            <p className="text-sm text-stone-700 mb-3">Specialist indices explain <span className="font-semibold">why</span> a plan is strong/weak (capability, governance, cost, risk concentration, regulatory friction, and more).</p>
                            <p className="text-xs text-stone-500">These indices drive remediation actions and control thresholds in the decision packet.</p>
                        </div>
                        <div className="rounded-sm border border-amber-200 bg-amber-50 p-6 md:col-span-2">
                            <h3 className="font-bold text-amber-900 mb-2">Proof Mechanics (Examples)</h3>
                            <div className="bg-white border border-amber-200 rounded-sm p-4 text-xs text-stone-800 space-y-2">
                                <div className="font-bold text-stone-900">Risk Concentration (Herfindahl-like)</div>
                                <div className="font-mono">RCI = Σ (pᵢ²)</div>
                                <div className="text-stone-700">Flags single-point exposure and recommends diversification actions.</div>
                                <div className="border-t border-amber-200 pt-2" />
                                <div className="font-bold text-stone-900">Evidence Confidence Gate</div>
                                <div className="font-mono">ECS = coverage × freshness × diversity</div>
                                <div className="text-stone-700">Low ECS clamps certainty and forces explicit caution language.</div>
                            </div>
                            <p className="text-xs text-amber-900 mt-3">Math is not decoration here. It’s the auditable contract between inputs and outputs.</p>
                        </div>
                    </div>
                </section>

                {/* Generic/Agentic Brain */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The Agentic Core (Generic Brain)</h2>
                    <p className="text-stone-600 text-sm mb-6">This is what makes the platform operationally different: a persistent digital worker that orchestrates reasoning, governance, and regeneration — not just content.</p>
                    <div className="rounded-sm border border-stone-200 bg-white p-6 text-sm text-stone-700 space-y-4 max-w-5xl">
                        <p className="font-semibold text-stone-900">The architecture is deliberately modular:</p>
                        <ul className="grid md:grid-cols-2 gap-2 text-sm text-stone-700">
                            <li>• SAT-style contradiction checks for input integrity</li>
                            <li>• Vector memory retrieval for similar historical cases</li>
                            <li>• DAG scheduler for the 21 formulas (dependencies handled correctly)</li>
                            <li>• Bayesian persona debate with early stopping</li>
                            <li>• Lazy evaluation for derivative indices (compute on demand)</li>
                            <li>• Decision-tree synthesis for output structuring</li>
                        </ul>
                        <p className="text-xs text-stone-500">This is why the system regenerates fast when one assumption changes: only impacted dependencies recompute, then the packet and deliverables are re-synthesized with provenance intact.</p>
                    </div>
                </section>

                {/* Outputs */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">What You Get: Decision Packet + Document Factory</h2>
                    <p className="text-stone-600 text-sm mb-6">The output is structured to execute — and designed to be audited.</p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">A Governed Decision Packet</h3>
                            <p className="text-sm text-stone-700 mb-3">Instead of a narrative memo, you get a packet with explicit controls and readiness gates.</p>
                            <div className="bg-stone-50 border border-stone-200 rounded-sm p-4 text-xs">
                                <div className="font-mono text-stone-800 space-y-1">
                                    <div>{`phases: [intake, validate, debate, score, synthesize, controls, approvals...]`}</div>
                                    <div>{`controls: [{ metric, threshold, action }, ...]`}</div>
                                    <div>{`actions: [{ title, owner?, due?, criteria? }, ...]`}</div>
                                    <div>{`exports: { reportReady, loiReady, blockers: [...] }`}</div>
                                    <div>{`evidence: [...]`}</div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-sm border border-stone-200 bg-white p-6">
                            <h3 className="font-bold text-stone-900 mb-2">A Large Document Library</h3>
                            <p className="text-sm text-stone-700 mb-3">When the decision is ready, the system can generate execution deliverables from the live model (LOIs, MOUs, term sheets, memos, briefs, and more).</p>
                            <p className="text-xs text-stone-500">The platform includes a document library spanning 200+ document types (and a growing template set for formal letters), built to convert analysis into action without losing governance.</p>
                        </div>
                    </div>
                </section>

                {/* The chain of custody */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">The 10-Step Chain of Custody (How a Decision Becomes Exportable)</h2>
                    <p className="text-stone-600 text-sm mb-4">This is the workflow that turns ambiguity into a governed artifact you can actually share.</p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-stone-700 max-w-4xl">
                        <li><span className="font-semibold">Mandate capture</span> — mission, location, intent, constraints.</li>
                        <li><span className="font-semibold">Input shield</span> — contradictions, missing essentials, sanctions-style red flags.</li>
                        <li><span className="font-semibold">Persona debate</span> — Skeptic/Advocate/Regulator/Accountant/Operator evaluation.</li>
                        <li><span className="font-semibold">Core scoring</span> — SPI/RROI/SEAM/IVAS/SCF produce scores + drivers.</li>
                        <li><span className="font-semibold">Derivative indices</span> — readiness, governance, cost, concentration, friction, resilience.</li>
                        <li><span className="font-semibold">Counterfactuals</span> — adverse scenarios + fragility checks.</li>
                        <li><span className="font-semibold">Synthesis</span> — unified recommendation and key decision points.</li>
                        <li><span className="font-semibold">Controls bound</span> — thresholds + remediation actions attached to the plan.</li>
                        <li><span className="font-semibold">Governance stage</span> — approvals logged, provenance timeline built.</li>
                        <li><span className="font-semibold">Export gating</span> — exports blocked until required fields exist and stage ≥ approved.</li>
                    </ol>
                </section>

                {/* Regional development reframing */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Regional Development (Making Opportunity Investable)</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>Regional economies are the backbone of national strength — yet capital concentrates in major hubs because regional opportunity is harder to explain, harder to govern, and harder to defend under scrutiny.</p>

                        <p className="font-semibold text-stone-900">Why bigger cities keep winning (even when they’re saturated)</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">Lower perceived execution risk</span> — talent, vendors, logistics, and “known-good” counterparties feel easier to validate.</li>
                            <li><span className="font-semibold">Signal value</span> — a tier‑1 city address can satisfy committees, lenders, and boards even when fundamentals are weaker.</li>
                            <li><span className="font-semibold">Faster approvals &amp; familiarity</span> — teams know the playbook, so fewer unknowns need to be explained.</li>
                            <li><span className="font-semibold">Network effects</span> — clusters create a self-reinforcing magnet (even as congestion, costs, and bottlenecks rise).</li>
                        </ul>

                        <p className="font-semibold text-stone-900">Why regional cities are often overlooked (even when the upside is real)</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">Information friction</span> — fragmented data, inconsistent signals, and local nuance that outsiders can’t easily price.</li>
                            <li><span className="font-semibold">Governance uncertainty</span> — permitting variance, partner quality, and compliance exposure are hard to quantify up-front.</li>
                            <li><span className="font-semibold">“Investability gap”</span> — opportunity exists, but it isn’t packaged into an auditable, committee-ready decision chain.</li>
                        </ul>

                        <p className="font-semibold text-stone-900">What BW Nexus AI does differently</p>
                        <p>It closes the investability gap by turning a regional opportunity into a governed case: quantified drivers, explicit controls, staged commitments, and an evidence trail that can survive audit.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><span className="font-semibold">De-risks market entry</span> with persona debate, counterfactual stress tests, and confidence gating (so uncertainty is explicit, not hidden).</li>
                            <li><span className="font-semibold">Makes mitigation enforceable</span> by binding thresholds and actions to the plan (not just listing risks in prose).</li>
                            <li><span className="font-semibold">Builds committee-grade artifacts</span> — decision packet + export gating + provenance.</li>
                        </ul>

                        <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-amber-900 text-xs">
                            <p className="font-bold">Bee · Flower · Meadow</p>
                            <p className="mt-1">Big cities are where the bees already gather — dense networks, known signals, easy validation. Regional cities can be extraordinary flowers, but they’re often invisible from the boardroom because the meadow isn’t mapped.</p>
                            <p className="mt-2">BW Nexus AI maps the meadow: it makes regional opportunity legible, governable, and repeatable — so investment follows fundamentals, not just familiarity.</p>
                        </div>

                        <p>Every major city started smaller. The constraint is not ambition — it’s whether opportunity can be structured into controlled, auditable commitments that unlock capital and talent without gambling on unknowns.</p>
                    </div>
                </section>

                {/* Who it is for */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Who It’s For</h2>
                    <div className="space-y-4 text-stone-700 text-sm max-w-4xl">
                        <p>BW Nexus AI is built for organizations that must make decisions that survive scrutiny — politically, financially, legally, and operationally — and want to upgrade capability without waiting months for static deliverables.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Government &amp; policy leadership</li>
                            <li>Investment screening and capital allocation teams</li>
                            <li>Banks and risk committees</li>
                            <li>PPP and infrastructure program owners</li>
                            <li>Corporate strategy and operators</li>
                            <li>Regional development agencies</li>
                        </ul>
                        <p><span className="font-semibold">Built by BW Global Advisory:</span> an independent Australian initiative, founded and solely developed by Brayden Walls.</p>
                    </div>
                </section>

                {/* CTA framing */}
                <section className="p-10 border-t border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Start Here</h2>
                    <p className="text-stone-700 text-sm max-w-4xl">Accept the Terms of Engagement to proceed, then define your mandate. The system will run NSIL + the 21-formula suite to generate a governed decision packet — and the execution deliverables needed to act.</p>
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
                        <p><strong className="text-stone-900 block mb-1">1. Strategic Decision Support</strong> BW Nexus AI is a decision support platform. All outputs are advisory and must be validated by qualified professionals before binding commitments.</p>
                        <p><strong className="text-stone-900 block mb-1">2. Reasoning Governance (NSIL)</strong> The NSIL layer governs analysis via adversarial input screening, multi-perspective debate, counterfactual simulation, scoring engines, and a learning loop. This reduces false confidence and enforces explainability.</p>
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

