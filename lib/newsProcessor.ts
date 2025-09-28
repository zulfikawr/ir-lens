import NewsAPI from 'newsapi';
import { addArticle } from './database';
import { Article } from '@/types/article';
import { ContentBlock } from '@/types/contentBlocks';

// --- Type definitions for clarity ---
interface NewsApiSource {
  id: string; // The ID from NewsAPI.org, e.g., 'al-jazeera-english'
  name: string; // The display name
  region: string;
  tag: string; // A default tag for articles from this source
}

// Type for an article coming from the News API
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

// --- Initialize the NewsAPI client ---
// Note: We use process.env.NEWS_API_KEY (server-side variable)
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// --- Define News API sources ---
// For testing, we only have Al Jazeera. You can easily add more here later.
// To find source IDs, you can check the News API documentation or use their 'sources' endpoint.
const NEWS_API_SOURCES: NewsApiSource[] = [
  {
    id: 'al-jazeera-english',
    name: 'Al Jazeera English',
    region: 'Middle East',
    tag: 'Conflicts', // This will be the fallback tag
  },
  // Example of adding another source in the future:
  // {
  //   id: 'reuters',
  //   name: 'Reuters',
  //   region: 'Global',
  //   tag: 'Economy',
  // },
];

// --- Helper Functions (adapted for News API) ---

// Custom slug generation (no changes needed)
const generateSlug = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

// Determine article tag based on content (adapted for News API article structure)
const determineTag = (item: NewsApiArticle, defaultTag: string): string => {
  const content = (item.content || item.description || '').toLowerCase();

  const tagKeywords: Record<string, string[]> = {
    Diplomacy: ['diplomacy', 'negotiations', 'treaty', 'summit', 'ambassador'],
    Conflicts: ['conflict', 'war', 'battle', 'clash', 'militia', 'airstrike'],
    Economy: ['economy', 'trade', 'market', 'finance', 'investment', 'stocks'],
    Climate: ['climate', 'environment', 'sustainability', 'emissions', 'warming'],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((keyword) => content.includes(keyword))) {
      return tag;
    }
  }

  return defaultTag; // Fallback to source default
};

// Create an Article object from a News API item
const createArticleFromNews = (item: NewsApiArticle, source: NewsApiSource): Article => {
  const date = new Date(item.publishedAt || Date.now()).toISOString();
  const title = item.title || 'Untitled Article';
  const slug = generateSlug(title);
  const tag = determineTag(item, source.tag);

  const description = item.description
    ? item.description.slice(0, 200) + '...'
    : 'No description available';

  const contentText = item.content || item.description || 'Content not available.';

  // Construct content blocks from the available data
  const blocks: ContentBlock[] = [
    {
      type: 'heading',
      heading: title,
    },
    {
      type: 'text',
      text: contentText,
    },
    {
      type: 'quote',
      quote: description,
      spokesperson: item.author || 'News Source',
      role: source.name,
    },
  ];

  // Use the image from the API or a fallback
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

// --- Main Fetching and Processing Function ---
export async function fetchAndProcessNews(): Promise<
  Array<{ source: string; articlesAdded: number } | { source: string; error: string }>
> {
  const results: Array<
    { source: string; articlesAdded: number } | { source: string; error: string }
  > = [];

  for (const source of NEWS_API_SOURCES) {
    try {
      // Fetch top headlines from the current source
      const response = await newsapi.v2.topHeadlines({
        sources: source.id,
        pageSize: 5, // Fetch 5 latest articles, similar to your old logic
      });

      if (response.status !== 'ok') {
        throw new Error(`News API error for source ${source.name}`);
      }
      
      const newArticles: Article[] = [];
      for (const apiArticle of response.articles) {
        try {
          // Skip articles with removed content
          if (apiArticle.title === '[Removed]' || !apiArticle.description) {
            continue;
          }

          const article = createArticleFromNews(apiArticle as NewsApiArticle, source);
          await addArticle(article);
          newArticles.push(article);
        } catch (error) {
          console.error(`Error processing article "${apiArticle.title}":`, error);
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