import Tags from '@/components/Tags/Tags';
import Loading from '@/components/Tags/loading';
import { Suspense } from 'react';

export const metadata = {
  title: 'Tags | IR Lens',
  description: 'List of Tags',
};

export default function TagsPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Tags />
      </Suspense>
    </main>
  );
}
