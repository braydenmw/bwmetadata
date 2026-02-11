#!/usr/bin/env python3
"""
Redesign Block 1 (Why I Built This) to be a visual statement piece,
move Architecture button under it, and convert showFormulas to a popup.
"""

import os

FILE = os.path.join(os.path.dirname(__file__), 'components', 'CommandCenter.tsx')

with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original file: {len(lines)} lines")

# ─── STEP 1: Find Block 1 boundaries (line 345 to line 376) ───
block1_start = None
block1_end = None
for i, line in enumerate(lines):
    if '{/* Block 1: The Problem' in line:
        block1_start = i
    if block1_start and i > block1_start and '{/* Block 2:' in line:
        block1_end = i
        break

print(f"Block 1: lines {block1_start+1} to {block1_end}")

# ─── STEP 2: Find Block 6 architecture button lines (519-528) ───
arch_btn_start = None
arch_btn_end = None
for i, line in enumerate(lines):
    if 'Want to see every algorithm' in line:
        arch_btn_start = i
        break

# Find the closing </button> after it
for i in range(arch_btn_start, len(lines)):
    if '</button>' in lines[i] and 'showFormulas' in ''.join(lines[arch_btn_start:i+1]):
        arch_btn_end = i + 1
        break

print(f"Architecture button: lines {arch_btn_start+1} to {arch_btn_end}")

# ─── STEP 3: Find showFormulas inline section (531-671) ───
formulas_start = None
formulas_end = None
for i, line in enumerate(lines):
    if '{showFormulas && (' in line:
        formulas_start = i
        break

# Find matching closing — it's `)}` with correct indentation
brace_depth = 0
for i in range(formulas_start, len(lines)):
    line = lines[i]
    brace_depth += line.count('{') - line.count('}')
    if i > formulas_start and brace_depth <= 0:
        formulas_end = i + 1
        break

print(f"showFormulas inline: lines {formulas_start+1} to {formulas_end}")

# ─── STEP 4: Extract the formulas content (inner div) for the popup ───
# We need the content between `{showFormulas && (` and the closing `)}`
# The inner content starts at formulas_start + 1 and ends at formulas_end - 1
formulas_inner = lines[formulas_start+1:formulas_end-1]
# Strip the outer <div> wrapper — we'll make our own popup container
formulas_content_text = ''.join(formulas_inner)

# ─── STEP 5: Find where to insert the popup (before Legal Document Modals) ───
legal_insert = None
for i, line in enumerate(lines):
    if '{/* Legal Document Modals */}' in line:
        legal_insert = i
        break

print(f"Insert popup before line: {legal_insert+1}")

