#!/usr/bin/env python3
"""
1. Merge the photo banner into the FOUR PRODUCTS section as a background image
2. Remove all '(N lines)' and '(N,NNN lines)' references from the file
"""

import os
import re

FILE = os.path.join(os.path.dirname(__file__), 'components', 'CommandCenter.tsx')

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
print(f"Original file: {len(lines)} lines")

# ─── STEP 1: Remove all (N lines) references ───
# Patterns:
#   (994 lines)  ->  remove
#   (994 lines, <span...>file</span>)  ->  (<span...>file</span>)
#   (1,307 lines, <span...>file</span>)  ->  (<span...>file</span>)
#   (1,307 lines)  ->  remove

# First: handle "(N lines, <span" pattern — remove "N lines, " but keep the rest
# Pattern: (994 lines, <span -> (<span
content = re.sub(r'\((\d+,?\d*)\s+lines,\s+(<span)', r'(\2', content)

# Next: handle standalone (N lines) — remove entirely
# But be careful not to match things like "(5 dependency levels)"
# Pattern: space + (N lines) or (N,NNN lines) 
content = re.sub(r'\s*\(\d+,?\d*\s+lines\)', '', content)

# Also handle the proof popup audit trail items that have "(N lines)." at end
# Pattern: '(818 lines).' -> '.'  (already handled by above, the period stays after)

# Count changes
original_content_len = len(content.split('\n'))
print(f"After removing (N lines) references: {original_content_len} lines")

# ─── STEP 2: Merge banner into products section ───
# Find and remove the standalone banner div (lines ~620-623 area)
# Pattern: <div className="w-full h-28...">...</div>
banner_pattern = r'''            <div className="w-full h-28 md:h-36 relative overflow-hidden">\s*<img src="https://images\.unsplash\.com/photo-1553877522-43269d4ea984[^"]*"[^/]*/>\s*<div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-900/20" />\s*</div>'''

# Check if banner exists
if re.search(banner_pattern, content):
    content = re.sub(banner_pattern, '', content)
    print("Removed standalone banner")
else:
    print("Banner pattern not found, trying line-based approach")
    lines2 = content.split('\n')
    for i, line in enumerate(lines2):
        if 'photo-1553877522-43269d4ea984' in line:
            # Find the enclosing div — go back to find opening
            start = i
            while start > 0 and 'w-full h-28' not in lines2[start]:
                start -= 1
            # Find closing
            end = i
            while end < len(lines2) and '</div>' not in lines2[end]:
                end += 1
            end += 1  # include the </div>
            print(f"Removing banner lines {start+1} to {end}")
            del lines2[start:end]
            content = '\n'.join(lines2)
            break

# Now change the products section to have the photo as background
# Old: <section className="py-12 px-4 bg-slate-100">
# New: <section className="relative py-16 px-4 min-h-[600px]"> with bg image
old_products_section = '<section className="py-12 px-4 bg-slate-100">'
new_products_section = '''<section className="relative py-16 px-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&q=80" alt="Intelligence technology" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/80 to-slate-900/90" />'''

if old_products_section in content:
    content = content.replace(old_products_section, new_products_section, 1)
    print("Added background image to products section")
else:
    print("ERROR: Could not find products section opening tag")

# Update the text colors in the products section header to be white (since bg is now dark)
# Change "text-blue-600" label, "text-slate-900" heading, "text-slate-600" paragraph
# We need to be targeted — only in the products section header area

# The section content div
old_header = '''<div className="max-w-5xl mx-auto">
                    <p className="text-blue-600 uppercase tracking-[0.3em] text-sm mb-6 font-bold text-center">FOUR WAYS TO ACCESS INTELLIGENCE</p>
                    <h2 className="text-3xl md:text-4xl font-light text-center leading-tight mb-4 text-slate-900">
                        One Engine. Four Interfaces.
                    </h2>
                    <p className="text-lg text-slate-600 text-center mb-8 max-w-3xl mx-auto">
                        Everything feeds into the same core pipeline &mdash; the same 6-phase NSIL architecture, the same 38+ formulas, the same adversarial debate. We just made it accessible in four different ways depending on what you need.
                    </p>'''

new_header = '''<div className="max-w-5xl mx-auto relative z-10">
                    <p className="text-blue-400 uppercase tracking-[0.3em] text-sm mb-6 font-bold text-center">FOUR WAYS TO ACCESS INTELLIGENCE</p>
                    <h2 className="text-3xl md:text-4xl font-light text-center leading-tight mb-4 text-white">
                        One Engine. Four Interfaces.
                    </h2>
                    <p className="text-lg text-slate-300 text-center mb-10 max-w-3xl mx-auto">
                        Everything feeds into the same core pipeline &mdash; the same 6-phase NSIL architecture, the same 38+ formulas, the same adversarial debate. We just made it accessible in four different ways depending on what you need.
                    </p>'''

