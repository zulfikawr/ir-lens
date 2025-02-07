import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';
import { LogOut as LogOutIcon } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';

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
  const auth = getAuth();
  const [showAlert, setShowAlert] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {!isCollapsed && <span className='ml-2'>{item.name}</span>}
          </Button>
        ))}
        
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              className='w-full flex items-center justify-start p-3 h-10 mt-2'
            >
              <LogOutIcon className='h-5 w-5 flex-shrink-0' />
              {!isCollapsed && <span className='ml-2'>Logout</span>}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will log you out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant='ghost' onClick={() => setShowAlert(false)}>Cancel</Button>
              <Button variant='default' onClick={handleSignOut}>Logout</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </nav>
    </div>
  );
};
