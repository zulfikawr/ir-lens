'use client';

import { useArticleContext } from '@/hooks/useArticleContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useMemo } from 'react';
import Pagination from '@/components/Pagination';
import { Calendar, Book, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import Loading from './loading';

export default function ExperimentalNewspaper() {
  const { data } = useArticleContext();
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return <Loading />;
  }

  const articlesPerPage = 10;

  const allArticles = data
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = allArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <div ref={sectionRef} className='mx-auto px-4 md:px-8 py-16'>
      {/* Header Section */}
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-16 h-px bg-black'></div>
          <Book className='mx-4 w-8 h-8' />
          <div className='w-16 h-px bg-black'></div>
        </div>
        <h1 className='text-4xl font-bold mb-4 capitalize'>Articles</h1>
        <p className='text-gray-600'>
          Showing {indexOfLastArticle} of {allArticles.length} articles
        </p>
      </div>

      {/* Articles List */}
      <div className='space-y-12'>
        {currentArticles.map((article, _index) => (
          <article key={article.title} className='group'>
            <div className='grid md:grid-cols-[0.4fr_1fr] gap-8'>
              <Link
                href={`articles/${article.slug}`}
                className='block overflow-hidden'
              >
                <Image
                  className='w-full h-64 md:h-full object-cover transition-all duration-300 group-hover:brightness-90'
                  src={article.coverImage}
                  alt={article.coverImageAlt}
                  width={1488}
                  height={992}
                />
              </Link>
              <div className='flex flex-col justify-between'>
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-2'>
                    {article.labels.map((label, idx) => (
                      <Link key={idx} href={`/tags/${label}`}>
                        <Button>{label}</Button>
                      </Link>
                    ))}
                  </div>
                  <h2 className='text-2xl font-bold hover:underline transition duration-200'>
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className='text-gray-600 leading-relaxed'>
                    {article.description}
                  </p>
                </div>
                <div className='flex flex-wrap gap-6 mt-6 text-sm text-gray-500'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <time dateTime={article.date}>{article.date}</time>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4' />
                    <span>{article.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-b border-gray-200 mt-12' />
          </article>
        ))}
      </div>

      {/* Pagination */}
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
