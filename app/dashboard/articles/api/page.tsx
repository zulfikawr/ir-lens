import React from 'react';
import NewsApiPage from '@/components/Dashboard/api/NewsApi';

export const metadata = {
  title: 'News API | IR Lens',
  description: 'Browse from News API',
};

export default function NewsApi() {
  return <NewsApiPage />;
}
