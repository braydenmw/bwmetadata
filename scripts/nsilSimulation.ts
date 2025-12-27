import { readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ReportOrchestrator } from '../services/ReportOrchestrator';
import type { ReportParameters } from '../types';

interface QueueEntry {
  id: string;
  entity: string;
  region: string;
  country: string;
  city?: string;
  sector: string;
  intent: string;
  challenge: string;
  desiredOutcome: string;
  dealSizeUSD?: number;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const argMap = parseArgs(process.argv.slice(2));
const queuePath = argMap.queue ?? path.join(ROOT_DIR, 'tests', 'client_queue_mini.json');
const outputPath = argMap.output ?? path.join(ROOT_DIR, 'test-results-simulation.json');
const mode = argMap.mode ?? 'baseline';

await runSimulation(queuePath, outputPath, mode);

async function runSimulation(queueFile: string, outputFile: string, mode: string) {
  const queue: QueueEntry[] = JSON.parse(await readFile(queueFile, 'utf8'));
  const results: Array<Record<string, unknown>> = [];
  let successCount = 0;

  console.log(`\n🧪 NSIL Simulation Harness :: ${mode.toUpperCase()} run`);
  console.log(`Queue file: ${queueFile}`);
  console.log(`Scenarios: ${queue.length}\n`);

  for (const entry of queue) {
    const start = performance.now();
    console.log(`→ [${entry.id}] ${entry.entity} (${entry.country})`);

    try {
      const params = buildReportParameters(entry, mode);
      const payload = await ReportOrchestrator.assembleReportPayload(params);
      const validation = ReportOrchestrator.validatePayload(payload);

      if (!validation.isComplete) {
        throw new Error(`Payload missing fields: ${validation.missingFields.join(', ')}`);
      }

      const spiScore = payload.computedIntelligence.spi.spi ?? 0;
      const rroiScore = payload.computedIntelligence.rroi.overallScore ?? 0;
      const scfImpact = payload.computedIntelligence.scf?.totalEconomicImpactUSD ?? 0;
      const elapsedMs = performance.now() - start;

      successCount += 1;
      results.push({
        id: entry.id,
        entity: entry.entity,
        region: entry.region,
        sector: entry.sector,
        spi: Number(spiScore.toFixed(2)),
        rroi: Number(rroiScore.toFixed(2)),
        scfUSD: Number(scfImpact.toFixed(0)),
        durationMs: Number(elapsedMs.toFixed(0))
      });

      console.log(`   ✓ SPI ${spiScore.toFixed(2)} | RROI ${rroiScore.toFixed(2)} | Runtime ${elapsedMs.toFixed(0)} ms`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        id: entry.id,
        entity: entry.entity,
        region: entry.region,
        sector: entry.sector,
        error: message
      });
      console.error(`   ✗ ${message}`);
    }
  }

  const summary = {
    mode,
    queue: path.basename(queueFile),
    total: queue.length,
    succeeded: successCount,
    failed: queue.length - successCount,
    successRate: Number(((successCount / queue.length) * 100).toFixed(1)),
    timestamp: new Date().toISOString()
  };

  await writeFile(outputPath, JSON.stringify({ summary, results }, null, 2), 'utf8');

  console.log('\n📄 Simulation summary saved to', outputPath);
  console.table(results.map(({ error, ...rest }) => rest));
  console.log('\nDone.');
}

