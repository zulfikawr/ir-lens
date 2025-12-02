import { addArticle } from './database';
import { Article } from '@/types/article';
import { processArticleWithAI } from './aiEnhancer';
import { scrapeArticleContent } from './articleScraper';
import menuData from '@/json/menu.json';

// --- Type definitions for API response ---
interface NewsApiSource {
  id: string;
  name: string;
  region: string;
  tag: string;
}

// --- Define News API sources ---
const NEWS_API_SOURCES: NewsApiSource[] = [
  {
    id: 'al-jazeera-english',
    name: 'Al Jazeera English',
    region: 'Middle East',
    tag: 'Conflicts',
  },
  {
    id: 'associated-press',
    name: 'Associated Press',
    region: 'Global',
    tag: 'Diplomacy',
  },
];

// Simple keyword maps for tag/region detection (same logic as the API route)
const tagKeywords: Record<string, string[]> = {
  Diplomacy: [
    'diplomacy',
    'summit',
    'talks',
    'foreign minister',
    'treaty',
    'diplomatic',
    'sanctions',
  ],
  Economy: [
    'economy',
    'economy',
    'market',
    'inflation',
    'gdp',
    'stock',
    'stocks',
    'trade',
    'black friday',
    'shopping',
    'consumers',
    'spending',
  ],
  Conflicts: [
    'war',
    'conflict',
    'attack',
    'strike',
    'troops',
    'missile',
    'casualty',
    'fighting',
    'battle',
    'invasion',
  ],
  Climate: [
    'climate',
    'warming',
    'emissions',
    'environment',
    'cop',
    'temperature',
    'sea level',
    'carbon',
    'sustainability',
  ],
};

const regionKeywords: Record<string, string[]> = {
  Asia: [
    'asia',
    'china',
    'india',
    'japan',
    'korea',
    'south korea',
    'north korea',
    'taiwan',
    'asean',
    'southeast asia',
  ],
  Europe: [
    'europe',
    'eu',
    'germany',
    'france',
    'uk',
    'united kingdom',
    'russia',
    'poland',
    'italy',
    'spain',
  ],
  'Middle East': [
    'middle east',
    'israel',
    'palestine',
    'iran',
    'iraq',
    'syria',
    'saudi',
    'saudi arabia',
    'uae',
    'qatar',
  ],
  Africa: [
    'africa',
    'nigeria',
    'kenya',
    'ethiopia',
    'egypt',
    'south africa',
    'algeria',
  ],
  Americas: [
    'united states',
    'u.s.',
    'us',
    'canada',
    'brazil',
    'mexico',
    'america',
    'argentina',
    'chile',
    'colombia',
  ],
  Global: ['global', 'world', 'international'],
};

function detectTag(text: string): string | null {
  const lc = text.toLowerCase();
  for (const tagObj of menuData.tags) {
    const tag = tagObj.title;
    const kws = tagKeywords[tag as keyof typeof tagKeywords] || [];
    for (const kw of kws) {
      if (lc.includes(kw)) return tag;
    }
  }
  return null;
}

function detectRegion(text: string): string | null {
  const lc = text.toLowerCase();
  for (const regionObj of menuData.regions) {
    const region = regionObj.title;
    const kws = regionKeywords[region as keyof typeof regionKeywords] || [];
    for (const kw of kws) {
      if (lc.includes(kw)) return region;
    }
  }
  return null;
}

// --- Main Fetching Function (AI-powered) ---
export async function fetchAndProcessNews(): Promise<
  Array<
    | { source: string; articlesAdded: number }
    | { source: string; error: string }
  >
> {
  const results: Array<
    | { source: string; articlesAdded: number }
    | { source: string; error: string }
  > = [];

  for (const source of NEWS_API_SOURCES) {
    const pageSize = 5;
    const url = `https://newsapi.org/v2/top-headlines?sources=${source.id}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': process.env.NEWS_API_KEY!,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `News API error: ${errorData.message || response.statusText}`,
        );
      }

      const data = await response.json();

      const newArticles: Article[] = [];
      for (const apiArticle of data.articles) {
        try {
          if (apiArticle.title === '[Removed]' || !apiArticle.description) {
            continue;
          }

          // Scrape full content from URL
          let fullContent = apiArticle.content || apiArticle.description || '';
          if (apiArticle.url) {
            try {
              const scrapedData = await scrapeArticleContent(apiArticle.url);
              if (scrapedData && scrapedData.content.length > 200) {
                fullContent = scrapedData.content;
              }
            } catch (scrapeError) {
              console.warn(`Failed to scrape ${apiArticle.url}:`, scrapeError);
            }
          }

          // Determine tag/region from content and fallbacks
          const title = apiArticle.title || 'Untitled Article';
          const combinedText = `${title} ${apiArticle.description || ''} ${fullContent}`;
          const detectedTag =
            detectTag(combinedText) ||
            (source.tag && menuData.tags.some((t) => t.title === source.tag)
              ? source.tag
              : null);
          if (!detectedTag) {
            // skip articles that don't match allowed tags
            continue;
          }

          const detectedRegion =
            detectRegion(combinedText) ||
            (source.region &&
            menuData.regions.some((r) => r.title === source.region)
              ? source.region
              : 'Global');

          // Process article with AI (all cleaning, rewriting, structuring)
          const article = await processArticleWithAI(
            apiArticle.title || 'Untitled Article',
            fullContent,
            source.name,
            detectedRegion,
          );

          // ensure the AI-assigned tag is within allowed tags; if not, use detectedTag
          if (article) {
            if (
              article.tag &&
              !menuData.tags.some((t) => t.title === article.tag)
            ) {
              article.tag = detectedTag;
            } else if (!article.tag) {
              article.tag = detectedTag;
            }

            if (!article.region) article.region = detectedRegion;

            await addArticle(article);
            newArticles.push(article);
          }
        } catch (error) {
          console.error(
            `Error processing article "${apiArticle.title}":`,
            error,
          );
        }
      }

      results.push({
        source: source.name,
        articlesAdded: newArticles.length,
      });
    } catch (error) {
      console.error(`Error fetching news from ${source.name}:`, error);
      results.push({
        source: source.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
