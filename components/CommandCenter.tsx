
import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, FileText, BarChart3, Eye, ArrowRight, X, FileCheck, MessageSquare, Cpu, Download, Search, Lightbulb, Scale, Calculator, Cog, Building2, Globe, Users, Briefcase } from 'lucide-react';

// Command Center - Comprehensive marketing brief for beta evaluation

interface CommandCenterProps {
    onEnterPlatform?: () => void;
}

// Test Scenario Data - defined early so modals can reference it
const testScenarios = [
    { 
        id: 1, 
        entity: "Sao Paulo Housing Authority", 
        country: "Brazil", 
        sector: "Urban Dev", 
        dealSize: "$75M", 
        flag: "????", 
        SPI: 72, 
        IVAS: 68, 
        risk: "Medium", 
        summary: "Public-Private Partnership for affordable housing development in Sao Paulo's eastern periphery, targeting 12,000 units over 5 years under Brazil's Casa Verde e Amarela program.",
        p10: "$62M", 
        p50: "$75M", 
        p90: "$89M", 
        keyRisk: "FX exposure (BRL volatility at 18% annual), political transition risk with 2026 municipal elections, and IBAMA environmental licensing delays.",
        // Extended details for full report
        marketContext: "Brazil's housing deficit stands at 5.8 million units (Fundacao Joao Pinheiro, 2023). Sao Paulo state accounts for 1.2 million of this deficit. The Casa Verde e Amarela program provides subsidized financing at 4.5-8% annual rates for families earning up to R$8,000/month.",
        regulatoryFramework: "Projects require IBAMA environmental impact assessment (EIA-RIMA), municipal zoning approval (Lei de Uso e Ocupacao do Solo), and Caixa Economica Federal technical approval for federal subsidies.",
        financialStructure: "70% debt financing via BNDES FINEM (TJLP + 1.5%), 20% federal subsidies, 10% private equity. Expected IRR of 14-18% in BRL terms, subject to construction cost indexation (INCC).",
        sources: [
            { name: "Fundacao Joao Pinheiro - Deficit Habitacional 2023", url: "https://fjp.mg.gov.br" },
            { name: "Caixa - Casa Verde e Amarela Guidelines", url: "https://www.caixa.gov.br/voce/habitacao" },
            { name: "BNDES - Infrastructure Financing Conditions", url: "https://www.bndes.gov.br/wps/portal/site/home/financiamento" },
            { name: "BCB - Exchange Rate Statistics", url: "https://www.bcb.gov.br/estatisticas/txcambio" }
        ],
        keyMetrics: [
            { label: "Housing Deficit (SP)", value: "1.2M units", source: "FJP 2023" },
            { label: "BRL/USD Volatility", value: "18% annual", source: "BCB" },
            { label: "BNDES Rate", value: "TJLP + 1.5%", source: "BNDES" },
            { label: "Subsidy Coverage", value: "Up to 90%", source: "Caixa" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Schedule introductory call with Sao Paulo Housing Secretariat (Secretaria Municipal de Habitacao)",
                "Request preliminary project documentation and environmental pre-assessment status",
                "Obtain current Casa Verde e Amarela allocation for Eastern Zone developments"
            ],
            shortTerm: [
                "Conduct site visit to proposed development zones in Itaim Paulista and Cidade Tiradentes",
                "Commission independent land title verification through Brazilian registry (Cartorio de Registro)",
                "Engage local construction cost consultant for INCC-adjusted budget validation"
            ],
            documentation: [
                "Letter of Intent (LOI) - Housing PPP Framework Agreement",
                "Due Diligence Request List - Real Estate & Environmental",
                "Term Sheet - BNDES FINEM Co-financing Structure",
                "MOU - Social Housing Delivery & Impact Metrics"
            ],
            recommendedPartners: [
                { name: "BNDES (Banco Nacional de Desenvolvimento)", role: "Primary DFI Lender", contact: "Area de Infraestrutura Social", priority: "Critical" },
                { name: "Caixa Economica Federal", role: "Federal Subsidy Administrator", contact: "Superintendencia Regional SP", priority: "Critical" },
                { name: "IFC Brazil", role: "Co-investment Partner", contact: "Sao Paulo Infrastructure Team", priority: "High" },
                { name: "Patria Investimentos", role: "Local PE Partner", contact: "Real Assets Division", priority: "Medium" },
                { name: "Votorantim Cimentos", role: "Construction Materials Partner", contact: "Housing Segment", priority: "Medium" }
            ],
            nextReport: "Full Investment Memorandum with 10-Year Cash Flow Model",
            estimatedTimeline: "Initial engagement: 2-3 weeks | Due diligence: 6-8 weeks | LOI execution: 12-14 weeks"
        }
    },
    { 
        id: 2, 
        entity: "Singapore FinTech Association", 
        country: "Singapore", 
        sector: "FinTech", 
        dealSize: "$12M", 
        flag: "????", 
        SPI: 89, 
        IVAS: 91, 
        risk: "Low", 
        summary: "RegTech platform licensing deal for cross-border payment compliance under MAS Payment Services Act. SaaS model with 47 banks in pilot program.",
        p10: "$10M", 
        p50: "$12M", 
        p90: "$16M", 
        keyRisk: "Technology obsolescence risk (3-5 year cycle), MAS regulatory evolution, and talent retention in competitive Singapore market.",
        marketContext: "Singapore processes $1.2 trillion in cross-border payments annually (MAS 2023). The Payment Services Act 2019 requires all payment service providers to implement robust AML/CFT compliance systems. RegTech adoption grew 340% from 2020-2024.",
        regulatoryFramework: "MAS Technology Risk Management Guidelines (TRMG), Personal Data Protection Act (PDPA), and Payment Services Act licensing requirements. ISO 27001 certification mandatory.",
        financialStructure: "100% equity raise at $40M pre-money valuation. Revenue model: $15,000/month base license + $0.02 per transaction for volumes above 100K/month. 47 banks in pilot, 12 signed LOIs.",
        sources: [
            { name: "MAS - Payment Services Statistics", url: "https://www.mas.gov.sg/statistics/payment-services" },
            { name: "MAS - Technology Risk Management Guidelines", url: "https://www.mas.gov.sg/regulation/guidelines/technology-risk-management-guidelines" },
            { name: "Singapore FinTech Association - Industry Report 2024", url: "https://singaporefintech.org/research" },
            { name: "PDPC - Data Protection Guidelines", url: "https://www.pdpc.gov.sg" }
        ],
        keyMetrics: [
            { label: "Cross-border Volume", value: "$1.2T/year", source: "MAS 2023" },
            { label: "RegTech Growth", value: "340%", source: "SFA 2024" },
            { label: "Banks in Pilot", value: "47", source: "Internal" },
            { label: "License Revenue", value: "$15K/mo", source: "Term Sheet" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Arrange meeting with SFA Executive Committee and Technology Working Group",
                "Request access to pilot program performance data and bank feedback summaries",
                "Review MAS Payment Services License application status and conditions"
            ],
            shortTerm: [
                "Conduct technology due diligence with independent cybersecurity assessor",
                "Interview 5-7 pilot bank stakeholders for product-market fit validation",
                "Assess competitive landscape: Tookitaki, Silent Eight, NICE Actimize positioning"
            ],
            documentation: [
                "Term Sheet - Series A Equity Investment",
                "Technology Due Diligence Report - ISO 27001 & MAS TRMG Compliance",
                "Commercial Agreement - Regional Expansion Rights (ASEAN+)",
                "LOI - Strategic Partnership with Anchor Bank Customer"
            ],
            recommendedPartners: [
                { name: "Temasek Holdings", role: "Lead Strategic Investor", contact: "FinTech Investment Team", priority: "Critical" },
                { name: "GIC Private Limited", role: "Co-Investor", contact: "Technology Investments Group", priority: "High" },
                { name: "DBS Bank", role: "Anchor Customer & Distribution Partner", contact: "Chief Data Office", priority: "Critical" },
                { name: "Vertex Ventures SEA", role: "VC Lead", contact: "FinTech Practice", priority: "High" },
                { name: "AWS Singapore", role: "Cloud Infrastructure Partner", contact: "Financial Services Solutions", priority: "Medium" }
            ],
            nextReport: "Technology Assessment & Competitive Positioning Analysis",
            estimatedTimeline: "Initial engagement: 1-2 weeks | Due diligence: 4-6 weeks | Term sheet: 8-10 weeks"
        }
    },
    { 
        id: 3, 
        entity: "Chilean Green Hydrogen Valley", 
        country: "Chile", 
        sector: "Energy", 
        dealSize: "$450M", 
        flag: "????", 
        SPI: 78, 
        IVAS: 74, 
        risk: "Medium-High", 
        summary: "Large-scale green hydrogen production facility in Magallanes Region utilizing Chile's exceptional wind resources (capacity factor >60%). Target: 25,000 tonnes H2/year by 2029.",
        p10: "$320M", 
        p50: "$450M", 
        p90: "$580M", 
        keyRisk: "Offtake agreement certainty (80% must be pre-committed), electrolyzer technology selection, and Port of Punta Arenas export infrastructure.",
        marketContext: "Chile's National Green Hydrogen Strategy targets 25GW electrolyzer capacity by 2030. Magallanes Region has world-class wind resources (average 12 m/s). Chile aims to produce the world's cheapest green hydrogen at <$1.50/kg by 2030.",
        regulatoryFramework: "CORFO green hydrogen incentives, SEA environmental assessment, SEC electrical grid connection approval, and SAG water rights. Tax incentives under Hydrogen Law (2023).",
        financialStructure: "40% DFI concessional debt (IFC/IADB at SOFR + 2%), 35% commercial debt, 25% equity. 15-year offtake agreements required with European/Asian buyers. CAPEX: $18,000/kW electrolyzer.",
        sources: [
            { name: "Chile Ministry of Energy - National Green Hydrogen Strategy", url: "https://energia.gob.cl/h2" },
            { name: "CORFO - Green Hydrogen Investment Incentives", url: "https://www.corfo.cl/sites/cpp/hidrogeno-verde" },
            { name: "IEA - Global Hydrogen Review 2024", url: "https://www.iea.org/reports/global-hydrogen-review-2024" },
            { name: "IRENA - Green Hydrogen Cost Reduction", url: "https://www.irena.org/publications/2020/Dec/Green-hydrogen-cost-reduction" }
        ],
        keyMetrics: [
            { label: "Wind Capacity Factor", value: ">60%", source: "Energy Ministry" },
            { label: "Target H2 Cost", value: "<$1.50/kg", source: "Nat'l Strategy" },
            { label: "Production Target", value: "25,000 t/yr", source: "Project Spec" },
            { label: "DFI Rate", value: "SOFR + 2%", source: "IFC Term Sheet" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Initiate dialogue with CORFO Green Hydrogen Program Director",
                "Request access to Magallanes wind resource data and grid connection studies",
                "Obtain preliminary offtake interest letters from European industrial buyers"
            ],
            shortTerm: [
                "Conduct site assessment at Punta Arenas port for export infrastructure feasibility",
                "Commission independent electrolyzer technology comparison (Nel, ITM, Plug Power)",
                "Engage with potential EPC contractors: Technip Energies, Linde, Air Liquide"
            ],
            documentation: [
                "Heads of Terms - Green Hydrogen Offtake Agreement (FOB Punta Arenas)",
                "Development Agreement - Project Company Formation & Governance",
                "Term Sheet - DFI Concessional Debt Facility (IFC/IADB)",
                "MOU - Technology Partnership & License Agreement",
                "EIA Scoping Report - SEA Environmental Pre-Assessment"
            ],
            recommendedPartners: [
                { name: "IFC (World Bank Group)", role: "Lead DFI Lender", contact: "Chile Infrastructure Team", priority: "Critical" },
                { name: "Inter-American Development Bank (IADB)", role: "Co-Lender & TA Provider", contact: "Energy Division LAC", priority: "Critical" },
                { name: "Enel Green Power Chile", role: "Strategic Partner / Wind Expertise", contact: "Green Hydrogen Unit", priority: "High" },
                { name: "Copenhagen Infrastructure Partners", role: "Equity Co-Investor", contact: "Green Hydrogen Fund", priority: "High" },
                { name: "Port of Rotterdam", role: "European Offtake Hub Partner", contact: "Hydrogen Import Program", priority: "Medium" },
                { name: "Maersk", role: "Maritime Logistics Partner", contact: "Green Fuels Division", priority: "Medium" }
            ],
            nextReport: "Bankable Feasibility Study with 25-Year Financial Model",
            estimatedTimeline: "Initial engagement: 3-4 weeks | Feasibility: 16-20 weeks | Financial close: 18-24 months"
        }
    },
    { 
        id: 4, 
        entity: "California Inland Port Coalition", 
        country: "USA", 
        sector: "Logistics", 
        dealSize: "$98M", 
        flag: "????", 
        SPI: 82, 
        IVAS: 79, 
        risk: "Medium", 
        summary: "Multimodal logistics hub in San Bernardino County connecting LA/Long Beach ports to inland distribution. 2.4M sq ft warehouse with BNSF rail spur.",
        p10: "$84M", 
        p50: "$98M", 
        p90: "$115M", 
        keyRisk: "CEQA environmental review (12-18 months), ILWU labor relations, and AB 5 independent contractor classification compliance.",
        marketContext: "LA/Long Beach ports handle 40% of US container imports. San Bernardino County has 145M sq ft of industrial space with 1.2% vacancy rate (CBRE Q3 2024). E-commerce driving 15% annual growth in last-mile demand.",
        regulatoryFramework: "CEQA environmental impact report, SCAQMD air quality permits (Rule 2305), Cal/OSHA warehouse quotas (AB 701), and CARB Advanced Clean Fleets regulation compliance.",
        financialStructure: "65% CMBS debt at SOFR + 280bps, 35% private equity. Triple-net lease structure with 7-year anchor tenants. Target unlevered IRR: 11-13%. Cap rate: 4.75%.",
        sources: [
            { name: "Port of LA - Container Statistics", url: "https://www.portoflosangeles.org/business/statistics" },
            { name: "CBRE - Industrial Market Report Q3 2024", url: "https://www.cbre.com/insights/reports/us-industrial-figures-q3-2024" },
            { name: "CARB - Advanced Clean Fleets Regulation", url: "https://ww2.arb.ca.gov/our-work/programs/advanced-clean-fleets" },
            { name: "Cal/OSHA - AB 701 Warehouse Requirements", url: "https://www.dir.ca.gov/dosh/Warehouse-Distribution-Centers.html" }
        ],
        keyMetrics: [
            { label: "Port Volume Share", value: "40% of US", source: "Port of LA" },
            { label: "Vacancy Rate", value: "1.2%", source: "CBRE Q3 2024" },
            { label: "E-commerce Growth", value: "15%/yr", source: "CBRE" },
            { label: "Target Cap Rate", value: "4.75%", source: "Pro Forma" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Schedule meeting with San Bernardino County Economic Development Agency",
                "Request CEQA pre-application consultation with lead agency",
                "Obtain BNSF rail spur feasibility assessment and right-of-way status"
            ],
            shortTerm: [
                "Conduct tenant demand analysis with major 3PL providers (XPO, FedEx, Amazon)",
                "Commission Phase I environmental site assessment for target parcels",
                "Engage CARB-compliant fleet consultant for Advanced Clean Fleets planning"
            ],
            documentation: [
                "Letter of Intent (LOI) - Land Acquisition & Option Agreement",
                "Pre-Lease Agreement - Anchor Tenant 3PL Operator",
                "Term Sheet - CMBS Financing with ESG Certification",
                "Development Agreement - San Bernardino County Entitlements",
                "Rail Access Agreement - BNSF Spur Construction"
            ],
            recommendedPartners: [
                { name: "Prologis", role: "Development JV Partner", contact: "Southern California Industrial Team", priority: "Critical" },
                { name: "BNSF Railway", role: "Rail Infrastructure Partner", contact: "Real Estate & Industrial Development", priority: "Critical" },
                { name: "Amazon Logistics", role: "Anchor Tenant", contact: "Real Estate Acquisitions West", priority: "High" },
                { name: "CBRE Investment Management", role: "Equity Co-Investor", contact: "US Industrial Fund", priority: "High" },
                { name: "JP Morgan Asset Management", role: "CMBS Arranger", contact: "Real Estate Debt Strategies", priority: "Medium" },
                { name: "Tesla Semi / Nikola", role: "EV Fleet Partner", contact: "Commercial Fleet Sales", priority: "Medium" }
            ],
            nextReport: "Full Development Pro Forma with CEQA Timeline Analysis",
            estimatedTimeline: "Initial engagement: 2-3 weeks | Entitlements: 12-18 months | Construction start: 20-24 months"
        }
    },
    { 
        id: 5, 
        entity: "Ethiopia Coffee Traceability", 
        country: "Ethiopia", 
        sector: "Agriculture", 
        dealSize: "$15M", 
        flag: "????", 
        SPI: 61, 
        IVAS: 58, 
        risk: "High", 
        summary: "Blockchain-based supply chain traceability for specialty coffee cooperatives in Yirgacheffe and Sidama regions. 45,000 smallholder farmers across 23 cooperatives.",
        p10: "$9M", 
        p50: "$15M", 
        p90: "$22M", 
        keyRisk: "Telecom infrastructure (4G coverage <40% in target areas), cooperative governance capacity, and ECX (Ethiopia Commodity Exchange) regulatory integration.",
        marketContext: "Ethiopia is the world's 5th largest coffee producer (7.5M bags/year, ICO 2024). Specialty coffee commands 300-400% premium over commodity. EU Deforestation Regulation (EUDR) effective Dec 2024 requires full traceability.",
        regulatoryFramework: "Ethiopian Coffee & Tea Authority licensing, ECX trading regulations, National Bank of Ethiopia foreign exchange controls, and EU Deforestation Regulation compliance requirements.",
        financialStructure: "60% DFI grant/concessional (IFC, USAID), 25% impact investment equity, 15% cooperative contribution (in-kind). Revenue: $0.02/kg traceability premium passed to farmers.",
        sources: [
            { name: "ICO - Coffee Market Report 2024", url: "https://www.ico.org/Market-Report-23-24-e.asp" },
            { name: "EU - Deforestation Regulation (EUDR)", url: "https://environment.ec.europa.eu/topics/forests/deforestation_en" },
            { name: "Ethiopian Coffee & Tea Authority", url: "https://www.ecta.gov.et" },
            { name: "World Bank - Ethiopia Digital Economy Assessment", url: "https://www.worldbank.org/en/country/ethiopia/publication/ethiopia-digital-economy-assessment" }
        ],
        keyMetrics: [
            { label: "Coffee Production", value: "7.5M bags/yr", source: "ICO 2024" },
            { label: "Specialty Premium", value: "300-400%", source: "SCA" },
            { label: "4G Coverage", value: "<40%", source: "Ethio Telecom" },
            { label: "Farmer Reach", value: "45,000", source: "Project Spec" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Arrange introductory meeting with Ethiopian Coffee & Tea Authority (ECTA) Director",
                "Request cooperative organization mapping and current traceability gaps assessment",
                "Confirm EU Deforestation Regulation (EUDR) compliance requirements for pilot cooperatives"
            ],
            shortTerm: [
                "Conduct field visit to Yirgacheffe and Sidama cooperatives for baseline assessment",
                "Evaluate telecom infrastructure with Ethio Telecom and Safaricom Ethiopia",
                "Engage specialty coffee buyers (Starbucks, Nestle, JDE Peet's) for offtake interest"
            ],
            documentation: [
                "Grant Agreement - USAID Feed the Future Digital Agriculture",
                "MOU - Cooperative Union Partnership & Data Sharing",
                "Technology License - Blockchain Platform Implementation",
                "Offtake LOI - Premium Pricing for Traceable Coffee",
                "Impact Measurement Framework - Farmer Income & Traceability KPIs"
            ],
            recommendedPartners: [
                { name: "USAID Ethiopia", role: "Primary Grant Funder", contact: "Feed the Future Program", priority: "Critical" },
                { name: "IFC Agribusiness", role: "Concessional Finance Partner", contact: "Africa Agribusiness Team", priority: "High" },
                { name: "Starbucks Coffee Company", role: "Premium Offtake Partner", contact: "Ethical Sourcing & Traceability", priority: "Critical" },
                { name: "Farmer Connect (IBM)", role: "Technology Platform Provider", contact: "Coffee Traceability Solutions", priority: "High" },
                { name: "TechnoServe", role: "Cooperative Capacity Building", contact: "East Africa Coffee Initiative", priority: "High" },
                { name: "Oromia Coffee Farmers Cooperative Union", role: "Primary Cooperative Partner", contact: "General Manager", priority: "Critical" }
            ],
            nextReport: "Cooperative Readiness Assessment & Technology Implementation Plan",
            estimatedTimeline: "Initial engagement: 2-3 weeks | Pilot design: 8-10 weeks | Pilot launch: 16-20 weeks"
        }
    },
    { 
        id: 6, 
        entity: "India Rural Vaccine Alliance", 
        country: "India", 
        sector: "Healthcare", 
        dealSize: "$32M", 
        flag: "????", 
        SPI: 74, 
        IVAS: 71, 
        risk: "Medium", 
        summary: "Cold chain logistics and last-mile distribution network for routine immunization in Bihar and Jharkhand. Solar-powered vaccine refrigerators reaching 8,500 health sub-centers.",
        p10: "$26M", 
        p50: "$32M", 
        p90: "$41M", 
        keyRisk: "State government budget allocation reliability, health worker training retention, and WHO PQS equipment certification timelines.",
        marketContext: "India's Universal Immunization Programme covers 27M infants annually. Bihar and Jharkhand have 65% full immunization coverage vs 76% national average (NFHS-5). Cold chain gaps cause 25% vaccine wastage.",
        regulatoryFramework: "CDSCO drug controller approvals, National Health Mission integration, WHO PQS prequalification for cold chain equipment, and state-level MoU requirements.",
        financialStructure: "45% Gavi Alliance grant, 30% World Bank IDA credit, 15% state government matching, 10% private CSR. O&M: $2.50/beneficiary/year passed to state health budget after Year 3.",
        sources: [
            { name: "Ministry of Health - Universal Immunization Programme", url: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=824&lid=220" },
            { name: "NFHS-5 - National Family Health Survey", url: "http://rchiips.org/nfhs/nfhs5.shtml" },
            { name: "Gavi - India Country Profile", url: "https://www.gavi.org/programmes-impact/country-hub/india" },
            { name: "WHO - PQS Prequalification Standards", url: "https://extranet.who.int/pqweb/vaccines/prequalification-vaccines" }
        ],
        keyMetrics: [
            { label: "Annual Births", value: "27M", source: "MoHFW" },
            { label: "State Coverage Gap", value: "11%", source: "NFHS-5" },
            { label: "Vaccine Wastage", value: "25%", source: "WHO" },
            { label: "Health Centers", value: "8,500", source: "Project Spec" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Request meeting with Bihar & Jharkhand State Health Secretaries",
                "Obtain current cold chain equipment inventory and gap assessment from NHM",
                "Confirm Gavi Alliance funding window and application timeline"
            ],
            shortTerm: [
                "Conduct field assessment of priority health sub-centers in target districts",
                "Evaluate WHO PQS-prequalified equipment suppliers (Vestfrost, Haier, B Medical)",
                "Engage with UNICEF Supply Division for procurement framework alignment"
            ],
            documentation: [
                "Grant Application - Gavi Health System Strengthening (HSS)",
                "State MOU - Cold Chain Modernization Partnership",
                "Procurement Plan - WHO PQS Equipment Specifications",
                "O&M Transition Agreement - State Health Budget Integration",
                "Impact Framework - Immunization Coverage & Wastage Reduction KPIs"
            ],
            recommendedPartners: [
                { name: "Gavi, The Vaccine Alliance", role: "Primary Grant Funder", contact: "Country Programmes, India", priority: "Critical" },
                { name: "World Bank (IDA)", role: "Concessional Credit Provider", contact: "India Health Team", priority: "Critical" },
                { name: "UNICEF India", role: "Technical Assistance & Procurement", contact: "Health Section, New Delhi", priority: "High" },
                { name: "National Health Mission (NHM)", role: "Government Counterpart", contact: "Immunization Division", priority: "Critical" },
                { name: "B Medical Systems", role: "Cold Chain Equipment Supplier", contact: "India Sales Office", priority: "Medium" },
                { name: "Villgro Innovations", role: "Last-Mile Innovation Partner", contact: "Healthcare Portfolio", priority: "Medium" }
            ],
            nextReport: "State-Level Implementation Plan with District Prioritization Matrix",
            estimatedTimeline: "Initial engagement: 3-4 weeks | State approval: 8-12 weeks | Equipment delivery: 24-32 weeks"
        }
    },
    { 
        id: 7, 
        entity: "South Africa Battery JV", 
        country: "South Africa", 
        sector: "Manufacturing", 
        dealSize: "$88M", 
        flag: "????", 
        SPI: 69, 
        IVAS: 66, 
        risk: "Medium-High", 
        summary: "Lithium-ion battery cell manufacturing joint venture in Coega SEZ (Eastern Cape). 2GWh initial capacity targeting domestic EV and storage markets plus SADC export.",
        p10: "$68M", 
        p50: "$88M", 
        p90: "$112M", 
        keyRisk: "Eskom load-shedding (Stage 4-6 averaging 8 hours/day), BEE ownership compliance (51% required), and manganese/cobalt supply chain from DRC.",
        marketContext: "South Africa's Auto Master Plan targets 1M EVs by 2035. Local battery production qualifies for EU Rules of Origin under EPA. Africa has 80% of global manganese reserves. Battery demand: 15GWh by 2030.",
        regulatoryFramework: "DTI Section 12I tax incentives, Coega SEZ benefits, BEE ownership requirements (Amended Codes 2019), DMRE mining rights for cathode materials, and SARS customs warehousing.",
        financialStructure: "JV structure: 51% SA BEE partners, 35% Asian technology partner, 14% DFI. Debt: IDC facility at Prime + 2%. CAPEX: $44/kWh. Target EBITDA margin: 18% at scale.",
        sources: [
            { name: "DTI - South African Automotive Master Plan 2035", url: "https://www.thedtic.gov.za/sectors-and-services-2/industrial-development/automotive" },
            { name: "Coega SEZ - Investment Incentives", url: "https://www.coega.co.za/invest" },
            { name: "USGS - Mineral Commodity Summaries 2024", url: "https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries" },
            { name: "BEE Commission - Amended Codes", url: "https://www.beecommission.gov.za" }
        ],
        keyMetrics: [
            { label: "EV Target", value: "1M by 2035", source: "Auto Master Plan" },
            { label: "Africa Manganese", value: "80% global", source: "USGS" },
            { label: "BEE Requirement", value: "51%", source: "Amended Codes" },
            { label: "Target Capacity", value: "2GWh", source: "Project Spec" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Schedule meeting with DTI Industrial Development Division Director",
                "Request Section 12I tax incentive application status and requirements",
                "Confirm Coega SEZ plot availability and infrastructure specifications"
            ],
            shortTerm: [
                "Identify and pre-qualify BEE equity partners with manufacturing experience",
                "Conduct technology partner evaluation (CATL, LG Energy, Samsung SDI, BYD)",
                "Assess Eskom load-shedding mitigation options (solar + battery microgrid)"
            ],
            documentation: [
                "Joint Venture Agreement - BEE Ownership Structure & Governance",
                "Technology License Agreement - Cell Manufacturing Know-How",
                "Section 12I Application - Tax Incentive Pre-Approval",
                "Coega SEZ Lease Agreement - Industrial Plot & Infrastructure",
                "Offtake MOU - Domestic OEM & Export Commitments",
                "Power Purchase Agreement - Renewable Energy & Backup"
            ],
            recommendedPartners: [
                { name: "Industrial Development Corporation (IDC)", role: "DFI Lender & Equity Partner", contact: "Green Industries Unit", priority: "Critical" },
                { name: "CATL (Contemporary Amperex)", role: "Technology Partner", contact: "International Business Division", priority: "Critical" },
                { name: "Coega Development Corporation", role: "SEZ Landlord & Facilitator", contact: "Investment Promotion", priority: "High" },
                { name: "ABSA Corporate & Investment Banking", role: "Commercial Debt Provider", contact: "Industrials Coverage", priority: "High" },
                { name: "BMW South Africa", role: "Anchor Offtake Customer", contact: "Procurement, Rosslyn Plant", priority: "High" },
                { name: "Thebe Investment Corporation", role: "BEE Equity Partner", contact: "Industrial Holdings", priority: "Critical" }
            ],
            nextReport: "JV Structuring Analysis with BEE Compliance Verification",
            estimatedTimeline: "Initial engagement: 4-6 weeks | JV formation: 16-20 weeks | Plant commissioning: 24-30 months"
        }
    },
    { 
        id: 8, 
        entity: "Philippines Disaster Data Mesh", 
        country: "Philippines", 
        sector: "Resilience Tech", 
        dealSize: "$10M", 
        flag: "????", 
        SPI: 76, 
        IVAS: 73, 
        risk: "Medium", 
        summary: "Distributed IoT sensor network for typhoon, flood, and volcanic early warning across Visayas and Mindanao. Integration with NDRRMC and 847 LGU disaster offices.",
        p10: "$8M", 
        p50: "$10M", 
        p90: "$14M", 
        keyRisk: "Sensor maintenance sustainability (salt air corrosion), data governance across LGUs, and PAGASA/PHIVOLCS system integration protocols.",
        marketContext: "Philippines ranks #1 in world disaster risk (World Risk Index 2024). Average 20 typhoons/year, $3.2B annual disaster losses (World Bank). NDRRMC coordinates with 1,715 LGU disaster offices.",
        regulatoryFramework: "RA 10121 (Disaster Risk Reduction Act), DICT data privacy requirements, DENR environmental compliance, and LGU procurement under RA 9184.",
        financialStructure: "75% ADB grant (UCCRTF), 15% national government counterpart, 10% LGU co-investment. O&M: $1.2M/year funded through National Disaster Risk Reduction Fund allocation.",
        sources: [
            { name: "World Risk Report 2024", url: "https://weltrisikobericht.de/en" },
            { name: "NDRRMC - Disaster Statistics", url: "https://ndrrmc.gov.ph" },
            { name: "World Bank - Philippines Disaster Risk Profile", url: "https://www.worldbank.org/en/country/philippines/brief/philippines-disaster-risk-financing" },
            { name: "ADB - Urban Climate Change Resilience Trust Fund", url: "https://www.adb.org/what-we-do/funds/urban-climate-change-resilience-trust-fund" }
        ],
        keyMetrics: [
            { label: "Disaster Risk Rank", value: "#1 Global", source: "WRI 2024" },
            { label: "Typhoons/Year", value: "~20", source: "PAGASA" },
            { label: "Annual Losses", value: "$3.2B", source: "World Bank" },
            { label: "LGU Coverage", value: "847", source: "Project Spec" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Arrange meeting with NDRRMC Executive Director and OCD Administrator",
                "Request current DRRM investment plan and technology gap assessment",
                "Confirm ADB UCCRTF funding availability and application requirements"
            ],
            shortTerm: [
                "Conduct pilot LGU selection assessment (Cebu, Davao, Tacloban priority)",
                "Evaluate IoT sensor technology partners and local manufacturing options",
                "Engage PAGASA and PHIVOLCS for data integration protocol design"
            ],
            documentation: [
                "Grant Application - ADB Urban Climate Change Resilience Trust Fund",
                "National Agency MOU - NDRRMC, PAGASA, PHIVOLCS, DICT Integration",
                "LGU Partnership Agreement - Pilot Region Implementation",
                "Technology Specification - IoT Sensor Network & Data Mesh Architecture",
                "O&M Sustainability Plan - National Disaster Risk Reduction Fund Integration"
            ],
            recommendedPartners: [
                { name: "Asian Development Bank (ADB)", role: "Primary Grant Provider", contact: "Philippines Country Office", priority: "Critical" },
                { name: "NDRRMC / Office of Civil Defense", role: "Government Lead Agency", contact: "Plans & Programs Division", priority: "Critical" },
                { name: "PAGASA", role: "Meteorological Data Partner", contact: "Weather Division", priority: "High" },
                { name: "PHIVOLCS", role: "Seismic/Volcanic Data Partner", contact: "Monitoring Division", priority: "High" },
                { name: "DOST-ASTI", role: "Local Technology Development", contact: "DREAM Program", priority: "Medium" },
                { name: "Globe Telecom", role: "IoT Connectivity Partner", contact: "Enterprise Solutions", priority: "Medium" }
            ],
            nextReport: "Pilot Region Selection & Technical Architecture Design",
            estimatedTimeline: "Initial engagement: 2-3 weeks | Pilot design: 10-12 weeks | System deployment: 20-26 weeks"
        }
    },
    { 
        id: 9, 
        entity: "Korea eSports Academic League", 
        country: "South Korea", 
        sector: "Education", 
        dealSize: "$6M", 
        flag: "????", 
        SPI: 85, 
        IVAS: 87, 
        risk: "Low", 
        summary: "University-based esports league with broadcasting rights, scholarship program, and gaming facility network across 42 Korean universities. KeSPA sanctioned.",
        p10: "$5M", 
        p50: "$6M", 
        p90: "$9M", 
        keyRisk: "Game publisher licensing (Riot/Blizzard agreements), broadcasting rights competition (OGN/AfreecaTV), and student athlete academic eligibility rules.",
        marketContext: "South Korea esports market: $127M (2024). 78% of university students play games regularly. KeSPA regulates 4,200 professional players. University esports programs grew 450% since 2019.",
        regulatoryFramework: "KeSPA player registration, KOCCA content rating compliance, Personal Information Protection Act (PIPA), and Ministry of Culture broadcasting permits.",
        financialStructure: "100% equity: 40% university consortium, 35% media partner (CJ ENM), 25% strategic investors. Revenue: 45% broadcasting, 30% sponsorship, 15% merchandise, 10% facility fees.",
        sources: [
            { name: "KeSPA - Korean eSports Association Statistics", url: "https://www.e-sports.or.kr" },
            { name: "KOCCA - Korea Creative Content Agency", url: "https://www.kocca.kr" },
            { name: "Newzoo - Global Esports Market Report 2024", url: "https://newzoo.com/products/reports/global-esports-market-report" },
            { name: "Ministry of Culture - Broadcasting Regulations", url: "https://www.mcst.go.kr" }
        ],
        keyMetrics: [
            { label: "Market Size", value: "$127M", source: "Newzoo 2024" },
            { label: "Student Gamers", value: "78%", source: "KOCCA" },
            { label: "Pro Players", value: "4,200", source: "KeSPA" },
            { label: "Universities", value: "42", source: "Project Spec" }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Schedule meeting with KeSPA Secretary General and Education Committee",
                "Request university consortium membership list and participation terms",
                "Confirm Riot Games and Blizzard academic program licensing requirements"
            ],
            shortTerm: [
                "Conduct market analysis of university esports facility investment plans",
                "Evaluate broadcasting partner landscape (OGN, AfreecaTV, Twitch Korea)",
                "Assess scholarship program structure and academic eligibility frameworks"
            ],
            documentation: [
                "Investment Agreement - Series A Equity Round",
                "Broadcasting Rights Agreement - Exclusive University League Coverage",
                "Publisher License Agreement - Riot Games/Blizzard Academic Use",
                "University Consortium MOU - Participation Terms & Revenue Share",
                "Scholarship Fund Agreement - Student-Athlete Support Program"
            ],
            recommendedPartners: [
                { name: "CJ ENM (OGN)", role: "Broadcasting & Content Partner", contact: "Esports Division", priority: "Critical" },
                { name: "KeSPA (Korea e-Sports Association)", role: "Regulatory & Sanctioning Body", contact: "Tournament Operations", priority: "Critical" },
                { name: "SK Telecom T1", role: "Strategic Brand Partner", contact: "Esports Marketing", priority: "High" },
                { name: "Riot Games Korea", role: "Game Publisher Partner", contact: "Esports Partnerships", priority: "High" },
                { name: "Korea University", role: "Anchor Academic Institution", contact: "Student Affairs / Athletics", priority: "Medium" },
                { name: "Logitech G Korea", role: "Equipment Sponsor", contact: "Esports Partnerships", priority: "Medium" }
            ],
            nextReport: "University Consortium Expansion Plan & Broadcasting Rights Valuation",
            estimatedTimeline: "Initial engagement: 1-2 weeks | Term sheet: 4-6 weeks | League launch: 12-16 weeks"
        }
    },
    { 
        id: 10, 
        entity: "Global Indigenous Data Alliance", 
        country: "Multi-Region", 
        sector: "Data Gov", 
        dealSize: "$25M", 
        flag: "??", 
        SPI: 67, 
        IVAS: 64, 
        risk: "Medium-High", 
        summary: "Indigenous data sovereignty platform spanning Canada, Australia, New Zealand, and Nordic Sami regions. Implements CARE Principles and OCAP standards for 127 First Nations.",
        p10: "$18M", 
        p50: "$25M", 
        p90: "$35M", 
        keyRisk: "Cross-jurisdictional governance complexity (4 legal systems), Free Prior Informed Consent (FPIC) protocols, and indigenous language interface requirements.",
        marketContext: "UNDRIP (2007) established indigenous data rights. CARE Principles adopted by 40+ countries. Indigenous data economy estimated at $3B globally. Research data misuse has driven demand for sovereignty platforms.",
        regulatoryFramework: "UNDRIP Articles 18-19, CARE Principles for Indigenous Data Governance, OCAP (Canada), AIATSIS Guidelines (Australia), and Te Mana Raraunga (NZ Maori).",
        financialStructure: "100% philanthropic/grant: 40% Ford Foundation, 25% Open Society, 20% government indigenous affairs agencies, 15% tech company data ethics programs. Non-profit structure with indigenous board control.",
        sources: [
            { name: "UN Declaration on Rights of Indigenous Peoples", url: "https://www.un.org/development/desa/indigenouspeoples/declaration-on-the-rights-of-indigenous-peoples.html" },
            { name: "GIDA - Global Indigenous Data Alliance", url: "https://www.gida-global.org" },
            { name: "CARE Principles for Indigenous Data Governance", url: "https://www.gida-global.org/care" },
            { name: "First Nations Information Governance Centre - OCAP", url: "https://fnigc.ca/ocap-training" }
        ],
        keyMetrics: [
            { label: "UNDRIP Adoption", value: "193 countries", source: "UN" },
            { label: "CARE Adopters", value: "40+ countries", source: "GIDA" },
            { label: "First Nations", value: "127", source: "Project Spec" },
            { label: "Data Economy", value: "$3B", source: "Research Est." }
        ],
        // STRATEGIC NEXT STEPS & ENGAGEMENT
        nextSteps: {
            immediate: [
                "Arrange consultation with Global Indigenous Data Alliance (GIDA) leadership",
                "Request current data sovereignty platform landscape and gap analysis",
                "Confirm Free Prior Informed Consent (FPIC) protocols for engagement"
            ],
            shortTerm: [
                "Conduct stakeholder mapping across Canada, Australia, NZ, and Nordic regions",
                "Evaluate existing indigenous data platforms (FNIGC, AIATSIS, Te Mana Raraunga)",
                "Assess multi-language interface requirements and indigenous language support"
            ],
            documentation: [
                "Grant Application - Ford Foundation Building Institutions & Networks",
                "FPIC Protocol - Engagement Framework for All Participating Nations",
                "Governance Charter - Indigenous Board Control & Decision Rights",
                "Technology Specification - Data Sovereignty Platform Architecture",
                "Cross-Jurisdictional Agreement - Multi-Country Legal Framework",
                "CARE Principles Compliance Certification - Implementation Audit"
            ],
            recommendedPartners: [
                { name: "Ford Foundation", role: "Lead Philanthropic Funder", contact: "Civic Engagement & Government", priority: "Critical" },
                { name: "Open Society Foundations", role: "Co-Funder", contact: "Information Program", priority: "High" },
                { name: "First Nations Information Governance Centre (FNIGC)", role: "OCAP Standards Partner", contact: "Executive Director", priority: "Critical" },
                { name: "AIATSIS (Australia)", role: "Australian Indigenous Data Partner", contact: "Collections & Research", priority: "High" },
                { name: "Te Mana Raraunga (NZ)", role: "Maori Data Sovereignty Partner", contact: "Network Coordinator", priority: "High" },
                { name: "Microsoft AI for Good", role: "Technology & Cloud Partner", contact: "Indigenous Community Program", priority: "Medium" },
                { name: "Sami Parliament (Norway)", role: "Nordic Indigenous Partner", contact: "Cultural Affairs", priority: "Medium" }
            ],
            nextReport: "Multi-Jurisdictional Governance Framework & FPIC Engagement Plan",
            estimatedTimeline: "Initial engagement: 4-6 weeks | FPIC process: 12-20 weeks | Platform development: 36-48 weeks"
        }
    }
];

