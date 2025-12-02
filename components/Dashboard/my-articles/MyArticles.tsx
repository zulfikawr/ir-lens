'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getArticles, deleteArticle } from '@/lib/database';
import { Article } from '@/types/article';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import PageTitle from '@/components/PageTitle/PageTitle';
import { withAuth } from '@/hoc/withAuth';
import Link from 'next/link';
import { getArticleUrl } from '@/utils/articleLinks';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/context/AuthContext';
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

const MyArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchArticles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getArticles();
    const myArticles = data.filter((a) => a.authorId === user.uid);
    setArticles(myArticles);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (article: Article) => {
    try {
      await deleteArticle(article.date, article.slug);
      toast({ description: 'Article deleted successfully' });
      fetchArticles();
    } catch (error) {
      toast({
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading your articles...</div>;

  return (
    <div className='min-h-screen md:max-w-6xl mx-auto px-0 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<FileText />}
        title='My Articles'
        description={`${articles.length} articles created by you`}
      />

      <div className='overflow-x-auto shadow-lg mt-6'>
        <Table className='w-full border border-black'>
          <TableHeader>
            <TableRow className='bg-gray-50 border border-black'>
              <TableHead className='font-bold bg-black text-white text-lg py-2'>
                Title
              </TableHead>
              <TableHead className='font-bold bg-black text-white text-lg py-2'>
                Date
              </TableHead>
              <TableHead className='font-bold bg-black text-white text-lg py-2'>
                Status
              </TableHead>
              <TableHead className='font-bold bg-black text-white text-lg py-2'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8'>
                  You have not created any articles yet.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow
                  key={article.slug}
                  className='hover:bg-gray-50 transition-colors border border-black'
                >
                  <TableCell className='text-black py-1.5'>
                    {article.title}
                  </TableCell>
                  <TableCell className='text-black py-1.5'>
                    {formatDate(article.date)}
                  </TableCell>
                  <TableCell className='text-black py-1.5 capitalize'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : article.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {article.status || 'pending'}
                    </span>
                  </TableCell>
                  <TableCell className='py-1.5 flex gap-2'>
                    <Link href={getArticleUrl(article)} target='_blank'>
                      <Button variant='outline' size='sm'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href={`${getArticleUrl(article)}/edit`}>
                      <Button variant='outline' size='sm'>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='sm'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {article.title}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default withAuth(MyArticles, ['contributor']);
