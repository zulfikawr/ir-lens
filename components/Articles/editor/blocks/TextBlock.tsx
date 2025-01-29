import type React from 'react';
import type { TextBlock } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';
import { useState } from 'react';

interface TextBlockProps {
  block: TextBlock;
  onUpdateBlock: (updates: Partial<TextBlock>) => void;
}

export const TextBlockComponent: React.FC<TextBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      setIsFocused(false);
      onUpdateBlock({ content: e.currentTarget.textContent || '' });
    },
  };

  return (
    <div className='relative mt-2'>
      <p
        {...commonProps}
        className='w-full text-gray-800 text-md md:text-lg focus:outline-none min-h-[1.5em]'
      >
        {block.content}
      </p>
      {renderPlaceholder(isFocused, block.content) && (
        <span className='absolute top-0 left-0 pt-1 text-gray-400 pointer-events-none focus:outline-none'>
          Text...
        </span>
      )}
    </div>
  );
};
