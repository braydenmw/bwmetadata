export async function solveAndAct(problem: string, context: any, params: any, options: any) {
  const res = await fetch('/api/autonomous/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, context, params, options })
  });
  if (!res.ok) {
    throw new Error(`Autonomous API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export default { solveAndAct };