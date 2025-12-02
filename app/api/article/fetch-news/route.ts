import { NextResponse } from 'next/server';
import { scrapeArticleContent } from '@/lib/articleScraper';
import menuData from '@/json/menu.json';
import { FetchedArticle, NEWS_SOURCES } from '@/types/newsApi';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const VALID_TAGS = menuData.tags.map((t) => t.title).join(', ');
const VALID_REGIONS = menuData.regions.map((r) => r.title).join(', ');

/**
 * AI Helper to classify a single article
 */
async function classifyArticle(
  title: string,
  description: string,
): Promise<{ tag: string; region: string }> {
  try {
    const prompt = `
      Classify this news article.
      Article: "${title}" - ${description}
      Allowed Tags: [${VALID_TAGS}]
      Allowed Regions: [${VALID_REGIONS}]
      Return JSON only: { "tag": "SelectedTag", "region": "SelectedRegion" }
      Defaults: Tag="Diplomacy", Region="Global"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { tag: 'Diplomacy', region: 'Global' };

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      tag: parsed.tag || 'Diplomacy',
      region: parsed.region || 'Global',
    };
  } catch (error) {
    return { tag: 'Diplomacy', region: 'Global' };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedSource = searchParams.get('source');

  try {
    const sourcesToFetch = selectedSource
      ? NEWS_SOURCES.filter((s) => s.id === selectedSource)
      : NEWS_SOURCES;

    const articlePromises: Promise<FetchedArticle | null>[] = [];

    for (const source of sourcesToFetch) {
      const url = `https://newsapi.org/v2/top-headlines?sources=${source.id}&pageSize=9`;

      const response = await fetch(url, {
        headers: { 'X-Api-Key': process.env.NEWS_API_KEY! },
      });

      if (!response.ok) continue;

      const data = await response.json();

      for (const apiArticle of data.articles) {
        if (apiArticle.title === '[Removed]' || !apiArticle.description)
          continue;

        const processPromise = async () => {
          try {
            const date = new Date(
              apiArticle.publishedAt || Date.now(),
            ).toISOString();
            const title = apiArticle.title || 'Untitled Article';
            const description = apiArticle.description || '';

            // DEFAULT content to description in case scrape fails
            let fullContent = apiArticle.content || description;

            // Attempt to scrape full content
            if (apiArticle.url) {
              try {
                const scrapedData = await scrapeArticleContent(apiArticle.url);
                // Only use scraped content if it's substantial
                if (
                  scrapedData &&
                  scrapedData.content &&
                  scrapedData.content.length > 200
                ) {
                  fullContent = scrapedData.content;
                }
              } catch (e) {
                console.warn(
                  `Scrape failed for ${apiArticle.url}, using fallback.`,
                );
              }
            }

            // Run AI Classification
            const classification = await classifyArticle(title, description);

            return {
              id: `${source.id}-${title}`.replace(/[^a-z0-9]/gi, '_'),
              title,
              description,
              author: apiArticle.author || source.name,
              publishedAt: date,
              urlToImage: apiArticle.urlToImage || '/default-cover.jpg',
              source: source.name,
              content: fullContent,
              url: apiArticle.url,
              tag: classification.tag,
              region: classification.region,
            } as FetchedArticle;
          } catch (error) {
            console.error(
              `Error processing article: ${apiArticle.title}`,
              error,
            );
            return null;
          }
        };

        articlePromises.push(processPromise());
      }
    }

    const results = await Promise.all(articlePromises);
    const articles = results.filter((a): a is FetchedArticle => a !== null);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
