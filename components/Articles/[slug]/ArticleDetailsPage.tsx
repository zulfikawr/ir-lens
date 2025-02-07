'use client';

import { useEffect, useState, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/database';
import { ArticleContent } from '@/components/Articles/[slug]/ArticleContent';
import { ArticleSidebar } from '@/components/Articles/[slug]/ArticleSidebar';
import ArticleLoading from '@/components/Articles/[slug]/ArticleLoading';
import type { ArticleType } from '@/types/article';

const ArticleDetailsPage = () => {
  const [article, setArticle] = useState<ArticleType['articles'][0] | null>(null);
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!articleSlug || hasFetched.current) return;

    const fetchData = async () => {
      try {
        const foundArticle = await getArticleBySlug(articleSlug);
        const allArticles = await getArticles();

        if (foundArticle) {
          setArticle(foundArticle);
        }
        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchData();
  }, [articleSlug]);

  if (loading) {
    return <ArticleLoading />;
  }

  if (!article) {
    return notFound();
  }

  return (
    <main className='mx-auto px-4 md:px-8 py-16'>
      <div className='flex flex-col items-center lg:items-start lg:flex-row lg:justify-center'>
        <div className='w-full max-w-3xl lg:w-3/4 lg:pr-6 md:border-r md:border-black'>
          <ArticleContent article={article} />
        </div>
        <aside className='mt-16 md:mt-0 md:w-1/4 md:max-w-[300px] md:pl-6'
        >
          <ArticleSidebar articles={articles} currentArticle={article} />
        </aside>
      </div>
    </main>
  );
};

export default ArticleDetailsPage;