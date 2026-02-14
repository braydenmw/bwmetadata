import { AutonomousOrchestrator } from '../../services/AutonomousOrchestrator';
import { ReportParameters } from '../../types';

// Example: Autonomous loop for a sample problem
async function runDemo() {
  const problem = 'Regional supply chain disruption';
  const context = { region: 'Midwest', sector: 'Manufacturing', urgency: 'high' };
  const params: ReportParameters = {
    organizationName: 'DemoCorp',
    industry: ['Manufacturing'],
    region: 'Midwest',
    // ...fill in other required ReportParameters fields as needed
  } as any;

  const options: { autoAct: boolean; urgency: 'immediate' | 'normal' | 'low' } = { autoAct: true, urgency: 'immediate' };

  const result = await AutonomousOrchestrator.solveAndAct(problem, context, params, options);
  console.log('AUTONOMOUS LOOP RESULT:', JSON.stringify(result, null, 2));
}

runDemo();

