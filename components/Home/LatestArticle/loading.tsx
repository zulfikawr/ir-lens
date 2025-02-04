import { Skeleton } from '@/components/ui/skeleton';

export default function LatestArticleLoading() {
  return (
    <div className='relative h-[600px] md:h-[560px] w-full pr-4 mx-auto mt-6 scale-90'>
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className={`absolute w-full transition-all duration-500 ease-in-out 
            bg-white shadow-xl border border-black overflow-hidden h-[600px] md:h-[500px]
            ${index === 0 ? 'z-30 opacity-100 -translate-x-4 -translate-y-4' : ''} 
            ${index === 1 ? 'translate-x-0 translate-y-0' : 'z-10'} 
            ${index === 2 ? 'translate-x-4 translate-y-4' : 'z-20'}`}
        >
          <div className='grid grid-cols-1 lg:grid-cols-10 h-full'>
            <div className='col-span-5 h-[250px] lg:h-full'>
              <Skeleton className='w-full h-full bg-[#a1a1a1]' />
            </div>

            <div className='col-span-5 h-[350px] lg:h-full flex flex-col px-4 py-4 lg:p-6'>
              <div className='h-full flex flex-col justify-between'>
                <div>
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className='h-6 w-20 bg-black' />
                    ))}
                  </div>

                  <div className='mb-4'>
                    <Skeleton className='h-8 lg:h-10 w-full bg-[#a1a1a1] mb-2' />
                    <Skeleton className='h-8 lg:h-10 w-3/4 bg-[#a1a1a1]' />
                  </div>

                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-full bg-[#a1a1a1]' />
                    <Skeleton className='h-5 w-5/6 bg-[#a1a1a1]' />
                    <Skeleton className='h-5 w-4/5 bg-[#a1a1a1]' />
                    <Skeleton className='h-5 w-3/4 bg-[#a1a1a1]' />
                  </div>
                </div>

                <div className='mt-auto'>
                  <div className='flex flex-wrap items-center gap-2 text-gray-500 text-sm mb-4'>
                    <Skeleton className='h-5 w-32 bg-[#a1a1a1]' />
                    <span>|</span>
                    <Skeleton className='h-5 w-24 bg-[#a1a1a1]' />
                  </div>

                  <Skeleton className='h-10 w-full md:w-24 bg-black' />
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
