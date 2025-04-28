import Parser from 'rss-parser';
import { addArticle } from './database';
import { Article } from '@/types/article';
import { ContentBlock } from '@/types/contentBlocks';

interface NewsSource {
  name: string;
  url: string;
  region: string;
  tag: string;
}

interface RSSItem {
  title?: string;
  content?: string;
  contentSnippet?: string;
  description?: string;
  pubDate?: string;
  enclosure?: { url: string };
  categories?: string[];
}

const parser = new Parser();

// Define RSS feed sources
const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'Al Jazeera Middle East',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    region: 'Middle East',
    tag: 'Conflicts',
  },
  {
    name: 'Middle East Eye',
    url: 'https://www.middleeasteye.net/rss',
    region: 'Middle East',
    tag: 'Diplomacy',
  },
];

// Custom slug generation
const generateSlug = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

// Function to determine article tag based on content
const determineTag = (item: RSSItem, defaultTag: string): string => {
  const content = (item.content || item.description || '').toLowerCase();
  const categories = (item.categories || []).map((cat) => cat.toLowerCase());

  // Keywords for each tag
  const tagKeywords: Record<string, string[]> = {
    Diplomacy: ['diplomacy', 'negotiations', 'treaty', 'summit', 'ambassador'],
    Conflicts: ['conflict', 'war', 'battle', 'clash', 'militia'],
    Economy: ['economy', 'trade', 'market', 'finance', 'investment'],
    Climate: [
      'climate',
      'environment',
      'sustainability',
      'emissions',
      'warming',
    ],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (
      keywords.some((keyword) => content.includes(keyword)) ||
      keywords.some((keyword) => categories.includes(keyword))
    ) {
      return tag;
    }
  }

  return defaultTag; // Fallback to source default
};

// Function to create article from news item
const createArticleFromNews = (item: RSSItem, source: NewsSource): Article => {
  const date = new Date(item.pubDate || Date.now()).toISOString();
  const title = item.title || 'Untitled Article';
  const slug = generateSlug(title);
  const tag = determineTag(item, source.tag);

  const description = item.contentSnippet
    ? item.contentSnippet.slice(0, 200) + '...'
    : item.description || 'No description available';

  const blocks: ContentBlock[] = [
    {
      type: 'heading',
      heading: title,
    },
    {
      type: 'text',
      text: item.content || item.description || 'Content not available.',
    },
    {
      type: 'quote',
      quote: item.contentSnippet
        ? item.contentSnippet.slice(0, 100) + '...'
        : 'No quote available.',
      spokesperson: 'News Source',
      role: source.name,
    },
  ];

  let coverImg = '';
  let coverImgAlt = '';
  if (item.enclosure?.url) {
    coverImg = item.enclosure.url;
    coverImgAlt = `Image from ${source.name} article: ${title}`;
  } else {
    coverImg = '/default-cover.jpg';
    coverImgAlt = 'Default news cover image';
  }

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

// Function to fetch and process news
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

  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const newArticles: Article[] = [];

      for (const item of feed.items.slice(0, 5)) {
        try {
          const article = createArticleFromNews(item as RSSItem, source);
          await addArticle(article);
          newArticles.push(article);
        } catch (error) {
          console.error(`Error processing article from ${source.name}:`, error);
        }
      }

      results.push({
        source: source.name,
        articlesAdded: newArticles.length,
      });
    } catch (error) {
      console.error(`Error fetching feed from ${source.name}:`, error);
      results.push({
        source: source.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
