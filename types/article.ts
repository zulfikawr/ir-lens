import { ContentBlock } from '@/types/contentBlocks';

export type ArticleType = {
  articles: Array<{
    title: string;
    description: string;
    date: string;
    location?: string;
    labels: string[];
    coverImage: string;
    coverImageAlt: string;
    slug: string;
    blocks: ContentBlock[];
  }>;
};
