import {
  ref,
  get,
  set,
  update,
  remove,
  runTransaction,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { Article } from '@/types/article';

const getDateParts = (dateString: string) => {
  // Handle both ISO format (2025-12-01T...) and formatted string (1 December 2025)
  let date: Date;

  // Try parsing as ISO date first
  date = new Date(dateString);

  // If that didn't work or resulted in invalid date, try parsing formatted string
  if (isNaN(date.getTime())) {
    // Try parsing "1 December 2025" format
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      throw new Error(`Invalid date format: ${dateString}`);
    }
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  console.log(`Parsed date: "${dateString}" -> ${year}/${month}/${day}`);
  return { year, month, day };
};

export async function incrementArticleViews(
  slug: string,
  date: string,
): Promise<void> {
  const { year, month, day } = getDateParts(date);
  const articleRef = ref(database, `articles/${year}/${month}/${day}/${slug}`);

  try {
    await runTransaction(articleRef, (currentData) => {
      if (currentData) {
        currentData.views = (currentData.views || 0) + 1;
      } else {
        currentData = { views: 1 };
      }
      return currentData;
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
}

export async function getArticles(): Promise<Article[]> {
  const articlesRef = ref(database, 'articles');
  try {
    const snapshot = await get(articlesRef);
    if (!snapshot.exists()) return [];

    const articles: Article[] = [];
    const data = snapshot.val();

    Object.keys(data).forEach((year) => {
      Object.keys(data[year]).forEach((month) => {
        Object.keys(data[year][month]).forEach((day) => {
          Object.keys(data[year][month][day]).forEach((slug) => {
            const article = data[year][month][day][slug];
            articles.push({
              slug,
              ...article,
              views: article.views || 0,
            });
          });
        });
      });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticlesByMonth(
  year: string,
  month: string,
): Promise<Article[]> {
  const monthRef = ref(database, `articles/${year}/${month}`);
  try {
    const snapshot = await get(monthRef);
    if (!snapshot.exists()) return [];

    const articles: Article[] = [];
    const data = snapshot.val();

    Object.keys(data).forEach((day) => {
      Object.keys(data[day]).forEach((slug) => {
        const article = data[day][slug];
        articles.push({
          slug,
          ...article,
        });
      });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles by month:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return (
    articles.find((article) => article.slug === decodeURIComponent(slug)) ||
    null
  );
}

export async function addArticle(article: Article): Promise<void> {
  const { year, month, day } = getDateParts(article.date);
  const articleRef = ref(
    database,
    `articles/${year}/${month}/${day}/${article.slug}`,
  );

  // Normalize date to ISO format for consistency
  const normalizedArticle = {
    ...article,
    slug: article.slug,
    views: 0,
    date: new Date(article.date).toISOString(), // Store as ISO format
  };

  try {
    await set(articleRef, normalizedArticle);
    console.log('Article added:', article.slug);
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

export async function updateArticle(
  slug: string,
  articleData: Partial<Article>,
): Promise<void> {
  const { year, month, day } = getDateParts(
    articleData.date || new Date().toISOString(),
  );
  const articleRef = ref(database, `articles/${year}/${month}/${day}/${slug}`);

  try {
    await update(articleRef, articleData);
    console.log('Article updated:', slug);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

export async function deleteArticle(date: string, slug: string): Promise<void> {
  // First, try to find the article by searching through all articles
  const articlesRef = ref(database, 'articles');

  try {
    console.log(`Searching for article to delete: ${slug}`);

    const snapshot = await get(articlesRef);
    if (!snapshot.exists()) {
      throw new Error('No articles found in database');
    }

    const data = snapshot.val();
    let foundPath: string | null = null;

    // Search through all years/months/days to find the article
    for (const year in data) {
      for (const month in data[year]) {
        for (const day in data[year][month]) {
          for (const articleSlug in data[year][month][day]) {
            if (articleSlug === slug) {
              foundPath = `articles/${year}/${month}/${day}/${slug}`;
              console.log(`Found article at path: ${foundPath}`);
              break;
            }
          }
          if (foundPath) break;
        }
        if (foundPath) break;
      }
      if (foundPath) break;
    }

    if (!foundPath) {
      console.warn(`Article not found: ${slug}`);
      throw new Error(`Article not found: ${slug}`);
    }

    // Delete from the found path
    const articleRef = ref(database, foundPath);
    await remove(articleRef);
    console.log('Article deleted successfully:', slug);
  } catch (error) {
    console.error('Error deleting article:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

export async function saveDraftArticle(article: Article): Promise<void> {
  const draftRef = ref(database, `drafts/${article.slug}`);
  try {
    await set(draftRef, article);
    console.log('Draft article saved:', article.slug);
  } catch (error) {
    console.error('Error saving draft article:', error);
    throw error;
  }
}

export async function loadDraftArticle(slug: string): Promise<Article | null> {
  const draftRef = ref(database, `drafts/${slug}`);
  try {
    const snapshot = await get(draftRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error loading draft article:', error);
    throw error;
  }
}

export async function deleteDraftArticle(slug: string): Promise<void> {
  const draftRef = ref(database, `drafts/${slug}`);
  try {
    await remove(draftRef);
    console.log('Draft article deleted:', slug);
  } catch (error) {
    console.error('Error deleting draft article:', error);
    throw error;
  }
}
