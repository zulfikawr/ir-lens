import Region from '@/components/Region/Region';
import Loading from '@/components/Region/loading';
import { Suspense } from 'react';

export const metadata = {
  title: 'Regions | IR Lens',
  description: 'List of Regions',
};

export default function RegionPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Region />
      </Suspense>
    </main>
  );
}
