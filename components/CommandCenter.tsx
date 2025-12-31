import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  X,
  Minus,
  Check,
  Users,
  Layers,
  Scale,
  Target,
  Database,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import FormulaDeepDiveModal from './FormulaDeepDiveModal';

interface CommandCenterProps {
  onOpenReportGenerator: () => void;
}

const oldModelFailures = [
  {
    title: 'Consulting',
    description: 'Consulting firms do not produce intelligence systems. They produce human opinion encoded into documents.',
    cant: [
      'recompute when assumptions change',
      'expose hidden contradictions systematically',
      'quantify confidence in a defensible way',
      'scale without exploding cost',
    ],
    result: 'You pay for hours, not outcomes, and the intelligence is outdated the moment it\'s delivered.',
  },
  {
    title: 'Dashboards & Analytics',
    description: 'Dashboards require clean data and predefined questions.',
    cant: [
      'reason about intent',
      'capture political or human constraints',
      'challenge goals themselves',
      'propose executable paths',
    ],
    result: 'You can see what happened, but you have no system to decide what to do next.',
  },
  {
    title: 'AI Chatbots & LLM Tools',
    description: 'LLMs generate language. They do not own decisions.',
    cant: [
      'respond to prompts instead of progressing work',
      'do not enforce completeness',
      'cannot defend outputs under scrutiny',
      'cannot explain why confidence exists',
    ],
    result: 'You get a plausible-sounding answer with no accountability, making it unusable for high-stakes decisions.',
  },
  {
    title: 'Simulation & Modeling Software',
    description: 'Simulation tools work only after experts translate reality into narrow models.',
    cant: [
      'break when assumptions shift',
      'operate in silos',
      'require rare expertise',
      'cannot capture mandates as lived by humans',
    ],
    result: 'The model breaks when reality changes, and the insights are locked away from those who need them most.',
  },
];

const mandateArchitectureSteps = [
  {
    number: '1',
    title: 'Identity',
    description: 'Captures org type/stage, capacity bands, and mission ownership/clearance context.',
    creates: 'entity baseline + constraints anchor for the entire case.'
  },
  {
    number: '2',
    title: 'Mandate',
    description: 'Defines vision, horizon, weighted objectives, problem statement, and non‑negotiables.',
    creates: 'mandate brief + objective weighting for scoring.'
  },
  {
    number: '3',
    title: 'Market',
    description: 'Sets geographies, trends, barriers, infrastructure, and opportunity sizing assumptions.',
    creates: 'market readiness drivers + evidence checklist.'
  },
  {
    number: '4',
    title: 'Partners',
    description: 'Defines archetypes, stakeholder influence vs alignment, dependencies, and partner profile.',
    creates: 'SEAM stakeholder map inputs + partner‑fit criteria.'
  },
  {
    number: '5',
    title: 'Financial',
    description: 'Builds scenarios, capex/opex assumptions, incentives, payback and return bands.',
    creates: 'RROI ranges + scenario table + viability narrative.'
  },
  {
    number: '6',
    title: 'Risks',
    description: 'Captures categories, likelihood/impact, mitigation actions, owners, and monitoring.',
    creates: 'risk register + mitigation plan + red‑flag list.'
  },
  {
    number: '7',
    title: 'Capabilities',
    description: 'Assesses team depth, technical maturity, capability gaps, and support needs.',
    creates: 'capability assessment + gap‑closure plan.'
  },
  {
    number: '8',
    title: 'Execution',
    description: 'Defines phased roadmap, gates, owners, budgets, buffers, and activation sequencing.',
    creates: 'implementation roadmap + IVAS activation profile.'
  },
  {
    number: '9',
    title: 'Governance',
    description: 'Sets decision rights, cadence, KPIs, compliance checks, and accountability structure.',
    creates: 'governance operating model + audit trail backbone.'
  }
];

