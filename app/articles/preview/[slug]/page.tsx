'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { ArticlePreview } from '@/components/Articles/preview/ArticlePreview';
import type { ArticleType } from '@/types/article';

export default function ArticleSlugPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<ArticleType['articles'][0] | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.articleData) {
      setArticle(window.articleData);
    } else {
      console.warn('No article data found for preview.');
    }
  }, []);

  if (!article) {
    return (
      <div className='min-h-screen flex justify-center'>
        Loading preview for {slug}...
      </div>
    );
  }

  return (
    <main className='py-16'>
      <ArticlePreview article={article} />
    </main>
  );
}
