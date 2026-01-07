import React, { useState } from 'react';
import { FileText, Blocks, Sparkles, X, Users, Globe, Building2, Brain, Shield, BarChart3, FileCheck, Mail, BookOpen, Briefcase, Scale, TrendingUp, Zap, Lock, Eye, CheckCircle2 } from 'lucide-react';

interface UserManualProps {
  onLaunchOS?: () => void;
}

// Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-200">
        <header className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-200 rounded">
            <X size={24} />
          </button>
        </header>
        <main className="p-8 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protocol Section with Click Modal (replacing hover)
const ProtocolSection: React.FC<{ 
  num: number; 
  title: string; 
  desc: string; 
  fullDetails: { subtitle: string; items: string[] }[];
  onOpenDetails: (num: number, title: string, details: { subtitle: string; items: string[] }[]) => void;
}> = ({ num, title, desc, onOpenDetails, fullDetails }) => {
  return (
    <div 
      className="relative cursor-pointer"
      onClick={() => onOpenDetails(num, title, fullDetails)}
    >
      <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all h-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">{num}</span>
          <span className="text-xs text-slate-400">Click to expand</span>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const UserManual: React.FC<UserManualProps> = ({ onLaunchOS }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [protocolDetail, setProtocolDetail] = useState<{ num: number; title: string; details: { subtitle: string; items: string[] }[] } | null>(null);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  const openProtocolDetail = (num: number, title: string, details: { subtitle: string; items: string[] }[]) => {
    setProtocolDetail({ num, title, details });
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Hero Section - Large with country town photo blend */}
      <header className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white min-h-[85vh] flex items-center overflow-hidden">
        {/* Country Town Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" 
            alt="Regional Country Town"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/50 to-slate-800/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-3xl">
            <p className="text-slate-300 uppercase tracking-widest text-sm mb-6">BRAYDEN WALLS GLOBAL ADVISORY</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">
              Regional communities are the backbone of every nation.<br/>
              <span className="font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">They deserve to be seen.</span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed max-w-xl">
              Built from firsthand experience in regional communities. One purpose: bridging the gap between overlooked regions and global opportunity—giving every community the tools to tell their story, attract investment, and grow.
            </p>
          </div>
        </div>
      </header>

      {/* About BWGA Introduction */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light text-slate-900 mb-8 text-center">Why This Platform Exists</h2>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="mb-12">
              <p className="text-xl text-slate-700 leading-relaxed mb-4 font-medium text-center italic">
                "I've spent years living in and researching regional communities across the Philippine Mindanao. I've seen firsthand how 
                hard local governments, businesses, and everyday people work to build something meaningful—only to be 
                overlooked because they don't have the same resources or visibility as the major cities."
              </p>
              <p className="text-right text-2xl text-slate-800 mt-6" style={{ fontFamily: "'Dancing Script', cursive" }}>
                — Brayden Walls, Founder
              </p>
            </div>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Regional areas are the backbone of every nation. They grow the food, mine the resources, and host the 
              industries that keep economies running. Yet when it comes to attracting investment, forming partnerships, 
              or telling their story to the world—they're often left without the tools that capital cities take for granted.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              That's why I spent <strong className="text-slate-900">12 months</strong> building this platform from the ground up. 
              Not as a side project. Not as a quick startup. But as a <strong className="text-slate-900">fully dedicated system</strong> designed 
              specifically to help regional development, partnerships, and growth. Every formula, every document template, 
              every intelligence layer was crafted with one goal: giving regional communities the same strategic firepower 
              that multinational corporations use.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              The efforts by regional governments and local businesses deserve to be seen. The innovation happening in 
              country towns deserves global attention. And the people who've only ever known big cities need to understand 
              that there's something remarkable happening beyond the skylines—opportunities they've never considered, 
              communities ready to welcome them, and untapped potential waiting to be discovered.
            </p>

            <div className="bg-slate-50 rounded-xl p-8 my-8 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-600" />
                <span className="text-slate-500 uppercase tracking-widest text-xs">DESIGNED FOR EVERYONE</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">You Don't Need to Be an Expert. You Just Need to Try.</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                This platform was built to help people <strong>understand</strong>, help them <strong>communicate</strong> their 
                value proposition clearly, and—most importantly—give them the confidence to <strong>simply try</strong>. 
                Whether you're a first-time exporter, a regional council looking to attract investment, or someone who's 
                never navigated a cross-border partnership before, this system guides you every step of the way.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The technology is sophisticated—21 mathematical formulas, five AI personas stress-testing every decision, 
                Monte Carlo simulations, and a Document Factory that produces over 200 document types and 150 letter templates. 
                But you don't need to understand any of that to use it. The complexity is hidden. What you see is clarity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <strong className="text-slate-800 text-sm">Regional Councils & RDAs</strong>
                </div>
                <p className="text-slate-500 text-sm">Tell your story, attract investment, and show the world what your community offers</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <strong className="text-slate-800 text-sm">State & Federal Agencies</strong>
                </div>
                <p className="text-slate-500 text-sm">Screen investments, support regional initiatives, and enable informed decisions</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <strong className="text-slate-800 text-sm">Businesses Looking Regional</strong>
                </div>
                <p className="text-slate-500 text-sm">Discover opportunities beyond the capital cities—lower costs, supportive communities, room to grow</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-slate-600" />
                  <strong className="text-slate-800 text-sm">First-Time Exporters</strong>
                </div>
                <p className="text-slate-500 text-sm">Navigate international partnerships with guidance—no prior experience required</p>
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              This isn't just software. It's a commitment to leveling the playing field. Because when regional areas 
              thrive, the whole nation benefits. And every community—no matter how far from the city—deserves the 
              chance to be seen, understood, and chosen.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership & Pilots Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-slate-400 uppercase tracking-widest text-xs mb-3">NEXT STEPS</p>
              <h2 className="text-3xl font-light text-white mb-6">Partnership & Pilot Programs</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                The most effective way to demonstrate the value of BW Nexus AI is to apply it to real-world challenges. 
                We propose collaborative partnerships through structured pilot programs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Investment Screening Pilot</p>
                    <p className="text-slate-400 text-sm">Use the platform for screening test cases with foreign investment review boards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Regional Development Pilot</p>
                    <p className="text-slate-400 text-sm">Create investment prospectuses for target regions with economic development agencies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">PPP Modeling Pilot</p>
                    <p className="text-slate-400 text-sm">Model forthcoming Public-Private Partnerships with infrastructure ministries</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 to-transparent rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80" 
                alt="Business partnership meeting"
                className="w-full rounded-2xl object-cover h-80"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                  <p className="text-white font-medium mb-1">Vision for the Future</p>
                  <p className="text-slate-400 text-sm">Deploy as a shared, national strategic asset—a sovereign-grade intelligence platform enhancing high-stakes decision-making across government.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Section Protocol - Consolidated */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-slate-500 uppercase tracking-widest text-xs mb-3 text-center">THE COMPREHENSIVE INTAKE FRAMEWORK</p>
          <h2 className="text-3xl font-light text-slate-900 mb-4 text-center">The Ten-Step Protocol</h2>
          <p className="text-lg text-slate-500 mb-4 max-w-3xl mx-auto text-center">
            Before NSIL can analyze, it must understand. This professional-grade intake framework guides you through 
            every critical dimension of your strategic plan—forcing clarity, eliminating blind spots, and ensuring the 
            AI reasoning engine works with complete, well-structured inputs.
          </p>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto text-center">
            <span className="text-slate-500 font-medium">Click any step</span> to see the detailed data requirements.
          </p>
          
          {/* Protocol Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <ProtocolSection 
              num={1} 
              title="Identity & Foundation" 
              desc="Establish organizational credibility, legal structure, and competitive positioning."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Organization Core", items: ["Legal Entity Name & Registration", "Entity Type (Public/Private/Startup/NGO)", "Industry Classification (NAICS/SIC)", "Years in Operation", "Headquarters & Operating Regions"] },
                { subtitle: "Organizational Capacity", items: ["Total Employees & Revenue Bands", "EBITDA / Net Income", "Market Share Analysis", "Profitability Trend Assessment"] },
                { subtitle: "Competitive Position", items: ["Primary Competitors (3-5)", "Unique IP / Technology / Moat", "Brand Recognition Level", "Customer Concentration Risk"] },
                { subtitle: "Financial Stability", items: ["Credit Rating / Payment History", "Audit Status", "Debt Levels & Cash Position"] }
              ]}
            />
            <ProtocolSection 
              num={2} 
              title="Mandate & Strategy" 
              desc="Define strategic vision, objectives, target partner profile, and value proposition."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Strategic Vision", items: ["3-5 Year Outlook", "Market Expansion Goals", "Capability Acquisition Targets", "ESG/Sustainability Objectives"] },
                { subtitle: "Core Problem", items: ["Problem We're Solving (measurable)", "Current State vs Desired State", "Why Now - Urgency Factors", "Cost of Inaction Analysis"] },
                { subtitle: "Objectives & KPIs", items: ["Top 3 Strategic Objectives", "Primary KPI (the one number)", "Success Timeline", "Measurement Methodology"] },
                { subtitle: "Value Proposition", items: ["What We Bring (quantified)", "What We Expect (quantified)", "Win-Win Framework", "Risk & Upside Share Model"] }
              ]}
            />
            <ProtocolSection 
              num={3} 
              title="Market & Context" 
              desc="Analyze market dynamics, regulatory environment, and macro-economic factors."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Market Definition", items: ["TAM/SAM/SOM in $ and units", "Market Growth Rate (CAGR %)", "Market Maturity Stage", "Key Segments & Mix"] },
                { subtitle: "Market Dynamics", items: ["Top 5 Market Trends", "Technology Disruption Threats", "Regulatory Headwinds/Tailwinds", "Buyer Decision Cycle"] },
                { subtitle: "Geographic Context", items: ["Target Country/Region/City", "Import/Export Regulations", "Tax Treaty Status", "IP Protection Quality", "Geopolitical Risk Score"] },
                { subtitle: "Macro Factors", items: ["GDP Growth Forecast", "Inflation & Currency Risk", "Trade Policy & Tariffs", "Labor Cost Trends"] }
              ]}
            />
            <ProtocolSection 
              num={4} 
              title="Partners & Ecosystem" 
              desc="Map stakeholder landscape, alignment scores, and relationship dynamics."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Target Counterparties", items: ["Partner Name(s) & Size", "Partner Core Capabilities", "Partner Geographic Footprint", "Decision-Maker Contacts"] },
                { subtitle: "Stakeholder Landscape", items: ["Executive Stakeholders", "Operational Stakeholders", "Legal/Compliance Stakeholders", "Board/Investor Interests"] },
                { subtitle: "Alignment Assessment", items: ["Strategic Alignment Score (1-10)", "Cultural Fit Assessment", "Decision-making Speed Match", "Risk Tolerance Alignment"] },
                { subtitle: "Relationship Dynamics", items: ["Trust Level (1-10)", "Prior Dealings History", "Communication Cadence", "Deal Experience Level"] }
              ]}
            />
            <ProtocolSection 
              num={5} 
              title="Financial Model" 
              desc="Structure investment requirements, revenue projections, and ROI scenarios."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Investment Requirements", items: ["Capital Investment Needed ($)", "Investment Type (equity/debt/grant)", "Working Capital Needed", "Contingency Buffer %"] },
                { subtitle: "Revenue Model", items: ["Revenue Streams (up to 3)", "Year 1/3/5 Revenue Targets", "Revenue Growth Rate %", "Recurring vs One-time Split"] },
                { subtitle: "Cost Structure", items: ["COGS as % of Revenue", "Gross Margin Target", "Operating Expense Budget", "Head Count Plan"] },
                { subtitle: "Return Analysis", items: ["Break-even Timeline", "NPV @ Discount Rate", "IRR & Return Multiple", "Payback Period (months)"] }
              ]}
            />
            <ProtocolSection 
              num={6} 
              title="Risk & Mitigation" 
              desc="Identify and quantify risks with probability/impact matrices and mitigation plans."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Risk Register", items: ["Top 5 Risks with Probability %", "Impact Assessment ($M)", "Mitigation Plan per Risk", "Risk Owner Assignment"] },
                { subtitle: "Market Risks", items: ["Market Size Risk", "Competitive Response Risk", "Customer Acceptance Risk", "Technology Obsolescence"] },
                { subtitle: "Operational Risks", items: ["Key Person Risk", "Supply Chain Risk", "Integration Risk", "Talent Acquisition Risk"] },
                { subtitle: "Financial & Legal Risks", items: ["Currency & Interest Rate Risk", "Regulatory & Litigation Risk", "Contract & Tax Risk", "Data Privacy/Security Risk"] }
              ]}
            />
            <ProtocolSection 
              num={7} 
              title="Resources & Capability" 
              desc="Assess organizational readiness, team strength, and capability gaps."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Technology Stack", items: ["Core Technology Platform", "Integration Requirements", "IP/Patents Protected", "Scalability Assessment"] },
                { subtitle: "Team & Talent", items: ["Executive Team Profiles", "Specialized Roles Needed", "Bench Strength Analysis", "External Advisor Needs"] },
                { subtitle: "Organizational Capabilities", items: ["Sales & Operations Capability", "P&L Management Track Record", "M&A Integration Experience", "Change Management Ability"] },
                { subtitle: "Capability Gaps", items: ["What We Have", "What Partner Must Provide", "What We Can Build", "What We Must Acquire"] }
              ]}
            />
            <ProtocolSection 
              num={8} 
              title="Execution Plan" 
              desc="Define implementation roadmap, milestones, dependencies, and go/no-go gates."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Phase 1: Foundation (M1-3)", items: ["Key Milestones & Owners", "Decisions to Make", "Approvals Needed", "Budget Required"] },
                { subtitle: "Phase 2: Ramp (M4-9)", items: ["Scaling Milestones", "Resource Ramp Plan", "Integration Checkpoints", "Performance Gates"] },
                { subtitle: "Phase 3: Scale (M10-18)", items: ["Full Operation Milestones", "Optimization Targets", "Expansion Triggers", "Exit/Continuation Criteria"] },
                { subtitle: "Critical Path", items: ["Blocking Dependencies", "Parallel Workstreams", "Buffer Time Allocation", "Go/No-Go Decision Points"] }
              ]}
            />
            <ProtocolSection 
              num={9} 
              title="Governance & Monitoring" 
              desc="Establish oversight structure, decision matrices, and performance tracking."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Governance Structure", items: ["Steering Committee Members", "Working Groups Defined", "Decision Authority Matrix", "Escalation Path Protocol"] },
                { subtitle: "Key Metrics", items: ["Financial KPIs (revenue, margin)", "Operational KPIs (efficiency)", "Strategic KPIs (market share)", "Health Indicators (engagement)"] },
                { subtitle: "Decision Framework", items: ["Committee Approval Thresholds", "Operational Decision Rights", "Financial Approval Limits", "Disagreement Resolution Process"] },
                { subtitle: "Contingency Planning", items: ["Revenue Miss Response", "Key Person Exit Plan", "Partner Relationship Protocol", "Market Change Triggers"] }
              ]}
            />
            <ProtocolSection 
              num={10} 
              title="Scoring & Readiness" 
              desc="Final validation and readiness assessment with go/no-go recommendation."
              onOpenDetails={openProtocolDetail}
              fullDetails={[
                { subtitle: "Completion Scoring", items: ["Green (Ready): >90% complete", "Yellow (In Progress): 70-90%", "Red (Not Ready): <70%", "Critical Fields Validation"] },
                { subtitle: "Readiness Assessment", items: ["All Sections Reviewed", "No Red Flags Detected", "Key Gaps Identified", "Remediation Plan if Needed"] },
                { subtitle: "Final Recommendation", items: ["Proceed / Pause / Re-structure", "Confidence Score (0-100)", "Key Drivers of Decision", "Pressure Points to Address"] },
                { subtitle: "Next Steps", items: ["Immediate Actions Required", "Owner Assignments", "Timeline to Decision", "Stakeholder Communications"] }
              ]}
            />
          </div>
          
          {/* Consolidated Stats Grid */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {/* Document Factory & Training Archive */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-slate-400" />
                <span className="text-slate-400 uppercase tracking-widest text-xs">10-STEP PROTOCOL → OUTPUTS</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Factory</h3>
              <p className="text-slate-300 text-sm mb-4">
                After completing the <strong className="text-white">10-Step Intelligence Protocol</strong>, 
                the platform generates a complete library of professional deliverables—fully populated with your 
                specific data and scored using the 21-formula algorithm suite.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-white">200+</div>
                  <div className="text-xs text-slate-400">Report & Document Types</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-white">150+</div>
                  <div className="text-xs text-slate-400">Letter Templates</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveModal('outputs')} className="flex-1 px-5 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-all inline-flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Full Catalog
                </button>
                <button onClick={() => setActiveModal('testing')} className="flex-1 px-5 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-all inline-flex items-center justify-center gap-2 border border-slate-600">
                  <BookOpen className="w-4 h-4" />
                  12 Sample Reports
                </button>
              </div>
            </div>
            
            {/* Technical Architecture */}
            <div className="bg-slate-100 rounded-xl p-8 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Blocks className="w-6 h-6 text-slate-600" />
                <span className="text-slate-500 uppercase tracking-widest text-xs">TECHNICAL FOUNDATION</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Technical Architecture</h3>
              <p className="text-slate-600 text-sm mb-6">
                NSIL intelligence layer, 21-formula scoring suite, multi-agent reasoning system. Complete algorithmic 
                documentation and innovation statement explaining how the platform transforms inputs into intelligence.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">5-Layer NSIL</span>
                  </div>
                  <p className="text-xs text-slate-500">Autonomous reasoning architecture</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">5 AI Personas</span>
                  </div>
                  <p className="text-xs text-slate-500">Adversarial debate system</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('architecture')} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all inline-flex items-center gap-2">
                <Blocks className="w-4 h-4" />
                View Full Architecture
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section with Modal Triggers */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Platform Introduction Section - From Doc 209 */}
          <div className="mb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 border border-slate-700 relative overflow-hidden">
            {/* AI Neural Network Background */}
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80" 
                alt="AI Neural Network"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
              {/* AI Visualization */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80" 
                    alt="AI Intelligence System"
                    className="w-64 h-64 object-cover rounded-2xl border-2 border-slate-600 shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold border border-slate-600">
                    NSIL Engine v3.2
                  </div>
                </div>
              </div>
              
              {/* Platform Description - From Doc 209 */}
              <div className="lg:col-span-2 text-white">
                <p className="text-slate-400 uppercase tracking-widest text-xs mb-3">BW GLOBAL ADVISORY</p>
                <h2 className="text-3xl font-light text-white mb-4">A New Class of Strategic Intelligence Platform</h2>
                <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                  BW Nexus AI is a <strong className="text-white">Strategic Intelligence and Execution Platform</strong> that functions 
                  as a digital consultant combined with a high-end document automation factory. It transforms your inputs — mission, 
                  constraints, risk appetite, and strategic goals — into a <strong className="text-white">live, interactive decision model</strong>.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  The platform does not simply store data; it reads it, simulates outcomes, stress-tests assumptions, finds hidden risks, 
                  and proposes auditable, evidence-backed fixes. It delivers in minutes what once took months, providing analytical depth 
                  previously accessible only to the world's largest organizations.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Challenges & Solutions */}
          <div className="mb-16">
            <p className="text-slate-500 uppercase tracking-widest text-xs mb-3 text-center">SOLVING REAL PROBLEMS</p>
            <h2 className="text-3xl font-light text-slate-900 mb-4 text-center">Regional Challenges, Intelligent Solutions</h2>
            <p className="text-lg text-slate-500 mb-10 max-w-3xl mx-auto text-center">
              The platform was built to address the specific barriers that prevent global capital from reaching regional communities.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Regional Invisibility</h4>
                <p className="text-xs text-slate-500 mb-3">Regional opportunities lack structured data for global comparison.</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Solution</p>
                  <p className="text-sm font-medium text-slate-900">RROI™ Regional Scoring</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Partnership Risks</h4>
                <p className="text-xs text-slate-500 mb-3">Cultural and governance gaps remain invisible until failure.</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Solution</p>
                  <p className="text-sm font-medium text-slate-900">SEAM™ Ecosystem Analysis</p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Optimistic Forecasts</h4>
                <p className="text-xs text-slate-500 mb-3">Single-point projections collapse when reality deviates.</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Solution</p>
                  <p className="text-sm font-medium text-slate-900">Monte Carlo Simulation</p>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Analyst Bottleneck</h4>
                <p className="text-xs text-slate-500 mb-3">Manual research takes weeks and costs prohibitive fees.</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Solution</p>
                  <p className="text-sm font-medium text-slate-900">Multi-Persona AI Debate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Platform CTA */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 text-center border border-slate-700">
            <h3 className="text-2xl font-light text-white mb-3">Ready to Experience the Platform?</h3>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Launch the full BW Nexus Intelligence OS to start analyzing partnership opportunities with sovereign-grade analytical depth.
            </p>
            <button 
              onClick={() => onLaunchOS?.()}
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all inline-flex items-center gap-3 text-lg"
            >
              <Blocks className="w-6 h-6" />
              Launch Intelligence OS
            </button>
            <p className="text-slate-500 text-xs mt-4">By accessing the platform, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </section>

      {/* OUTPUTS MODAL - Complete Document Catalog */}
      <Modal isOpen={activeModal === 'outputs'} onClose={() => setActiveModal(null)} title="Document Factory: Complete Output Catalog">
        <div className="space-y-6">
          
          {/* Introduction */}
          <div className="bg-slate-900 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Complete Document Library
              </h3>
              <div className="flex gap-4 text-center">
                <div><div className="text-2xl font-bold">200+</div><div className="text-xs text-slate-400">Documents</div></div>
                <div><div className="text-2xl font-bold">150+</div><div className="text-xs text-slate-400">Letters</div></div>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Every document below is auto-generated from your 10-Step Protocol data, fully populated with your specific 
              opportunity details, and scored using the 21-formula algorithm suite. Export to PDF, Word, or PowerPoint.
            </p>
          </div>

          {/* STRATEGIC INTELLIGENCE REPORTS (25+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Strategic Intelligence Reports (25+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Executive Summary Report</div>
              <div className="p-2 bg-slate-50 rounded">Strategic Intelligence Brief</div>
              <div className="p-2 bg-slate-50 rounded">Board Presentation Deck</div>
              <div className="p-2 bg-slate-50 rounded">Investment Thesis Document</div>
              <div className="p-2 bg-slate-50 rounded">Opportunity Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Strategic Options Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Competitive Intelligence Report</div>
              <div className="p-2 bg-slate-50 rounded">Market Entry Strategy</div>
              <div className="p-2 bg-slate-50 rounded">Partnership Recommendation</div>
              <div className="p-2 bg-slate-50 rounded">Go/No-Go Decision Memo</div>
              <div className="p-2 bg-slate-50 rounded">Scenario Planning Report</div>
              <div className="p-2 bg-slate-50 rounded">Strategic Roadmap (1-5 Year)</div>
              <div className="p-2 bg-slate-50 rounded">SWOT Analysis Report</div>
              <div className="p-2 bg-slate-50 rounded">Porter's Five Forces Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Blue Ocean Strategy Canvas</div>
              <div className="p-2 bg-slate-50 rounded">Value Chain Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Strategic Fit Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Synergy Quantification Report</div>
              <div className="p-2 bg-slate-50 rounded">Integration Playbook</div>
              <div className="p-2 bg-slate-50 rounded">100-Day Plan</div>
              <div className="p-2 bg-slate-50 rounded">Transformation Roadmap</div>
              <div className="p-2 bg-slate-50 rounded">Exit Strategy Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Succession Planning Brief</div>
              <div className="p-2 bg-slate-50 rounded">Strategic Review (Annual)</div>
              <div className="p-2 bg-slate-50 rounded">Quarterly Strategy Update</div>
            </div>
          </div>

          {/* MARKET & INDUSTRY ANALYSIS (30+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Market & Industry Analysis (30+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Market Analysis Dossier</div>
              <div className="p-2 bg-slate-50 rounded">TAM/SAM/SOM Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Industry Landscape Report</div>
              <div className="p-2 bg-slate-50 rounded">Competitive Benchmarking</div>
              <div className="p-2 bg-slate-50 rounded">Market Sizing Study</div>
              <div className="p-2 bg-slate-50 rounded">Customer Segmentation Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Buyer Persona Profiles</div>
              <div className="p-2 bg-slate-50 rounded">Market Entry Feasibility</div>
              <div className="p-2 bg-slate-50 rounded">Country Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Regulatory Environment Scan</div>
              <div className="p-2 bg-slate-50 rounded">Trade Policy Analysis</div>
              <div className="p-2 bg-slate-50 rounded">FDI Climate Report</div>
              <div className="p-2 bg-slate-50 rounded">Economic Indicators Dashboard</div>
              <div className="p-2 bg-slate-50 rounded">Currency Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Labor Market Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Supply Chain Mapping</div>
              <div className="p-2 bg-slate-50 rounded">Distribution Channel Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Pricing Strategy Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Technology Landscape Scan</div>
              <div className="p-2 bg-slate-50 rounded">Digital Maturity Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Innovation Ecosystem Map</div>
              <div className="p-2 bg-slate-50 rounded">Startup & Venture Landscape</div>
              <div className="p-2 bg-slate-50 rounded">M&A Activity Report</div>
              <div className="p-2 bg-slate-50 rounded">IPO Pipeline Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Private Equity Landscape</div>
              <div className="p-2 bg-slate-50 rounded">Trend Forecast (3-5 Year)</div>
              <div className="p-2 bg-slate-50 rounded">Disruption Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">ESG/Sustainability Scan</div>
              <div className="p-2 bg-slate-50 rounded">Geopolitical Risk Brief</div>
              <div className="p-2 bg-slate-50 rounded">Trade Corridor Analysis</div>
            </div>
          </div>

          {/* FINANCIAL DOCUMENTS (35+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                Financial Documents (35+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Financial Model (Excel)</div>
              <div className="p-2 bg-slate-50 rounded">Pro Forma Financials</div>
              <div className="p-2 bg-slate-50 rounded">DCF Valuation Model</div>
              <div className="p-2 bg-slate-50 rounded">Comparable Company Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Precedent Transaction Analysis</div>
              <div className="p-2 bg-slate-50 rounded">LBO Model</div>
              <div className="p-2 bg-slate-50 rounded">Merger Model</div>
              <div className="p-2 bg-slate-50 rounded">Synergy Valuation</div>
              <div className="p-2 bg-slate-50 rounded">Revenue Forecast Model</div>
              <div className="p-2 bg-slate-50 rounded">Cost Structure Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Unit Economics Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Break-even Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Sensitivity Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Monte Carlo Simulation</div>
              <div className="p-2 bg-slate-50 rounded">Scenario Modeling (Bull/Bear/Base)</div>
              <div className="p-2 bg-slate-50 rounded">Working Capital Model</div>
              <div className="p-2 bg-slate-50 rounded">Cash Flow Projection</div>
              <div className="p-2 bg-slate-50 rounded">Funding Requirements Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Capital Structure Options</div>
              <div className="p-2 bg-slate-50 rounded">Debt Capacity Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Term Sheet (Draft)</div>
              <div className="p-2 bg-slate-50 rounded">Investment Memorandum</div>
              <div className="p-2 bg-slate-50 rounded">Pitch Deck (Financial)</div>
              <div className="p-2 bg-slate-50 rounded">Data Room Index</div>
              <div className="p-2 bg-slate-50 rounded">Investor Q&A Document</div>
              <div className="p-2 bg-slate-50 rounded">ROI Analysis Report</div>
              <div className="p-2 bg-slate-50 rounded">Payback Period Analysis</div>
              <div className="p-2 bg-slate-50 rounded">NPV/IRR Summary</div>
              <div className="p-2 bg-slate-50 rounded">Earnout Structure Options</div>
              <div className="p-2 bg-slate-50 rounded">Purchase Price Allocation</div>
              <div className="p-2 bg-slate-50 rounded">Tax Structure Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Transfer Pricing Framework</div>
              <div className="p-2 bg-slate-50 rounded">FX Hedging Strategy</div>
              <div className="p-2 bg-slate-50 rounded">Insurance Requirements</div>
              <div className="p-2 bg-slate-50 rounded">Budget Template (Annual)</div>
            </div>
          </div>

          {/* DUE DILIGENCE DOCUMENTS (25+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-slate-600" />
                Due Diligence Documents (25+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Due Diligence Checklist (Master)</div>
              <div className="p-2 bg-slate-50 rounded">Financial Due Diligence Report</div>
              <div className="p-2 bg-slate-50 rounded">Commercial Due Diligence Report</div>
              <div className="p-2 bg-slate-50 rounded">Legal Due Diligence Summary</div>
              <div className="p-2 bg-slate-50 rounded">Tax Due Diligence Report</div>
              <div className="p-2 bg-slate-50 rounded">IT/Technology Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">HR/Talent Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">Environmental Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">IP Due Diligence Report</div>
              <div className="p-2 bg-slate-50 rounded">Regulatory Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">Compliance Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">Customer Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">Supplier Due Diligence</div>
              <div className="p-2 bg-slate-50 rounded">Contract Review Summary</div>
              <div className="p-2 bg-slate-50 rounded">Litigation Review</div>
              <div className="p-2 bg-slate-50 rounded">Insurance Review</div>
              <div className="p-2 bg-slate-50 rounded">Real Estate Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Asset Verification Report</div>
              <div className="p-2 bg-slate-50 rounded">Quality of Earnings Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Working Capital Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Red Flag Report</div>
              <div className="p-2 bg-slate-50 rounded">Management Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Culture Compatibility Audit</div>
              <div className="p-2 bg-slate-50 rounded">Synergy Validation Report</div>
              <div className="p-2 bg-slate-50 rounded">Integration Risk Assessment</div>
            </div>
          </div>

          {/* RISK MANAGEMENT (20+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Risk Management (20+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Risk Register (Master)</div>
              <div className="p-2 bg-slate-50 rounded">Risk Mitigation Strategy</div>
              <div className="p-2 bg-slate-50 rounded">Risk Heat Map</div>
              <div className="p-2 bg-slate-50 rounded">Probability/Impact Matrix</div>
              <div className="p-2 bg-slate-50 rounded">Contingency Planning Framework</div>
              <div className="p-2 bg-slate-50 rounded">Business Continuity Plan</div>
              <div className="p-2 bg-slate-50 rounded">Crisis Management Playbook</div>
              <div className="p-2 bg-slate-50 rounded">Political Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Country Risk Scorecard</div>
              <div className="p-2 bg-slate-50 rounded">Regulatory Risk Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Compliance Risk Map</div>
              <div className="p-2 bg-slate-50 rounded">Cybersecurity Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Data Privacy Risk Review</div>
              <div className="p-2 bg-slate-50 rounded">Third-Party Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Supply Chain Risk Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Concentration Risk Report</div>
              <div className="p-2 bg-slate-50 rounded">Key Person Risk Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Reputational Risk Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Scenario Stress Testing</div>
              <div className="p-2 bg-slate-50 rounded">Exit Risk Assessment</div>
            </div>
          </div>

          {/* GOVERNANCE & OPERATIONS (25+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-slate-600" />
                Governance & Operations (25+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Governance Framework</div>
              <div className="p-2 bg-slate-50 rounded">Steering Committee Charter</div>
              <div className="p-2 bg-slate-50 rounded">Board Pack Template</div>
              <div className="p-2 bg-slate-50 rounded">Decision Authority Matrix</div>
              <div className="p-2 bg-slate-50 rounded">Escalation Protocol</div>
              <div className="p-2 bg-slate-50 rounded">Meeting Cadence Framework</div>
              <div className="p-2 bg-slate-50 rounded">Reporting Requirements</div>
              <div className="p-2 bg-slate-50 rounded">KPI Dashboard</div>
              <div className="p-2 bg-slate-50 rounded">Scorecard Template</div>
              <div className="p-2 bg-slate-50 rounded">Execution Roadmap (Gantt)</div>
              <div className="p-2 bg-slate-50 rounded">Milestone Tracker</div>
              <div className="p-2 bg-slate-50 rounded">RACI Matrix</div>
              <div className="p-2 bg-slate-50 rounded">Workstream Plan</div>
              <div className="p-2 bg-slate-50 rounded">Resource Allocation Plan</div>
              <div className="p-2 bg-slate-50 rounded">Change Management Plan</div>
              <div className="p-2 bg-slate-50 rounded">Communication Plan</div>
              <div className="p-2 bg-slate-50 rounded">Stakeholder Map</div>
              <div className="p-2 bg-slate-50 rounded">Training Plan</div>
              <div className="p-2 bg-slate-50 rounded">Knowledge Transfer Protocol</div>
              <div className="p-2 bg-slate-50 rounded">SOP Template Library</div>
              <div className="p-2 bg-slate-50 rounded">Process Mapping Document</div>
              <div className="p-2 bg-slate-50 rounded">Quality Assurance Framework</div>
              <div className="p-2 bg-slate-50 rounded">Performance Review Template</div>
              <div className="p-2 bg-slate-50 rounded">Lessons Learned Report</div>
              <div className="p-2 bg-slate-50 rounded">Post-Mortem Analysis</div>
            </div>
          </div>

          {/* PARTNER ASSESSMENT (15+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Partner Assessment (15+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">Partner Compatibility Assessment</div>
              <div className="p-2 bg-slate-50 rounded">SEAM™ Alignment Report</div>
              <div className="p-2 bg-slate-50 rounded">Stakeholder Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Network Value Assessment</div>
              <div className="p-2 bg-slate-50 rounded">Cultural Fit Scorecard</div>
              <div className="p-2 bg-slate-50 rounded">Decision-Maker Profiles</div>
              <div className="p-2 bg-slate-50 rounded">Relationship Mapping</div>
              <div className="p-2 bg-slate-50 rounded">Influence Diagram</div>
              <div className="p-2 bg-slate-50 rounded">Partner Scorecard</div>
              <div className="p-2 bg-slate-50 rounded">Reference Check Framework</div>
              <div className="p-2 bg-slate-50 rounded">Background Verification</div>
              <div className="p-2 bg-slate-50 rounded">Reputation Analysis</div>
              <div className="p-2 bg-slate-50 rounded">Media/Press Review</div>
              <div className="p-2 bg-slate-50 rounded">Social Listening Report</div>
              <div className="p-2 bg-slate-50 rounded">Sanctions/Watchlist Check</div>
            </div>
          </div>

          {/* LETTER TEMPLATES (150+ types) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-600" />
                Letter & Communication Templates (150+ Types)
              </h3>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Outreach & Introduction</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Initial Contact Letter</div>
                    <div>• Introduction Request</div>
                    <div>• Meeting Request</div>
                    <div>• Partnership Inquiry</div>
                    <div>• Investment Interest Letter</div>
                    <div>• JV Exploration Letter</div>
                    <div>• Alliance Proposal</div>
                    <div>• Collaboration Request</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Formal Agreements</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Letter of Intent (LOI)</div>
                    <div>• Memorandum of Understanding</div>
                    <div>• Non-Disclosure Agreement</div>
                    <div>• Exclusivity Agreement</div>
                    <div>• Term Sheet Cover Letter</div>
                    <div>• Heads of Terms</div>
                    <div>• Binding Offer Letter</div>
                    <div>• Acceptance Letter</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Government & Regulatory</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Minister Introduction Letter</div>
                    <div>• Embassy Correspondence</div>
                    <div>• Trade Commissioner Letter</div>
                    <div>• Regulatory Inquiry</div>
                    <div>• License Application Cover</div>
                    <div>• Permit Request</div>
                    <div>• Compliance Certification</div>
                    <div>• Policy Submission</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Investor Relations</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Investor Update Letter</div>
                    <div>• Funding Request</div>
                    <div>• Capital Call Notice</div>
                    <div>• Distribution Notice</div>
                    <div>• Annual Letter to Investors</div>
                    <div>• Quarterly Update</div>
                    <div>• Board Report Cover</div>
                    <div>• Shareholder Communication</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Negotiation & Deal</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Counter-Proposal Letter</div>
                    <div>• Price Adjustment Request</div>
                    <div>• Extension Request</div>
                    <div>• Deadline Modification</div>
                    <div>• Condition Waiver Request</div>
                    <div>• Closing Confirmation</div>
                    <div>• Signing Ceremony Agenda</div>
                    <div>• Post-Signing Acknowledgment</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Follow-Up & Relationship</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>• Thank You Letter</div>
                    <div>• Meeting Follow-Up</div>
                    <div>• Action Item Summary</div>
                    <div>• Progress Update</div>
                    <div>• Milestone Celebration</div>
                    <div>• Anniversary Acknowledgment</div>
                    <div>• Relationship Renewal</div>
                    <div>• Referral Request</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-500 text-center">
                + 100 more templates including: Termination notices, Dispute resolution, Force majeure, 
                Amendment requests, Guarantee letters, Comfort letters, Reference letters, and more...
              </div>
            </div>
          </div>

          {/* Legal Documents Note */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-600" />
                Legal Document Frameworks (20+ Types)
              </h3>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded">JV Agreement Framework</div>
              <div className="p-2 bg-slate-50 rounded">Shareholders Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Share Purchase Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Asset Purchase Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Subscription Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Convertible Note</div>
              <div className="p-2 bg-slate-50 rounded">SAFE Agreement</div>
              <div className="p-2 bg-slate-50 rounded">License Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Distribution Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Franchise Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Management Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Service Level Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Supply Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Off-take Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Employment Contract</div>
              <div className="p-2 bg-slate-50 rounded">Consultancy Agreement</div>
              <div className="p-2 bg-slate-50 rounded">IP Assignment</div>
              <div className="p-2 bg-slate-50 rounded">Escrow Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Guarantee Agreement</div>
              <div className="p-2 bg-slate-50 rounded">Security Agreement</div>
            </div>
            <div className="px-4 pb-4 text-xs text-slate-500">
              <em>Note: Legal frameworks require review by qualified legal counsel before execution.</em>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-900 text-white rounded-lg p-6 text-center">
            <h4 className="font-bold text-lg mb-2">Complete the 10-Step Protocol to Generate Your Documents</h4>
            <p className="text-sm text-slate-300">
              Every document is populated with your specific opportunity data, scored using our 21-formula suite, 
              and exportable in PDF, Word, PowerPoint, or Excel format.
            </p>
          </div>
        </div>
      </Modal>

      {/* ARCHITECTURE MODAL - University Report Style with Full Documentation */}
      <Modal isOpen={activeModal === 'architecture'} onClose={() => setActiveModal(null)} title="Technical Architecture & Intelligence Framework">
        <div className="space-y-8 text-slate-700">
          {/* Abstract */}
          <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-600">
            <h3 className="font-bold text-slate-900 mb-2">Abstract</h3>
            <p className="text-sm leading-relaxed mb-3">
              BWGA Intelligence AI implements a <strong>neuro-symbolic reasoning architecture</strong> combining pattern recognition with explainable logic. The system employs a multi-agent debate framework, validated through a proprietary 21-formula scoring suite, to produce decision-grade intelligence that survives board scrutiny, partner negotiation, and regulatory review.
            </p>
            <p className="text-sm leading-relaxed">
              This paper documents the technical innovation, algorithmic foundations, and validation methodology that establishes BWGA Intelligence AI as a novel contribution to strategic decision-support systems.
            </p>
          </div>

          {/* Why This Has Never Existed - Innovation Statement */}
          <div className="bg-slate-900 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-300" />
              Why This Technology Is Novel
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Traditional strategic advisory relies on consultant intuition, static frameworks, and manual analysis. Existing AI tools (ChatGPT, Copilot, etc.) generate text but lack:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">What Exists Today</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Generic LLMs with no domain structure</li>
                  <li>• Single-perspective text generation</li>
                  <li>• No quantified scoring frameworks</li>
                  <li>• No contradiction detection</li>
                  <li>• No audit trail or provenance</li>
                  <li>• Hallucination-prone outputs</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">What BWGA Provides</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• <strong>Structured 10-section intake protocol</strong></li>
                  <li>• <strong>5-persona adversarial debate</strong></li>
                  <li>• <strong>21-formula quantified scoring suite</strong></li>
                  <li>• <strong>SAT solver for contradiction detection</strong></li>
                  <li>• <strong>Full provenance chain for every recommendation</strong></li>
                  <li>• <strong>Explainable outputs with drivers & pressure points</strong></li>
                </ul>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg text-xs">
              <p className="text-slate-300">
                <strong className="text-white">Key Innovation:</strong> BWGA is the first system to combine <em>neuro-symbolic reasoning</em> (LLM + formal logic), <em>multi-agent debate</em> (adversarial validation), and <em>quantified scoring</em> (mathematical indices) into a single decision-support architecture for cross-border partnership intelligence.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-600" />
              Competitive Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Capability</th>
                    <th className="p-3 text-center">Generic AI (GPT, Claude)</th>
                    <th className="p-3 text-center">Consulting Firms</th>
                    <th className="p-3 text-center">BI Dashboards</th>
                    <th className="p-3 text-center bg-slate-700">BWGA Intelligence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cap: "Structured Strategic Intake", gpt: "❌", consult: "⚠️ Manual", bi: "❌", bwga: "✅ 10-Section Protocol" },
                    { cap: "Multi-Perspective Validation", gpt: "❌ Single thread", consult: "⚠️ Team-dependent", bi: "❌", bwga: "✅ 5-Persona Debate" },
                    { cap: "Quantified Scoring", gpt: "❌", consult: "⚠️ Subjective", bi: "⚠️ Metrics only", bwga: "✅ 21 Formulas" },
                    { cap: "Contradiction Detection", gpt: "❌", consult: "⚠️ Manual review", bi: "❌", bwga: "✅ SAT Solver" },
                    { cap: "Explainable Recommendations", gpt: "⚠️ Text only", consult: "⚠️ Narrative", bi: "❌", bwga: "✅ Drivers + Pressure Points" },
                    { cap: "Real-time Processing", gpt: "✅", consult: "❌ Weeks", bi: "✅", bwga: "✅ 1-3 seconds" },
                    { cap: "Audit Trail / Provenance", gpt: "❌", consult: "⚠️ Documents", bi: "⚠️ Logs", bwga: "✅ Full Chain" },
                    { cap: "Cost per Analysis", gpt: "$0.10", consult: "$50K-500K", bi: "N/A", bwga: "$50-500" },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 font-medium border-t border-slate-200">{row.cap}</td>
                      <td className="p-3 text-center border-t border-slate-200">{row.gpt}</td>
                      <td className="p-3 text-center border-t border-slate-200">{row.consult}</td>
                      <td className="p-3 text-center border-t border-slate-200">{row.bi}</td>
                      <td className="p-3 text-center border-t border-slate-200 bg-slate-100 font-semibold text-slate-900">{row.bwga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Core Formula Display with Full Mathematical Documentation */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">1. Primary Intelligence Engines (5 Core Formulas)</h3>
            <p className="mb-4 text-sm">The system computes five primary scores using weighted factor analysis. Each formula produces a 0-100 score, grade banding, drivers, pressure points, and actionable levers.</p>
            
            <div className="space-y-4">
              {/* SPI Formula */}
              <div className="bg-slate-900 text-white p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">SPI™</span>
                  <span className="font-semibold">Success Probability Index</span>
                </div>
                <div className="font-mono text-sm mb-3 bg-slate-800 p-3 rounded">
                  <span className="text-white">SPI</span> = Σ(<span className="text-slate-300">w<sub>i</sub></span> × <span className="text-slate-400">F<sub>i</sub></span>) / Σ<span className="text-slate-300">w<sub>i</sub></span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-white">Purpose:</strong> Estimate likelihood of partnership/entry success using weighted strategic factors.</p>
                  <p><strong className="text-white">Factors (F):</strong> MarketReadiness, PartnerFit, RegulatoryClarity, ExecutionFeasibility, RiskAlignment</p>
                  <p><strong className="text-white">Weights (w):</strong> Dynamically adjusted based on strategy type and user risk profile (0.1 - 0.3 range)</p>
                  <p><strong className="text-white">Output:</strong> Score 0-100, Grade (A-F), Top 3 Drivers, Top 3 Pressure Points, Recommended Levers</p>
                </div>
              </div>

              {/* RROI Formula */}
              <div className="bg-slate-900 text-white p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">RROI™</span>
                  <span className="font-semibold">Regional Return on Investment</span>
                </div>
                <div className="font-mono text-sm mb-3 bg-slate-800 p-3 rounded">
                  <span className="text-white">RROI</span> = (<span className="text-slate-300">NPV</span> × (1 - <span className="text-slate-400">λ</span>) + <span className="text-slate-400">I</span> × <span className="text-slate-300">M</span>) / <span className="text-slate-400">C<sub>total</sub></span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-white">Purpose:</strong> Project risk-adjusted ROI for a specific region, incorporating local multipliers.</p>
                  <p><strong className="text-white">Variables:</strong> NPV = Net Present Value, λ = Regional Risk Factor (0-1), I = Incentives ($), M = Regional Multiplier, C = Total Cost</p>
                  <p><strong className="text-white">Regional Factors:</strong> Labor costs, infrastructure quality, tax incentives, growth trajectory, currency stability</p>
                  <p><strong className="text-white">Output:</strong> ROI multiple (e.g., 2.4x), P10/P50/P90 scenarios, Key assumptions, Sensitivity drivers</p>
                </div>
              </div>

              {/* SEAM Formula */}
              <div className="bg-slate-900 text-white p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">SEAM™</span>
                  <span className="font-semibold">Stakeholder Entity Alignment Matrix</span>
                </div>
                <div className="font-mono text-sm mb-3 bg-slate-800 p-3 rounded">
                  <span className="text-white">SEAM</span> = Π<sup>n</sup><sub>i=1</sub> (<span className="text-slate-300">A<sub>i</sub></span> × <span className="text-slate-400">W<sub>i</sub></span>) / Σ<span className="text-slate-400">C<sub>j</sub></span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-white">Purpose:</strong> Model the entire stakeholder ecosystem—incentives, conflicts, and influence networks.</p>
                  <p><strong className="text-white">Variables:</strong> A = Alignment Score (1-10), W = Stakeholder Weight (influence level), C = Conflict Penalties</p>
                  <p><strong className="text-white">Stakeholders Analyzed:</strong> Executive, Operational, Financial, Legal, Board/Investor, Customer, Employee</p>
                  <p><strong className="text-white">Output:</strong> Alignment vs Conflict signals, Influence pressures, Recommended alignment actions</p>
                </div>
              </div>

              {/* IVAS Formula */}
              <div className="bg-slate-900 text-white p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">IVAS™</span>
                  <span className="font-semibold">Investment Validation Assessment Score</span>
                </div>
                <div className="font-mono text-sm mb-3 bg-slate-800 p-3 rounded">
                  <span className="text-white">IVAS</span> = α(<span className="text-slate-300">R</span>) + β(<span className="text-slate-400">T</span>) - γ(<span className="text-slate-400">F</span>)
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-white">Purpose:</strong> Stress-test activation timelines and friction using scenario ranges (P10/P50/P90).</p>
                  <p><strong className="text-white">Variables:</strong> R = Readiness score, T = Timeline confidence, F = Friction factors, α/β/γ = Calibration weights</p>
                  <p><strong className="text-white">Friction Factors:</strong> Regulatory delays, integration complexity, resource constraints, external dependencies</p>
                  <p><strong className="text-white">Output:</strong> Time-to-activation profile, Gating factors, Activation risk flags, Go/No-Go gates</p>
                </div>
              </div>

              {/* SCF Formula */}
              <div className="bg-slate-900 text-white p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">SCF™</span>
                  <span className="font-semibold">Strategic Confidence Framework</span>
                </div>
                <div className="font-mono text-sm mb-3 bg-slate-800 p-3 rounded">
                  <span className="text-white">SCF</span> = ω<sub>1</sub>(<span className="text-slate-300">SPI</span>) + ω<sub>2</sub>(<span className="text-slate-400">RROI</span>) + ω<sub>3</sub>(<span className="text-slate-300">SEAM</span>) + ω<sub>4</sub>(<span className="text-slate-400">D<sub>consensus</sub></span>)
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-white">Purpose:</strong> Unify all scores + debate consensus into a single "board answer" with explicit rationale.</p>
                  <p><strong className="text-white">Variables:</strong> SPI/RROI/SEAM from above, D = Debate consensus score, ω = Weighting factors</p>
                  <p><strong className="text-white">Debate Input:</strong> Agreement level from 5-persona debate engine (0-100%)</p>
                  <p><strong className="text-white">Output:</strong> Confidence grade (A-F), PROCEED / PAUSE / RE-STRUCTURE recommendation, Explicit rationale</p>
                </div>
              </div>
            </div>
          </div>

          {/* NSIL Architecture */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">2. NSIL (Nexus Strategic Intelligence Layer)</h3>
            <p className="mb-4 text-sm">NSIL is the reasoning layer that wraps around the scoring engines. It transforms user input into a structured strategic case through a five-phase pipeline.</p>
            
            <div className="bg-slate-100 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center flex-1">
                  <div className="text-slate-600 text-lg mb-1">1</div>
                  VALIDATE
                </div>
                <div className="text-slate-400">→</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center flex-1">
                  <div className="text-slate-600 text-lg mb-1">2</div>
                  DEBATE
                </div>
                <div className="text-slate-400">→</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center flex-1">
                  <div className="text-slate-600 text-lg mb-1">3</div>
                  SCORE
                </div>
                <div className="text-slate-400">→</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center flex-1">
                  <div className="text-slate-600 text-lg mb-1">4</div>
                  SYNTHESIZE
                </div>
                <div className="text-slate-400">→</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-300 text-center flex-1">
                  <div className="text-slate-600 text-lg mb-1">5</div>
                  DELIVER
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left font-semibold w-24">Phase</th>
                    <th className="p-3 text-left font-semibold">Algorithm</th>
                    <th className="p-3 text-left font-semibold">Function</th>
                    <th className="p-3 text-left font-semibold">Output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-medium text-slate-700">Validate</td>
                    <td className="p-3 font-mono text-xs bg-slate-50">SATContradictionSolver</td>
                    <td className="p-3 text-xs">DPLL algorithm checks inputs for logical inconsistencies (e.g., "low risk + high ROI + fast timeline" = impossible)</td>
                    <td className="p-3 text-xs">Contradiction flags, missing field alerts, warning generation</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td className="p-3 font-medium text-slate-700">Debate</td>
                    <td className="p-3 font-mono text-xs bg-white">BayesianDebateEngine</td>
                    <td className="p-3 text-xs">5-persona Bayesian debate with belief updating. Early stopping at 75% consensus threshold. Typically stops in 2-3 rounds.</td>
                    <td className="p-3 text-xs">Consensus score, disagreement points, evidence attachments</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-medium text-slate-700">Score</td>
                    <td className="p-3 font-mono text-xs bg-slate-50">DAGScheduler</td>
                    <td className="p-3 text-xs">Directed Acyclic Graph executes 21 formulas in 4 parallel levels with memoization cache.</td>
                    <td className="p-3 text-xs">Scores, grades, drivers, pressure points for all indices</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td className="p-3 font-medium text-slate-700">Synthesize</td>
                    <td className="p-3 font-mono text-xs bg-white">DecisionTreeSynthesizer</td>
                    <td className="p-3 text-xs">Selects optimal report template from 8 types based on scores and user context. 13 section types available.</td>
                    <td className="p-3 text-xs">Structured recommendations, template selection, section ordering</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-medium text-slate-700">Deliver</td>
                    <td className="p-3 font-mono text-xs bg-slate-50">ReportOrchestrator</td>
                    <td className="p-3 text-xs">Assembles final payload with full provenance chain. Every recommendation traceable to inputs.</td>
                    <td className="p-3 text-xs">Decision-ready deliverables with audit trail</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-Agent Debate */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">3. Multi-Agent Reasoning Framework (5-Persona Debate)</h3>
            <p className="mb-4 text-sm">Five specialist personas evaluate each strategy in parallel to prevent single-thread bias. This is a core innovation—no other system uses adversarial multi-agent debate for strategic validation.</p>
            
            <div className="grid md:grid-cols-5 gap-3 mb-4">
              {[
                { name: "Skeptic", code: "S", color: "bg-slate-700", role: "Finds deal-killers, over-optimism, hidden downside. Stress-tests assumptions.", questions: ["What could go wrong?", "What are we missing?", "Is this too good to be true?"] },
                { name: "Advocate", code: "A", color: "bg-slate-600", role: "Identifies upside, synergies, optionality, value levers. Makes the bull case.", questions: ["What's the upside?", "What synergies exist?", "How can we maximize value?"] },
                { name: "Regulator", code: "R", color: "bg-slate-800", role: "Checks legal pathways, sanctions risk, ethical constraints. Compliance lens.", questions: ["Is this legal?", "What approvals needed?", "Are there sanctions risks?"] },
                { name: "Accountant", code: "F", color: "bg-slate-500", role: "Validates cash flow logic, margins, economic durability. Numbers reality check.", questions: ["Do the numbers work?", "What's the margin?", "When do we break even?"] },
                { name: "Operator", code: "O", color: "bg-slate-900", role: "Tests execution feasibility: team, supply chains, infrastructure. Can we actually do this?", questions: ["Can we execute?", "Do we have the team?", "What's the infrastructure?"] },
              ].map((persona) => (
                <div key={persona.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className={`w-12 h-12 ${persona.color} text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold`}>
                    {persona.code}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-center mb-2">{persona.name}</h4>
                  <p className="text-xs text-slate-600 mb-2">{persona.role}</p>
                  <div className="text-xs text-slate-500 italic">
                    {persona.questions.map((q, i) => (
                      <div key={i}>"{q}"</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-100 p-4 rounded-lg text-sm">
              <h4 className="font-semibold text-slate-900 mb-2">Debate Process:</h4>
              <ol className="text-xs text-slate-700 space-y-1 list-decimal list-inside">
                <li>Each persona independently evaluates the strategy and attaches evidence</li>
                <li>Bayesian belief network updates confidence based on persona votes</li>
                <li>Disagreements are preserved as explicit decision points (no fake certainty)</li>
                <li>Early stopping triggers when 75% consensus reached (typically 2-3 rounds vs 5)</li>
                <li>Final synthesis includes: Agreements → High-confidence recommendations, Disagreements → Flagged for human judgment</li>
              </ol>
            </div>
          </div>

          {/* 16 Derivative Indices */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">4. 16 Derivative Indices (Specialist Formulas)</h3>
            <p className="mb-4 text-sm">These indices extend the 5 primary engines and explain <em>why</em> the strategy is strong/weak, and what to fix. Total: 5 + 16 = 21 formulas.</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Strategic Indices</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">BARNA</span><span className="text-slate-600">Entry barrier strength (regulatory, capital, cultural)</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">NVI</span><span className="text-slate-600">Network value & ecosystem connectivity</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">CRI</span><span className="text-slate-600">Country-level political/economic risk</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">FRS</span><span className="text-slate-600">Flywheel/compounding growth potential</span></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Operational Indices</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">CAP</span><span className="text-slate-600">Capability assessment profile</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">AGI</span><span className="text-slate-600">Activation velocity & gating factors</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">VCI</span><span className="text-slate-600">Value creation & synergy potential</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">ATI</span><span className="text-slate-600">Asset/IP transfer complexity</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">ESI</span><span className="text-slate-600">Ecosystem strength (suppliers, talent)</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">ISI</span><span className="text-slate-600">Integration speed post-deal</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">OSI</span><span className="text-slate-600">Operational synergy potential</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">TCO</span><span className="text-slate-600">Total cost of ownership (lifecycle)</span></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Risk Indices</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">PRI</span><span className="text-slate-600">Political stability & sovereign risk</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">RNI</span><span className="text-slate-600">Regulatory navigation complexity</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">SRA</span><span className="text-slate-600">Strategic risk profile (market/timing)</span></div>
                  <div className="flex justify-between"><span className="font-mono font-bold text-slate-700">IDV</span><span className="text-slate-600">Investment default variance (fragility)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Performance */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">5. Algorithm Performance & Optimization</h3>
            
            <div className="bg-slate-900 text-white p-6 rounded-lg mb-4">
              <div className="grid md:grid-cols-4 gap-4 text-center mb-4">
                <div>
                  <div className="text-3xl font-bold text-white">1-3s</div>
                  <div className="text-xs text-slate-400">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">5-15x</div>
                  <div className="text-xs text-slate-400">Speedup vs Legacy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">O(log n)</div>
                  <div className="text-xs text-slate-400">Vector Memory</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">4 Levels</div>
                  <div className="text-xs text-slate-400">DAG Parallelism</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left font-semibold">Algorithm Component</th>
                    <th className="p-3 text-left font-semibold">Purpose</th>
                    <th className="p-3 text-left font-semibold">Speed Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-mono text-xs">VectorMemoryIndex</td>
                    <td className="p-3 text-xs">O(log n) similarity search via LSH + cosine similarity</td>
                    <td className="p-3 text-xs font-semibold text-slate-700">10-50x faster retrieval</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td className="p-3 font-mono text-xs">BayesianDebateEngine</td>
                    <td className="p-3 text-xs">Early stopping at 75% consensus (2-3 rounds vs 5)</td>
                    <td className="p-3 text-xs font-semibold text-slate-700">2-3x faster debate</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-mono text-xs">DAGScheduler</td>
                    <td className="p-3 text-xs">Parallel formula execution with memoization cache</td>
                    <td className="p-3 text-xs font-semibold text-slate-700">3-5x faster scoring</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td className="p-3 font-mono text-xs">LazyEvalEngine</td>
                    <td className="p-3 text-xs">On-demand derivative index computation</td>
                    <td className="p-3 text-xs font-semibold text-slate-700">2-4x resource savings</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-mono text-xs">GradientRankingEngine</td>
                    <td className="p-3 text-xs">Learning-to-rank for case relevance with online updates</td>
                    <td className="p-3 text-xs font-semibold text-slate-700">2-3x better relevance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">DAG Formula Execution Order</h4>
              <div className="font-mono text-xs text-slate-700 space-y-1">
                <div><span className="text-slate-600 font-semibold">Level 0:</span> PRI, CRI, BARNA, TCO (independent - run in parallel)</div>
                <div><span className="text-slate-600 font-semibold">Level 1:</span> SPI, RROI, SEAM (depend on Level 0)</div>
                <div><span className="text-slate-600 font-semibold">Level 2:</span> IVAS, SCF (depend on Level 1)</div>
                <div><span className="text-slate-600 font-semibold">Level 3:</span> 12 remaining derivative indices (depend on Level 2)</div>
              </div>
            </div>
          </div>

          {/* Provenance & Audit */}
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-600" />
              Provenance & Audit Trail
            </h3>
            <p className="text-sm text-slate-700 mb-3">
              Every recommendation in BWGA Intelligence AI is fully traceable. The system maintains a complete provenance chain from user input → formula computation → debate evidence → final recommendation.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Input Provenance</div>
                <p className="text-slate-600">Every data point tagged with source, timestamp, and confidence level</p>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Computation Trace</div>
                <p className="text-slate-600">Each formula shows inputs used, weights applied, intermediate values</p>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Debate Evidence</div>
                <p className="text-slate-600">Persona arguments preserved with supporting data and vote rationale</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* TESTING MODAL - 12 Sample Reports Archive */}
      <Modal isOpen={activeModal === 'testing'} onClose={() => setActiveModal(null)} title="Training Archive: 12 Sample Intelligence Reports">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-slate-900 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Real Examples: What the 10-Step Protocol Produces</h3>
            <p className="text-slate-300 text-sm mb-4">
              These 12 reports were generated during system development, demonstrating exactly what you'll receive after 
              completing the <strong className="text-white">10-Step Intelligence Protocol</strong>. Each one applies the full 
              21-formula scoring suite and 5-persona debate engine to produce board-ready strategic intelligence.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">How These Were Created</div>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-700 rounded px-2 py-1 text-white font-semibold">1</span>
                  <span>10-Step Protocol Completed</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-700 rounded px-2 py-1 text-white font-semibold">2</span>
                  <span>21 Algorithms Applied</span>
                </div>
                <span className="text-slate-500">→</span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-700 rounded px-2 py-1 text-white font-semibold">3</span>
                  <span>Full Report Generated</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-center text-sm">
              <div className="bg-slate-800 px-3 py-2 rounded"><span className="text-xl font-bold block">12</span>Full Reports</div>
              <div className="bg-slate-800 px-3 py-2 rounded"><span className="text-xl font-bold block">8</span>Industries</div>
              <div className="bg-slate-800 px-3 py-2 rounded"><span className="text-xl font-bold block">6</span>Regions</div>
              <div className="bg-slate-800 px-3 py-2 rounded"><span className="text-xl font-bold block">21</span>Formulas Applied</div>
            </div>
          </div>

          {/* Letter of Intent - Ice Breaker */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-slate-900">Partnership Outreach Letter Template</h4>
                <p className="text-sm text-slate-600">Generated alongside each report to facilitate initial partner engagement</p>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded-lg p-4 font-mono text-xs text-slate-700 leading-relaxed">
              <div className="mb-3 text-slate-500">[ORGANIZATION LETTERHEAD]</div>
              <div className="mb-2"><strong>RE: Strategic Partnership Inquiry</strong></div>
              <p className="mb-2">Dear [Partner Name],</p>
              <p className="mb-2">
                [Organization] is exploring strategic opportunities in [Target Region] within the [Industry] sector. 
                Based on our analysis using BWGA Intelligence AI's proprietary scoring framework, we have identified 
                your organization as a high-compatibility partner (SEAM™ Score: [XX]/100).
              </p>
              <p className="mb-2">
                We would welcome the opportunity to discuss potential collaboration models including [JV/Alliance/Investment]. 
                Our initial assessment indicates mutual value creation potential with projected [ROI/Synergy metrics].
              </p>
              <p className="mb-2">
                Please find attached our Strategic Intelligence Brief for your review. We would be pleased to arrange 
                an introductory call at your earliest convenience.
              </p>
              <p className="mt-3">Respectfully,<br/>[Signatory]<br/>[Title]</p>
            </div>
          </div>

          {/* 12 Sample Reports Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">12 Training Reports — Full Strategic Dossiers</h3>
              <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                <strong>Note:</strong> Click any report to view full one-page document
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Each report demonstrates the system's ability to produce comprehensive strategic intelligence. 
              Reports can be generated at varying lengths — from 1-2 page executive briefs to 50+ page comprehensive dossiers 
              based on client requirements.
            </p>
            <div className="space-y-4">
              
              {/* Report 1: Australian AgriTech → Vietnam */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 1 ? null : 1)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #1: Market Entry — AgriTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SEAM™: 89/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 1 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                
                {/* Collapsed Preview */}
                {expandedReport !== 1 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">GreenHarvest Technologies Pty Ltd</div>
                      <div className="text-xs text-slate-500">Australia • Private • AUD $45M Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Ho Chi Minh City, Vietnam</div>
                      <div className="text-xs text-slate-500">Joint Venture • $15M Investment</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Market Entry + JV Formation</div>
                      <div className="text-xs text-slate-500">12-18 Month Timeline</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Vietnam's AgriTech market ($1.8B → $3.2B by 2027, CAGR 21.4%) presents compelling expansion opportunity. 
                      Recommended JV partner: Vietnam Agricultural Supply Co. (VASCO) — 12 provinces, $38M revenue, MARD relationships.
                      Monte Carlo simulation (10,000 iterations): P50 IRR 18.4%, break-even Month 28, 8% probability of loss.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">82</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">18.4%</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">76</div><div className="text-slate-400">IVAS™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">78</div><div className="text-slate-400">FRS™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> World Bank Open Data API, Vietnam General Statistics Office, MARD (Ministry of Agriculture), 
                    VCCI (Vietnam Chamber of Commerce), IMF Country Data, World Economic Forum Global Competitiveness Index
                  </div>
                </div>
                )}
                
                {/* EXPANDED FULL REPORT */}
                {expandedReport === 1 && (
                <div className="p-6 bg-white">
                  {/* Report Header */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                        <p className="text-slate-600">Market Entry Analysis: Vietnam AgriTech Sector</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-bold text-slate-900">BWGA Intelligence AI</div>
                        <div className="text-slate-500">Report Generated: {new Date().toLocaleDateString()}</div>
                        <div className="text-slate-500">Classification: CONFIDENTIAL</div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">
                      GreenHarvest Technologies Pty Ltd, an Australian agricultural technology company with AUD $45M in annual revenue, 
                      seeks to establish a strategic presence in Vietnam's rapidly expanding AgriTech market through a joint venture 
                      formation with a local distribution partner.
                    </p>
                    <p className="text-sm text-slate-700 mb-3">
                      Our analysis indicates Vietnam represents a <strong>high-opportunity market</strong> with the AgriTech sector 
                      projected to grow from $1.8B (2024) to $3.2B by 2027, representing a CAGR of 21.4%. The recommended partner, 
                      Vietnam Agricultural Supply Co. (VASCO), demonstrates strong strategic alignment with a SEAM™ score of 89/100.
                    </p>
                    <div className="bg-slate-100 rounded-lg p-4 mt-4">
                      <div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED</div>
                      <p className="text-sm text-slate-600">
                        The opportunity meets all strategic criteria with favorable risk-adjusted returns. Proceed to Phase 2: 
                        Partner Due Diligence and Term Sheet negotiation.
                      </p>
                    </div>
                  </div>

                  {/* Score Dashboard */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORE DASHBOARD</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">82</div>
                        <div className="text-xs text-slate-400">SPI™ Score</div>
                        <div className="text-xs text-slate-300 mt-1">Strategic Priority Index</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">89</div>
                        <div className="text-xs text-slate-400">SEAM™ Score</div>
                        <div className="text-xs text-slate-300 mt-1">Partner Alignment</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">18.4%</div>
                        <div className="text-xs text-slate-400">RROI™</div>
                        <div className="text-xs text-slate-300 mt-1">Risk-Adjusted Return</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">76</div>
                        <div className="text-xs text-slate-400">IVAS™ Score</div>
                        <div className="text-xs text-slate-300 mt-1">Implementation Viability</div>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">MARKET ANALYSIS</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Market Size & Growth</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>• Current Market Size: $1.8B (2024)</li>
                          <li>• Projected Size: $3.2B (2027)</li>
                          <li>• CAGR: 21.4%</li>
                          <li>• TAM Addressable: $420M</li>
                          <li>• SAM Realistic: $85M</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Competitive Landscape</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>• Fragmented market, no dominant player</li>
                          <li>• Top 5 players hold 23% market share</li>
                          <li>• High demand for precision agriculture</li>
                          <li>• Government subsidies for AgriTech adoption</li>
                          <li>• Limited competition from Western firms</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Partner Assessment */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">PARTNER ASSESSMENT: VASCO</h3>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="font-semibold text-slate-700">Company Profile</div>
                          <div className="text-slate-600 mt-1">
                            Vietnam Agricultural Supply Co.<br/>
                            Revenue: $38M<br/>
                            Employees: 450<br/>
                            Founded: 1998
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700">Network Reach</div>
                          <div className="text-slate-600 mt-1">
                            Coverage: 12 provinces<br/>
                            Distribution Points: 340+<br/>
                            Farmer Relationships: 28,000+<br/>
                            MARD Connections: Strong
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700">Strategic Fit</div>
                          <div className="text-slate-600 mt-1">
                            SEAM™ Score: 89/100<br/>
                            Cultural Alignment: High<br/>
                            Technology Readiness: Moderate<br/>
                            Financial Stability: Strong
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Projections */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">FINANCIAL PROJECTIONS</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Investment Structure</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>• Total Investment: $15M</li>
                          <li>• GreenHarvest Equity: $9M (60%)</li>
                          <li>• VASCO Equity: $6M (40%)</li>
                          <li>• Working Capital Reserve: $2M</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Return Analysis</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>• P50 IRR: 18.4%</li>
                          <li>• Break-even: Month 28</li>
                          <li>• 5-Year NPV: $12.3M</li>
                          <li>• Probability of Loss: 8%</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">RISK ASSESSMENT</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                        <span className="font-semibold text-yellow-700 w-24">MEDIUM</span>
                        <span className="text-slate-600">Regulatory approval timeline uncertainty (MARD licensing 4-8 months)</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                        <span className="font-semibold text-green-700 w-24">LOW</span>
                        <span className="text-slate-600">Currency risk mitigated by USD invoicing for equipment</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                        <span className="font-semibold text-green-700 w-24">LOW</span>
                        <span className="text-slate-600">Partner financial stability verified through due diligence</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">RECOMMENDED NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300">
                      <li>1. Execute NDA with VASCO (Week 1-2)</li>
                      <li>2. Conduct on-site due diligence visit (Week 3-4)</li>
                      <li>3. Engage local legal counsel for JV structure (Week 4-6)</li>
                      <li>4. Draft Heads of Terms for board approval (Week 6-8)</li>
                      <li>5. Initiate MARD pre-licensing consultation (Week 8-10)</li>
                    </ol>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">
                    Generated by BWGA Intelligence AI • ABN: 55 978 113 300 • This report is confidential and intended for internal strategic planning purposes only.
                  </div>
                </div>
                )}
              </div>

              {/* Report 2: Singapore MedTech → Vietnam */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 2 ? null : 2)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #2: Manufacturing Expansion — Medical Devices</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 78/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 2 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                
                {/* Collapsed Preview */}
                {expandedReport !== 2 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">MediTech Solutions Inc.</div>
                      <div className="text-xs text-slate-500">Singapore • Private • $75M Revenue • 320 Employees</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Ho Chi Minh City, Vietnam</div>
                      <div className="text-xs text-slate-500">Greenfield Manufacturing • $15M Investment</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Cost Reduction + Market Entry</div>
                      <div className="text-xs text-slate-500">ASEAN Distribution Hub</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Singapore manufacturing at 90% capacity; labor costs $4,500/month per technician prohibitive for scaling. 
                      Vietnam offers 40-50% cost reduction, 50,000+ engineering graduates annually, and FTA access to ASEAN.
                      Investment structure: $8M factory, $4M partner equity, $2M regulatory, $1M working capital.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">78</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.4x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">72</div><div className="text-slate-400">IVAS™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">85%</div><div className="text-slate-400">SCF™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> Singapore EDB Statistics, Vietnam FDI Agency, World Bank Doing Business Index, 
                    FDA ASEAN Regulatory Database, ILO Labor Cost Data, Vietnam Ministry of Labor
                  </div>
                </div>
                )}
                
                {/* EXPANDED FULL REPORT */}
                {expandedReport === 2 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                        <p className="text-slate-600">Manufacturing Expansion: Vietnam Medical Device Sector</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-bold text-slate-900">BWGA Intelligence AI</div>
                        <div className="text-slate-500">Classification: CONFIDENTIAL</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">
                      MediTech Solutions, a Singapore-based medical device manufacturer, faces critical capacity constraints at 90% utilization 
                      with labor costs of $4,500/month per technician. Vietnam offers a strategic manufacturing base with 40-50% cost reduction, 
                      ASEAN FTA access, and a growing pool of 50,000+ engineering graduates annually.
                    </p>
                    <div className="bg-slate-100 rounded-lg p-4">
                      <div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED WITH CONDITIONS</div>
                      <p className="text-sm text-slate-600">Proceed contingent on successful regulatory pathway validation with Vietnam FDA equivalent.</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">78</div><div className="text-xs">SPI™</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">2.4x</div><div className="text-xs">RROI™</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">72</div><div className="text-xs">IVAS™</div>
                      </div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">85%</div><div className="text-xs">SCF™</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">INVESTMENT STRUCTURE</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div><ul className="space-y-1 text-slate-600"><li>• Factory Construction: $8M</li><li>• Partner Equity: $4M</li><li>• Regulatory Compliance: $2M</li><li>• Working Capital: $1M</li></ul></div>
                      <div><ul className="space-y-1 text-slate-600"><li>• Total Investment: $15M</li><li>• Expected ROI: 2.4x over 5 years</li><li>• Break-even: Month 32</li><li>• Annual Cost Savings: $3.2M</li></ul></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300">
                      <li>1. Engage Vietnam FDA consultant for regulatory pathway</li>
                      <li>2. Site visit to HCMC industrial zones</li>
                      <li>3. Partner identification and due diligence</li>
                    </ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">
                    Generated by BWGA Intelligence AI • ABN: 55 978 113 300
                  </div>
                </div>
                )}
              </div>

              {/* Report 3: US FinTech → EU */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 3 ? null : 3)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #3: Regulatory Expansion — FinTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 71/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 3 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 3 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">PayStream Technologies</div>
                      <div className="text-xs text-slate-500">USA (Delaware) • Series C • $120M Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Dublin, Ireland → EU Passporting</div>
                      <div className="text-xs text-slate-500">Regulatory License • $8M Setup</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">EU Market Access + PSD2 Compliance</div>
                      <div className="text-xs text-slate-500">27-Country Passporting</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Ireland offers optimal EU gateway: 12.5% corporate tax, English-speaking, fintech cluster (Stripe, Fidelity HQ). 
                      Central Bank of Ireland e-money license timeline: 6-12 months. Alternative considered: Lithuania (faster, smaller talent pool).
                      Risk factors: Brexit uncertainty, GDPR compliance costs, ECB regulatory tightening cycle.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">71</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">22.1%</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">68</div><div className="text-slate-400">RNI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">82</div><div className="text-slate-400">NVI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> ECB Regulatory Database, Central Bank of Ireland, EU PSD2 Directive Documentation, 
                    OECD Tax Database, IDA Ireland Investment Data, Eurostat Labor Market Statistics
                  </div>
                </div>
                )}
                {expandedReport === 3 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">EU Market Entry: FinTech Regulatory Expansion via Ireland</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">PayStream Technologies seeks EU market access through Irish regulatory licensing. Ireland offers an optimal gateway with 12.5% corporate tax, established fintech ecosystem (Stripe, Fidelity HQ), and English-speaking workforce. E-money license timeline of 6-12 months via Central Bank of Ireland enables passporting to all 27 EU member states.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED</div><p className="text-sm text-slate-600">Ireland represents optimal EU gateway; begin CBI pre-application engagement.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">71</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">22.1%</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">68</div><div className="text-xs">RNI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">82</div><div className="text-xs">NVI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Engage Irish regulatory counsel and CBI pre-application</li><li>2. GDPR compliance framework development</li><li>3. Dublin office setup and talent acquisition</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 4: Japanese Manufacturer → Mexico */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 4 ? null : 4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #4: Nearshoring — Automotive Components</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 84/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 4 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 4 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">Takahashi Precision Parts K.K.</div>
                      <div className="text-xs text-slate-500">Japan • Public (TSE) • ¥85B Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Monterrey, Nuevo León, Mexico</div>
                      <div className="text-xs text-slate-500">Greenfield Factory • $45M Investment</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">USMCA Access + Supply Chain Resilience</div>
                      <div className="text-xs text-slate-500">US OEM Proximity</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Monterrey = "Mexico's Industrial Capital" — 400+ Japanese manufacturers, mature supplier ecosystem, bilingual engineering talent.
                      USMCA Rule of Origin compliance achieved with 75%+ regional content. Logistics: 24hr trucking to Texas OEM plants.
                      Risk: Peso volatility (±12% annual), cartel activity in transit corridors (mitigated by established security protocols).
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">84</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.8x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">91</div><div className="text-slate-400">ESI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">76</div><div className="text-slate-400">PRI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> USMCA Text & Annex 4-B, INEGI Mexico, JETRO (Japan External Trade), 
                    Banxico Economic Data, US CBP Trade Statistics, OICA Automotive Production Data
                  </div>
                </div>
                )}
                {expandedReport === 4 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Nearshoring Strategy: Mexico Automotive Manufacturing</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">Takahashi Precision Parts seeks USMCA-compliant manufacturing base in Monterrey, Mexico's industrial capital with 400+ Japanese manufacturers already established. The mature supplier ecosystem, bilingual engineering talent, and 24-hour trucking access to Texas OEM plants provide compelling strategic advantages for supply chain resilience.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: STRONG PROCEED</div><p className="text-sm text-slate-600">Monterrey offers optimal nearshoring location with proven Japanese manufacturing cluster.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">84</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">2.8x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">91</div><div className="text-xs">ESI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">76</div><div className="text-xs">PRI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Industrial park site selection (FINSA/PIMSA)</li><li>2. USMCA Rule of Origin compliance mapping</li><li>3. Engage JETRO Mexico for investment support</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 5: German Renewables → Saudi Arabia */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 5 ? null : 5)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #5: Government Partnership — Renewable Energy</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 76/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 5 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 5 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">SolarWind GmbH</div>
                      <div className="text-xs text-slate-500">Germany • Private (Family) • €320M Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">NEOM / Riyadh, Saudi Arabia</div>
                      <div className="text-xs text-slate-500">PPP Contract • $200M+ Project Value</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Vision 2030 Alignment + Tech Transfer</div>
                      <div className="text-xs text-slate-500">Hydrogen Production</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Saudi Vision 2030 targets 50% renewable by 2030 (from 0.3% today). NEOM green hydrogen project = $5B opportunity.
                      Required: Local partner (51% Saudi ownership for PPP), technology transfer agreement, Saudization employment quotas.
                      SEAM™ partner match: ACWA Power (84/100 fit), Public Investment Fund subsidiaries.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">76</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">3.2x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">62</div><div className="text-slate-400">PRI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">88</div><div className="text-slate-400">VCI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> Saudi Vision 2030 Official Documents, MISA (Ministry of Investment), IRENA Renewable Capacity Statistics,
                    PIF Annual Reports, NEOM Project Announcements, IEA World Energy Outlook
                  </div>
                </div>
                )}
                {expandedReport === 5 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Vision 2030 Partnership: Saudi Arabia Renewable Energy</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">SolarWind GmbH targets Saudi Arabia's Vision 2030 renewable energy transformation, which aims to achieve 50% renewable capacity by 2030 from a current 0.3%. The NEOM green hydrogen project represents a $5B+ opportunity. Entry requires local partnership (51% Saudi ownership for PPP), technology transfer agreements, and compliance with Saudization employment quotas.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED WITH CONDITIONS</div><p className="text-sm text-slate-600">High opportunity but complex entry requirements; engage ACWA Power (SEAM™ 84/100) for partnership.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">76</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">3.2x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">62</div><div className="text-xs">PRI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">88</div><div className="text-xs">VCI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Initiate ACWA Power partnership discussions</li><li>2. Develop technology transfer framework</li><li>3. Engage MISA for investment licensing</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 6: UK EdTech → India */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 6 ? null : 6)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #6: Market Expansion — EdTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 81/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 6 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 6 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">LearnPath Digital Ltd</div>
                      <div className="text-xs text-slate-500">UK • Series B • £28M Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Bangalore / Mumbai, India</div>
                      <div className="text-xs text-slate-500">Acquisition + Organic • $12M Budget</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">User Base Acquisition + Content Localization</div>
                      <div className="text-xs text-slate-500">K-12 + Test Prep Segments</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      India EdTech: $6.3B market, 32% CAGR, 300M students. Post-COVID digital adoption sustained at 78%.
                      Acquisition targets evaluated: TestBook (test prep, 15M users), Vedantu (live tutoring), Unacademy (exam prep).
                      Recommended approach: Acquire regional player + build vernacular content team (Hindi, Tamil, Telugu priority).
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">81</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">4.1x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">94</div><div className="text-slate-400">FRS™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">79</div><div className="text-slate-400">NVI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> IBEF India Education Sector Reports, RedSeer Consulting EdTech Analysis, 
                    NASSCOM Digital Education Study, Ministry of Education AISHE Data, Tracxn Funding Database
                  </div>
                </div>
                )}
                {expandedReport === 6 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">India EdTech Market Entry: Acquisition Strategy</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">India's EdTech market ($6.3B, 32% CAGR) serves 300M students with sustained 78% digital adoption post-COVID. LearnPath Digital should pursue regional acquisition combined with vernacular content development. Priority targets include TestBook (15M users, test prep), with vernacular localization in Hindi, Tamil, and Telugu as key differentiator.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: STRONG PROCEED</div><p className="text-sm text-slate-600">High-growth market with clear acquisition targets; execute vernacular content strategy.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">81</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">4.1x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">94</div><div className="text-xs">FRS™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">79</div><div className="text-xs">NVI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Engage M&A advisors for target outreach</li><li>2. Conduct commercial due diligence on TestBook</li><li>3. Build vernacular content team in Bangalore</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 7: Canadian Mining → Chile */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 7 ? null : 7)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #7: Resource Investment — Lithium Mining</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 69/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 7 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 7 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">Northern Minerals Corp</div>
                      <div className="text-xs text-slate-500">Canada (TSX) • Public • CAD $890M Market Cap</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Atacama Region, Chile</div>
                      <div className="text-xs text-slate-500">Concession Acquisition • $65M Investment</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Battery Supply Chain Integration</div>
                      <div className="text-xs text-slate-500">EV Manufacturer Offtake Agreements</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Chile holds 52% of global lithium reserves. New royalty framework (2023) increases state take to 40% above $10K/ton.
                      Community relations critical: Atacameño indigenous consultation required per ILO 169. Water usage under SEIA scrutiny.
                      Comparable: SQM-Albemarle model = government partnership with private operation. Timeline: 3-5 years to production.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">69</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.1x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">58</div><div className="text-slate-400">PRI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">72</div><div className="text-slate-400">CRI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> USGS Mineral Commodity Summaries, Chile Mining Ministry, COCHILCO Statistics, 
                    ILO Convention 169 Guidelines, S&P Global Market Intelligence, Benchmark Mineral Intelligence
                  </div>
                </div>
                )}
                {expandedReport === 7 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Lithium Concession: Chile Atacama Region Investment</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">Chile holds 52% of global lithium reserves, critical for EV battery supply chains. The 2023 royalty framework increases government take to 40% above $10K/ton, requiring careful financial modeling. Indigenous consultation (Atacameño communities per ILO 169) and water usage (SEIA environmental review) are critical path items. Timeline to production: 3-5 years.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED WITH CAUTION</div><p className="text-sm text-slate-600">High strategic value but complex regulatory and community engagement requirements.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">69</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">2.1x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">58</div><div className="text-xs">PRI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">72</div><div className="text-xs">CRI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Engage indigenous community liaison specialists</li><li>2. Commission SEIA environmental pre-assessment</li><li>3. Model 40% royalty impact on project economics</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 8: Swiss Pharma → Singapore */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 8 ? null : 8)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #8: R&D Hub Establishment — Pharmaceuticals</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 88/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 8 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 8 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">Helvetica BioSciences AG</div>
                      <div className="text-xs text-slate-500">Switzerland • Public (SIX) • CHF 4.2B Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Biopolis, Singapore</div>
                      <div className="text-xs text-slate-500">R&D Center • $85M over 5 Years</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">APAC Clinical Trials + Talent Access</div>
                      <div className="text-xs text-slate-500">Cell & Gene Therapy Focus</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Singapore Biopolis = purpose-built biomedical hub, A*STAR collaboration opportunities, HSA regulatory fast-track.
                      Tax incentives: Pioneer Certificate (5% tax for 15 years), R&D tax deduction (250%), IP development incentive.
                      Talent pool: NUS, Duke-NUS, Nanyang — 2,000+ PhD graduates annually in life sciences.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">88</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">1.9x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">96</div><div className="text-slate-400">ESI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">94</div><div className="text-slate-400">RNI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> EDB Singapore Investment Reports, A*STAR Annual Reports, HSA Regulatory Guidelines, 
                    OECD R&D Tax Incentives Database, QS World University Rankings Life Sciences, Nature Index
                  </div>
                </div>
                )}
                {expandedReport === 8 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Biopolis R&D Hub: Singapore Life Sciences Investment</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">Singapore's Biopolis offers a purpose-built biomedical research hub with A*STAR collaboration opportunities and HSA regulatory fast-track. Tax incentives include Pioneer Certificate (5% tax for 15 years), 250% R&D tax deduction, and IP development incentive. The talent ecosystem delivers 2,000+ PhD graduates annually from NUS, Duke-NUS, and Nanyang in life sciences.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: STRONG PROCEED</div><p className="text-sm text-slate-600">Premier APAC R&D location with exceptional incentives and talent access.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">88</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">1.9x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">96</div><div className="text-xs">ESI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">94</div><div className="text-xs">RNI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. EDB Singapore investment negotiation</li><li>2. A*STAR collaboration framework</li><li>3. Pioneer Certificate application</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 9: UAE Logistics → East Africa */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 9 ? null : 9)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #9: Infrastructure Investment — Logistics</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 72/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 9 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 9 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">Emirates Global Logistics</div>
                      <div className="text-xs text-slate-500">UAE • Sovereign-Linked • $2.8B Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Mombasa, Kenya + Dar es Salaam, Tanzania</div>
                      <div className="text-xs text-slate-500">Port & Warehouse Concession • $180M</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Belt & Road Alternative + Africa Gateway</div>
                      <div className="text-xs text-slate-500">Corridor Development</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      East Africa trade volume +8.2% CAGR. Mombasa Port handles 1.4M TEUs, feeds Uganda/Rwanda/South Sudan corridor.
                      Competition: DP World (Berbera), China Merchants (Djibouti). AfCFTA implementation = rising intra-Africa trade.
                      Kenya political risk moderate (2027 election cycle), Tanzania more stable under Samia government.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">72</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.6x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">64</div><div className="text-slate-400">PRI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">81</div><div className="text-slate-400">AGI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> UNCTAD Review of Maritime Transport, Kenya Ports Authority, AfDB Infrastructure Index, 
                    World Bank Logistics Performance Index, AfCFTA Secretariat Trade Statistics, BMI Fitch Solutions Country Risk
                  </div>
                </div>
                )}
                {expandedReport === 9 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">East Africa Logistics: Port Infrastructure Investment</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">East Africa trade volume is growing at 8.2% CAGR with Mombasa Port handling 1.4M TEUs annually, serving the Uganda/Rwanda/South Sudan corridor. AfCFTA implementation will drive rising intra-Africa trade. Competition from DP World (Berbera) and China Merchants (Djibouti) requires differentiated service offering. Kenya political risk is moderate (2027 election cycle), while Tanzania offers more stability.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED</div><p className="text-sm text-slate-600">Strategic Africa gateway position; prioritize Tanzania for political stability.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">72</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">2.6x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">64</div><div className="text-xs">PRI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">81</div><div className="text-xs">AGI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Kenya Ports Authority concession negotiations</li><li>2. TPA Tanzania partnership framework</li><li>3. Corridor feasibility study commissioning</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 10: Korean Gaming → Southeast Asia */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 10 ? null : 10)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #10: Market Expansion — Gaming & Entertainment</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 85/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 10 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 10 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">StarPlay Entertainment Co., Ltd</div>
                      <div className="text-xs text-slate-500">South Korea (KOSDAQ) • Public • ₩420B Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Indonesia, Thailand, Philippines</div>
                      <div className="text-xs text-slate-500">Publishing Partnerships • $25M Budget</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">User Acquisition + Localization</div>
                      <div className="text-xs text-slate-500">Mobile-First Strategy</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      SEA gaming market: $8.4B, 270M gamers, mobile 78% of revenue. Indonesia = largest (106M gamers, $2.1B).
                      Localization critical: Bahasa Indonesia, Thai, Tagalog. Payment integration: GoPay, OVO, GCash required.
                      Regulatory: Indonesia content restrictions (religious/cultural), Philippines PAGCOR licensing for real-money elements.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">85</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">3.8x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">92</div><div className="text-slate-400">FRS™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">78</div><div className="text-slate-400">NVI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> Newzoo Global Games Market Report, App Annie Mobile Gaming Data, 
                    Sensor Tower Revenue Estimates, KOMINFO Indonesia Regulations, PAGCOR Licensing Guidelines, Google Temasek SEA Economy Report
                  </div>
                </div>
                )}
                {expandedReport === 10 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Southeast Asia Gaming: Mobile Market Expansion</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">The Southeast Asian gaming market ($8.4B, 270M gamers) is mobile-dominant at 78% of revenue. Indonesia represents the largest opportunity with 106M gamers and $2.1B market size. Critical success factors include localization (Bahasa Indonesia, Thai, Tagalog), payment integration (GoPay, OVO, GCash), and regulatory compliance with Indonesia content restrictions and Philippines PAGCOR licensing.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: STRONG PROCEED</div><p className="text-sm text-slate-600">High-growth mobile gaming market; prioritize Indonesia for scale, Thailand for ARPU.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">85</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">3.8x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">92</div><div className="text-xs">FRS™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">78</div><div className="text-xs">NVI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Local publisher partnership (Garena, VNG consideration)</li><li>2. Localization team setup in Jakarta</li><li>3. Payment gateway integration roadmap</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 11: Brazilian Agribusiness → Africa */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 11 ? null : 11)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #11: Technology Transfer — Agribusiness</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 74/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 11 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 11 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">AgroBrasil Tecnologia S.A.</div>
                      <div className="text-xs text-slate-500">Brazil (B3) • Public • BRL 2.1B Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Mozambique, Angola, Nigeria</div>
                      <div className="text-xs text-slate-500">Tech Transfer + Land Lease • $40M Phase 1</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Tropical Agriculture Export + Food Security</div>
                      <div className="text-xs text-slate-500">Soy, Corn, Cotton Systems</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      Brazil's Cerrado transformation model applicable to African savannas. Mozambique's Nacala Corridor priority area.
                      ProSAVANA framework (Japan-Brazil-Mozambique) provides precedent. Land tenure complexity requires government MOU.
                      Portuguese-speaking markets (Mozambique, Angola) reduce cultural friction. Nigeria = largest market but higher risk.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">74</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.3x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">61</div><div className="text-slate-400">PRI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">86</div><div className="text-slate-400">ATI™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> EMBRAPA Technical Papers, FAO Africa Agriculture Statistics, 
                    Mozambique Ministry of Agriculture, JICA ProSAVANA Reports, World Bank Africa Land Governance, IFPRI Food Security Index
                  </div>
                </div>
                )}
                {expandedReport === 11 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">Africa Agribusiness: Brazil Tropical Agriculture Transfer</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">Brazil's Cerrado transformation model is highly applicable to African savannas. Mozambique's Nacala Corridor is the priority area with established ProSAVANA framework (Japan-Brazil-Mozambique) providing precedent. Land tenure complexity requires government-level MOUs. Portuguese-speaking markets (Mozambique, Angola) offer reduced cultural friction, while Nigeria represents largest market with higher risk profile.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED WITH CONDITIONS</div><p className="text-sm text-slate-600">Begin with Mozambique Nacala Corridor; leverage ProSAVANA framework.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">74</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">2.3x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">61</div><div className="text-xs">PRI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">86</div><div className="text-xs">ATI™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Mozambique Ministry of Agriculture engagement</li><li>2. ProSAVANA framework alignment review</li><li>3. Pilot project in Nacala Corridor design</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

              {/* Report 12: Indian IT Services → Middle East */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all">
                <div 
                  className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedReport(expandedReport === 12 ? null : 12)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #12: Government Digital Transformation — IT Services</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 79/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all">
                    {expandedReport === 12 ? '← Close Report' : 'View Full Report →'}
                  </button>
                </div>
                {expandedReport !== 12 && (
                <div className="p-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Organization</span>
                      <div className="font-medium">Nexus Digital Solutions Ltd</div>
                      <div className="text-xs text-slate-500">India (NSE) • Public • INR 8,500Cr Revenue</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Target Region</span>
                      <div className="font-medium">Saudi Arabia, UAE, Qatar</div>
                      <div className="text-xs text-slate-500">Government Contracts • $120M Pipeline</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Strategic Intent</span>
                      <div className="font-medium">Smart City + E-Government Projects</div>
                      <div className="text-xs text-slate-500">Vision 2030 / Qatar 2030 Alignment</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="font-semibold text-slate-700 mb-2">AI Analysis Summary:</div>
                    <p className="text-slate-600 mb-2">
                      GCC government IT spending: $12B annually, +15% CAGR. Nationalization requirements (Saudization, Emiratization) mandate local partnerships.
                      Established players: Wipro, Infosys, TCS have footholds. Differentiation via AI/ML capabilities and sector specialization.
                      Required: Saudi CITC certification, UAE TDRA approvals, security clearances for government projects.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center mt-2">
                      <div className="bg-white rounded p-2"><div className="font-bold">79</div><div className="text-slate-400">SPI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">2.7x</div><div className="text-slate-400">RROI™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">71</div><div className="text-slate-400">BARNA™</div></div>
                      <div className="bg-white rounded p-2"><div className="font-bold">84</div><div className="text-slate-400">CAP™</div></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Data Sources:</strong> IDC Middle East IT Spending Report, Saudi CITC Digital Government Framework, 
                    UAE Smart Government Initiative, Qatar Ministry of Transport & Communications, Gartner GCC Technology Outlook, NASSCOM Industry Reports
                  </div>
                </div>
                )}
                {expandedReport === 12 && (
                <div className="p-6 bg-white">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">STRATEGIC INTELLIGENCE REPORT</h2>
                    <p className="text-slate-600">GCC Government IT: Digital Transformation Partnership</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">EXECUTIVE SUMMARY</h3>
                    <p className="text-sm text-slate-700 mb-3">GCC government IT spending is $12B annually with 15% CAGR growth. Nationalization requirements (Saudization, Emiratization) mandate local partnerships for market access. Competition from Wipro, Infosys, and TCS requires differentiation via AI/ML capabilities and sector specialization. Regulatory requirements include Saudi CITC certification, UAE TDRA approvals, and security clearances for government projects.</p>
                    <div className="bg-slate-100 rounded-lg p-4"><div className="font-bold text-slate-900 mb-2">RECOMMENDATION: PROCEED</div><p className="text-sm text-slate-600">Strong growth market; prioritize local partnership for compliance and access.</p></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3">ALGORITHM SCORES</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">79</div><div className="text-xs">SPI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">2.7x</div><div className="text-xs">RROI™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">71</div><div className="text-xs">BARNA™</div></div>
                      <div className="bg-slate-900 text-white rounded-lg p-4 text-center"><div className="text-3xl font-bold">84</div><div className="text-xs">CAP™</div></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg p-4">
                    <h3 className="font-bold mb-2">NEXT STEPS</h3>
                    <ol className="text-sm space-y-1 text-slate-300"><li>1. Saudi CITC certification application</li><li>2. Local partner identification (51% ownership structure)</li><li>3. AI/ML center of excellence establishment</li></ol>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">Generated by BWGA Intelligence AI • ABN: 55 978 113 300</div>
                </div>
                )}
              </div>

            </div>
          </div>

          {/* System Capabilities Demonstrated */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
            <h4 className="font-bold text-slate-900 mb-3">Capabilities Demonstrated Across 12 Reports</h4>
            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Industries Covered</div>
                <p className="text-slate-600">AgriTech, MedTech, FinTech, Automotive, Renewables, EdTech, Mining, Pharma, Logistics, Gaming, IT Services</p>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Strategic Intents</div>
                <p className="text-slate-600">Market Entry, JV Formation, M&A, Greenfield, PPP, Technology Transfer, Government Partnership, R&D Establishment</p>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Regions Analyzed</div>
                <p className="text-slate-600">Asia-Pacific, Europe, Middle East, Africa, Latin America, North America — 20+ countries total</p>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Data Sources Used</div>
                <p className="text-slate-600">World Bank, IMF, OECD, UNCTAD, ILO, government ministries, industry bodies, academic research, regulatory databases</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* GLOBAL COVERAGE MODAL */}
      <Modal isOpen={activeModal === 'coverage'} onClose={() => setActiveModal(null)} title="Global Coverage & Industry Expertise">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Worldwide Intelligence Capability</h3>
            <p className="text-slate-300 mb-6">
              BWGA Intelligence AI processes strategic scenarios across every continent, leveraging real-time data feeds 
              from international organizations, government databases, and proprietary research networks. The system can 
              generate one-page executive briefs for rapid assessment, or comprehensive 50+ page strategic dossiers 
              with full due diligence documentation.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold mb-2">195</div>
                <div className="text-slate-400">Countries Supported</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold mb-2">40+</div>
                <div className="text-slate-400">Industries Analyzed</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold mb-2">35+</div>
                <div className="text-slate-400">Entity Types</div>
              </div>
            </div>
          </div>

          {/* Regional Coverage with Photos */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-600" />
              Regional Coverage
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Asia Pacific */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" 
                  alt="Asia Pacific"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Asia-Pacific</h4>
                  <p className="text-xs text-slate-300">Vietnam, Singapore, Japan, Australia, China, Indonesia, Thailand, Philippines, Korea, Malaysia, India</p>
                </div>
              </div>

              {/* Middle East */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" 
                  alt="Middle East"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Middle East & GCC</h4>
                  <p className="text-xs text-slate-300">UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, Oman, Jordan, Egypt, Israel, Turkey</p>
                </div>
              </div>

              {/* Europe */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80" 
                  alt="Europe"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Europe & UK</h4>
                  <p className="text-xs text-slate-300">Ireland, Germany, UK, France, Netherlands, Switzerland, Poland, Spain, Italy, Nordics</p>
                </div>
              </div>

              {/* Africa */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&q=80" 
                  alt="Africa"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Africa</h4>
                  <p className="text-xs text-slate-300">Kenya, Tanzania, Nigeria, South Africa, Mozambique, Angola, Ghana, Rwanda, Ethiopia, Egypt</p>
                </div>
              </div>

              {/* Americas */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?w=400&q=80" 
                  alt="Americas"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Americas</h4>
                  <p className="text-xs text-slate-300">USA, Canada, Mexico, Brazil, Chile, Colombia, Argentina, Peru, Panama</p>
                </div>
              </div>

              {/* Regional Farm/Agriculture Focus */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80" 
                  alt="Agriculture Regions"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Agricultural Regions</h4>
                  <p className="text-xs text-slate-300">Specialized in regional agribusiness corridors, farmland investment, and agricultural technology transfer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Coverage */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-600" />
              Industry Expertise
            </h3>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { name: "Agriculture & AgriTech", icon: "🌾", count: "12 sub-sectors" },
                { name: "Healthcare & MedTech", icon: "🏥", count: "15 sub-sectors" },
                { name: "Financial Services", icon: "💳", count: "18 sub-sectors" },
                { name: "Manufacturing", icon: "🏭", count: "22 sub-sectors" },
                { name: "Energy & Renewables", icon: "⚡", count: "10 sub-sectors" },
                { name: "Education & EdTech", icon: "📚", count: "8 sub-sectors" },
                { name: "Mining & Resources", icon: "⛏️", count: "14 sub-sectors" },
                { name: "Pharmaceuticals", icon: "💊", count: "12 sub-sectors" },
                { name: "Logistics & Transport", icon: "🚚", count: "11 sub-sectors" },
                { name: "Gaming & Entertainment", icon: "🎮", count: "9 sub-sectors" },
                { name: "IT Services & Software", icon: "💻", count: "16 sub-sectors" },
                { name: "Real Estate & Construction", icon: "🏗️", count: "13 sub-sectors" },
              ].map((industry, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-slate-400 transition-all cursor-pointer">
                  <div className="text-2xl mb-2">{industry.icon}</div>
                  <div className="font-semibold text-slate-900 text-sm">{industry.name}</div>
                  <div className="text-xs text-slate-500">{industry.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Workers and Team Photos Section */}
          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">On-the-Ground Intelligence</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80" 
                  alt="Farm workers"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Agricultural Operations</h4>
                  <p className="text-xs text-slate-300">From smallholder cooperatives to industrial agribusiness, our intelligence covers the full spectrum of agricultural investment scenarios.</p>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" 
                  alt="Factory workers"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white">Manufacturing & Industrial</h4>
                  <p className="text-xs text-slate-300">Labor cost analysis, skill availability, infrastructure quality, and supply chain integration for manufacturing investments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Length Options */}
          <div className="border-2 border-slate-300 rounded-xl p-6 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600" />
              Flexible Report Formats
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-slate-900 mb-2">1-2</div>
                <div className="text-sm font-medium text-slate-700">Page Executive Brief</div>
                <p className="text-xs text-slate-500 mt-2">Quick assessment for initial screening. Key scores, go/no-go recommendation.</p>
              </div>
              <div className="text-center p-4 bg-slate-100 rounded-lg border-2 border-slate-400">
                <div className="text-3xl font-bold text-slate-900 mb-2">10-20</div>
                <div className="text-sm font-medium text-slate-700">Page Strategic Report</div>
                <p className="text-xs text-slate-500 mt-2">Standard deliverable. Full scoring, analysis, recommendations, and action plan.</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
                <div className="text-sm font-medium text-slate-700">Page Strategic Dossier</div>
                <p className="text-xs text-slate-500 mt-2">Comprehensive due diligence. Appendices, data tables, risk matrices, implementation roadmaps.</p>
              </div>
            </div>
          </div>

          {/* CTA to Sample Reports */}
          <div className="text-center">
            <button 
              onClick={() => setActiveModal('testing')} 
              className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all inline-flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View 12 Sample Reports
            </button>
          </div>
        </div>
      </Modal>

      {/* Protocol Detail Modal */}
      {protocolDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={() => setProtocolDetail(null)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold">{protocolDetail.num}</span>
                <h2 className="text-xl font-bold text-slate-900">{protocolDetail.title}</h2>
              </div>
              <button onClick={() => setProtocolDetail(null)} className="text-slate-500 hover:text-slate-900 transition-colors p-2 hover:bg-slate-200 rounded-lg">
                <X size={24} />
              </button>
            </header>
            <main className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {protocolDetail.details.map((section, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h5 className="font-semibold text-slate-900 text-sm mb-3 uppercase tracking-wide">{section.subtitle}</h5>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </main>
            <footer className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <p className="text-xs text-slate-500">Step {protocolDetail.num} of 10 in the Comprehensive Intake Framework</p>
              <button onClick={() => setProtocolDetail(null)} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all">
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold">BWGA Intelligence AI</span>
                  <p className="text-xs text-slate-400">Strategic Partnership Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                BW Global Advisory is an Australian strategic intelligence firm developing sovereign-grade 
                AI systems for cross-border investment and regional economic development.
              </p>
            </div>
            
            {/* R&D Status */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Development Status</h4>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-2">CURRENT PHASE</p>
                <p className="text-sm text-white font-medium mb-3">Research & Development</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  BW Nexus AI is currently in active R&D phase, operating under Brayden Walls as a registered 
                  Australian sole trader. The platform is being developed for future commercial deployment 
                  to government and enterprise clients.
                </p>
              </div>
            </div>
            
            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Legal & Governance</h4>
              <div className="space-y-2">
                <button onClick={() => setActiveModal('terms')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Terms & Conditions
                </button>
                <button onClick={() => setActiveModal('privacy')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => setActiveModal('ethics')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Ethical AI Framework
                </button>
                <button onClick={() => setActiveModal('architecture')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Technical Documentation
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-400">
                  © 2026 BW Global Advisory. All rights reserved.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Trading as Sole Trader (R&D Phase) | ABN 55 978 113 300 | Melbourne, Australia
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Nexus Intelligence OS v6.0</span>
                <span>•</span>
                <span>NSIL Engine v3.2</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms & Conditions">
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Effective May 2025 | Last Updated January 2026</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Authorized Use & Access</h3>
              <p className="text-slate-600 text-sm">This system is strictly for authorized strategic analysis. Access rights and data depth are calibrated to the user's declared Skill Level. All inputs are processed via secure enterprise gateways. Unlawful data injection is prohibited.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Decision Support & Authority</h3>
              <p className="text-slate-600 text-sm">BW Global Advisory provides insights for informational purposes only. All Nexus OS outputs are probabilistic and advisory in nature. Strategic decisions remain the sole responsibility of the user. No output should be regarded as deterministic, final, or binding.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Data Privacy & Sovereignty</h3>
              <p className="text-slate-600 text-sm">We adhere to GDPR and Australian Privacy Act requirements. Custom operational data and strategic intents are isolated. No user-specific data is used to train public foundation models.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Financial & Operational Models</h3>
              <p className="text-slate-600 text-sm">SCF (Strategic Cash Flow) and IVAS (Investment Viability Assessment) models are simulations based on provided inputs and historical benchmarks. They do not constitute financial advice.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Intellectual Property</h3>
              <p className="text-slate-600 text-sm">All algorithms, formulas, scoring methodologies, and system architecture are the exclusive intellectual property of BW Global Advisory. The 21-formula suite, NSIL architecture, and multi-persona reasoning system are proprietary innovations developed during R&D.</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">BW Global Advisory Privacy Policy</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Collection</h3>
              <p className="text-slate-600 text-sm">We collect only data necessary to fulfill legitimate analytical purposes. This includes organizational information, strategic parameters, and market context provided by users during platform interaction.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Usage</h3>
              <p className="text-slate-600 text-sm">User data is processed exclusively for generating strategic intelligence outputs. Personal information is not sold or shared for commercial exploitation. All analysis is performed in isolated environments.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Security</h3>
              <p className="text-slate-600 text-sm">All data is stored securely using enterprise-grade encryption. We implement strict access controls and regular security audits to protect user information.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Regulatory Compliance</h3>
              <p className="text-slate-600 text-sm">BWGA operates in alignment with GDPR and Australian Privacy Act requirements. Users have the right to request access to, correction of, or deletion of their personal data.</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Ethics Modal */}
      <Modal isOpen={activeModal === 'ethics'} onClose={() => setActiveModal(null)} title="Ethical AI Framework">
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Governance Doctrine | Version 1.0</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Statement of Commitment</h3>
              <p className="text-slate-600 text-sm">BW Global Advisory is founded upon the principle that artificial intelligence must be developed and deployed with the highest degree of ethical responsibility. We acknowledge that the power of advanced computational systems carries a corresponding obligation to ensure technology is never used in a manner that compromises human rights, privacy, or social stability.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Human Authority</h3>
              <p className="text-slate-600 text-sm">BWGA affirms without qualification that artificial intelligence shall never replace human authority. All outputs produced by the Nexus engine are advisory in nature and exist solely to assist decision-makers. The human user always remains in control.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Transparency & Explainability</h3>
              <p className="text-slate-600 text-sm">Every score, recommendation, and insight is accompanied by its provenance: the specific data points, logical rules, and persona arguments that led to that conclusion. Users can audit the system's reasoning from start to finish.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Adversarial Validation</h3>
              <p className="text-slate-600 text-sm">The platform's adversarial-by-design architecture ensures that strategies are stress-tested and challenged before deployment. The Skeptic persona and Counterfactual Lab actively try to break plans to expose fragile assumptions.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManual;
