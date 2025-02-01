import type { ContentBlock } from '@/types/contentBlocks';

export function createNewBlock(type: ContentBlock['type']): ContentBlock {
  switch (type) {
    case 'text':
      return { type: 'text', text: '' };
    case 'image':
      return { type: 'image', imgUrl: '', imgAlt: '' };
    case 'gallery':
      return { type: 'gallery', images: [] };
    case 'video':
      return { type: 'video', videoUrl: '', videoAlt: '' };
    case 'quote':
      return { type: 'quote', quote: '', spokesperson: '', role: '' };
    case 'highlight':
      return { type: 'highlight', highlight: '' };
    case 'callout':
      return { type: 'callout', callout: '' };
    case 'heading':
      return { type: 'heading', heading: '' };
    case 'separator':
      return { type: 'separator' };
    case 'list':
      return { type: 'list', items: [] };
    default:
      throw new Error(`Unsupported block type: ${type}`);
  }
}

export const renderPlaceholder = (
  isFocused: boolean,
  content: string,
): boolean => {
  return !isFocused && (!content || content.length === 0);
};

export const handleImageUpload = (
  file: File,
  onUpdate: (imgUrl: string) => void,
) => {
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    onUpdate(e.target?.result as string);
  };
  reader.readAsDataURL(file);
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};