# ─── BUILD NEW BLOCK 1 ───
new_block1 = '''                    {/* Block 1: The Problem — Statement Piece */}
                    <div className="mb-12">
                        {/* Hero row: Photo + Narrative */}
                        <div className="flex flex-col md:flex-row gap-0 items-stretch mb-0">
                            <div className="md:w-5/12 relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80" 
                                    alt="Global intelligence data" 
                                    className="w-full h-full min-h-[380px] object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/20" />
                            </div>
                            <div className="md:w-7/12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 flex flex-col justify-center">
                                <p className="text-blue-400 uppercase tracking-[0.25em] text-xs font-bold mb-3">THE CORE PROBLEM</p>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                                    Why I built this:<br />
                                    <span className="text-blue-400">the problem with AI today.</span>
                                </h3>
                                <p className="text-base text-slate-300 leading-relaxed mb-4">
                                    Most AI today &mdash; the language models behind ChatGPT, Claude, and others &mdash; is <strong className="text-white">probabilistic</strong>. It guesses based on patterns. It can hallucinate facts, silently bias results, or give a different answer every time you ask the same question. It sounds confident, but it can&rsquo;t show its reasoning.
                                </p>
                                <p className="text-base text-white leading-relaxed font-medium">
                                    When the stakes are real &mdash; investments, policy decisions, people&rsquo;s livelihoods &mdash; <strong>guessing isn&rsquo;t good enough.</strong>
                                </p>
                            </div>
                        </div>

                        {/* Statement bar */}
                        <div className="bg-blue-600 px-8 py-5">
                            <p className="text-center text-white text-lg md:text-xl font-semibold max-w-4xl mx-auto">
                                I built BW NEXUS AI because I believed intelligence should be <strong>provable</strong>. Not generated. Not predicted. <strong>Proven.</strong>
                            </p>
                        </div>

                        {/* Side-by-side comparison */}
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Language-First AI — The Problem */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 border-t-4 border-red-500 p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                        <X size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-red-900">Language-First AI</h4>
                                        <p className="text-sm text-red-600 font-medium">Probabilistic &mdash; Pattern Guessing</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-lg mt-0.5">&times;</span>
                                        <p className="text-sm text-red-800"><strong>Hallucinations</strong> &mdash; Generates plausible-sounding information that is factually wrong</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-lg mt-0.5">&times;</span>
                                        <p className="text-sm text-red-800"><strong>Hidden reasoning</strong> &mdash; Can&rsquo;t explain how it reached a conclusion</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-lg mt-0.5">&times;</span>
                                        <p className="text-sm text-red-800"><strong>Inconsistent outputs</strong> &mdash; Different answers to the same question every time</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-lg mt-0.5">&times;</span>
                                        <p className="text-sm text-red-800"><strong>No accountability</strong> &mdash; No audit trail, no source verification, no proof</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-lg mt-0.5">&times;</span>
                                        <p className="text-sm text-red-800"><strong>Silent bias</strong> &mdash; Trained on biased data with no way to detect or correct it</p>
                                    </div>
                                </div>
                                <div className="mt-6 bg-red-200/60 rounded-sm p-4">
                                    <p className="text-sm text-red-900 italic font-medium">&ldquo;It sounds confident. But confidence without proof is just noise.&rdquo;</p>
                                </div>
                            </div>

                            {/* BW NEXUS AI — The Solution */}
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-t-4 border-blue-400 p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <CheckCircle2 size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">BW NEXUS AI</h4>
                                        <p className="text-sm text-blue-200 font-medium">Deterministic &mdash; Provable Intelligence</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-100"><strong className="text-white">Validates every input</strong> &mdash; SAT solver catches contradictions before analysis begins</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-100"><strong className="text-white">Adversarial debate</strong> &mdash; 5 AI personas challenge every recommendation</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-100"><strong className="text-white">Deterministic scoring</strong> &mdash; 38+ formulas, same inputs = same outputs, every time</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-100"><strong className="text-white">Full audit trail</strong> &mdash; Every claim traceable to source data and methodology</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-100"><strong className="text-white">Ethical enforcement</strong> &mdash; Rawlsian fairness gates reject unethical paths automatically</p>
                                    </div>
                                </div>
                                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-sm p-4 border border-white/20">
                                    <p className="text-sm text-white italic font-medium">&ldquo;Every recommendation traceable. Every output repeatable. Every claim defensible.&rdquo;</p>
                                </div>
                            </div>
                        </div>

                        {/* Architecture button */}
                        <div className="bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-400">Want to see every algorithm, formula, engine, and the full NSIL architecture that makes this possible?</p>
                            <button 
                                onClick={() => setShowFormulas(true)}
                                className="inline-flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                            >
                                <GitBranch size={18} />
                                View Full Architecture &amp; 38+ Formulas
                            </button>
                        </div>
                    </div>

'''

