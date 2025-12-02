'use client';

import React, { useEffect, useState } from 'react';
import { getArticles, updateArticle, deleteArticle } from '@/lib/database';
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
import { CheckCircle, XCircle, Eye, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import PageTitle from '@/components/PageTitle/PageTitle';
import { withAuth } from '@/hoc/withAuth';
import Link from 'next/link';
import { getArticleUrl } from '@/utils/articleLinks';
import { formatDate } from '@/utils/formatDate';

const ReviewArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    const data = await getArticles();
    // Filter for pending articles
    const pending = data.filter((a) => a.status === 'pending');
    setArticles(pending);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleApprove = async (article: Article) => {
    try {
      await updateArticle(article.slug, { status: 'published' });
      toast({ description: 'Article approved and published!' });
      fetchArticles();
    } catch (error) {
      toast({
        description: 'Failed to approve article',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (article: Article) => {
    try {
      await updateArticle(article.slug, { status: 'rejected' });
      toast({ description: 'Article rejected.' });
      fetchArticles();
    } catch (error) {
      toast({
        description: 'Failed to reject article',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading pending articles...</div>;

  return (
    <div className='min-h-screen md:max-w-6xl mx-auto px-0 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<FileCheck />}
        title='Review Articles'
        description={`${articles.length} articles pending review`}
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
                Author
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
                  No pending articles to review.
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
                  <TableCell className='text-black py-1.5'>
                    {article.authorId || 'Unknown'}
                  </TableCell>
                  <TableCell className='py-1.5 flex gap-2'>
                    <Link href={getArticleUrl(article)} target='_blank'>
                      <Button variant='outline' size='sm'>
                        <Eye className='h-4 w-4 mr-1' /> View
                      </Button>
                    </Link>
                    <Button
                      variant='default'
                      size='sm'
                      className='bg-green-600 hover:bg-green-700'
                      onClick={() => handleApprove(article)}
                    >
                      <CheckCircle className='h-4 w-4 mr-1' /> Approve
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleReject(article)}
                    >
                      <XCircle className='h-4 w-4 mr-1' /> Reject
                    </Button>
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

export default withAuth(ReviewArticles, ['admin']);
