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
}

export function LinkPreview({ href, children }: LinkPreviewProps) {
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
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
          onMouseEnter={handleMouseEnter}
        >
          {children}
        </a>
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
              <div className='flex items-center gap-3 text-xs text-muted-foreground pt-2'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {previewData.date}
                </div>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-3 w-3' />
                  {previewData.location}
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
