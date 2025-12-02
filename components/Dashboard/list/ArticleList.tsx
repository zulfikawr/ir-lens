'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteArticle } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { formatDate } from '@/utils/formatDate';

type SortableKeys = 'title' | 'date';

export default function ArticlesListPage() {
  const {
    data: articles,
    loading,
    error,
    refreshArticles,
  } = useArticleContext();
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
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(
    new Set(),
  );
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error loading articles: {error.message}</div>;
  }

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      console.log('Attempting to delete:', {
        date: articleToDelete.date,
        slug: articleToDelete.slug,
      });
      await deleteArticle(articleToDelete.date, articleToDelete.slug);
      console.log('Delete successful');
      toast({
        description: 'Article deleted successfully!',
        duration: 2000,
      });
      setArticleToDelete(null);
      console.log('Refreshing articles...');
      await refreshArticles();
      console.log('Articles refreshed');
    } catch (error) {
      console.error('Error deleting article:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast({
        title: 'Error',
        description: `Failed to delete: ${errorMsg}`,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const toDelete = Array.from(selectedArticles);
      const articlesToDelete = filteredArticles.filter((a) =>
        toDelete.includes(a.slug),
      );

      console.log(
        'Bulk deleting articles:',
        articlesToDelete.map((a) => ({ slug: a.slug, date: a.date })),
      );

      for (const article of articlesToDelete) {
        try {
          await deleteArticle(article.date, article.slug);
          console.log('Deleted:', article.slug);
        } catch (err) {
          console.error('Failed to delete article:', article.slug, err);
        }
      }

      setSelectedArticles(new Set());
      setShowBulkDeleteDialog(false);
      toast({
        description: `${articlesToDelete.length} article(s) deleted successfully!`,
        duration: 2000,
      });
      console.log('Refreshing articles after bulk delete...');
      await refreshArticles();
      console.log('Articles refreshed');
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast({
        title: 'Error',
        description: 'Error deleting articles!',
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const toggleArticleSelection = (slug: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedArticles(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedArticles.size === paginatedArticles.length) {
      setSelectedArticles(new Set());
    } else {
      const allSlugs = new Set(paginatedArticles.map((a) => a.slug));
      setSelectedArticles(allSlugs);
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
          {selectedArticles.size > 0 && (
            <AlertDialog
              open={showBulkDeleteDialog}
              onOpenChange={setShowBulkDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  onClick={() => setShowBulkDeleteDialog(true)}
                  className='ml-auto'
                >
                  Delete ({selectedArticles.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Articles</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedArticles.size}{' '}
                    article(s)? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className='overflow-x-auto shadow-lg'>
          <Table className='w-full border border-black'>
            <TableHeader>
              <TableRow className='bg-gray-50 border border-black'>
                <TableHead className='font-bold bg-black text-lg py-2 w-12'>
                  <Checkbox
                    checked={
                      selectedArticles.size === paginatedArticles.length &&
                      paginatedArticles.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    className='h-4 w-4'
                  />
                </TableHead>
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
                  <TableCell className='py-1.5 w-12'>
                    <Checkbox
                      checked={selectedArticles.has(article.slug)}
                      onCheckedChange={() =>
                        toggleArticleSelection(article.slug)
                      }
                      className='h-4 w-4'
                    />
                  </TableCell>
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
                                  console.log('Article to delete:', {
                                    slug: article.slug,
                                    date: article.date,
                                    rawArticle: article,
                                  });
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
