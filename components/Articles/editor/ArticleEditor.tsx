'use client';

import { useState, useEffect } from 'react';
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

type ArticleField = keyof Omit<ArticleType['articles'][0], 'blocks' | 'slug'>;

interface ArticleEditorProps {
  article: ArticleType['articles'][0];
  isNewArticle: boolean;
}

export default function ArticleEditor({
  article: initialArticle,
  isNewArticle,
}: ArticleEditorProps) {
  const { article, updateArticle, addBlock, updateBlock, removeBlock } =
    useArticleState(initialArticle);
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    if (isNewArticle) {
      const saveToLocalStorage = () => {
        localStorage.setItem('draftArticle', JSON.stringify(article));
      };

      const timeoutId = setTimeout(saveToLocalStorage, 500);

      return () => clearTimeout(timeoutId);
    } else {
      localStorage.removeItem('draftArticle');
    }
  }, [article, isNewArticle]);

  useEffect(() => {
    if (isNewArticle && !initialArticle.slug) {
      const savedDraft = localStorage.getItem('draftArticle');
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        updateArticle(parsedDraft);
      }
    }
  }, [isNewArticle, updateArticle, initialArticle.slug]);

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

  const handleSaveClick = () => {
    if (validateArticle()) {
      setShowSaveDialog(true);
    }
  };

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
        const data = await response.json();

        toast({
          description: isNew
            ? 'Article created successfully!'
            : 'Article updated successfully!',
          duration: 2000,
        });

        if (isNew) {
          localStorage.removeItem('draftArticle');
          const slug = data.slug;
          window.location.href = `/articles/${slug}`;
        } else {
          window.location.href = `/articles/${article.slug}`;
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
    setShowSaveDialog(false);
  };

  const handleDeleteConfirm = () => {
    localStorage.removeItem('draftArticle');
    updateArticle({
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
    });
    toast({
      description: 'Article deleted successfully!',
      duration: 2000,
    });
  };

  const handlePreview = () => {
    if (validateArticle()) {
      const previewWindow = window.open(
        `/articles/preview/${article.slug || 'draft'}`,
        '_blank',
      );
      if (previewWindow) {
        previewWindow.articleData = article;
      }
    }
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

        <Button onClick={handleSaveClick} className='flex items-center gap-2'>
          <Save className='w-4 h-4' />
          Save
        </Button>

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