if old_header in content:
    content = content.replace(old_header, new_header, 1)
    print("Updated products header text colors for dark background")
else:
    print("ERROR: Could not find products header")

# Update the product cards to have translucent dark styling instead of white
# Old card style: bg-white border-2 border-slate-200 rounded-xl p-6
# New card style: bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6

content = content.replace(
    '<div className="bg-white border-2 border-slate-200 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">\n                                    <Search size={20} className="text-blue-600" />',
    '<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-500/30 border border-blue-400/40 rounded-lg flex items-center justify-center">\n                                    <Search size={20} className="text-blue-300" />',
    1
)

content = content.replace(
    '<div className="bg-white border-2 border-slate-200 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">\n                                    <FileCheck size={20} className="text-blue-600" />',
    '<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-500/30 border border-blue-400/40 rounded-lg flex items-center justify-center">\n                                    <FileCheck size={20} className="text-blue-300" />',
    1
)

content = content.replace(
    '<div className="bg-white border-2 border-slate-200 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-indigo-100 border border-indigo-300 rounded-lg flex items-center justify-center">\n                                    <Users size={20} className="text-indigo-600" />',
    '<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-indigo-500/30 border border-indigo-400/40 rounded-lg flex items-center justify-center">\n                                    <Users size={20} className="text-indigo-300" />',
    1
)

content = content.replace(
    '<div className="bg-white border-2 border-slate-200 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">\n                                    <GitBranch size={20} className="text-blue-600" />',
    '<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">\n                            <div className="flex items-center gap-3 mb-4">\n                                <div className="w-10 h-10 bg-blue-500/30 border border-blue-400/40 rounded-lg flex items-center justify-center">\n                                    <GitBranch size={20} className="text-blue-300" />',
    1
)

print("Updated 4 product cards to glass-morphism style")

# Update card text colors — card titles from text-slate-900 to text-white
# and card body text from text-slate-600 to text-slate-300
# and card subtitle text-blue-600 to text-blue-400

# BW AI Search card
content = content.replace(
    '<h3 className="text-base font-semibold text-slate-900">BW AI Search</h3>\n                                    <p className="text-sm font-semibold text-blue-600">The Gateway.</p>',
    '<h3 className="text-base font-semibold text-white">BW AI Search</h3>\n                                    <p className="text-sm font-semibold text-blue-400">The Gateway.</p>',
    1
)

content = content.replace(
    '<h3 className="text-base font-semibold text-slate-900">Live Report</h3>\n                                    <p className="text-sm font-semibold text-blue-600">The War Room.</p>',
    '<h3 className="text-base font-semibold text-white">Live Report</h3>\n                                    <p className="text-sm font-semibold text-blue-400">The War Room.</p>',
    1
)

content = content.replace(
    '<h3 className="text-base font-semibold text-slate-900">BW Consultant</h3>\n                                    <p className="text-sm font-semibold text-indigo-600">The Partner.</p>',
    '<h3 className="text-base font-semibold text-white">BW Consultant</h3>\n                                    <p className="text-sm font-semibold text-indigo-400">The Partner.</p>',
    1
)

content = content.replace(
    '<h3 className="text-base font-semibold text-slate-900">Document Factory</h3>\n                                    <p className="text-sm font-semibold text-blue-600">The Closer.</p>',
    '<h3 className="text-base font-semibold text-white">Document Factory</h3>\n                                    <p className="text-sm font-semibold text-blue-400">The Closer.</p>',
    1
)

print("Updated card title colors")

# Update card body text colors (only in the products section cards)
# We need to be selective. The pattern is specific enough:
# "text-sm text-slate-600 leading-relaxed mb-3" in each card description
# There are exactly 4 near lines 648, 667, 684, 700...
# And the powered-by lines

# Card descriptions
lines3 = content.split('\n')
in_products_cards = False
products_card_end = None
for i, line in enumerate(lines3):
    if 'FOUR WAYS TO ACCESS INTELLIGENCE' in line:
        in_products_cards = True
    if in_products_cards and 'BW AI SEARCH' in line and 'Location Intelligence' in line:
        in_products_cards = False
        products_card_end = i
        break
    if in_products_cards:
        # Update description text color
        lines3[i] = line.replace(
            'text-sm text-slate-600 leading-relaxed mb-3',
            'text-sm text-slate-300 leading-relaxed mb-3'
        )
        # Update "powered by" text colors
        lines3[i] = lines3[i].replace(
            'text-xs text-blue-600 font-medium',
            'text-xs text-blue-400 font-medium'
        )
        lines3[i] = lines3[i].replace(
            'text-xs text-indigo-600 font-medium',
            'text-xs text-indigo-400 font-medium'
        )

content = '\n'.join(lines3)
print("Updated card body text colors")

# ─── WRITE FILE ───
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

final_lines = content.split('\n')
print(f"File is now {len(final_lines)} lines")
print("Done!")
