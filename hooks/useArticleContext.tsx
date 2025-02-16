import { createContext, useContext } from 'react';
import type { Article } from '@/types/article';

type ArticleContextType = {
  data: Article[];
  sortedArticles: Article[];
  articlesByTag: Record<string, Article[]>;
  articlesByRegion: Record<string, Article[]>;
  loading: boolean;
  error: Error | null;
};

export const ArticleContext = createContext<ArticleContextType | null>(null);

export function useArticleContext() {
  const articleContext = useContext(ArticleContext);

  if (!articleContext) {
    throw new Error(
      'useArticleContext must be used within an ArticleContextProvider',
    );
  }

  return articleContext;
}
