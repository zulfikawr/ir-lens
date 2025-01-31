'use client';

import type { ArticleType } from '@/types/article';
import { ArticleContent } from '@/components/Articles/[title]/ArticleContent';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTop from '@/components/ScrollToTop';

export function ArticlePreview({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <div className='mb-16 max-w-4xl mx-auto px-4'>
      <div className='flex flex-wrap gap-2 md:gap-4 mb-6'>
        <Button>{article.tag}</Button>
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
        {article.blocks.map((block, index) => (
          <ArticleContent key={index} block={block} />
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
}
