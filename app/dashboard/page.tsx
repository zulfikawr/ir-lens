import React from 'react';
import ArticleStats from '@/components/dashboard/stats/ArticleStats';

export const metadata = {
  title: 'Dashboard | IR Lens',
  description: 'Articles statistics and graphs',
};

export default function DashboardPage() {
  return <ArticleStats />;
}
