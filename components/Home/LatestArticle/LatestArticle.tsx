'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleType } from '@/types/article';
import { Button } from '@/components/ui/button';
import { useArticleContext } from '@/hooks/useArticleContext';
import LatestArticleLoading from './loading';

const LatestArticle = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { data } = useArticleContext();
  const [articles, setArticles] = useState<ArticleType['articles']>([]);

  useEffect(() => {
    if (data.length) {
      const sortedArticles = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      setArticles(sortedArticles.slice(0, 3));
    }
  }, [data]);

  useEffect(() => {
    if (!isHovering && articles.length > 0) {
      const interval = setInterval(() => {
        setActiveCard(
          (prevActiveCard) => (prevActiveCard + 1) % articles.length,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, articles.length]);

  const handleCardHover = (index: number) => {
    setActiveCard(index);
    setIsHovering(true);
  };

  const handleCardLeave = () => {
    setIsHovering(false);
  };

  if (!articles.length) {
    return (
      <div>
        <LatestArticleLoading />
      </div>
    );
  }

  return (
    <div className='relative h-[600px] md:h-[560px] w-full pr-4 mx-auto mt-6 scale-95'>
      {articles.map((article, index) => (
        <article
          key={article.slug}
          className={`absolute w-full transition-all duration-500 ease-in-out 
            bg-white shadow-xl border border-black overflow-hidden h-[600px] md:h-[500px]
            ${index === activeCard ? 'z-30 opacity-100 -translate-x-4 -translate-y-4' : ''} 
            ${index === (activeCard + 1) % articles.length ? 'translate-x-0 translate-y-0' : 'z-10'} 
            ${index === (activeCard + 2) % articles.length ? 'translate-x-4 translate-y-4' : 'z-20'}`}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
          onMouseEnter={() => handleCardHover(index)}
          onMouseLeave={handleCardLeave}
        >
          <div className='grid grid-cols-1 lg:grid-cols-10 h-full'>
            <div className='col-span-5 h-[250px] lg:h-full'>
              <Link href={`/articles/${article.slug}`} className='block h-full'>
                <div className='relative w-full h-full transition-all duration-500 grayscale hover:grayscale-0 position-relative'>
                  <Image
                    src={
                      article.coverImage || '/images/default-fallback-image.png'
                    }
                    alt={article.coverImageAlt || 'Article cover image'}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    fill
                    className='object-cover'
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className='col-span-5 h-[350px] lg:h-full flex flex-col px-4 py-4 lg:p-6'>
              <div className='h-full flex flex-col justify-between'>
                <div>
                  {Array.isArray(article.labels) &&
                    article.labels.length > 0 && (
                      <div className='flex flex-wrap gap-2 mb-2 md:mb-4'>
                        {article.labels.map((label, idx) => (
                          <Link key={idx} href={`/tags/${label}`}>
                            <Button size='sm' className='text-xs md:text-sm'>
                              {label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}

                  <Link href={`/articles/${article.slug}`}>
                    <h2 className='text-2xl lg:text-4xl font-bold leading-tight text-black hover:underline mb-2 md:mb-4'>
                      {article.title}
                    </h2>
                  </Link>

                  <p className='text-sm md:text-base text-gray-600 leading-relaxed line-clamp-4'>
                    {article.description}
                  </p>
                </div>

                <div className='mt-auto'>
                  <div className='flex flex-wrap items-center gap-2 text-gray-500 text-sm mb-4'>
                    <time dateTime={article.date} className='italic'>
                      {article.date}
                    </time>
                    <span>|</span>
                    <p>{article.location}</p>
                  </div>

                  <Link href={`/articles/${article.slug}`}>
                    <Button className='w-full md:w-auto'>Read More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default LatestArticle;
