'use client';

import { useEffect, useState, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/database';
import { Article } from '@/types/article';
import { ArticleLayout } from './ArticleLayout';
import ArticleLoading from './ArticleLoading';

interface ArticleDataState {
  current: Article | null;
  related: Article[];
}

export default function ArticleView() {
  const [articleData, setArticleData] = useState<ArticleDataState>({
    current: null,
    related: [],
  });
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!articleSlug || hasFetched.current) return;

    const fetchArticleData = async () => {
      try {
        const [currentArticle, allArticlesData] = await Promise.all([
          getArticleBySlug(articleSlug),
          getArticles(),
        ]);

        setArticleData({
          current: currentArticle || null,
          related: allArticlesData,
        });
      } catch (error) {
        console.error('Error fetching article data:', error);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchArticleData();
  }, [articleSlug]);

  if (loading) return <ArticleLoading />;
  if (!articleData.current) return notFound();

  return (
    <ArticleLayout
      articleData={{
        current: articleData.current,
        related: articleData.related,
      }}
    />
  );
}
