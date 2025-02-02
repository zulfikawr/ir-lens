import Link from 'next/link';

export const metadata = {
  title: 'Page not found | IR News',
  description: 'Page does not exist',
};

export default function NotFound() {
  return (
    <main className='container min-h-screen mx-auto px-4 md:px-0 flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='font-bold text-5xl md:text-7xl mb-6'>Not Found</h1>
        <h2 className='mb-6'>
          The page you&apos;re looking for does not exist. Click{' '}
          <Link className='font-semibold hover:underline' href='/'>
            here to return home
          </Link>
        </h2>
      </div>
    </main>
  );
}
