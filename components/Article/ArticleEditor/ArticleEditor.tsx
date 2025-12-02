'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';
import { useArticleState } from '@/hooks/useArticleState';
import { ArticleHeader } from './ArticleHeader';
import { ContentBlocks } from './ContentBlocks';
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
} from '@/components/ui/alert-dialog';
import type { Article } from '@/types/article';
import { getArticleUrl } from '@/utils/articleLinks';

type ArticleField = keyof Omit<Article, 'blocks' | 'slug'>;

interface ArticleEditorProps {
  article: Article;
  isNewArticle: boolean;
}

export default function ArticleEditor({
  article: initialArticle,
  isNewArticle,
}: ArticleEditorProps) {
  const { article, updateArticle } = useArticleState(initialArticle);
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateArticle = () => {
    const requiredFields: ArticleField[] = [
      'title',
      'description',
      'date',
      'location',
      'tag',
      'region',
      'coverImg',
      'coverImgAlt',
    ];
    const emptyFields = requiredFields.filter((field) => !article[field]);

    if (emptyFields.length > 0) {
      toast({
        description: `Please fill in the following fields: ${emptyFields.join(', ')}`,
        duration: 5000,
        variant: 'destructive',
      });
      return false;
    }

    if (article.blocks.length === 0) {
      toast({
        description: 'Please add at least one content block to the article.',
        duration: 5000,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSaveToDatabase = () => {
    if (validateArticle()) {
      setShowSaveDialog(true);
    }
  };

  const handleSaveConfirm = async () => {
    setIsLoading(true);
    const isNew = isNewArticle;
    const url = isNew ? '/api/article/create' : '/api/article/update';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        const data = await response.json();
        const savedArticle = { date: data.date, slug: data.slug };

        toast({
          description: isNew
            ? 'Article created successfully!'
            : 'Article updated successfully!',
          duration: 2000,
        });

        window.location.href = getArticleUrl(savedArticle);
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
    } finally {
      setIsLoading(false);
      setShowSaveDialog(false);
    }
  };

  const handlePreview = () => {
    if (validateArticle()) {
      const previewWindow = window.open(
        `/articles/preview/${article.slug}`,
        '_blank',
      );
      if (previewWindow) {
        previewWindow.articleData = article;
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto md:px-4 py-8'>
      <div className='top-0 bg-white py-4 flex flex-col md:flex-row md:justify-end items-center border-b mb-8 gap-2'>
        {/* Button Container */}
        <div className='w-full md:w-auto flex flex-col md:flex-row justify-center md:justify-end gap-2'>
          <div className='w-full flex flex-row justify-center gap-2 flex-wrap'>
            <Button
              onClick={handlePreview}
              className='flex items-center gap-2 justify-center'
              disabled={isLoading}
              variant='outline'
            >
              <Eye className='w-4 h-4' />
              Preview
            </Button>

            <Button
              onClick={handleSaveToDatabase}
              className='flex items-center gap-2 justify-center'
              disabled={isLoading}
            >
              <Save className='w-4 h-4' />
              {isLoading ? 'Saving...' : 'Save Article'}
            </Button>
          </div>

          <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save this article? Make sure you have
                  reviewed all changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSaveConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ArticleHeader article={article} onUpdate={updateArticle} />

      <ContentBlocks
        blocks={article.blocks}
        isEditing={true}
        onUpdateBlocks={(newBlocks) => updateArticle({ blocks: newBlocks })}
      />
    </div>
  );
}
