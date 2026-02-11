#!/usr/bin/env python3
"""Merge WHAT WE BUILT into A WORLD FIRST by removing the redundant section,
   killing the duplicate number grid, and rewriting the product cards intro."""

filepath = r"c:\Users\brayd\Downloads\bw-nexus-ai-final-11\components\CommandCenter.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original line count: {len(lines)}")

# === STEP 1: Find and remove WHAT WE BUILT section (from comment to closing </section>) ===
wb_start = None
wb_end = None
for i, line in enumerate(lines):
    if '{/* WHAT WE BUILT' in line:
        wb_start = i
    if wb_start is not None and wb_end is None:
        if '</section>' in line and i > wb_start + 5:
            wb_end = i
            break

if wb_start is None or wb_end is None:
    print(f"ERROR: Could not find WHAT WE BUILT boundaries. start={wb_start}, end={wb_end}")
    exit(1)

# Also remove trailing blank line after </section> if present
if wb_end + 1 < len(lines) and lines[wb_end + 1].strip() == '':
    wb_end += 1

print(f"WHAT WE BUILT: removing lines {wb_start+1} to {wb_end+1}")
lines = lines[:wb_start] + lines[wb_end+1:]

# === STEP 2: Remove the duplicate Key Numbers grid ===
# Find "{/* Key Numbers */}" 
kn_start = None
kn_end = None
for i, line in enumerate(lines):
    if '{/* Key Numbers */}' in line:
        kn_start = i
        break

if kn_start is not None:
    # Find the closing </div> of the grid (ends with "</div>")
    brace_depth = 0
    for i in range(kn_start + 1, min(kn_start + 30, len(lines))):
        if 'className="grid grid-cols-2 md:grid-cols-4' in lines[i]:
            # Count div opens/closes from here
            for j in range(i, min(i + 20, len(lines))):
                brace_depth += lines[j].count('<div')
                brace_depth -= lines[j].count('</div>')
                if brace_depth <= 0:
                    kn_end = j
                    break
            break
    
    if kn_end is not None:
        # Also remove trailing blank line
        if kn_end + 1 < len(lines) and lines[kn_end + 1].strip() == '':
            kn_end += 1
        print(f"Key Numbers grid: removing lines {kn_start+1} to {kn_end+1}")
        lines = lines[:kn_start] + lines[kn_end+1:]
    else:
        print("WARNING: Could not find Key Numbers grid end")
else:
    print("WARNING: Could not find Key Numbers comment")

# === STEP 3: Rewrite the product cards intro ===
# Find "WHAT ALL OF THIS PRODUCES" and replace with better intro
prod_start = None
for i, line in enumerate(lines):
    if '{/* What All of This Produces */}' in line or 'WHAT ALL OF THIS PRODUCES' in line:
        if prod_start is None:
            prod_start = i
            break

if prod_start is not None:
    # Find the end of the intro paragraph (before the grid of cards starts)
    intro_end = None
    for i in range(prod_start, min(prod_start + 10, len(lines))):
        if 'className="grid grid-cols-2 gap-3"' in lines[i]:
            intro_end = i
            break
    
    if intro_end is not None:
        new_intro = [
            '                    {/* What This Actually Means For You */}\n',
            '                    <div className="mb-6">\n',
            '                        <p className="text-sm text-blue-600 uppercase tracking-wider font-bold mb-2">WHAT THIS ACTUALLY MEANS FOR YOU</p>\n',
            '                        <p className="text-base text-slate-700 mb-3 max-w-3xl">You search a location. The system assembles an intelligence brief in seconds. You submit your project through a structured intake. The system validates, debates, scores, stress-tests, models human reactions, and produces a full strategic analysis \u2014 with board-ready documentation, traceable evidence, and confidence levels \u2014 in a single session.</p>\n',
            '                        <p className="text-base text-slate-700 mb-5 max-w-3xl">Four products deliver this. Each draws from the same 22-engine intelligence core \u2014 the same formulas, the same methodology, the same audit trails:</p>\n',
        ]
        print(f"Product intro: replacing lines {prod_start+1} to {intro_end}")
        lines = lines[:prod_start] + new_intro + lines[intro_end:]
    else:
        print("WARNING: Could not find product grid start")
else:
    print("WARNING: Could not find product cards section")

# === STEP 4: Update nav link ===
for i, line in enumerate(lines):
    if "scrollToSection('system-overview')" in line and 'The System' in line:
        # Remove this nav link entirely since the section no longer exists
        # Actually, redirect it to 'technology' since that's where the merged content lives
        lines[i] = line.replace("scrollToSection('system-overview')", "scrollToSection('technology')").replace('The System', 'The Platform')
        print(f"Nav link updated at line {i+1}")
        break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"New line count: {len(lines)}")
print("DONE")
