#!/usr/bin/env python3
with open(r'c:\Users\brayd\Downloads\bw-nexus-ai-final-11\components\MainCanvas.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

balance = 0
first_negative_line = None
for i, line in enumerate(lines, 1):
    for char in line:
        if char == '{': balance += 1
        elif char == '}': balance -= 1
    if balance < 0 and first_negative_line is None:
        first_negative_line = i
        print(f"First line where balance goes negative: {i}")
        print(f"Balance: {balance}")
        print(f"Content: {line.rstrip()}")
        # Show surrounding context
        print("\nContext:")
        for j in range(max(0, i-4), min(len(lines), i+3)):
            print(f"  {j+1}: {lines[j].rstrip()[:100]}")
        break

if first_negative_line is None:
    print(f"Never goes negative. Final balance: {balance}")
    if balance > 0:
        print(f"Missing {balance} closing braces")
else:
    print(f"First imbalance at line {first_negative_line}, balance ={balance}")
