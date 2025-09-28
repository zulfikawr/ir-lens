import { addArticle } from './database';
import { Article } from '@/types/article';
import { ContentBlock } from '@/types/contentBlocks';

// --- Type definitions for clarity (no changes here) ---
interface NewsApiSource {
  id: string;
  name: string;
  region: string;
  tag: string;
}

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// --- Define News API sources (no changes here) ---
const NEWS_API_SOURCES: NewsApiSource[] = [
  {
    id: 'al-jazeera-english',
    name: 'Al Jazeera English',
    region: 'Middle East',
    tag: 'Conflicts',
  },
];

// --- Helper Functions (no changes here) ---
const generateSlug = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

const determineTag = (item: NewsApiArticle, defaultTag: string): string => {
  const content = (item.content || item.description || '').toLowerCase();
  const tagKeywords: Record<string, string[]> = {
    Diplomacy: ['diplomacy', 'negotiations', 'treaty', 'summit', 'ambassador'],
    Conflicts: ['conflict', 'war', 'battle', 'clash', 'militia', 'airstrike'],
    Economy: ['economy', 'trade', 'market', 'finance', 'investment', 'stocks'],
    Climate: [
      'climate',
      'environment',
      'sustainability',
      'emissions',
      'warming',
    ],
  };
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((keyword) => content.includes(keyword))) {
      return tag;
    }
  }
  return defaultTag;
};

const createArticleFromNews = (
  item: NewsApiArticle,
  source: NewsApiSource,
): Article => {
  const date = new Date(item.publishedAt || Date.now()).toISOString();
  const title = item.title || 'Untitled Article';
  const slug = generateSlug(title);
  const tag = determineTag(item, source.tag);
  const description = item.description
    ? item.description.slice(0, 200) + '...'
    : 'No description available';
  const contentText =
    item.content || item.description || 'Content not available.';
  const blocks: ContentBlock[] = [
    { type: 'heading', heading: title },
    { type: 'text', text: contentText },
    {
      type: 'quote',
      quote: description,
      spokesperson: item.author || 'News Source',
      role: source.name,
    },
  ];
  const coverImg = item.urlToImage || '/default-cover.jpg';
  const coverImgAlt = item.urlToImage
    ? `Image from ${source.name} article: ${title}`
    : 'Default news cover image';
  return {
    title,
    description,
    date,
    location: source.region,
    tag,
    region: source.region,
    coverImg,
    coverImgAlt,
    slug,
    headline: false,
    views: 0,
    blocks,
  };
};

// --- Main Fetching Function (REWRITTEN) ---
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
    // 1. Construct the API URL
    const pageSize = 5;
    const url = `https://newsapi.org/v2/top-headlines?sources=${source.id}&pageSize=${pageSize}`;

    try {
      // 2. Make a direct fetch request with the API key in the header
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': process.env.NEWS_API_KEY!,
        },
      });

      if (!response.ok) {
        // If the response status is not 200-299, throw an error
        const errorData = await response.json();
        throw new Error(
          `News API error: ${errorData.message || response.statusText}`,
        );
      }

      // 3. Parse the JSON data
      const data = await response.json();

      // 4. Process the articles (same logic as before)
      const newArticles: Article[] = [];
      for (const apiArticle of data.articles) {
        try {
          if (apiArticle.title === '[Removed]' || !apiArticle.description) {
            continue;
          }
          const article = createArticleFromNews(
            apiArticle as NewsApiArticle,
            source,
          );
          await addArticle(article);
          newArticles.push(article);
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
