'use client';

import React from 'react';
import Link from 'next/link';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className='px-4 md:px-8 md:pt-8 pt-4'>
      <div className='flex justify-between items-center'>
        <Link href='/' className='flex-none'>
          <Button className='h-10'>IR Lens</Button>
        </Link>

        <MobileNav user={user} />
        <DesktopNav user={user} />
      </div>
      <hr className='border-black border-t-0 border mt-4' />
    </header>
  );
}
