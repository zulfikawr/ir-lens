'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Article } from '@/types/article';
import { ContentBlock } from '@/types/contentBlocks';
import { useToast } from '@/hooks/useToast';

interface FetchedArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  source: string;
  content: string;
  url: string;
  tag?: string;
  region?: string;
}

interface NewsArticleModalProps {
  onSelectArticle: (article: Partial<Article>) => void;
}

interface NewsSource {
  id: string;
  name: string;
}

const NEWS_SOURCES: NewsSource[] = [
  { id: 'al-jazeera-english', name: 'Al Jazeera English' },
  { id: 'associated-press', name: 'Associated Press' },
];

export function NewsArticleModal({ onSelectArticle }: NewsArticleModalProps) {
  const [articles, setArticles] = useState<FetchedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

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

      // Populate form with article data (enhanced or raw)
      onSelectArticle({
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
      });

      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <Newspaper className='w-4 h-4' />
          Fetch from News API
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Select an Article from Latest News</DialogTitle>
          <DialogDescription>
            Choose a news source and select an article to auto-fill your article
            form
          </DialogDescription>
        </DialogHeader>

        {/* Source Selector */}
        <div className='flex gap-2 items-end'>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-2'>
              News Source
            </label>
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
            className='flex items-center gap-2'
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
          <div className='p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
            {error}
          </div>
        )}

        {articles.length === 0 && !error && !loading && (
          <div className='p-4 text-center text-gray-500'>
            Select a news source and click &quot;Fetch Articles&quot; to load
            the latest news
          </div>
        )}

        <div className='space-y-4'>
          {articles.map((article) => (
            <div
              key={article.id}
              className='border rounded-lg overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='flex gap-4 p-4'>
                {/* Article Image */}
                {article.urlToImage && (
                  <div className='flex-shrink-0 w-24 h-24 relative rounded overflow-hidden'>
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className='object-cover'
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/images/default-cover.jpg';
                      }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className='flex-1 flex flex-col gap-2'>
                  <h3 className='font-semibold text-sm line-clamp-2'>
                    {article.title}
                  </h3>
                  <p className='text-xs text-gray-600 line-clamp-2'>
                    {article.description}
                  </p>
                  <div className='flex items-center justify-between mt-auto gap-2'>
                    <div className='text-xs text-gray-500'>
                      <p>{article.source}</p>
                      <p>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size='sm'
                      onClick={() => handleSelectArticle(article)}
                      disabled={selectingId === article.id}
                      className='flex items-center gap-1'
                    >
                      {selectingId === article.id ? (
                        <>
                          <Loader className='w-3 h-3 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {articles.length > 0 && hasMore && (
          <div className='flex justify-center pt-4'>
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
      </DialogContent>
    </Dialog>
  );
}
