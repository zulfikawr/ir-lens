import type React from 'react';
import type { SeparatorBlock } from '@/types/contentBlocks';

interface SeparatorBlockProps {
  block: SeparatorBlock;
}

export const SeparatorBlockComponent: React.FC<SeparatorBlockProps> = () => {
  return (
    <div className='flex items-center'>
      <div className='flex-grow my-2 h-1 bg-black' />
    </div>
  );
};
