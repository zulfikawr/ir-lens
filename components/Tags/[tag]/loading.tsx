import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='mx-auto px-4 md:px-8 py-16'>
      {/* Header Section Skeleton */}
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <Skeleton className='w-16 h-px bg-[#a1a1a1]'></Skeleton>
          <Skeleton className='w-8 h-8 mx-4 bg-[#a1a1a1]'></Skeleton>
          <Skeleton className='w-16 h-px bg-[#a1a1a1]'></Skeleton>
        </div>
        <Skeleton className='h-10 w-48 mx-auto mb-4 bg-[#a1a1a1]'></Skeleton>
        <Skeleton className='h-5 w-96 max-w-full mx-auto bg-[#a1a1a1]'></Skeleton>
      </div>

      {/* Articles List Skeleton */}
      <div className='space-y-12'>
        {[...Array(5)].map((_, index) => (
          <article key={index}>
            <div className='grid md:grid-cols-[0.4fr_1fr] gap-8'>
              <Skeleton className='w-full h-64 md:h-58 bg-[#a1a1a1]'></Skeleton>
              <div className='flex flex-col justify-between'>
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton className='h-6 w-16 bg-[#a1a1a1]'></Skeleton>
                  </div>
                  <Skeleton className='h-8 w-3/4 bg-[#a1a1a1]'></Skeleton>
                  <Skeleton className='h-5 w-full bg-[#a1a1a1]'></Skeleton>
                </div>
                <div className='flex flex-wrap gap-6 mt-6'>
                  <Skeleton className='h-4 w-24 bg-[#a1a1a1]'></Skeleton>
                  <Skeleton className='h-4 w-20 bg-[#a1a1a1]'></Skeleton>
                </div>
              </div>
            </div>
            {index < 4 && (
              <Skeleton className='h-px w-full bg-gray-200 mt-12'></Skeleton>
            )}
          </article>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className='flex justify-center items-center mt-16 gap-2'>
        <Skeleton className='h-10 w-24 bg-[#a1a1a1]'></Skeleton>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className='h-10 w-10 bg-[#a1a1a1]'></Skeleton>
        ))}
        <Skeleton className='h-10 w-24 bg-[#a1a1a1]'></Skeleton>
      </div>
    </div>
  );
}
