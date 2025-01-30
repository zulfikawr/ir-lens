'use client';

import { ArticleType } from '@/types/article';
import { ArticleContent } from './ArticleContent';
import { ArticleHeader } from './ArticleHeader';
import ScrollToTop from '@/components/ScrollToTop';

export function ArticlePage({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <div className='mb-16'>
      <div className='max-w-4xl mx-auto'>
        <ArticleHeader article={article} />

        {article.blocks.map((block, index) => (
          <ArticleContent key={index} block={block} />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
}
