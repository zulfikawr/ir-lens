'use client';

import { ArticleType } from '@/types/article';
import { ArticleHeader } from './ArticleHeader';
import { ContentBlocks } from '../editor/ContentBlocks';
import ScrollToTop from '@/components/ScrollToTop';

export function ArticlePage({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <div className='mb-16'>
      <div className='md:max-w-3xl mx-auto'>
        <ArticleHeader article={article} />

        <ContentBlocks blocks={article.blocks} />
      </div>
      <ScrollToTop />
    </div>
  );
}
