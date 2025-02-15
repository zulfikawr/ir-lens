'use client';

import { Article } from '@/types/article';
import { ArticleHeader } from './ArticleHeader';
import { ContentBlocks } from '../ArticleEditor/ContentBlocks';
import { ArticleSidebar } from './ArticleSidebar';
import ScrollToTop from '@/components/ScrollToTop';

interface ArticleLayoutProps {
  articleData: {
    current: Article;
    related: Article[];
  };
}

export function ArticleLayout({ articleData }: ArticleLayoutProps) {
  const { current, related } = articleData;

  return (
    <main className='mx-auto px-4 md:px-8 py-16'>
      <div className='flex flex-col items-center lg:items-start lg:flex-row lg:justify-center'>
        <div className='w-full max-w-3xl lg:w-3/4 lg:pr-6 md:border-r md:border-black'>
          <div className='mx-auto'>
            <ArticleHeader article={current} />
            <ContentBlocks blocks={current.blocks} />
          </div>
          <ScrollToTop />
        </div>
        <aside className='mt-16 md:mt-0 md:w-1/4 md:max-w-[300px] md:pl-6'>
          <ArticleSidebar
            currentArticle={current}
            relatedArticles={related
              .filter(
                (article) =>
                  article.slug !== current.slug && article.tag === current.tag,
              )
              .slice(0, 10)}
          />
        </aside>
      </div>
    </main>
  );
}
