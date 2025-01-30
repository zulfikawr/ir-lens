import { useArticleContext } from '@/hooks/useArticleContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Pagination from '../../Pagination';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

const RegionalFocus = () => {
  const { data } = useArticleContext();
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);

  const regions = ['Asia', 'Europe', 'Middle East', 'Africa', 'Americas'];
  const articlesPerPage = 5;

  const filteredArticles = data
    .filter((article) => article.labels.includes(selectedRegion))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage,
  );

  return (
    <section className='my-8 sm:my-12 md:my-16' ref={sectionRef}>
      <div className='border-t border-black py-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4'>
          <h2 className='text-3xl font-bold bg-black px-4 py-2 text-white'>
            Regional Focus
          </h2>
          <div className='flex flex-wrap gap-1 sm:gap-2 text-sm md:text-base'>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-black transition duration-300
                  ${
                    region === selectedRegion
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className='text-center py-8 sm:py-10 md:py-12 border border-black'>
          <p className='text-lg sm:text-xl'>
            No articles available for {selectedRegion}
          </p>
        </div>
      ) : (
        <div className='space-y-6 sm:space-y-8 md:space-y-12'>
          {paginatedArticles.map((article) => (
            <article key={article.title} className='group'>
              <div className='grid md:grid-cols-[0.4fr_1fr] gap-4 sm:gap-6 md:gap-8'>
                <Link
                  href={`articles/${article.slug}`}
                  className='block overflow-hidden'
                >
                  <Image
                    className='w-full h-56 md:h-64 object-cover transition-all duration-500 grayscale hover:grayscale-0'
                    src={article.coverImage}
                    alt={article.coverImageAlt}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    width={1488}
                    height={992}
                  />
                </Link>
                <div className='flex flex-col justify-between'>
                  <div className='space-y-2 sm:space-y-3'>
                    <div className='flex flex-wrap gap-1 sm:gap-2'>
                      {article.labels.map((label, idx) => (
                        <Link key={idx} href={`/tags/${label}`}>
                          <Button size='sm' className='text-xs md:text-sm'>
                            {label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                    <h2 className='text-xl md:text-2xl font-bold hover:underline transition duration-200'>
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className='text-gray-600 text-sm sm:text-base leading-tight'>
                      {article.description}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500'>
                    <div className='flex items-center gap-1 sm:gap-2'>
                      <Calendar className='w-3 h-3 sm:w-4 sm:h-4' />
                      <time dateTime={article.date}>{article.date}</time>
                    </div>
                    <div className='flex items-center gap-1 sm:gap-2'>
                      <MapPin className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span>{article.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='border-b border-gray-200 mt-6 sm:mt-8 md:mt-12' />
            </article>
          ))}
        </div>
      )}

      <div className='mt-6 sm:mt-8'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollOffset={40}
          targetRef={sectionRef}
        />
      </div>

      <div className='flex justify-center mt-6 sm:mt-8'>
        <Link href={`/regions/${selectedRegion.toLowerCase()}`}>
          <button className='bg-black text-white hover:bg-white hover:text-black border hover:border-black px-3 sm:px-4 py-1 sm:py-2 transition-colors'>
            See all {selectedRegion} articles
          </button>
        </Link>
      </div>
    </section>
  );
};

export default RegionalFocus;
