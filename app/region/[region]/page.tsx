import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/database';
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

export async function generateStaticParams() {
  const articles = await getArticles();

  const uniqueRegions = Array.from(
    new Set(articles.map((article) => article.region)),
  );

  return uniqueRegions.map((region) => ({
    region: region,
  }));
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  const articles = await getArticles();
  const filteredArticles = articles.filter(
    (article) => article.region === region,
  );

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Region region={region} articles={filteredArticles} />
      </Suspense>
    </main>
  );
}
