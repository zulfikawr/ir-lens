'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getArticles } from '@/functions/getArticles';
import Loading from '../loading';

export default function NewsTicker() {
  const [articles, setArticles] = useState<{ title: string; slug: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const newsText = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedArticles = await getArticles();
      setArticles(
        fetchedArticles.map((article) => ({
          title: article.title,
          slug: article.slug,
        })),
      );
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // Animate news ticker
  useEffect(() => {
    if (!newsText.current || !containerRef.current || articles.length === 0)
      return;

    const ticker = newsText.current;
    const clonedContent = ticker.innerHTML;
    ticker.innerHTML += clonedContent;

    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const speed = 75;
      const translateX = -(elapsed * speed) / 1000;
      if (Math.abs(translateX) >= ticker.scrollWidth / 2) {
        start = timestamp;
      }
      ticker.style.transform = `translateX(${translateX}px)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      ticker.style.transform = '';
      ticker.innerHTML = clonedContent;
    };
  }, [articles]);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime(); // Set initial time
    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  if (loading) return <Loading />;

  return (
    <div
      ref={containerRef}
      className='flex bg-black text-white py-5 w-full mx-auto relative overflow-hidden items-center'
    >
      <div
        ref={newsText}
        className='flex gap-4 sliding-ticker whitespace-nowrap flex-grow'
      >
        {articles.map((article, index) => (
          <div key={index} className='hover:underline'>
            <Link href={`/articles/${article.slug}`} passHref>
              <p className='cursor-pointer'>{article.title} +++</p>
            </Link>
          </div>
        ))}
      </div>
      <div className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black border-l border-white px-4'>
        <time className='whitespace-nowrap font-mono'>{currentTime}</time>
      </div>
    </div>
  );
}
