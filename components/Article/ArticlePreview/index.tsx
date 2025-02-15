'use client';

import { useEffect, useRef, useState } from 'react';
import type { Article } from '@/types/article';
import { ArticlePreview } from '@/components/Article/ArticlePreview/ArticlePreview';
import ArticlePreviewLoading from './ArticlePreviewLoading';
import { notFound } from 'next/navigation';

export default function ArticlePreviewPage() {
  const [article] = useState<Article | null>(null);
  const [localArticle, setLocalArticle] = useState(article);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          !localArticle &&
          typeof window !== 'undefined' &&
          window.articleData
        ) {
          setLocalArticle(window.articleData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchData();
  }, [localArticle]);

  if (loading) {
    return <ArticlePreviewLoading />;
  }

  if (!localArticle) {
    return notFound();
  }

  return <ArticlePreview article={localArticle} />;
}