# ─── BUILD FORMULAS POPUP ───
# We'll reuse the inner content but wrap it in a popup overlay
formulas_popup = '''            {/* Full Architecture & Formulas Popup */}
            {showFormulas && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowFormulas(false)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onClick={(e) => e.stopPropagation()}>
                        {/* Popup header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg px-8 py-6 flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 uppercase tracking-[0.2em] text-xs font-bold mb-1">FULL TECHNICAL BREAKDOWN</p>
                                <h3 className="text-xl font-bold text-white">Inside the NSIL &mdash; Every Layer, Formula &amp; Engine</h3>
                            </div>
                            <button onClick={() => setShowFormulas(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                                <X size={24} />
                            </button>
                        </div>
                        {/* Popup body */}
                        <div className="p-6 md:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">

                            <p>The NSIL &mdash; Nexus Strategic Intelligence Layer &mdash; is the orchestration engine I invented to make AI deterministic. It&rsquo;s implemented in <span className="font-mono text-xs bg-slate-100 px-1 rounded">services/NSILIntelligenceHub.ts</span> and runs every analysis through 10 computational layers in sequence, with parallelism inside each layer where dependencies allow. Same inputs, same outputs, every time. Here&rsquo;s every layer, every formula, every engine.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 0 &mdash; The Laws (Knowledge Architecture)</h4>
                            <p>Hard-coded economic truth that the AI cannot alter. 38+ proprietary formulas defined with fixed mathematical relationships and bounded outputs, managed by a DAG Scheduler (994 lines, <span className="font-mono text-xs bg-slate-100 px-1 rounded">DAGScheduler.ts</span>). The scheduler maps every formula into a directed acyclic graph across 5 execution levels &mdash; Level 0 runs PRI, CRI, BARNA, and TCO in parallel; Level 1 feeds into SPI, RROI, NVI, RNI, CAP; Level 2 produces SEAM, IVAS, ESI, FRS, AGI, VCI; Level 3 creates the master Strategic Confidence Framework (SCF); Level 4 runs 8 autonomous intelligence indices. Results are memoised &mdash; no formula executes twice.</p>

                            <p>Three examples of what these formulas do: <strong>SPI</strong> (Strategic Positioning Index) quantifies market dominance by weighting political risk against country risk with growth-adjusted positioning. <strong>RROI</strong> (Risk-Adjusted Return on Investment) runs Monte Carlo propagation across probability-weighted scenarios &mdash; real-world variance, not a single optimistic projection. <strong>SEAM</strong> (Strategic Ethical Alignment Matrix) cross-references strategy against policy frameworks and stakeholder impact.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 1 &mdash; The Shield (Input Validation)</h4>
                            <p>A SAT Contradiction Solver I wrote (391 lines, <span className="font-mono text-xs bg-slate-100 px-1 rounded">SATContradictionSolver.ts</span>) converts inputs into propositional logic &mdash; conjunctive normal form &mdash; and runs a DPLL-based satisfiability check. Catches contradictions like claiming low risk while expecting 40%+ ROI, targeting global expansion on a small budget, or combining conservative strategy with aggressive growth targets. Each contradiction is classified by severity.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 2 &mdash; The Boardroom (Multi-Agent Debate)</h4>
                            <p>Five adversarial personas &mdash; Skeptic (1.2x weight), Advocate, Regulator, Accountant, and Operator &mdash; conduct a structured Bayesian debate (557 lines, <span className="font-mono text-xs bg-slate-100 px-1 rounded">BayesianDebateEngine.ts</span>). Each votes across four outcomes: proceed, pause, restructure, or reject. Beliefs update via Bayesian inference. Early stopping at 0.75 posterior probability or 0.02 belief delta. Disagreements resolved through Nash bargaining. Every persona&rsquo;s reasoning preserved in the audit trail.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 3 &mdash; The Engine (Formula Scoring)</h4>
                            <p>The DAG Scheduler executes the full 38+ formula suite with typed inputs, bounded outputs, component breakdowns, and execution timing. Results flow into a <span className="font-mono text-xs bg-slate-100 px-1 rounded">CompositeScoreService</span> that normalises raw data against region-specific baselines. Deterministic jitter from hash-based seeding ensures reproducibility.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 4 &mdash; Stress Testing (Scenario Simulation)</h4>
                            <p>The Scenario Simulation Engine (504 lines, <span className="font-mono text-xs bg-slate-100 px-1 rounded">ScenarioSimulationEngine.ts</span>) builds causal graphs with feedback loops, runs Monte Carlo propagation through multi-step chains with non-linear dynamics, and simulates forward outcomes using Markov chain state transitions across economic, political, social, environmental, technological, and regulatory categories.</p>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 5 &mdash; The Brain (Human Cognition Engine)</h4>
                            <p>The Human Cognition Engine I wrote (1,307 lines, <span className="font-mono text-xs bg-slate-100 px-1 rounded">HumanCognitionEngine.ts</span>) implements 7 neuroscience models as mathematical implementations:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li><strong>Wilson-Cowan Neural Field Dynamics</strong> &mdash; Differential equations on excitatory/inhibitory neuron populations on a 50&times;50 spatial grid. Parameters: w_ee=1.5, w_ei=-1.0, w_ie=1.0, w_ii=-0.5, dt=0.01.</li>
                                <li><strong>Predictive Coding (Rao &amp; Ballard)</strong> &mdash; 3-level hierarchical belief updating with prediction error minimisation. Learning rate 0.1.</li>
                                <li><strong>Free Energy Principle (Friston)</strong> &mdash; Variational inference across 8 candidate policies, discount factor &gamma;=0.95.</li>
                                <li><strong>Attention Models (Itti &amp; Koch)</strong> &mdash; Salience maps with intensity/colour/orientation weights. Winner-take-all with inhibition of return (0.7).</li>
                                <li><strong>Emotional Processing</strong> &mdash; Neurovisceral integration theory, emotional inertia (0.8), autonomic coupling (0.6).</li>
                                <li><strong>Global Workspace Theory</strong> &mdash; Coalition formation with ignition threshold 0.6. Information broadcasting across cognitive subsystems.</li>
                                <li><strong>Baddeley&rsquo;s Working Memory</strong> &mdash; Phonological decay 0.05, visual decay 0.03, rehearsal benefit 0.2.</li>
                            </ol>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layer 6 &mdash; Autonomous Intelligence (8 Engines)</h4>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>Creative Synthesis</strong> (608 lines) &mdash; Koestler&rsquo;s bisociation theory + Fauconnier &amp; Turner conceptual blending.</li>
                                <li><strong>Cross-Domain Transfer</strong> &mdash; Maps biology, physics, engineering onto economics via Gentner&rsquo;s structure-mapping theory.</li>
                                <li><strong>Autonomous Goal</strong> &mdash; Detects emergent strategic goals from top-level index scores.</li>
                                <li><strong>Ethical Reasoning</strong> (534 lines) &mdash; Multi-stakeholder utility, Rawlsian fairness, Stern Review discount rates (&le;1.4%). Every recommendation must pass this gate.</li>
                                <li><strong>Self-Evolving Algorithm</strong> (403 lines) &mdash; Online gradient descent w_t+1 = w_t - &eta;&nabla;L, Thompson sampling, mutation-selection with full rollback.</li>
                                <li><strong>Adaptive Learning</strong> &mdash; Bayesian belief updates from outcome feedback.</li>
                                <li><strong>Emotional Intelligence</strong> &mdash; Prospect Theory + Russell&rsquo;s Circumplex Model for stakeholder dynamics.</li>
                                <li><strong>Scenario Simulation</strong> (504 lines) &mdash; 5,000 Monte Carlo runs with causal loop modelling and Markov state transitions.</li>
                            </ul>

                            <h4 className="text-base font-bold text-slate-900 pt-2">Layers 7&ndash;9 &mdash; Proactive, Output &amp; Reflexive</h4>
                            <p><strong>Layer 7 (Proactive):</strong> Seven engines for backtesting, drift detection, continuous learning, and proactive signal mining.</p>
                            <p><strong>Layer 8 (Output Synthesis):</strong> Provenance tracking, full audit trails, 156 letter templates, 232 document types &mdash; all populated with exact data and confidence scores.</p>
                            <p><strong>Layer 9 (Reflexive Intelligence):</strong> Seven engines that analyse the user:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>User Signal Decoder</strong> (591 lines) &mdash; Shannon&rsquo;s information-theoretic redundancy. Detects repetition, avoidance, and emotional emphasis.</li>
                                <li><strong>Internal Echo Detector</strong> &mdash; Prevents confirmation bias inside the machine itself.</li>
                                <li><strong>Investment Lifecycle Mapper</strong> &mdash; Maps project lifecycle stage, adjusts analysis accordingly.</li>
                                <li><strong>Regional Mirroring</strong> (612 lines) &mdash; Finds structural twin regions via structure-mapping across 6 dimensions.</li>
                                <li><strong>Regional Identity Decoder</strong> &mdash; Detects when authentic identity has been replaced with generic marketing language.</li>
                                <li><strong>Latent Advantage Miner</strong> (483 lines) &mdash; Surfaces casually mentioned assets with real strategic significance.</li>
                                <li><strong>Universal Translation Layer</strong> &mdash; Translates findings for 5 audiences: investors, government, community, partners, executives.</li>
                            </ul>

                            <h4 className="text-base font-bold text-slate-900 pt-4">The 38+ Proprietary Formulas</h4>
                            <div className="grid md:grid-cols-3 gap-3 mt-2">
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Core Indices</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; SPI&trade; &mdash; Success Probability Index</li>
                                        <li>&bull; RROI&trade; &mdash; Regional Return on Investment</li>
                                        <li>&bull; SEAM&trade; &mdash; Stakeholder Alignment Matrix</li>
                                        <li>&bull; PVI&trade; &mdash; Partnership Viability Index</li>
                                        <li>&bull; RRI&trade; &mdash; Regional Resilience Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Risk Formulas</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
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
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Financial Metrics</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; IRR &mdash; Internal Rate of Return</li>
                                        <li>&bull; NPV &mdash; Net Present Value</li>
                                        <li>&bull; WACC &mdash; Weighted Cost of Capital</li>
                                        <li>&bull; DSCR &mdash; Debt Service Coverage</li>
                                        <li>&bull; FMS &mdash; Funding Match Score</li>
                                        <li>&bull; ROE &mdash; Return on Equity</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Operational Scores</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; ORS &mdash; Organizational Readiness</li>
                                        <li>&bull; TCS &mdash; Team Capability Score</li>
                                        <li>&bull; EEI &mdash; Execution Efficiency Index</li>
                                        <li>&bull; SEQ &mdash; Sequencing Integrity Score</li>
                                        <li>&bull; CGI &mdash; Capability Gap Index</li>
                                        <li>&bull; LCI &mdash; Leadership Confidence Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Market Formulas</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        <li>&bull; MPI &mdash; Market Penetration Index</li>
                                        <li>&bull; CAI &mdash; Competitive Advantage Index</li>
                                        <li>&bull; TAM &mdash; Total Addressable Market</li>
                                        <li>&bull; SAM &mdash; Serviceable Available Market</li>
                                        <li>&bull; GRI &mdash; Growth Rate Index</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Governance Metrics</h5>
                                    <ul className="space-y-0.5 text-xs text-slate-600">
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
                                <p className="text-xs text-slate-700 italic">
                                    Every formula has defined methodology, transparent inputs, and a full audit trail. The 22 autonomous, proactive, and reflexive engines are backed by published mathematical theory, implemented in real TypeScript with no placeholders. This is the system I built. This is what makes it a world first.
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

'''

