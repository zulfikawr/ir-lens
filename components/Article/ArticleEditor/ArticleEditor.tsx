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
import type { Article } from '@/types/article';
import { getArticleUrl } from '@/utils/articleLinks';
import {
  saveDraftArticle,
  deleteDraftArticle,
  loadDraftArticle,
} from '@/lib/database';

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
  const [draftSlugs, setDraftSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrafts = async () => {
    try {
      const draftsSnapshot = await loadDraftArticle('');
      if (draftsSnapshot) {
        const slugs = Object.keys(draftsSnapshot);
        setDraftSlugs(slugs);
      } else {
        setDraftSlugs([]);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setDraftSlugs([]);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleSelectDraft = async (slug: string) => {
    setIsLoading(true);
    try {
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
          slug: '',
        };
        updateArticle(newDraft);
      } else {
        const selectedDraft = await loadDraftArticle(slug);
        if (selectedDraft) {
          updateArticle(selectedDraft);
        }
      }
    } catch (error) {
      console.error('Error selecting draft:', error);
      toast({
        description: 'Error loading draft',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await saveDraftArticle(article);
      await fetchDrafts(); // Refresh the draft list after saving
      toast({
        description: 'Article saved as draft!',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        description: 'Error saving draft',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteDraftArticle(article.slug);
      await fetchDrafts();
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
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        description: 'Error deleting draft',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
          await deleteDraftArticle('draft');
          await fetchDrafts();
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
      <div className='top-0 bg-white py-4 flex flex-col md:flex-row md:justify-between items-center border-b mb-8 gap-2'>
        {/* Draft Dropdown (Full Width on Mobile, Left on Desktop) */}
        {draftSlugs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className='w-full md:w-auto flex items-center gap-2'
                disabled={isLoading}
              >
                <FileText className='w-4 h-4' />
                {isLoading ? 'Loading...' : article.slug || 'Select Draft'}
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

        {/* Button Container */}
        <div className='w-full md:w-auto flex flex-col md:flex-row justify-center md:justify-end gap-2'>
          {/* Mobile: Buttons Centered Below | Desktop: Buttons on the Right */}
          <div className='w-full flex flex-row justify-center gap-2'>
            <Button
              onClick={handlePreview}
              className='flex items-center gap-2 justify-center'
              disabled={isLoading}
            >
              <Eye className='w-4 h-4' />
              Preview
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  className='flex items-center gap-2 justify-center'
                  disabled={isLoading}
                >
                  <Trash className='w-4 h-4' />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='w-11/12 sm:max-w-md md:max-w-xl'>
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
                <Button
                  className='flex items-center gap-2 justify-center'
                  disabled={isLoading}
                >
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
