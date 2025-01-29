import type React from 'react';
import { useState } from 'react';
import type { HeadingBlock } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface HeadingBlockProps {
  block: HeadingBlock;
  onUpdateBlock: (updates: Partial<HeadingBlock>) => void;
}

export const HeadingBlockComponent: React.FC<HeadingBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLHeadingElement>) => {
      setIsFocused(false);
      onUpdateBlock({ content: e.currentTarget.textContent || '' });
    },
  };

  return (
    <div className='relative mt-2'>
      <h2
        {...commonProps}
        className='w-full text-2xl font-bold text-black focus:outline-none min-h-[1.5em]'
      >
        {block.content}
      </h2>
      {renderPlaceholder(isFocused, block.content) && (
        <span className='absolute top-0 left-0 pt-1 text-gray-400 pointer-events-none focus:outline-none'>
          Heading...
        </span>
      )}
    </div>
  );
};
