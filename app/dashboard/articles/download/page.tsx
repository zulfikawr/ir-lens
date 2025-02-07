'use client';

import React from 'react';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import DownloadData from '@/components/dashboard/download/DownloadArticles';

const DownloadPage = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <DownloadData />
    </div>
  );
};

export default withAdminAuth(DownloadPage);
