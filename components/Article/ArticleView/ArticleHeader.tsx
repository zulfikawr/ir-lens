'use client';

import { Article } from '@/types/article';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Edit, TagIcon, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleShareDialog } from './ArticleShare';
import { useAuth } from '@/hooks/useAuth';
import { getArticleUrl } from '@/utils/articleLinks';
import { useEffect } from 'react';
import { incrementArticleViews } from '@/lib/database';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { formatDate } from '@/utils/formatDate';

export function ArticleHeader({ article }: { article: Article }) {
  const { user } = useAuth();

  useEffect(() => {
    if (article?.slug && article?.date) {
      incrementArticleViews(article.slug, article.date);
    }
  }, [article]);

  return (
    <div>
      <div className='mb-8 relative w-full max-w-4xl mx-auto mb-8'>
        <div className='relative w-full aspect-[16/9] shadow-lg'>
          <Image
            src={article.coverImg || '/images/default-fallback-image.png'}
            alt={article.coverImgAlt || 'Cover Image'}
            sizes='90vw'
            className='object-cover border border-black'
            fill
            priority
          />
          <div className='absolute bottom-2 right-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-white/90 backdrop-blur-sm'
                >
                  Alt
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-64 mr-4 md:mr-0'>
                <p className='text-sm text-gray-800'>{article.coverImgAlt}</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 md:gap-4 mb-4 justify-between'>
        <div className='flex gap-2'>
          <Link href={`/tags/${article.tag}`}>
            <Button className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4' />
              {article.tag}
            </Button>
          </Link>
          <Link href={`/tags/${article.region}`}>
            <Button variant='secondary' className='flex items-center gap-2'>
              <Globe className='w-4 h-4' />
              {article.region}
            </Button>
          </Link>
        </div>
        <div className='hidden md:flex gap-2 md:gap-4 items-center justify-end'>
          {user && (
            <div className='w-fit'>
              <Link href={`${getArticleUrl(article)}/edit`}>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Edit className='w-4 h-4' />
                  Edit
                </Button>
              </Link>
            </div>
          )}
          <div className='w-fit'>
            <ArticleShareDialog article={article} />
          </div>
        </div>
      </div>

      <div className='flex flex-col items-start'>
        <h1 className='text-4xl sm:text-4xl md:text-5xl font-extrabold text-black'>
          {article.title}
        </h1>
        <p className='text-md md:text-lg text-gray-600 mt-4 max-w-3xl'>
          {article.description}
        </p>
      </div>

      <div className='flex flex-col md:flex-row justify-between md:items-center gap-4 mt-6 pb-6 border-b border-black'>
        <div className='grid grid-cols-1 md:flex md:flex-row gap-4 md:gap-8 text-sm md:text-base'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-5 h-5' />
            <time dateTime={formatDate(article.date)}>
              {formatDate(article.date)}
            </time>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <MapPin className='w-5 h-5' />
            <span>{article.location}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Eye className='w-5 h-5' />
            <span>{article.views} Views</span>
          </div>
        </div>

        <div className='md:hidden flex gap-2 md:gap-4 items-center justify-end'>
          {user && (
            <div className='w-fit'>
              <Link href={`${getArticleUrl(article)}/edit`}>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Edit className='w-4 h-4' />
                  Edit
                </Button>
              </Link>
            </div>
          )}
          <div className='w-fit'>
            <ArticleShareDialog article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}
