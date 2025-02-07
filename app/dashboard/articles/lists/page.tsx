import ArticleList from '@/components/dashboard/list/ArticleList';
import Loading from '@/components/Articles/loading';
import { Suspense } from 'react';

export const metadata = {
  title: 'Article List | IR Lens',
  description: 'List of Articles',
};

export default function ArticleListPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ArticleList />
      </Suspense>
    </main>
  );
}
