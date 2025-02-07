'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleLoading() {
  return (
    <main className='max-w-6xl mx-auto px-4'>
      <div className='py-16 md:grid md:grid-cols-[1fr_auto] md:gap-16'>
        {/* Article Content Loading */}
        <div className='mb-16'>
          {/* Header Loading */}
          <div className='mb-12'>
            {/* Cover Image Loading */}
            <Skeleton className='w-full aspect-[16-9] h-[250px] md:h-[400px] shadow-md mb-6 bg-[#a1a1a1] border border-black' />

            {/* Labels Loading */}
            <div className='flex flex-wrap gap-2 md:gap-4 mb-4 justify-between'>
              <div className='flex gap-2'>
                {[...Array(2)].map((_, idx) => (
                  <Skeleton key={idx} className='h-10 w-24 bg-black' />
                ))}
              </div>
              <div className='flex gap-4 items-center'>
                <Skeleton className='h-10 w-24 bg-black' />
              </div>
            </div>

            {/* Title and Description Loading */}
            <div className='flex flex-col items-start space-y-2'>
              <Skeleton className='h-12 w-full bg-[#a1a1a1] mb-4' />
              {[...Array(3)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  className='h-5 w-full max-w-3xl bg-[#a1a1a1]'
                />
              ))}
            </div>

            {/* Metadata & Actions Loading */}
            <div className='flex flex-col md:flex-row items-start justify-between md:items-center gap-4 mt-6 pb-4 border-b border-gray-200'>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                {[...Array(2)].map((_, idx) => (
                  <Skeleton key={idx} className='h-5 w-24 bg-[#a1a1a1]' />
                ))}
              </div>
            </div>
          </div>

          {/* Article Content Blocks Loading */}
          <div className='prose prose-lg space-y-4'>
            {[...Array(12)].map((_, idx) => (
              <div key={idx} className='space-y-2'>
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Loading */}
        <aside className='mt-16 md:mt-0 block md:border-l md:border-black md:top-10 md:self-start md:w-[300px] md:pl-8'>
          <div className='space-y-6'>
            {/* Related Articles Loading */}
            <Skeleton className='h-12 w-full bg-black mb-6' />
            <div className='grid gap-6'>
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className='flex'>
                  <Skeleton className='w-24 h-24 flex-shrink-0 bg-[#a1a1a1]' />
                  <div className='px-2 flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      {[...Array(2)].map((_, idx) => (
                        <Skeleton key={idx} className='h-6 w-16 bg-[#a1a1a1]' />
                      ))}
                    </div>
                    <Skeleton className='h-6 w-full bg-[#a1a1a1] mb-2' />
                    <Skeleton key={idx} className='h-4 w-full bg-[#a1a1a1]' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
