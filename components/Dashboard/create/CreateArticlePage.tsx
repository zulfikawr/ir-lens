'use client';

import React from 'react';
import { withAdminAuth } from '@/hoc/withAdminAuth';
import ArticleEditor from '@/components/Article/ArticleEditor/ArticleEditor';
import type { Article } from '@/types/article';

const CreateArticlePage = () => {
  const initialArticle: Article = {
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
