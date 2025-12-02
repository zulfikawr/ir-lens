'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getArticles } from '@/lib/database';
import type { Article } from '@/types/article';
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
  Newspaper,
  Users,
  FileCheck,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, isAdmin, isContributor } = useAuth();

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

  const getNavigation = () => {
    const nav = [];

    // Common items (maybe?) or Admin items
    if (isAdmin) {
      nav.push({ name: 'Statistics', href: '/dashboard', icon: BarChart2 });
      nav.push({
        name: 'User Management',
        href: '/dashboard/users',
        icon: Users,
      });
      nav.push({
        name: 'Review Articles',
        href: '/dashboard/articles/review',
        icon: FileCheck,
      });
      nav.push({
        name: 'All Articles',
        href: '/dashboard/articles/lists',
        icon: List,
      });
    }

    if (isContributor) {
      nav.push({
        name: 'My Articles',
        href: '/dashboard/articles/my',
        icon: FileText,
      });
    }

    // Common for creators
    if (isAdmin || isContributor) {
      nav.push({
        name: 'Create Article',
        href: '/dashboard/articles/create',
        icon: PlusSquare,
      });
      nav.push({
        name: 'API News',
        href: '/dashboard/articles/api',
        icon: Newspaper,
      });
    }

    if (isAdmin) {
      nav.push({
        name: 'Download Articles',
        href: '/dashboard/articles/download',
        icon: Download,
      });
    }

    return nav;
  };

  const navigation = getNavigation();

  return (
    <div className='flex min-h-screen px-0 md:px-8'>
      <div
        className={cn(
          'hidden md:flex flex-col border-r transition-all duration-300',
          isCollapsed ? 'w-[50px]' : 'w-64',
        )}
      >
        <div className='h-16 flex-shrink-0 flex items-center justify-between px-2 border-b'>
          {!isCollapsed && user && (
            <div className='flex items-center gap-2 overflow-hidden'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-sm font-bold truncate'>
                  {user.displayName}
                </span>
                <span className='text-xs text-gray-500 capitalize'>
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <Button
            variant='ghost'
            size='icon'
            className='p-3 flex items-center justify-center h-10 ml-auto'
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
