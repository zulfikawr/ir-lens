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
        <Button variant='outline' size='icon' className='md:hidden'>
          <Menu className='h-[1.2rem] w-[1.2rem]' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[80%] sm:w-[350px] p-0'>
        <ScrollArea className='h-full'>
          <div className='flex items-center h-16 px-4 border-b'>
            <span className='text-lg font-semibold'>Dashboard</span>
          </div>
          <SidebarContent isCollapsed={false} navigation={navigation} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
