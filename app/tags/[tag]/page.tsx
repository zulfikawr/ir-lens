'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useArticleContext } from '@/hooks/useArticleContext';
import { useRef, useState } from 'react';
import { Hash } from 'lucide-react';
import Loading from '@/components/Tags/[tag]/loading';
import Pagination from '@/components/Pagination';
import ArticleCard from '@/components/Home/ArticleCard';
import PageTitle from '@/components/PageTitle';

export default function TagPage() {
  const { tag } = useParams();
  const { data } = useArticleContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  if (!data.length) {
    return <Loading />;
  }

  const filteredArticles = data.filter((article) => {
    return article.tag === tag;
  });

  if (filteredArticles.length === 0) {
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
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <div ref={sectionRef} className='mx-auto px-4 md:px-8 py-16'>
      <PageTitle
        icon={<Hash />}
        title={typeof tag === 'string' ? tag : 'Unknown Tag'}
        description={`${filteredArticles.length} ${filteredArticles.length === 1 ? 'article' : 'articles'} tagged with "${tag}"`}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {currentArticles.map((article, index) => (
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
