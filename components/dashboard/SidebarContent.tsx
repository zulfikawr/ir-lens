import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarContentProps {
  isCollapsed: boolean;
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
  }>;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  isCollapsed,
  navigation,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='flex flex-col h-full'>
      <nav className='flex-1 py-2 px-1'>
        {navigation.map((item) => (
          <Button
            key={item.href}
            variant='ghost'
            className={cn(
              'w-full flex items-center justify-start mb-1 p-3 h-10',
              pathname === item.href && 'bg-muted',
              isCollapsed ? 'justify-center' : 'justify-start',
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {!isCollapsed && <span className='ml-2'>{item.name}</span>}
          </Button>
        ))}
      </nav>
    </div>
  );
};
