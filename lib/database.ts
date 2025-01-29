import { ref, push, update, remove } from 'firebase/database';
import { database } from '@/lib/firebase';

/**
 * Add a new article to the Firebase Realtime Database.
 * @param article
 * @returns
 */
export async function addArticle(
  article: Record<string, any>,
): Promise<string> {
  const articlesRef = ref(database, 'articles');
  try {
    const newArticleRef = await push(articlesRef, article);
    console.log('Article added with slug:', newArticleRef.key);
    return newArticleRef.key!;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

/**
 * Update an existing article in the Firebase Realtime Database.
 * @param slug
 * @param article
 */
export async function updateArticle(
  slug: string,
  article: Record<string, any>,
): Promise<void> {
  const articleRef = ref(database, `articles/${slug}`);
  try {
    await update(articleRef, article);
    console.log('Article updated:', slug);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete an article from the Firebase Realtime Database.
 * @param slug
 */
export async function deleteArticle(slug: string): Promise<void> {
  const articleRef = ref(database, `articles/${slug}`);
  try {
    await remove(articleRef);
    console.log('Article deleted:', slug);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}
