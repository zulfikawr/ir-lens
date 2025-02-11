'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { getArticlePreview } from './getArticlePreviews';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getArticleUrl } from '@/utils/articleLinks';

interface LinkPreviewProps {
  href: string;
  children: ReactNode;
  underline?: boolean;
}

export function LinkPreview({
  href,
  children,
  underline = true,
}: LinkPreviewProps) {
  const [previewData, setPreviewData] = useState<Awaited<
    ReturnType<typeof getArticlePreview>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleMouseEnter = async () => {
    if (!previewData && !isLoading && !hasError) {
      setIsLoading(true);
      try {
        const data = await getArticlePreview(href);
        if (data) {
          setPreviewData(data);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Failed to fetch link preview:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={href}
          target='_blank'
          className={underline ? 'underline' : ''}
          onMouseEnter={handleMouseEnter}
        >
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className='w-80 p-0'>
        {isLoading ? (
          <div className='flex items-center justify-center h-40'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : previewData ? (
          <div>
            <Link href={getArticleUrl(previewData)}>
              <Image
                src={previewData.image || '/placeholder.svg'}
                alt={previewData.title}
                width={300}
                height={200}
                className='object-cover w-full h-40 border-b border-black grayscale hover:grayscale-0 transition-all duration-500'
              />
            </Link>
            <div className='p-2 space-y-2'>
              <div className='flex gap-2'>
                <Link href={`/tags/${previewData.tag}`}>
                  <Button size='sm' className='text-xs'>
                    {previewData.tag}
                  </Button>
                </Link>
                <Link href={`/region/${previewData.region}`}>
                  <Button size='sm' className='text-xs' variant='secondary'>
                    {previewData.region}
                  </Button>
                </Link>
              </div>
              <Link
                href={getArticleUrl(previewData)}
                target='_blank'
                className='font-semibold line-clamp-2 leading-tight hover:underline'
              >
                {previewData.title}
              </Link>
              <p className='text-sm text-muted-foreground line-clamp-3'>
                {previewData.description}
              </p>
              <div className='flex flex-wrap items-center justify-between text-gray-500 text-xs pt-1 gap-2'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <time dateTime={previewData.date}>{previewData.date}</time>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  <p>{previewData.location}</p>
                </div>
              </div>
            </div>
          </div>
        ) : hasError ? (
          <div className='h-20 flex items-center justify-center'>
            <p className='text-sm text-muted-foreground'>
              Failed to load article preview
            </p>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
