'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useArticleContext } from '@/hooks/useArticleContext';
import { useRef, useState } from 'react';
import { Hash, MapPin, Calendar } from 'lucide-react';
import Loading from '@/components/Tags/[tag]/loading';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';

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
    if (Array.isArray(article.labels)) {
      return article.labels.some((label) => label === tag);
    } else if (typeof article.labels === 'string') {
      return article.labels === tag;
    }
    return false;
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
      {/* Header Section */}
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-16 h-px bg-black'></div>
          <Hash className='mx-4 w-8 h-8' />
          <div className='w-16 h-px bg-black'></div>
        </div>
        <h1 className='text-4xl font-bold mb-4 capitalize'>{tag}</h1>
        <p className='text-gray-600'>
          {filteredArticles.length}{' '}
          {filteredArticles.length === 1 ? 'article' : 'articles'} tagged with
          &quot;{tag}&quot;
        </p>
      </div>

      {/* Articles List */}
      <div className='space-y-12'>
        {currentArticles.map((article, index) => (
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
