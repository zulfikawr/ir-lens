'use client';

import { useEffect, useState } from 'react';
import { getArticles } from '@/functions/getArticles';
import { ArticleType } from '@/types/article';
import { ArticleContext } from '@/hooks/useArticleContext';

type ArticleContextProviderType = {
  children: React.ReactNode;
};

export default function ArticleContextProvider({
  children,
}: ArticleContextProviderType) {
  const [data, setData] = useState<ArticleType>({ articles: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getArticles();
        setData({ articles: responseData });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ArticleContext.Provider value={{ data: data.articles, loading, error }}>
      {children}
    </ArticleContext.Provider>
  );
}
