'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { withAuth } from '@/hoc/withAuth';
import ArticleEditor from '@/components/Article/ArticleEditor/ArticleEditor';
import type { Article } from '@/types/article';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const CreateArticleContent = () => {
  const { user, isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Define the default empty state
  const defaultArticle: Article = {
    title: '',
    description: '',
    date: '',
    location: '',
    tag: '',
    region: '',
    coverImg: '',
    coverImgAlt: '',
    slug: '',
    blocks: [],
    authorId: user?.uid,
    status: isAdmin ? 'published' : 'pending',
  };

  const [articleData, setArticleData] = useState<Article>(defaultArticle);

  useEffect(() => {
    const loadImportedData = () => {
      const importType = searchParams.get('import');

      if (importType === 'session') {
        try {
          const storedData = sessionStorage.getItem('importedArticle');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            
            // Merge defaults with imported data to ensure all fields exist
            // We force the authorId to be the current user, not the original source
            setArticleData({
              ...defaultArticle,
              ...parsed,
              authorId: user?.uid,
              status: isAdmin ? 'published' : 'pending',
            });

            // Optional: Clean up URL and storage
            // sessionStorage.removeItem('importedArticle'); 
            // router.replace('/dashboard/articles/create', { scroll: false });
          }
        } catch (error) {
          console.error('Failed to parse imported article:', error);
        }
      }
      // Done loading (whether we found data or not)
      setIsLoading(false);
    };

    loadImportedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Key prop is CRITICAL here. 
  // It forces React to destroy and recreate the ArticleEditor component 
  // if the title changes (i.e. when data loads), ensuring the 
  // internal state of the editor picks up the new props.
  return (
    <ArticleEditor 
      key={articleData.title || 'new-article'} 
      article={articleData} 
      isNewArticle 
    />
  );
};

// Next.js requires useSearchParams to be wrapped in Suspense
const CreateArticlePage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
      <CreateArticleContent />
    </Suspense>
  );
};

export default withAuth(CreateArticlePage, ['admin', 'contributor']);