// app/search/SearchResults.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { Article } from '@/types/article';
import Pagination from '@/components/Pagination';
import ArticleCard from '@/components/Home/ArticleCard';
import PageTitle from '@/components/PageTitle/PageTitle';
import Loading from '@/components/Article/loading';

interface SearchResultsProps {
  initialArticles: Article[];
}

export default function SearchResults({ initialArticles }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  if (!initialArticles.length) {
    return <Loading />;
  }

  const decodedQuery = query.toLowerCase();

  const searchResults = initialArticles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(decodedQuery);
    const descriptionMatch = article.description
      .toLowerCase()
      .includes(decodedQuery);
    return titleMatch || descriptionMatch;
  });

  if (searchResults.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center text-center px-4'>
        <p className='text-lg font-semibold'>
          No articles found for: <strong>&quot;{decodedQuery}&quot;</strong>
        </p>
        <Link
          href='/'
          className='mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-200'
        >
          Back to home
        </Link>
      </div>
    );
  }

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = searchResults.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(searchResults.length / articlesPerPage);

  return (
    <div ref={sectionRef} className='mx-auto px-4 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<Search />}
        title='Search Results'
        description={`${searchResults.length} ${
          searchResults.length === 1 ? 'article' : 'articles'
        } found for "${decodedQuery}"`}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {currentArticles.map((article) => (
          <div key={article.slug} className='relative h-[250px] w-full mx-auto'>
            <ArticleCard article={article} cardIndex={0} activeIndex={0} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        scrollOffset={40}
        targetRef={sectionRef}
      />
    </div>
  );
}
