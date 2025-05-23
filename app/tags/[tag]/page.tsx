import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/database';
import Tag from '@/components/Tags/[tag]/[tag]';
import Loading from '@/components/Tags/[tag]/loading';

type Props = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `${tag} | IR Lens`,
    description: `Articles tagged with "${tag}"`,
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();

  const uniqueTags = Array.from(
    new Set(articles.map((article) => article.tag)),
  );

  return uniqueTags.map((tag) => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Tag tag={tag} />
      </Suspense>
    </main>
  );
}
