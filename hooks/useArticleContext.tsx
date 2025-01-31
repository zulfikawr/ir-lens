import { createContext, useContext } from 'react';
import type { ArticleType } from '@/types/article';

type ArticleContextType = {
  data: ArticleType['articles'];
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
