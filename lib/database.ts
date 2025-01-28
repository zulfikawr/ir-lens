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
    console.log('Article added with ID:', newArticleRef.key);
    return newArticleRef.key!;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

/**
 * Update an existing article in the Firebase Realtime Database.
 * @param id
 * @param article
 */
export async function updateArticle(
  id: string,
  article: Record<string, any>,
): Promise<void> {
  const articleRef = ref(database, `articles/${id}`);
  try {
    await update(articleRef, article);
    console.log('Article updated with ID:', id);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete an article from the Firebase Realtime Database.
 * @param id - The ID of the article to delete
 */
export async function deleteArticle(id: string): Promise<void> {
  const articleRef = ref(database, `articles/${id}`);
  try {
    await remove(articleRef);
    console.log('Article deleted with ID:', id);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}
