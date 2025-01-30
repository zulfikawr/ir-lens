'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticles } from '@/app/functions/getArticles';
import { deleteArticle } from '@/lib/database';
import type { ArticleType } from '@/types/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TableProperties,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;
type SortableKeys = 'title' | 'date';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const data = await getArticles();
    setArticles(data);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete);
      await fetchArticles();
      toast({
        description: 'Article deleted successfully!',
        duration: 2000,
      });
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        description: 'Error deleting article!',
        duration: 2000,
        variant: 'destructive',
      });
    }
  };

  // Search filter
  const filteredArticles = articles.filter((article) =>
    Object.values(article).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  // Sorting with type safety
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aValue = a[sortConfig.key]?.toString() || '';
    const bValue = b[sortConfig.key]?.toString() || '';

    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (key: SortableKeys) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-white py-16'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-16 h-px bg-black'></div>
            <TableProperties className='mx-4 w-8 h-8 text-black' />
            <div className='w-16 h-px bg-black'></div>
          </div>
          <h1 className='text-4xl font-bold text-black mb-4'>
            Lists of Articles
          </h1>
          <p className='text-gray-600'>
            {filteredArticles.length} articles uploaded to IR Lens
          </p>
        </div>

        <div className='bg-white shadow-lg overflow-hidden'>
          <div className='p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
              <Input
                placeholder='Search articles...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full sm:max-w-md border border-gray-300 px-4 py-2 h-10 text-black placeholder-gray-500'
              />
              <Link
                href='/articles/create'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button className='px-6 h-10 text-sm'>
                  <Plus className='mr-2 h-5 w-5' /> New Article
                </Button>
              </Link>
            </div>

            <div className='overflow-x-auto'>
              <Table className='w-full'>
                <TableHeader>
                  <TableRow className='bg-gray-50'>
                    {['Title', 'Date', 'Actions'].map((header, index) => (
                      <TableHead
                        key={header}
                        className='font-bold text-black text-lg py-4'
                      >
                        <Button
                          variant='ghost'
                          onClick={() =>
                            handleSort(header.toLowerCase() as SortableKeys)
                          }
                          className='font-bold text-black hover:bg-gray-100'
                        >
                          {header}{' '}
                          {index < 3 && (
                            <ArrowUpDown className='ml-2 h-4 w-4' />
                          )}
                        </Button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedArticles.map((article) => (
                    <TableRow
                      key={article.slug}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <TableCell className='text-black'>
                        {article.title}
                      </TableCell>
                      <TableCell className='text-black'>
                        {formatDate(article.date)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Link
                                  href={`/articles/${article.slug}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='flex items-center'
                                >
                                  <ExternalLink className='mr-2 h-4 w-4' />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/articles/${article.slug}/edit`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='flex items-center'
                                >
                                  <Pencil className='mr-2 h-4 w-4' />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setArticleToDelete(article.slug);
                                    }}
                                  >
                                    <div className='flex items-center text-red-500'>
                                      <Trash2 className='mr-2 h-4 w-4' />
                                      Delete
                                    </div>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Article
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      article? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setArticleToDelete(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteConfirm}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-8 py-6 border-t border-gray-200'>
              <div className='text-sm text-gray-600'>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredArticles.length,
                )}{' '}
                of {filteredArticles.length} entries
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className='border-gray-300 text-black hover:bg-black hover:text-white transition duration-300 px-4 py-2'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className='border-gray-300 text-black hover:bg-black hover:text-white transition duration-300 px-4 py-2'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
