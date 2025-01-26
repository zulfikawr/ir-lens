import NewsTickerLoading from "./NewsTicker/loading";
import LatestArticleLoading from "./LatestArticle/loading";
import MasonryArticleLoading from "./MasonryArticle/loading";
import SidebarLoading from "./Sidebar/loading";
import RegionalFocusLoading from "./RegionalFocus/loading";
import NewsletterSubscriptionLoading from "./NewsletterSubscription/loading";

export default function Loading() {
  return (
    <div className="py-8">
      <NewsTickerLoading />

      <LatestArticleLoading />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <MasonryArticleLoading />
        </div>
        <div className="lg:col-span-4">
          <SidebarLoading />
        </div>
      </div>

      <RegionalFocusLoading />

      <NewsletterSubscriptionLoading />
    </div>
  );
}