'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useArticleContext } from '@/hooks/useArticleContext';
import { getArticleUrl } from '@/utils/articleLinks';
import { LinkPreview } from '@/components/LinkPreview/LinkPreview';

const Sidebar = () => {
  const { articlesByTag, data } = useArticleContext();

  const allowedTags = useMemo(
    () => ['Diplomacy', 'Conflicts', 'Economy', 'Climate'],
    [],
  );

  const tagCounts = useMemo(() => {
    return allowedTags.reduce(
      (acc, tag) => {
        acc[tag] = articlesByTag[tag]?.length || 0;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [articlesByTag, allowedTags]);

  const latestTagArticles = useMemo(() => {
    return allowedTags
      .map((tag) => articlesByTag[tag]?.[0])
      .filter(
        (article): article is Exclude<typeof article, undefined> => !!article,
      );
  }, [articlesByTag, allowedTags]);

  const mostViewedArticles = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 4);
  }, [data]);

  return (
    <div>
      {/* Most Viewed Section */}
      <div className='p-6 mt-5 mb-8 border border-black shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 pb-4 border-b border-black'>
          Most Viewed
        </h2>
        <div className='space-y-6'>
          {mostViewedArticles.map((article) => (
            <article key={article.slug} className='flex items-start gap-4'>
              <div className='w-20 h-20 flex-shrink-0'>
                <div className='relative w-full h-full'>
                  <Link href={getArticleUrl(article)}>
                    <Image
                      src={
                        article.coverImg || '/images/default-fallback-image.png'
                      }
                      alt={article.coverImgAlt || article.title}
                      sizes='90vw'
                      fill
                      className='absolute inset-0 object-cover object-center transition-all duration-500 grayscale hover:grayscale-0'
                    />
                  </Link>
                </div>
              </div>
              <div className='w-full'>
                <div className='flex justify-between mb-1'>
                  <div className='flex items-center gap-2 -mt-1'>
                    <Link href={`/tags/${article.tag}`}>
                      <Button size='sm' className='h-5 text-[10px]'>
                        {article.tag}
                      </Button>
                    </Link>
                  </div>
                  <time
                    className='text-[10px] text-gray-500'
                    dateTime={article.date}
                  >
                    {article.date}
                  </time>
                </div>
                <LinkPreview href={getArticleUrl(article)} underline={false}>
                  <h3 className='text-sm font-bold hover:underline line-clamp-3'>
                    {article.title}
                  </h3>
                </LinkPreview>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Quick Headlines Section */}
      <div className='p-6 mt-5 mb-8 border border-black shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 pb-4 border-b border-black'>
          Quick Headlines
        </h2>
        <div className='space-y-6'>
          {latestTagArticles.map((article) => (
            <article key={article.slug} className='flex items-start gap-4'>
              <div className='w-20 h-20 flex-shrink-0'>
                <div className='relative w-full h-full'>
                  <Link href={getArticleUrl(article)}>
                    <Image
                      src={
                        article.coverImg || '/images/default-fallback-image.png'
                      }
                      alt={article.coverImgAlt || article.title}
                      sizes='90vw'
                      fill
                      className='absolute inset-0 object-cover object-center transition-all duration-500 grayscale hover:grayscale-0'
                    />
                  </Link>
                </div>
              </div>
              <div className='w-full'>
                <div className='flex justify-between mb-1'>
                  <div className='flex items-center gap-2 -mt-1'>
                    <Link href={`/tags/${article.tag}`}>
                      <Button size='sm' className='h-5 text-[10px]'>
                        {article.tag}
                      </Button>
                    </Link>
                  </div>
                  <time
                    className='text-[10px] text-gray-500'
                    dateTime={article.date}
                  >
                    {article.date}
                  </time>
                </div>
                <LinkPreview href={getArticleUrl(article)} underline={false}>
                  <h3 className='text-sm font-bold hover:underline line-clamp-3'>
                    {article.title}
                  </h3>
                </LinkPreview>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      {/* <div className='bg-black text-white p-6 shadow-lg'>
        <h2 className='text-2xl font-bold mb-4 pb-4 border-b border-white'>
          Tags
        </h2>
        <div className='space-y-2'>
          {Object.entries(tagCounts).map(([tag, count]) => (
            <div key={tag} className='flex items-center justify-between'>
              <Link href={`/tags/${tag}`} className='hover:underline'>
                {tag}
              </Link>
              <span className='bg-white text-black px-3 py-1 text-sm'>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
