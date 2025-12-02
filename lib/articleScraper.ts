import * as cheerio from 'cheerio';

interface ScrapedArticle {
  title: string;
  content: string;
  text: string;
}

/**
 * Scrape full article content from a URL using Cheerio
 */
export async function scrapeArticleContent(
  url: string,
): Promise<ScrapedArticle | null> {
  try {
    // Fetch the article page with proper headers
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    let title =
      $('meta[property="og:title"]').attr('content') || $('title').text() || '';

    // Extract main article content - try multiple common selectors
    let content = '';

    // Common article content selectors (prioritized by likelihood)
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0 && element.text().trim().length > 100) {
        content = element.text().trim();
        break;
      }
    }

    // If no content found, try to extract paragraphs
    if (!content || content.length < 100) {
      const paragraphs: string[] = [];
      $('p').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    // Clean up the content
    content = content
      .replace(/\[.*?\]/g, '') // Remove brackets content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Ensure we have meaningful content
    if (!content || content.length < 50) {
      console.warn(
        `Warning: Minimal content scraped from ${url}. Content length: ${content.length}`,
      );
    }

    return {
      title: title.substring(0, 200),
      content: content.substring(0, 5000), // Limit to reasonable size
      text: content,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

/**
 * Scrape multiple article URLs in parallel with rate limiting
 */
export async function scrapeMultipleArticles(
  urls: string[],
): Promise<Map<string, ScrapedArticle | null>> {
  const results = new Map<string, ScrapedArticle | null>();

  // Scrape up to 2 articles in parallel with delays to avoid rate limiting
  const batchSize = 2;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
      const scraped = await scrapeArticleContent(url);
      results.set(url, scraped);
    });

    await Promise.all(promises);
  }

  return results;
}
