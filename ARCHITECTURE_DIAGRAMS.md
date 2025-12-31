# BWGA Intelligence AI - Architecture Diagrams & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BWGA Intelligence AI PLATFORM v4.2                        │
│             React + TypeScript + Vite + TailwindCSS                  │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │  User Browser    │
                         └────────┬─────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │      App.tsx (Root)        │
                    │  State: ReportParameters   │
                    │  Routes: 23 ViewModes      │
                    └─────────────┬──────────────┘
                                  │
        ┌─────────────────────────┼──────────────────────────┐
        │                         │                          │
        ▼                         ▼                          ▼
    ┌────────┐          ┌──────────────┐        ┌──────────────┐
    │ Navbar │          │ Main Content │        │ CopilotSidebar
    │ Footer │          │  (ViewMode)  │        │ MonitorDash   │
    └────────┘          └──────────────┘        └──────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌───────┐         ┌─────────────┐        ┌─────────────────┐
   │Gateway│         │CommandCenter│        │Entity Definition│
   └───────┘         │(Landing)    │        │Builder (Step 1) │
                     └─────────────┘        └─────────────────┘
                            │
                            │ "Begin Entity Definition"
                            │
                            ▼
                     ┌──────────────────────────────┐
                     │   6-STAGE WORKFLOW ENTRY     │
                     └──────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────────┐   ┌────────────────┐  ┌──────────────┐
   │Stage 1:     │   │Stage 2:        │  │Stage 3:      │
   │Market       │───▶Partnership    │─▶│Intelligence  │
   │Analysis     │   │Compatibility   │  │Gathering     │
   └─────────────┘   └────────────────┘  └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
    Global Market    Partnership      Deal         Business       Partnership
    Comparison       Compatibility    Marketplace  Intelligence   Analyzer
        │                   │              │            │            │
        └───────────────────┴──────────────┴────────────┴────────────┘
                            │
        ┌───────────────────┼───────────────────────┐
        │                   │                       │
        ▼                   ▼                       ▼
   ┌─────────────┐   ┌────────────────┐  ┌──────────────────┐
   │Stage 4:     │   │Stage 5:        │  │Stage 6:          │
   │Strategic    │───▶Expansion       │─▶│Report Output     │
   │Planning     │   │Design          │  │& Export          │
   └─────────────┘   └────────────────┘  └──────────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
    Relationship      Advanced         Executive      Document      Integration
    Planner          Expansion        Summary        Generation    & Export
    │               System            Generator      Suite         │
    │               │                 │              │            │
    Multi-Scenario  Partnership       Workbench      Low-Cost     (CSV, PDF,
    Planner         Repository        Provisioning   Tools        DOCX, JSON)
    │               │                 │
    Support         AI                └─────────────┐
    Programs        Recommendations          │
    Database                          Save/Load Reports

                    ┌─────────────────────────────┐
                    │   ReportParameters Object   │
                    │  (Flows Through All Stages) │
                    │ id, params, results,        │
                    │ savedAt, stage, viewMode    │
                    └─────────────────────────────┘
```

---

## Data Flow: How Information Moves

```
USER INPUT
    │
    ├─ Organization Identity (EntityDefinitionBuilder)
    │  ├─ Legal name
    │  ├─ Type, country, headcount
    │  ├─ Strategic assets
    │  └─ Team expertise
    │
    ▼
ENTITY DEFINITION COMPLETE
    │
    ├─► ReportParameters.organizationName
    ├─► ReportParameters.country
    ├─► ReportParameters.strategicIntent
    └─► ReportParameters.stage = 1
    │
    ▼
STAGE 1: MARKET ANALYSIS
    │
    ├─ GlobalMarketComparison reads ReportParameters
    │  ├─ Input: country, region, industry
    │  ├─ Analysis: 100+ years of market data
    │  └─ Output: marketAnalysis, targetMarkets
    │
    ├─► ReportParameters.marketAnalysis = result
    ├─► ReportParameters.targetMarkets = markets[]
    └─► ReportParameters.stage = 2
    │
    ▼
STAGE 2: PARTNERSHIP FEASIBILITY
    │
    ├─ PartnershipCompatibilityEngine reads ReportParameters
    │  ├─ Input: marketAnalysis, strategicIntent
    │  ├─ Scoring: 8 dimensions (0-100)
    │  └─ Output: compatibility score, risk level
    │
    ├─► ReportParameters.successScore = 75
    ├─► ReportParameters.risks[] = [risk1, risk2]
    └─► ReportParameters.stage = 3
    │
    ▼
STAGE 3: INTELLIGENCE GATHERING
    │
    ├─ DealMarketplace reads ReportParameters
    │  └─ Output: ReportParameters.opportunities[] = deals[]
    │
    ├─ BusinessPracticeIntelligence reads ReportParameters
    │  └─ Output: cultural insights, practice briefings
    │
    ├─ PartnershipAnalyzer reads ReportParameters
    │  └─ Output: ReportParameters.partnerships[] = analyzed
    │
    └─► ReportParameters.stage = 4
    │
    ▼
