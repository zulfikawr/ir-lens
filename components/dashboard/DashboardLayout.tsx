'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getArticles } from '@/lib/database';
import type { ArticleType } from '@/types/article';
import { SidebarContent } from './SidebarContent';
import { MobileDrawer } from './MobileDrawer';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  List,
  PlusSquare,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Statistics', href: '/dashboard', icon: BarChart2 },
  { name: 'Article List', href: '/dashboard/articles/lists', icon: List },
  {
    name: 'Create Article',
    href: '/dashboard/articles/create',
    icon: PlusSquare,
  },
  {
    name: 'Download Articles',
    href: '/dashboard/articles/download',
    icon: Download,
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleType['articles']>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className='flex min-h-screen px-0 md:px-8'>
      <div
        className={cn(
          'hidden md:flex flex-col border-r transition-all duration-300',
          isCollapsed ? 'w-[50px]' : 'w-64',
        )}
      >
        <div className='h-16 flex-shrink-0 flex items-center justify-center border-b'>
          <Button
            variant='ghost'
            size='icon'
            className='p-3 flex items-center justify-center h-10'
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight className='h-5 w-5' />
            ) : (
              <ChevronLeft className='h-5 w-5' />
            )}
          </Button>
        </div>

        <SidebarContent isCollapsed={isCollapsed} navigation={navigation} />
      </div>

      <div className='flex-1 flex flex-col'>
        <header className='h-16 flex-shrink-0 flex items-center border-b px-4'>
          <MobileDrawer navigation={navigation} />
          <h1 className='text-xl font-semibold ml-4 md:ml-0'>
            {navigation.find((item) => item.href === pathname)?.name ||
              'Dashboard'}
          </h1>
        </header>

        <main className='flex-1 overflow-auto p-6'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <span className='text-muted-foreground'>Loading...</span>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
