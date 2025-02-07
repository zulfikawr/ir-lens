import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleLoading() {
  return (
    <main className='max-w-3xl mx-auto px-4'>
      <div className='py-16'>
        {/* Article Content Loading */}
        <div>
          {/* Header Loading */}
          <div className='mb-12'>
            {/* Cover Image Loading */}
            <Skeleton className='w-full aspect-[16/9] h-[250px] md:h-[400px] shadow-md mb-6 bg-[#a1a1a1] border border-black' />

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
                {[...Array(5)].map((_, subIdx) => (
                  <Skeleton key={subIdx} className='h-6 w-full bg-[#a1a1a1]' />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