STAGE 4: STRATEGIC PLANNING
    │
    ├─ RelationshipPlanner reads ReportParameters
    │  ├─ Input: partnerships, opportunities
    │  └─ Output: timeline, milestones, roadmap
    │
    ├─ MultiScenarioPlanner reads ReportParameters
    │  ├─ Models: Best, Realistic, Worst cases
    │  └─ Output: Financial projections (IRR, payback)
    │
    ├─ SupportProgramsDatabase reads ReportParameters
    │  ├─ Input: country, industry
    │  └─ Output: matched incentives, tax breaks
    │
    └─► ReportParameters.stage = 5
    │
    ▼
STAGE 5: EXPANSION DESIGN
    │
    ├─ AdvancedExpansionSystem reads ReportParameters
    │  └─ Output: Multi-phase expansion blueprint
    │
    ├─ PartnershipRepository reads ReportParameters
    │  └─ Output: Reusable templates
    │
    ├─ AIPoweredDealRecommendation reads ReportParameters
    │  ├─ ML engine: Scores deals against profile
    │  └─ Output: Ranked recommendations
    │
    ├─ LowCostRelocationTools reads ReportParameters
    │  └─ Output: Cost models, location rankings
    │
    └─► ReportParameters.stage = 6
    │
    ▼
STAGE 6: REPORT GENERATION
    │
    ├─ ExecutiveSummaryGenerator reads ReportParameters
    │  ├─ Combines all previous outputs
    │  └─► ReportParameters.executiveSummary = narrative
    │
    ├─ DocumentGenerationSuite reads ReportParameters
    │  ├─ Formats: PDF, DOCX, HTML
    │  └─► exports to file system
    │
    ├─ IntegrationExportFramework reads ReportParameters
    │  ├─ Formats: CSV, JSON, XML, webhooks
    │  └─► sends to external systems (Salesforce, etc)
    │
    ├─ WorkbenchFeature reads ReportParameters
    │  └─► Real-time provisioning visualization
    │
    └─► ReportParameters.stage = 7 (Complete)
    │
    ▼
SAVE & EXPORT
    │
    ├─► localStorage: saveReports[] = [ReportParameters]
    ├─► Download: Report as PDF/DOCX
    ├─► Email: Send summary
    └─► API: Export to Salesforce, HubSpot, etc.
```

---

## Component Dependency Graph

```
                          ┌──────────────┐
                          │   App.tsx    │
                          │   (Root)     │
                          └──────┬───────┘
                                 │
                ReportParameters (shared state)
                                 │
                ┌────────────────┬────────────────┐
                │                │                │
                ▼                ▼                ▼
         ┌──────────────┐ ┌────────────────┐ ┌─────────────┐
         │ CommandCenter│ │EntityDef       │ │[Feature 1]  │
         │(Gateway)     │ │Builder         │ │GlobalMarket │
         └──────────────┘ └────────────────┘ │Comparison   │
                                              └─────────────┘
                                                    │
                                                    ▼
                                              (Updates ReportParameters)
                                                    │
                                   ┌────────────────┼────────────────┐
                                   │                │                │
                                   ▼                ▼                ▼
                            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                            │[Feature 2]   │ │[Feature 3]   │ │[Feature 4]   │
                            │Partnership   │ │Deal          │ │Executive     │
                            │Compatibility │ │Marketplace   │ │Summary       │
                            └──────────────┘ └──────────────┘ └──────────────┘

IMPORTANT: Features DO NOT import each other
           Features only communicate via ReportParameters
           Each feature is independently testable
```

---

## State Machine: Workflow Progression

```
                    START
                      │
                      ▼
            ┌─────────────────────┐
            │   Command Center    │
            │   (Landing Page)    │
            │  Accept Terms? YES  │
            └──────────┬──────────┘
                       │
                       ▼
         ┌──────────────────────────┐
         │  Entity Definition Step  │
         │   Define Organization   │
         │   (stage: 0 → 1)         │
         └──────────┬───────────────┘
                    │
                    ▼
      ┌────────────────────────────────┐
      │  6-STAGE WORKFLOW PROGRESSION   │
      └────────────────────────────────┘
                    │
        ┌───────────┴───────────┬───────────┬───────────┬───────────┐
        │                       │           │           │           │
        ▼                       ▼           ▼           ▼           ▼
    Stage 1:               Stage 2:    Stage 3:    Stage 4:    Stage 5:
    Market              Partnership  Intelligence Strategic   Expansion
    Analysis            Fit          Gathering    Planning    Design
   (stage: 1→2)        (stage: 2→3) (stage: 3→4) (stage: 4→5) (stage: 5→6)
        │                   │           │           │           │
        └───────────────────┴───────────┴───────────┴───────────┘
                            │
                            ▼
                    Stage 6: Report
                    Generation
                    (stage: 6→7)
                            │
                            ▼
                ┌─────────────────────┐
                │   EXPORT OPTIONS    │
                │ - PDF Download      │
                │ - Email             │
                │ - API Export        │
                │ - Save to Database  │
                └─────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ COMPLETE      │
                    │ (stage: 7)    │
                    └───────────────┘

