'use client';

import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { Hash, ArrowRight } from 'lucide-react';
import Loading from '@/components/Tags/loading';

export default function TagsPage() {
  const { data } = useArticleContext();

  if (!data.length) {
    return <Loading />;
  }

  const tagCounts = data.reduce(
    (acc, article) => {
      const tag = article.tag;
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedTags = Object.entries(tagCounts).sort(([tagA], [tagB]) =>
    tagA.localeCompare(tagB),
  );

  const groupedTags = sortedTags.reduce(
    (acc, [tag, count]) => {
      const firstLetter = tag[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ tag, count });
      return acc;
    },
    {} as Record<string, Array<{ tag: string; count: number }>>,
  );

  return (
    <div className='max-w-6xl mx-auto px-4 py-16'>
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-16 h-px bg-black'></div>
          <Hash className='mx-4 w-8 h-8' />
          <div className='w-16 h-px bg-black'></div>
        </div>
        <h1 className='text-4xl font-bold mb-4'>Browse by Tags</h1>
        <p className='text-gray-600 max-w-2xl mx-auto'>
          Explore our articles by topic.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {Object.entries(groupedTags).map(([letter, tags]) => (
          <div key={letter} className='border-2 border-black'>
            <div className='bg-black text-white p-4'>
              <span className='text-2xl font-bold'>{letter}</span>
            </div>
            <div className='p-4'>
              {tags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className='group block border-b border-gray-200 last:border-0'
                >
                  <div className='py-3 flex items-center justify-between hover:bg-gray-50'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium group-hover:underline'>
                        {tag}
                      </span>
                      <span className='text-sm text-gray-500'>({count})</span>
                    </div>
                    <ArrowRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
