import Articles from '@/components/Articles/Articles';
import Loading from '@/components/Articles/loading';
import { Suspense } from 'react';

export const metadata = {
  title: 'Articles  | IR Lens',
  description: 'List of Articles',
};

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Articles initialPage={initialPage} />
      </Suspense>
    </main>
  );
}
