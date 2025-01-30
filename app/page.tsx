import HomeSection from '@/components/Home/Home';

export const metadata = {
  title: 'Home | IR Lens',
  description: 'Articles and News from the International Relations Scene',
};

export default function Home() {
  return (
    <main className='px-4 md:px-8'>
      <div className='text-center my-8 md:my-16'>
        <div className='flex items-center justify-center gap-2 md:gap-4'>
          <div className='w-16 h-px bg-black'></div>
          <h1 className='text-6xl md:text-7xl font-bold mb-2'>IR Lens</h1>
          <div className='w-16 h-px bg-black'></div>
        </div>
        <p className='text-gray-600 italic'>
          Articles and News from the International Relations Scene
        </p>
      </div>

      <HomeSection />
    </main>
  );
}
