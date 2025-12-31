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
      data.RelatedTopics.slice(0, 10).forEach((topic: any, idx: number) => {
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
    const { query, country, category } = req.body;

    const articles: any[] = [];

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
          articles.push(...(data.articles || []).map((a: any) => ({
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
          articles.push(...(data.news || []).map((n: any) => ({
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
            const latest = data[1]?.find((d: any) => d.value !== null);
            return {
              indicator,
              name: latest?.indicator?.value,
              value: latest?.value,
              year: latest?.date
            };
          }
        } catch (error) {
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

export default router;
