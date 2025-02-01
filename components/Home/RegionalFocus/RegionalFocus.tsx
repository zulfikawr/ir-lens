'use client';

import { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { ArticleType } from '@/types/article';
import RegionalFocusLoading from './loading';
import useRotatingIndex from '@/hooks/useRotatingIndex';

const RegionalFocus = () => {
  const { data, loading, error } = useArticleContext();
  const regions = useMemo(
    () => ['Asia', 'Europe', 'Middle East', 'Africa', 'Americas'],
    [],
  );

  const sortedArticles = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data]);

  const getRegionArticles = useCallback(
    (region: string) => {
      return sortedArticles
        .filter((article) => article.region === region)
        .slice(0, 3);
    },
    [sortedArticles],
  );

  const activeCards = useRotatingIndex(regions, 5000);

  const renderArticleCard = useCallback(
    (article: ArticleType['articles'][0], region: string, index: number) => (
      <article
        key={article.slug}
        className={`absolute w-full transition-all duration-500 ease-in-out 
        bg-white shadow-md hover:shadow-lg border border-black overflow-hidden h-[250px]
        ${index === activeCards[region] ? 'z-30 opacity-100 -translate-x-2 -translate-y-2' : ''}
        ${index === (activeCards[region] + 1) % 3 ? 'translate-x-0 translate-y-0' : 'z-10'}
        ${index === (activeCards[region] + 2) % 3 ? 'translate-x-2 translate-y-2' : 'z-20'}`}
      >
        <div className='grid grid-cols-3 h-full'>
          <div className='col-span-1 h-full'>
            <Link href={`/articles/${article.slug}`} className='block h-full'>
              <div className='relative w-full h-full transition-all duration-500 grayscale hover:grayscale-0'>
                <Image
                  src={article.coverImg || '/images/default-fallback-image.png'}
                  alt={article.coverImgAlt || 'Article cover image'}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            </Link>
          </div>

          <div className='col-span-2 flex flex-col h-full p-4'>
            <div className='flex flex-col h-full space-y-2'>
              <div className='flex flex-wrap gap-1 md:gap-2'>
                <Link href={`/tags/${article.tag}`}>
                  <Button size='sm' className='text-xs'>
                    {article.tag}
                  </Button>
                </Link>
              </div>

              <Link href={`/articles/${article.slug}`}>
                <h3 className='text-xl font-bold leading-tight text-black hover:underline transition-all line-clamp-2'>
                  {article.title}
                </h3>
              </Link>

              <p className='text-sm text-gray-600 leading-snug line-clamp-3'>
                {article.description}
              </p>
            </div>

            <div className='mt-auto'>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  <time dateTime={article.date}>{article.date}</time>
                </div>
                <div className='flex items-center gap-1'>
                  <MapPin className='w-3 h-3' />
                  <span>{article.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    ),
    [activeCards],
  );

  if (loading) return <RegionalFocusLoading />;
  if (error) return <div>Error loading articles: {error.message}</div>;

  return (
    <section className='my-8 sm:my-12 md:my-16'>
      <div className='py-8 w-fit'>
        <h2 className='text-3xl font-bold bg-black px-4 py-2 text-white'>
          Regional Focus
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
        {regions.map((region) => {
          const regionArticles = getRegionArticles(region);

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
