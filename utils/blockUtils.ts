import type { ContentBlock } from '@/types/article';

export function createNewBlock(type: ContentBlock['type']): ContentBlock {
  switch (type) {
    case 'text':
      return { type, content: '' };
    case 'image':
      return { type, imageUrl: '', imageAlt: '', content: '' };
    case 'gallery':
      return { type, images: [], content: '' };
    case 'video':
      return { type, videoUrl: '', content: '' };
    case 'quote':
      return { type, spokesperson: '', role: '', content: '' };
    case 'highlight':
      return { type, content: '' };
    case 'callout':
      return { type, content: '' };
    case 'heading':
      return { type, content: '' };
    case 'separator':
      return { type, content: '' };
    case 'list':
      return { type, items: [], content: '' };
    default:
      throw new Error(`Unsupported block type: ${type}`);
  }
}