const reportLifecycleSteps = [
  { title: "Structure", description: "Your intake becomes a case model (objectives, constraints, stakeholders, scenarios, risks, execution, governance)." },
  { title: "Validate", description: "The system flags missing constraints, contradictions, and uncertainty so you can see what must be verified." },
  { title: "Debate", description: "Five specialist AI personas pressure‑test upside, downside, compliance, unit economics, and feasibility." },
  { title: "Stress‑test", description: "Counterfactual “what if?” checks expose fragility, timeline risk, and dependency failures." },
  { title: "Score", description: "The 21‑formula suite quantifies drivers, pressure points, and confidence from your inputs." },
  { title: "Synthesize", description: "Narratives, section plans, and templates are assembled for your target audience (boards, partners, regulators)." },
  { title: "Deliver", description: "The draft compiles into multi‑page intelligence reports, comparisons, and outreach letters designed to break the ice." }
];

const adaptiveElevationLevels = [
  {
    title: "For Beginners",
    description: "The system provides detailed, step-by-step guidance, explains complex concepts with examples, and proactively suggests fields to consider. The interface is supportive and educational, designed to build capability as well as analyze a plan."
  },
  {
    title: "For Operators",
    description: "The platform presents structured workflows, operational checklists, and detailed implementation plans. The focus is on execution feasibility, resource allocation, and timeline management."
  },
  {
    title: "For Executives",
    description: "The system delivers compressed analytics, high-level dashboards, and direct controls. It surfaces the most critical insights and decision points, allowing for rapid assessment and decisive action."
  }
];

const formulaSuite = [
  { name: 'SPI™', description: 'success probability posture' },
  { name: 'RROI™', description: 'risk-adjusted return logic' },
  { name: 'SEAM™', description: 'stakeholder alignment & friction' },
  { name: 'IVAS™', description: 'execution & activation feasibility' },
  { name: 'SCF™', description: 'system-level confidence grade' },
];

const whatItProduces = [
  'a living decision model',
  'an assumptions & verification register',
  'quantified confidence posture',
  'risk and mitigation maps',
  'execution roadmaps',
  'governance frameworks',
  'investor- and regulator-grade documents',
];

const whoIsItFor = [
    'Government & Policy Leaders shaping national and regional economic strategy.',
    'Institutional Investors & DFIs deploying capital into complex markets.',
    'Corporate Strategists planning market entry, JVs, or supply chain resilience.',
    'Regional Development Agencies seeking to attract and retain investment with verifiable proof.'
];

