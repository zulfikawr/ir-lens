import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { ArticleType } from '@/types/article';

interface ArticleCardProps {
  article: ArticleType['articles'][0];
  cardIndex: number;
  activeIndex: number;
  isStatic?: boolean;
}

const ArticleCard = ({
  article,
  cardIndex,
  activeIndex,
  isStatic = false,
}: ArticleCardProps) => {
  const getPositionClasses = (index: number, active: number) => {
    if (isStatic) return '';

    if (index === active) {
      return 'z-30 opacity-100 -translate-x-4 -translate-y-2';
    }
    if (index === (active + 1) % 3) {
      return '-translate-x-2 translate-y-0 z-20';
    }
    return 'translate-y-2 z-10';
  };

  return (
    <article
      className={`${isStatic ? 'relative' : 'absolute mx-2'} w-full transition-all duration-500 ease-in-out 
      bg-white shadow-md hover:shadow-lg border border-black overflow-hidden h-[250px]
      ${getPositionClasses(cardIndex, activeIndex)}`}
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

        <div className='col-span-2 flex flex-col h-full p-3'>
          <div className='flex flex-col h-full space-y-2'>
            <div className='flex flex-wrap gap-1 md:gap-2'>
              <Link href={`/tags/${article.tag}`}>
                <Button size='sm' className='text-xs'>
                  {article.tag}
                </Button>
              </Link>
              <Link href={`/regions/${article.region}`}>
                <Button size='sm' variant='secondary' className='text-xs'>
                  {article.region}
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
            <div className='flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2'>
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
};

export default ArticleCard;
