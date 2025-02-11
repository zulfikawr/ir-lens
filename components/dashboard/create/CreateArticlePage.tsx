'use client';

import React from 'react';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import ArticleEditor from '@/components/Articles/editor/ArticleEditor';
import type { ArticleType } from '@/types/article';

const CreateArticlePage = () => {
  const initialArticle: ArticleType['articles'][0] = {
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
  };

  return <ArticleEditor article={initialArticle} isNewArticle />;
};

export default withAdminAuth(CreateArticlePage);
