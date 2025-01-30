'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className='w-full md:max-w-sm'>
      <div className='relative flex items-center border border-black overflow-hidden'>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search articles...'
          autoFocus={false}
          className='w-full py-2 pl-3 pr-10 text-sm focus:outline-none bg-transparent'
          aria-label='Search articles'
        />
        <button
          type='submit'
          className='absolute right-0 p-3 bg-black text-white hover:bg-white hover:text-black transition duration-300'
          aria-label='Submit search'
        >
          <SearchIcon className='w-5 h-5' />
        </button>
      </div>
    </form>
  );
};
