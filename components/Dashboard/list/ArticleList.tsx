'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteArticle } from '@/lib/database';
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
import { useArticleContext } from '@/hooks/useArticleContext';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TableProperties,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';
import { getArticleUrl } from '@/utils/articleLinks';
import PageTitle from '@/components/PageTitle/PageTitle';

type SortableKeys = 'title' | 'date';

export default function ArticlesListPage() {
  const { data: articles, loading, error } = useArticleContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [articleToDelete, setArticleToDelete] = useState<{
    slug: string;
    date: string;
  } | null>(null);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error loading articles: {error.message}</div>;
  }

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete.date, articleToDelete.slug);
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
    if (sortConfig.key === 'date') {
      const aDate = new Date(a[sortConfig.key]);
      const bDate = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    } else {
      const aValue = a[sortConfig.key]?.toString() || '';
      const bValue = b[sortConfig.key]?.toString() || '';
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className='min-h-screen md:max-w-6xl mx-auto px-0 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<TableProperties />}
        title='List of Articles'
        description={`${filteredArticles.length} articles found`}
      />

      <div className='overflow-hidden'>
        <div className='flex items-center mb-6 gap-4'>
          <Input
            placeholder='Search articles...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full sm:max-w-md border border-gray-300 px-4 py-2 h-10 text-black placeholder-gray-500'
          />
        </div>

        <div className='overflow-x-auto shadow-lg'>
          <Table className='w-full border border-black'>
            <TableHeader>
              <TableRow className='bg-gray-50 border border-black'>
                {['Title', 'Date', 'Actions'].map((header, index) => (
                  <TableHead
                    key={header}
                    className='font-bold bg-black text-lg py-2'
                  >
                    {index < 2 ? (
                      <Button
                        variant='ghost'
                        onClick={() =>
                          handleSort(header.toLowerCase() as SortableKeys)
                        }
                        className='font-bold text-white hover:bg-white'
                      >
                        {header} <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    ) : (
                      <Button
                        variant='ghost'
                        className='font-bold text-white hover:bg-white'
                      >
                        {header}
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.map((article) => (
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
                  <TableCell className='py-1.5'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuGroup>
                          <Link
                            href={getArticleUrl(article)}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <DropdownMenuItem className='flex items-center w-full'>
                              <ExternalLink className='mr-2 h-4 w-4' />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link
                            href={`${getArticleUrl(article)}/edit`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <DropdownMenuItem className='flex items-center w-full'>
                              <Pencil className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setArticleToDelete({
                                    slug: article.slug,
                                    date: article.date,
                                  });
                                }}
                              >
                                <div className='flex items-center text-red-500'>
                                  <Trash2 className='mr-4 h-4 w-4' />
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
                                  Are you sure you want to delete
                                  {article.title}? This action cannot be undone.
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

        <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-8 py-6'>
          <div className='text-sm text-gray-600'>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of{' '}
            {filteredArticles.length} entries
          </div>
          <div className='flex items-center space-x-4'>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='Select rows per page' />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='border-gray-300 text-black hover:bg-black hover:text-white transition duration-300 px-4 py-2 h-9'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='border-gray-300 text-black hover:bg-black hover:text-white transition duration-300 px-4 py-2 h-9'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
