
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ReportParameters, 
  CopilotInsight, 
  ReportData, 
  ReportSection,
  GenerationPhase
} from './types';
import { INITIAL_PARAMETERS } from './constants';
import CommandCenter from './components/CommandCenter'; 
import MonitorDashboard from './components/MonitorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { LegalInfoHub } from './components/LegalInfoHub';
import { ArchitectPage } from './components/ArchitectPage';
import { PartnerManagement } from './components/PartnerManagement';
import MainCanvas from './components/MainCanvas';
import EntityDefinitionBuilder from './components/EntityDefinitionBuilder';
import GlobalMarketComparison from './components/GlobalMarketComparison';
import PartnershipCompatibilityEngine from './components/PartnershipCompatibilityEngine';
import DealMarketplace from './components/DealMarketplace';
import ExecutiveSummaryGenerator from './components/ExecutiveSummaryGenerator';
import BusinessPracticeIntelligenceModule from './components/BusinessPracticeIntelligenceModule';
import DocumentGenerationSuite from './components/DocumentGenerationSuite';
import { EnhancedDocumentGenerator } from './components/EnhancedDocumentGenerator';
import ExistingPartnershipAnalyzer from './components/ExistingPartnershipAnalyzer';
import RelationshipDevelopmentPlanner from './components/RelationshipDevelopmentPlanner';
import MultiScenarioPlanner from './components/MultiScenarioPlanner';
import SupportProgramsDatabase from './components/SupportProgramsDatabase';
import AdvancedStepExpansionSystem from './components/AdvancedStepExpansionSystem';
import PartnershipRepository from './components/PartnershipRepository';
import AIPoweredDealRecommendation from './components/AIPoweredDealRecommendation';
import LowCostRelocationTools from './components/LowCostRelocationTools';
import IntegrationExportFramework from './components/IntegrationExportFramework';
import { DeepReasoningEngine } from './components/DeepReasoningEngine';
import CompetitorMap from './components/CompetitorMap';
import AlternativeLocationMatcher from './components/AlternativeLocationMatcher';
import EthicsPanel from './components/EthicsPanel';
import useEscapeKey from './hooks/useEscapeKey';
import { generateCopilotInsights, generateReportSectionStream } from './services/geminiService';
import { config } from './services/config';
import { generateBenchmarkData } from './services/mockDataGenerator';
import { ReportOrchestrator } from './services/ReportOrchestrator';
// AUTONOMOUS CAPABILITIES IMPORTS
import { solveAndAct as autonomousSolve } from './services/autonomousClient';
import { selfLearningEngine } from './services/selfLearningEngine';
import { ReactiveIntelligenceEngine } from './services/ReactiveIntelligenceEngine';
import { MultiAgentOrchestrator } from './services/MultiAgentBrainSystem';
import { runSmartAgenticWorker, AgenticRun } from './services/agenticWorker';
// EventBus for ecosystem connectivity
import { EventBus, type EcosystemPulse } from './services/EventBus';
import { LayoutGrid, Globe, ShieldCheck, LayoutDashboard, Plus } from 'lucide-react';
import DemoIndicator from './components/DemoIndicator';
// Note: report-generator sidebar is rendered inside MainCanvas.

// --- TYPES & INITIAL STATE ---
const initialSection: ReportSection = { id: '', title: '', content: '', status: 'pending' };

const initialReportData: ReportData = {
  executiveSummary: { ...initialSection, id: 'exec', title: 'Executive Summary' },
  marketAnalysis: { ...initialSection, id: 'market', title: 'Background & Market Dossier' },
  recommendations: { ...initialSection, id: 'rec', title: 'Strategic Analysis & Options' },
  implementation: { ...initialSection, id: 'imp', title: 'Engagement & Execution Playbook' },
  financials: { ...initialSection, id: 'fin', title: 'Financial Projections' },
  risks: { ...initialSection, id: 'risk', title: 'Risk Mitigation Strategy' },
};

