import Articles from '@/components/Article/Articles';
import Loading from '@/components/Article/loading';
import { Suspense } from 'react';

export const metadata = {
  title: 'Articles | IR Lens',
  description: 'List of Articles',
};

export default function ArticlesPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Articles />
      </Suspense>
    </main>
  );
}
