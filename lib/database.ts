import { ref, get, set, update, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ArticleType } from '@/types/article';

const getDateParts = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return { year, month, day };
};

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
