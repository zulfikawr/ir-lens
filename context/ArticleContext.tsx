'use client';

import { useEffect, useState, useMemo } from 'react';
import { getArticles } from '@/lib/database';
import { ArticleType } from '@/types/article';
import { ArticleContext } from '@/hooks/useArticleContext';

type ArticleContextProviderType = {
  children: React.ReactNode;
};

export default function ArticleContextProvider({
  children,
}: ArticleContextProviderType) {
  const [data, setData] = useState<ArticleType['articles']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getArticles();
        setData(responseData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedArticles = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data]);

  const articlesByTag = useMemo(() => {
    const tags = ['Diplomacy', 'Conflicts', 'Economy', 'Climate'];
    return tags.reduce(
      (acc, tag) => {
        acc[tag] = sortedArticles.filter((article) => article.tag === tag);
        return acc;
      },
      {} as Record<string, ArticleType['articles']>,
    );
  }, [sortedArticles]);

  const articlesByRegion = useMemo(() => {
    const regions = [
      'Global',
      'Asia',
      'Europe',
      'Middle East',
      'Africa',
      'Americas',
    ];
    return regions.reduce(
      (acc, region) => {
        acc[region] = sortedArticles.filter(
          (article) => article.region === region,
        );
        return acc;
      },
      {} as Record<string, ArticleType['articles']>,
    );
  }, [sortedArticles]);

  return (
    <ArticleContext.Provider
      value={{
        data,
        sortedArticles,
        articlesByTag,
        articlesByRegion,
        loading,
        error,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}
