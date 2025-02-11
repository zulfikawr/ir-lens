'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import Pagination from '@/components/Pagination';
import ArticleCard from '@/components/Home/ArticleCard';
import PageTitle from '@/components/PageTitle/PageTitle';
import { useSearchParams, useRouter } from 'next/navigation';
import { useArticleContext } from '@/hooks/useArticleContext';

export default function Region({ region }: { region: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { articlesByRegion } = useArticleContext();

  const articles = articlesByRegion[region] || [];

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
          No articles found for region: <strong>{region}</strong>
        </p>
        <Link
          href='/region'
          className='mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-200'
        >
          Back to all regions
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
    router.push(`/region/${region}?page=${page}`);
  };

  return (
    <div ref={sectionRef} className='mx-auto px-4 md:px-8 py-16'>
      <PageTitle
        icon={<Globe />}
        title={region}
        description={`${articles.length} ${articles.length === 1 ? 'article' : 'articles'} from the "${region}"`}
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
