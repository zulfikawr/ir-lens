'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Hash } from 'lucide-react';
import Pagination from '@/components/Pagination';
import ArticleCard from '@/components/Home/ArticleCard';
import PageTitle from '@/components/PageTitle/PageTitle';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ArticleType } from '@/types/article';
import { useArticleContext } from '@/hooks/useArticleContext';

export default function Tag({ tag }: { tag: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { articlesByTag } = useArticleContext();

  const articles = articlesByTag[tag] || [];

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [searchParams]);

  if (articles.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center text-center'>
        <p className='text-lg font-semibold'>
          No articles found for tag: <strong>{tag}</strong>
        </p>
        <Link
          href='/tags'
          className='mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-200'
        >
          Back to all tags
        </Link>
      </div>
    );
  }

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/tags/${tag}?page=${page}`);
  };

  return (
    <div ref={sectionRef} className='mx-auto px-4 md:px-8 py-16'>
      <PageTitle
        icon={<Hash />}
        title={tag}
        description={`${articles.length} ${articles.length === 1 ? 'article' : 'articles'} tagged with "${tag}"`}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'>
        {currentArticles.map((article) => (
          <div key={article.slug} className='relative h-[250px] w-full mx-auto'>
            <ArticleCard
              article={article}
              cardIndex={0}
              activeIndex={0}
              isStatic
            />
          </div>
        ))}
      </div>

      <div className='mt-16'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          scrollOffset={40}
          targetRef={sectionRef}
        />
      </div>
    </div>
  );
}
