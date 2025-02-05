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
            <Skeleton className='w-full aspect-[16-9] h-[400px] shadow-md mb-8 bg-[#a1a1a1] border border-black' />

            {/* Labels Loading */}
            <div className='flex flex-wrap gap-2 md:gap-4 mb-4'>
              {[...Array(2)].map((_, idx) => (
                <Skeleton key={idx} className='h-8 w-20 bg-black' />
              ))}
            </div>

            {/* Title and Description Loading */}
            <div className='flex flex-col items-start'>
              <Skeleton className='h-16 md:h-20 w-3/4 mb-4 bg-[#a1a1a1]' />
              <Skeleton className='h-24 w-full max-w-3xl bg-[#a1a1a1]' />
            </div>

            {/* Metadata & Actions Loading */}
            <div className='flex flex-col md:flex-row items-start justify-between md:items-center gap-6 mt-6 pb-6 border-b border-gray-200'>
              <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                <Skeleton className='h-6 w-32 bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-32 bg-[#a1a1a1]' />
              </div>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-6 w-32 bg-black' />
              </div>
            </div>
          </div>

          {/* Article Content Blocks Loading */}
          <div className='prose prose-lg space-y-6'>
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className='space-y-4'>
                <Skeleton className='h-8 w-2/3 bg-[#a1a1a1]' />
                <Skeleton className='h-24 w-full bg-[#a1a1a1]' />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Loading */}
        <aside className='mt-16 md:mt-0 block md:border-l md:border-black md:sticky md:top-10 md:self-start md:w-[300px] md:pl-8'>
          {/* Toggle Button Loading */}
          <Skeleton className='absolute left-[-40px] top-0 w-10 h-10 hidden md:block bg-[#a1a1a1] border border-black' />

          <div className='space-y-6'>
            {/* Related Articles Loading */}
            <div className='mb-24'>
              <Skeleton className='h-8 w-40 mb-6 bg-[#a1a1a1] border-b border-black' />
              <div className='max-h-72 space-y-6'>
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className='flex items-center gap-4'>
                    <Skeleton className='w-16 h-16 flex-shrink-0 bg-[#a1a1a1]' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-20 mb-1 bg-[#a1a1a1]' />
                      <Skeleton className='h-5 w-full bg-[#a1a1a1]' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Articles Loading */}
            <div>
              <Skeleton className='h-8 w-40 mb-6 bg-[#a1a1a1] border-b border-black' />
              <div className='max-h-72 space-y-6 '>
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className='flex items-center gap-4'>
                    <Skeleton className='w-16 h-16 flex-shrink-0 bg-[#a1a1a1]' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-20 mb-1 bg-[#a1a1a1]' />
                      <Skeleton className='h-5 w-full bg-[#a1a1a1]' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
