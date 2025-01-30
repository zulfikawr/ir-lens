import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ArticleType } from '@/types/article';

export async function getArticles(): Promise<ArticleType['articles']> {
  const articlesRef = ref(database, 'articles');
  try {
    const snapshot = await get(articlesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        slug: key,
        ...data[key],
      }));
    } else {
      console.error('No data available.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}
