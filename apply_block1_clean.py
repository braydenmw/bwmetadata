#!/usr/bin/env python3
"""
Replace Block 1 with a clean, professional design matching the rest of the narrative blocks.
"""

import os

FILE = os.path.join(os.path.dirname(__file__), 'components', 'CommandCenter.tsx')

with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original file: {len(lines)} lines")

# Find Block 1 start and end
block1_start = None
block1_end = None
for i, line in enumerate(lines):
    if '{/* Block 1: The Problem' in line:
        block1_start = i
    if block1_start and i > block1_start and '{/* Block 2:' in line:
        block1_end = i
        break

print(f"Block 1: lines {block1_start+1} to {block1_end}")

new_block1 = '''                    {/* Block 1: The Problem — Photo left, narrative right */}
                    <div className="flex flex-col md:flex-row gap-0 items-stretch mb-8">
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80" 
                                alt="Global intelligence data" 
                                className="w-full h-full min-h-[320px] object-cover" 
                            />
                        </div>
                        <div className="md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                Why I built this: the problem with AI today.
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Most AI today &mdash; the language models behind ChatGPT, Claude, and others &mdash; is probabilistic. It guesses based on patterns. It can hallucinate facts, silently bias results, or give a different answer every time you ask the same question. It sounds confident, but it can&rsquo;t show its reasoning. And when the stakes are real &mdash; investments, policy decisions, people&rsquo;s livelihoods &mdash; guessing isn&rsquo;t good enough.
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed mb-5">
                                I built BW NEXUS AI because I believed intelligence should be provable. Not generated. Not predicted. <strong>Proven.</strong> Every recommendation traceable, every output repeatable, every claim defensible. That&rsquo;s what deterministic means &mdash; and that&rsquo;s what I set out to create.
                            </p>

                            {/* Clean two-column comparison */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="border border-slate-200 rounded-sm p-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language-First AI</p>
                                    <ul className="space-y-1.5 text-xs text-slate-600">
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Hallucinates facts</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Hidden reasoning</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Inconsistent outputs</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> No audit trail</li>
                                        <li className="flex items-start gap-2"><span className="text-slate-400 mt-px">&bull;</span> Silent bias</li>
                                    </ul>
                                </div>
                                <div className="border-2 border-blue-500 rounded-sm p-4 bg-blue-50/50">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">BW NEXUS AI</p>
                                    <ul className="space-y-1.5 text-xs text-slate-700">
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-px flex-shrink-0" /> Validates every input</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-px flex-shrink-0" /> Adversarial debate</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-px flex-shrink-0" /> Deterministic scoring</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-px flex-shrink-0" /> Full audit trail</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-blue-500 mt-px flex-shrink-0" /> Ethical enforcement</li>
                                    </ul>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowFormulas(true)}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                            >
                                <GitBranch size={16} />
                                View Full Architecture &amp; 38+ Formulas &rarr;
                            </button>
                        </div>
                    </div>

'''

# Replace
new_lines = new_block1.split('\n')
new_lines = [l + '\n' for l in new_lines]

del lines[block1_start:block1_end]
for i, line in enumerate(new_lines):
    lines.insert(block1_start + i, line)

print(f"Replaced {block1_end - block1_start} lines with {len(new_lines)} lines")

with open(FILE, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"File is now {len(lines)} lines")
print("Done!")