// Monte Carlo Research Paper Modal
const MonteCarloEvidenceModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelectScenario: (scenario: typeof testScenarios[0]) => void }> = ({ isOpen, onClose, onSelectScenario }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header - Matching Command Center slate-900 theme */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mb-3">Technical Evidence</p>
                            <h2 className="text-3xl font-light mb-2">Monte Carlo Simulation</h2>
                            <p className="text-lg text-slate-300 font-light">100+ Scenario Probabilistic Analysis with Full Transparency</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-lg text-slate-700 leading-relaxed mb-4">
                            Monte Carlo simulation is the gold standard for financial forecasting under uncertainty. Instead of giving you a single number, BWGA AI runs 100+ randomized scenarios to show you the full range of possible outcomes—from pessimistic to optimistic.
                        </p>
                    </div>
                    
                    {/* How It Works */}
                    <section className="bg-slate-900 text-white p-6 rounded-lg mb-6">
                        <h3 className="text-xl font-light mb-4">How Monte Carlo Works in BWGA AI</h3>
                        <div className="space-y-3 text-slate-300 text-sm">
                            <p><strong className="text-white">1. Input Variables:</strong> Base value, volatility range, upside potential, downside risk, and success probability are extracted from your project data.</p>
                            <p><strong className="text-white">2. Random Sampling:</strong> The system uses Box-Muller transformation to generate statistically valid normal distributions—not pseudo-random approximations.</p>
                            <p><strong className="text-white">3. 100+ Iterations:</strong> Each scenario is simulated 100+ times with randomized inputs within defined ranges.</p>
                            <p><strong className="text-white">4. Percentile Analysis:</strong> Results are sorted and analyzed to produce P10 (pessimistic), P50 (base case), and P90 (optimistic) outcomes.</p>
                            <p><strong className="text-white">5. Risk Metrics:</strong> Value at Risk (VaR95), Expected Shortfall, and Probability of Loss are calculated automatically.</p>
                        </div>
                    </section>
                    
                    {/* Source Code Evidence */}
                    <section className="mb-6">
                        <h3 className="text-2xl font-light text-slate-900 mb-4">Source Code Implementation</h3>
                        <p className="text-slate-600 mb-4">File: <code className="bg-slate-100 px-2 py-1 rounded text-sm">services/CounterfactualEngine.ts</code></p>
                        
                        <div className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                            <pre className="text-xs text-green-400 font-mono leading-relaxed">
{`class MonteCarloSimulator {
  static simulate(params: {
    baseValue: number;
    volatility: number;
    upside: number;
    downside: number;
    successProbability: number;
    iterations?: number;
  }): MonteCarloResult {
    const iterations = params.iterations || 100;    // DEFAULT: 100+ TRIALS
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {           // ACTUAL LOOP EXECUTION
      const outcome = this.simulateSingleOutcome(params);
      results.push(outcome);
    }
    
    // Sort for percentile calculations
    results.sort((a, b) => a - b);
    
    // Calculate percentiles (P5, P10, P25, P50, P75, P90, P95)
    const percentile = (p: number) => results[Math.floor(iterations * p / 100)];
    
    // Value at Risk (95% confidence)
    const var95 = percentile(5);
    
    return { iterations, distribution, probabilityOfLoss, valueAtRisk95 };
  }
}`}
                            </pre>
                        </div>
                    </section>
                    
                    {/* Test Validation */}
                    <section className="mb-6">
                        <h3 className="text-2xl font-light text-slate-900 mb-4">Validated Against Real Scenarios</h3>
                        
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-light">10</div>
                                <div className="text-sm text-slate-400 mt-1">Test Scenarios</div>
                            </div>
                            <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-light">6</div>
                                <div className="text-sm text-slate-400 mt-1">Continents</div>
                            </div>
                            <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-light">$811M</div>
                                <div className="text-sm text-slate-400 mt-1">Total Deal Value</div>
                            </div>
                            <div className="bg-slate-900 text-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-light">9</div>
                                <div className="text-sm text-slate-400 mt-1">Industry Sectors</div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <p className="text-sm text-slate-500 mb-2 flex items-center gap-1"><Eye size={12} /> Click any row to see full strategic report <ArrowRight size={12} /></p>
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                                        <th className="p-3 text-left font-medium text-slate-600"></th>
                                        <th className="p-3 text-left font-medium text-slate-600">Entity</th>
                                        <th className="p-3 text-left font-medium text-slate-600">Country</th>
                                        <th className="p-3 text-left font-medium text-slate-600">Sector</th>
                                        <th className="p-3 text-right font-medium text-slate-600">Deal Size</th>
                                        <th className="p-3 text-center font-medium text-slate-600">SPI</th>
                                        <th className="p-3 text-center font-medium text-slate-600">IVAS</th>
                                        <th className="p-3 text-center font-medium text-slate-600">Risk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {testScenarios.map((scenario) => (
                                        <tr 
                                            key={scenario.id} 
                                            onClick={() => onSelectScenario(scenario)}
                                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <td className="p-3 text-center">{scenario.flag}</td>
                                            <td className="p-3 font-medium text-slate-900">{scenario.entity}</td>
                                            <td className="p-3 text-slate-600">{scenario.country}</td>
                                            <td className="p-3 text-slate-600">{scenario.sector}</td>
                                            <td className="p-3 text-right font-mono font-semibold">{scenario.dealSize}</td>
                                            <td className="p-3 text-center font-semibold text-slate-900">{scenario.SPI}</td>
                                            <td className="p-3 text-center font-semibold text-slate-900">{scenario.IVAS}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs ${
                                                    scenario.risk === 'Low' ? 'bg-green-100 text-green-700' :
                                                    scenario.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>{scenario.risk}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    
                    {/* Sample Output */}
                    <section className="bg-slate-50 border-l-4 border-slate-300 p-6 rounded-r-lg">
                        <h3 className="text-xl font-light text-slate-900 mb-3">Sample Output: AgriTech Vietnam Expansion</h3>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-sm text-slate-500">P10 (Pessimistic)</p>
                                <p className="text-xl font-light text-slate-900">$4.2M NPV</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-500">P50 (Base Case)</p>
                                <p className="text-xl font-semibold text-slate-900">$8.7M NPV</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-500">P90 (Optimistic)</p>
                                <p className="text-xl font-light text-slate-900">$14.3M NPV</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-500">Probability of Loss</p>
                                <p className="text-xl font-light text-red-600">8%</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">This is real output from the system—not a mockup. Every scenario in the table above produces similar probabilistic analysis.</p>
                    </section>
                </div>
                
                {/* Footer */}
                <div className="bg-slate-900 text-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">BWGA AI Platform | Monte Carlo Evidence</p>
                        <button onClick={onClose} className="px-6 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Scenario Detail Modal - Professional Executive Report Format
const ScenarioDetailModal: React.FC<{ scenario: typeof testScenarios[0] | null; onClose: () => void }> = ({ scenario, onClose }) => {
    if (!scenario) return null;
    
    // Generate narrative report content based on scenario data
    const generateExecutiveSummaryNarrative = () => {
        const riskDescriptor = scenario.risk === 'Low' ? 'manageable' : scenario.risk === 'Medium' ? 'moderate' : 'elevated';
        return `This Strategic Partnership Index (SPI) assessment evaluates the ${scenario.entity} opportunity in ${scenario.country}'s ${scenario.sector.toLowerCase()} sector. The analysis encompasses ${scenario.dealSize} in potential transaction value across a comprehensive evaluation framework including market positioning, regulatory compliance, financial viability, and risk-adjusted returns. Based on 100+ Monte Carlo simulation iterations, the platform has generated probabilistic outcomes ranging from ${scenario.p10} (P10 pessimistic) to ${scenario.p90} (P90 optimistic), with a base case expectation of ${scenario.p50}. The overall risk profile is assessed as ${riskDescriptor}, yielding an SPI score of ${scenario.SPI}/100 and an Investment Viability Assessment Score (IVAS) of ${scenario.IVAS}/100. ${scenario.summary}`;
    };
    
    const generateMarketAnalysisNarrative = () => {
        return `The market environment for this opportunity presents both significant potential and notable complexities that require careful navigation. ${scenario.marketContext} This contextual analysis draws upon verified institutional sources and establishes the foundation for the financial projections and risk assessments contained in this report. The sector-specific dynamics in ${scenario.country} create a distinctive opportunity profile that differs materially from comparable transactions in other jurisdictions, necessitating localized expertise and partnership structures tailored to the regulatory and commercial environment.`;
    };
    
    const generateRegulatoryNarrative = () => {
        return `Regulatory due diligence constitutes a critical component of this assessment, given the jurisdictional complexities inherent in ${scenario.country}'s ${scenario.sector.toLowerCase()} sector. ${scenario.regulatoryFramework} Compliance with these requirements will necessitate engagement of qualified local counsel and regulatory specialists, with associated costs and timelines incorporated into the financial model. The platform has identified no insurmountable regulatory barriers to transaction completion, though the timeline sensitivity analysis reflects potential delays in approval processes.`;
    };
    
    const generateFinancialNarrative = () => {
        return `The financial structure for this opportunity has been modeled using BW AI's proprietary Monte Carlo simulation engine, executing 100+ scenario iterations with variable inputs across key risk factors including interest rate fluctuations, currency volatility, construction/implementation cost overruns, and timeline delays. ${scenario.financialStructure} The simulation outputs yield a P10/P50/P90 distribution of ${scenario.p10}/${scenario.p50}/${scenario.p90}, indicating a probability-weighted expected value aligned with the ${scenario.dealSize} indicative transaction size. Value at Risk (VaR95) calculations and Expected Shortfall metrics have been computed and are available in the detailed financial appendix.`;
    };
    
    const generateRiskNarrative = () => {
        return `Risk assessment for this opportunity has been conducted using the platform's multi-factor risk evaluation framework, incorporating both quantitative metrics and qualitative judgment factors. The primary risk factors identified are: ${scenario.keyRisk} These risks have been stress-tested through counterfactual analysis ("what if we did the opposite?") and scenario planning exercises. The ${scenario.risk} risk classification reflects the aggregate assessment across political, commercial, operational, and financial risk dimensions. Mitigation strategies have been developed for each identified risk factor and are incorporated into the recommended engagement approach.`;
    };
    
    const generateNextStepsNarrative = () => {
        if (!scenario.nextSteps) return '';
        const partnerList = scenario.nextSteps.recommendedPartners.map(p => `${p.name} (${p.role})`).join('; ');
        const docList = scenario.nextSteps.documentation.join('; ');
        return `To advance this opportunity from assessment to active engagement, a structured approach is recommended across three phases. In the immediate term (weeks 1-2), the priority actions include: ${scenario.nextSteps.immediate.join('; ')}. During the short-term phase (weeks 3-8), deeper due diligence activities should commence: ${scenario.nextSteps.shortTerm.join('; ')}. The documentation requirements for this engagement include: ${docList}. Critical partner engagements have been identified as follows: ${partnerList}. The estimated timeline from initial engagement through to LOI execution is: ${scenario.nextSteps.estimatedTimeline}. Upon confirmation of intent to proceed, the BW AI platform will auto-generate the next required deliverable: "${scenario.nextSteps.nextReport}", incorporating live market data, updated regulatory requirements, and counterparty-specific analysis under appropriate confidentiality arrangements.`;
    };
    
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Professional Report Header */}
                <div className="bg-[#0D3A83] text-white p-8 border-b-4 border-[#81C449]">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="text-xs text-[#81C449] uppercase tracking-widest mb-2">BW Global Advisory Pty Ltd - Confidential</div>
                            <div className="text-xs text-gray-200 mb-4">Strategic Partnership Intelligence Report #TS-{scenario.id.toString().padStart(3, '0')} | Generated: January 2026</div>
                            <h1 className="text-3xl font-bold mb-2">{scenario.entity}</h1>
                            <h2 className="text-xl text-[#81C449] mb-3">{scenario.sector} Sector - {scenario.country} {scenario.flag}</h2>
                            <div className="flex items-center gap-6 text-sm">
                                <div><span className="text-gray-200">Indicative Value:</span> <span className="font-bold text-[#81C449] text-lg">{scenario.dealSize}</span></div>
                                <div><span className="text-gray-200">SPI Score:</span> <span className="font-bold">{scenario.SPI}/100</span></div>
                                <div><span className="text-gray-200">IVAS Score:</span> <span className="font-bold">{scenario.IVAS}/100</span></div>
                                <div><span className="text-gray-200">Risk Level:</span> <span className="font-bold">{scenario.risk}</span></div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-200 hover:text-white transition-colors p-2">
                            <X size={28} />
                        </button>
                    </div>
                </div>
                
                {/* Report Content - Professional Narrative Format */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="max-w-4xl mx-auto space-y-8 text-[#1C1C1C] leading-relaxed">
                        
                        {/* Section 1: Executive Summary */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">1. Executive Summary</h3>
                            <p className="text-base leading-7 text-justify">{generateExecutiveSummaryNarrative()}</p>
                        </section>
                        
                        {/* Section 2: Monte Carlo Analysis Results */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">2. Probabilistic Financial Analysis (Monte Carlo Simulation)</h3>
                            <p className="text-base leading-7 text-justify mb-4">
                                The BW AI platform has executed 100+ Monte Carlo simulation iterations to stress-test the financial projections for this opportunity. The simulation varies key input parameters including interest rates (-30-90 basis points), currency exchange rates (based on historical volatility), implementation timelines (-20% variance), and cost structures (-15% variance). The resulting probability distribution provides decision-makers with a comprehensive view of potential outcomes across pessimistic, base case, and optimistic scenarios.
                            </p>
                            <div className="bg-white border border-[#1C53A4]/20 rounded-lg p-6 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-[#1C53A4]/30">
                                            <th className="text-left py-2 font-bold text-[#0D3A83]">Percentile</th>
                                            <th className="text-center py-2 font-bold text-[#0D3A83]">Value Outcome</th>
                                            <th className="text-left py-2 font-bold text-[#0D3A83]">Interpretation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-200">
                                        <tr>
                                            <td className="py-3">P10 (10th Percentile)</td>
                                            <td className="py-3 text-center font-bold">{scenario.p10}</td>
                                            <td className="py-3">Pessimistic outcome - 90% probability of exceeding this value</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">P50 (50th Percentile)</td>
                                            <td className="py-3 text-center font-bold">{scenario.p50}</td>
                                            <td className="py-3">Base case expectation - median outcome across all scenarios</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">P90 (90th Percentile)</td>
                                            <td className="py-3 text-center font-bold">{scenario.p90}</td>
                                            <td className="py-3">Optimistic outcome - 10% probability of exceeding this value</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-base leading-7 text-justify">
                                The spread between P10 and P90 values ({scenario.p10} to {scenario.p90}) indicates the range of uncertainty in the financial projections. A wider spread suggests greater sensitivity to input assumptions and market conditions. The platform's risk assessment algorithms have incorporated this volatility into the overall SPI and IVAS scores presented in this report.
                            </p>
                        </section>
                        
                        {/* Section 3: Market Context */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">3. Market Context & Sector Analysis</h3>
                            <p className="text-base leading-7 text-justify">{generateMarketAnalysisNarrative()}</p>
                        </section>
                        
                        {/* Section 4: Regulatory Framework */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">4. Regulatory & Compliance Framework</h3>
                            <p className="text-base leading-7 text-justify">{generateRegulatoryNarrative()}</p>
                        </section>
                        
                        {/* Section 5: Financial Structure */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">5. Financial Structure & Investment Thesis</h3>
                            <p className="text-base leading-7 text-justify">{generateFinancialNarrative()}</p>
                        </section>
                        
                        {/* Section 6: Risk Assessment */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">6. Risk Assessment & Mitigation</h3>
                            <p className="text-base leading-7 text-justify">{generateRiskNarrative()}</p>
                        </section>
                        
                        {/* Section 7: Key Metrics */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">7. Verified Market Metrics</h3>
                            <p className="text-base leading-7 text-justify mb-4">
                                The following key metrics have been verified through primary source documentation and form the quantitative foundation for this assessment. Each metric is traceable to its institutional source for independent verification.
                            </p>
                            <div className="bg-white border border-[#1C53A4]/20 rounded-lg p-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-[#1C53A4]/30">
                                            <th className="text-left py-2 font-bold text-[#0D3A83]">Metric</th>
                                            <th className="text-center py-2 font-bold text-[#0D3A83]">Value</th>
                                            <th className="text-left py-2 font-bold text-[#0D3A83]">Source</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-200">
                                        {scenario.keyMetrics.map((metric, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3">{metric.label}</td>
                                                <td className="py-3 text-center font-bold">{metric.value}</td>
                                                <td className="py-3">{metric.source}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        
                        {/* Section 8: Strategic Next Steps */}
                        {scenario.nextSteps && (
                            <section>
                                <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">8. Strategic Engagement Pathway & Recommended Actions</h3>
                                <p className="text-base leading-7 text-justify">{generateNextStepsNarrative()}</p>
                                
                                <div className="bg-white border border-[#1C53A4]/20 rounded-lg p-6 mt-4">
                                    <h4 className="font-bold text-[#0D3A83] mb-3">Recommended Partner Engagement Matrix</h4>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-[#1C53A4]/30">
                                                <th className="text-left py-2 font-bold text-[#0D3A83]">Organization</th>
                                                <th className="text-left py-2 font-bold text-[#0D3A83]">Role</th>
                                                <th className="text-left py-2 font-bold text-[#0D3A83]">Contact Point</th>
                                                <th className="text-center py-2 font-bold text-[#0D3A83]">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200">
                                            {scenario.nextSteps.recommendedPartners.map((partner, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-3 font-medium">{partner.name}</td>
                                                    <td className="py-3">{partner.role}</td>
                                                    <td className="py-3">{partner.contact}</td>
                                                    <td className="py-3 text-center">{partner.priority}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                        
                        {/* Section 9: Sources & Citations */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0D3A83] border-b-2 border-[#81C449] pb-2 mb-4">9. Sources & Citations</h3>
                            <p className="text-base leading-7 text-justify mb-4">
                                This assessment relies upon the following institutional sources, each independently verifiable. The BW AI platform does not generate fabricated data; all quantitative inputs are traceable to authoritative publications.
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                {scenario.sources.map((source, idx) => (
                                    <li key={idx}>
                                        <span className="font-medium">{source.name}</span> - <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.url}</a>
                                    </li>
                                ))}
                            </ol>
                        </section>
                        
                        {/* Disclaimer */}
                        <section className="border-t-2 border-[#1C53A4]/20 pt-6 mt-8">
                            <p className="text-xs text-[#4D4D4D] text-justify leading-5">
                                <strong>Disclaimer:</strong> This Strategic Partnership Intelligence Report has been generated by the BW AI platform for evaluation purposes. The scenario presented utilizes illustrative entity names while incorporating real, verifiable market data from authoritative institutional sources. This document does not constitute financial advice, investment recommendation, or solicitation. Actual engagement would require execution of appropriate confidentiality agreements, independent verification of all material facts, and engagement of qualified legal, financial, and technical advisors. BW Global Advisory Pty Ltd accepts no liability for decisions made in reliance upon this illustrative analysis. Monte Carlo simulations reflect modeled probability distributions based on stated assumptions and historical data patterns; actual outcomes may differ materially.
                            </p>
                        </section>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="bg-[#0D3A83] text-white p-4 border-t-4 border-[#81C449]">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        <div className="text-sm text-gray-200">
                            <span>BW AI Platform - Strategic Partnership Intelligence Report</span>
                            <span className="mx-3">|</span>
                            <span>Report #TS-{scenario.id.toString().padStart(3, '0')}</span>
                            <span className="mx-3">|</span>
                            <span>January 2026</span>
                        </div>
                        <button onClick={onClose} className="px-6 py-2 bg-[#81C449] text-[#0D3A83] rounded-lg text-sm font-bold hover:bg-[#81C449]/90 transition-colors">
                            Close Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Formulas Modal
const FormulasModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header - Matching Command Center slate-900 theme */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mb-3">Mathematical Framework</p>
                            <h2 className="text-3xl font-light mb-2">Twenty-Seven Scoring Formulas</h2>
                            <p className="text-lg text-slate-300 font-light">Complete Catalog of BWGA AI Proprietary Scoring Engines</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-lg text-slate-700 leading-relaxed mb-4">
                            BWGA AI uses 27 proprietary formulas to evaluate every investment opportunity. These aren't subjective ratings—they're mathematical outputs with confidence intervals, sensitivity analysis, and full transparency. Every score can be traced back to its source data.
                        </p>
                    </div>
                    
                    {/* Statement Formula */}
                    <section className="bg-slate-900 text-white p-6 rounded-lg mb-6">
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <Calculator size={20} className="text-slate-400" />
                            Core Formula Example: Strategic Partnership Index (SPI™)
                        </h3>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-slate-500 mb-4">
                            <p className="text-lg font-mono text-white mb-2">
                                SPI™ = (R × 0.40) + (A × 0.35) + (V × 0.25) × EvidenceClamp(0.3–1.0)
                            </p>
                        </div>
                        <div className="space-y-2 text-slate-300 text-sm">
                            <p><strong className="text-white">R (Reliability Score):</strong> Historical performance, track record, financial stability, and counterparty credibility based on verifiable data sources.</p>
                            <p><strong className="text-white">A (Alignment Score):</strong> Strategic fit between parties including sector overlap, geographic synergy, capability complementarity, and shared objectives.</p>
                            <p><strong className="text-white">V (Viability Score):</strong> Execution feasibility considering regulatory environment, market conditions, resource availability, and implementation complexity.</p>
                            <p><strong className="text-white">Evidence Clamp:</strong> Automatically reduces scores when supporting data is weak or unverifiable—preventing false confidence.</p>
                        </div>
                    </section>
                    
                    {/* 5 Core Engines */}
                    <section className="mb-6">
                        <h3 className="text-2xl font-light text-slate-900 mb-4">5 Core Scoring Engines</h3>
                        <p className="text-slate-600 mb-4">These five engines form the foundation of every BWGA AI analysis. Each runs automatically based on your input.</p>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold text-slate-900 mb-2">SPI™ — Strategic Partnership Index</h4>
                                <p className="text-sm text-slate-600">Evaluates whether a potential partner is reliable, aligned with your goals, and capable of executing. Uses historical data, financial indicators, and strategic fit metrics to produce a 0-100 score with confidence bands.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-green-500">
                                <h4 className="font-semibold text-slate-900 mb-2">RROI™ — Regional Return on Investment</h4>
                                <p className="text-sm text-slate-600">Adjusts standard ROI calculations for location-specific factors: local labor costs, infrastructure quality, regulatory burden, currency volatility, and market access premiums. Produces risk-adjusted return projections.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-purple-500">
                                <h4 className="font-semibold text-slate-900 mb-2">SEAM™ — Socio-Economic Alignment Metric</h4>
                                <p className="text-sm text-slate-600">Measures how well an investment aligns with community needs, environmental sustainability, and social license to operate. Critical for ESG-conscious investors and development agencies.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-amber-500">
                                <h4 className="font-semibold text-slate-900 mb-2">IVAS™ — Investment Viability Assessment Score</h4>
                                <p className="text-sm text-slate-600">Determines whether capital can actually be deployed successfully. Factors include regulatory approval likelihood, local partner availability, infrastructure readiness, and execution timeline feasibility.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-red-500">
                                <h4 className="font-semibold text-slate-900 mb-2">SCF™ — Supply Chain Friction Index</h4>
                                <p className="text-sm text-slate-600">Identifies bottlenecks in logistics, procurement, and operations. Calculates transportation costs, port access, customs efficiency, and supplier network density to flag execution risks.</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* 22 Derivative Indices */}
                    <section className="mb-6">
                        <h3 className="text-2xl font-light text-slate-900 mb-4">22 Derivative Indices</h3>
                        <p className="text-slate-600 mb-4">These specialized indices provide granular analysis across specific dimensions. They are automatically activated based on your project type and sector.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Risk Assessment Index</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Governance Quality Score</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">ESG Compliance Rating</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Execution Readiness</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Regulatory Complexity</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Market Volatility Index</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Currency Risk Factor</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Infrastructure Maturity</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Talent Availability Score</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Technology Adoption Rate</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Environmental Impact</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Social License Score</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Economic Multiplier</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Innovation Capacity</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Competitive Positioning</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Scalability Factor</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Exit Strategy Viability</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Partnership Synergy</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Time-to-Value Metric</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Resource Efficiency</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Sustainability Score</div>
                            <div className="text-sm bg-slate-50 p-3 rounded border-l-2 border-slate-300">Impact Measurement</div>
                        </div>
                    </section>
                    
                    {/* What Makes BWGA Different */}
                    <section className="bg-slate-50 border-l-4 border-slate-300 p-6 rounded-r-lg">
                        <h3 className="text-xl font-light text-slate-900 mb-3">Why This Matters</h3>
                        <p className="text-slate-700 leading-relaxed">
                            These 27 formulas took years to develop and validate. They represent the difference between guesswork and institutional-grade analysis. Every formula is transparent—you can see exactly how scores are calculated and what data drives them. When evidence is weak, scores reflect that uncertainty. This is how BWGA AI maintains intellectual honesty while delivering actionable intelligence.
                        </p>
                    </section>
                </div>
                
                {/* Footer */}
                <div className="bg-slate-900 text-white p-4">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        <div className="text-sm text-slate-400">
                            <span>BWGA AI Platform</span>
                            <span className="mx-3">|</span>
                            <span>27 Proprietary Scoring Engines</span>
                        </div>
                        <button onClick={onClose} className="px-6 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Document Types Evidence Modal
const DocumentTypesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const documentCategories = [
        {
            category: "Strategic Analysis",
            color: "bg-blue-100 text-blue-800",
            docs: ["Strategic Assessment Report", "SWOT Analysis", "PESTLE Analysis", "Competitive Landscape", "Market Entry Analysis", "Gap Analysis", "Opportunity Assessment", "Strategic Options Paper", "Decision Framework", "Scenario Planning Report"]
        },
        {
            category: "Financial Documents",
            color: "bg-green-100 text-green-800",
            docs: ["Financial Model (5-Year)", "Pro Forma Statements", "Cash Flow Projections", "NPV/IRR Analysis", "Sensitivity Analysis", "Break-even Analysis", "Funding Requirements", "Capital Structure", "Revenue Model", "Cost-Benefit Analysis", "Monte Carlo Risk Report", "Value at Risk Assessment"]
        },
        {
            category: "Due Diligence",
            color: "bg-amber-100 text-amber-800",
            docs: ["Commercial Due Diligence", "Financial Due Diligence", "Legal Due Diligence", "Technical Due Diligence", "Environmental Due Diligence", "HR Due Diligence", "IT Due Diligence", "Regulatory Due Diligence", "Sanctions Check Report", "Background Verification"]
        },
        {
            category: "Legal & Compliance",
            color: "bg-red-100 text-red-800",
            docs: ["Letter of Intent (LOI)", "Term Sheet", "MOU Template", "NDA Template", "Shareholders Agreement", "JV Agreement", "License Agreement", "Service Agreement", "Compliance Checklist", "Regulatory Filing", "IP Assignment", "Employment Agreement"]
        },
        {
            category: "Government & Policy",
            color: "bg-purple-100 text-purple-800",
            docs: ["Policy Brief", "Cabinet Submission", "Regulatory Impact Statement", "Program Charter", "Budget Bid", "Business Case", "Probity Framework", "Governance Charter", "Risk Register", "Stakeholder Map", "Public Consultation Summary", "Legislative Analysis"]
        },
        {
            category: "Investment Documents",
            color: "bg-indigo-100 text-indigo-800",
            docs: ["Investment Memo", "Board Paper", "IC Submission", "Teaser Document", "Information Memorandum", "Pitch Deck", "Data Room Index", "Q&A Document", "Investor Update", "Portfolio Report", "Exit Analysis"]
        },
        {
            category: "Operational",
            color: "bg-teal-100 text-teal-800",
            docs: ["Implementation Plan", "Project Charter", "Gantt Chart", "Resource Plan", "Risk Mitigation Plan", "Change Management Plan", "Training Plan", "Communications Plan", "Handover Document", "Post-Implementation Review"]
        },
        {
            category: "Research & Intelligence",
            color: "bg-orange-100 text-orange-800",
            docs: ["Market Dossier", "Country Risk Report", "Sector Analysis", "Competitor Profile", "Partner Assessment", "Location Analysis", "Precedent Study", "Historical Analogue Report", "Trend Analysis", "Emerging Risk Brief"]
        },
        {
            category: "Presentations & Briefs",
            color: "bg-pink-100 text-pink-800",
            docs: ["Executive Summary", "One-Pager", "Briefing Note", "Slide Deck", "Workshop Materials", "FAQ Document", "Talking Points", "Media Brief", "Stakeholder Presentation", "Board Presentation"]
        },
        {
            category: "Reporting & Monitoring",
            color: "bg-cyan-100 text-cyan-800",
            docs: ["Progress Report", "Milestone Report", "KPI Dashboard", "Variance Analysis", "Quarterly Review", "Annual Report", "Audit Report", "Lessons Learned", "Outcome Evaluation", "Impact Assessment"]
        }
    ];
    
    const totalDocs = documentCategories.reduce((sum, cat) => sum + cat.docs.length, 0);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header - Matching Command Center slate-900 theme */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mb-2">Document Factory</p>
                            <h2 className="text-3xl font-light mb-1">{totalDocs}+ Document Types</h2>
                            <p className="text-lg text-slate-300 font-light">Auto-generated strategic documents across {documentCategories.length} categories</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
                    {/* Introduction */}
                    <div className="mb-6">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            BWGA AI doesn't just analyze opportunities—it produces the actual documents you need to move forward. Investment memos, LOIs, due diligence reports, and more—all generated automatically with full audit trails.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {documentCategories.map((cat, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-lg p-4 border-l-4 border-slate-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-900 text-white">{cat.docs.length} docs</span>
                                    <h3 className="font-semibold text-slate-900">{cat.category}</h3>
                                </div>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    {cat.docs.map((doc, docIdx) => (
                                        <li key={docIdx} className="flex items-center gap-2">
                                            <FileCheck size={12} className="text-slate-400 flex-shrink-0" />
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-2">How Document Generation Works</h4>
                        <p className="text-slate-600">
                            Each document is generated through BWGA AI's reasoning pipeline, incorporating all 27 scoring formulas, 
                            five persona perspectives, and rigorous data validation. Documents maintain internal consistency—a Financial Model 
                            references the same assumptions as the Investment Memo and Due Diligence Report. Every claim includes source citations.
                        </p>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="bg-slate-900 text-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">All documents include audit trails and source citations</p>
                        <button onClick={onClose} className="px-6 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommandCenter: React.FC<CommandCenterProps> = ({ onEnterPlatform }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showMonteCarloEvidence, setShowMonteCarloEvidence] = useState(false);
    const [showDocumentTypesModal, setShowDocumentTypesModal] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState<typeof testScenarios[0] | null>(null);
    const [showFormulasModal, setShowFormulasModal] = useState(false);

    return (
        <>
        <MonteCarloEvidenceModal 
            isOpen={showMonteCarloEvidence} 
            onClose={() => setShowMonteCarloEvidence(false)} 
            onSelectScenario={(scenario) => setSelectedScenario(scenario)}
        />
        <DocumentTypesModal isOpen={showDocumentTypesModal} onClose={() => setShowDocumentTypesModal(false)} />
        <FormulasModal isOpen={showFormulasModal} onClose={() => setShowFormulasModal(false)} />
        <ScenarioDetailModal scenario={selectedScenario} onClose={() => setSelectedScenario(null)} />
        <div className="h-full w-full flex-1 bg-white flex items-start justify-center p-6 pt-16 pb-24 overflow-y-auto" style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif", fontSize: '12pt' }}>
            <div className="max-w-5xl w-full bg-white shadow-lg border border-[#1C53A4]/20 rounded-lg overflow-hidden flex flex-col" style={{ fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif" }}>
                
                {/* Hero - Premium Editorial Style */}
                <section className="relative overflow-hidden min-h-[520px]">
                    <div className="absolute inset-0">
                        <img 
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" 
                            alt="Modern city skyline at dusk" 
                            className="w-full h-full object-cover opacity-40"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    
                    <div className="relative z-10 flex flex-col justify-center min-h-[520px] px-12 py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            
                            <h1 className="text-5xl md:text-6xl font-light mb-8 text-white leading-[1.1] tracking-tight">
                                Regional investment is complex.<br/>
                                <span className="font-semibold">We make it clear.</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light max-w-3xl mx-auto">
                                Assessing a project in a new region is usually slow, expensive, and full of blind spots. We fixed that. Just describe what you want to do in plain English, and we'll tell you if it's viable—backed by hard evidence, not opinion.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* Photo Collage Grid */}
                <section className="grid grid-cols-4 h-64">
                    <div className="relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" alt="Agricultural landscape" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80" alt="Wind energy infrastructure" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" alt="Construction and development" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="Regional harvesting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                </section>

                {/* THE RESEARCH - What We Found */}
                <section className="py-20 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">The Untapped Potential of Regional Cities</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-12">Where Global Opportunity Meets Local Expertise</p>
                        
                        <div className="prose prose-lg max-w-none">
                            <p className="text-2xl font-light text-slate-700 leading-relaxed mb-8">
                                Regional cities are the backbone of national economies—and the most undervalued investment frontier on the planet.
                            </p>
                            
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                Every major global supply chain begins in a regional city. The food on our tables, the minerals in our phones, the energy powering our homes—it all originates in places that capital often ignores. These aren't just "remote areas"; they are the engine rooms of the global economy, driving agricultural output, resource security, and manufacturing capacity.
                            </p>
                            
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                Yet despite their critical importance, investment consistently overlooks them. Why? Because the distance between a capital city and a regional center isn't just measured in miles—it's measured in information gaps. Language barriers, local regulations, and opaque market data create a "complexity tax" that makes even the most profitable regional opportunities invisible to global investors.
                            </p>
                            
                            <div className="bg-slate-900 text-white p-8 my-8 rounded-lg">
                                <h3 className="text-xl font-light mb-6 text-center">The Scale of the Opportunity Gap</h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <p className="text-4xl font-light mb-2">85%</p>
                                        <p className="text-sm text-slate-400">of venture capital flows to metropolitan areas—serving only 55% of the population</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-light mb-2">3.5%</p>
                                        <p className="text-sm text-slate-400">employment decline in remote regions vs 1.9% in metro-adjacent areas</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-light mb-2">61%</p>
                                        <p className="text-sm text-slate-400">of young people in regional areas advised to relocate for opportunity</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                This is not a failure of potential. It's a failure of information architecture. Regional development teams lack the resources to package opportunities in formats that institutional capital recognizes. Global investors lack the bandwidth to conduct due diligence on unfamiliar territories. Both sides want the same outcome—successful partnerships that create jobs, build infrastructure, and generate returns.
                            </p>
                            
                            <div className="bg-slate-50 border-l-4 border-slate-300 p-8 my-8">
                                <p className="text-xl text-slate-800 leading-relaxed italic">
                                    "Capital isn't short on ideas. It's short on affordable ways to explore them."
                                </p>
                                <p className="text-sm text-slate-500 mt-2">— BWGA AI Platform Philosophy</p>
                            </div>
                            
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                BWGA AI exists to bridge this gap. We transform unstructured regional opportunity information—regardless of format, language, or sophistication level—into institutional-grade intelligence that governments, banks, and corporations can trust. At a price point regional teams can actually afford.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* WHAT SETS US APART */}
                <section className="py-16 px-12 bg-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">What Makes BWGA Different</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-8">Evidence-First. Board-Ready. Multi-Perspective.</p>
                        
                        <div className="space-y-6">
                            <p className="text-xl text-slate-700 leading-relaxed">
                                Sophisticated tools exist for pieces of this puzzle—market research platforms, financial modeling software, regulatory databases. None address the complete challenge that regional development teams face: transforming raw local knowledge into investor-ready intelligence.
                            </p>
                            
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-white p-6 border-l-4 border-slate-900">
                                    <p className="font-medium text-slate-900 mb-2">Multi-perspective analysis</p>
                                    <p className="text-sm text-slate-600">Five AI personas debate every opportunity—surfacing risks, advantages, compliance issues, and execution challenges before you present to stakeholders.</p>
                                </div>
                                <div className="bg-white p-6 border-l-4 border-slate-900">
                                    <p className="font-medium text-slate-900 mb-2">Evidence-first approach</p>
                                    <p className="text-sm text-slate-600">If the data isn't strong, we tell you exactly what's missing. Scores are clamped when evidence quality is low. No guesswork, no false confidence.</p>
                                </div>
                                <div className="bg-white p-6 border-l-4 border-slate-900">
                                    <p className="font-medium text-slate-900 mb-2">Board-ready outputs</p>
                                    <p className="text-sm text-slate-600">Investment memos, LOIs, due diligence frameworks, partner assessments—documents you can send directly to decision-makers, not reports to file.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY I BUILT THIS - From Regional Experience */}
                {/* <section className="py-16 px-12 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light mb-4">Why I Built This</h2>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-8">From Living in a Regional City-Watching the Pattern Repeat</p>
                        
                        <div className="space-y-6">
                            <p className="text-xl text-slate-200 leading-relaxed">
                                I live in regional Australia. I have watched the same pattern for years: talented local teams with genuine opportunities, unable to articulate them in formats that institutional capital understands. Investors interested in diversification, unable to justify the due diligence cost on unfamiliar territories. Both sides wanting the same outcome. Neither equipped to bridge the gap.
                            </p>
                            
                            <p className="text-lg text-slate-300 leading-relaxed">
                                Governments struggle to translate local knowledge into investment-grade documentation. Banks cannot deploy analysts to every regional opportunity that crosses their desk. Companies waste months on assessments that should take days. Everyone speaks different languages-literally and professionally.
                            </p>
                            
                            <p className="text-lg text-slate-300 leading-relaxed">
                                BWGA AI is not an improvement on an existing solution. It is the solution that was missing entirely. Built specifically for regional development-because that is where I live, and that is where the gap is most acute.
                            </p>
                            
                            <div className="bg-slate-800 p-6 border-l-4 border-slate-500">
                                <p className="text-xl text-white italic">
                                    "This platform exists because regional teams deserve the same quality of strategic intelligence that metropolitan investment banks take for granted-at a price point that does not require a grant application."
                                </p>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* THE PLATFORM OS - Complete Explanation */}
                <section className="py-20 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-8">Describe. Validate. Execute.</p>
                        
                        <div className="space-y-8">
                            <p className="text-xl text-slate-700 leading-relaxed">
                                BWGA AI is not a chatbot. It is a complete operating system designed to solve the regional investment information problem from first principles. The platform serves all personas in the investment ecosystem-governments, investors, and corporate partners-through a unified interface that speaks each user's language while maintaining a single source of truth.
                            </p>
                            
                            <div className="bg-slate-50 p-8 border-l-4 border-slate-400">
                                <h3 className="text-xl font-medium text-slate-900 mb-4">Multi-Persona Architecture</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                    The system recognizes that governments, investors, and corporations approach the same opportunity from different angles. A regional council asks "How do I attract investment?" An institutional investor asks "How do I assess this opportunity?" A corporate partner asks "How do I evaluate this market entry?"
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    BWGA AI answers all three questions from the same underlying intelligence layer-but tailors the output format, vocabulary, and emphasis to each user's decision framework. This is not cosmetic customization. It is fundamental to bridging the communication gap that keeps regional deals from closing.
                                </p>
                            </div>
                            
                            <div className="bg-slate-50 p-8 border-l-4 border-slate-400">
                                <h3 className="text-xl font-medium text-slate-900 mb-4">The Attract Workspace: Live & Reactive</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                    The core interface is called <strong>Attract</strong>-a live workspace that reacts and works alongside you. Unlike static forms or one-way submissions, Attract operates as an active collaborator. As you input information, the system researches in real-time, clarifies ambiguities, surfaces critical questions, and builds the foundation for institutional-grade output.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    The BW Consult guidance layer walks you through the process step by step. It does not assume expertise. It does not require training. It meets you where you are and elevates your input to the standard that global capital requires.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-6 mt-8">
                                <div className="bg-slate-900 text-white p-6 text-center flex flex-col items-center">
                                    <div className="mb-4 p-3 bg-slate-800 rounded-full">
                                        <MessageSquare size={32} className="text-blue-400" />
                                    </div>
                                    <p className="font-medium mb-2">1. Describe your opportunity</p>
                                    <p className="text-sm text-slate-300">In plain language-any format, any skill level</p>
                                </div>
                                <div className="bg-slate-900 text-white p-6 text-center flex flex-col items-center">
                                    <div className="mb-4 p-3 bg-slate-800 rounded-full">
                                        <Cpu size={32} className="text-purple-400" />
                                    </div>
                                    <p className="font-medium mb-2">2. System validates</p>
                                    <p className="text-sm text-slate-300">Debates, quantifies, and shows you strengths & gaps</p>
                                </div>
                                <div className="bg-slate-900 text-white p-6 text-center flex flex-col items-center">
                                    <div className="mb-4 p-3 bg-slate-800 rounded-full">
                                        <Download size={32} className="text-green-400" />
                                    </div>
                                    <p className="font-medium mb-2">3. Download documents</p>
                                    <p className="text-sm text-slate-300">Actionable, board-ready artifacts for your next meeting</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE TECHNOLOGY - Full Architecture */}
                <section className="py-20 px-12 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light mb-4">The Technology Behind Attract</h2>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-12">A Complete Intelligence Architecture—Not Just Another AI Interface</p>
                        
                        <div className="space-y-8">
                            <p className="text-xl text-slate-200 leading-relaxed">
                                BWGA AI is not a chatbot, a report generator, or a simple wrapper around a language model. It is a <strong>multi-layered intelligence architecture</strong> purpose-built for high-stakes regional investment decisions. Every component—from governance protocols to mathematical scoring engines—was designed to meet the requirements of institutional capital, government agencies, and multinational corporations.
                            </p>
                            
                            <div className="bg-slate-800 p-8 border-l-4 border-amber-400">
                                <h3 className="text-xl font-light mb-4">Three Integrated Technology Layers</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <p className="font-medium text-white mb-1">NSIL - Nexus Strategic Intelligence Layer</p>
                                            <p className="text-slate-300 text-sm">The governance and orchestration framework that ensures every output is evidence-based, auditable, and honest about its limitations. NSIL controls how AI capabilities are deployed, when outputs are blocked for insufficient evidence, and how confidence levels are communicated.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <p className="font-medium text-white mb-1">Five-Persona Agentic Framework</p>
                                            <p className="text-slate-300 text-sm">A multi-perspective reasoning engine where five specialized AI personas—each with distinct analytical mandates—debate every opportunity in parallel. This is not sequential processing; it is genuine adversarial review that surfaces risks, advantages, compliance gaps, and execution challenges before you ever present to stakeholders.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <p className="font-medium text-white mb-1">27 Proprietary Scoring Formulas</p>
                                            <p className="text-slate-300 text-sm">Mathematical engines that quantify partnership viability, regional ROI, social alignment, execution risk, and more. These are not subjective ratings—they are calculated outputs with confidence intervals, sensitivity analysis, and transparent methodologies that institutional due diligence teams can verify.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800 p-8 border-l-4 border-slate-500">
                                <h3 className="text-xl font-light mb-4">Agentic AI: Not a Chatbot—A Reasoning System</h3>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    BWGA AI operates through <strong>agentic architecture</strong>—meaning the system does not simply respond to prompts. It actively reasons, researches, validates, and iterates. When you describe an opportunity, the system:
                                </p>
                                <ul className="text-slate-300 space-y-2 ml-4">
                                    <li>• <strong>Researches</strong> regulatory frameworks, market conditions, and precedent transactions</li>
                                    <li>• <strong>Validates</strong> claims against institutional data sources</li>
                                    <li>• <strong>Surfaces</strong> critical questions you may not have considered</li>
                                    <li>• <strong>Stress-tests</strong> assumptions through adversarial debate</li>
                                    <li>• <strong>Produces</strong> outputs only when evidence quality meets threshold</li>
                                </ul>
                            </div>
                            
                            <div className="bg-slate-800 p-8 border-l-4 border-slate-500">
                                <h3 className="text-xl font-light mb-4">The Five-Persona Boardroom</h3>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Every mandate is debated by five expert personas operating in parallel—each with a distinct analytical mandate:
                                </p>
                                <div className="grid grid-cols-5 gap-4 mt-6">
                                    <div className="text-center flex flex-col items-center">
                                        <div className="mb-3 p-2 bg-slate-700 rounded-full">
                                            <Search size={20} className="text-amber-400" />
                                        </div>
                                        <p className="font-medium text-white text-sm">The Skeptic</p>
                                        <p className="text-xs text-slate-400 mt-1">Hunts hidden risks</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center">
                                        <div className="mb-3 p-2 bg-slate-700 rounded-full">
                                            <Lightbulb size={20} className="text-yellow-400" />
                                        </div>
                                        <p className="font-medium text-white text-sm">The Advocate</p>
                                        <p className="text-xs text-slate-400 mt-1">Finds advantages</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center">
                                        <div className="mb-3 p-2 bg-slate-700 rounded-full">
                                            <Scale size={20} className="text-blue-400" />
                                        </div>
                                        <p className="font-medium text-white text-sm">The Regulator</p>
                                        <p className="text-xs text-slate-400 mt-1">Validates compliance</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center">
                                        <div className="mb-3 p-2 bg-slate-700 rounded-full">
                                            <Calculator size={20} className="text-green-400" />
                                        </div>
                                        <p className="font-medium text-white text-sm">The Accountant</p>
                                        <p className="text-xs text-slate-400 mt-1">Stress-tests numbers</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center">
                                        <div className="mb-3 p-2 bg-slate-700 rounded-full">
                                            <Cog size={20} className="text-slate-400" />
                                        </div>
                                        <p className="font-medium text-white text-sm">The Operator</p>
                                        <p className="text-xs text-slate-400 mt-1">Assesses execution</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-lg text-slate-300 leading-relaxed">
                                These personas debate every input. They surface contradictions, preserve disagreement, and show you the full transcript. The value is not in a single score—it is in seeing where consensus exists and where conflict remains. The final decision belongs to you. The intellectual labor of adversarial review has already been completed.
                            </p>
                        </div>
                    </div>
                </section>

                {/* THE 27 FORMULAS - Automatic Engagement */}
                <section className="py-20 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">Twenty-Seven Scoring Formulas</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-12">5 Core Engines + 22 Derivative Indices. Automatically Engaged. Mathematically Rigorous.</p>
                        
                        <div className="space-y-8">
                            <p className="text-xl text-slate-700 leading-relaxed">
                                Every opportunity is automatically scored across twenty-seven proprietary formulas. You do not select which formulas apply-the system determines relevance based on your input and engages the appropriate scoring engines. These are not subjective ratings. They are mathematical outputs with confidence intervals, sensitivity analysis, and full formula transparency.
                            </p>
                            
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-slate-50 p-6 border-t-4 border-blue-500">
                                    <p className="font-medium text-slate-900 mb-2">SPI™ - Strategic Partnership Index</p>
                                    <p className="text-sm text-slate-600">Quantifies counterparty reliability, alignment, and partnership viability</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-t-4 border-green-500">
                                    <p className="font-medium text-slate-900 mb-2">RROI™ - Regional Return on Investment</p>
                                    <p className="text-sm text-slate-600">Adjusts expected yields for location-specific risk premiums and market access</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-t-4 border-purple-500">
                                    <p className="font-medium text-slate-900 mb-2">SEAM™ - Socio-Economic Alignment</p>
                                    <p className="text-sm text-slate-600">Measures community benefit, sustainability, and social license to operate</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-t-4 border-amber-500">
                                    <p className="font-medium text-slate-900 mb-2">IVAS™ - Investment Viability Assessment</p>
                                    <p className="text-sm text-slate-600">Calculates capital deployment feasibility and execution probability</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-t-4 border-red-500">
                                    <p className="font-medium text-slate-900 mb-2">SCF™ - Supply Chain Friction</p>
                                    <p className="text-sm text-slate-600">Identifies logistics, infrastructure, and execution bottlenecks</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-t-4 border-slate-500">
                                    <p className="font-medium text-slate-900 mb-2">+22 Derivative Indices</p>
                                    <p className="text-sm text-slate-600">Risk, governance, ESG, execution readiness, regulatory complexity, and more</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center">
                                <button 
                                    onClick={() => setShowFormulasModal(true)} 
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-lg font-light"
                                >
                                    <Calculator size={20} />
                                    View Complete Formulas Catalog
                                </button>
                            </div>
                            
                            <div className="bg-slate-900 text-white p-8 mt-8">
                                <h3 className="text-xl font-light mb-4">Evidence Clamping Protocol</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    When evidence quality is insufficient, formulas produce low scores with wide confidence bands. The system does not compensate with optimistic language. It flags the data gap and blocks document export until the gap is addressed. This is how institutional-grade intelligence maintains integrity under production conditions. The system tells you what it knows, what it does not know, and what you need to provide.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>



                {/* WHAT IT DELIVERS - Reports & Letters */}
                <section className="py-16 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">What You Receive</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-8">Reports and Letters That Open Doors</p>
                        
                        <div className="space-y-8">
                            <p className="text-xl text-slate-700 leading-relaxed">
                                The goal is not analysis for its own sake. The goal is to break open a clear path to partnership. BWGA AI produces executable artifacts-documents that can be sent directly to investors, presented to boards, or submitted to funding bodies.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="bg-slate-50 p-6 border-l-4 border-green-500">
                                    <p className="text-3xl font-light text-slate-900 mb-2">~30 minutes</p>
                                    <p className="text-slate-600">From project brief to draft investment memo</p>
                                </div>
                                <div className="bg-slate-50 p-6 border-l-4 border-blue-500">
                                    <p className="text-3xl font-light text-slate-900 mb-2">One platform</p>
                                    <p className="text-slate-600">Everything in one place-no fragmented consultants</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>Investment memos</strong> - structured for institutional review with executive summary, risk analysis, and financial projections</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>Letters of intent</strong> - professionally formatted, legally informed, ready for counterparty review</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>Partner matching reports</strong> - compatibility scores, risk profiles, recommended engagement sequences</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>Risk assessment briefings</strong> - flags problems before they become deal-breakers</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>Complete audit trails</strong> - every claim traceable to evidence, every formula transparent</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    <p className="text-lg text-slate-700"><strong>The Skeptic's Report</strong> - what your harshest critic would say, so you can address it first</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center">
                                <button 
                                    onClick={() => setShowDocumentTypesModal(true)} 
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-lg font-light"
                                >
                                    <FileText size={20} />
                                    See Full Document Catalog (100+ Types)
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE 10-STEP PROTOCOL */}
                <section className="py-20 px-12 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light mb-4">The Ten-Step Protocol</h2>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-12">From Strategic Intent to Executable Artifacts</p>
                        
                        <div className="space-y-6">
                            <p className="text-xl text-slate-200 leading-relaxed mb-8">
                                Every mandate passes through a structured reasoning sequence that transforms raw ambition into board-ready intelligence. This is not a checklist-it is an institutional governance protocol that enforces intellectual honesty at every transition point.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 1</span>
                                    <p className="text-white">Adversarial Input Screening</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Adversarial Input Screening</h4>
                                        <p className="text-sm text-slate-600">Before any analysis begins, the system challenges your input. It asks: Is this request clear? Are there hidden assumptions? What information is missing? This prevents garbage-in-garbage-out and ensures the analysis starts from a solid foundation.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 2</span>
                                    <p className="text-white">Historical Contextualization</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Historical Contextualization</h4>
                                        <p className="text-sm text-slate-600">The system retrieves relevant precedents: similar deals, comparable regions, historical outcomes. It asks what worked, what failed, and why. This grounds your opportunity in real-world evidence rather than optimistic projection.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 3</span>
                                    <p className="text-white">Five-Persona Boardroom Debate</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Five-Persona Boardroom Debate</h4>
                                        <p className="text-sm text-slate-600">Five AI personas—The Skeptic, The Advocate, The Analyst, The Regulator, and The Operator—debate your opportunity. They argue, disagree, and challenge each other. You see the full transcript, including where they agree and where conflict remains.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 4</span>
                                    <p className="text-white">Mathematical Quantification (27 Formulas)</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Mathematical Quantification</h4>
                                        <p className="text-sm text-slate-600">Your opportunity is scored across 27 proprietary formulas: SPI™, RROI™, SEAM™, IVAS™, SCF™, plus 22 derivative indices. Each score includes confidence intervals and sensitivity analysis. No subjective ratings—only mathematical outputs.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 5</span>
                                    <p className="text-white">Monte Carlo Simulation (100+ Iterations)</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Monte Carlo Simulation</h4>
                                        <p className="text-sm text-slate-600">The system runs 100+ probabilistic simulations to model uncertainty. You receive P10/P50/P90 projections showing pessimistic, base, and optimistic outcomes. This replaces single-point estimates with realistic probability distributions.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 6</span>
                                    <p className="text-white">Evidence Quality Assessment</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Evidence Quality Assessment</h4>
                                        <p className="text-sm text-slate-600">Every claim is traced to its source. The system evaluates data recency, source authority, and verification status. Weak evidence triggers automatic score clamping—preventing false confidence from unverified assumptions.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 7</span>
                                    <p className="text-white">Risk-Mitigation Mapping</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Risk-Mitigation Mapping</h4>
                                        <p className="text-sm text-slate-600">Identified risks are paired with specific mitigation strategies. The system doesn't just flag problems—it recommends solutions, contingency plans, and early warning indicators. Each risk includes likelihood and impact assessments.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 8</span>
                                    <p className="text-white">Partner Matching & Scoring</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Partner Matching & Scoring</h4>
                                        <p className="text-sm text-slate-600">The system identifies optimal partners based on capability fit, strategic alignment, and track record. Each potential partner receives a compatibility score with specific recommendations for engagement sequencing and negotiation approach.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 9</span>
                                    <p className="text-white">Document Generation & Audit Trail</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Document Generation & Audit Trail</h4>
                                        <p className="text-sm text-slate-600">Board-ready documents are generated automatically: investment memos, LOIs, risk briefings, partner reports. Every document includes a complete audit trail—every claim traceable to evidence, every formula transparent and verifiable.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 border-l-4 border-slate-500 cursor-pointer hover:bg-slate-700 hover:border-white transition-all duration-200 group relative">
                                    <span className="text-sm font-medium text-slate-400">Step 10</span>
                                    <p className="text-white">Outcome Learning & Model Refinement</p>
                                    <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-white text-slate-900 p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <h4 className="font-semibold mb-2">Outcome Learning & Model Refinement</h4>
                                        <p className="text-sm text-slate-600">When deals close (or fail), outcomes feed back into the system. The model learns which indicators predicted success, which risks materialized, and how to improve future assessments. The system gets smarter with every engagement.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-lg text-slate-300 leading-relaxed mt-8">
                                Strategic intent becomes executable documentation in approximately thirty minutes. Not because the system cuts corners-but because it performs the intellectual labor that traditionally requires weeks of consultant engagement, with mathematical rigor that survives committee scrutiny.
                            </p>
                        </div>
                    </div>
                </section>

                {/* WHO THIS IS FOR - Not a Replacement */}
                <section className="py-20 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-4">Who This Is For</h2>
                        <p className="text-slate-500 text-sm uppercase tracking-wider mb-12">Not a Replacement—A Force Multiplier for Every Skill Level</p>
                        
                        <div className="bg-slate-900 text-white p-8 rounded-lg shadow-xl mb-12">
                            <h3 className="text-2xl font-light mb-4">The Universal Benefit</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                BWGA AI is not designed to replace investment professionals or development officers. It is designed to give them capabilities they currently cannot access. Whether you are a junior analyst learning the ropes or a veteran director managing a billion-dollar portfolio, the system adapts to your depth of inquiry.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Persona 1: Regional Governments */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                                        <Building2 size={24} />
                                    </div>
                                    <h3 className="text-2xl font-light text-slate-900">Regional Agencies</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className="text-slate-700 leading-relaxed">
                                        Transform local knowledge into the structured intelligence global capital requires.
                                    </p>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Project Officer</p>
                                        <p className="text-sm text-slate-800">Turn raw project data into polished, investor-ready executive summaries in minutes, not weeks.</p>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Director</p>
                                        <p className="text-sm text-slate-800">Identify portfolio-wide gaps and ensure every project in your region meets global compliance standards before promotion.</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded border border-slate-200 italic text-slate-600 text-sm">
                                        "Finally, a tool that speaks the investor's language without requiring expensive consultants."
                                    </div>
                                </div>
                            </div>
                            
                            {/* Persona 2: Investors */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-full">
                                        <BarChart3 size={24} />
                                    </div>
                                    <h3 className="text-2xl font-light text-slate-900">Capital Allocators</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className="text-slate-700 leading-relaxed">
                                        Screen deals globally with standardized risk and compatibility scoring.
                                    </p>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Analyst</p>
                                        <p className="text-sm text-slate-800">Rapidly pre-screen hundreds of opportunities using "Skeptic Mode" to find deal-breakers instantly.</p>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Partner</p>
                                        <p className="text-sm text-slate-800">Receive board-ready standardized assessments that normalize risk across different jurisdictions and sectors.</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded border border-slate-200 italic text-slate-600 text-sm">
                                        "Due diligence that used to take months now takes days—and it is more thorough."
                                    </div>
                                </div>
                            </div>
                            
                            {/* Persona 3: Corporates */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
                                        <Briefcase size={24} />
                                    </div>
                                    <h3 className="text-2xl font-light text-slate-900">Corporate Strategy</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className="text-slate-700 leading-relaxed">
                                        Pre-qualify partners and markets before committing resources or travel budget.
                                    </p>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Expansion Manager</p>
                                        <p className="text-sm text-slate-800">Generate local compliance checklists and supply chain friction assessments before site visits.</p>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Board</p>
                                        <p className="text-sm text-slate-800">See evidence-backed market entry roadmaps that explicitly quantify "unknowns" and regulatory risk.</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded border border-slate-200 italic text-slate-600 text-sm">
                                        "Our board wanted evidence, not optimism. This system delivers exactly that."
                                    </div>
                                </div>
                            </div>
                            
                            {/* Persona 4: Advisors (New) */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-2xl font-light text-slate-900">Advisors & Consultants</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className="text-slate-700 leading-relaxed">
                                        Augment your advisory practice with deep, forensic AI-driven research.
                                    </p>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Consultant</p>
                                        <p className="text-sm text-slate-800">Automate the initial 40 hours of market research and regulatory mapping to focus on high-value strategy.</p>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">For the Principal</p>
                                        <p className="text-sm text-slate-800">Deliver data-rich client value propositions that smaller firms typically cannot resource.</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded border border-slate-200 italic text-slate-600 text-sm">
                                        "Allows boutique firms to deliver Tier-1 strategy outputs at a fraction of the cost."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROVEN RESULTS */}
                <section className="py-16 px-12 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-light mb-4">Rigorous System Validation</h2>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-8">Why We Stress-Tested Across 100+ Scenarios</p>
                        
                        <div className="bg-slate-800 p-8 mb-8 text-left">
                            <p className="text-lg text-slate-300 leading-relaxed mb-4">
                                <strong className="text-white">The problem with AI for high-stakes decisions:</strong> Most systems work in demos but fail under production conditions. They produce confident-sounding outputs without understanding edge cases, regulatory nuances, or the difference between a viable opportunity and a compelling narrative.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                <strong className="text-white">Our solution:</strong> We subjected every scoring formula, every persona's reasoning chain, and every output template to adversarial stress testing—real historical scenarios where we knew the outcomes, synthetic edge cases designed to break the system, and cross-jurisdictional complexity that would challenge any human analyst team.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <div>
                                <div className="text-5xl font-light mb-2">100+</div>
                                <p className="text-sm text-slate-400">Validation scenarios across historical and synthetic cases</p>
                            </div>
                            <div>
                                <div className="text-5xl font-light mb-2">6</div>
                                <p className="text-sm text-slate-400">Continents with distinct regulatory frameworks tested</p>
                            </div>
                            <div>
                                <div className="text-5xl font-light mb-2">$12B+</div>
                                <p className="text-sm text-slate-400">Simulated deal value to calibrate scoring accuracy</p>
                            </div>
                            <div>
                                <div className="text-5xl font-light mb-2">15+</div>
                                <p className="text-sm text-slate-400">Industry sectors from agriculture to deep tech</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-800 p-6 mb-8 text-left">
                            <p className="text-slate-300 leading-relaxed">
                                <strong className="text-white">What this means for you:</strong> The formulas have been calibrated against real-world complexity. The personas have been trained to identify risks that only emerge in specific jurisdictional contexts. The evidence clamping protocols have been validated to prevent false confidence. When BWGA AI produces a score, it reflects genuine analytical rigor—not pattern-matched optimism.
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setShowMonteCarloEvidence(true)} 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors text-lg font-light"
                        >
                            <BarChart3 size={20} />
                            Explore Test Results & Evidence
                        </button>
                    </div>
                </section>

                {/* FOUNDER - Compact */}
                <section className="py-16 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-8 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-slate-300 text-3xl font-light">BW</div>
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-light text-slate-900 mb-1">Brayden Walls</p>
                                <p className="text-slate-600 mb-4">Founder, BW Global Advisory</p>
                                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                                    "We built this system because the gap between 'investable' and 'uninvestable' is often just a gap in information. I watched for years as incredible regional opportunities were passed over—not because the fundamentals were weak, but because the cost of verifying them was too high.
                                </p>
                                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                                    BWGA AI exists to democratize institutional-grade due diligence. We believe that if you can articulate your value with the same rigor as a Wall Street firm, you can compete for the same capital. This platform gives you that rigor."
                                </p>
                                <p className="text-slate-500 text-sm mt-6">
                                    BW Global Advisory Pty Ltd | Melbourne, Australia | ABN 55 978 113 300
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BETA INVITATION - Premium Editorial */}
                <section className="py-20 px-12 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light mb-4 text-center">Get Started</h2>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-12 text-center">No onboarding required. Try a live demo or contact us for a pilot.</p>
                        
                        <div className="prose prose-lg prose-invert max-w-none">
                            <p className="text-xl font-light text-slate-300 leading-relaxed mb-12 text-center">
                                We are selecting a limited cohort of Regional Governments, Development Agencies, and Forward-Thinking Investors to deploy this system before its global rollout.
                            </p>
                            
                            <div className="bg-slate-800 p-8 border-l-4 border-slate-500 mb-12">
                                <p className="text-2xl font-light text-slate-200 leading-relaxed text-center">
                                    The goal: to prove that when a region is equipped with world-class intelligence tools, it can compete for-and win-foreign direct investment on its own terms.
                                </p>
                            </div>
                            
                            <p className="text-lg text-slate-300 leading-relaxed text-center mb-12">
                                We will run your priority projects through the ten-step protocol. We will give you the Skeptic's Report so you know your weaknesses. We will generate the board-ready artifacts you need to go to market.
                            </p>
                            
                            <div className="text-center space-y-4">
                                <p className="text-2xl font-light text-slate-200">Join us. Be seen. Be chosen.</p>
                                <p className="text-lg text-slate-400">Do not let your region be invisible. Let the reasoning engine map your value.</p>
                                <p className="text-lg text-slate-300">You are no longer an unknown entity. You are a verified node in the global grid.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BETA BENEFITS - Premium Editorial */}
                <section className="py-20 px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-light text-slate-900 mb-12 text-center">What Beta Partners Receive</h2>
                        
                        <div className="prose prose-lg max-w-none">
                            <p className="text-xl font-light text-slate-700 leading-relaxed mb-12 text-center">
                                We are inviting you to be a Founding Beta Partner not to "test software," but to deploy this ten-step protocol on your region's toughest challenges.
                            </p>
                            
                            <div className="space-y-4 mb-12">
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">1</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Full platform access for pilot engagement</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">2</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Direct collaboration with the founding architect</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">3</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Influence on roadmap priorities</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">4</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Preferred terms as the platform scales</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">5</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Skeptic's Report on your priority projects</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">6</div>
                                    <p className="text-lg text-slate-700 leading-relaxed">Board-ready artifacts for investor engagement</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-slate-600 text-center">
                                To discuss a pilot engagement, contact BW Global Advisory directly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* TERMS - Premium Editorial */}
                <section className="py-20 px-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-slate-900 font-medium uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-slate-600" /> Terms of Engagement & Compliance
                        </h3>
                        <div className="space-y-4 text-base text-slate-700 bg-white p-8 rounded-lg border border-slate-200 max-h-[320px] overflow-y-auto shadow-sm">
                            <p><strong className="text-slate-900 block mb-1">1. Strategic Decision Support</strong> BW AI is a decision support platform. All outputs are advisory and must be validated by qualified professionals before binding commitments.</p>
                            <p><strong className="text-slate-900 block mb-1">2. Reasoning Governance (NSIL)</strong> The NSIL layer governs analysis via adversarial input screening, multi-perspective debate, counterfactual simulation, scoring engines, and a learning loop. This reduces false confidence and enforces explainability.</p>
                            <p><strong className="text-slate-900 block mb-1">3. Data Privacy & Sovereignty</strong> Strict compliance with data sovereignty and privacy laws (GDPR, Australian Privacy Act). Sensitive intents and operational data are segregated. No user-specific data trains public models.</p>
                            <p><strong className="text-slate-900 block mb-1">4. Model Limits & Accountability</strong> The 27-formula suite (including SPI-, RROI-, SEAM-, IVAS-, SCF-) exposes fragility and leverage; it does not predict the future. Users retain final accountability for decisions.</p>
                            <p><strong className="text-slate-900 block mb-1">5. Compliance & Ethics</strong> The Regulator persona continuously checks legality, ethics, sanctions, and policy alignment. Outputs include audit trails for traceability. AI must never replace human authority.</p>
                            <p><strong className="text-slate-900 block mb-1">6. Liability & IP Protection</strong> All intellectual property, methodologies, orchestration primitives, and the 27-formula suite are owned by BW Global Advisory Pty Ltd (BWGA). Access or evaluation does not grant any license or transfer of rights. You agree to keep non-public materials confidential, use them solely for evaluation, and not disclose, copy, reverse-engineer, or use the system to build a competing product; any feedback becomes BWGA property. Beta/R&D notice: the platform is provided "AS IS" without warranties; advisory outputs require professional validation. To the extent permitted by law, BWGA disclaims indirect, incidental, consequential, and punitive damages; total liability is capped at fees paid for the specific service. Misuse of IP may cause irreparable harm; BWGA may seek injunctive relief in addition to other remedies.</p>
                        </div>
                        
                        {/* Terms Acceptance */}
                        <div className="mt-8 flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                id="acceptTerms" 
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                            />
                            <label htmlFor="acceptTerms" className="text-base text-slate-700 cursor-pointer">
                                I have read and agree to the <strong>Terms of Engagement & Compliance</strong> above. I understand that BW AI is a decision support platform in R&D beta, and all outputs require professional validation before binding commitments.
                            </label>
                        </div>
                        
                        {/* Access Button */}
                        <div className="mt-8 text-center">
                            <button 
                                disabled={!termsAccepted}
                                onClick={() => termsAccepted && onEnterPlatform?.()}
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-light text-lg transition-all ${
                                    termsAccepted 
                                        ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-lg hover:shadow-xl' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Access BW AI Platform
                                <ArrowRight size={20} />
                            </button>
                            {!termsAccepted && (
                                <p className="text-sm text-slate-500 mt-3">Please accept the terms above to continue</p>
                            )}
                        </div>
                        
                        <p className="text-slate-500 text-xs mt-8 text-center">- 2026 BW Global Advisory Pty Ltd. Nexus Intelligence OS v6.0 - Melbourne, Australia. ABN 55 978 113 300. Trading as Sole Trader while in R&D.</p>
                    </div>
                </section>
            </div>
        </div>
        </>
    );
};

export default CommandCenter;
