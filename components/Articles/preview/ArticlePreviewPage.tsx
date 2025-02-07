'use client';

import { useEffect, useRef, useState } from 'react';
import { ArticlePreview } from '@/components/Articles/preview/ArticlePreview';
import type { ArticleType } from '@/types/article';
import { notFound } from 'next/navigation';
import ArticlePreviewLoading from './ArticlePreviewLoading';

export default function ArticlePreviewPage() {
  const [article] = useState<ArticleType['articles'][0] | null>(null);
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
