import { Skeleton } from '@/components/ui/skeleton';

export default function PageTitleLoading() {
  return (
    <div className='mb-16 text-center'>
      <div className='flex items-center justify-center mb-6'>
        <Skeleton className='w-16 h-px bg-[#a1a1a1]' />
        <Skeleton className='w-8 h-8 mx-4 bg-[#a1a1a1]' />
        <Skeleton className='w-16 h-px bg-[#a1a1a1]' />
      </div>
      <Skeleton className='h-10 w-48 mx-auto mb-6 bg-[#a1a1a1]' />
      <Skeleton className='h-5 w-96 max-w-full mx-auto bg-[#a1a1a1]' />
    </div>
  );
}
