'use client';

import { useArticleContext } from '@/hooks/useArticleContext';
import { useRef, useState, useMemo } from 'react';
import Pagination from '@/components/Pagination';
import { Book } from 'lucide-react';
import Loading from './loading';
import ArticleCard from '../Home/ArticleCard';

const ArticlesPage = () => {
  const { data } = useArticleContext();
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const articlesPerPage = 9;

  const allArticles = useMemo(
    () =>
      data
        .flat()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [data],
  );

  if (!allArticles.length) {
    return <Loading />;
  }

  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = allArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <section ref={sectionRef} className='px-4 md:px-8 my-8 sm:my-12 md:my-16'>
      {/* Header Section */}
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-16 h-px bg-black'></div>
          <Book className='mx-4 w-8 h-8' />
          <div className='w-16 h-px bg-black'></div>
        </div>
        <h1 className='text-4xl font-bold mb-4 capitalize'>Articles</h1>
        <p className='text-gray-600'>
          Showing {indexOfFirstArticle + 1}-
          {Math.min(indexOfLastArticle, allArticles.length)} of{' '}
          {allArticles.length} articles
        </p>
      </div>

      {/* Articles Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {currentArticles.map((article, index) => (
          <div key={article.slug} className='relative h-[250px] w-full mx-auto'>
            <ArticleCard article={article} cardIndex={0} activeIndex={0} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='mt-16'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollOffset={40}
          targetRef={sectionRef}
        />
      </div>
    </section>
  );
};

export default ArticlesPage;
