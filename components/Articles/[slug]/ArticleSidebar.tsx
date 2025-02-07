'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { ArticleType } from '@/types/article';
import { Button } from '@/components/ui/button';
import { getArticleUrl } from '@/utils/articleLinks';

export function RelatedArticlesSection({
  articles,
  currentArticle,
}: {
  articles: ArticleType['articles'];
  currentArticle: ArticleType['articles'][0];
}) {
  const relatedArticles = articles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        article.tag === currentArticle.tag,
    )
    .slice(0, 10);

  if (relatedArticles.length === 0) return null;

  return (
    <div>
      <h3 className='text-xl text-center font-bold mb-6 pb-2 bg-black text-white px-2 py-1'>
        Related Articles
      </h3>
      <div className='grid gap-6'>
        {relatedArticles.map((article) => (
          <div
            className='bg-white border border-black shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'
            key={article.slug}
          >
            <div className='flex'>
              {/* Image */}
              <Link
                href={getArticleUrl(article)}
                className='w-24 flex-shrink-0 relative block'
              >
                <Image
                  src={article.coverImg}
                  alt={article.coverImgAlt}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover object-center transition-all duration-500 grayscale hover:grayscale-0'
                  fill
                />
              </Link>

              {/* Content */}
              <div className='p-2 flex-1'>
                {/* Tags and Regions */}
                <div className='flex items-center gap-2 mb-1'>
                  <Link
                    href={`/tags/${article.tag}`}
                    className='hover:underline'
                  >
                    <Button size='sm' className='text-[10px] h-6'>
                      {article.tag}
                    </Button>
                  </Link>
                  <Link
                    href={`/tags/${article.region}`}
                    className='hover:underline'
                  >
                    <Button size='sm' className='text-[10px] h-6'>
                      {article.region}
                    </Button>
                  </Link>
                </div>

                {/* Title */}
                <Link href={getArticleUrl(article)} className='group'>
                  <h4 className='text-sm font-semibold mb-2 text-gray-800 hover:underline md:line-clamp-3'>
                    {article.title}
                  </h4>
                </Link>

                {/* Date and Location */}
                <div className='flex flex-row md:flex-col gap-4 md:gap-0'>
                  <div className='flex items-center gap-1 mb-1 text-gray-500'>
                    <Calendar className='w-3 h-3' />
                    <time className='text-[10px] block'>{article.date}</time>
                  </div>
                  <div className='flex items-center gap-1 text-gray-500'>
                    <MapPin className='w-3 h-3' />
                    <span className='text-[10px] block'>
                      {article.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  return (
    <aside
      className='
        mt-16 md:mt-0 md:w-1/4 md:max-w-[300px] md:pl-6 md:border-l md:border-black 
        relative transition-all duration-300 ease-in-out px-4 md:px-0
      '
    >
      <div className='space-y-6'>
        <RelatedArticlesSection
          articles={articles}
          currentArticle={currentArticle}
        />
      </div>
    </aside>
  );
}
