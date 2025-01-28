'use client';

import React from 'react';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import ArticleEditor from '@/app/articles/create/ArticleEditor';
import type { ArticleType } from '@/types/article';

const CreateArticlePage = () => {
  const initialArticle: ArticleType['articles'][0] = {
    id: '',
    title: '',
    description: '',
    date: '',
    labels: [],
    coverImage: '',
    coverImageAlt: '',
    slug: '',
    blocks: [],
  };

  return <ArticleEditor article={initialArticle} />;
};

export default withAdminAuth(CreateArticlePage);
