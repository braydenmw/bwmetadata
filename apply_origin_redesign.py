#!/usr/bin/env python3
"""
1. Remove OUR MISSION section
2. Remove old Photo Banner ("Built from the ground up")
3. Rebuild OUR ORIGIN with landscape photo as background, two-column equal text
"""

import os

FILE = os.path.join(os.path.dirname(__file__), 'components', 'CommandCenter.tsx')

with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original file: {len(lines)} lines")

# Find boundaries
mission_start = None
banner_end = None
origin_start = None
origin_end = None

for i, line in enumerate(lines):
    if '{/* OUR MISSION' in line and 'opening statement' in line:
        mission_start = i
    if mission_start and not banner_end and 'Try BW AI Search' in line:
        # Find the closing of the banner section after this button
        pass
    if '{/* OUR ORIGIN */}' in line:
        origin_start = i
    if '{/* Personal Story' in line:
        # Origin text ends just before this
        pass
    if origin_start and '{/* THE PLATFORM' in line:
        origin_end = i
        break

# More precise: find each section's </section> closing
# Mission: starts at mission_start, find its </section>
for i in range(mission_start, len(lines)):
    if '</section>' in lines[i] and i > mission_start + 2:
        mission_end = i + 1
        break

print(f"OUR MISSION: lines {mission_start+1} to {mission_end}")

# Photo Banner: starts right after mission_end
banner_start = None
for i in range(mission_end, len(lines)):
    if '{/* Photo Banner */}' in lines[i]:
        banner_start = i
        break

for i in range(banner_start + 1, len(lines)):
    if '</section>' in lines[i]:
        banner_end = i + 1
        break

print(f"Photo Banner: lines {banner_start+1} to {banner_end}")

# OUR ORIGIN: starts at origin_start
for i in range(origin_start + 1, len(lines)):
    if '</section>' in lines[i]:
        origin_section_end = i + 1
        break

print(f"OUR ORIGIN: lines {origin_start+1} to {origin_section_end}")

