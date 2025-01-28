import React from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { AdminMenu } from './AdminMenu';
import Search from './Search';
import menu from '@/json/menu.json';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface DesktopNavProps {
  user: User | null;
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  if (!href) {
    console.error('href is required for ListItem');
    return null;
  }

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className='group block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors focus:underline'
          {...props}
        >
          <div className='text-sm font-medium leading-none group-hover:underline'>
            {title}
          </div>
          <p className='line-clamp-2 text-xs leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export const DesktopNav: React.FC<DesktopNavProps> = ({ user }) => {
  return (
    <div className='hidden md:flex justify-between w-full items-center'>
      <div className='flex items-center gap-6 px-4'>
        <NavigationMenu className='h-full'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href='/articles' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Articles
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tags</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 max-h-[calc(100vh-4rem)] overflow-auto'>
                  {menu.tags.map((tag) => (
                    <ListItem
                      key={tag.title}
                      title={tag.title}
                      href={tag.href}
                    >
                      {tag.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <div className='flex items-center gap-4'>
              {user && <AdminMenu />}
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className='flex items-center gap-4'>
        <Search />
      </div>
    </div>
  );
};