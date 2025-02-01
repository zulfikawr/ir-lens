'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import { getArticleBySlug } from '@/functions/getArticleBySlug';
import ArticleEditor from '@/components/Articles/editor/ArticleEditor';
import type { ArticleType } from '@/types/article';

const EditArticlePage = () => {
  const [article, setArticle] = useState<ArticleType['articles'][0] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { title } = useParams();
  const articleSlug = Array.isArray(title) ? title[0] : title;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!articleSlug || hasFetched.current) return;

    const fetchArticle = async () => {
      try {
        const foundArticle = await getArticleBySlug(articleSlug);

        if (foundArticle) {
          setArticle(foundArticle);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchArticle();
  }, [articleSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  return <ArticleEditor article={article} isNewArticle={false} />;
};

export default withAdminAuth(EditArticlePage);
