import { Skeleton } from '@/components/ui/skeleton';
import PageTitleLoading from '../PageTitleLoading';

export default function Loading() {
  return (
    <div className='mx-auto px-4 md:px-8 my-12 md:my-16'>
      {/* Header Section Skeleton */}
      <PageTitleLoading />

      {/* Articles List Skeleton */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(9)].map((_, index) => (
          <div key={index} className='relative h-[250px]'>
            <div className='space-y-4'>
              <Skeleton className='w-full h-64 bg-[#a1a1a1]' />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className='flex justify-center items-center mt-12 gap-2'>
        <Skeleton className='h-10 w-24 bg-[#a1a1a1]' />
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className='h-10 w-10 bg-[#a1a1a1]' />
        ))}
        <Skeleton className='h-10 w-24 bg-[#a1a1a1]' />
      </div>
    </div>
  );
}
