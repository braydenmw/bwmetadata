#!/usr/bin/env python3
import re

with open(r'c:\Users\brayd\Downloads\bw-nexus-ai-final-11\components\MainCanvas.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# Find all lines that have const declarations or function declarations
print("Top-level statements (at indent 0-4):")
for i, line in enumerate(lines[83:600], start=84):  # Start after MainCanvas declaration
    stripped = line.lstrip()
    indent = len(line) - len(stripped)
    
    # Look for statements that start a new block
    if (stripped.startswith('const ') or stripped.startswith('const[') or 
        stripped.startswith('const {') or stripped.startswith('const(') or
        stripped.startswith('const[') or stripped.startswith('const[') or
        stripped.startswith('const [') or 
        line.strip().startswith('useEffect') or line.strip().startswith('const')):
        
        if indent <= 4 and '{' in line:
            open_count = line.count('{')
            close_count = line.count('}')
            if open_count != close_count:
                print(f"Line {i}: indent={indent}, {{ {open_count} }} {close_count}")
                print(f"  {line.rstrip()[:100]}")
