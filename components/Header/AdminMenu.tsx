import React from 'react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Table as TableIcon, Plus as PlusIcon, LogOut as LogOutIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

export const AdminMenu: React.FC = () => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className={navigationMenuTriggerStyle()}>
          Admin
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href='/articles/lists'
              className='flex items-center gap-4'
            >
              <TableIcon className='w-4 h-4' />
              List of articles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href='/articles/create'
              className='flex items-center gap-4'
            >
              <PlusIcon className='w-4 h-4' />
              Create article
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <div className='flex items-center gap-4'>
              <LogOutIcon className='w-4 h-4' />
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};