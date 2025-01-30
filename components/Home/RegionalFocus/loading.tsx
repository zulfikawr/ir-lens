import { Skeleton } from '@/components/ui/skeleton';

export default function RegionalFocusLoading() {
  return (
    <div>
      <div className='py-8 w-fit'>
        <Skeleton className='h-12 w-56 bg-black' />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
        {Array.from({ length: 5 }).map((_, tagIndex) => (
          <div key={tagIndex} className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-tight pb-3 relative'>
              <Skeleton className='h-10 w-32 bg-black' />
            </h2>
            <div className='relative h-[250px] w-full mx-auto'>
              {Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className={`absolute w-full transition-all duration-500 ease-in-out 
                    bg-white shadow-xl border border-black overflow-hidden h-[250px] scale-95
                    ${index === 0 ? 'z-30 opacity-100 -translate-x-2 -translate-y-2' : ''}
                    ${index === 1 ? 'translate-x-0 translate-y-0' : 'z-10'}
                    ${index === 2 ? 'translate-x-2 translate-y-2' : 'z-20'}`}
                >
                  <div className='grid grid-cols-3 h-full'>
                    <div className='col-span-1 h-full relative'>
                      <Skeleton className='absolute inset-0 w-full h-full bg-[#a1a1a1]' />
                    </div>
                    <div className='col-span-2 flex flex-col h-full p-4'>
                      <div className='flex flex-col h-full space-y-2'>
                        <div className='flex flex-wrap gap-1 md:gap-2'>
                          {Array.from({ length: 2 }).map((_, i) => (
                            <Skeleton key={i} className='h-6 w-16 bg-black' />
                          ))}
                        </div>
                        <Skeleton className='h-6 w-5/6 bg-[#a1a1a1]' />
                        <Skeleton className='h-4 w-full bg-[#a1a1a1]' />
                        <Skeleton className='h-4 w-4/5 bg-[#a1a1a1]' />
                      </div>
                      <div className='mt-auto flex items-center justify-between text-xs text-gray-500'>
                        <Skeleton className='h-4 w-20 bg-[#a1a1a1]' />
                        <Skeleton className='h-4 w-16 bg-[#a1a1a1]' />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
