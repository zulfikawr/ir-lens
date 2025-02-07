'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getArticles } from '@/lib/database';
import type { ArticleType } from '@/types/article';

const ArticleStats = () => {
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const [monthlyStats, setMonthlyStats] = useState<
    Array<{ name: string; articles: number }>
  >([]);
  const [averageLength, setAverageLength] = useState(0);
  const [headlineCount, setHeadlineCount] = useState(0);
  const [regionsStats, setRegionsStats] = useState<Record<string, number>>({});
  const [tagsStats, setTagsStats] = useState<Record<string, number>>({});
  const [recentArticles, setRecentArticles] = useState<ArticleType['articles']>(
    [],
  );

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);

      // Calculate monthly statistics
      const stats = fetchedArticles.reduce(
        (acc: Record<string, number>, article) => {
          const month = new Date(article.date).toLocaleString('default', {
            month: 'short',
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        },
        {},
      );

      setMonthlyStats(
        Object.entries(stats).map(([name, count]) => ({
          name,
          articles: count,
        })),
      );

      // Calculate average article length
      const totalLength = fetchedArticles.reduce(
        (sum, article) => sum + article.description.length,
        0,
      );
      setAverageLength(totalLength / fetchedArticles.length);

      // Count articles with headlines
      setHeadlineCount(
        fetchedArticles.filter((article) => article.headline).length,
      );

      // Calculate region distribution
      const regions = fetchedArticles.reduce(
        (acc: Record<string, number>, article) => {
          acc[article.region] = (acc[article.region] || 0) + 1;
          return acc;
        },
        {},
      );
      setRegionsStats(regions);

      // Calculate tag distribution
      const tags = fetchedArticles.reduce(
        (acc: Record<string, number>, article) => {
          acc[article.tag] = (acc[article.tag] || 0) + 1;
          return acc;
        },
        {},
      );
      setTagsStats(tags);

      // Get recent articles (limit to 5)
      setRecentArticles(fetchedArticles.slice(0, 5));
    };

    fetchArticles();
  }, []);

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Total Articles</div>
          <div className='text-2xl font-semibold'>{articles.length}</div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Regions Covered</div>
          <div className='text-2xl font-semibold'>
            {new Set(articles.map((a) => a.region)).size}
          </div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Tags Used</div>
          <div className='text-2xl font-semibold'>
            {new Set(articles.map((a) => a.tag)).size}
          </div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Average Article Length</div>
          <div className='text-2xl font-semibold'>
            {averageLength.toFixed(2)} characters
          </div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Articles with Headlines</div>
          <div className='text-2xl font-semibold'>
            {headlineCount} (
            {((headlineCount / articles.length) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Grid for Articles by Region and Tags Frequency */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Articles by Region */}
        <div className='border border-gray-200 p-6 shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Articles by Region</h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={Object.entries(regionsStats)
                  .map(([region, count]) => ({ name: region, value: count }))
                  .sort((a, b) => b.value - a.value)}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius='80%'
              >
                {Object.entries(regionsStats).map(([region, count], index) => {
                  const grayScale = Math.floor(
                    255 -
                      (count / Math.max(...Object.values(regionsStats))) * 155,
                  );
                  const fillColor = `rgb(${grayScale}, ${grayScale}, ${grayScale})`;
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tags Frequency */}
        <div className='border border-gray-200 p-6 shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Tag Frequency</h2>
          <ul className='space-y-2'>
            {Object.entries(tagsStats).map(([tag, count]) => (
              <li key={tag} className='flex justify-between'>
                <span className='font-medium'>{tag}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Monthly Article Trends Chart */}
      <div className='border border-gray-200 p-6 shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Monthly Article Trends</h2>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={monthlyStats}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='articles'
              stroke='#000'
              name='Articles Published'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Articles */}
      <div className='border border-gray-200 p-6 shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Recent Articles</h2>
        <ul className='space-y-2'>
          {recentArticles.map((article) => (
            <li key={article.slug} className='border-b border-gray-200 py-2'>
              <a
                href={`/dashboard/articles/${article.slug}`}
                className='text-lg font-semibold text-blue-600 hover:underline'
              >
                {article.title}
              </a>
              <p className='text-sm text-gray-500'>
                {new Date(article.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticleStats;
