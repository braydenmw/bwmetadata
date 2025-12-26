                        {/* What is this system & What makes it different */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* What is this system? */}
                            <div className="bg-bw-navy/90 border border-bw-gold/30 rounded-lg p-6 shadow-md">
                                <h3 className="text-bw-gold text-lg font-bold mb-3">1. What is this system?</h3>
                                <p className="text-white text-sm mb-4">BW Nexus AI is a Strategic Intelligence & Execution Platform—a digital consultant plus a high-end document automation factory. It helps anyone build a rigorous business model, analyze it for flaws, and instantly generate the professional documents needed to execute it.</p>
                                <div className="space-y-3">
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">Live Document Builder</p>
                                        <p className="text-gray-300 text-xs">Input your business data (Foundation, Market, Operations, Financials) into a dynamic interface.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">Adaptive Guidance</p>
                                        <p className="text-gray-300 text-xs">The system asks "Who are you?" and adapts its interface for beginners, growing companies, or executives.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">Document Factory</p>
                                        <p className="text-gray-300 text-xs">Auto-generates 12+ professional documents (Pitch Decks, Proposals, Outreach Letters, Confidential Memos) ready to send.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">NSIL (Nexus Strategic Intelligence Layer)</p>
                                        <p className="text-gray-300 text-xs">Runs your inputs through mathematical models (Monte Carlo simulations, Risk Indices) to score business viability.</p>
                                    </div>
                                </div>


                            </div>
                            {/* What makes it different? */}
                            <div className="bg-bw-navy/90 border border-bw-gold/30 rounded-lg p-6 shadow-md">
                                <h3 className="text-bw-gold text-lg font-bold mb-3">2. What makes it different?</h3>
                                <p className="text-white text-sm mb-4">BW Nexus AI combines static forms, chatbots, and enterprise analytics into a true reasoning engine, with five unique differentiators:</p>
                                <div className="space-y-3">
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">A. It Challenges You (Adversarial Reasoning)</p>
                                        <p className="text-gray-300 text-xs">Skeptic Persona and Counterfactual Lab actively look for reasons your plan will fail. Input Shield checks claims against real-world data and corrects errors.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">B. It Adapts to Your Level</p>
                                        <p className="text-gray-300 text-xs">Beginners get tutorials and examples; executives get speed and critical risk fields. The interface changes to match your experience.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">C. Quantitative + Qualitative (Math + Language)</p>
                                        <p className="text-gray-300 text-xs">Uses 21 mathematical formulas (like Strategic Partnership Index) and AI to write a narrative explaining your score.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">D. "The Entire Meadow" Philosophy</p>
                                        <p className="text-gray-300 text-xs">Models the ecosystem, not just transactions. SEAM calculates partner alignment for long-term cultural and operational fit.</p>
                                    </div>
                                    <div className="bg-bw-navy/40 border border-bw-gold/20 rounded p-3">
                                        <p className="font-bold text-bw-gold">E. 100% Capability (No "Hardcoded" Limits)</p>
                                        <p className="text-gray-300 text-xs">Supports 50+ business types, validates 195 countries, and models any legal structure—not just simple templates.</p>
                                    </div>
                                </div>
                                <p className="mt-4 font-bold text-white">Summary</p>
                                <p className="text-gray-300 text-xs">BW Nexus AI is not just a form-filler. It is an autonomous reasoning partner that helps you build a business strategy, mathematically proves if it will work, and then writes the paperwork to make it happen.</p>
                            </div>
                        </div>



import React, { useState } from 'react';
import { ReportParameters } from '../types';
import { 
    Play, CheckCircle2, ShieldAlert, 
    Globe, Lock, ArrowRight, FileText, Cpu, Target, Layers
} from 'lucide-react';

