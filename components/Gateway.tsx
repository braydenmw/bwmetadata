
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ReportParameters, SkillLevel } from '../types';
import { ORGANIZATION_TYPES, ORGANIZATION_SUBTYPES, REGIONS_AND_COUNTRIES, INDUSTRIES, STRATEGIC_OBJECTIVES, STRATEGIC_LENSES, INDUSTRY_NICHES, INTELLIGENCE_CATEGORIES } from '../constants';
import { Zap, BrainCircuit, CheckCircle, Globe, X, Network, ShieldCheck, Users, FileText, MapPin, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { ManualInputModal } from './ManualInputModal';
import { MissionCalibrationStep } from './MissionCalibrationStep';

interface GatewayProps {
    params: ReportParameters;
    onUpdate: (params: ReportParameters) => void;
    onComplete: () => void;
}

// --- DYNAMIC BENCHMARK DATABASE ---
const DYNAMIC_BENCHMARKS: Record<string, string[]> = {
    'Technology (Software/Hardware)': [
        "Silicon Valley (USA) - Global Innovation Capital",
        "Tel Aviv (Israel) - Cyber & Startup Ecosystem",
        "Bangalore (India) - IT Outsourcing Hub",
        "Shenzhen (China) - Hardware Innovation",
        "Berlin (Germany) - European Tech Hub",
        "Estonia - Digital Governance Model",
        "Singapore - Smart City Benchmark"
    ],
    'Default': [
        "Singapore - Global Business Hub",
        "Dubai (UAE) - Trade & Logistics",
        "London (UK) - Financial Center",
        "New York (USA) - Corporate HQ",
        "Estonia - Digital Governance",
        "Silicon Valley (USA) - Tech Innovation",
        "Shanghai (China) - Commerce & Trade"
    ]
};

// Strategic Intent Tags
const INTENT_TAGS = [
    "New Market Entry",
    "Relocation / HQ Shift",
    "Expansion (Organic)",
    "Mergers & Acquisitions",
    "Joint Venture / Partnership",
    "Supply Chain Resilience",
    "R&D Collaboration",
    "Investment Attraction"
];

// Helper for Searchable Multi-Select
const MegaMultiSelect = ({ 
    options, 
    selected, 
    onToggle, 
    label, 
    placeholder 
}: { 
    options: string[], 
    selected: string[], 
    onToggle: (val: string) => void, 
    label: string, 
    placeholder: string 
}) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => options.filter(o => o.toLowerCase().includes(search.toLowerCase())), [options, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-bold text-stone-800 mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {selected.map(val => (
                    <span key={val} className="px-2 py-1 bg-stone-800 text-white text-xs rounded flex items-center gap-1 shadow-sm">
                        {val} <button onClick={() => onToggle(val)} className="hover:text-red-300 ml-1">×</button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <input 
                    type="text" 
                    value={search}
                    onFocus={() => setIsOpen(true)}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-stone-800 text-sm shadow-sm"
                    placeholder={placeholder}
                />
                {isOpen && (
                    <div className="absolute z-50 w-full bg-white border border-stone-200 shadow-2xl rounded-lg mt-1 max-h-60 overflow-y-auto overflow-x-hidden flex flex-col">
                        <div className="flex justify-between items-center p-2 border-b border-stone-100 bg-stone-50 sticky top-0 z-10">
                            <span className="text-xs font-bold text-stone-500 px-2">{filtered.length} Options</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-stone-200 rounded-full">
                                <X className="w-4 h-4 text-stone-500" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {filtered.slice(0, 100).map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { onToggle(opt); setSearch(''); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 flex justify-between border-b border-stone-50 last:border-0 break-words whitespace-normal ${selected.includes(opt) ? 'bg-blue-50 text-blue-800 font-bold' : 'text-stone-700'}`}
                                >
                                    <span className="break-words">{opt}</span>
                                    {selected.includes(opt) && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                                </button>
                            ))}
                            {filtered.length === 0 && <div className="p-3 text-sm text-stone-500">No matches found.</div>}
                        </div>
                        <div className="p-2 border-t border-stone-200 bg-stone-50 sticky bottom-0 z-10">
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="w-full py-2 bg-stone-900 text-white rounded-md text-sm font-bold hover:bg-stone-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Gateway: React.FC<GatewayProps> = ({ params, onUpdate, onComplete }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    
    // Manual Entry Modal State
    const [manualModal, setManualModal] = useState<{ isOpen: boolean; title: string; label: string; field: keyof ReportParameters | 'industry' }>({
        isOpen: false,
        title: '',
        label: '',
        field: 'region' // Default
    });

    // Intelligent Matching State
    const [showIntelligentMatching, setShowIntelligentMatching] = useState(false);
    const [intelligentSuggestions, setIntelligentSuggestions] = useState<any>(null);
    const [selectedIntelligenceCategory, setSelectedIntelligenceCategory] = useState<string>('');

    useEffect(() => {
        const container = document.getElementById('gateway-container');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const update = (field: keyof ReportParameters, value: any) => {
        onUpdate({ ...params, [field]: value });
    };

    const handleManualEntry = (field: keyof ReportParameters | 'industry', value: string) => {
        if (field === 'industry') {
            update('industry', [value]);
        } else {
            update(field as keyof ReportParameters, value);
        }
        setManualModal(prev => ({ ...prev, isOpen: false }));
    };

    const openManualModal = (title: string, label: string, field: keyof ReportParameters | 'industry') => {
        setManualModal({ isOpen: true, title, label, field });
    };

    const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({
            ...params,
            organizationType: e.target.value,
            organizationSubType: '',
            customOrganizationType: '',
            customOrganizationSubType: ''
        });
    };

    const toggleArrayItem = (field: keyof ReportParameters, item: string) => {
        const current = (params[field] as string[]) || [];
        const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
        update(field, updated);
    };

    // Intelligent Matching Logic (memoized)
    const generateIntelligentSuggestions = useMemo(() => {
        if (!params.organizationType || !params.userCountry || !params.region) return null;

        const suggestions = {
            intelligenceCategory: '',
            strategicOptions: [] as any[],
            potentialPartners: [] as any[],
            alternativeApproaches: [] as any[],
            riskConsiderations: [] as string[],
            recommendedNextSteps: [] as string[]
        };

        // Determine Intelligence Category
        if (params.organizationType.includes('Government') && params.region) {
            suggestions.intelligenceCategory = 'Government Relations';
        } else if (params.organizationType.includes('Private') && params.industry.length > 0) {
            suggestions.intelligenceCategory = 'Market Entry Strategy';
        } else {
            suggestions.intelligenceCategory = 'Strategic Partnership Development';
        }

        // Generate Strategic Options
        suggestions.strategicOptions = [
            {
                title: 'Direct Partnership Approach',
                description: 'Identify and engage specific partners in your target region',
                confidence: 85,
                timeline: '3-6 months',
                risk: 'Medium'
            },
            {
                title: 'Ecosystem Development',
                description: 'Build comprehensive support network including regulators, banks, and logistics',
                confidence: 78,
                timeline: '6-12 months',
                risk: 'Low'
            },
            {
                title: 'Market Testing Strategy',
                description: 'Start with pilot projects and expand based on results',
                confidence: 92,
                timeline: '2-4 months',
                risk: 'Low'
            }
        ];

        // Generate Potential Partners
        const regionPartners = {
            'Asia-Pacific': ['Singapore Economic Development Board', 'Japan External Trade Organization', 'South Korea Trade Center'],
            'Europe': ['European Commission', 'Germany Trade & Invest', 'UK Department for International Trade'],
            'Middle East': ['Dubai Chamber of Commerce', 'Saudi Arabia General Investment Authority', 'Qatar Investment Authority'],
            'Americas': ['US Commercial Service', 'Canada Trade Commissioner Service', 'Brazilian Development Bank']
        };

        const partners = regionPartners[params.region as keyof typeof regionPartners] || ['Regional Development Agency', 'Trade Promotion Organization'];
        suggestions.potentialPartners = partners.map((name, index) => ({
            name,
            type: 'Government Agency',
            relevance: 85 + index * 5,
            contact: 'Available through diplomatic channels'
        }));

        // Alternative Approaches
        suggestions.alternativeApproaches = [
            'Joint Venture with Local Partner',
            'Acquisition of Existing Operation',
            'Greenfield Investment with Government Incentives',
            'Strategic Alliance Network',
            'Technology Licensing Agreement'
        ];

        // Risk Considerations
        suggestions.riskConsiderations = [
            'Regulatory approval timelines',
            'Cultural integration challenges',
            'Currency and economic stability',
            'Political relationship management',
            'Local partner reliability'
        ];

        // Recommended Next Steps
        suggestions.recommendedNextSteps = [
            'Schedule initial diplomatic meetings',
            'Conduct preliminary market research',
            'Engage local legal counsel',
            'Develop detailed project timeline',
            'Prepare initial investment memorandum'
        ];

        return suggestions;
    }, [params.organizationType, params.userCountry, params.region, params.industry]);

    useEffect(() => {
        if (params.organizationType && params.userCountry && params.region && !showIntelligentMatching) {
            setShowIntelligentMatching(true);
            setIntelligentSuggestions(generateIntelligentSuggestions);
        }
    }, [params.organizationType, params.userCountry, params.region, generateIntelligentSuggestions]);

    const inputStyles = "w-full p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-stone-800 outline-none transition-all text-sm text-stone-900 shadow-sm placeholder-stone-400";
    const labelStyles = "block text-sm font-bold text-stone-800 mb-1 tracking-wide";

    const subTypes = ORGANIZATION_SUBTYPES[params.organizationType] || [];
    const showCustomTypeInput = params.organizationType === 'Custom';
    const showCustomCategoryInput = params.organizationType && (params.organizationSubType === 'Custom' || subTypes.length === 0);

    const allNiches = useMemo(() => {
        const industry = params.industry[0];
        if (industry && INDUSTRY_NICHES[industry]) return INDUSTRY_NICHES[industry];
        return Object.values(INDUSTRY_NICHES).flat();
    }, [params.industry]);

    const allObjectives = useMemo(() => {
        return Object.values(STRATEGIC_OBJECTIVES).flat().map(o => o.label);
    }, []);

    useEffect(() => {
        if (!params.strategicMode) update('strategicMode', 'discovery');
    }, []);

    return (
        <div id="gateway-container" className="h-full w-full flex flex-col items-center justify-start bg-stone-50 p-6 md:p-10 lg:p-16 pb-32 overflow-y-auto overflow-x-hidden">
            <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden mb-16 shrink-0">
                
                <div className="bg-stone-900 text-white p-6 px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nexus Intelligence Report Generator</h1>
                        <p className="text-stone-400 text-sm">Strategic Configuration & Setup</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-8 h-1 rounded-full ${step >= 4 ? 'bg-white' : 'bg-stone-700'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 4 ? 'bg-white' : 'bg-stone-700'}`} />
                    </div>
                </div>

                <div className="p-10 md:p-16">

                    {/* STEP 1: IDENTITY PROFILE */}
                    {step === 1 && (
                        <div className="animate-in fade-in duration-500 space-y-10">
                            <div className="border-b border-stone-100 pb-6">
                                <h2 className="text-2xl font-bold text-stone-900">Step 1: Organization Identity</h2>
                                <p className="text-stone-500">Establish the identity driving this analysis.</p>
                            </div>

                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                                <label className="block text-sm font-bold text-stone-900 mb-4 uppercase tracking-wide">Your Experience Level</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[{ id: 'novice', label: 'Novice', desc: 'I need guidance.' }, { id: 'experienced', label: 'Experienced', desc: 'Collaborate with me.' }, { id: 'expert', label: 'Expert', desc: 'Give me tools.' }].map((level) => (
                                        <button key={level.id} onClick={() => update('skillLevel', level.id as SkillLevel)} className={`p-4 rounded-xl border-2 text-left transition-all break-words ${params.skillLevel === level.id ? 'border-stone-800 bg-white shadow-md ring-1 ring-stone-800' : 'border-stone-200 hover:border-stone-400 text-stone-600 bg-white'}`}>
                                            <div className={`font-bold text-base mb-1 break-words ${params.skillLevel === level.id ? 'text-stone-900' : 'text-stone-800'}`}>{level.label}</div>
                                            <div className="text-xs text-stone-500 break-words">{level.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className={labelStyles}>Organization Type</label>
                                        <select value={params.organizationType} onChange={handleOrgTypeChange} className={inputStyles}>
                                            <option value="">Select Type...</option>
                                            {ORGANIZATION_TYPES.filter(t => t !== 'Other' && t !== 'Custom').map(t => <option key={t} value={t}>{t}</option>)}
                                            <option value="Custom">Other / Custom</option>
                                        </select>
                                        {showCustomTypeInput && <input type="text" value={params.customOrganizationType || ''} onChange={(e) => update('customOrganizationType', e.target.value)} className={`${inputStyles} mt-2 bg-yellow-50`} placeholder="Specify Organization Type..." />}
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Organization Sub-Type</label>
                                        <select value={params.organizationSubType || ''} onChange={e => update('organizationSubType', e.target.value)} className={inputStyles} disabled={!params.organizationType}>
                                            <option value="">Select Structure...</option>
                                            {subTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            <option value="Custom">Other (Specify)</option>
                                        </select>
                                        {showCustomCategoryInput && <input type="text" value={params.customOrganizationSubType || ''} onChange={(e) => update('customOrganizationSubType', e.target.value)} className={`${inputStyles} mt-2 bg-yellow-50`} placeholder="Specify Structure..." />}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div><label className={labelStyles}>Full Name</label><input type="text" value={params.userName} onChange={e => update('userName', e.target.value)} className={inputStyles} placeholder="e.g. Jane Doe" /></div>
                                    <div><label className={labelStyles}>Role / Title</label><input type="text" value={params.userDepartment} onChange={e => update('userDepartment', e.target.value)} className={inputStyles} placeholder="e.g. Minister of Trade" /></div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div><label className={labelStyles}>Headquarters Country</label><select value={params.userCountry} onChange={(e) => update('userCountry', e.target.value)} className={inputStyles}><option value="">Select Country...</option>{REGIONS_AND_COUNTRIES.flatMap(r => r.countries).sort().map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                <div><label className={labelStyles}>Headquarters City</label><input type="text" value={params.userCity || ''} onChange={e => update('userCity', e.target.value)} className={inputStyles} placeholder="e.g. Geneva" /></div>
                            </div>

                            {/* INTELLIGENT MATCHING SECTION */}
                            {showIntelligentMatching && intelligentSuggestions && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BrainCircuit className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-900">Nexus Intelligence Analysis</h3>
                                            <p className="text-blue-700 text-sm">AI-powered strategic insights based on your profile</p>
                                        </div>
                                    </div>

                                    {/* Intelligence Category */}
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4" /> Detected Intelligence Category
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {intelligentSuggestions.intelligenceCategory}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Intelligence Category Selection */}
                                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                        <h4 className="font-bold text-indigo-900 mb-3">Refine Intelligence Focus</h4>
                                        <p className="text-sm text-indigo-700 mb-3">Select a more specific intelligence category or keep the AI recommendation:</p>
                                        <select
                                            value={selectedIntelligenceCategory || intelligentSuggestions.intelligenceCategory}
                                            onChange={(e) => {
                                                setSelectedIntelligenceCategory(e.target.value);
                                                update('intelligenceCategory', e.target.value);
                                            }}
                                            className="w-full p-2 border border-indigo-200 rounded text-sm"
                                        >
                                            <option value={intelligentSuggestions.intelligenceCategory}>
                                                ✓ AI Recommended: {intelligentSuggestions.intelligenceCategory}
                                            </option>
                                            {INTELLIGENCE_CATEGORIES.filter(cat => cat !== intelligentSuggestions.intelligenceCategory).map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-stone-100 flex justify-end">
                                <button onClick={() => setStep(2)} disabled={!params.organizationType || !params.userCountry} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-all shadow-md">Next: Strategy & Deal Architecture &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: STRATEGY & DEAL ARCHITECTURE */}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-500 space-y-10">
                            <div className="border-b border-stone-100 pb-6">
                                <h2 className="text-2xl font-bold text-stone-900">Step 2: Strategy & Deal Architecture</h2>
                                <p className="text-stone-500">Configure your market entry, partner search scope, and deal support ecosystem.</p>
                            </div>

                            {/* 1. Market Scope */}
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className={labelStyles}>Target Region / Market</label>
                                        <select 
                                            value={params.region} 
                                            onChange={e => {
                                                if (e.target.value === 'Custom') {
                                                    openManualModal('Enter Target Region', 'Target Jurisdiction', 'region');
                                                } else {
                                                    update('region', e.target.value);
                                                }
                                            }} 
                                            className={inputStyles}
                                        >
                                            <option value="">Select Target Region...</option>
                                            {REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                            <option value="Custom">Other / Custom...</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Primary Sector</label>
                                        <select 
                                            className={inputStyles} 
                                            onChange={(e) => {
                                                if (e.target.value === 'Custom') {
                                                    openManualModal('Enter Industry', 'Primary Sector', 'industry');
                                                } else {
                                                    update('industry', [e.target.value]);
                                                }
                                            }} 
                                            value={params.industry[0] || ''}
                                        >
                                            <option value="">Select Industry...</option>
                                            {INDUSTRIES.map(ind => <option key={ind.id} value={ind.id}>{ind.title}</option>)}
                                            <option value="Custom">Other / Custom...</option>
                                        </select>
                                    </div>
                                </div>

                                {params.industry.length > 0 && (
                                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                                        <MegaMultiSelect 
                                            label="Niche Specialization (Refine Focus)" 
                                            options={allNiches} 
                                            selected={params.nicheAreas || []} 
                                            onToggle={(val) => toggleArrayItem('nicheAreas', val)}
                                            placeholder="Search 100+ specialized niches..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 2. Strategic Mode Selector */}
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm mt-6">
                                <label className="block text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-black" /> Strategic Mode
                                </label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'specific', title: 'Analyze Specific Target', desc: 'Deep due diligence on a known entity.' },
                                        { id: 'discovery', title: 'Discover Partners', desc: 'Find new matches & opportunities.' },
                                        { id: 'expansion', title: 'Market Expansion', desc: 'Relocation & ecosystem analysis.' }
                                    ].map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => update('strategicMode', mode.id as any)}
                                            className={`p-4 rounded-lg border text-left transition-all break-words ${params.strategicMode === mode.id ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
                                        >
                                            <div className={`font-bold text-sm mb-1 break-words ${params.strategicMode === mode.id ? 'text-blue-800' : 'text-stone-900'}`}>{mode.title}</div>
                                            <div className="text-xs text-stone-500 break-words">{mode.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* DYNAMIC MODE CONTENT */}
                                <div className="mt-6 p-5 bg-stone-50 rounded-lg border border-stone-200 animate-in fade-in">
                                    
                                    {/* MODE 1: SPECIFIC TARGET */}
                                    {params.strategicMode === 'specific' && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className={labelStyles}>Target Entity Name</label>
                                                <input 
                                                    type="text" 
                                                    value={params.targetPartner || ''} 
                                                    onChange={e => update('targetPartner', e.target.value)} 
                                                    className={inputStyles} 
                                                    placeholder="e.g. Tesla, Ministry of Energy..." 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* MODE 2: DISCOVER PARTNERS */}
                                    {params.strategicMode === 'discovery' && (
                                        <div className="space-y-5">
                                            <div className="grid md:grid-cols-3 gap-8">
                                                <div>
                                                    <label className={labelStyles}>Search Scope</label>
                                                    <select value={params.searchScope || 'Regional'} onChange={e => update('searchScope', e.target.value)} className={inputStyles}>
                                                        <option value="Local">Local (Selected Country)</option>
                                                        <option value="Regional">Regional ({params.region})</option>
                                                        <option value="Global">Global Search</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* INTEGRATED INTENT & CONTEXT */}
                                    <div className="mt-6 pt-6 border-t border-stone-200">
                                        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2"><Network className="w-4 h-4 text-purple-600" /> Strategic Intent & Context</h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {INTENT_TAGS.map(tag => (
                                                <button 
                                                    key={tag}
                                                    onClick={() => toggleArrayItem('intentTags', tag)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        (params.intentTags || []).includes(tag) 
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                                                        : 'bg-white text-stone-600 border-stone-200 hover:border-purple-300'
                                                    }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div>
                                            <label className={labelStyles}>Mission Context (Tell the System)</label>
                                            <textarea 
                                                value={params.additionalContext || ''} 
                                                onChange={e => update('additionalContext', e.target.value)} 
                                                className="w-full p-3 bg-white border border-stone-200 rounded-lg text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-stone-800" 
                                                placeholder="Describe specific goals, constraints, or unique requirements... (e.g. 'We need a partner with strong ESG credentials for a joint venture in renewable energy.')"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-stone-100 flex justify-between">
                                <button onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-900 text-sm font-medium">&larr; Back to Identity</button>
                                <button onClick={() => setStep(3)} disabled={!params.region || !params.industry.length} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-all shadow-md">Next: Calibration &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CALIBRATION */}
                    {step === 3 && (
                        <div className="animate-in fade-in duration-500 space-y-10">
                            <MissionCalibrationStep params={params} onParamsChange={update} />
                            
                            <div className="pt-6 border-t border-stone-100 flex justify-between">
                                <button onClick={() => setStep(2)} className="text-stone-500 hover:text-stone-900 text-sm font-medium">&larr; Back to Strategy</button>
                                <button onClick={() => setStep(4)} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-all shadow-md">Next: Strategic Intelligence &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: STRATEGIC INTELLIGENCE */}
                    {step === 4 && (
                        <div className="animate-in fade-in duration-500 space-y-10">
                            <div className="border-b border-stone-100 pb-6">
                                <h2 className="text-2xl font-bold text-stone-900">Step 4: Strategic Intelligence</h2>
                                <p className="text-stone-500">Define objectives and analytical methodologies. Deliverables are configured in the next step.</p>
                            </div>

                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                                <MegaMultiSelect 
                                    label="Strategic Objectives (Multi-Select)" 
                                    options={allObjectives}
                                    selected={params.strategicObjectives || []}
                                    onToggle={(val) => toggleArrayItem('strategicObjectives', val)}
                                    placeholder="Search objectives (e.g. Market Entry, Crisis Mitigation)..."
                                />
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm mb-8">
                                <label className="block text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-indigo-600" /> Analytical Lenses</label>
                                <p className="text-sm text-indigo-700 mb-4">Select multiple methodologies for the Nexus Brain.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {STRATEGIC_LENSES.map((lens) => (
                                        <button
                                            key={lens.id}
                                            onClick={() => toggleArrayItem('strategicLens', lens.id)}
                                            className={`p-4 rounded-xl border text-left transition-all break-words ${
                                                (params.strategicLens || []).includes(lens.id)
                                                ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                                                : 'bg-white/60 border-indigo-100 hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm break-words">{lens.label}</span>
                                                {(params.strategicLens || []).includes(lens.id) && <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />}
                                            </div>
                                            <div className="text-xs text-stone-500 break-words">{lens.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between items-center border-t border-stone-100">
                                <button onClick={() => setStep(3)} className="text-stone-500 hover:text-stone-900 text-sm font-medium">&larr; Back to Calibration</button>
                                <button onClick={onComplete} className="px-10 py-4 bg-stone-900 text-white font-bold text-lg rounded-xl hover:bg-stone-800 transition-all shadow-lg transform hover:-translate-y-0.5">
                                    Proceed to Mission Briefing &rarr;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Entry Modal */}
            <ManualInputModal 
                isOpen={manualModal.isOpen}
                title={manualModal.title}
                label={manualModal.label}
                onClose={() => setManualModal(prev => ({ ...prev, isOpen: false }))}
                onSave={(val) => handleManualEntry(manualModal.field, val)}
            />
        </div>
    );
};
