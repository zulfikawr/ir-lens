import { Skeleton } from '@/components/ui/skeleton';

export default function RegionalFocusLoading() {
  return (
    <section className='my-8 sm:my-12 md:my-16'>
      {/* Section Header */}
      <div className='border-t border-black py-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4'>
          <Skeleton className='h-12 w-48 bg-[#a1a1a1]' />
          <div className='flex flex-wrap gap-1 sm:gap-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className='h-10 w-20 sm:w-24 bg-[#a1a1a1]'
              />
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className='space-y-6 sm:space-y-8 md:space-y-12'>
        {Array.from({ length: 5 }).map((_, index) => (
          <article key={index} className='group'>
            <div className='grid md:grid-cols-[0.4fr_1fr] gap-4 sm:gap-6 md:gap-8'>
              <div className='block overflow-hidden'>
                <Skeleton className='w-full h-56 md:h-64 bg-[#a1a1a1]' />
              </div>
              <div className='flex flex-col justify-between'>
                <div className='space-y-2 sm:space-y-3'>
                  <div className='flex flex-wrap gap-1 sm:gap-2'>
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <Skeleton key={idx} className='h-6 w-16 bg-[#a1a1a1]' />
                    ))}
                  </div>
                  <Skeleton className='h-8 w-full bg-[#a1a1a1]' />
                  <Skeleton className='h-4 w-5/6 bg-[#a1a1a1]' />
                </div>
                <div className='flex flex-wrap gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-6'>
                  <Skeleton className='h-4 w-24 bg-[#a1a1a1]' />
                  <Skeleton className='h-4 w-24 bg-[#a1a1a1]' />
                </div>
              </div>
            </div>
            <div className='border-b border-gray-200 mt-6 sm:mt-8 md:mt-12' />
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className='mt-6 sm:mt-8'>
        <div className='flex justify-center gap-2'>
          <Skeleton className='h-10 w-24 bg-[#a1a1a1]' />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-10 w-10 bg-[#a1a1a1]' />
          ))}
          <Skeleton className='h-10 w-24 bg-[#a1a1a1]' />
        </div>
      </div>

      {/* See All Button */}
      <div className='flex justify-center mt-6 sm:mt-8'>
        <Skeleton className='h-10 w-48 bg-[#a1a1a1]' />
      </div>
    </section>
  );
}
