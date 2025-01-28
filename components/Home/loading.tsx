import NewsTickerLoading from './NewsTicker/loading';
import LatestArticleLoading from './LatestArticle/loading';
import ArticlesByTagsLoading from './ArticlesByTags/loading';
import SidebarLoading from './Sidebar/loading';
import RegionalFocusLoading from './RegionalFocus/loading';
import NewsletterSubscriptionLoading from './NewsletterSubscription/loading';

export default function Loading() {
  return (
    <div className='py-8'>
      <NewsTickerLoading />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8 space-y-12 md:space-y-2'>
          <LatestArticleLoading />
          <ArticlesByTagsLoading />
        </div>
        <div className='lg:col-span-4 flex flex-col gap-8'>
          <SidebarLoading />
        </div>
      </div>

      <div className='mt-8'>
        <RegionalFocusLoading />
      </div>

      <NewsletterSubscriptionLoading />
    </div>
  );
}
