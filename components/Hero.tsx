
import React, { useEffect, useState } from 'react';
import { Radio, ScanLine, Users, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
        <section className="relative w-full overflow-hidden bg-bw-light">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-bw-light to-white" />
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80"
                    alt="Urban Complexity"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.06] grayscale"
                />
                <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-bw-gold/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-bw-navy/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Narrative */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-3">
                                <span className="h-px w-10 bg-bw-gold/70" aria-hidden="true" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-bw-navy/70">
                                    Built boots-on-the-ground â€¢ 16 months â€¢ 200 years decoded â€¢ NSIL Brain
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-bw-navy leading-[1.05]">
                                Beyond Data. Beyond Consulting.
                                <span className="block mt-3 text-bw-gold">The Physics of Invisible Economies.</span>
                            </h1>

                            <div className="space-y-5 max-w-3xl text-[15px] sm:text-lg text-slate-700 leading-[1.85]">
                                <p>
                                    Regional cities carry real assets, real labor, and compounding growthâ€”but they are consistently misread as risk because their reality is hard to translate into global-grade proof.
                                </p>
                                <p className="text-bw-navy font-medium">
                                    Regional markets are not chaotic; they are simply complex. They operate on a different frequency than global capitals, driven by relationships and informal networks.
                                </p>
                                <p>
                                    We architected the <strong className="text-bw-navy">Regional Intelligence Core</strong> to decode this frequency. It is not a passive consultancy tool; it is a deterministic engine designed to translate the specific â€œblind spotsâ€ of regional expansion into the language of global capital.
                                </p>
                                <p>
                                    The mission is straightforward: reduce the high cost of trust, remove outside influence, and give every region the same level of analytical rigor that global hubs take for grantedâ€”at a cost that makes intelligence accessible.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-white/70 border border-black/5 rounded-xl">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-bw-navy/60 mb-2">Built To Execute</div>
                                    <div className="text-sm text-slate-700 leading-relaxed">
                                        Partner Discovery, Symbiotic Matchmaking (SPI), Document Suite (LoI, MoU, Proposal), Multiâ€‘Scenario Simulation.
                                    </div>
                                </div>
                                <div className="p-5 bg-white/70 border border-black/5 rounded-xl">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-bw-navy/60 mb-2">Always-On Guardrails</div>
                                    <div className="text-sm text-slate-700 leading-relaxed">
                                        Earlyâ€‘Warning Alerts, Due Diligence Intelligence, Relocation & TCO, NSIL/API Export.
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-bw-navy text-white rounded-full border border-bw-navy/20 text-[11px] font-bold uppercase tracking-widest">
                                    <Users className="w-3.5 h-3.5 text-bw-gold" aria-hidden="true" /> Partner Discovery
                                </span>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-bw-navy text-white rounded-full border border-bw-navy/20 text-[11px] font-bold uppercase tracking-widest">
                                    <Activity className="w-3.5 h-3.5 text-bw-gold" aria-hidden="true" /> Simulation
                                </span>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-bw-navy text-white rounded-full border border-bw-navy/20 text-[11px] font-bold uppercase tracking-widest">
                                    <AlertTriangle className="w-3.5 h-3.5 text-bw-gold" aria-hidden="true" /> Earlyâ€‘Warning
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Signal Panel */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
                            className="space-y-6"
                        >
                            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden">
                                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ScanLine className="w-4 h-4 text-bw-gold" />
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-bw-navy/70">Signal Panel</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-bw-navy/60">Parsing Economic Physicsâ€¦</span>
                                </div>

                                <div className="relative p-6 bg-bw-navy text-white">
                                    {/* Scan accent */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b49b67 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                                    <div
                                        className="absolute left-0 right-0 border-t-2 border-bw-gold/60 shadow-[0_0_18px_rgba(180,155,103,0.25)] transition-all duration-100 ease-linear"
                                        style={{ top: `${scanLine}%` }}
                                    />

                                    <div className="relative">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-bold">System Active</div>
                                            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/70">
                                                <span className="w-2 h-2 bg-bw-gold rounded-full animate-pulse" /> Live
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Translation</div>
                                                <div className="mt-1 text-sm text-white/90">Local reality â†’ Global metrics</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Rigour</div>
                                                <div className="mt-1 text-sm text-white/90">Deterministic, auditable logic</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Coverage</div>
                                                <div className="mt-1 text-sm text-white/90">Engines + dossiers + workbench</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">Purpose</div>
                                                <div className="mt-1 text-sm text-white/90">Regional development only</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 border border-black/5 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-bw-gold font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                                    <Radio className="w-4 h-4" /> The Core Mandate
                                </h3>
                                <p className="text-bw-navy text-sm leading-relaxed">
                                    â€œWe don't guess. We calculate. By giving regional markets a standardized data language, we give them a fair chance to compete for global capital.â€
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-14 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-bw-navy/60">
                    <span className="inline-block h-px w-10 bg-bw-navy/15" aria-hidden="true" />
                    <span>Scroll to explore the architecture</span>
                </div>
            </div>
        </section>
  );
};

