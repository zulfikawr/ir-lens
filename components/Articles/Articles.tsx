'use client';

import { useArticleContext } from '@/hooks/useArticleContext';
import { useRef, useState, useMemo, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import { Book } from 'lucide-react';
import Loading from './loading';
import ArticleCard from '../Home/ArticleCard';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTitle from '../PageTitle';

const ArticlesPage = ({ initialPage = 1 }) => {
  const { data } = useArticleContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);
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
    <section ref={sectionRef} className='px-4 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<Book />}
        title='Articles'
        description={`Showing ${indexOfFirstArticle + 1}-${Math.min(indexOfLastArticle, allArticles.length)} of ${allArticles.length} articles`}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {currentArticles.map((article, index) => (
          <div key={article.slug} className='relative h-[250px] w-full mx-auto'>
            <ArticleCard article={article} cardIndex={0} activeIndex={0} />
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

export default ArticlesPage;
