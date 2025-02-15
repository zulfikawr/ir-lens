'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getArticleUrl } from '@/utils/articleLinks';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className='bg-white border border-black shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
      <div className='flex'>
        <Link
          href={getArticleUrl(article)}
          className='w-24 flex-shrink-0 relative block'
        >
          <Image
            src={article.coverImg}
            alt={article.coverImgAlt}
            sizes='90vw'
            className='object-cover object-center transition-all duration-500 grayscale hover:grayscale-0'
            fill
          />
        </Link>

        <div className='p-2 flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <ArticleTag tag={article.tag} />
            <ArticleTag tag={article.region} variant='secondary' />
          </div>

          <Link href={getArticleUrl(article)} className='group'>
            <h4 className='text-sm font-semibold mb-2 text-gray-800 hover:underline md:line-clamp-3'>
              {article.title}
            </h4>
          </Link>

          <div className='flex flex-row md:flex-col gap-4 md:gap-0'>
            <MetadataItem
              icon={<Calendar className='w-3 h-3' />}
              text={article.date}
            />
            <MetadataItem
              icon={<MapPin className='w-3 h-3' />}
              text={article.location}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleTag({
  tag,
  variant = 'default',
}: {
  tag: string;
  variant?: 'default' | 'secondary';
}) {
  return (
    <Link href={`/tags/${tag}`} className='hover:underline'>
      <Button size='sm' variant={variant} className='text-[10px] h-6'>
        {tag}
      </Button>
    </Link>
  );
}

function MetadataItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className='flex items-center gap-1 mb-1 text-gray-500'>
      {icon}
      <span className='text-[10px] block'>{text}</span>
    </div>
  );
}
