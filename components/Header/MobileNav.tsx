import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Search from './Search';
import menu from '@/json/menu.json';

export const MobileNav: React.FC = () => {
  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger aria-labelledby='button-label'>
          <span id='button-label' hidden>
            Menu
          </span>
          <svg
            aria-hidden='true'
            width='25'
            height='16'
            viewBox='0 0 25 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect width='25' height='4' fill='black' />
            <rect y='6' width='25' height='4' fill='black' />
            <rect y='12' width='25' height='4' fill='black' />
          </svg>
        </SheetTrigger>
        <SheetContent
          side='top'
          className='w-full pt-14'
          aria-label='Menu Toggle'
        >
          <nav
            className='flex flex-col flex-1 justify-end gap-6'
            aria-labelledby='mobile-nav'
          >
            <Link href='/' className='hover:underline'>
              Home
            </Link>
            <Link href='/articles' className='hover:underline'>
              Articles
            </Link>
            <div className='flex flex-col gap-4'>
              <p className='font-medium'>Tags:</p>
              {menu.tags.map((tag) => (
                <Link
                  key={tag.title}
                  href={tag.href}
                  className='hover:underline pl-4'
                >
                  {tag.title}
                </Link>
              ))}
            </div>
            <svg
              width='15'
              height='1'
              viewBox='0 0 15 1'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='15' height='1' fill='black' />
            </svg>
            <Search />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};