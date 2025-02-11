import {
  ref,
  get,
  set,
  update,
  remove,
  runTransaction,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { ArticleType } from '@/types/article';

const getDateParts = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
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

export async function getArticles(): Promise<ArticleType['articles']> {
  const articlesRef = ref(database, 'articles');
  try {
    const snapshot = await get(articlesRef);
    if (!snapshot.exists()) return [];

    const articles: ArticleType['articles'] = [];
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
): Promise<ArticleType['articles']> {
  const monthRef = ref(database, `articles/${year}/${month}`);
  try {
    const snapshot = await get(monthRef);
    if (!snapshot.exists()) return [];

    const articles: ArticleType['articles'] = [];
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

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleType['articles'][0] | null> {
  const articles = await getArticles();
  return (
    articles.find((article) => article.slug === decodeURIComponent(slug)) ||
    null
  );
}

export async function addArticle(article: Record<string, any>): Promise<void> {
  const { year, month, day } = getDateParts(article.date);
  const articleRef = ref(
    database,
    `articles/${year}/${month}/${day}/${article.slug}`,
  );

  try {
    await set(articleRef, {
      ...article,
      slug: article.slug,
      views: 0,
    });
    console.log('Article added:', article.slug);
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

export async function updateArticle(
  slug: string,
  articleData: Record<string, any>,
): Promise<void> {
  const { year, month, day } = getDateParts(articleData.date);
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
  const { year, month, day } = getDateParts(date);
  const articleRef = ref(database, `articles/${year}/${month}/${day}/${slug}`);

  try {
    await remove(articleRef);
    console.log('Article deleted:', slug);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

export async function saveDraftArticle(article: ArticleType['articles'][0]): Promise<void> {
  const draftRef = ref(database, `drafts/${article.slug}`);
  try {
    await set(draftRef, article);
    console.log('Draft article saved:', article.slug);
  } catch (error) {
    console.error('Error saving draft article:', error);
    throw error;
  }
}

export async function loadDraftArticle(slug: string): Promise<ArticleType['articles'][0] | null> {
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