interface CommandCenterProps {
    savedReports: ReportParameters[];
    onCreateNew: () => void;
    onLoadReport: (report: ReportParameters) => void;
    onOpenInstant: () => void;
    onOpenSimulator: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({
    savedReports,
    onCreateNew,
    onLoadReport,
    onOpenInstant,
    onOpenSimulator
}) => {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="w-full min-h-screen bg-stone-100 p-4 sm:p-6 md:p-8 lg:p-12 pb-8 font-sans overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Top Section: Custom Welcome - Full Width */}
                <div className="bg-white shadow-2xl border border-stone-200 rounded-lg overflow-hidden">
                    <div className="bg-bw-navy p-8 sm:p-10 lg:p-12 text-white">
                        <div className="flex items-center gap-2 text-bw-gold font-bold tracking-widest text-xs uppercase mb-4">
                            <Layers size={14} /> BW (Brayden Walls) Global Advisory — Next-Gen Regional Intelligence
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight text-white">
                            Welcome to a New Era of Regional Intelligence
                        </h1>
                        <p className="text-bw-gold text-base font-medium mb-6 italic">
                            Real answers. Real speed. Real impact. No more waiting, no more guesswork—just the truth you need, delivered instantly and tailored to you.
                        </p>
                        <div className="text-gray-200 text-base leading-relaxed mb-8 border-l-2 border-bw-gold pl-6 max-w-5xl space-y-4">
                            <p>
                                <strong className="text-white">Not just another consultancy—your personal intelligence engine.</strong> At BW Global Advisory, we combine deep regional expertise with advanced AI to give you clarity, confidence, and control. Whether you’re an investor, a business leader, or a community builder, you get actionable insights—live, transparent, and always in your hands.
                            </p>
                            <p>
                                <strong className="text-white">Every city, every opportunity, every risk—revealed.</strong> We cut through noise and bias to show you what’s really happening on the ground. From local politics to hidden growth drivers, you see the full picture—no filters, no delays.
                            </p>
                            <p>
                                <strong className="text-white">You set the agenda. We deliver the intelligence.</strong> Define your goals, your regions, your questions. Our system adapts to you, searching globally and locally for the best opportunities—sometimes in places you never thought to look.
                            </p>
                            <p>
                                <strong className="text-white">For individuals and institutions alike.</strong> Whether you’re a solo entrepreneur or a global enterprise, you get the same focus, the same rigor, and the same commitment to your success.
                            </p>
                            <p>
                                <strong className="text-white">Built for action, not just analysis.</strong> Get strategic reports, partner matches, risk registers, and more—ready to use, ready to share, ready to drive results.
                            </p>
                            <p>
                                <strong className="text-white">Always learning, always improving.</strong> Our AI never sleeps. It monitors, adapts, and gets smarter with every project—so your intelligence stays ahead of the curve.
                            </p>
                        </div>
                        
                        {/* Key Differentiators */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10">
                            <div className="text-center">
                                <p className="text-bw-gold text-2xl font-bold">Personalized</p>
                                <p className="text-gray-300 text-xs">Tailored to You</p>
                            </div>
                            <div className="text-center">
                                <p className="text-bw-gold text-2xl font-bold">Transparent</p>
                                <p className="text-gray-300 text-xs">No Black Boxes</p>
                            </div>
                            <div className="text-center">
                                <p className="text-bw-gold text-2xl font-bold">200+ Years</p>
                                <p className="text-gray-300 text-xs">Proven Patterns</p>
                            </div>
                            <div className="text-center">
                                <p className="text-bw-gold text-2xl font-bold">24/7</p>
                                <p className="text-gray-300 text-xs">Continuous Learning</p>
                            </div>
                        </div>

                        {/* What is this system? */}
                        <div className="mt-12 bg-bw-navy/90 border border-bw-gold/40 rounded-lg p-8">
                            <h3 className="text-bw-gold text-xl font-bold mb-4">1. What is this system?</h3>
                            <div className="text-gray-100 text-sm leading-relaxed space-y-4">
                                <p>
                                    <strong className="text-white">BW Nexus AI</strong> is a Strategic Intelligence & Execution Platform — a digital consultant plus a high-end document automation factory. Its purpose is to help anyone—from first-time founders to seasoned investors—build a rigorous business model, stress-test it, and immediately generate the professional documents needed to execute it.
                                </p>

                                <p className="font-bold text-bw-gold">Core Capabilities:</p>
                                <ul className="list-disc list-inside text-gray-300 text-xs space-y-2">
                                    <li><strong>Live Document Builder:</strong> Input Foundation, Market, Operations, and Financials into a dynamic interface that drives downstream documents.</li>
                                    <li><strong>Adaptive Guidance:</strong> The UI adapts to your skill level (Beginner, Growing Company, Executive) and adjusts guidance, examples, and controls accordingly.</li>
                                    <li><strong>Document Factory:</strong> Auto-generate 12+ professional deliverables (Pitch Decks, Proposals, Outreach Letters, Confidential Memos) that are production-ready.</li>
                                    <li><strong>NSIL (Nexus Strategic Intelligence Layer):</strong> The 'brain' that runs inputs through mathematical models (Monte Carlo, Risk Indices), producing scores and actionable diagnostics.</li>
                                </ul>
                            </div>

                            <h3 className="text-bw-gold text-xl font-bold mt-6 mb-3">2. What makes it different?</h3>
                            <div className="text-gray-100 text-sm leading-relaxed space-y-4">
                                <p className="mb-2">Most tools fall into static forms, chatbots, or enterprise analytics. BW Nexus AI is a reasoning engine that blends all three and adds several critical innovations:</p>

                                <div className="space-y-3">
                                    <div>
                                        <p className="font-bold text-bw-gold">A. It Challenges You — Adversarial Reasoning</p>
                                        <p className="text-gray-300 text-xs">A Skeptic persona and Counterfactual Lab actively try to break your plan, exposing fragile assumptions and surfacing hidden risks. An Input Shield cross-checks claims against authoritative data (e.g., World Bank) and corrects incorrect inputs.</p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-bw-gold">B. It Adapts to Your Level</p>
                                        <p className="text-gray-300 text-xs">Beginners receive tutorials and examples; executives receive compact analytics and rapid controls—one system, tailored pathways.</p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-bw-gold">C. Quantitative + Qualitative</p>
                                        <p className="text-gray-300 text-xs">The platform runs 21 mathematical formulas (e.g., Strategic Partnership Index) and pairs them with AI-written narratives that explain the results in plain language.</p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-bw-gold">D. 'The Entire Meadow' Philosophy</p>
                                        <p className="text-gray-300 text-xs">We model ecosystems, not just transactions. SEAM (Symbiotic Ecosystem Assessment) evaluates partner cultural, operational, and strategic fit—not just short-term gains.</p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-bw-gold">E. 100% Capability — No Hardcoded Limits</p>
                                        <p className="text-gray-300 text-xs">The system supports 50+ business/legal models, validates 195 countries with regional logic, and lets you model real-world legal structures—not simplified templates.</p>
                                    </div>
                                </div>

                                <p className="mt-4 font-bold text-white">Summary</p>
                                <p className="text-gray-300 text-xs">BW Nexus AI is not a form-filler. It is an autonomous reasoning partner that helps you design strategy, mathematically tests viability, and auto-produces the documents you need to act—faster, more rigorously, and more transparently than standard tools.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NSIL — The Brain (expanded) */}
                <div className="mt-8 bg-bw-navy/95 border border-bw-gold/30 rounded-lg p-8 shadow-lg">
                    <h3 className="text-bw-gold text-xl font-bold mb-3">NSIL — The Brain (How the system thinks)</h3>
                    <div className="text-gray-100 text-sm leading-relaxed space-y-4">
                        <p><strong className="text-white">At the center of the platform is NSIL: the Nexus Strategic Intelligence Layer.</strong> NSIL treats your business plan as a living simulation. It doesn't just store your inputs—it reads them, simulates outcomes, finds hidden risks, and proposes fixes.</p>
                        <p><strong className="text-bw-gold">Five-layer Autonomous Reasoning Stack</strong> — NSIL mimics a team of experts through thin reasoning shells that wrap around the core mathematical engines. This preserves explainability while enabling adversarial and counterfactual reasoning.</p>
                        <p><strong className="text-bw-gold">Multi-Perspective Reasoning Engine</strong> — when you submit a strategy, NSIL spawns five personas that each evaluate the plan in parallel and produce evidence-backed arguments:</p>
                        <ul className="list-disc list-inside text-gray-300 text-xs space-y-2">
                            <li><strong>Skeptic</strong> — finds deal-killers, over-optimism, and hidden downside.</li>
                            <li><strong>Advocate</strong> — finds upside, synergies and optional levers to increase value.</li>
                            <li><strong>Regulator</strong> — checks legal, sanctions, and ethical constraints.</li>
                            <li><strong>Accountant</strong> — validates cashflow, margins, and economic durability.</li>
                            <li><strong>Operator</strong> — tests execution feasibility: team, supply chains, and infrastructure.</li>
                        </ul>
                        <p><strong className="text-bw-gold">The Debate — how outputs are born</strong> — personas vote and attach evidence; NSIL synthesizes the debate. Findings are accepted only when corroborated or when a transparent disagreement is recorded, producing a clear recommendation (e.g., 'high-risk', 'requires operational fix', or 'opportunity — monitor').</p>
                        <p><strong className="text-bw-gold">How it learns</strong> — NSIL continuously improves through:</p>
                        <ul className="list-decimal list-inside text-gray-300 text-xs space-y-2">
                            <li><strong>Motivation Detection</strong> — learns your decision profile and adjusts how insights are framed.</li>
                            <li><strong>Counterfactual Lab</strong> — silently simulates opposite choices to surface robust alternatives and trade-offs.</li>
                            <li><strong>Outcome Tracking</strong> — compares predictions to real outcomes and recalibrates internal weights.</li>
                        </ul>
                        <p className="text-white"><strong>What this delivers:</strong> explainable, math-backed recommendations with provenance, debate logs, and counterfactual alternatives — turning passive data into an active advisory partner.</p>
                    </div>
                </div>

                {/* 7-Stage Process: How It Works */}
                <div className="mt-12">
                    <div className="mb-6">
                        <h3 className="text-bw-gold text-lg font-extrabold uppercase tracking-widest mb-3">How It Works: 7 Steps to Clarity</h3>
                        <div className="bg-bw-navy border-l-4 border-bw-gold rounded-md p-4 mt-2 shadow-lg">
                            <p className="text-white text-base font-semibold leading-relaxed">Each step below is powered by <strong className="text-bw-gold">NSIL</strong>: five AI personas analyze, debate, and feed verified outputs into this workflow to produce recommendations and deliverables.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Step 01 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">01</div>
                                <h4 className="font-extrabold text-white text-base">Define Your Mission</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                Tell us who you are, what you want, and where you want to go. We adapt to your needs—no matter your size or sector.
                            </p>
                        </div>
                        {/* Step 02 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">02</div>
                                <h4 className="font-extrabold text-white text-base">Set Your Parameters</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                Investment, risk, timeline, sector, geography—you control every variable. We work within your boundaries, then show you what’s possible beyond them.
                            </p>
                        </div>
                        {/* Step 03 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">03</div>
                                <h4 className="font-extrabold text-white text-base">Live AI Analysis</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                See your intelligence build in real time. No black box, no waiting—just transparent, cross-validated insights as they happen.
                            </p>
                        </div>
                        {/* Step 04 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">04</div>
                                <h4 className="font-extrabold text-white text-base">Global & Local Discovery</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                We don’t just answer your questions—we find new opportunities, risks, and partners you might never have considered.
                            </p>
                        </div>
                        {/* Step 05 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">05</div>
                                <h4 className="font-extrabold text-white text-base">Scoring & Diagnostics</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                SPI™, RROI™, SEAM™, IVAS™ and SCF™ quantify viability, risk, and partner fit; all scores include provenance and contributing arguments.
                            </p>
                        </div>
                        {/* Step 06 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">06</div>
                                <h4 className="font-extrabold text-white text-base">Live Report Building</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                Your strategic dossier builds as you watch. You decide what goes in, what gets expanded, and what matters most.
                            </p>
                        </div>
                        {/* Step 07 */}
                        <div className="bg-bw-navy shadow-lg border border-bw-gold/20 rounded-lg p-6 hover:bg-bw-navy/95 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-bw-gold flex items-center justify-center text-white font-extrabold">07</div>
                                <h4 className="font-extrabold text-white text-base">Actionable Deliverables</h4>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                                Executive summaries, full dossiers, financial models, partner lists, risk registers, and more—ready to use, share, and act on with traceable provenance.
                            </p>
                        </div>
                        {/* Bonus */}
                        <div className="bg-bw-gold border border-bw-gold/30 rounded-lg p-6 shadow-md">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-bw-navy flex items-center justify-center text-bw-gold font-bold">+</div>
                                <h4 className="font-bold text-bw-navy text-base">Continuous Intelligence</h4>
                            </div>
                            <p className="text-sm text-bw-navy leading-relaxed">
                                Our AI monitors and learns 24/7. You get alerts, updates, and smarter insights—so your strategy always stays ahead.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Terms, Compliance & Business Disclaimer - Full Width */}
                <div className="bg-white shadow-xl border border-stone-200 rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-8 bg-stone-50">
                        <h3 className="text-bw-navy font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-bw-gold" /> Terms of Engagement, Compliance & Business Disclaimer
                        </h3>

