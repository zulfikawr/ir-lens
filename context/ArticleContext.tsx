'use client';

import { useEffect, useState, useMemo } from 'react';
import { getArticles } from '@/lib/database';
import { Article } from '@/types/article';
import { ArticleContext } from '@/hooks/useArticleContext';
import menuData from '@/json/menu.json';

type ArticleContextProviderType = {
  children: React.ReactNode;
};

export default function ArticleContextProvider({
  children,
}: ArticleContextProviderType) {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const sortedArticles = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data]);

  const articlesByTag = useMemo(() => {
    const tags = menuData.tags.map((t) => t.title);
    return tags.reduce(
      (acc, tag) => {
        acc[tag] = sortedArticles.filter((article) => article.tag === tag);
        return acc;
      },
      {} as Record<string, Article[]>,
    );
  }, [sortedArticles]);

  const articlesByRegion = useMemo(() => {
    const regions = menuData.regions.map((r) => r.title);
    return regions.reduce(
      (acc, region) => {
        acc[region] = sortedArticles.filter(
          (article) => article.region === region,
        );
        return acc;
      },
      {} as Record<string, Article[]>,
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
        refreshArticles: fetchData,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}
