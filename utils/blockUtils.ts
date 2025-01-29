import type { ContentBlock } from '@/types/contentBlocks';

export function createNewBlock(type: ContentBlock['type']): ContentBlock {
  const baseBlock = {
    type,
    content: '',
  };

  switch (type) {
    case 'text':
      return { ...baseBlock, type: 'text' };
    case 'image':
      return { ...baseBlock, type: 'image', imageUrl: '', imageAlt: '' };
    case 'gallery':
      return { ...baseBlock, type: 'gallery', images: [] };
    case 'video':
      return { ...baseBlock, type: 'video', videoUrl: '' };
    case 'quote':
      return { ...baseBlock, type: 'quote', spokesperson: '', role: '' };
    case 'highlight':
      return { ...baseBlock, type: 'highlight' };
    case 'callout':
      return { ...baseBlock, type: 'callout' };
    case 'heading':
      return { ...baseBlock, type: 'heading' };
    case 'separator':
      return { ...baseBlock, type: 'separator' };
    case 'list':
      return { ...baseBlock, type: 'list', items: [] };
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
  onUpdate: (imageUrl: string) => void,
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
