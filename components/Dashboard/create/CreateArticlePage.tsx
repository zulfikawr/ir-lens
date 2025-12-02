'use client';

import React from 'react';
import { withAuth } from '@/hoc/withAuth';
import ArticleEditor from '@/components/Article/ArticleEditor/ArticleEditor';
import type { Article } from '@/types/article';
import { useAuth } from '@/context/AuthContext';

const CreateArticlePage = () => {
  const { user, isAdmin } = useAuth();

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
    authorId: user?.uid,
    status: isAdmin ? 'published' : 'pending',
  };

  return <ArticleEditor article={initialArticle} isNewArticle />;
};

export default withAuth(CreateArticlePage, ['admin', 'contributor']);
