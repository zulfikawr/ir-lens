import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen max-w-4xl mx-auto px-4 md:px-8 my-12 md:my-16'>
      {/* Header Skeleton */}
      <div className='mb-20 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <Skeleton className='w-16 h-px bg-black' />
          <Skeleton className='w-8 h-8 mx-4 bg-black' />
          <Skeleton className='w-16 h-px bg-black' />
        </div>
        <Skeleton className='h-10 w-48 mx-auto mb-4 bg-black' />
        <Skeleton className='h-5 w-96 max-w-full mx-auto bg-gray-700' />
      </div>

      {/* Tags List Skeleton */}
      <div className='border-t-2 border-black'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='block border-b-2 border-black py-4 px-6 flex items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-24 bg-black' />
              <Skeleton className='h-5 w-10 bg-gray-700' />
            </div>
            <Skeleton className='h-4 w-4 bg-black' />
          </div>
        ))}
      </div>
    </div>
  );
}
