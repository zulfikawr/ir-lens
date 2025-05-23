'use client';

import { useArticleContext } from '@/hooks/useArticleContext';
import { useRef, useState, useMemo, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import { Book } from 'lucide-react';
import Loading from './loading';
import ArticleCard from '../Home/ArticleCard';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTitle from '../PageTitle/PageTitle';

const Articles = () => {
  const { data } = useArticleContext();
  const router = useRouter();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [searchParams]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/articles?page=${page}`);
  };

  return (
    <section ref={sectionRef} className='mx-auto px-4 md:px-8 py-16'>
      <PageTitle
        icon={<Book />}
        title='Articles'
        description={`Showing ${indexOfFirstArticle + 1}-${Math.min(indexOfLastArticle, allArticles.length)} of ${allArticles.length} articles`}
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
    </section>
  );
};

export default Articles;