type ViewMode = 'command-center' | 'live-feed' | 'admin-dashboard' | 'legal-hub' | 'architect' | 'report-generator' | 'partner-management' | 'gateway' | 'strategic-canvas' | 'entity-builder' | 'market-comparison' | 'compatibility-engine' | 'deal-marketplace' | 'summary-generator' | 'business-intelligence' | 'document-generation' | 'partnership-analyzer' | 'relationship-planner' | 'scenario-planning' | 'support-programs' | 'advanced-expansion' | 'partnership-repository' | 'ai-recommendations' | 'low-cost-tools' | 'integration-export' | 'intelligence-library' | 'deep-reasoning' | 'cultural-intelligence' | 'competitive-map' | 'alternative-locations' | 'ethics-panel' | 'risk-scoring' | 'benchmark-comparison' | 'document-suite';

const App: React.FC = () => {
    // --- STATE ---
    const [params, setParams] = useState<ReportParameters>(INITIAL_PARAMETERS);
    const [viewMode, setViewMode] = useState<ViewMode>('command-center');
    const [hasEntered, setHasEntered] = useState(true); // Skip landing page - directly enter app
    
        // Load saved reports without injecting demo benchmarks
        const [savedReports, setSavedReports] = useState<ReportParameters[]>(() => {
        try {
          console.log("DEBUG: Loading saved reports from localStorage");
          const saved = localStorage.getItem('bw-nexus-reports-unified');
          if (saved) {
              console.log("DEBUG: Found saved data, parsing...");
              const parsed = JSON.parse(saved);
              if (parsed.length > 0) {
                  console.log("DEBUG: Using saved reports, count:", parsed.length);
                  return parsed;
              }
          }
                    // No saved data: start with an empty repository for production
                    console.log("DEBUG: No saved data, starting empty repository");
                    return [];
        } catch (e) {
          console.error("DEBUG: Error loading saved reports:", e);
                    console.log("DEBUG: Falling back to empty repository");
                    return [];
        }
    });
    
    const [legalSection, setLegalSection] = useState<string | undefined>(undefined);

    // Generation State
    const [insights, setInsights] = useState<CopilotInsight[]>([]);
    const [reportData, setReportData] = useState<ReportData>(initialReportData);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [genPhase, setGenPhase] = useState<GenerationPhase>('idle');
    const [genProgress, setGenProgress] = useState(0);

    // AUTONOMOUS CAPABILITIES STATE
    const [autonomousMode, setAutonomousMode] = useState(true); // DEFAULT ON
    const [autonomousInsights, setAutonomousInsights] = useState<CopilotInsight[]>([]);
    const [isAutonomousThinking, setIsAutonomousThinking] = useState(false);
    const [autonomousSuggestions, setAutonomousSuggestions] = useState<string[]>([]);
    // ECOSYSTEM STATE (from EventBus "meadow" signals)
    const [ecosystemPulse, setEcosystemPulse] = useState<EcosystemPulse | null>(null);

    // COMBINED INSIGHTS - Merge regular and autonomous insights
    const combinedInsights = useMemo(() => {
        return [...insights, ...autonomousInsights];
    }, [insights, autonomousInsights]);

    // --- EventBus subscriptions (bee ↔ flower ↔ meadow) ---
    useEffect(() => {
        // Subscribe to insights from anywhere in the system
        const unsubInsights = EventBus.subscribe('insightsGenerated', (event) => {
            console.log('[App] EventBus → insightsGenerated', event.reportId);
            // Merge ecosystem insights with existing
            setAutonomousInsights(prev => {
                const ids = new Set(prev.map(i => i.id));
                const newOnes = event.insights.filter(i => !ids.has(i.id));
                return [...prev, ...newOnes];
            });
        });

        // Subscribe to suggestions from anywhere in the system
        const unsubSuggestions = EventBus.subscribe('suggestionsReady', (event) => {
            console.log('[App] EventBus → suggestionsReady', event.reportId);
            setAutonomousSuggestions(event.actions);
        });

        // Subscribe to ecosystem pulse ("meadow" view)
        const unsubPulse = EventBus.subscribe('ecosystemPulse', (event) => {
            console.log('[App] EventBus → ecosystemPulse', event.signals);
            setEcosystemPulse(event.signals);
        });

        // Subscribe to learning updates (self-learning feedback)
        const unsubLearning = EventBus.subscribe('learningUpdate', (event) => {
            console.log('[App] EventBus → learningUpdate', event.message);
            // Could show a toast or update a learning status indicator
        });

        return () => {
            unsubInsights();
            unsubSuggestions();
            unsubPulse();
            unsubLearning();
        };
    }, []);



    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('bw-nexus-reports-unified', JSON.stringify(savedReports));
    }, [savedReports]);

    // Copilot Auto-Gen - ONLY runs if valid input exists
    useEffect(() => {
        console.log("DEBUG: Copilot useEffect triggered", { viewMode, orgName: params.organizationName, country: params.country, insightsLength: insights.length });
        const timer = setTimeout(async () => {
          // STRICT CHECK: Do not run if fields are empty
                    if (config.useRealAI && (viewMode === 'report-generator') && params.organizationName && params.country && params.organizationName.length > 2 && insights.length === 0) {
            console.log("DEBUG: Starting copilot generation");
            try {
              const newInsights = await generateCopilotInsights(params);
              console.log("DEBUG: Copilot insights generated:", newInsights.length);
              setInsights(newInsights);
            } catch (error) {
              console.error("DEBUG: Error in copilot generation:", error);
            }
          } else {
            console.log("DEBUG: Copilot conditions not met");
          }
        }, 1500);
        return () => clearTimeout(timer);
        }, [params, viewMode, insights.length]);

    // AUTONOMOUS CAPABILITIES EFFECTS

    // Agentic Worker - true digital worker pipeline (plan -> tools -> memory -> verdict)
    useEffect(() => {
        if (autonomousMode && params.organizationName && params.country && params.organizationName.length > 2) {
            const timer = setTimeout(async () => {
                console.log("🤖 AGENTIC WORKER: Starting autonomous digital worker");
                setIsAutonomousThinking(true);
                try {
                    // Run the full agentic pipeline (tools + memory + payload)
                    const agenticResult: AgenticRun = await runSmartAgenticWorker(params, { maxSimilarCases: 5 });

                    // Merge insights produced by agentic worker
                    setAutonomousInsights(agenticResult.insights);

                    // Proactive suggestions based on next actions
                    setAutonomousSuggestions(agenticResult.executiveBrief.nextActions);

                    console.log("🤖 AGENTIC WORKER: Run complete", {
                        runId: agenticResult.runId,
                        signal: agenticResult.executiveBrief.proceedSignal,
                        memory: agenticResult.memory.similarCases.length
                    });
                } catch (error) {
                    console.error("🤖 AGENTIC WORKER: Error running digital worker:", error);
                    // Fallback to legacy autonomous solve
                    try {
                        const problem = `Analyze partnership and investment opportunities for ${params.organizationName} in ${params.country}`;
                        const context = {
                            region: params.country,
                            industry: params.industry,
                            dealSize: params.dealSize,
                            strategicIntent: params.strategicIntent
                        };
                        const result = await autonomousSolve(problem, context, params, { autoAct: false, urgency: 'normal' });
                        const fallbackInsights: CopilotInsight[] = result.solutions.map((solution: any, index: number) => ({
                            id: `autonomous-${Date.now()}-${index}`,
                            type: 'strategy' as const,
                            title: `Autonomous Discovery: ${solution.action}`,
                            description: solution.reasoning,
                            content: `Autonomous analysis suggests: ${solution.action}. Reasoning: ${solution.reasoning}`,
                            confidence: solution.confidence || 75,
                            isAutonomous: true
                        }));
                        setAutonomousInsights(fallbackInsights);
                        setAutonomousSuggestions(result.solutions.map((s: any) => s.action));
                    } catch {}
                } finally {
                    setIsAutonomousThinking(false);
                }
            }, 3000); // Longer delay for autonomous analysis

            return () => clearTimeout(timer);
        }
    }, [params.organizationName, params.country, params.industry, autonomousMode]);

    // Self-Learning Data Collection - Records performance after report generation
    useEffect(() => {
        if (genPhase === 'complete' && params.id) {
            console.log("📊 SELF-LEARNING: Recording performance data");
            try {
                // Calculate performance metrics
                const startTime = Date.now() - (genProgress * 1000); // Estimate based on progress
                const generationTime = Date.now() - startTime;

                selfLearningEngine.recordTest({
                    timestamp: new Date().toISOString(),
                    testId: params.id,
                    scenario: 'report_generation',
                    inputs: params,
                    outputs: {
                        spiScore: params.opportunityScore?.totalScore,
                        rroiScore: params.opportunityScore?.marketPotential,
                        reportQuality: 85, // Could be user-rated
                        generationTime: generationTime
                    },
                    feedback: {
                        successful: true,
                        errors: [],
                        warnings: [],
                        suggestions: autonomousSuggestions
                    },
                    improvements: ['Enhanced autonomous analysis', 'Improved insight generation']
                });

                console.log("📊 SELF-LEARNING: Performance data recorded");
            } catch (error) {
                console.error("📊 SELF-LEARNING: Error recording data:", error);
            }
        }
    }, [genPhase, params.id, genProgress, autonomousSuggestions]);

    // Proactive Intelligence Monitoring - Continuous background analysis
    useEffect(() => {
        if (autonomousMode && params.organizationName) {
            const interval = setInterval(async () => {
                try {
                    console.log("🔍 PROACTIVE: Checking for new opportunities");
                    const opportunities = await ReactiveIntelligenceEngine.thinkAndAct(
                        `Monitor for new opportunities related to ${params.organizationName} in ${params.country || 'target markets'}`,
                        params,
                        { autoAct: false, urgency: 'low' }
                    );

                    if (opportunities.actions.length > 0) {
                        const newSuggestions = opportunities.actions.map(action => action.action);
                        setAutonomousSuggestions(prev => [...new Set([...prev, ...newSuggestions])]);
                        console.log("🔍 PROACTIVE: Found", opportunities.actions.length, "new opportunities");
                    }
                } catch (error) {
                    console.error("🔍 PROACTIVE: Error in monitoring:", error);
                }
            }, 30000); // Check every 30 seconds

            return () => clearInterval(interval);
        }
    }, [autonomousMode, params.organizationName, params.country]);

    // --- ACTIONS ---
    const handleEscape = useCallback(() => {
        if (viewMode !== 'command-center') {
            setViewMode('command-center');
        }
    }, [viewMode]);

    useEscapeKey(handleEscape);

    const handleEnterApp = () => {
        setHasEntered(true);
        setViewMode('command-center');
    };

    // AUTONOMOUS CAPABILITIES ACTIONS
    const toggleAutonomousMode = useCallback(() => {
        setAutonomousMode(prev => !prev);
        if (!autonomousMode) {
            console.log("🤖 AUTONOMOUS MODE: ACTIVATED");
            setAutonomousInsights([]);
            setAutonomousSuggestions([]);
        } else {
            console.log("🤖 AUTONOMOUS MODE: DEACTIVATED");
        }
    }, [autonomousMode]);

    const startNewMission = () => {
        const newParams = { 
            ...INITIAL_PARAMETERS, 
            id: Math.random().toString(36).substr(2, 9), 
            createdAt: Date.now().toString(),
            // STRICT FRESH START with proper empty values for placeholders
            organizationName: '',
            userName: '',
            userDepartment: '',
            country: '',
            strategicIntent: [],
            problemStatement: '',
            industry: [],
            region: '',
            organizationType: '', // Reset type
            organizationSubType: ''
        };
        setParams(newParams);
        setReportData(initialReportData);
        setInsights([]);
        setAutonomousInsights([]); // Clear autonomous insights for new mission
        setAutonomousSuggestions([]); // Clear autonomous suggestions
        // UPDATED: Start directly in the Unified Control Matrix
        setViewMode('report-generator'); 
    };

    const loadReport = (report: ReportParameters) => {
        setParams(report);
        setReportData(initialReportData);
        setInsights([]);
        // Always load into Unified Control Matrix
        setViewMode('report-generator');
    };

    const deleteReport = (id: string) => {
        setSavedReports(prev => prev.filter(r => r.id !== id));
    };

    const openLegal = (section?: string) => {
        setLegalSection(section);
        setViewMode('legal-hub');
        setHasEntered(true);
    };

    const handleGenerateReport = useCallback(async () => {
        setIsGeneratingReport(true);
        setGenPhase('intake');
        setGenProgress(5);

        // Assemble complete ReportPayload using ReportOrchestrator
        console.log('DEBUG: Starting report generation with ReportOrchestrator');
        const reportPayload = await ReportOrchestrator.assembleReportPayload(params);
        ReportOrchestrator.logPayload(reportPayload); // Debug logging

        // Validate payload completeness
        const validation = ReportOrchestrator.validatePayload(reportPayload);
        if (!validation.isComplete) {
            console.warn('DEBUG: Incomplete payload, missing fields:', validation.missingFields);
        }

        // Extract scores for backward compatibility
        const spiResult = reportPayload.computedIntelligence.spi;
        const marketPotential = reportPayload.confidenceScores.economicReadiness;
        const riskFactors = 100 - reportPayload.confidenceScores.politicalStability;

        const updatedScore = {
            totalScore: spiResult.spi,
            marketPotential: marketPotential,
            riskFactors: riskFactors
        };

        const updatedParams = {
            ...params,
            opportunityScore: updatedScore,
            status: 'generating' as const
        };

        setParams(updatedParams);

        // Save to repository immediately
        setSavedReports(prev => {
            const existing = prev.findIndex(r => r.id === params.id);
            if (existing >= 0) return prev.map((r, i) => i === existing ? updatedParams : r);
            return [updatedParams, ...prev];
        });

        // Sim Phases
        await new Promise(r => setTimeout(r, 2000));
        setGenPhase('orchestration'); setGenProgress(25);
        await new Promise(r => setTimeout(r, 3000));
        setGenPhase('modeling'); setGenProgress(50);
        await new Promise(r => setTimeout(r, 2000));
        setGenPhase('synthesis'); setGenProgress(75);

        // Generate Sections with computed intelligence
        const sectionsToGenerate = ['executiveSummary', 'marketAnalysis', 'recommendations', 'implementation', 'financials', 'risks'];
        for (const sectionKey of sectionsToGenerate) {
            setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], status: 'generating' } }));

            // Generate content using both AI and computed data
            const enhancedParams = { ...updatedParams, reportPayload };
            await generateReportSectionStream(sectionKey, enhancedParams, (chunk) => {
                setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], content: chunk } }));
            });

            setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], status: 'completed' } }));
        }

        setGenPhase('complete');
        setGenProgress(100);
        setIsGeneratingReport(false);
        setSavedReports(prev => prev.map(r => r.id === params.id ? { ...r, status: 'complete' } : r));
    }, [params]);


    // --- RENDER ---
    // Direct entry to command center - landing page removed per user request

    if (viewMode === 'admin-dashboard') {
        return (
            <div className="h-screen flex flex-col">
                <AdminDashboard />
                <button 
                    onClick={() => setViewMode('command-center')}
                    className="fixed bottom-6 right-6 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-bold hover:bg-black transition-colors"
                >
                    Exit Admin Mode
                </button>
            </div>
        );
    }

    if (viewMode === 'legal-hub') {
        return <LegalInfoHub onBack={() => setViewMode('command-center')} initialSection={legalSection} />;
    }

    if (viewMode === 'architect') {
        return <ArchitectPage onBack={() => setViewMode('command-center')} />;
    }

    return (
        <div className="h-screen w-full bg-stone-50 font-sans text-stone-900 flex flex-col overflow-hidden">
            
            {/* PLATINUM HEADER */}
            <header className="bg-white border-b border-stone-200 z-50 shadow-sm h-16 flex-shrink-0 flex items-center justify-between px-6 relative">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-50"></div>
                
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('command-center')}>
                    <div className="w-9 h-9 bg-bw-navy rounded-lg flex items-center justify-center shadow-lg border border-bw-navy group-hover:border-bw-gold transition-colors">
                        <LayoutGrid className="w-5 h-5 text-bw-gold" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-bw-navy leading-none tracking-tight group-hover:text-bw-navy/80 transition-colors">
                            BW Nexus AI
                        </h1>
                        <span className="text-[9px] text-bw-gold font-bold uppercase tracking-widest">Intelligence OS</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center bg-stone-100/50 p-1 rounded-lg border border-stone-200">
                    <DemoIndicator className="mr-2" />
                    
                    {/* AUTONOMOUS MODE TOGGLE */}
                    <button
                        onClick={toggleAutonomousMode}
                        className={`p-2 rounded-full transition-all shadow-sm hover:shadow-md ${
                            autonomousMode 
                                ? 'text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100' 
                                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                        }`}
                        title={autonomousMode ? "Autonomous Mode Active - AI is analyzing independently" : "Enable Autonomous Mode - Let AI think independently"}
                    >
                        <div className="relative">
                            <ShieldCheck className="w-5 h-5" />
                            {autonomousMode && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            )}
                            {isAutonomousThinking && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-spin"></div>
                            )}
                        </div>
                    </button>
                    
                    <button
                        onClick={() => setViewMode('admin-dashboard')}
                        className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                        title="Admin Console"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <main className="flex-grow w-full h-full overflow-hidden bg-stone-50 flex">
                
                {/* 1. COMMAND CENTER (DASHBOARD) */}
                {viewMode === 'command-center' && (
                    <CommandCenter 
                        savedReports={savedReports}
                        onCreateNew={startNewMission}
                        onLoadReport={loadReport}
                        onOpenInstant={() => setViewMode('partner-management')} 
                        onOpenSimulator={() => setViewMode('live-feed')}
                        onOpenReportGenerator={startNewMission}
                        ecosystemPulse={ecosystemPulse}
                    />
                )}

                {/* 2. PARTNER MANAGEMENT */}
                {viewMode === 'partner-management' && (
                    <PartnerManagement />
                )}

                {/* 3. SYSTEM MONITOR (Formerly Live Feed) */}
                {viewMode === 'live-feed' && (
                    <MonitorDashboard reports={savedReports} />
                )}

                {/* 4. UNIFIED CONTROL MATRIX (SUPER SYSTEM) */}
                {viewMode === 'report-generator' && (
                    <div className="flex flex-1 w-full h-full overflow-hidden">
                        <MainCanvas
                            params={params}
                            setParams={setParams}
                            reportData={reportData}
                            isGenerating={isGeneratingReport}
                            generationPhase={genPhase}
                            generationProgress={genProgress}
                            onGenerate={handleGenerateReport}
                            reports={savedReports}
                            onOpenReport={loadReport}
                            onDeleteReport={deleteReport}
                            onNewAnalysis={startNewMission}
                            onCopilotMessage={(msg) => setInsights(prev => [msg, ...prev])}
                            onChangeViewMode={(mode: string) => setViewMode(mode as ViewMode)}
                            insights={combinedInsights}
                            autonomousMode={autonomousMode}
                            autonomousSuggestions={autonomousSuggestions}
                            isAutonomousThinking={isAutonomousThinking}
                        />
                    </div>
                )}

                {/* 5. ENTITY DEFINITION BUILDER */}
                {viewMode === 'entity-builder' && (
                    <EntityDefinitionBuilder 
                        onEntityDefined={(entity) => {
                            setParams(prev => ({
                                ...prev,
                                organizationName: entity.legalName,
                                organizationType: entity.organizationType,
                                country: entity.country,
                            }));
                            setViewMode('report-generator');
                        }}
                    />
                )}

                {/* 6. GLOBAL MARKET COMPARISON */}
                {viewMode === 'market-comparison' && (
                    <GlobalMarketComparison />
                )}

                {/* 7. PARTNERSHIP COMPATIBILITY ENGINE */}
                {viewMode === 'compatibility-engine' && (
                    <PartnershipCompatibilityEngine 
                        yourEntity={params}
                        targetPartner={{}}
                    />
                )}

                {/* 8. DEAL MARKETPLACE */}
                {viewMode === 'deal-marketplace' && (
                    <DealMarketplace />
                )}

                {/* 9. EXECUTIVE SUMMARY GENERATOR */}
                {viewMode === 'summary-generator' && (
                    <ExecutiveSummaryGenerator 
                        entity={params}
                        onSummaryGenerated={(summary) => {
                            console.log('Summary generated:', summary);
                        }}
                    />
                )}

                {/* 10. BUSINESS PRACTICE INTELLIGENCE */}
                {viewMode === 'business-intelligence' && (
                    <BusinessPracticeIntelligenceModule 
                        selectedCountry={params.country || 'Vietnam'}
                        onCountrySelected={(country) => {
                            setParams(prev => ({ ...prev, country }));
                        }}
                    />
                )}

                {/* 11. DOCUMENT GENERATION SUITE - ENHANCED WITH 200+ TYPES */}
                {viewMode === 'document-generation' && (
                    <EnhancedDocumentGenerator
                        params={params}
                        className="m-4"
                    />
                )}

                {/* 12. EXISTING PARTNERSHIP ANALYZER */}
                {viewMode === 'partnership-analyzer' && (
                    <ExistingPartnershipAnalyzer 
                        onAnalysisComplete={(partnerships) => {
                            console.log('Analysis complete:', partnerships);
                        }}
                    />
                )}

                {/* 13. RELATIONSHIP DEVELOPMENT PLANNER */}
                {viewMode === 'relationship-planner' && (
                    <RelationshipDevelopmentPlanner
                        partnerName="Strategic Partner"
                        targetCountry={params.country || 'Target Market'}
                        dealValue={50000000}
                    />
                )}

                {/* 14. MULTI-SCENARIO PLANNING */}
                {viewMode === 'scenario-planning' && (
                    <MultiScenarioPlanner />
                )}

                {/* 15. SUPPORT PROGRAMS DATABASE */}
                {viewMode === 'support-programs' && (
                    <SupportProgramsDatabase />
                )}

                {/* 16. ADVANCED STEP EXPANSION SYSTEM */}
                {viewMode === 'advanced-expansion' && (
                    <AdvancedStepExpansionSystem />
                )}

                {/* 17. PARTNERSHIP REPOSITORY */}
                {viewMode === 'partnership-repository' && (
                    <PartnershipRepository />
                )}

                {/* 18. AI-POWERED DEAL RECOMMENDATION */}
                {viewMode === 'ai-recommendations' && (
                    <AIPoweredDealRecommendation />
                )}

                {/* 19. LOW-COST & RELOCATION TOOLS */}
                {viewMode === 'low-cost-tools' && (
                    <LowCostRelocationTools />
                )}

                {/* 20. INTEGRATION & EXPORT FRAMEWORK */}
                {viewMode === 'integration-export' && (
                    <IntegrationExportFramework />
                )}

                {/* 21. INTELLIGENCE LIBRARY (HIDDEN FEATURE) */}
                {viewMode === 'intelligence-library' && (
                    <PartnershipRepository />
                )}

                {/* 22. DEEP REASONING ENGINE (HIDDEN FEATURE) */}
                {viewMode === 'deep-reasoning' && (
                    <DeepReasoningEngine 
                        userOrg={params.organizationName || 'Your Organization'}
                        targetEntity={params.partnerPersonas?.[0] || 'Potential Partner'}
                        context={`Exploring partnership opportunities in ${params.country || 'target market'}`}
                    />
                )}

                {/* 23. CULTURAL INTELLIGENCE (HIDDEN FEATURE) */}
                {viewMode === 'cultural-intelligence' && (
                    <BusinessPracticeIntelligenceModule 
                        selectedCountry={params.country || 'Vietnam'}
                        onCountrySelected={(country) => setParams(prev => ({ ...prev, country }))}
                    />
                )}

                {/* 24. COMPETITIVE MAP (HIDDEN FEATURE) */}
                {viewMode === 'competitive-map' && (
                    <CompetitorMap clientName={params.organizationName} />
                )}

                {/* 25. ALTERNATIVE LOCATIONS (HIDDEN FEATURE) */}
                {viewMode === 'alternative-locations' && (
                    <AlternativeLocationMatcher 
                        originalLocation={{
                            city: params.userCity || 'Ho Chi Minh City',
                            country: params.country || 'Vietnam',
                            population: 9000000,
                            region: 'Southeast Asia',
                            talentPool: {
                                laborCosts: 50,
                                educationLevel: 75,
                                skillsAvailability: 80
                            },
                            infrastructure: {
                                transportation: 70,
                                digital: 75,
                                utilities: 80
                            },
                            businessEnvironment: {
                                easeOfDoingBusiness: 70,
                                corruptionIndex: 60,
                                regulatoryQuality: 65
                            },
                            marketAccess: {
                                domesticMarket: 85,
                                exportPotential: 75,
                                regionalConnectivity: 80
                            },
                            gdp: {
                                totalBillionUSD: 450,
                                perCapitaUSD: 4500
                            }
                        }}
                        requirements={{
                            minPopulation: 1000000,
                            maxCost: 80,
                            minInfrastructure: 70,
                            preferredRegion: 'Southeast Asia',
                            businessFocus: Array.isArray(params.industry) ? params.industry : [params.industry || 'Technology']
                        }}
                    />
                )}

                {/* 26. ETHICS PANEL (HIDDEN FEATURE) */}
                {viewMode === 'ethics-panel' && (
                    <EthicsPanel params={params} />
                )}

                {/* 27. RISK SCORING (HIDDEN FEATURE) */}
                {viewMode === 'risk-scoring' && (
                    <MonitorDashboard reports={savedReports} />
                )}

                {/* 28. BENCHMARK COMPARISON (HIDDEN FEATURE) */}
                {viewMode === 'benchmark-comparison' && (
                    <GlobalMarketComparison />
                )}

                {/* 29. DOCUMENT SUITE (QUICK ACCESS) - ENHANCED WITH 200+ TYPES */}
                {viewMode === 'document-suite' && (
                    <EnhancedDocumentGenerator
                        params={params}
                        className="m-4"
                    />
                )}
            </main>

            {/* SYSTEM FOOTER */}
            <footer className="bg-white border-t border-stone-200 py-2 px-6 z-40 flex justify-between items-center text-[9px] text-stone-400 uppercase tracking-widest font-medium shrink-0">
                <div className="flex items-center gap-4">
                    <span className="cursor-default">&copy; {new Date().getFullYear()} BW Global Advisory</span>
                    <span className="w-px h-3 bg-stone-300"></span>
                    <span className="cursor-default">ABN: 55 978 113 300</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => openLegal('privacy')} className="hover:text-stone-600 transition-colors">Privacy</button>
                    <button onClick={() => openLegal('terms')} className="hover:text-stone-600 transition-colors">Terms</button>
                </div>
            </footer>
        </div>
    );
};

export default App;