# New section: OUR ORIGIN with background photo, equal two-column layout
new_origin = '''
            {/* OUR ORIGIN — Full background hero with story */}
            <section id="mission" className="relative pt-36 pb-16 px-4 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&q=80" 
                    alt="Regional landscape" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-900/85" />
                <div className="relative z-10 max-w-5xl mx-auto">
                    <p className="text-blue-400 uppercase tracking-[0.3em] text-sm mb-3 font-bold">OUR ORIGIN</p>
                    <h2 className="text-3xl md:text-4xl font-light mb-8 text-white">The Story of BWGA</h2>
                    <div className="grid md:grid-cols-2 gap-x-10 text-sm text-slate-300 leading-relaxed mb-8">
                        <div className="space-y-4">
                            <p>
                                BWGA wasn&rsquo;t founded in a glass skyscraper in New York or London. It was born on the edge of the developing world, in a small coastal city where the gap between potential and opportunity is painfully clear.
                            </p>
                            <p>
                                <strong className="text-white">BW Global Advisory (BWGA)</strong> is an advisory practice built from firsthand experience in regional communities &mdash; places that hold real economic potential but lack the tools, connections, and institutional visibility to compete for global investment on equal footing.
                            </p>
                            <p>
                                We watched regional leaders &mdash; mayors, entrepreneurs, councils &mdash; work tirelessly to attract investment. They had the vision, the drive, the raw assets.
                            </p>
                            <p>
                                From that observation came the question: what if you could build a system that internalised all of that methodology &mdash; 60+ years of documented practice across 150 countries &mdash; and made it available to anyone, anywhere, instantly?
                            </p>
                        </div>
                        <div className="space-y-4 mt-4 md:mt-0">
                            <p>
                                The practice exists because of a simple observation: <strong className="text-white">every &ldquo;new idea&rdquo; is old somewhere.</strong> The 1963 Philippine Integrated Socioeconomic Plan, the 1978 Region 7 Five-Year Development Plan, Special Economic Zones across 80+ countries, PPP frameworks across 150+ nations &mdash; they all follow the same methodology. Growth poles. Investment incentives. Sectoral planning. Infrastructure corridors. The names update. The practice persists. <strong className="text-white">The past is the solution library.</strong>
                            </p>
                            <p>
                                <strong className="text-white">BWGA Intelligence AI is the answer.</strong> It is the technology arm of BW Global Advisory. Not a chatbot. Not a search engine. Not a lookup table. It is a complete digital boardroom &mdash; a system that reasons through investment, trade, and development problems using the same depth of analysis that previously required a team of senior consultants, weeks of research, and hundreds of thousands of dollars.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-10 max-w-4xl">
                        That&rsquo;s not a criticism &mdash; it&rsquo;s the insight that made this system possible. If the answers already exist, scattered across decades and continents, then the real problem isn&rsquo;t knowledge. It&rsquo;s access. It&rsquo;s synthesis. It&rsquo;s the ability to take what worked in Shenzhen in 1980, in Penang in 1995, in Medell&iacute;n in 2004, and translate it into a strategic roadmap for a regional council staring at a blank page today.
                    </p>

                    {/* Personal Story — Brayden Walls */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-sm p-8 mb-8">
                        <h3 className="text-2xl font-semibold text-white mb-6">Who I am &mdash; the founder and sole developer</h3>
                        
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="md:w-2/3">
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    Hey everyone, I&rsquo;m Brayden Walls, the developer behind <strong className="text-white">BW NEXUS AI</strong>, and I&rsquo;m thrilled to finally share this with the world. For the first time, I&rsquo;m lifting the curtain on what we&rsquo;ve built &mdash; a groundbreaking neuro-symbolic intelligence system that&rsquo;s not just another AI tool, but a complete rethinking of how machines can reason like humans.
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    For more than 16 months, I&rsquo;ve been living, researching, and building in a place that inspired everything you see here &mdash; the Philippines. Not in a lab. Not in a corporate office. On the ground, in the communities where economic potential is enormous but the tools to unlock it simply don&rsquo;t exist.
                                </p>
                            </div>
                            <div className="md:w-1/3">
                                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&q=80" alt="Regional landscape" className="w-full h-64 md:h-full object-cover rounded-sm shadow-lg" />
                            </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            I watched the same pattern repeat everywhere: ambitious businesses exploring new frontiers with incomplete information, regional governments eager for partnerships but unable to translate their advantages into investor language, unproductive meetings built on mismatched expectations. Places like Mindanao, regional Australia, communities across the Pacific &mdash; they all wanted the same thing: to be seen, to be understood, to have a fair shot.
                        </p>

                        <p className="text-sm text-slate-300 leading-relaxed mb-6">
                            So I stopped waiting for someone else to build it. I taught myself to code, studied every economic development framework I could find, and spent over a year turning that knowledge into software. What came out the other side isn&rsquo;t a chatbot or a dashboard &mdash; it&rsquo;s a complete reasoning system. One that thinks through problems the way a team of senior consultants would, but faster, cheaper, and available to anyone. What you&rsquo;re about to see below is what I built, how it works, and why nothing else like it exists.
                        </p>

                        <div className="bg-white/10 border border-white/20 rounded-sm p-6">
                            <p className="text-base text-white leading-relaxed italic mb-3">
                                &ldquo;Every &lsquo;new idea&rsquo; is old somewhere. The child learns what the parent already knows. The past isn&rsquo;t historical interest. The past is the solution library.&rdquo;
                            </p>
                            <p className="text-slate-400 text-sm font-medium">&mdash; Brayden Walls, Founder &amp; Sole Developer</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={() => scrollToSection('bwai-search')}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 border-2 border-blue-500 rounded-full text-white text-base font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                        >
                            <Search size={18} />
                            Try BW AI Search
                        </button>
                    </div>
                </div>
            </section>

'''

# Work backwards to preserve line numbers
# 1. Remove OUR ORIGIN section (origin_start to origin_section_end)
del lines[origin_start:origin_section_end]
print(f"Removed OUR ORIGIN: {origin_section_end - origin_start} lines")

# 2. Remove Photo Banner (banner_start to banner_end) — adjusted for deletion above
# But banner is before origin, so no adjustment needed since we deleted after it
# Wait — origin is AFTER banner. So deleting origin first doesn't affect banner indices.
# Actually let me re-check: mission < banner < origin. We deleted origin. Now delete banner.
del lines[banner_start:banner_end]
print(f"Removed Photo Banner: {banner_end - banner_start} lines")

# 3. Replace OUR MISSION with new OUR ORIGIN (mission_start to mission_end)
del lines[mission_start:mission_end]
print(f"Removed OUR MISSION: {mission_end - mission_start} lines")

# 4. Insert new origin at mission_start
new_lines = new_origin.split('\n')
new_lines = [l + '\n' for l in new_lines]
for i, line in enumerate(new_lines):
    lines.insert(mission_start + i, line)

print(f"Inserted new OUR ORIGIN: {len(new_lines)} lines")

with open(FILE, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"File is now {len(lines)} lines")
print("Done!")
