import { NextResponse } from 'next/server';
import { scrapeArticleContent } from '@/lib/articleScraper';
import menuData from '@/json/menu.json';
import { FetchedArticle, NEWS_SOURCES } from '@/types/newsApi';

export async function GET(request: Request) {
  const articles: FetchedArticle[] = [];
  const { searchParams } = new URL(request.url);
  const selectedSource = searchParams.get('source');

  // helpers: simple keyword-based tag/region detection
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

  try {
    // Filter sources based on selection
    const sourcesToFetch = selectedSource
      ? NEWS_SOURCES.filter((s) => s.id === selectedSource)
      : NEWS_SOURCES;

    for (const source of sourcesToFetch) {
      const pageSize = 9;
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

        for (const apiArticle of data.articles) {
          try {
            if (apiArticle.title === '[Removed]' || !apiArticle.description) {
              continue;
            }

            const date = new Date(
              apiArticle.publishedAt || Date.now(),
            ).toISOString();
            const title = apiArticle.title || 'Untitled Article';
            const tag = apiArticle.tag;
            const region = apiArticle.region;
            const description = apiArticle.description
              ? apiArticle.description.slice(0, 200) + '...'
              : 'No description available';

            // Scrape full article content from the URL
            let fullContent =
              apiArticle.content || apiArticle.description || '';
            if (apiArticle.url) {
              try {
                const scrapedData = await scrapeArticleContent(apiArticle.url);
                if (scrapedData && scrapedData.content.length > 200) {
                  fullContent = scrapedData.content;
                }
              } catch (scrapeError) {
                console.warn(
                  `Failed to scrape ${apiArticle.url}:`,
                  scrapeError,
                );
              }
            }
            // Determine tag/region from content and fallbacks
            const combinedText = `${title} ${apiArticle.description || ''} ${fullContent}`;
            const detectedTag =
              detectTag(combinedText) ||
              (tag && menuData.tags.some((t) => t.title === tag) ? tag : null);
            if (!detectedTag) {
              // skip articles that don't match allowed tags
              continue;
            }

            const detectedRegion =
              detectRegion(combinedText) ||
              (region && menuData.regions.some((r) => r.title === region)
                ? region
                : 'Global');

            articles.push({
              id: `${source.id}-${apiArticle.title}`.replace(
                /[^a-z0-9]/gi,
                '_',
              ),
              title,
              description,
              author: apiArticle.author || source.name,
              publishedAt: date,
              urlToImage: apiArticle.urlToImage || '/default-cover.jpg',
              source: source.name,
              content: fullContent,
              url: apiArticle.url,
              tag: detectedTag,
              region: detectedRegion,
            });
          } catch (error) {
            console.error(
              `Error processing article "${apiArticle.title}":`,
              error,
            );
          }
        }
      } catch (error) {
        console.error(`Error fetching news from ${source.name}:`, error);
        return NextResponse.json(
          {
            error: `Failed to fetch news from ${source.name}`,
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