                        <div className="space-y-4 text-xs text-stone-600 bg-white p-5 rounded-sm border border-stone-200 max-h-64 overflow-y-auto shadow-inner">
                            
                            {/* Business Disclaimer */}
                            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                                <p className="text-amber-900 font-bold text-xs uppercase tracking-wide mb-2">Important Business Disclaimer</p>
                                <p className="text-amber-800 text-xs leading-relaxed">
                                    Strategic Intelligence Briefs are prepared by BW Global Advisory (ABN 55 978 113 300) using our proprietary AI-Human analytical capabilities. Analysis is based on publicly available data, BWGA's AI Economic Strategy Engine (Nexus v6.0), and regional insights gathered by our advisory team. While every effort is made to ensure accuracy at the time of generation, all briefs are illustrative, intended for strategic discussion, and <strong>do not constitute financial, legal, or investment advice</strong>. Users are advised to conduct comprehensive independent due diligence before making any investment or partnership decisions.
                                </p>
                            </div>

                            {/* Service Nature Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                                <p className="text-blue-900 font-bold text-xs uppercase tracking-wide mb-2">Service Nature & Engagement</p>
                                <p className="text-blue-800 text-xs leading-relaxed">
                                    BW Global Advisory specializes in providing tailored, in-depth AI-Human Intelligence Reports on a commissioned basis. The analysis and insights presented are derived from publicly available information combined with the application of BWGA's proprietary AI Economic Strategy Engine. While prepared with diligence, all outputs are intended for strategic evaluation purposes only. They do not constitute formal advice, a complete market study, or a guarantee of future outcomes. We welcome discussions regarding how our services may be specifically applied to meet your strategic objectives.
                                </p>
                            </div>

                            {/* Terms of Engagement */}
                            <p className="text-stone-500 text-[10px] uppercase tracking-wider font-bold border-b border-stone-200 pb-1 mb-2">Terms of Engagement</p>
                            
