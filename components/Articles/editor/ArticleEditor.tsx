'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Save, Trash } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { ArticleType } from '@/types/article';
import { getArticleUrl } from '@/utils/articleLinks';
import {
  saveDraftArticle,
  deleteDraftArticle,
  loadDraftArticle,
} from '@/lib/database';

type ArticleField = keyof Omit<ArticleType['articles'][0], 'blocks' | 'slug'>;

interface ArticleEditorProps {
  article: ArticleType['articles'][0];
  isNewArticle: boolean;
}

export default function ArticleEditor({
  article: initialArticle,
  isNewArticle,
}: ArticleEditorProps) {
  const { article, updateArticle } = useArticleState(initialArticle);
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [draftSlugs, setDraftSlugs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const draftsSnapshot = await loadDraftArticle('');
        if (draftsSnapshot) {
          setDraftSlugs(Object.keys(draftsSnapshot));
        } else {
          setDraftSlugs([]);
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
        setDraftSlugs([]);
      }
    }

    fetchDrafts();
  }, []);

  const handleSelectDraft = async (slug: string) => {
    if (slug === 'new') {
      const newDraft = {
        title: '',
        description: '',
        date: '',
        location: '',
        tag: '',
        region: '',
        coverImg: '',
        coverImgAlt: '',
        blocks: [],
      };

      try {
        updateArticle(newDraft);
        updateArticle({ ...newDraft, slug: '' });
      } catch (error) {
        console.error('Error creating new draft:', error);
      }
    } else {
      const selectedDraft = await loadDraftArticle(slug);
      if (selectedDraft) {
        updateArticle(selectedDraft);
      }
    }
  };

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

  const handleSaveAsDraft = async () => {
    await saveDraftArticle(article);
    setDraftSlugs((prevSlugs) => [...prevSlugs, article.slug]);
    toast({
      description: 'Article saved as draft!',
      duration: 2000,
    });
  };

  const handleSaveToDatabase = async () => {
    if (validateArticle()) {
      setShowSaveDialog(true);
    }
  };

  const handleSaveConfirm = async () => {
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
        const article = { date: data.date, slug: data.slug };

        toast({
          description: isNew
            ? 'Article created successfully!'
            : 'Article updated successfully!',
          duration: 2000,
        });

        if (isNew) {
          deleteDraftArticle('draft');
          window.location.href = getArticleUrl(article);
        } else {
          window.location.href = getArticleUrl(article);
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
    deleteDraftArticle(article.slug);
    setDraftSlugs((prevSlugs) =>
      prevSlugs.filter((slug) => slug !== article.slug),
    );
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
      <div
        className={`top-0 bg-white py-4 space-x-4 flex ${
          draftSlugs.length > 0 ? 'justify-between' : 'justify-end'
        } items-center border-b mb-8`}
      >
        {draftSlugs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <FileText className='w-4 h-4' />
                {article.slug ? article.slug : 'Select Draft'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleSelectDraft('new')}
                  className='cursor-pointer flex items-center gap-2 font-semibold'
                >
                  + Create New
                </DropdownMenuItem>
                {draftSlugs.map((slug) => (
                  <DropdownMenuItem
                    key={slug}
                    onClick={() => handleSelectDraft(slug)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {slug}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className='flex items-center gap-4'>
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
                  Are you sure you want to delete this draft article? This
                  action cannot be undone.
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Save className='w-4 h-4' />
                Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleSaveAsDraft}
                  className='cursor-pointer flex items-center gap-2'
                >
                  Save as Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSaveToDatabase}
                  className='cursor-pointer flex items-center gap-2'
                >
                  Save to Database
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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
