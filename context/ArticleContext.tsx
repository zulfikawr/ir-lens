'use client';

import { useEffect, useState } from 'react';
import { getArticles } from '@/app/functions/getArticles';
import { ArticleType } from '@/types/article';
import { ArticleContext } from '@/hooks/useArticleContext';

type ArticleContextProviderType = {
  children: React.ReactNode;
};

export default function ArticleContextProvider({
  children,
}: ArticleContextProviderType) {
  const [data, setData] = useState<ArticleType>({ articles: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getArticles();
        setData({ articles: responseData });
      } catch (err) {
        console.log('Error fetching data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <ArticleContext.Provider value={{ data: data.articles }}>
      {children}
    </ArticleContext.Provider>
  );
}
