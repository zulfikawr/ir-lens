import type React from 'react';
import type { SeparatorBlockTypes } from '@/types/contentBlocks';

interface SeparatorBlockProps {
  block: SeparatorBlockTypes;
}

export const SeparatorBlock: React.FC<SeparatorBlockProps> = () => {
  return (
    <div className='flex items-center'>
      <div className='flex-grow my-2 h-1 bg-black' />
    </div>
  );
};
