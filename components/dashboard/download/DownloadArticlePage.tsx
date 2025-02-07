'use client';

import React, { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle/PageTitle';
import { Download } from 'lucide-react';
import { ArticleType } from '@/types/article';
import { getArticles } from '@/lib/database';
import { withAdminAuth } from '@/hoc/withAdminAuth';

const DownloadArticlePage = () => {
  const [status, setStatus] = useState('');
  const [data, setData] = useState<any>(null);
  const [articles, setArticles] = useState<ArticleType['articles']>([]);

  const fetchData = async () => {
    try {
      setStatus('Fetching data...');
      const snapshot = await get(ref(database));
      if (snapshot.exists()) {
        setData(snapshot.val());
        setStatus('Data fetched successfully');
        const data = await getArticles();
        setArticles(data);
      } else {
        setStatus('No data found');
      }
    } catch (error) {
      setStatus('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = () => {
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'firebase_data.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatJsonWithSyntaxHighlighting = (jsonString: string) => {
    const formattedJson = jsonString
      .replace(/"([^" ]+)":/g, '<span class="json-key">"$1":</span>')
      .replace(/"(http[s]?:\/\/[^\s]+)"/g, '<span class="json-url">"$1"</span>')
      .replace(
        /:\s*(\d+|\d*\.\d+|\btrue\b|\bfalse\b|\bnull\b)/g,
        ': <span class="json-value">$1</span>',
      );
    return formattedJson;
  };

  const getDataPreview = () => {
    if (!data) return '';
    const preview = JSON.stringify(data, null, 2).slice(0, 1000);
    return formatJsonWithSyntaxHighlighting(preview);
  };

  return (
    <div className='min-h-screen max-w-6xl mx-auto px-4 md:px-8 my-12 md:my-16 text-center'>
      <PageTitle
        icon={<Download />}
        title='Download Data'
        description={`Download ${articles.length} articles from Firebase`}
      />

      <div className='mb-6'>
        <Button size='lg' onClick={handleDownload} disabled={!data}>
          Download Data
        </Button>
      </div>

      {data && (
        <>
          <div className='max-w-4xl bg-black p-4 text-left text-sm overflow-hidden h-62 mx-auto'>
            <pre
              className='text-blue-300 whitespace-pre-wrap'
              dangerouslySetInnerHTML={{ __html: getDataPreview() as string }}
            />
          </div>
          <p className='mt-2 text-gray-400 text-xs'>
            (Preview of the first 1000 characters of the data)
          </p>
        </>
      )}
    </div>
  );
};

export default withAdminAuth(DownloadArticlePage);
