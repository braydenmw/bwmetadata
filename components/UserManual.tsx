import React, { useState } from 'react';
import { FileText, Blocks, FlaskConical, X, Users, Globe, Building2, Brain, Shield, BarChart3, FileCheck, Mail, BookOpen, Briefcase, Scale, TrendingUp, Zap, Lock, Eye, Target, CheckCircle2 } from 'lucide-react';

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

// Protocol Section with Hover Popup
const ProtocolSection: React.FC<{ 
  num: number; 
  title: string; 
  desc: string; 
  fullDetails: { subtitle: string; items: string[] }[];
}> = ({ num, title, desc, fullDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 transition-all cursor-pointer h-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">{num}</span>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
      {isHovered && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-slate-950 text-white p-6 rounded-xl shadow-2xl w-80 max-h-[70vh] overflow-y-auto pointer-events-auto">
            <h4 className="font-semibold text-white mb-4 text-base border-b border-slate-700 pb-3">Step {num}: {title}</h4>
            <div className="space-y-4">
              {fullDetails.map((section, idx) => (
                <div key={idx}>
                  <h5 className="font-medium text-slate-200 text-xs mb-2 uppercase tracking-wide">{section.subtitle}</h5>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Report Item Component with Full Page Preview
const ReportItem: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  fullReport: {
    executive: string;
    sections: { title: string; content: string }[];
    metrics?: { label: string; value: string }[];
  }
}> = ({ title, description, icon, fullReport }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-400 transition-all cursor-pointer">
        <div className="text-slate-600 mt-1">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Eye className="w-3 h-3" />
          <span>Preview</span>
        </div>
      </div>
      {isHovered && (
        <div className="absolute left-full top-0 ml-4 w-[480px] bg-white text-slate-900 p-6 rounded-lg shadow-2xl z-50 border border-slate-300 max-h-[80vh] overflow-y-auto">
          <div className="border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-600">{icon}</div>
              <h4 className="font-semibold text-lg text-slate-900">{title}</h4>
            </div>
            <p className="text-xs text-slate-400">BWGA Intelligence AI — Generated Report Preview</p>
          </div>
          
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-xs text-slate-700 mb-1">Executive Summary</h5>
            <p className="text-xs text-slate-600">{fullReport.executive}</p>
          </div>
          
          {fullReport.metrics && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {fullReport.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-100 p-2 rounded text-center">
                  <div className="text-lg font-semibold text-slate-900">{m.value}</div>
                  <div className="text-xs text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {fullReport.sections.map((section, idx) => (
            <div key={idx} className="mb-3">
              <h5 className="font-semibold text-xs text-slate-800 mb-1">{section.title}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">{section.content}</p>
            </div>
          ))}
          
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-400">
            Report ID: BWGA-PREVIEW-001 | Generated by NSIL Engine v3.2
          </div>
        </div>
      )}
    </div>
  );
};

const UserManual: React.FC<UserManualProps> = ({ onLaunchOS }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

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
              Regional investment is complex.<br/>
              <span className="font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">We make it clear.</span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed max-w-xl">
              An enterprise-grade decision-support system that transforms complex partnership opportunities into structured, actionable intelligence for regional cities, investment attraction agencies, and global enterprises.
            </p>
          </div>
        </div>
      </header>

      {/* About BWGA Introduction */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light text-slate-900 mb-8 text-center">About BW Global Advisory</h2>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              <strong className="text-slate-900">Brayden Walls Global Advisory (BWGA)</strong> is an Australian-based strategic intelligence firm 
              specializing in cross-border investment, regional economic development, and high-stakes partnership structuring.
            </p>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Recognizing that traditional strategic analysis tools were failing decision-makers—producing shallow insights, 
              ignoring ecosystem complexity, and lacking the rigor required for consequential decisions—BWGA developed 
              <strong className="text-slate-900"> BW Nexus AI</strong>: a first-of-its-kind Strategic Intelligence and Execution Platform.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              The platform combines the analytical depth of a top-tier consulting firm with the productive power of a 
              high-end document automation factory. At its core is <strong className="text-slate-900">NSIL (Nexus Strategic Intelligence Layer)</strong>—a 
              five-layer autonomous reasoning architecture powered by 21 proprietary mathematical formulas, five adversarial 
              AI personas, and Monte Carlo simulation capabilities.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Unlike passive dashboards that simply present data, BW Nexus AI actively reasons, debates, and stress-tests 
              every strategic assumption. It challenges your thinking before the market does, producing battle-tested 
              recommendations with full provenance and explainability.
            </p>

            <div className="bg-slate-50 rounded-xl p-8 my-8 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Who This Platform Serves</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                BW Nexus AI is designed for professionals and organizations where the cost of a wrong decision is measured 
                in millions—or in national consequence:
              </p>
              <ul className="text-slate-600 space-y-2">
                <li><strong className="text-slate-800">Regional Development Agencies</strong> — attracting global investment to local communities</li>
                <li><strong className="text-slate-800">Government Departments</strong> — screening FDI, modeling policy impact, de-risking PPPs</li>
                <li><strong className="text-slate-800">Global Enterprises</strong> — evaluating M&A targets, market entry, and joint ventures</li>
                <li><strong className="text-slate-800">Advisory Firms</strong> — augmenting due diligence with sovereign-grade analytical depth</li>
              </ul>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              The platform's Document Factory can instantly generate over 200 document types and 150 letter templates—from 
              Letters of Intent to full financial models—translating validated strategy directly into execution-ready 
              deliverables. This is not incremental improvement. It is a paradigm shift in how high-stakes decisions are made.
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
            <span className="text-slate-500 font-medium">Hover over each step</span> to see the detailed data requirements.
          </p>
          
          {/* Protocol Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <ProtocolSection 
              num={1} 
              title="Identity & Foundation" 
              desc="Establish organizational credibility, legal structure, and competitive positioning."
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
                <span className="text-slate-400 uppercase tracking-widest text-xs">SYSTEM OUTPUTS</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Factory & Training Archive</h3>
              <p className="text-slate-300 text-sm mb-6">
                The platform auto-generates professional deliverables from your live model data. During development, 
                12 comprehensive strategic scenarios were processed across 8 industries and 6 regions.
              </p>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xl font-bold">200+</div>
                  <div className="text-xs text-slate-400">Documents</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xl font-bold">150+</div>
                  <div className="text-xs text-slate-400">Templates</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xl font-bold">12</div>
                  <div className="text-xs text-slate-400">Reports</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xl font-bold">21</div>
                  <div className="text-xs text-slate-400">Formulas</div>
                </div>
              </div>
              <button onClick={() => setActiveModal('outputs')} className="mt-6 px-5 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Strategic Outputs & Reports
              </button>
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

      {/* OUTPUTS MODAL */}
      <Modal isOpen={activeModal === 'outputs'} onClose={() => setActiveModal(null)} title="Strategic Outputs & Reports">
        <div className="space-y-8">
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              Strategic Intelligence Reports
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Hover over any report to see a full-page preview of what the generated document contains, including structure, metrics, and sample content.
            </p>
            <div className="space-y-3">
              <ReportItem 
                title="Executive Summary Report" 
                description="Board-ready strategic overview with key recommendations"
                icon={<FileCheck className="w-5 h-5" />}
                fullReport={{
                  executive: "This partnership opportunity demonstrates STRONG potential with an SPI™ score of 78/100. The alignment between organizational capabilities and market opportunity supports a PROCEED recommendation with targeted risk mitigation.",
                  metrics: [
                    { label: "SPI™ Score", value: "78/100" },
                    { label: "RROI™", value: "2.4x" },
                    { label: "Risk Grade", value: "B+" }
                  ],
                  sections: [
                    { title: "Strategic Opportunity Assessment", content: "The target market presents a $2.4B TAM with 12% CAGR. Entry barriers are moderate (BARNA: 6.2/10) with regulatory pathways well-established. Partner alignment score of 8.1/10 indicates strong cultural and strategic fit." },
                    { title: "Key Drivers (Positive)", content: "• Strong partner financial stability (A- credit rating) • Complementary technology portfolios • Favorable regulatory environment • Growing market demand in target segment" },
                    { title: "Pressure Points (Risks)", content: "• Currency volatility in target region (CRI: 5.8) • Key person dependency on partner side • 18-month integration timeline may face delays • Competitive response from incumbent players" },
                    { title: "Recommendation", content: "PROCEED with Phase 1 due diligence. Allocate $150K for detailed market validation. Establish steering committee within 30 days. Critical decision gate at Month 3." }
                  ]
                }}
              />
              <ReportItem 
                title="Market Analysis & Dossier" 
                description="Comprehensive market intelligence and competitive landscape"
                icon={<Globe className="w-5 h-5" />}
                fullReport={{
                  executive: "Target market analysis reveals favorable conditions for entry. The Southeast Asian technology sector shows 15.2% CAGR with fragmented competition and supportive government policies. Market timing window estimated at 18-24 months.",
                  metrics: [
                    { label: "TAM", value: "$4.8B" },
                    { label: "SAM", value: "$1.2B" },
                    { label: "SOM", value: "$180M" }
                  ],
                  sections: [
                    { title: "Market Size & Growth", content: "Total Addressable Market of $4.8B growing at 15.2% CAGR. Serviceable market of $1.2B based on geographic and capability constraints. Realistic obtainable market of $180M achievable within 36 months." },
                    { title: "Competitive Landscape", content: "Market led by 3 major players holding 45% combined share. Remaining market highly fragmented across 50+ regional players. Key differentiator opportunity: AI-powered automation (currently underserved)." },
                    { title: "Regulatory Environment", content: "RNI Score: 7.2/10 (Favorable). Data localization requirements in effect. Foreign ownership permitted up to 100% in target sector. Tax incentives available for technology investments." },
                    { title: "Entry Barriers (BARNA Analysis)", content: "Capital requirements: Moderate ($2-5M initial) • Regulatory complexity: Low-Medium • Talent availability: Good • Infrastructure: Strong in tier-1 cities • Cultural adaptation: 6-12 month learning curve" }
                  ]
                }}
              />
              <ReportItem 
                title="Partner Compatibility Assessment" 
                description="Stakeholder alignment and ecosystem analysis"
                icon={<Users className="w-5 h-5" />}
                fullReport={{
                  executive: "SEAM™ analysis indicates HIGH alignment (Score: 8.3/10) between organizations. Strategic objectives, cultural values, and risk tolerance are well-matched. Two potential conflict areas identified with recommended mitigation strategies.",
                  metrics: [
                    { label: "SEAM™", value: "8.3/10" },
                    { label: "NVI", value: "7.8" },
                    { label: "Conflicts", value: "2 Minor" }
                  ],
                  sections: [
                    { title: "Strategic Alignment", content: "Both organizations share expansion objectives in APAC region. Technology roadmaps are complementary with minimal overlap. Growth timelines aligned (3-5 year horizon). Risk appetite profiles match (moderate-aggressive)." },
                    { title: "Cultural Assessment", content: "Decision-making speed: Partner slightly faster (advantage) • Hierarchy: Both moderately flat • Innovation appetite: Both high • Communication style: Compatible with minor adjustments needed" },
                    { title: "Conflict Analysis", content: "Conflict 1: Overlapping customer segment in financial services (5% revenue impact) - Mitigation: Define clear territory boundaries. Conflict 2: Technology IP ownership ambiguity - Mitigation: Establish joint IP framework pre-signing." },
                    { title: "Network Value", content: "Partner brings access to: 340+ enterprise customers, 12 government relationships, 3 strategic technology alliances. Combined network creates 2.3x value multiplier vs standalone entry." }
                  ]
                }}
              />
              <ReportItem 
                title="Financial Projections & ROI" 
                description="Risk-adjusted financial modeling and scenario analysis"
                icon={<TrendingUp className="w-5 h-5" />}
                fullReport={{
                  executive: "Financial modeling projects RROI™ of 2.4x over 5-year horizon with payback in 28 months. Base case NPV of $12.4M at 12% discount rate. Downside protection through phased investment structure.",
                  metrics: [
                    { label: "5Y NPV", value: "$12.4M" },
                    { label: "IRR", value: "34%" },
                    { label: "Payback", value: "28 mo" }
                  ],
                  sections: [
                    { title: "Investment Requirements", content: "Phase 1 (M1-6): $1.5M - Market validation & team setup. Phase 2 (M7-18): $3.2M - Product localization & sales ramp. Phase 3 (M19-36): $2.8M - Scale operations. Total: $7.5M over 36 months." },
                    { title: "Revenue Projections", content: "Year 1: $0.8M (pilot customers) • Year 2: $4.2M (market expansion) • Year 3: $12.5M (scale) • Year 4: $24M (mature) • Year 5: $38M (market leader). Assumes 15% market share of SOM." },
                    { title: "Scenario Analysis", content: "P10 (Pessimistic): IRR 18%, Payback 42mo - Market slower than expected. P50 (Base): IRR 34%, Payback 28mo - Plan execution. P90 (Optimistic): IRR 52%, Payback 18mo - Faster adoption, lower competition." },
                    { title: "Sensitivity Drivers", content: "Top 3 variables affecting returns: 1) Customer acquisition cost (±8% IRR) 2) Pricing power maintenance (±6% IRR) 3) Integration timeline (±4% IRR). Recommend quarterly sensitivity refresh." }
                  ]
                }}
              />
              <ReportItem 
                title="Risk Mitigation Strategy" 
                description="Comprehensive risk register with mitigation plans"
                icon={<Shield className="w-5 h-5" />}
                fullReport={{
                  executive: "Risk assessment identifies 12 material risks across strategic, operational, financial, and regulatory categories. Overall risk profile: MODERATE (SRA: 6.4/10). Mitigation strategies reduce residual risk to ACCEPTABLE levels.",
                  metrics: [
                    { label: "SRA Score", value: "6.4/10" },
                    { label: "PRI", value: "Low" },
                    { label: "IDV", value: "±18%" }
                  ],
                  sections: [
                    { title: "Critical Risks (Top 5)", content: "1. Currency volatility - Probability: 60%, Impact: $800K - Hedge strategy defined. 2. Key talent retention - P: 30%, I: $1.2M - Retention packages prepared. 3. Regulatory change - P: 20%, I: $2M - Diversify market entry. 4. Competitive response - P: 70%, I: $500K - Speed-to-market focus. 5. Integration delays - P: 40%, I: $600K - Buffer timeline built in." },
                    { title: "Political Risk Assessment", content: "PRI Score: 3.2/10 (Low Risk). Stable government with consistent FDI policy for 15+ years. No expropriation history in sector. Strong rule of law (World Bank: 78th percentile). Bilateral investment treaty in place." },
                    { title: "Mitigation Investment", content: "Recommended risk capital allocation: $1.2M (16% of total investment). Insurance coverage: $5M political risk, $3M business interruption. Hedging cost: ~$80K annually for currency exposure." },
                    { title: "Contingency Triggers", content: "Escalation to steering committee if: Revenue miss >20% for 2 consecutive quarters • Key person departure • Regulatory environment materially changes • Partner relationship score drops below 6/10" }
                  ]
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-600" />
              Outreach & Communication Documents
            </h3>
            <div className="space-y-3">
              <ReportItem 
                title="Letter of Intent (LOI) Template" 
                description="Professionally structured partnership initiation letter"
                icon={<FileText className="w-5 h-5" />}
                fullReport={{
                  executive: "Ready-to-customize Letter of Intent capturing key commercial terms, timeline, exclusivity provisions, and next steps. Jurisdiction-appropriate language for cross-border transactions.",
                  sections: [
                    { title: "Parties & Recitals", content: "Clear identification of both parties with legal entity names, registration numbers, and principal place of business. Recitals establishing the business context and purpose of the proposed partnership." },
                    { title: "Proposed Transaction", content: "Description of partnership structure (JV / Alliance / Investment). Ownership percentages or contribution ratios. Geographic scope and sector focus. Initial term and renewal provisions." },
                    { title: "Key Terms Outline", content: "Governance structure preview. Financial commitments and milestones. IP ownership and licensing framework. Exclusivity provisions and non-compete scope. Confidentiality obligations." },
                    { title: "Next Steps & Timeline", content: "Due diligence period (typically 60-90 days). Definitive agreement negotiation timeline. Regulatory approval requirements. Anticipated closing conditions. Signature blocks and binding provisions." }
                  ]
                }}
              />
              <ReportItem 
                title="Investment Proposal Package" 
                description="Complete investor-ready documentation set"
                icon={<Briefcase className="w-5 h-5" />}
                fullReport={{
                  executive: "Comprehensive investment proposal including thesis, financials, risk disclosure, and term framework. Designed for institutional investors, strategic partners, and board presentations.",
                  metrics: [
                    { label: "Ask", value: "$7.5M" },
                    { label: "Valuation", value: "$45M" },
                    { label: "Equity", value: "16.7%" }
                  ],
                  sections: [
                    { title: "Investment Thesis", content: "Market opportunity: $4.8B TAM growing at 15.2% CAGR. Competitive advantage: Proprietary AI technology with 18-month lead. Team: Experienced operators with 2 previous exits. Timing: Regulatory tailwinds and market consolidation create optimal entry window." },
                    { title: "Use of Funds", content: "40% - Technology development and localization. 30% - Sales and marketing build-out. 20% - Operations and infrastructure. 10% - Working capital and contingency. Monthly burn rate: $180K ramping to $350K at full deployment." },
                    { title: "Financial Projections", content: "5-year revenue trajectory: $0.8M → $4.2M → $12.5M → $24M → $38M. Path to profitability: Month 30 (operating breakeven). Exit multiple assumption: 8-12x revenue. Target return: 3-5x in 5-7 years." },
                    { title: "Risk Factors", content: "Market adoption slower than projected. Competitive response from incumbents. Key person dependencies. Regulatory changes. Currency and macroeconomic factors. Full risk matrix included in appendix." }
                  ]
                }}
              />
              <ReportItem 
                title="Partnership Outreach Letters" 
                description="Targeted communication templates for different stakeholders"
                icon={<Mail className="w-5 h-5" />}
                fullReport={{
                  executive: "Suite of customizable outreach templates for government liaisons, corporate partners, and strategic alliance targets. Tone and content calibrated to recipient type.",
                  sections: [
                    { title: "Government Liaison Template", content: "Formal structure appropriate for ministry/agency communication. Emphasis on economic impact: job creation, technology transfer, tax revenue. Alignment with national development priorities. Request for meeting or formal expression of interest." },
                    { title: "Corporate Partnership Inquiry", content: "Business-focused opening with clear value proposition. Specific synergy identification. Proposed collaboration model options. Request for exploratory discussion with appropriate decision-maker." },
                    { title: "Strategic Alliance Proposal", content: "Market opportunity framing. Complementary capability mapping. Proposed alliance structure and governance. Success metrics and timeline. Call to action for partnership discussion." },
                    { title: "Follow-Up Templates", content: "7-day follow-up (gentle reminder). 14-day follow-up (additional value add). 30-day follow-up (alternative contact approach). Meeting confirmation and agenda templates." }
                  ]
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-600" />
              Supporting Documentation
            </h3>
            <div className="space-y-3">
              <ReportItem 
                title="Due Diligence Checklist" 
                description="Comprehensive verification framework for partner and market validation"
                icon={<FileCheck className="w-5 h-5" />}
                fullReport={{
                  executive: "A structured verification framework covering financial, legal, operational, and reputational due diligence. Designed for cross-border transactions with jurisdiction-specific requirements.",
                  sections: [
                    { title: "Financial Verification", content: "• Audited financial statements (3 years) • Tax compliance certificates • Bank reference letters • Credit rating reports • Working capital analysis • Debt schedule and covenants • Revenue concentration analysis • Profitability trend assessment" },
                    { title: "Legal Entity Verification", content: "• Certificate of incorporation • Good standing certificates • Shareholder register • Board resolutions • Power of attorney verification • Litigation history search • Regulatory compliance certificates • License and permit validation" },
                    { title: "IP and Technology Review", content: "• Patent portfolio analysis • Trademark registrations • Trade secret protocols • Technology stack assessment • Software license compliance • Data protection compliance • Cybersecurity audit • Third-party IP dependencies" },
                    { title: "Customer & Market Validation", content: "• Customer reference interviews (5-10) • Net promoter score analysis • Churn rate verification • Contract review (top 10 customers) • Market share validation • Competitive position assessment • Pipeline quality review • Customer concentration risk" }
                  ]
                }}
              />
              <ReportItem 
                title="Governance Framework" 
                description="Decision matrix, escalation protocols, and steering committee charter"
                icon={<Scale className="w-5 h-5" />}
                fullReport={{
                  executive: "Complete governance architecture for joint ventures and strategic partnerships. Includes decision rights, meeting cadence, dispute resolution, and exit procedures.",
                  sections: [
                    { title: "Steering Committee Charter", content: "• Committee composition (4-6 members) • Chairperson rotation schedule • Quorum requirements (typically 75%) • Voting rights and weighted votes • Observer seat provisions • Term limits and succession • Confidentiality obligations • Conflict of interest policy" },
                    { title: "Decision Authority Matrix", content: "• Strategic decisions (Board approval) • Operational decisions (Management) • Financial thresholds ($50K/$500K/$5M) • Hiring authority by level • Contract signature authority • IP licensing decisions • Capital expenditure approval • M&A opportunity evaluation" },
                    { title: "Meeting Cadence & Agenda", content: "• Board meetings (Quarterly) • Steering committee (Monthly) • Operating review (Bi-weekly) • Financial review (Monthly close +5) • Strategy sessions (Annual offsite) • Risk review (Quarterly) • Compliance audit (Annual) • Performance calibration (Semi-annual)" },
                    { title: "Escalation Procedures", content: "• Level 1: Operational (Manager resolution 48hrs) • Level 2: Tactical (Director resolution 5 days) • Level 3: Strategic (Steering committee 15 days) • Level 4: Governance (Board resolution 30 days) • Deadlock resolution mechanism • Mediation triggers • Arbitration procedures • Exit clause activation" }
                  ]
                }}
              />
              <ReportItem 
                title="Execution Roadmap" 
                description="18-month Gantt chart with milestones, resources, and Go/No-Go gates"
                icon={<TrendingUp className="w-5 h-5" />}
                fullReport={{
                  executive: "Phased implementation timeline from deal signing through full operation. Includes milestone definitions, resource allocation, dependencies, and gate criteria.",
                  sections: [
                    { title: "Phase 1: Foundation (Month 1-3)", content: "• Legal entity formation • Bank account setup • Initial team hiring (5-8 key roles) • Office/facility setup • IT infrastructure deployment • Regulatory applications filed • Partner integration kickoff • Budget: $800K-1.2M" },
                    { title: "Phase 2: Build (Month 4-9)", content: "• Full team buildout • Operations playbook development • Technology integration • Pilot customer onboarding • Quality systems certification • Supply chain establishment • Training program rollout • Budget: $2-3M" },
                    { title: "Phase 3: Scale (Month 10-18)", content: "• Commercial launch • Sales acceleration • Operational optimization • Performance benchmarking • Expansion planning • Knowledge transfer completion • Steady-state achievement • Budget: $3-5M" },
                    { title: "Go/No-Go Gate Criteria", content: "• Gate 1 (M3): Entity formed, team hired, licenses applied — Proceed/Remediate/Exit • Gate 2 (M6): Pilot customers secured, technology working — Proceed/Pause/Exit • Gate 3 (M12): Revenue targets 75%+, unit economics proven — Scale/Optimize/Restructure • Gate 4 (M18): Steady state, ROI validated — Expand/Maintain/Exit" }
                  ]
                }}
              />
              <ReportItem 
                title="KPI Dashboard Template" 
                description="Performance tracking framework with financial, operational, and strategic indicators"
                icon={<BarChart3 className="w-5 h-5" />}
                fullReport={{
                  executive: "Comprehensive performance management framework with 40+ KPIs across financial, operational, strategic, and health dimensions. Includes target-setting methodology and review cadence.",
                  metrics: [
                    { label: "Financial KPIs", value: "12" },
                    { label: "Operational KPIs", value: "15" },
                    { label: "Strategic KPIs", value: "8" },
                    { label: "Health Indicators", value: "7" }
                  ],
                  sections: [
                    { title: "Financial KPIs", content: "• Revenue (actual vs plan) • Gross margin % • EBITDA margin • Cash conversion cycle • Working capital days • Revenue per employee • Customer acquisition cost • Lifetime value ratio • Burn rate • Runway months • Return on invested capital • Economic value added" },
                    { title: "Operational Metrics", content: "• Production output volume • Quality defect rate • On-time delivery % • Inventory turns • Capacity utilization • Order fulfillment cycle • Customer satisfaction score • First-call resolution • Employee productivity • Process efficiency index • Supplier performance • Safety incident rate" },
                    { title: "Strategic Indicators", content: "• Market share % • Brand awareness score • Net Promoter Score • Innovation pipeline value • Partnership health score • Competitive win rate • Talent retention rate • Strategic initiative completion" },
                    { title: "Health Scorecards", content: "• Employee engagement score • Culture alignment index • Leadership bench strength • Organizational agility rating • Risk management maturity • Compliance adherence % • Stakeholder satisfaction • Sustainability metrics (ESG)" }
                  ]
                }}
              />
            </div>
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
            <h3 className="text-xl font-bold mb-3">System Training & Development Archive</h3>
            <p className="text-slate-300 text-sm mb-4">
              During development, BWGA Intelligence AI processed 12 comprehensive strategic scenarios to train and validate the 21-formula 
              scoring suite, 5-persona debate engine, and report generation capabilities. Each report below demonstrates the system's 
              ability to analyze diverse industries, regions, and strategic objectives.
            </p>
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
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #1: Market Entry — AgriTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SEAM™: 89/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 2: Singapore MedTech → Vietnam */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #2: Manufacturing Expansion — Medical Devices</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 78/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 3: US FinTech → EU */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #3: Regulatory Expansion — FinTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 71/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 4: Japanese Manufacturer → Mexico */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #4: Nearshoring — Automotive Components</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 84/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 5: German Renewables → Saudi Arabia */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #5: Government Partnership — Renewable Energy</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 76/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 6: UK EdTech → India */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #6: Market Expansion — EdTech</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 81/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 7: Canadian Mining → Chile */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #7: Resource Investment — Lithium Mining</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 69/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 8: Swiss Pharma → Singapore */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #8: R&D Hub Establishment — Pharmaceuticals</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 88/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 9: UAE Logistics → East Africa */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #9: Infrastructure Investment — Logistics</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 72/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 10: Korean Gaming → Southeast Asia */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #10: Market Expansion — Gaming & Entertainment</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 85/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 11: Brazilian Agribusiness → Africa */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #11: Technology Transfer — Agribusiness</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 74/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
              </div>

              {/* Report 12: Indian IT Services → Middle East */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">Report #12: Government Digital Transformation — IT Services</span>
                    <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">SPI™: 79/100</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100">
                    View Full Report →
                  </button>
                </div>
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
