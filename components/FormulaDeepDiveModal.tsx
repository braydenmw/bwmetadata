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
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Full Technical Brief &amp; System Audit (Funding + Partnership Package)</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Prepared for: Funding partners, strategic partners, government stakeholders, and institutional collaborators
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Prepared by: BW Global Advisory (BWGA)
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            System: BWGA Intelligence AI + NSIL (Nexus Strategic Intelligence Layer)
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Date: 2025-12-30
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Document Version: 1.0 (Repo-derived)
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">
                            This page is intentionally formatted like a professional audit brief. Every section mirrors repository artifacts so a funding,
                            partnership, or government reviewer can evaluate feasibility, defensibility, and scalability without leaving this screen.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Document Use, Confidentiality &amp; Positioning</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Funding diligence (technical feasibility, defensibility, scalability)</li>
                            <li>Partnership discussions (integration points, governance, operating model)</li>
                            <li>Government and institutional evaluation (auditability, transparency, decision-support posture)</li>
                        </ul>
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">
                            <span className="font-semibold">Important framing:</span> BWGA Intelligence AI is a decision-support system. It does not replace legal,
                            financial, compliance, engineering, or investment advice. Several modules currently rely on mock or static data and AI-assisted
                            narrative generation; the architecture is designed for rapid extension to live connectors.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Table of Contents (Print/PDF Alignment)</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                            <li>Executive Summary</li>
                            <li>System Goals &amp; the Problem Space</li>
                            <li>Product Definition (What It Is / Is Not)</li>
                            <li>High-Level Architecture (Client / Server / Intelligence Services)</li>
                            <li>Core User Journeys &amp; Workflow</li>
                            <li>Data Model &amp; Persistence Strategy</li>
                            <li>Intelligence Architecture: NSIL, BW Brain, and Multi-Agent Reasoning</li>
                            <li>Scoring Layer: 21-Formula Suite</li>
                            <li>Algorithm Layer: Speed, Consistency, Repeatability</li>
                            <li>Frontend Technical Architecture</li>
                            <li>Backend Technical Architecture</li>
                            <li>Report Orchestration &amp; Document Generation</li>
                            <li>Security, Privacy, and Governance Controls</li>
                            <li>Reliability, Observability, and Operational Readiness</li>
                            <li>Deployment &amp; Environments</li>
                            <li>Testing, Verification, and Quality Controls</li>
                            <li>Risks, Gaps, and Recommendations</li>
                            <li>Partnership &amp; Integration Model</li>
                            <li>Funding Readiness: Why This Can Scale</li>
                            <li>Appendices &amp; Addendum</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Executive Summary</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            BWGA Intelligence AI is an enterprise-grade partnership intelligence and deal feasibility platform built with React 19, TypeScript 5,
                            Vite 6, TailwindCSS, Node.js, Express, Helmet, CORS, Compression, and Gemini-powered intelligence services. The repository already
                            contains validation, maturity scoring, persistence, persona reasoning, counterfactual analysis, outcome learning, and report
                            orchestration modules.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            This brief is organized to answer diligence questions: what is implemented, how data flows, what controls prevent unreliable output,
                            what must be hardened for government or enterprise deployment, and where partners can integrate.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Operationally, the system converts a mandate (who, what, where, constraints, risk appetite) into a structured case, multi-perspective
                            reasoning, explainable quantitative scores, and ready-to-send deliverables. The goal is to compress time-to-clarity while keeping every
                            assumption traceable.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">
                            Current status: a React/Vite application with dozens of components, an Express backend exposing AI/search/report/autonomous APIs, and a
                            simulation harness (scripts/nsilSimulation.ts) validating payload completeness.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">System Goals &amp; the Problem Space</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            Regional development teams battle fragmented data, slow diligence, misalignment between narrative and evidence, and distrust from opaque
                            reasoning. BWGA Intelligence AI was built to close that Global Understanding Gap.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li><span className="font-semibold">Structuring:</span> Convert messy real-world intent into a computable case dataset.</li>
                            <li><span className="font-semibold">Validation:</span> Surface missing constraints and contradictions early.</li>
                            <li><span className="font-semibold">Multi-perspective reasoning:</span> Persona debate prevents single-thread bias.</li>
                            <li><span className="font-semibold">Scoring + explainability:</span> Quantified outputs with explicit drivers and pressure points.</li>
                            <li><span className="font-semibold">Delivery:</span> Compile investor-grade reports, comparisons, outreach letters.</li>
                            <li><span className="font-semibold">Audit posture:</span> Preserve traceability and a defensible why chain.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Product Definition (What It Is / Is Not)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-bold text-slate-800 mb-2">What the Product Is</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>A strategic intelligence workflow, not a single AI chat prompt</li>
                                    <li>A platform combining structured intake, validation engines, scoring, reasoning services, and report orchestration</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-bold text-slate-800 mb-2">What the Product Is Not</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>Not a replacement for independent professional diligence</li>
                                    <li>Not a promise of outcome; it provides structured intelligence to reduce uncertainty</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">High-Level Architecture</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 mb-3">
                            <li><span className="font-semibold">Frontend-only mode:</span> UI + local logic + local persistence</li>
                            <li><span className="font-semibold">Full-stack mode (recommended):</span> UI + API server for AI calls, report storage, and integrations</li>
                            <li><span className="font-semibold">Client (React):</span> UI workflow, data entry, live previews, local insights, exporting</li>
                            <li><span className="font-semibold">Server (Express):</span> AI endpoints, report CRUD persistence, health checks, autonomous endpoint</li>
                            <li><span className="font-semibold">Intelligence services (TypeScript modules):</span> reasoning stack and orchestrators used by both server and client</li>
                        </ul>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            <span className="font-semibold">Audit note:</span> defensibility rests on separating the data-plane (inputs, storage, exports) from the
                            control-plane (validation rules, scoring engines, orchestration policies, governance).
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Core User Journeys &amp; Workflow</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-bold text-slate-800 mb-2">Journey A: Standard Report Builder Flow</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>User enters CommandCenter for system explanation and acceptance</li>
                                    <li>User defines entity profile and strategic intent</li>
                                    <li>System runs analysis modules across a multi-stage report workflow</li>
                                    <li>Outputs generated: scorecards, narrative sections, partner matching, scenario plans, exports</li>
                                    <li>UI operates as a live workspace where readiness, insights, and outputs update with inputs</li>
                                    <li>Mixes deterministic calculation with AI-assisted narrative generation</li>
                                    <li>Exports are first-class outputs, not screenshots of UI</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 mb-2">Journey B: Agentic / Orchestrated Run</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>Structured parameter object passed to ReportOrchestrator.assembleReportPayload()</li>
                                    <li>Payload completeness validated with missing fields flagged explicitly</li>
                                    <li>Results persisted as a report snapshot for later review and export</li>
                                    <li>Server-side /api/autonomous/solve and the NSIL simulation harness exercise this workflow</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 mb-2">Journey C: Conversational / Copilot Assistance</p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                                    <li>/api/ai/chat provides AI-assisted reasoning output with a system instruction</li>
                                    <li>/api/ai/insights returns a structured JSON insight list</li>
                                    <li>Gemini API usage is gated by GEMINI_API_KEY; server returns 503 when missing</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Data Model &amp; Persistence Strategy</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 mb-3">
                            <li><span className="font-semibold">ReportParameters:</span> full case intake dataset (identity, mandate, constraints, partners, etc.)</li>
                            <li><span className="font-semibold">ReportPayload:</span> computed intelligence output (scores, risks, confidence, sections)</li>
                            <li>TypeScript definitions in types.ts act as contracts between UI, services, and orchestrators</li>
                            <li>Client-side persistence (localStorage) for drafts, snapshots, export/import</li>
                            <li>Server-side file persistence (server/data/reports.json) for CRUD operations</li>
                        </ul>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            File persistence is acceptable for prototypes but must evolve into database-backed, multi-tenant storage with immutable audit trails for institutional scale.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Intelligence Architecture (NSIL, BW Brain, Multi-Agent Reasoning)</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>NSIL intelligence hub unifies InputShieldService, PersonaEngine, CounterfactualEngine, OutcomeTracker, and UnbiasedAnalysisEngine</li>
                            <li>InputShield flags missing critical fields, contradictions, and risk patterns</li>
                            <li>Persona model (Skeptic, Advocate, Regulator, Accountant, Operator) preserves agreements/disagreements</li>
                            <li>NSIL lifecycle: Validate → Debate → Score → Synthesize → Deliver</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Scoring Layer — 21-Formula Suite</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            5 primary engines: SPI™ (TM), RROI™ (TM), SEAM™ (TM), IVAS™ (TM), SCF™ (TM)
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                            16 derivative indices: BARNA, NVI, CRI, FRS, CAP, AGI, VCI, ATI, ESI, ISI, OSI, TCO, PRI, RNI, SRA, IDV
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Each engine requires documented definitions, calibration, and explainability contracts (score, band, drivers, pressure points, assumptions).
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Algorithm Layer — Speed, Consistency, Repeatability</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Memory retrieval / similar-case recall to maintain context continuity</li>
                            <li>Contradiction checks prevent unstable payloads</li>
                            <li>Parallel scoring, persona debate, and counterfactual stress tests</li>
                            <li>Structured synthesis ensures deterministic payload assembly and explicit labeling of computed vs narrative vs human-entered text</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Frontend Technical Architecture</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>React 19 + TypeScript 5 + Vite 6 + TailwindCSS</li>
                            <li>Framer Motion + Lucide icons for animation and iconography</li>
                            <li>State-driven ViewMode routing (no URL router) keeps workspace feel</li>
                            <li>Feature modules for market comparison, compatibility engine, deal marketplace, scenario planning, and document generation</li>
                        </ul>
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">
                            <span className="font-semibold">Risk watch:</span> lack of URL routing means deep-linking and audit trails require additional instrumentation,
                            especially for multi-user environments.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Backend Technical Architecture</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Express server with Helmet, CORS, compression, JSON body limits, and logging</li>
                            <li>Routes: /api/ai, /api/reports, /api/search, /api/autonomous, /api/health</li>
                            <li>Gemini client initialized lazily; server returns 503 if GEMINI_API_KEY absent</li>
                            <li>File-backed storage for reports plus import/export utilities</li>
                            <li><span className="font-semibold">Audit note:</span> server/routes/agentic.ts exists but is not mounted in server/index.ts in the current snapshot</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Report Orchestration &amp; Document Generation</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>ReportOrchestrator assembles payloads and validates completeness</li>
                            <li>Simulation harness (scripts/nsilSimulation.ts) runs repeatable orchestration tests</li>
                            <li>Exports treat scorecards, risk registers, and narratives as first-class outputs</li>
                            <li>Document Factory supports PDF/DOCX/HTML, letters, and outreach packs</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-md font-bold text-slate-800 mb-2">Security, Privacy, and Governance Controls</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Helmet security headers + CORS allowlist with production fallback</li>
                            <li>Secrets kept server-side; UI never sees API keys</li>
                            <li>Recommended upgrades: authentication, RBAC, tenant isolation, immutable audit logs, prompt-injection resistance, evidence provenance</li>
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
