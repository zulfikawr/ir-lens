import { ContentBlock } from '@/types/contentBlocks';

export type ArticleType = {
  articles: Array<{
    title: string;
    description: string;
    date: string;
    location: string;
    tag: string;
    region: string;
    coverImg: string;
    coverImgAlt: string;
    slug: string;
    headline?: boolean;
    views?: number;
    blocks: ContentBlock[];
  }>;
};
