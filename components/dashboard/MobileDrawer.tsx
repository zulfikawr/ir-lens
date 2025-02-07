import type React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarContent } from './SidebarContent';

interface MobileDrawerProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
  }>;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ navigation }) => {
  return (
    <Sheet>
      <Button variant='outline' className='h-10 md:hidden' asChild>
        <SheetTrigger>
          <Menu className='w-5 h-5' />
        </SheetTrigger>
      </Button>
      <SheetContent
        side='left'
        className='w-[80%] sm:w-[350px]'
        aria-label='Menu Toggle'
      >
        <ScrollArea className='h-full'>
          <div className='flex items-center h-10'>
            <span className='text-lg font-semibold'>Dashboard</span>
          </div>
          <hr className='border-black border-t-0 border my-4' />
          <SheetClose className='w-full'>
            <SidebarContent isCollapsed={false} navigation={navigation} />
          </SheetClose>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
