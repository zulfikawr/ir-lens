import React from 'react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import {
  Table as TableIcon,
  Plus as PlusIcon,
  LogOut as LogOutIcon,
  ChevronDown,
  User,
} from 'lucide-react';
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

interface AdminMenuProps {
  isMobile?: boolean;
}

export const AdminMenu: React.FC<AdminMenuProps> = ({ isMobile = false }) => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isMobile) {
    return <MobileAdminMenu handleSignOut={handleSignOut} />;
  }

  return <DesktopAdminMenu handleSignOut={handleSignOut} />;
};

const DesktopAdminMenu: React.FC<{ handleSignOut: () => void }> = ({
  handleSignOut,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className={navigationMenuTriggerStyle()}>Admin</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/articles/lists'>
            <DropdownMenuItem className='className= flex items-center gap-4'>
              <TableIcon className='w-4 h-4' />
              List of articles
            </DropdownMenuItem>
          </Link>
          <Link href='/articles/create'>
            <DropdownMenuItem className='flex items-center gap-4'>
              <PlusIcon className='w-4 h-4' />
              Create article
            </DropdownMenuItem>
          </Link>
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

const MobileAdminMenu: React.FC<{ handleSignOut: () => void }> = ({
  handleSignOut,
}) => {
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);

  const toggleAdmin = () => setIsAdminOpen(!isAdminOpen);

  return (
    <div className='flex flex-col'>
      <button
        onClick={toggleAdmin}
        className='flex items-center gap-2 w-full justify-between hover:bg-black hover:text-white transition duration-300 p-2'
      >
        <div className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          <span>Admin</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isAdminOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isAdminOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className='flex flex-col gap-2 pl-7'>
          <Link
            href='/articles/lists'
            className='flex items-center gap-2 hover:bg-black hover:text-white transition duration-300 p-2'
          >
            List of articles
          </Link>
          <Link
            href='/articles/create'
            className='flex items-center gap-2 hover:bg-black hover:text-white transition duration-300 p-2'
          >
            Create article
          </Link>
          <button
            onClick={handleSignOut}
            className='flex items-center gap-2 hover:bg-black hover:text-white transition duration-300 p-2'
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
