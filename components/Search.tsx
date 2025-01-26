"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const DesktopSearch = (
    <form onSubmit={handleSearch} className="hidden md:block">
      <div className="flex items-center border border-black">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="text-sm py-1 pl-2 pr-8 w-48 focus:outline-none bg-transparent"
          aria-label="Search articles"
        />
        <button type="submit" className="p-2 bg-black text-white border-l hover:bg-white hover:border-l hover:border-black hover:text-black" aria-label="Submit search">
          <SearchIcon className="w-4 h-4" />
        </button>
      </div>
    </form>
  );

  const MobileSearch = (
    <div className="md:hidden">
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetTrigger aria-label="Open search">
          <SearchIcon className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="top" className="pt-14">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex items-center border-b border-black">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="py-2 pl-2 pr-8 w-full focus:outline-none bg-transparent"
                aria-label="Search articles"
              />
              <button type="submit" className="p-2" aria-label="Submit search">
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      {DesktopSearch}
      {MobileSearch}
    </>
  );
};

export default Search;