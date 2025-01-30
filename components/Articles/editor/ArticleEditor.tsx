'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save, Trash } from 'lucide-react';
import { useArticleState } from '@/hooks/useArticleState';
import { ArticleHeader } from './ArticleHeader';
import { ContentBlocks } from './ContentBlocks';
import { createNewBlock } from '@/utils/blockUtils';
import { useToast } from '@/hooks/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ArticleType } from '@/types/article';
import type { ContentBlock } from '@/types/contentBlocks';

interface ArticleEditorProps {
  article: ArticleType['articles'][0];
}

export default function ArticleEditor({
  article: initialArticle,
}: ArticleEditorProps) {
  const { article, updateArticle, addBlock, updateBlock, removeBlock } =
    useArticleState(initialArticle);
  const { toast } = useToast();

  const handleSaveConfirm = async () => {
    const isNew = !article.slug;
    const url = isNew ? '/api/article/create' : '/api/article/update';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        toast({
          description: isNew
            ? 'Article created successfully!'
            : 'Article updated successfully!',
          duration: 2000,
        });
        if (isNew) {
          localStorage.removeItem('draftArticle');
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save the article.');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        description: 'Error saving article!',
        duration: 2000,
        variant: 'destructive',
      });
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open(
      `/articles/preview/${article.slug}`,
      '_blank',
    );
    if (previewWindow) {
      previewWindow.articleData = article;
    }
  };

  const handleDeleteConfirm = () => {
    localStorage.removeItem('draftArticle');
    updateArticle({
      title: '',
      description: '',
      date: '',
      labels: [],
      coverImage: '',
      coverImageAlt: '',
      slug: '',
      blocks: [],
    });
    toast({
      description: 'Article deleted successfully!',
      duration: 2000,
    });
  };

  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...article.blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    updateArticle({ blocks: newBlocks });
  };

  const handleAddBlock = (type: ContentBlock['type'], index?: number) => {
    const newBlock = createNewBlock(type);
    addBlock(newBlock, index);
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='top-0 bg-white py-4 space-x-4 flex justify-end items-center border-b mb-8'>
        <Button onClick={handlePreview} className='flex items-center gap-2'>
          <Eye className='w-4 h-4' />
          Preview
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' className='flex items-center gap-2'>
              <Trash className='w-4 h-4' />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this draft article? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Save className='w-4 h-4' />
              Save
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to save this article? Make sure you have
                reviewed all changes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveConfirm}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ArticleHeader article={article} onUpdate={updateArticle} />

      <ContentBlocks
        blocks={article.blocks}
        onAddBlock={handleAddBlock}
        onUpdateBlock={updateBlock}
        onRemoveBlock={removeBlock}
        onMoveBlock={handleMoveBlock}
        updateArticle={updateArticle}
      />
    </div>
  );
}
