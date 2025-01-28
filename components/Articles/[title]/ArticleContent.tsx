'use client';

import { ArticleType } from '@/types/article';
import { RichContentBlock } from '@/components/Articles/[title]/RichContentBlock';
import Link from 'next/link';
import { Calendar, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleShareDialog } from './ArticleShare';
import ScrollToTop from '@/components/ScrollToTop';
import { useAuth } from '@/hooks/useAuth';

export function ArticleContent({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  const { user } = useAuth();

  return (
    <div className='mb-16'>
      <div className='flex flex-wrap gap-2 md:gap-4 mb-6'>
        {article.labels.map((label, idx) => (
          <Link key={idx} href={`/tags/${label}`}>
            <Button>{label}</Button>
          </Link>
        ))}
      </div>
      <div className='space-y-6'>
        <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
          {article.title}
        </h1>
        <p className='text-md md:text-lg text-gray-600 leading-relaxed'>
          {article.description}
        </p>
      </div>

      <div className='flex flex-col md:flex-row items-start justify-between md:items-center gap-6 mt-6 pb-6 border-b border-gray-200'>
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
        <div className='flex items-center gap-4'>
          {user && (
            <div className='w-fit'>
              <Link href={`/articles/${article.slug}/edit`}>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Edit className='w-4 h-4' />
                  Edit Article
                </Button>
              </Link>
            </div>
          )}
          <ArticleShareDialog article={article} />
        </div>
      </div>

      <div className='prose prose-lg'>
        {article.blocks.map((block, index) => (
          <RichContentBlock key={index} block={block} />
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
}