                            <p><strong className="text-stone-900">1. Acceptance & Commercial License:</strong> By accessing the BW Nexus AI platform (v6.0), you acknowledge and accept these Terms of Engagement in full. Upon completion of payment, Strategic Intelligence Reports and associated deliverables become the intellectual property of the commissioning party. BW Global Advisory (ABN 55 978 113 300) retains rights to anonymized, aggregated data solely for system improvement and research purposes.</p>
                            
                            <p><strong className="text-stone-900">2. Platform Architecture:</strong> This platform utilizes a Multi-Agent AI architecture with multiple independent AI systems operating in parallel. All outputs undergo cross-validation to eliminate single-source bias. No AI-generated insight is presented without verification from at least one independent analytical pathway.</p>
                            
                            <p><strong className="text-stone-900">3. Regional Development Focus:</strong> The Nexus OS exists exclusively to facilitate investment, partnership, and development in regional cities worldwide. It is the first and only AI system 100% dedicated to bridging global capital with the communities that sustain national economies—the places that grow food, mine resources, manufacture goods, and support the populations that keep larger cities functioning.</p>
                            
                            <p><strong className="text-stone-900">4. Decision Support Tool — Not Financial Advice:</strong> The Nexus OS provides probabilistic insights, data-driven analysis, and strategic recommendations. It is expressly NOT a final decision authority and does NOT constitute financial, legal, tax, or investment advice. All outputs are advisory in nature. Users must exercise independent judgment, verify all critical findings, and seek qualified professional advice before making binding commitments.</p>
                            
