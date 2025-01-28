'use client';

import { useArticleContext } from '@/hooks/useArticleContext';
import Loading from './loading';
import NewsTicker from '@/components/Home/NewsTicker/NewsTicker';
import LatestArticle from '@/components/Home/LatestArticle/LatestArticle';
import ArticlesByTags from '@/components/Home/ArticlesByTags/ArticlesByTags';
import Sidebar from '@/components/Home/Sidebar/Sidebar';
import ScrollToTop from '@/components/ScrollToTop';
import RegionalFocus from '@/components/Home/RegionalFocus/RegionalFocus';
import NewsletterSubscription from '@/components/Home/NewsletterSubscription/NewsletterSubscription';

const HomeSection = () => {
  const { data } = useArticleContext();

  if (!data?.length) {
    return <Loading />;
  }

  return (
    <div className='py-8'>
      <NewsTicker />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8 space-y-12 md:space-y-2'>
          <LatestArticle />
          <ArticlesByTags />
        </div>
        <div className='lg:col-span-4 flex flex-col gap-8'>
          <Sidebar />
        </div>
      </div>
      <RegionalFocus />
      <NewsletterSubscription />
      <ScrollToTop />
    </div>
  );
};

export default HomeSection;
