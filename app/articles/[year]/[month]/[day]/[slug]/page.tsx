import { getArticleBySlug } from '@/lib/database';
import ArticleDetailsPage from '@/components/Article/ArticleView';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArticleLoading from '@/components/Article/ArticleView/ArticleLoading';
import { notFound } from 'next/navigation';

type Params = {
  year: string;
  month: string;
  day: string;
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found | IR Lens',
      description: 'The article you are looking for does not exist.',
    };
  }

  return {
    title: `${article.title} | IR Lens`,
    description: article.description || 'Read this article on IR Lens.',
  };
}

async function ArticleLoader({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return notFound();
  }

  return <ArticleDetailsPage />;
}

export default function Page({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleLoader params={params} />
    </Suspense>
  );
}
