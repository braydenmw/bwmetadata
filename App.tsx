import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ReportParameters, 
  CopilotInsight, 
  ReportData, 
  ReportSection,
  GenerationPhase
} from './types';
import { INITIAL_PARAMETERS } from './constants';
import MainCanvas from './components/MainCanvas';
import UserManual from './components/UserManual';
import useEscapeKey from './hooks/useEscapeKey';
import { generateCopilotInsights, generateReportSectionStream } from './services/geminiService';
import { config } from './services/config';
import { ReportOrchestrator } from './services/ReportOrchestrator';
// AUTONOMOUS CAPABILITIES IMPORTS
import { solveAndAct as autonomousSolve } from './services/autonomousClient';
import { selfLearningEngine } from './services/selfLearningEngine';
import { ReactiveIntelligenceEngine } from './services/ReactiveIntelligenceEngine';
import { runSmartAgenticWorker, AgenticRun } from './services/agenticWorker';
// EventBus for ecosystem connectivity
import { EventBus, type EcosystemPulse } from './services/EventBus';
import { ReportsService } from './services/ReportsService';
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

type ViewMode = 'main' | 'user-manual' | 'report-generator';

const App: React.FC = () => {
    // --- STATE ---
    const [params, setParams] = useState<ReportParameters>(INITIAL_PARAMETERS);
    const [viewMode, setViewMode] = useState<ViewMode>('user-manual');
    const [savedReports, setSavedReports] = useState<ReportParameters[]>([]);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const reports = await ReportsService.list();
                setSavedReports(reports);
            } catch (error) {
                console.error('Failed to load reports from API', error);
            }
        };
        loadReports();
    }, []);

    // Generation State
    const [insights, setInsights] = useState<CopilotInsight[]>([]);
    const [reportData, setReportData] = useState<ReportData>(initialReportData);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [genPhase, setGenPhase] = useState<GenerationPhase>('idle');
    const [genProgress, setGenProgress] = useState(0);

    // AUTONOMOUS CAPABILITIES STATE
    const [autonomousMode] = useState(true); // DEFAULT ON
    const [autonomousInsights, setAutonomousInsights] = useState<CopilotInsight[]>([]);
    const [isAutonomousThinking, setIsAutonomousThinking] = useState(false);
    const [autonomousSuggestions, setAutonomousSuggestions] = useState<string[]>([]);
    // ECOSYSTEM STATE (from EventBus "meadow" signals)
    const [, setEcosystemPulse] = useState<EcosystemPulse | null>(null);

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
                        const fallbackInsights: CopilotInsight[] = result.solutions.map((solution: { action: string; reasoning: string; confidence?: number }, index: number) => ({
                            id: `autonomous-${Date.now()}-${index}`,
                            type: 'strategy' as const,
                            title: `Autonomous Discovery: ${solution.action}`,
                            description: solution.reasoning,
                            content: `Autonomous analysis suggests: ${solution.action}. Reasoning: ${solution.reasoning}`,
                            confidence: solution.confidence || 75,
                            isAutonomous: true
                        }));
                        setAutonomousInsights(fallbackInsights);
                        setAutonomousSuggestions(result.solutions.map((s: { action: string }) => s.action));
                    } catch {
                        // Fallback failed silently
                    }
                } finally {
                    setIsAutonomousThinking(false);
                }
            }, 3000); // Longer delay for autonomous analysis

            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autonomousMode, params.organizationName, params.country]);

    // --- ACTIONS ---
    const handleEscape = useCallback(() => {
        if (viewMode !== 'report-generator') {
            setViewMode('report-generator');
        }
    }, [viewMode]);

    useEscapeKey(handleEscape);

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

    const deleteReport = async (id: string) => {
        setSavedReports(prev => prev.filter(r => r.id !== id));
        try {
            await ReportsService.delete(id);
        } catch (error) {
            console.error('Failed to delete report via API', error);
        }
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
            const existing = prev.findIndex(r => r.id === updatedParams.id);
            if (existing >= 0) return prev.map((r, i) => i === existing ? updatedParams : r);
            return [updatedParams, ...prev];
        });

        try {
            await ReportsService.upsert(updatedParams);
        } catch (error) {
            console.error('Failed to persist report (generating)', error);
        }

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

        const completedReport = { ...updatedParams, status: 'complete' as const };
        setGenPhase('complete');
        setGenProgress(100);
        setIsGeneratingReport(false);
        setSavedReports(prev => prev.map(r => r.id === completedReport.id ? completedReport : r));

        try {
            await ReportsService.upsert(completedReport);
        } catch (error) {
            console.error('Failed to persist report (complete)', error);
        }
    }, [params]);


    // --- RENDER ---

    const renderContent = () => {
        if (viewMode === 'user-manual') {
            return (
                <div className="w-full h-full overflow-y-auto">
                    <UserManual onLaunchOS={() => setViewMode('main')} />
                </div>
            );
        }

        if (viewMode === 'main') {
            return (
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
            );
        }
        
        // Fallback or default view
        return (
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
        );
    };

    return (
        <div className="h-screen w-full bg-stone-50 font-sans text-stone-900 flex flex-col overflow-hidden">
            {renderContent()}
        </div>
    );
};

export default App;
