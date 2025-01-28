import HomeSection from '@/components/Home/Home';

export const metadata = {
  title: 'Home | IR Lens',
  description: 'Articles and News from the International Relations Scene',
};

export default function Home() {
  return (
    <main className='px-4 md:px-8'>
      <div className='text-center mt-6 md:mt-10'>
        <h1 className='text-6xl font-bold mb-2'>IR Lens</h1>
        <p className='text-gray-600 italic'>
          Articles and News from the International Relations Scene
        </p>
      </div>

      <HomeSection />
    </main>
  );
}
