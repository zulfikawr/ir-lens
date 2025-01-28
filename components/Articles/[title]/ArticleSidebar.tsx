'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleType } from '@/types/article';

export function RelatedArticlesSection({
  articles,
  currentArticle,
  isExpanded,
}: {
  articles: ArticleType['articles'];
  currentArticle: ArticleType['articles'][0];
  isExpanded: boolean;
}) {
  const relatedArticles = articles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        article.labels.some((label) => currentArticle.labels.includes(label)),
    )
    .slice(0, 10);

  if (!isExpanded || relatedArticles.length === 0) return null;

  return (
    <div>
      <h3 className='text-xl font-bold mb-6 border-b border-black pb-2'>
        Related Articles
      </h3>
      <div className='max-h-72 overflow-y-auto pr-2'>
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className='block mb-6 group'
          >
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 flex-shrink-0'>
                <div className='relative w-full h-full'>
                  <Image
                    src={article.coverImage}
                    alt={article.coverImageAlt}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover object-center group-hover:brightness-90'
                    fill
                  />
                </div>
              </div>
              <div>
                <time className='text-xs text-gray-600 mb-1 block'>
                  {article.date}
                </time>
                <h4 className='text-sm font-semibold group-hover:underline'>
                  {article.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LatestArticlesSection({
  articles,
  isExpanded,
}: {
  articles: ArticleType['articles'];
  isExpanded: boolean;
}) {
  const latestArticles = articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (!isExpanded) return null;

  return (
    <div>
      <h3 className='text-xl font-bold mb-6 border-b border-black pb-2'>
        Latest Articles
      </h3>
      <div className='max-h-72 overflow-y-auto pr-2'>
        {latestArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className='block mb-6 group'
          >
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 flex-shrink-0'>
                <div className='relative w-full h-full'>
                  <Image
                    src={article.coverImage}
                    alt={article.coverImageAlt}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover object-center group-hover:brightness-90'
                    fill
                  />
                </div>
              </div>
              <div>
                <time className='text-xs text-gray-600 mb-1 block'>
                  {article.date}
                </time>
                <h4 className='text-sm font-semibold group-hover:underline'>
                  {article.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArticleSidebar({
  articles,
  currentArticle,
}: {
  articles: ArticleType['articles'];
  currentArticle: ArticleType['articles'][0];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`
        mt-16 md:mt-0 block md:border-l md:border-black md:sticky md:top-10 md:self-start 
        ${isExpanded ? 'md:w-[300px] md:pl-8' : 'md:w-0'}
        relative transition-all duration-300 ease-in-out
      `}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute left-[-42px] top-0 z-10 p-2 bg-white hover:bg-black hover:text-white border-l border-t border-b border-black 
          ${isExpanded ? 'border-l border-t border-b' : 'border-r'}
          hidden md:block
        `}
      >
        {isExpanded ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {isExpanded && (
        <div className='space-y-6'>
          <RelatedArticlesSection
            articles={articles}
            currentArticle={currentArticle}
            isExpanded={isExpanded}
          />
          <LatestArticlesSection articles={articles} isExpanded={isExpanded} />
        </div>
      )}
    </aside>
  );
}
