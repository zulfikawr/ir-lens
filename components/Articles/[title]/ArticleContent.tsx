'use client';

import { ArticleType } from '@/types/article';
import { RichContentBlock } from './RichContentBlock';
import { ArticleHeader } from './ArticleHeader';
import ScrollToTop from '@/components/ScrollToTop';

export function ArticleContent({
  article,
}: {
  article: ArticleType['articles'][0];
}) {
  return (
    <div className='mb-16'>
      <ArticleHeader article={article} />

      <div className='prose prose-lg'>
        {article.blocks.map((block, index) => (
          <RichContentBlock key={index} block={block} />
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
}
