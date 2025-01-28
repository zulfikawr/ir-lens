import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarLoading() {
  return (
    <div className='sticky top-8'>
      <div className='p-6 mt-5 mb-8 border border-black shadow-sm'>
        <Skeleton className='h-8 w-48 mb-6 bg-[#a1a1a1]' />
        <div className='w-full h-px bg-black mb-6' />
        <div className='space-y-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='flex items-start gap-4'>
              <div className='w-20 h-20 flex-shrink-0'>
                <Skeleton className='w-full h-full bg-[#a1a1a1]' />
              </div>
              <div className='w-full'>
                <div className='flex items-center justify-between mb-1'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-16 bg-black' />
                  </div>
                  <Skeleton className='h-4 w-20 bg-[#a1a1a1]' />
                </div>
                <Skeleton className='h-6 w-full bg-[#a1a1a1]' />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-black text-white p-6'>
        <Skeleton className='h-8 w-32 mb-4 bg-[#a1a1a1]' />
        <div className='w-full h-px bg-white mb-4' />
        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='flex items-center justify-between'>
              <Skeleton className='h-6 w-24 bg-[#a1a1a1]' />
              <Skeleton className='h-6 w-6 bg-white' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
