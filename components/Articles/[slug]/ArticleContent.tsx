'use client';

import { ArticleType } from '@/types/article';
import { ArticleHeader } from './ArticleHeader';
import { ContentBlocks } from '../editor/ContentBlocks';
import ScrollToTop from '@/components/ScrollToTop';

export function ArticleContent({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <>
      <div className='mx-auto'>
        <ArticleHeader article={article} />

        <ContentBlocks blocks={article.blocks} />
      </div>
      <ScrollToTop />
    </>
  );
}
