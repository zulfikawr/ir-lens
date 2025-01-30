'use client';

import { ArticleType } from '@/types/article';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleShareDialog } from './ArticleShare';
import { useAuth } from '@/hooks/useAuth';

export function ArticleHeader({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  const { user } = useAuth();

  return (
    <div>
      <div className='relative w-full h-[30vh] sm:h-[40vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] overflow-hidden border border-black shadow-md mb-8'>
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt}
          fill
          className='absolute inset-0 w-full h-full object-cover grayscale-[20%] contrast-125 brightness-[90%]'
          priority
        />
      </div>

      <div className='flex flex-wrap gap-2 md:gap-4 mb-4'>
        {article.labels.map((label, idx) => (
          <Link key={idx} href={`/tags/${label}`}>
            <Button>{label}</Button>
          </Link>
        ))}
      </div>

      <div className='flex flex-col items-start'>
        <h1 className='text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900'>
          {article.title}
        </h1>
        <p className='text-md md:text-lg text-gray-600 mt-4 max-w-3xl'>
          {article.description}
        </p>
      </div>

      <div className='flex flex-col md:flex-row items-start justify-between md:items-center gap-6 mt-6 pb-6 border-b border-black'>
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
    </div>
  );
}
