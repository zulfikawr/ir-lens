'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useArticleContext } from '@/hooks/useArticleContext';
import LatestArticleLoading from './loading';
import { Calendar, MapPin } from 'lucide-react';
import { getArticleUrl } from '@/utils/articleLinks';

const LatestArticle = () => {
  const { data, loading, error } = useArticleContext();
  const [activeCard, setActiveCard] = useState(0);

  const sortedArticles = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [data]);

  useEffect(() => {
    if (sortedArticles.length > 0) {
      const interval = setInterval(() => {
        setActiveCard(
          (prevActiveCard) => (prevActiveCard + 1) % sortedArticles.length,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sortedArticles.length]);

  if (loading) return <LatestArticleLoading />;
  if (error) return <div>Error loading articles: {error.message}</div>;

  return (
    <div className='relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[calc(100vh-6rem)] max-h-[900px] max-w-7xl mx-auto pr-4 mt-6 scale-95 mb-12 md:mb-0'>
      {sortedArticles.map((article, index) => (
        <article
          key={article.slug}
          className={`absolute w-full h-full transition-all duration-500 ease-in-out 
            bg-white shadow-xl border border-black overflow-hidden
            ${index === activeCard ? 'z-30 opacity-100 -translate-x-2 -translate-y-2 md:-translate-x-4 md:-translate-y-4' : ''} 
            ${index === (activeCard + 1) % sortedArticles.length ? 'translate-x-0 translate-y-0' : 'z-10'} 
            ${index === (activeCard + 2) % sortedArticles.length ? 'translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4' : 'z-20'}`}
        >
          <div className='flex flex-col md:flex-row h-full'>
            <div className='relative w-full h-2/5 md:h-full md:w-1/2'>
              <Link href={getArticleUrl(article)} className='block h-full'>
                <div className='absolute inset-0 transition-all duration-500 grayscale hover:grayscale-0'>
                  <Image
                    src={
                      article.coverImg || '/images/default-fallback-image.png'
                    }
                    alt={article.coverImgAlt || 'Article cover image'}
                    sizes='90vw'
                    fill
                    className='object-cover'
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className='flex flex-col p-4 md:w-1/2 h-3/5 md:h-full overflow-y-auto'>
              <div className='flex flex-col h-full'>
                <div className='flex flex-wrap gap-2 mb-2 md:mb-4'>
                  <Link href={`/tags/${article.tag}`}>
                    <Button size='sm' className='text-xs md:text-sm'>
                      {article.tag}
                    </Button>
                  </Link>

                  <Link href={`/tags/${article.region}`}>
                    <Button
                      size='sm'
                      variant='secondary'
                      className='text-xs md:text-sm'
                    >
                      {article.region}
                    </Button>
                  </Link>
                </div>

                <Link href={getArticleUrl(article)}>
                  <h2 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-black hover:underline mb-2 md:mb-4'>
                    {article.title}
                  </h2>
                </Link>

                <p className='text-sm md:text-lg text-gray-600 leading-relaxed mb-4 flex-grow overflow-y-auto'>
                  {article.description}
                </p>

                <div className='mt-auto'>
                  <div className='flex flex-wrap items-center justify-between md:justify-start md:gap-6 text-gray-500 text-xs md:text-sm mb-4'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      <p>{article.location}</p>
                    </div>
                  </div>

                  <Link href={getArticleUrl(article)} className='block w-full'>
                    <Button className='w-full text-md'>Read More</Button>
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
