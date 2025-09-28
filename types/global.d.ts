import type { Article } from '@/types/article';

declare global {
  interface Window {
    articleData?: Article;
  }
}

declare module 'newsapi';
