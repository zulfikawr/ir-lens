'use client';

import type { ArticleType } from '@/types/article'
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTop from '@/components/ScrollToTop';
import { ContentBlocks } from '../editor/ContentBlocks';

export function ArticlePreview({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <div className='mb-16 max-w-4xl mx-auto px-4'>
      <div className='mb-8 relative w-full max-w-4xl mx-auto'>
        <div className='relative w-full aspect-[16/9] shadow-md mb-8'>
          <Image
            src={article.coverImg}
            alt={article.coverImgAlt}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover shadow-none border border-black'
            fill
            priority
          />
        </div>
      </div>

      <div className='flex flex-wrap gap-2 md:gap-4 mb-6'>
        <Button>{article.tag}</Button>
        <Button>{article.region}</Button>
      </div>
      <div className='space-y-6'>
        <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
          {article.title}
        </h1>
        <p className='text-md md:text-lg text-gray-600 leading-relaxed'>
          {article.description}
        </p>
      </div>

      <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mt-6 pb-6 border-b border-gray-200'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-5 h-5' />
            <time dateTime={article.date}>{article.date}</time>
          </div>
          {article.location && (
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin className='w-5 h-5' />
              <span>{article.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className='prose prose-lg mt-8'>
        <ContentBlocks blocks={article.blocks} />
      </div>

      <ScrollToTop />
    </div>
  );
}
