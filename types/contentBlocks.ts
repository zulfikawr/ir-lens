export type TextBlockTypes = {
  type: 'text';
  text: string;
};

export type ImageBlockTypes = {
  type: 'image';
  imgUrl: string;
  imgAlt?: string;
};

export type GalleryBlockTypes = {
  type: 'gallery';
  images: Array<{
    imgUrl: string;
    imgAlt?: string;
  }>;
};

export type VideoBlockTypes = {
  type: 'video';
  videoUrl: string;
  videoAlt?: string;
};

export type QuoteBlockTypes = {
  type: 'quote';
  quote: string;
  spokesperson: string;
  role: string;
};

export type HighlightBlockTypes = {
  type: 'highlight';
  highlight: string;
};

export type CalloutBlockTypes = {
  type: 'callout';
  callout: string;
};

export type HeadingBlockTypes = {
  type: 'heading';
  heading: string;
};

export type SeparatorBlockTypes = {
  type: 'separator';
};

export type ListBlockTypes = {
  type: 'list';
  items: string[];
};

export type ContentBlock =
  | TextBlockTypes
  | ImageBlockTypes
  | GalleryBlockTypes
  | VideoBlockTypes
  | QuoteBlockTypes
  | HighlightBlockTypes
  | CalloutBlockTypes
  | HeadingBlockTypes
  | SeparatorBlockTypes
  | ListBlockTypes;
