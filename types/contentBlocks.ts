export type TextBlock = {
  type: 'text';
  text: string;
};

export type ImageBlock = {
  type: 'image';
  imgUrl: string;
  imgAlt?: string;
};

export type GalleryBlock = {
  type: 'gallery';
  images: Array<{
    imgUrl: string;
    imgAlt?: string;
  }>;
};

export type VideoBlock = {
  type: 'video';
  videoUrl: string;
  videoAlt?: string;
};

export type QuoteBlock = {
  type: 'quote';
  quote: string;
  spokesperson: string;
  role: string;
};

export type HighlightBlock = {
  type: 'highlight';
  highlight: string;
};

export type CalloutBlock = {
  type: 'callout';
  callout: string;
};

export type HeadingBlock = {
  type: 'heading';
  heading: string;
};

export type SeparatorBlock = {
  type: 'separator';
};

export type ListBlock = {
  type: 'list';
  items: string[];
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
  | ListBlock;
