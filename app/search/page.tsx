import { Suspense } from 'react';
import { getArticles } from '@/lib/database';
import SearchResults from './SearchResults';

export default async function SearchPage() {
  const articles = await getArticles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults initialArticles={articles} />
    </Suspense>
  );
}
