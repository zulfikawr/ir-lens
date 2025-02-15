'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { Article } from '@/types/article';
import useRotatingIndex from '@/hooks/useRotatingIndex';
import ArticleCard from '../ArticleCard';

const RegionalFocus = () => {
  const { articlesByRegion } = useArticleContext();
  const regions = useMemo(
    () => ['Global', 'Asia', 'Europe', 'Middle East', 'Africa', 'Americas'],
    [],
  );

  const activeCards = useRotatingIndex(regions, 5000);

  const renderArticleCard = useCallback(
    (article: Article, region: string, index: number) => (
      <ArticleCard
        key={article.slug}
        article={article}
        cardIndex={index}
        activeIndex={activeCards[region]}
      />
    ),
    [activeCards],
  );

  return (
    <section className='my-8 sm:my-12 md:my-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12'>
        {regions.map((region) => {
          const regionArticles = articlesByRegion[region]?.slice(0, 3) || [];

          return (
            <div key={region} className='space-y-4'>
              <div className='flex items-center'>
                <Link href={`/regions/${region.toLowerCase()}`}>
                  <h2 className='text-2xl font-bold tracking-tight pb-3 relative'>
                    <span className='bg-black text-white px-3 py-1 border hover:bg-white hover:text-black hover:border-black transition duration-300'>
                      {region}
                    </span>
                  </h2>
                </Link>
              </div>
              <div className='relative h-[250px] w-full mx-auto scale-95'>
                {regionArticles.map((article, index) =>
                  renderArticleCard(article, region, index),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RegionalFocus;
