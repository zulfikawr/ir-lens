import { Skeleton } from '@/components/ui/skeleton';

export default function NewsletterSubscriptionLoading() {
  return (
    <section className='my-16 pb-16'>
      <div className='w-full max-w-5xl mx-auto'>
        <div className='flex items-center mb-12'>
          <div className='flex-1 h-px bg-black' />
          <Skeleton className='mx-8 w-8 h-8 bg-[#a1a1a1]' />
          <div className='flex-1 h-px bg-black' />
        </div>

        <div className='text-center mb-8'>
          <Skeleton className='h-8 w-48 mx-auto mb-4 bg-[#a1a1a1]' />
          <Skeleton className='h-6 w-3/4 mx-auto mb-2 bg-[#a1a1a1]' />
          <Skeleton className='h-6 w-2/3 mx-auto bg-[#a1a1a1]' />
        </div>

        <div className='max-w-xl mx-auto'>
          <div className='flex'>
            <Skeleton className='flex-1 p-4 h-12 bg-[#a1a1a1]' />
            <Skeleton className='px-8 h-12 bg-[#a1a1a1]' />
          </div>

          <div className='mt-8 space-y-2'>
            <Skeleton className='h-4 w-3/4 mx-auto bg-[#a1a1a1]' />
            <Skeleton className='h-4 w-24 mx-auto bg-[#a1a1a1]' />
          </div>
        </div>
      </div>
    </section>
  );
}
