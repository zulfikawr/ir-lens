'use client';

import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';

interface ArticleSidebarProps {
  currentArticle: Article;
  relatedArticles: Article[];
}

export function ArticleSidebar({ relatedArticles }: ArticleSidebarProps) {
  if (relatedArticles.length === 0) return null;

  return (
    <div>
      <h3 className='text-xl text-center font-bold mb-6 bg-black text-white p-2'>
        Related Articles
      </h3>
      <div className='grid gap-6'>
        {relatedArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
