import { getArticleBySlug } from '@/functions/getArticleBySlug';
import { getArticles } from '@/functions/getArticles';
import { ArticlePage } from '@/components/Articles/[title]/ArticlePage';
import { ArticleSidebar } from '@/components/Articles/[title]/ArticleSidebar';
import ArticleLoading from '@/components/Articles/[title]/ArticleLoading';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await params;
  const article = await getArticleBySlug(title);

  return {
    title: article ? `${article.title} | IR Lens` : 'Article Not Found',
  };
}

async function ArticleDetailsContent({ params }: Props) {
  const { title } = await params;
  const articles = await getArticles();
  const article = await getArticleBySlug(title);

  if (!article) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Article Not Found</h2>
          <Link href='/articles' className='text-black hover:underline'>
            Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 max-w-screen-xl'>
      <div className='py-16 flex flex-col items-center lg:items-start lg:flex-row lg:justify-center'>
        <div className='w-full max-w-3xl lg:w-3/4 lg:pr-6'>
          <ArticlePage article={article} />
        </div>
        <ArticleSidebar articles={articles} currentArticle={article} />
      </div>
    </main>
  );
}

export default async function ArticleDetails({ params }: Props) {
  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleDetailsContent params={params} />
    </Suspense>
  );
}
