import { Suspense } from 'react';
import type { Metadata } from 'next';
import Loading from '@/components/Region/[region]/loading';
import Region from '@/components/Region/[region]/region';

type Props = {
  params: Promise<{
    region: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;

  return {
    title: `${region} | IR Lens`,
    description: `Articles from the "${region}"`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Region region={region} />
      </Suspense>
    </main>
  );
}
