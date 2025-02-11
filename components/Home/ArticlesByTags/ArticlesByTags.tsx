'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { ArticleType } from '@/types/article';
import useRotatingIndex from '@/hooks/useRotatingIndex';
import ArticleCard from '../ArticleCard';

const ArticlesByTags = () => {
  const { articlesByTag } = useArticleContext();
  const tags = useMemo(
    () => ['Diplomacy', 'Conflicts', 'Economy', 'Climate'],
    [],
  );

  const activeCards = useRotatingIndex(tags, 5000);

  const renderArticleCard = useCallback(
    (article: ArticleType['articles'][0], tag: string, index: number) => (
      <ArticleCard
        key={article.slug}
        article={article}
        cardIndex={index}
        activeIndex={activeCards[tag]}
      />
    ),
    [activeCards],
  );

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
      {tags.map((tag) => {
        const tagArticles = articlesByTag[tag]?.slice(0, 3) || [];

        return (
          <div key={tag} className='space-y-4'>
            <div className='flex items-center'>
              <Link href={`/tags/${tag}`}>
                <h2 className='text-2xl font-bold tracking-tight pb-3 relative'>
                  <span className='bg-black text-white px-3 py-1 border hover:bg-white hover:text-black hover:border-black transition duration-300'>
                    {tag}
                  </span>
                </h2>
              </Link>
            </div>
            <div className='relative h-[250px] w-full mx-auto scale-95'>
              {tagArticles.map((article, index) =>
                renderArticleCard(article, tag, index),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticlesByTags;
