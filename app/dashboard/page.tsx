'use client';

import React from 'react';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import ArticleStats from '@/components/Articles/stats/ArticleStats';

const DashboardPage = () => {
  return <ArticleStats />;
};

export default withAdminAuth(DashboardPage);