function buildReportParameters(entry: QueueEntry, mode: string): ReportParameters {
  const now = new Date().toISOString();
  const baseCountry = entry.country === 'Multi-Region' ? 'Switzerland' : entry.country;
  const dealSize = entry.dealSizeUSD ? String(entry.dealSizeUSD) : '0';
  return {
    reportName: `NSIL Simulation ${entry.id}`,
    userName: 'Automation Runner',
    userDepartment: 'System Verification',
    skillLevel: 'expert',
    userCountry: baseCountry,
    userCity: entry.city ?? 'Simulation Hub',
    userTier: 'enterprise',
    organizationName: entry.entity,
    organizationType: entry.sector.includes('Authority') || entry.sector.includes('Board') ? 'Government Agency' : 'Enterprise',
    organizationSubType: entry.intent,
    region: entry.region,
    country: entry.country,
    industry: [entry.sector],
    customIndustry: '',
    tier: ['Global'],
    strategicIntent: [entry.intent],
    strategicMode: 'Expansion',
    problemStatement: entry.challenge,
    idealPartnerProfile: entry.desiredOutcome,
    analysisTimeframe: '12 Months',
    strategicObjectives: ['Secure financing', 'Mitigate execution risk'],
    relationshipStage: 'Exploration',
    dueDiligenceDepth: 'Preliminary',
    partnerCapabilities: ['capital structuring', 'implementation partner'],
    operationalPriority: 'Resilience',
    riskTolerance: 'medium',
    expansionTimeline: '0-6 Months',
    partnershipSupportNeeds: ['Strategy blueprint', 'Partner discovery'],
    selectedAgents: ['NSIL'],
    selectedModels: ['gemini-2.0-pro'],
    selectedModules: ['SPI', 'RROI', 'SEAM', 'Counterfactual'],
    analyticalModules: ['personas', 'counterfactual', 'motivation'],
    aiPersona: ['Skeptic', 'Advocate', 'Operator', 'Regulator', 'Accountant'],
    customAiPersona: '',
    reportLength: 'Comprehensive',
    reportComplexity: 'standard',
    collaborativeNotes: 'Automated NSIL harness execution.',
    outputFormat: 'full-report',
    letterStyle: 'executive',
    stakeholderPerspectives: ['executive'],
    includeCrossSectorMatches: true,
    matchCount: 5,
    partnerDiscoveryMode: true,
    searchScope: 'global',
    intentTags: ['simulation', mode],
    comparativeContext: [entry.region],
    additionalContext: entry.desiredOutcome,
    opportunityScore: { totalScore: 72, marketPotential: 78, riskFactors: 28 },
    id: `SIM-${entry.id}-${mode}`,
    createdAt: now,
    status: mode,
    missionRequestSummary: entry.challenge,
    assistanceBackground: 'Simulation dataset',
    intakeGuidanceMode: 'expert',
    organizationAddress: `${entry.city ?? 'Capital'}, ${entry.country}`,
    organizationWebsite: 'https://example.org',
    revenueBand: '>$50M',
    headcountBand: '500-1000',
    yearsOperation: '10+',
    decisionAuthority: 'Board Mandate',
    industryClassification: entry.sector,
    organizationSize: 'Large',
    contactEmail: 'automation@nexus.local',
    contactPhone: '+0 0000 0000',
    organizationDescription: entry.challenge,
    nicheAreas: [entry.sector],
    strategicLens: ['Resilience'],
    priorityThemes: ['Climate', 'Capital access'],
    targetCounterpartType: ['Government', 'Investor'],
    successMetrics: ['Time-to-close', 'Capital efficiency'],
    targetIncentives: ['Tax holidays'],
    partnerPersonas: ['Investor', 'Government'],
    stakeholderAlignment: ['Cabinet'],
    alignmentPlan: 'Weekly reporting cadence',
    executiveSponsor: 'Automation Office',
    partnerReadinessLevel: 'Moderate',
    partnerFitCriteria: ['Regulatory compliance'],
    relationshipGoals: ['Signed MOU', 'Capital mobilized'],
    partnerEngagementNotes: 'Simulation script scenario',
    fundingSource: 'Blended',
    procurementMode: 'Direct negotiation',
    politicalSensitivities: ['High visibility'],
    dealSize: dealSize,
    customDealSize: ''
  };
}

function parseArgs(args: string[]): Record<string, string> {
  return args.reduce<Record<string, string>>((acc, curr, idx) => {
    if (curr.startsWith('--')) {
      const key = curr.slice(2);
      const value = args[idx + 1] && !args[idx + 1].startsWith('--') ? args[idx + 1] : 'true';
      acc[key] = value;
    }
    return acc;
  }, {});
}
