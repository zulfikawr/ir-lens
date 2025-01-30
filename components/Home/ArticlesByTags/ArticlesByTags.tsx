'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleType } from '@/types/article';
import { Button } from '@/components/ui/button';
import { useArticleContext } from '@/hooks/useArticleContext';
import ArticlesByTagsLoading from './loading';
import { Calendar, MapPin } from 'lucide-react';

const ArticlesByTags = () => {
  const { data } = useArticleContext();
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const allowedTags = useMemo(
    () => ['Diplomacy', 'Conflicts', 'Economy', 'Climate'],
    [],
  );
  const [activeCards, setActiveCards] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data.length) {
      const sortedArticles = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      setArticles(sortedArticles);
    }
  }, [data]);

  useEffect(() => {
    const initialActiveCards = allowedTags.reduce(
      (acc, tag) => {
        acc[tag] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );
    setActiveCards(initialActiveCards);
  }, [allowedTags]);

  useEffect(() => {
    const intervals = allowedTags.map((tag) => {
      return setInterval(() => {
        setActiveCards((prev) => {
          const tagArticles = articles.filter((article) =>
            article.labels.includes(tag),
          );
          return {
            ...prev,
            [tag]: (prev[tag] + 1) % Math.min(tagArticles.length, 3),
          };
        });
      }, 5000);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [articles, allowedTags]);

  const renderArticleCard = (
    article: ArticleType['articles'][0],
    tag: string,
    index: number,
  ) => (
    <article
      key={article.slug}
      className={`absolute w-full transition-all duration-500 ease-in-out 
        bg-white shadow-xl border border-black overflow-hidden h-[250px]
        ${index === activeCards[tag] ? 'z-30 opacity-100 -translate-x-2 -translate-y-2' : ''}
        ${index === (activeCards[tag] + 1) % 3 ? 'translate-x-0 translate-y-0' : 'z-10'}
        ${index === (activeCards[tag] + 2) % 3 ? 'translate-x-2 translate-y-2' : 'z-20'}`}
    >
      <div className='grid grid-cols-3 h-full'>
        <div className='col-span-1 h-full'>
          <Link href={`/articles/${article.slug}`} className='block h-full'>
            <div className='relative w-full h-full transition-all duration-500 grayscale hover:grayscale-0'>
              <Image
                src={article.coverImage || '/images/default-fallback-image.png'}
                alt={article.coverImageAlt || 'Article cover image'}
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
            {Array.isArray(article.labels) && article.labels.length > 0 && (
              <div className='flex flex-wrap gap-1 md:gap-2'>
                {article.labels.map((label, idx) => (
                  <Link key={idx} href={`/tags/${label}`}>
                    <Button size='sm' className='text-xs'>
                      {label}
                    </Button>
                  </Link>
                ))}
              </div>
            )}

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
  );

  if (!articles.length) {
    return (
      <div>
        {' '}
        <ArticlesByTagsLoading />{' '}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
      {allowedTags.map((tag) => {
        const tagArticles = articles
          .filter((article) => article.labels.includes(tag))
          .slice(0, 3);

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
