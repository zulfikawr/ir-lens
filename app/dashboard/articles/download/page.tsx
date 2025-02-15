import React from 'react';
import DownloadArticlePage from '@/components/Dashboard/download/DownloadArticlePage';

export const metadata = {
  title: 'Download | IR Lens',
  description: 'Download all data from Firebase database.',
};

export default function Download() {
  return <DownloadArticlePage />;
}
