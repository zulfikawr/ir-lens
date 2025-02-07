'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleType } from '@/types/article';
import { Button } from '@/components/ui/button';
import SidebarLoading from './loading';
import { getArticles } from '@/lib/database';
import { getArticleUrl } from '@/utils/articleLinks';

const Sidebar = () => {
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allowedTags = useMemo(
    () => ['Diplomacy', 'Conflicts', 'Economy', 'Climate'],
    [],
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        const sortedArticles = data.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        setArticles(sortedArticles);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const tags = useMemo(() => {
    return articles.reduce(
      (acc, article) => {
        if (allowedTags.includes(article.tag)) {
          acc[article.tag] = (acc[article.tag] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [articles, allowedTags]);

  const latestTagArticles = useMemo(() => {
    return allowedTags
      .map((tag) => articles.find((article) => article.tag === tag))
      .filter(
        (article): article is Exclude<typeof article, undefined> => !!article,
      );
  }, [articles, allowedTags]);

  if (loading) {
    return (
      <div>
        <SidebarLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='sticky top-0'>
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
                      src={article.coverImg}
                      alt={article.coverImgAlt || article.title}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
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
                <Link href={getArticleUrl(article)}>
                  <h3 className='text-sm font-bold hover:underline line-clamp-3'>
                    {article.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className='bg-black text-white p-6 shadow-lg'>
        <h2 className='text-2xl font-bold mb-4 pb-4 border-b border-white'>
          Tags
        </h2>
        <div className='space-y-2'>
          {Object.entries(tags).map(([tag, count]) => (
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
      </div>
    </div>
  );
};

export default Sidebar;