                            <p><strong className="text-stone-900">5. Due Diligence Requirement:</strong> Users acknowledge their responsibility to conduct comprehensive independent due diligence before acting on any analysis, recommendation, or insight provided by this platform. BW Global Advisory provides strategic intelligence to inform decisions—not to replace the professional judgment of qualified advisors.</p>
                            
                            <p><strong className="text-stone-900">6. Data Privacy & Security:</strong> Full compliance with GDPR (EU), CCPA (California), Privacy Act 1988 (Australia), and SOC 2 Type II standards. Your data is cryptographically isolated, never commingled with other clients' data, never used to train public AI models, and never shared with third parties without explicit written consent. All data protected by 256-bit AES encryption at rest and TLS 1.3 encryption in transit.</p>
                            
                            <p><strong className="text-stone-900">7. Historical Data & Analytical Accuracy:</strong> Analysis is informed by 200+ years of economic development patterns (1820–2025) combined with real-time data feeds from global institutions. While methodology is rigorous, investment and partnership in regional markets involves inherent uncertainty. Historical patterns inform probability assessments but do not guarantee future results. Users must independently verify all material facts.</p>
                            
                            <p><strong className="text-stone-900">8. Proprietary Intellectual Property:</strong> SPI™ (Success Probability Index), RROI™ (Regional Return on Investment), SEAM™ (Stakeholder & Entity Alignment Matrix), IVAS™ (Investment Validation & Assurance System), and SCF™ (Strategic Confidence Framework) are proprietary calculation engines owned exclusively by BW Global Advisory. All methodologies, algorithms, and analytical frameworks are confidential intellectual property protected under Australian and international law.</p>
                            
