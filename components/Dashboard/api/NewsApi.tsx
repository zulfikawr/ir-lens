'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Newspaper } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Article } from '@/types/article';
import { ContentBlock } from '@/types/contentBlocks';
import { useToast } from '@/hooks/useToast';
import ArticleCard from '@/components/Home/ArticleCard';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle/PageTitle';
import { FetchedArticle, NEWS_SOURCES } from '@/types/newsApi';

export default function NewsApiPage() {
  const [articles, setArticles] = useState<FetchedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const handleFetchArticles = async (isLoadMore: boolean = false) => {
    if (!selectedSource) {
      toast({
        title: 'Error',
        description: 'Please select a news source',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `/api/article/fetch-news?source=${selectedSource}&offset=${isLoadMore ? offset : 0}`;
      const response = await fetch(url);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch articles');
      }
      const data = await response.json();
      if (isLoadMore) {
        setArticles((prev) => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      setOffset((prev) => (isLoadMore ? prev + 1 : 1));
      setHasMore(data.articles.length > 0);
      toast({
        title: 'Articles fetched',
        description: `Successfully loaded ${data.articles.length} articles`,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching articles';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSelectArticle = async (newsArticle: FetchedArticle) => {
    setSelectingId(newsArticle.id);
    try {
      // Try to enhance with AI
      const response = await fetch('/api/article/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsArticle.title,
          content: newsArticle.content,
          defaultTag: newsArticle.tag || 'Diplomacy',
          defaultRegion: newsArticle.region || 'Global',
        }),
      });
      let enhancedData: any = null;
      if (response.ok) {
        enhancedData = await response.json();
        toast({
          title: 'Success',
          description: 'Article enhanced with AI',
        });
      } else {
        toast({
          title: 'Info',
          description: 'Using raw article data',
        });
      }
      // Generate slug
      const slug = (enhancedData?.title || newsArticle.title)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      // Parse date
      const date = new Date(newsArticle.publishedAt).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      );
      // Use AI-provided blocks when available. If AI failed, fallback to a single text block.
      const blocks: ContentBlock[] = enhancedData?.blocks || [
        {
          type: 'text',
          text:
            enhancedData?.description ||
            enhancedData?.rewrittenContent ||
            newsArticle.content ||
            newsArticle.description,
        },
      ];
      const articleData: Partial<Article> = {
        title: enhancedData?.title || newsArticle.title,
        description: enhancedData?.description || newsArticle.description,
        date,
        location: enhancedData?.location || '',
        coverImg: newsArticle.urlToImage,
        coverImgAlt: `Image from ${newsArticle.source}: ${enhancedData?.title || newsArticle.title}`,
        blocks,
        slug,
        tag: enhancedData?.tag || newsArticle.tag,
        region: enhancedData?.region || newsArticle.region,
      };
      // Store in sessionStorage to pass to create page
      sessionStorage.setItem('importedArticle', JSON.stringify(articleData));

      // Redirect to create page
      router.push('/dashboard/articles/create?import=session');
    } catch (err) {
      console.error('Error selecting article:', err);
      toast({
        title: 'Error',
        description: 'Failed to process article',
        variant: 'destructive',
      });
    } finally {
      setSelectingId(null);
    }
  };
  // Map FetchedArticle to Article for display
  const mapToArticle = (fetched: FetchedArticle): Article => ({
    title: fetched.title,
    description: fetched.description,
    date: new Date(fetched.publishedAt).toLocaleDateString(),
    location: fetched.region || 'Global',
    tag: fetched.tag || 'News',
    region: fetched.region || 'Global',
    coverImg: fetched.urlToImage,
    coverImgAlt: fetched.title,
    slug: fetched.id,
    blocks: [], // Not needed for card display
  });
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
      <PageTitle
        icon={<Newspaper />}
        title='News API Integration'
        description='Fetch and process news from external providers'
      />
      <div className='flex flex-col md:flex-row gap-4 items-end mb-8 bg-white p-6 shadow-sm border'>
        <div className='flex-1 w-full'>
          <label className='block text-sm font-medium mb-2'>News Source</label>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger>
              <SelectValue placeholder='Select a news source...' />
            </SelectTrigger>
            <SelectContent>
              {NEWS_SOURCES.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => handleFetchArticles(false)}
          disabled={loading || !selectedSource}
          className='w-full md:w-auto flex items-center gap-2'
        >
          {loading ? (
            <>
              <Loader className='w-4 h-4 animate-spin' />
              Fetching...
            </>
          ) : (
            'Fetch Articles'
          )}
        </Button>
      </div>

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-sm mb-8'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articles.map((article, index) => (
          <div key={article.id} className='relative h-[250px] w-full'>
            {/* Overlay loader when processing this specific article */}
            {selectingId === article.id && (
              <div className='absolute inset-0 z-50 bg-white/80 flex flex-col items-center justify-center'>
                <Loader className='w-8 h-8 animate-spin text-primary mb-2' />
                <span className='text-sm font-medium text-primary'>
                  Processing...
                </span>
              </div>
            )}

            <ArticleCard
              article={mapToArticle(article)}
              cardIndex={index}
              activeIndex={-1}
              isStatic
              onClick={() => handleSelectArticle(article)}
            />
          </div>
        ))}
      </div>
      {articles.length > 0 && hasMore && (
        <div className='flex justify-center mt-12'>
          <Button
            onClick={() => handleFetchArticles(true)}
            disabled={loading}
            variant='outline'
            className='flex items-center gap-2'
          >
            {loading ? (
              <>
                <Loader className='w-4 h-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
