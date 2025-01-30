import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from './Search';
import menu from '@/json/menu.json';
import { Menu, Home, Book, Tag, Globe, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { User } from 'firebase/auth';
import { AdminMenu } from './AdminMenu';

interface MobileNavProps {
  user: User | null;
}

export const MobileNav: React.FC<MobileNavProps> = ({ user }) => {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);

  const toggleTags = () => setIsTagsOpen(!isTagsOpen);
  const toggleRegions = () => setIsRegionsOpen(!isRegionsOpen);

  return (
    <div className='md:hidden'>
      <Sheet>
        <Button variant='outline' className='h-10' asChild>
          <SheetTrigger>
            <Menu className='w-5 h-5' />
          </SheetTrigger>
        </Button>
        <SheetContent
          side='right'
          className='w-full h-full'
          aria-label='Menu Toggle'
        >
          <VisuallyHidden>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden>
          <SheetDescription>
            <Link href='/' className='flex-none'>
              <Button className='h-10'>IR Lens</Button>
            </Link>
          </SheetDescription>
          <hr className='border-black border-t-0 border my-4' />
          <ScrollArea className='h-[calc(100vh-10rem)]'>
            <nav className='flex flex-col flex-1 justify-end gap-4'>
              <Search />

              <SheetClose asChild>
                <Link
                  href='/'
                  className='flex items-center gap-2 hover:bg-black hover:text-white transition duration-300 p-2'
                >
                  <Home className='w-5 h-5' />
                  Home
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href='/articles'
                  className='flex items-center gap-2 hover:bg-black hover:text-white transition duration-300 p-2'
                >
                  <Book className='w-5 h-5' />
                  Articles
                </Link>
              </SheetClose>

              <div className='flex flex-col'>
                <button
                  onClick={toggleTags}
                  className='flex items-center gap-2 w-full justify-between hover:bg-black hover:text-white transition duration-300 p-2'
                >
                  <div className='flex items-center gap-2'>
                    <Tag className='w-5 h-5' />
                    <span>Tags</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isTagsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isTagsOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className='flex flex-col gap-2 pl-7'>
                    {menu.tags.map((tag) => (
                      <SheetClose asChild key={tag.title}>
                        <Link
                          href={tag.href}
                          className='hover:bg-black hover:text-white transition duration-300 p-2'
                        >
                          {tag.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </div>

              <div className='flex flex-col'>
                <button
                  onClick={toggleRegions}
                  className='flex items-center gap-2 w-full justify-between hover:bg-black hover:text-white transition duration-300 p-2'
                >
                  <div className='flex items-center gap-2'>
                    <Globe className='w-5 h-5' />
                    <span>Regions</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isRegionsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isRegionsOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className='flex flex-col gap-2 pl-7'>
                    {['Asia', 'Middle East', 'America', 'Europe', 'Africa'].map(
                      (region) => (
                        <SheetClose asChild key={region}>
                          <Link
                            href={`/regions/${region.toLowerCase()}`}
                            className='hover:bg-black hover:text-white transition duration-300 p-2'
                          >
                            {region}
                          </Link>
                        </SheetClose>
                      ),
                    )}
                  </div>
                </div>
              </div>
              {user && <AdminMenu isMobile />}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
