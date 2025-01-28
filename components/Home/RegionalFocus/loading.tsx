import { Skeleton } from '@/components/ui/skeleton';

export default function RegionalFocusLoading() {
  return (
    <section className='my-16'>
      {/* Section Header */}
      <div className='border-t border-black py-6 mt-8'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-8 h-8 bg-gray-300' />
            <Skeleton className='h-8 w-48 bg-gray-300' />
          </div>
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className='h-10 w-28 px-4 py-2 bg-gray-300'
              />
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className='bg-white border border-black shadow-md transform transition-all duration-300 group'
          >
            <div className='aspect-video relative overflow-hidden'>
              <Skeleton className='absolute inset-0 w-full h-full bg-gray-300' />
            </div>
            <div className='p-2 md:p-4'>
              <div className='flex flex-wrap gap-2 mb-2'>
                {Array.from({ length: 3 }).map((_, labelIndex) => (
                  <Skeleton
                    key={labelIndex}
                    className='text-xs px-2 py-1 bg-gray-300 w-16'
                  />
                ))}
              </div>
              <Skeleton className='h-6 w-full mb-2 bg-gray-300' />
              <Skeleton className='h-4 w-5/6 bg-gray-300' />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center mt-8 gap-2'>
        <Skeleton className='h-10 w-24 bg-gray-300' />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='h-10 w-10 bg-gray-300' />
        ))}
        <Skeleton className='h-10 w-24 bg-gray-300' />
      </div>

      {/* See All Button */}
      <div className='flex justify-center mt-8'>
        <Skeleton className='h-10 w-48 bg-gray-300' />
      </div>
    </section>
  );
}
