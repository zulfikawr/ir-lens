import { getArticles, getArticleBySlug } from '@/lib/database';
import ArticleDetailsPage from '@/components/Article/ArticleView';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArticleLoading from '@/components/Article/ArticleView/ArticleLoading';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => {
    const date = new Date(article.date);

    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
      slug: article.slug,
    };
  });
}

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