                            <p><strong className="text-stone-900">9. Community Investment Program:</strong> 10% of all report fees are reinvested into community-identified development initiatives within analyzed regions. This includes education programs, local health initiatives, skills training, and small-scale livelihood support. Annual impact reports documenting all community investments are published and available upon request.</p>
                            
                            <p><strong className="text-stone-900">10. Ethical AI Guardrails:</strong> All AI agents operate within strict ethical constraints. The system will not: generate analysis promoting exploitation of vulnerable communities; facilitate circumvention of legitimate regulations; produce recommendations that would predictably cause significant harm to local populations; or discriminate based on protected characteristics. Environmental impact is factored into all regional assessments.</p>
                            
                            <p><strong className="text-stone-900">11. Report Validity & Standard Deliverables:</strong> Strategic Intelligence Reports are considered current for 90 days from date of generation. Standard package includes: Executive Summary, Full Strategic Dossier, Financial Model (Excel), Validated Partner Shortlist with profiles, Comprehensive Risk Register, Multi-Scenario Analysis, and Implementation Roadmap. Standard turnaround is 48 hours; expedited delivery available upon request. Updates may be commissioned at reduced rates.</p>
                            
                            <p><strong className="text-stone-900">12. Limitation of Liability:</strong> To the maximum extent permitted by applicable law, BW Global Advisory, its directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from use of the platform or reliance on its outputs. In all circumstances, total aggregate liability shall not exceed fees actually paid for the specific report or service in question.</p>
                            
                            <p><strong className="text-stone-900">13. Indemnification:</strong> Users agree to indemnify and hold harmless BW Global Advisory from any claims, damages, losses, or expenses arising from: (a) misuse of the platform; (b) reliance on outputs without independent verification; (c) failure to obtain appropriate professional advice; or (d) violation of these Terms of Engagement.</p>
                            
                            <p><strong className="text-stone-900">14. Governing Law & Dispute Resolution:</strong> These Terms of Engagement are governed by the laws of Australia. Any disputes shall be resolved through binding arbitration in Sydney, Australia, under the rules of the International Chamber of Commerce (ICC), unless otherwise agreed in writing by both parties.</p>
                            
                            <p><strong className="text-stone-900">15. Modifications & Severability:</strong> BW Global Advisory reserves the right to modify these terms with 30 days advance notice for material changes. Continued use after notification constitutes acceptance. If any provision is found unenforceable, remaining provisions continue in full force and effect.</p>
                            
                            <p className="text-stone-400 text-[10px] italic mt-4 pt-2 border-t border-stone-100">
                                Terms Version 6.0 | Effective December 2025 | BW Global Advisory (ABN 55 978 113 300) | Sydney, Australia
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-stone-200">
                            <label className="flex items-start gap-3 cursor-pointer select-none group mb-6">
                                <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${accepted ? 'bg-bw-navy border-bw-navy' : 'bg-white border-stone-300 group-hover:border-bw-navy'}`}>
                                    {accepted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                                <span className="text-sm text-stone-700">I have read, understood, and accept the Terms of Engagement, Business Disclaimer, and Compliance Requirements. I acknowledge this is a decision-support tool and does not constitute financial, legal, or investment advice. All final decisions remain my responsibility.</span>
                            </label>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={onCreateNew}
                                    disabled={!accepted}
                                    className="flex-1 bg-bw-navy text-white py-4 px-8 rounded-sm font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-bw-gold hover:text-bw-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg group"
                                >
                                    {!accepted ? <Lock size={18} /> : <Play size={18} />} 
                                    <span>Begin Intelligence Report</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-4">
                    <p className="text-xs text-stone-500">
                        © 2025 BW Global Advisory (ABN 55 978 113 300). All Rights Reserved.
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                        Nexus Intelligence OS v6.0 | Sydney, Australia | Bridging Global Capital with Regional Communities
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
