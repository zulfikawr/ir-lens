import type { ArticleType } from '@/types/article';

declare global {
  interface Window {
    articleData?: ArticleType['articles'][0];
  }
}
