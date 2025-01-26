export type ContentBlockBase = {
  content: string;
};

export type TextBlock = ContentBlockBase & {
  type: 'text';
};

export type ImageBlock = ContentBlockBase & {
  type: 'image';
  imageUrl: string;
  imageAlt?: string;
};

export type GalleryBlock = ContentBlockBase & {
  type: 'gallery';
  images: Array<{
    imageUrl: string;
    imageAlt?: string;
  }>;
};

export type VideoBlock = ContentBlockBase & {
  type: 'video';
  videoUrl: string;
};

export type QuoteBlock = ContentBlockBase & {
  type: 'quote';
  spokesperson: string;
  role: string;
};

export type HighlightBlock = ContentBlockBase & {
  type: 'highlight';
};

export type CalloutBlock = ContentBlockBase & {
  type: 'callout';
};

export type HeadingBlock = ContentBlockBase & {
  type: 'heading';
};

export type SeparatorBlock = ContentBlockBase & {
  type: 'separator';
};

export type ListBlock = ContentBlockBase & {
  type: 'list';
  items: string[];
};

export type SubheadingBlock = ContentBlockBase & {
  type: 'subheading';
};

export type ButtonBlock = ContentBlockBase & {
  type: 'button';
  url: string;
  label: string;
};

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock
  | QuoteBlock
  | HighlightBlock
  | CalloutBlock
  | HeadingBlock
  | SeparatorBlock
  | ListBlock
  | SubheadingBlock
  | ButtonBlock

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
