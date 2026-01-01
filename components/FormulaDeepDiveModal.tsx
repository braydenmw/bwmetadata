import React from 'react';
import { X, BookOpen } from 'lucide-react';

type FormulaDeepDiveModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FormulaDeepDiveModal: React.FC<FormulaDeepDiveModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900">BWGA Intelligence AI — Full Technical Brief &amp; System Audit</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <section className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">BW Nexus AI — Technical Proof &amp; Comparative Brief</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Prepared For: Funding partners, strategic partners, government, institutions, banks, enterprises.</p>
                        <p className="text-slate-600 text-sm leading-relaxed">Prepared By: BW Global Advisory (BWGA) — Founding Architect: Brayden Walls.</p>
                        <p className="text-slate-600 text-sm leading-relaxed">System: BW Nexus AI + NSIL (Nexus Strategic Intelligence Layer) with the Agentic Brain.</p>
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">Positioning: A sovereign-grade, explainable, auditable, and continuously learning decision-support platform. Not a black box. Governed reasoning with live deliverables.</p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Executive Proof Summary</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Claim:</span> BW Nexus AI with NSIL + Agentic Brain is a world‑first governed reasoning platform that treats mandates as living simulations.</li>
                            <li><span className="font-semibold">Outcome:</span> Converts a mandate into adversarial debate, counterfactuals, explainable scores, traceable recommendations, and live deliverables.</li>
                            <li><span className="font-semibold">Why new:</span> Agentic AI applied to judgment (not tasks), under explicit governance, with a formal 21‑formula suite and auditable “why” chains.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Category Definition</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">Governed Strategic Intelligence Systems: computable intent, adversarial reasoning, counterfactual stress testing, explainable scoring, live documents, and complete traceability.</p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Novelty Claim</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Intent Computation:</span> Structures human mandates into machine‑legible models without losing real‑world richness.</li>
                            <li><span className="font-semibold">Governed Reasoning (NSIL):</span> Validate → Debate → Counterfactuals → Score → Synthesize → Deliver prevents false confidence.</li>
                            <li><span className="font-semibold">Agentic Brain:</span> Owns the case, anticipates questions, prepares analyses, surfaces contradictions, and learns continuously — every step traceable.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Architectural Proofs</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Planes Separation:</span> Control‑plane (governance, scoring, orchestration) distinct from data‑plane (inputs, storage, exports).</li>
                            <li><span className="font-semibold">Explainability Contracts:</span> Each score has definitions, drivers, pressure points, assumptions, evidence citations.</li>
                            <li><span className="font-semibold">Traceability:</span> Debate transcripts, contradiction flags, counterfactuals, score rationales, and deliverable provenance form a complete why chain.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">21‑Formula Suite</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-2">Primary engines: SPI™, RROI™, SEAM™, IVAS™, SCF™. Derivatives: 16 indices for alignment, risk, viability, capacity, velocity, resilience.</p>
                        <p className="text-slate-600 text-sm leading-relaxed">Purpose: Not prediction — exposure of fragility, leverage, hidden failure points, and misalignment costs. Each with explainability contracts.</p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Proof by Collapse (Scenario)</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-2">Ambitious regional mandate → legacy approaches collapse; Nexus holds.</p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Consulting:</span> Latency, static PDFs, no instant recalculation.</li>
                            <li><span className="font-semibold">BI Dashboards:</span> Data visualization without governed reasoning.</li>
                            <li><span className="font-semibold">LLM Copilots:</span> Unstructured prompts, non‑traceable outputs.</li>
                            <li><span className="font-semibold">Spreadsheets:</span> Non‑reactive; fragile under change.</li>
                            <li><span className="font-semibold">Nexus Path:</span> Governed debate, counterfactuals, explainable scores, live documents that update instantly.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Governance &amp; Explainability</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Adversarial Shield:</span> Contradiction detection; sanction, compliance, ethics checks.</li>
                            <li><span className="font-semibold">Multi‑Perspective Debate:</span> Skeptic, Advocate, Regulator, Accountant, Operator — parallel reasoning.</li>
                            <li><span className="font-semibold">Counterfactual Lab:</span> Sensitivity and robustness quantification with explicit deltas.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Document Factory (Live)</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-2">Live documents: change one variable; risks, scores, timelines, and instrument drafts re‑compute across the set.</p>
                        <p className="text-slate-600 text-sm leading-relaxed">Guided delivery: a BW Consultant accompanies the journey with evidence‑linked outputs.</p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Comparative Matrix (Market Landscape)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-bold text-slate-800 mb-2">Legacy Approaches</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>Consulting: Static, expensive, slow; no live governance or instant recalculation.</li>
                                    <li>BI/Analytics: Visualize data; lack adversarial governance and live deliverables.</li>
                                    <li>LLM Copilots: Unstructured prompts; non‑traceable; no formula‑level explainability.</li>
                                    <li>Spreadsheets: Non‑reactive systems; fragile under change.</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-bold text-slate-800 mb-2">BW Nexus AI</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>Governed reasoning (NSIL) + Agentic execution (Brain).</li>
                                    <li>Counterfactuals + 21‑formula explainable scoring.</li>
                                    <li>Traceability: complete why chain and evidence provenance.</li>
                                    <li>Live documents: instant recalculation of deliverables on change.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Defensibility</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">IP Boundary:</span> Governance protocols + formula suite + orchestration primitives.</li>
                            <li><span className="font-semibold">Audit Posture:</span> Evidence provenance and explainability contracts; advisory outputs require professional validation.</li>
                            <li><span className="font-semibold">Falsifiability:</span> If contradictions aren’t caught, scores aren’t explainable, or documents aren’t live, the claim fails.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Limits &amp; Posture</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Decision‑Support: Advisory outputs; users retain final accountability.</li>
                            <li>Data Connectors: Live connectors recommended for institutional deployment.</li>
                            <li>Human Oversight: Professional validation for binding commitments.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Deployment Readiness</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Modular architecture ready for auth, tenancy, immutable logs.</li>
                            <li>Deterministic payload assembly; simulation harness for repeatability.</li>
                            <li>Score calibration and narrative evaluation on the roadmap.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Target Users</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Government &amp; Policy: National/regional strategy.</li>
                            <li>Companies: SMEs → multinationals.</li>
                            <li>Banks &amp; DFIs: Risk registers, explainable confidence, compliance.</li>
                            <li>Regional Agencies &amp; NGOs: Equitable, region‑first growth and partnerships.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Evidence Lines</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Category Primitives:</span> Computable mandate + NSIL governance + Agentic Brain + 21‑formula suite + live documents + traceability.</li>
                            <li><span className="font-semibold">Comparative Outcomes:</span> Only Nexus unifies all primitives; legacy stacks fail specific governance/explainability/live‑document criteria.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Appendices &amp; Addendum</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Governance Protocols &amp; Explainability Contracts</li>
                            <li>Formula Specs (SPI/RROI/SEAM/IVAS/SCF)</li>
                            <li>Evidence Provenance &amp; Audit Trails</li>
                            <li>Hardening Blueprint &amp; Integration Model</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Reliability, Observability, and Operational Readiness</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Health endpoint /api/health used for liveness probes</li>
                            <li>Console logging today; roadmap includes request IDs, structured logs, metrics, tracing</li>
                            <li>Suggested SLOs: API availability 99.5%+, P95 latency &lt; 300ms for non-AI routes, deterministic scoring for identical inputs</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Deployment &amp; Environments</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Local: npm run dev, npm run dev:server, npm run dev:all</li>
                            <li>Builds: npm run build, npm run build:server, npm run start</li>
                            <li>Docker: multi-stage file building frontend then running Node server</li>
                            <li>Railway + Netlify configuration with healthchecks and redirects</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Testing, Verification, and Quality Controls</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Simulation harness validates payload completeness and captures runtime data</li>
                            <li>Recommended additions: unit tests for scoring, regression tests for schema, snapshot tests for templates, security red-team tests</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Risks, Gaps, and Recommendations</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Priority 1:</span> add authn/authz, replace file storage with database + tenancy boundaries, implement immutable audit logging</li>
                            <li><span className="font-semibold">Priority 2:</span> formalize scoring documentation and evaluation harnesses for AI content quality</li>
                            <li><span className="font-semibold">Priority 3:</span> connector framework for live data sources with caching and provenance</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Partnership &amp; Integration Model</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>White-label regional deployments</li>
                            <li>Data partnerships with governments and institutions</li>
                            <li>Workflow partnerships (consultancies, accelerators, banks)</li>
                            <li>Institutional integrations (banks, funds, DFIs) consuming scoring outputs</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Funding Readiness: Why This Can Scale</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Modular component architecture ready for hardening</li>
                            <li>Central orchestration (ReportOrchestrator) provides defensible IP boundary</li>
                            <li>Simulation harness proves repeatability</li>
                            <li>Clear packaging: structured intake -&gt; explainable scores -&gt; deliverables</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Appendices &amp; Addendum (Overview)</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Appendix A — Backend API Catalog (health, AI, reports, autonomous)</li>
                            <li>Appendix B — Environment Variables (GEMINI_API_KEY, FRONTEND_URL, optional connectors)</li>
                            <li>Appendix C — Evidence sources (SYSTEM_ARCHITECTURE.md, NSIL_REFERENCE_PAPER.md, etc.)</li>
                            <li>Appendix D — Terminology (decision-support, explainability, audit trail, provenance)</li>
                            <li>A1) System Inventory</li>
                            <li>A2) API Surface</li>
                            <li>A3) Report Lifecycle</li>
                            <li>A4) Security &amp; Privacy Narrative</li>
                            <li>A5) Compliance &amp; Auditability</li>
                            <li>A6) Enterprise Hardening Blueprint</li>
                            <li>A7) Partner Value Proposition</li>
                            <li>A8) Suggested 20-page PDF Layout</li>
                            <li>A9) Engine Specifications (SPI, RROI, SEAM, IVAS, SCF)</li>
                            <li>A10) Data Provenance &amp; Evidence Design</li>
                            <li>A11) Document Generation Pipeline</li>
                            <li>A12) Performance &amp; Scalability</li>
                            <li>A13) Audit Checklist</li>
                            <li>A14) Partnership Packaging</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormulaDeepDiveModal;
