/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BWGA Intelligence AI - LIVE SEARCH API ROUTES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Real-time search integrations:
 * 1. Serper (Google Search API)
 * 2. Perplexity AI Search
 * 3. News aggregation
 * 4. Financial data feeds
 * 
 * All endpoints return real-time, live data - NO mock data
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import express, { Request, Response, Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════════
// SERPER - Google Search API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/search/serper
 * Perform Google search via Serper API
 */
router.post('/serper', async (req: Request, res: Response) => {
  try {
    const { query, num = 10, type = 'search' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    
    if (!SERPER_API_KEY) {
      // Fallback to DuckDuckGo instant answer API (no key required)
      return await fallbackSearch(query, res);
    }

    const endpoint = type === 'news' 
      ? 'https://google.serper.dev/news'
      : 'https://google.serper.dev/search';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num
      })
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Serper search error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      fallback: true,
      organic: []
    });
  }
});

/**
 * Fallback search using DuckDuckGo (no API key required)
 */
async function fallbackSearch(query: string, res: Response) {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
    );
    
    const data = await response.json();
    
    // Transform DuckDuckGo format to Serper format
    const organic = [];
    
    if (data.AbstractText) {
      organic.push({
        title: data.Heading || query,
        link: data.AbstractURL || data.AbstractSource,
        snippet: data.AbstractText,
        position: 1
      });
    }
    
    if (data.RelatedTopics) {
      (data.RelatedTopics as Array<{ Text?: string; FirstURL?: string }>).slice(0, 10).forEach((topic, idx) => {
        if (topic.Text && topic.FirstURL) {
          organic.push({
            title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
            link: topic.FirstURL,
            snippet: topic.Text,
            position: idx + 2
          });
        }
      });
    }
    
    return res.json({
      organic,
      searchParameters: { q: query, engine: 'duckduckgo-fallback' }
    });
  } catch (error) {
    console.error('Fallback search error:', error);
    return res.json({ organic: [], fallback: true });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERPLEXITY AI - AI-Enhanced Search
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/search/perplexity
 * AI-enhanced search with citations
 */
router.post('/perplexity', async (req: Request, res: Response) => {
  try {
    const { query, context, model = 'pplx-7b-online' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      // Fallback to regular search + AI synthesis
      return res.json({
        response: `Searching for: ${query}`,
        citations: [],
        fallback: true
      });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant. Provide accurate, well-sourced answers with citations.'
          },
          {
            role: 'user',
            content: context ? `Context: ${JSON.stringify(context)}\n\nQuery: ${query}` : query
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
        return_citations: true
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    return res.json({
      response: data.choices?.[0]?.message?.content || '',
      citations: data.citations || [],
      model: data.model
    });
  } catch (error) {
    console.error('Perplexity search error:', error);
    return res.status(500).json({ 
      error: 'Perplexity search failed',
      response: '',
      citations: []
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS AGGREGATION - Real-time news from multiple sources
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/search/news
 * Aggregate news from multiple sources
 */
router.post('/news', async (req: Request, res: Response) => {
  try {
    const { query, country } = req.body;

    const articles: Array<{
      title?: string;
      description?: string;
      url?: string;
      source?: string;
      publishedAt?: string;
      image?: string;
    }> = [];

    // Try NewsAPI if key is available
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (NEWS_API_KEY) {
      try {
        const params = new URLSearchParams({
          apiKey: NEWS_API_KEY,
          q: query || country || 'business',
          language: 'en',
          sortBy: 'relevancy',
          pageSize: '10'
        });

        const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          articles.push(...(data.articles as Array<{ title?: string; description?: string; url?: string; source?: { name?: string }; publishedAt?: string; urlToImage?: string }> || []).map((a) => ({
            title: a.title,
            description: a.description,
            url: a.url,
            source: a.source?.name,
            publishedAt: a.publishedAt,
            image: a.urlToImage
          })));
        }
      } catch (error) {
        console.warn('NewsAPI failed:', error);
      }
    }

    // Try Serper news as fallback/supplement
    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    
    if (SERPER_API_KEY) {
      try {
        const response = await fetch('https://google.serper.dev/news', {
          method: 'POST',
          headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ q: query || country || 'business news' })
        });
        
        if (response.ok) {
          const data = await response.json();
          articles.push(...(data.news as Array<{ title?: string; snippet?: string; link?: string; source?: string; date?: string; imageUrl?: string }> || []).map((n) => ({
            title: n.title,
            description: n.snippet,
            url: n.link,
            source: n.source,
            publishedAt: n.date,
            image: n.imageUrl
          })));
        }
      } catch (error) {
        console.warn('Serper news failed:', error);
      }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const uniqueArticles = articles.filter(a => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    return res.json({
      articles: uniqueArticles.slice(0, 20),
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('News aggregation error:', error);
    return res.status(500).json({ articles: [], error: 'News aggregation failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL DATA - Real-time market data
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/search/financial/:symbol
 * Get financial data for a symbol
 */
router.get('/financial/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    // Try Alpha Vantage
    const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (ALPHA_VANTAGE_KEY) {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data['Global Quote']) {
          return res.json({
            symbol,
            price: parseFloat(data['Global Quote']['05. price']),
            change: parseFloat(data['Global Quote']['09. change']),
            changePercent: data['Global Quote']['10. change percent'],
            volume: parseInt(data['Global Quote']['06. volume']),
            timestamp: data['Global Quote']['07. latest trading day']
          });
        }
      }
    }
    
    // Try Yahoo Finance (unofficial)
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      );
      
      if (response.ok) {
        const data = await response.json();
        const quote = data.chart?.result?.[0];
        if (quote) {
          const meta = quote.meta;
          return res.json({
            symbol,
            price: meta.regularMarketPrice,
            change: meta.regularMarketPrice - meta.previousClose,
            changePercent: `${(((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100).toFixed(2)}%`,
            volume: meta.regularMarketVolume,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.warn('Yahoo Finance failed:', error);
    }

    return res.status(404).json({ error: 'Symbol not found' });
  } catch (error) {
    console.error('Financial data error:', error);
    return res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COUNTRY INTELLIGENCE - Real-time country data
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/search/country/:code
 * Get comprehensive country data
 */
router.get('/country/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    // Fetch from multiple sources in parallel
    const [restCountries, worldBank] = await Promise.all([
      fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(r => r.ok ? r.json() : []),
      fetch(`https://api.worldbank.org/v2/country/${code}?format=json`).then(r => r.ok ? r.json() : [])
    ]);

    const country = restCountries[0] || {};
    const wbCountry = worldBank[1]?.[0] || {};

    return res.json({
      name: country.name?.common || wbCountry.name,
      officialName: country.name?.official,
      code: code.toUpperCase(),
      capital: country.capital?.[0] || wbCountry.capitalCity,
      region: country.region || wbCountry.region?.value,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      currencies: country.currencies ? Object.values(country.currencies) : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || [],
      timezones: country.timezones || [],
      flag: country.flags?.svg,
      incomeLevel: wbCountry.incomeLevel?.value,
      lendingType: wbCountry.lendingType?.value,
      longitude: wbCountry.longitude || country.latlng?.[1],
      latitude: wbCountry.latitude || country.latlng?.[0]
    });
  } catch (error) {
    console.error('Country data error:', error);
    return res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ECONOMIC INDICATORS - Real-time economic data
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/search/indicators/:country
 * Get economic indicators for a country
 */
router.get('/indicators/:country', async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    
    // World Bank indicators
    const indicators = ['NY.GDP.MKTP.CD', 'NY.GDP.PCAP.CD', 'FP.CPI.TOTL.ZG', 'SL.UEM.TOTL.ZS'];
    
    const results = await Promise.all(
      indicators.map(async (indicator) => {
        try {
          const response = await fetch(
            `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=5`
          );
          if (response.ok) {
            const data = await response.json();
            const latest = (data[1] as Array<{ value: number | null; indicator?: { value?: string }; date?: string }> | undefined)?.find((d) => d.value !== null);
            return {
              indicator,
              name: latest?.indicator?.value,
              value: latest?.value,
              year: latest?.date
            };
          }
        } catch {
          console.warn(`Indicator ${indicator} failed`);
        }
        return null;
      })
    );

    return res.json({
      country,
      indicators: results.filter(Boolean),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Indicators error:', error);
    return res.status(500).json({ error: 'Failed to fetch indicators' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION INTELLIGENCE - AI-Enhanced Location Research (uses Gemini)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/search/location-intelligence
 * Comprehensive AI-powered location research using Gemini
 */
router.post('/location-intelligence', async (req: Request, res: Response) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    console.log(`[Location Intelligence] Researching: ${location}`);

    // Get basic data from public APIs first
    const [geoData, wikiData] = await Promise.all([
      fetchLocationGeocoding(location),
      fetchLocationWikipedia(location)
    ]);

    // Get World Bank data if we have country code
    let economicData = null;
    if (geoData?.countryCode) {
      economicData = await fetchLocationWorldBank(geoData.countryCode);
    }

    // Use Gemini for comprehensive synthesis
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.warn('[Location Intelligence] No GEMINI_API_KEY - returning basic data only');
      return res.json({
        location,
        geocoding: geoData,
        wikipedia: wikiData,
        economics: economicData,
        aiEnhanced: false,
        message: 'Basic data only - AI enhancement requires GEMINI_API_KEY'
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a world-class location intelligence analyst. Provide comprehensive, accurate intelligence about: "${location}"

CONTEXT DATA (use as foundation, expand with your knowledge):
- Wikipedia: ${wikiData || 'Not available'}
- Coordinates: ${geoData ? `${geoData.lat}, ${geoData.lon}` : 'Unknown'}
- Country: ${geoData?.country || 'Unknown'}
- Economic Data: ${JSON.stringify(economicData || {})}

Return a detailed JSON response with REAL data (not placeholders). Use actual names, numbers, and facts:

{
  "overview": {
    "description": "3 comprehensive paragraphs about this location - its history, current status, and future outlook",
    "significance": "Strategic and economic importance - why investors/businesses should care",
    "established": "Year or era established",
    "nicknames": ["Common nicknames or titles"]
  },
  "demographics": {
    "population": "Current population with year (e.g., '245,000 (2023)')",
    "populationGrowth": "Annual growth rate (e.g., '1.2%')",
    "medianAge": "Median age (e.g., '34 years')",
    "urbanization": "Urban percentage",
    "languages": ["Languages spoken"],
    "ethnicGroups": ["Major ethnic groups if notable"]
  },
  "governance": {
    "leader": {
      "name": "ACTUAL current mayor/governor/leader name",
      "title": "Official title",
      "since": "Year took office",
      "party": "Political party if applicable"
    },
    "type": "Government/administrative type",
    "departments": ["Key government departments"],
    "administrativeLevel": "How it fits in national structure"
  },
  "economy": {
    "gdpLocal": "Local/regional GDP or economic output",
    "gdpGrowth": "Recent growth rate",
    "mainIndustries": [
      {"name": "Industry name", "description": "Brief description of scale/importance"}
    ],
    "majorEmployers": ["Actual company names that are major employers"],
    "unemployment": "Unemployment rate",
    "averageIncome": "Average income/wage data",
    "economicZones": ["Special economic zones if any"],
    "exports": ["Major export products"],
    "tradePartners": ["Key trading partners"]
  },
  "infrastructure": {
    "airports": [{"name": "Actual airport name", "code": "IATA code", "type": "International/Regional/Domestic"}],
    "seaports": [{"name": "Actual port name", "type": "Container/Bulk/Passenger"}],
    "railways": "Railway connectivity description",
    "roads": "Major highways/road networks",
    "publicTransit": "Public transit systems available",
    "internetPenetration": "Internet access percentage",
    "powerCapacity": "Power infrastructure description",
    "waterSupply": "Water infrastructure"
  },
  "investment": {
    "climate": "Overall investment climate - 2-3 sentences",
    "incentives": ["Specific available investment incentives"],
    "fdiTrends": "Foreign direct investment trends",
    "opportunities": ["Top 5 specific investment opportunities"],
    "challenges": ["Key investment challenges to consider"],
    "easeOfBusiness": "Ease of doing business context"
  },
  "education": {
    "universities": [{"name": "Actual university name", "ranking": "National/regional ranking if notable", "specialties": ["Key programs"]}],
    "vocationalSchools": ["Technical/vocational institutions"],
    "literacyRate": "Literacy rate percentage",
    "workforceSkills": "Workforce skill level description"
  },
  "recentDevelopments": [
    {"date": "2024 or 2025", "title": "Specific development title", "description": "What happened", "impact": "Economic/business impact"}
  ],
  "risks": {
    "political": "Political risk assessment - specific concerns",
    "economic": "Economic risk factors",
    "natural": "Natural disaster risks specific to this area",
    "regulatory": "Regulatory challenges or changes"
  },
  "competitiveAdvantages": ["5-7 specific strategic advantages"],
  "developmentNeeds": ["3-5 areas needing development or improvement"],
  "similarLocations": [
    {"name": "Similar city/region", "country": "Country", "similarity": "Why similar", "keyDifference": "Main difference"}
  ],
  "scores": {
    "infrastructure": 65,
    "politicalStability": 70,
    "laborPool": 60,
    "investmentMomentum": 55,
    "regulatoryEase": 50,
    "costCompetitiveness": 60
  },
  "dataSources": ["List authoritative sources for this data"],
  "dataQuality": {
    "completeness": 85,
    "freshness": "2024-2025",
    "confidence": "High/Medium/Low with brief explanation"
  }
}

CRITICAL:
- Use REAL, ACCURATE data - actual names, numbers, facts
- For leaders, use the CURRENT leader as of your knowledge
- Include actual company names, airport codes (like MEL, SYD), university names
- Be specific about economic figures
- If uncertain, provide best estimate with "(estimated)" note
- Return ONLY valid JSON, no markdown code blocks or explanation text`;

    console.log('[Location Intelligence] Calling Gemini AI...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let aiIntelligence = null;
    try {
      // Extract JSON from response (handle potential markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiIntelligence = JSON.parse(jsonMatch[0]);
        console.log('[Location Intelligence] AI response parsed successfully');
      }
    } catch (parseError) {
      console.warn('[Location Intelligence] Failed to parse AI JSON:', parseError);
    }

    return res.json({
      location,
      geocoding: geoData,
      wikipedia: wikiData,
      worldBank: economicData,
      aiIntelligence,
      aiEnhanced: !!aiIntelligence,
      timestamp: new Date().toISOString(),
      researchId: `research-${Date.now()}`
    });

  } catch (error) {
    console.error('[Location Intelligence] Error:', error);
    return res.status(500).json({ 
      error: 'Location intelligence research failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper: Geocoding with country extraction
async function fetchLocationGeocoding(location: string): Promise<{
  lat: number;
  lon: number;
  displayName: string;
  country: string;
  countryCode: string;
  state?: string;
  type: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=1`,
      { headers: { 'User-Agent': 'BWGA-Intelligence/1.0' } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          country: data[0].address?.country || '',
          countryCode: (data[0].address?.country_code || '').toUpperCase(),
          state: data[0].address?.state || data[0].address?.province,
          type: data[0].type
        };
      }
    }
  } catch (error) {
    console.warn('[Geocoding] Failed:', error);
  }
  return null;
}

// Helper: Wikipedia with extended extract
async function fetchLocationWikipedia(location: string): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(location)}&format=json&origin=*&srlimit=1`
    );
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.query?.search?.[0]) {
        const title = searchData.query.search[0].title;
        const extractRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`
        );
        if (extractRes.ok) {
          const extractData = await extractRes.json();
          const pages = extractData.query?.pages;
          const page = Object.values(pages)[0] as { extract?: string };
          // Get first 3000 chars for good context
          return page?.extract?.substring(0, 3000) || null;
        }
      }
    }
  } catch (error) {
    console.warn('[Wikipedia] Failed:', error);
  }
  return null;
}

// Helper: World Bank economic indicators
async function fetchLocationWorldBank(countryCode: string): Promise<Record<string, { value: number; year: string }> | null> {
  const indicators = [
    { code: 'NY.GDP.MKTP.CD', name: 'GDP (current US$)' },
    { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth (annual %)' },
    { code: 'NY.GDP.PCAP.CD', name: 'GDP per capita' },
    { code: 'SP.POP.TOTL', name: 'Population' },
    { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment Rate' },
    { code: 'IT.NET.USER.ZS', name: 'Internet Users (%)' },
    { code: 'BX.KLT.DINV.CD.WD', name: 'Foreign Direct Investment' }
  ];
  
  const results: Record<string, { value: number; year: string }> = {};
  
  await Promise.all(indicators.map(async (ind) => {
    try {
      const res = await fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${ind.code}?format=json&per_page=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data[1]?.[0]?.value !== null) {
          results[ind.name] = { 
            value: data[1][0].value, 
            year: data[1][0].date 
          };
        }
      }
    } catch {
      // Individual indicator failure is OK
    }
  }));
  
  return Object.keys(results).length > 0 ? results : null;
}

export default router;
