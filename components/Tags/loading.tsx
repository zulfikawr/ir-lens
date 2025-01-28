import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='max-w-6xl mx-auto px-4 py-16'>
      {/* Header Skeleton */}
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <Skeleton className='w-16 h-px bg-[#a1a1a1]'></Skeleton>
          <Skeleton className='w-8 h-8 mx-4 bg-[#a1a1a1]'></Skeleton>
          <Skeleton className='w-16 h-px bg-[#a1a1a1]'></Skeleton>
        </div>
        <Skeleton className='h-10 w-48 mx-auto mb-4 bg-[#a1a1a1]'></Skeleton>
        <Skeleton className='h-5 w-96 max-w-full mx-auto bg-[#a1a1a1]'></Skeleton>
      </div>

      {/* Tags Grid Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(6)].map((_, index) => (
          <div key={index} className='border-2 border-[#a1a1a1]'>
            <div className='bg-[#a1a1a1] p-4'>
              <Skeleton className='h-8 w-16 bg-white'></Skeleton>
            </div>
            <div className='p-4 space-y-3'>
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className='flex items-center py-3 hover:bg-gray-50'
                >
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-24 bg-[#a1a1a1]'></Skeleton>
                    <Skeleton className='h-4 w-10 bg-[#a1a1a1]'></Skeleton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
