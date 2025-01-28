import { Skeleton } from '@/components/ui/skeleton';

export default function LatestArticleLoading() {
  return (
    <div className='relative h-[600px] md:h-[560px] w-full pr-4 mx-auto mt-6 scale-95'>
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className={`absolute w-full bg-white shadow-xl border border-black overflow-hidden h-[600px] md:h-[500px]
            ${index === 0 ? 'z-30 opacity-100 -translate-x-4 -translate-y-4' : ''}
            ${index === 1 ? 'translate-x-0 translate-y-0' : 'z-10'}
            ${index === 2 ? 'translate-x-4 translate-y-4' : 'z-20'}`}
        >
          <div className='grid grid-cols-1 lg:grid-cols-10 gap-4 h-full'>
            <div className='col-span-5 min-h-[200px] lg:min-h-[400px] h-auto relative'>
              <Skeleton className='w-full h-full bg-[#a1a1a1]' />
            </div>

            <div className='col-span-5 flex flex-col h-auto px-4 md:px-2 md:pr-4 md:py-6'>
              <div className='flex flex-wrap gap-1 mt-1 md:gap-2'>
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className='h-6 w-20 bg-black' />
                ))}
              </div>

              <div className='mt-6 space-y-2'>
                <Skeleton className='h-8 lg:h-10 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-8 lg:h-10 w-3/4 bg-[#a1a1a1]' />
                <Skeleton className='h-8 lg:h-10 w-1/2 bg-[#a1a1a1]' />
              </div>

              <div className='mt-4 space-y-2'>
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-5/6 bg-[#a1a1a1]' />
                <Skeleton className='h-6 w-3/4 bg-[#a1a1a1]' />
              </div>

              <div className='flex flex-col justify-end mt-auto space-y-4'>
                <div className='flex flex-wrap items-center gap-2 md:gap-4 text-sm'>
                  <Skeleton className='h-6 w-32 bg-[#a1a1a1]' />
                  <span>|</span>
                  <Skeleton className='h-6 w-24 bg-[#a1a1a1]' />
                </div>
                <Skeleton className='h-8 w-24 bg-black' />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
