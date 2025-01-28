import Link from 'next/link';

export const metadata = {
  title: 'Page not found | IR News',
  description: 'Page does not exist',
};

export default function NotFound() {
  return (
    <main className='container mx-auto px-4 md:px-0 py-8 md:py-12'>
      <div>
        <h1 className='w-full text-center font-bold text-[120px] mt-4 mb-6'>
          Not Found
        </h1>
        <h2 className='w-full text-center mb-6'>
          The page you&apos;re looking for does not exist. Click{' '}
          <Link className='font-semibold hover:underline' href='/'>
            here to return home
          </Link>
        </h2>
      </div>
    </main>
  );
}