const FailureCard: React.FC<{ title: string; description: string; cant: string[]; result: string }> = ({
  title,
  description,
  cant,
  result,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col shadow-sm">
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
    <ul className="mt-4 space-y-2 text-sm flex-grow">
      {cant.map(item => (
        <li key={item} className="flex items-start gap-2">
          <Minus size={16} className="text-red-500 mt-1 shrink-0" />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
    <p className="text-sm text-gray-800 font-semibold mt-4 pt-4 border-t border-gray-200">
        Result: <span className="font-normal text-gray-600">{result}</span>
    </p>
  </div>
);

const DiscoveryCard: React.FC<{ number: string; title: string; icon: React.ElementType; children: React.ReactNode }> = ({
  number,
  title,
  icon: Icon,
  children,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="text-4xl font-black text-gray-300">{number}</div>
      <div>
        <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="text-gray-700 space-y-4">{children}</div>
      </div>
    </div>
  </div>
);

const CommandCenter: React.FC<CommandCenterProps> = ({ onOpenReportGenerator }) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLaunch = () => {
    if (!acceptedTerms) return;
    onOpenReportGenerator();
  };

  return (
    <>
      <div className="flex-1 w-full h-full min-h-0 overflow-y-auto bg-gray-100 font-sans text-gray-800 custom-scrollbar">
        <div className="max-w-5xl mx-auto py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Hero Section */}
          <section className="text-center">
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              BW Global AI
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              A new era for regional development intelligence. Around the world, a persistent Global Understanding Gap obscures genuine opportunity.
            </p>
          </section>

          {/* About & Mission */}
          <section className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Built by BW Global Advisory</h2>
            <p className="text-gray-700">
              BW Global Advisory (BWGA) is an independent Australian initiative, founded and solely developed by Brayden Walls. It was born from immersive, on‑the‑ground research in regional Philippines — and the lived reality of what actually breaks deals and stalls development — translated into a repeatable system.
            </p>
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Mission</h3>
                    <p className="text-gray-700 text-sm">
                        To bridge the Global Understanding Gap by providing AI‑enhanced intelligence that illuminates regional economic potential, facilitates symbiotic partnerships, and ensures community-centered development outcomes.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ethical AI‑Human Symbiosis</h3>
                    <p className="text-gray-700 text-sm">
                        AI amplifies human insight, but human expertise remains indispensable for context, ethics, and trust. Nexus AI is designed to augment, not replace, human judgment.
                    </p>
                </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">The World’s Most Expensive Failure</h2>
            <div className="max-w-3xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-800">
                    <span className="font-bold">Case Study:</span> Consider a $500M infrastructure project that stalls for 18 months due to an unforeseen regulatory dependency. Or a multi-billion dollar investment that fails to deliver returns because it was based on a market analysis that was outdated the moment it was printed. This is the cost of the gap.
                </p>
            </div>
            <p className="text-center text-gray-700 max-w-3xl mx-auto pt-4">
              In the 21st century, the greatest losses in governments, institutions, and regional economies do not come from bad intentions. They come from decisions made under incomplete understanding, static analysis in a dynamic world, and confidence without traceability.
            </p>
            <p className="text-center text-gray-700 max-w-3xl mx-auto font-semibold">
              This mismatch between complex adaptive systems and pre-complexity tools is the single largest unpriced risk in the global economy.
            </p>
          </section>

          {/* Why Old Models Fail */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900">Why the Old Model Cannot Be Fixed</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {oldModelFailures.map(f => (
                <FailureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          {/* The Unsolved Problem */}
          <section className="text-center space-y-6 bg-gray-800 text-white p-12 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold">The Unsolved Problem</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Every consequential decision starts with a human mandate: goals in natural language, competing objectives, political realities, and unknowns.
            </p>
            <p className="text-2xl font-bold text-blue-400 tracking-tight">
              Fatal truth: Human intent is not computable.
            </p>
            <p className="text-2xl font-bold tracking-tight">Until now.</p>
          </section>

          {/* The Core Discoveries */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">The Core Discovery</h2>
              <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
                The breakthrough was not more data. It was realizing that intent itself must be structured—without losing reality—before intelligence can exist.
              </p>
            </div>

            <DiscoveryCard number="01" title="The Computable Mandate" icon={Database}>
              <p>BW Global AI introduces the first universal method for converting a human mandate into a complete, machine-legible intelligence dataset.</p>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <span className="font-semibold">This is not form-filling.</span> It is a guided, Socratic dialogue with the system—a live consultation where each answer builds upon the last, revealing connections and constraints you hadn't considered.
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">The 9-Step Mandate Architecture</h4>
                <p className="text-sm text-gray-600 mb-4">Each step captures a different class of decision variable. Together, they form a closed system.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {mandateArchitectureSteps.map(step => (
                    <div key={step.number} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 font-bold text-xs rounded-full">{step.number}</span>
                        <h5 className="font-bold text-gray-800 text-sm">{step.title}</h5>
                      </div>
                      <p className="text-xs text-gray-600">{step.description}</p>
                      <p className="text-xs text-blue-700 font-semibold pt-2 border-t border-gray-200">Creates: {step.creates}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 font-semibold">This has never existed before.</p>
            </DiscoveryCard>

            <DiscoveryCard number="02" title="NSIL — Nexus Strategic Intelligence Layer" icon={Layers}>
              <p>Once intent becomes computable, a second problem emerges: How do you prevent false confidence? NSIL is the first reasoning governance layer for strategic intelligence. It is a proactive, agentic digital worker that begins reasoning the moment you start engaging.</p>
              <div className="my-4 text-center font-semibold text-blue-700 tracking-widest">
                Validate → Debate → Score → Synthesize → Deliver
              </div>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <span className="font-semibold">Debate:</span> Our five specialist AI personas (The Skeptic, The Advocate, The Regulator, The Accountant, and The Operator) pressure-test the case from every angle, forcing trade-offs into the open before reality does.
              </div>
              <p className="mt-4 font-semibold">No existing system governs reasoning this way.</p>
            </DiscoveryCard>

            <DiscoveryCard number="03" title="The Agentic Brain" icon={Brain}>
              <p>Most systems wait for instructions. BW Global AI works. The Agentic Brain is a persistent digital worker that owns the case, progresses it continuously, challenges weak assumptions, and refuses to proceed on incomplete logic.</p>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                This means the system anticipates your next question, prepares analyses in the background, and acts as a proactive member of your team, not a passive tool waiting for a command.
              </div>
              <p className="mt-4 font-semibold">This is agentic AI applied not to tasks—but to judgment. That distinction is new.</p>
            </DiscoveryCard>

            <DiscoveryCard number="04" title="The 21-Formula Intelligence Engine" icon={Scale}>
              <p>Confidence has always been emotional. BW Global AI makes it explainable. The proprietary 21-formula suite translates context into measurable drivers.</p>
              <div className="grid grid-cols-2 gap-4 my-4">
                {formulaSuite.map(f => (
                  <div key={f.name} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="font-bold text-gray-800">{f.name}</div>
                    <div className="text-xs text-gray-600">{f.description}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <span className="font-semibold">For instance:</span> The SEAM™ (Stakeholder Ecosystem & Alignment Map) score doesn't just list stakeholders; it quantifies the 'friction cost' of misalignment, allowing you to predict potential delays and budget for engagement.
              </div>
              <p className="mt-4">These formulas do not predict the future. They expose fragility, leverage, and failure points now. That is what decision-makers need.</p>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowFormulaModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Full Methodology & 21 Formulas</span>
                </button>
              </div>
            </DiscoveryCard>
          </section>

          {/* What This Produces */}
          <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Produces</h2>
            <p className="text-gray-700 mb-6">From a single mandate, BW Global AI generates:</p>
            <ul className="grid grid-cols-2 gap-4 text-gray-800">
              {whatItProduces.map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <span className="font-semibold">Change one assumption—everything updates,</span> because the entire case is a living, interconnected model, not a static document. Change a budget constraint, and the risk profile and execution timeline instantly re-calculate.
            </div>
            <p className="mt-4 text-center font-semibold text-gray-800">This was not previously possible.</p>
          </section>

          {/* Who This Is For */}
          <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who This Is For</h2>
            <p className="text-gray-700 mb-6">BW Nexus AI is not for everyone. It is built for leaders and teams who make consequential decisions in high-stakes environments:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {whoIsItFor.map((who, i) => <li key={i}>{who}</li>)}
            </ul>
          </section>

          {/* About */}
          <section className="text-center space-y-4 border-t border-gray-200 pt-12">
            <h3 className="text-xl font-semibold text-gray-900">Built by BW Global Advisory</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              BW Global AI is an independent Australian initiative founded and solely developed by Brayden Walls. It was born from immersive, on-the-ground experience in regional Philippines—where theory met reality, and existing systems failed.
            </p>
          </section>

          {/* Closing Manifesto */}
          <section className="text-center space-y-6 border-y border-gray-200 py-16">
            <h2 className="text-4xl font-bold text-gray-900">This Is the Moment.</h2>
            <p className="text-gray-700 text-lg">This capability did not exist. Now it does.</p>
            <p className="text-xl text-blue-700 font-semibold">
              The only question left is: What becomes possible when intent itself becomes computable?
            </p>
          </section>

          {/* CTA */}
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ready to See with Absolute Clarity?</h2>
            <p className="text-gray-700">Start your journey: define your mandate, then let the system show you what’s possible. The BW Consultant reacts immediately as you engage — listening, learning context, and responding with structured intelligence.</p>
            <p className="text-gray-700 text-sm mt-2">To proceed, please review and accept the Terms of Engagement. This ensures you understand the scope, capabilities, and limitations of the platform.</p>
            
            <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto custom-scrollbar bg-white mt-4">
              <h3 className="font-bold text-gray-900 mb-2">Terms of Engagement & Business Disclaimer</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <h4>Important Business Disclaimer</h4>
                <p>Strategic Intelligence Briefs are prepared by BW Global Advisory (ABN 55 978 113 300) using our proprietary AI-Human analytical capabilities. Analysis is based on publicly available data, BWGA's AI Economic Strategy Engine (Nexus v6.0), and regional insights gathered by our advisory team. While every effort is made to ensure accuracy at the time of generation, all briefs are illustrative, intended for strategic discussion, and do not constitute financial, legal, or investment advice. Users are advised to conduct comprehensive independent due diligence before making any investment or partnership decisions.</p>
                <h4>Terms of Engagement</h4>
                <ol>
                  <li><strong>Acceptance & Commercial License:</strong> By accessing the BW Global AI platform (v6.0), you acknowledge and accept these Terms of Engagement in full. Upon completion of payment, Strategic Intelligence Reports and associated deliverables become the intellectual property of the commissioning party. BW Global Advisory (ABN 55 978 113 300) retains rights to anonymized, aggregated data solely for system improvement and research purposes.</li>
                  <li><strong>Decision Support Tool — Not Financial Advice:</strong> The Nexus OS provides probabilistic insights, data-driven analysis, and strategic recommendations. It is expressly NOT a final decision authority and does NOT constitute financial, legal, tax, or investment advice. All outputs are advisory in nature. Users must exercise independent judgment, verify all critical findings, and seek qualified professional advice before making binding commitments.</li>
                  <li><strong>Due Diligence Requirement:</strong> Users acknowledge their responsibility to conduct comprehensive independent due diligence before acting on any analysis, recommendation, or insight provided by this platform. BW Global Advisory provides strategic intelligence to inform decisions—not to replace the professional judgment of qualified advisors.</li>
                  <li><strong>Proprietary Intellectual Property:</strong> All system architecture, algorithms, formulas, workflows, user interfaces, and the unique “agentic” methodology—including but not limited to SPI™, RROI™, SEAM™, IVAS™, SCF™, and the entire BW Global AI platform—are the exclusive and proprietary intellectual property of BW Global Advisory. Any attempt to copy, reverse engineer, decompile, or create derivative works is strictly prohibited.</li>
                  <li><strong>Limitation of Liability:</strong> To the maximum extent permitted by applicable law, BW Global Advisory, its directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages from use of the platform or reliance on its outputs. In all circumstances, total aggregate liability shall not exceed fees actually paid for the specific report or service in question.</li>
                </ol>
                <p className="text-xs mt-4">Terms Version 6.0 | Effective December 2025 | BW Global Advisory (ABN 55 978 113 300) | Sydney, Australia</p>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 max-w-md mx-auto">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={event => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <span className="text-gray-700 text-sm text-left">I have read and accept the Terms of Engagement.</span>
            </label>

            <button
              type="button"
              onClick={handleLaunch}
              disabled={!acceptedTerms}
              className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <span>Define Your Mandate</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500">© 2025 BW Global Advisory (ABN 55 978 113 300). All Rights Reserved. Nexus Intelligence OS v6.0 | Melbourne, Australia</p>
          </section>
        </div>
      </div>

      <FormulaDeepDiveModal isOpen={showFormulaModal} onClose={() => setShowFormulaModal(false)} />
    </>
  );
};

export default CommandCenter;
