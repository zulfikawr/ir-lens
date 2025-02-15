'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getArticleUrl } from '@/utils/articleLinks';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import { useArticleContext } from '@/hooks/useArticleContext';

const ArticleStats = () => {
  const { sortedArticles, articlesByTag, articlesByRegion } =
    useArticleContext();
  const [timeFrame, setTimeFrame] = useState<'daily' | 'monthly' | 'yearly'>(
    'monthly',
  );
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const recentArticles = useMemo(() => {
    return sortedArticles.slice(0, 5);
  }, [sortedArticles]);

  // Get top viewed articles (filtered by selectedTag if necessary)
  const topViewedArticles = useMemo(() => {
    const filteredArticles =
      selectedTag === 'All'
        ? [...sortedArticles]
        : [...(articlesByTag[selectedTag] || [])];

    return filteredArticles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((article) => ({
        title:
          article.title.length > 30
            ? article.title.substring(0, 30) + '...'
            : article.title,
        views: article.views || 0,
      }));
  }, [sortedArticles, selectedTag, articlesByTag]);

  // Calculate published articles by time frame
  const publishedArticles = useMemo(() => {
    const publishedArticlesData = sortedArticles.reduce(
      (acc: Record<string, number>, article) => {
        const date =
          timeFrame === 'daily'
            ? new Date(article.date).toLocaleDateString()
            : timeFrame === 'monthly'
              ? new Date(article.date).toLocaleDateString('default', {
                  month: 'long',
                  year: 'numeric',
                })
              : new Date(article.date).getFullYear().toString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(publishedArticlesData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sortedArticles, timeFrame]);

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Total Articles</div>
          <div className='text-2xl font-semibold'>{sortedArticles.length}</div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Regions</div>
          <div className='text-2xl font-semibold'>
            {Object.keys(articlesByRegion).length}
          </div>
        </div>
        <div className='border border-gray-200 p-4 shadow-sm'>
          <div className='text-sm text-gray-600'>Tags</div>
          <div className='text-2xl font-semibold'>
            {Object.keys(articlesByTag).length}
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
                data={Object.entries(articlesByRegion)
                  .map(([region, articles]) => ({
                    name: region,
                    value: articles.length,
                  }))
                  .sort((a, b) => b.value - a.value)}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius='80%'
              >
                {Object.entries(articlesByRegion)
                  .sort(([, a], [, b]) => b.length - a.length)
                  .map(([region], index, arr) => {
                    const opacity = 1 - (index / arr.length) * 0.8;
                    return (
                      <Cell key={region} fill={`rgba(0, 0, 0, ${opacity})`} />
                    );
                  })}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tags Frequency */}
        <div className='border border-gray-200 p-6 shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Tag Frequency</h2>
          <ul className='space-y-2'>
            {Object.entries(articlesByTag).map(([tag, articles]) => (
              <li key={tag} className='flex justify-between'>
                <span className='font-medium'>{tag}</span>
                <span>{articles.length}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Most Viewed Articles Graph */}
      <div className='border border-gray-200 p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Most Viewed Articles</h2>
          <Select
            value={selectedTag}
            onValueChange={(value) => setSelectedTag(value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select tag' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All</SelectItem>
              <SelectItem value='economy'>Economy</SelectItem>
              <SelectItem value='diplomacy'>Diplomacy</SelectItem>
              <SelectItem value='conflicts'>Conflicts</SelectItem>
              <SelectItem value='climate'>Climate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={topViewedArticles} layout='vertical' barGap={8}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' />
            <YAxis type='category' dataKey='title' width={200} />
            <Tooltip />
            <Bar dataKey='views' fill='#333' barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Published Article Graph */}
      <div className='border border-gray-200 p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Published Articles</h2>
          <Select
            value={timeFrame}
            onValueChange={(value) =>
              setTimeFrame(value as 'daily' | 'monthly' | 'yearly')
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select time frame' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='daily'>Daily</SelectItem>
              <SelectItem value='monthly'>Monthly</SelectItem>
              <SelectItem value='yearly'>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={publishedArticles}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='count'
              stroke='#000'
              fill='#000'
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Articles */}
      <div className='border border-gray-200 p-6 shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Recent Articles</h2>
        <ul className='space-y-2'>
          {recentArticles.map((article, index) => (
            <li
              key={article.slug}
              className={`py-2 ${index !== recentArticles.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <a
                href={getArticleUrl(article)}
                target='_blank'
                className='text-lg font-semibold hover:underline'
              >
                {article.title}
              </a>
              <p className='text-sm text-gray-500'>{article.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default withAdminAuth(ArticleStats);