# ─── APPLY CHANGES (work backwards to preserve line numbers) ───

# 1. Insert formulas popup before Legal Document Modals
# Re-find the line since we haven't modified yet
for i, line in enumerate(lines):
    if '{/* Legal Document Modals */}' in line:
        legal_insert = i
        break

lines.insert(legal_insert, formulas_popup)

print(f"Inserted formulas popup at line {legal_insert+1}")

# 2. Remove old showFormulas inline section (lines formulas_start to formulas_end)
del lines[formulas_start:formulas_end]
print(f"Removed inline showFormulas: {formulas_end - formulas_start} lines deleted")

# 3. Remove architecture button from Block 6 (lines arch_btn_start to arch_btn_end)
del lines[arch_btn_start:arch_btn_end]
print(f"Removed architecture button from Block 6: {arch_btn_end - arch_btn_start} lines deleted")

# 4. Replace Block 1 (lines block1_start to block1_end)
new_block1_lines = new_block1.split('\n')
new_block1_lines = [l + '\n' for l in new_block1_lines]

del lines[block1_start:block1_end]
for i, line in enumerate(new_block1_lines):
    lines.insert(block1_start + i, line)

print(f"Replaced Block 1: removed {block1_end - block1_start} lines, inserted {len(new_block1_lines)} lines")

# ─── WRITE FILE ───
with open(FILE, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"File is now {len(lines)} lines")
print("Done!")
