import { ContentBlock } from '@/types/contentBlocks';

export interface ArticleData {
  type?: string;
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
}

export interface ArticleType {
  articles: ArticleData[];
}

export type Article = ArticleData;
