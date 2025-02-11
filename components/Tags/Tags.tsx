'use client';

import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { Hash, ArrowRight } from 'lucide-react';
import Loading from '@/components/Tags/loading';
import PageTitle from '@/components/PageTitle/PageTitle';

export default function TagsPage() {
  const { data, loading } = useArticleContext();

  if (loading) return <Loading />;

  const tagCounts = data.reduce(
    (acc, article) => {
      const tag = article.tag;
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagList = Object.entries(tagCounts);

  return (
    <div className='min-h-screen max-w-4xl mx-auto px-4 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<Hash />}
        title='Browse by Tags'
        description='Explore our articles by topic.'
      />

      <div className='border-t-2 border-black'>
        {tagList.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className='block border-b-2 border-black py-4 px-6 flex items-center justify-between hover:bg-gray-100'
          >
            <div className='flex items-center gap-2'>
              <span className='text-lg font-medium text-black'>{tag}</span>
              <span className='text-sm text-gray-600'>({count})</span>
            </div>
            <ArrowRight className='w-4 h-4 text-black' />
          </Link>
        ))}
      </div>
    </div>
  );
}