User Navigation: viewMode state drives which component renders
  viewMode: 'command-center'          → CommandCenter
  viewMode: 'entity-definition'       → EntityDefinitionBuilder
  viewMode: 'global-market-comparison'→ GlobalMarketComparison
  viewMode: 'partnership-compatibility'→ PartnershipCompatibilityEngine
  ... and 19 more routes
```

---

## Information Flow Through Each Feature

```
EVERY FEATURE FOLLOWS THIS PATTERN:

┌─────────────────────────────────────────────────────┐
│              Feature Component                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  const Component: React.FC<{                         │
│    params: ReportParameters;                         │
│    onUpdate: (newParams) => void;                    │
│  }> = ({ params, onUpdate }) => {                    │
│                                                      │
│    // 1. READ from params                            │
│    const { country, strategicIntent, industry } = params
│                                                      │
│    // 2. ANALYSIS/COMPUTATION                        │
│    const results = analyzeMarket(country, industry)  │
│    const newScore = calculateCompatibility(results)  │
│                                                      │
│    // 3. CREATE UPDATED params                       │
│    const updatedParams = {                           │
│      ...params,                                       │
│      marketAnalysis: results,                        │
│      successScore: newScore,                         │
│      recommendations: recommendations               │
│    }                                                 │
│                                                      │
│    // 4. CALL onUpdate                               │
│    onUpdate(updatedParams);                          │
│                                                      │
│    // 5. RENDER UI                                   │
│    return <DisplayResults />;                        │
│  }                                                   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
                App.tsx receives
                updated params
                        │
                        ▼
        Re-renders with new data
```

---

## Services Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Services Layer                         │
│              (Business Logic & Integrations)              │
└──────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌────────────┐ ┌─────────────┐ ┌─────────────┐
    │Gemini      │ │Mock Data    │ │Rule Engine  │
    │Service     │ │Generator    │ │Scoring      │
    │(AI/LLM)    │ │(Test Data)  │ │Recommend    │
    └────────────┘ └─────────────┘ └─────────────┘
         │               │               │
         ├─ API Key      ├─ Market Data  ├─ Scoring Rules
         ├─ Prompts      ├─ Partnerships ├─ Risk Calculation
         ├─ Streaming    └─ Scenarios    └─ Decision Logic
         └─ Error Handling
                │
                └──→ Used by Feature Components
                    (Called from within feature code)
```

---

## File Organization & Imports

```
App.tsx (Root)
  │
  ├─ imports { ReportParameters } from types.ts
  ├─ imports { INITIAL_PARAMETERS } from constants.ts
  ├─ imports { generateCopilotInsights } from services/geminiService.ts
  ├─ imports { calculateSPI } from services/engine.ts
  │
  └─ imports [16 Feature Components]
     │
     ├─ GlobalMarketComparison.tsx
     │   └─ No imports from other features
     │   └─ imports { formatCurrency, constants }
     │
     ├─ PartnershipCompatibilityEngine.tsx
     │   └─ No imports from other features
     │   └─ imports { calculateScore, constants }
     │
     ├─ ... [14 more features, each independent]
     │
     └─ Each feature reads/writes ReportParameters
        (Communication only through App.tsx)

CRITICAL RULE: Features don't import each other
               They only import types, utils, services
               All communication via ReportParameters
```

---

## Build Process

```
┌──────────────────────────────────┐
│     npm run build                │
├──────────────────────────────────┤
│                                  │
│  1. TSC validates types          │
│  2. esbuild transpiles JSX/TS    │
│  3. Vite bundles modules         │
│  4. Tree-shaking removes dead    │
│  5. Minification & compression   │
│                                  │
└────────────────┬─────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  dist/             │
        │  ├─ index.html     │
        │  └─ assets/        │
        │     ├─ index-XX.js │ (711.35 KB raw)
        │     └─ ...         │ (188.78 KB gzip)
        │                    │
        │  Production Ready  │
        │  ✓ Code split      │
        │  ✓ Minified        │
        │  ✓ Optimized       │
        └────────────────────┘
```

---

## Error Handling & Validation Flow

```
USER ACTION
    │
    ▼
Component receives input
    │
    ├─ Input validation
    │  ├─ Required fields check
    │  ├─ Type checking
    │  └─ Range validation
    │
    ▼
Analysis/Calculation
    │
    ├─ Error caught
    │  ├─ Log error
    │  ├─ Show user message
    │  └─ Keep previous state
    │
    ▼
Update ReportParameters
    │
    ├─ Validation passes
    │  ├─ Call onUpdate()
    │  ├─ UI reflects new state
    │  └─ Progress to next stage
    │
    ▼
UI Renders
    │
    ├─ Success state
    ├─ Results displayed
    └─ Next action available
```

---

**Diagrams Generated**: December 16, 2025
**System Version**: BWGA Intelligence AI v4.2
**Architecture Pattern**: React Component State Machine
**Data Flow Model**: Unidirectional (ReportParameters)

