import type React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
      <SheetTrigger asChild>
        <Button variant='outline' className='md:hidden h-10'>
          <Menu className='w-5 h-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[80%] sm:w-[350px]'>
        <ScrollArea className='h-full'>
          <div className='flex items-center h-10 px-4'>
            <span className='text-lg font-semibold'>Dashboard</span>
          </div>
          <hr className='border-black border-t-0 border my-4' />
          <SidebarContent isCollapsed={false} navigation={navigation} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
