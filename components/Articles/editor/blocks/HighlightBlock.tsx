import type React from 'react';
import { useState } from 'react';
import type { HighlightBlock } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface HighlightBlockProps {
  block: HighlightBlock;
  onUpdateBlock: (updates: Partial<HighlightBlock>) => void;
}

export const HighlightBlockComponent: React.FC<HighlightBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLParagraphElement>) => {
      setIsFocused(false);
      onUpdateBlock({ content: e.currentTarget.textContent || '' });
    },
  };

  return (
    <div className='bg-black p-4 relative mt-2'>
      <p
        {...commonProps}
        className='text-md md:text-lg text-white min-h-[1.5em] focus:outline-none'
      >
        {block.content}
      </p>
      {renderPlaceholder(isFocused, block.content) && (
        <span className='absolute top-0 left-0 p-4 text-gray-400 pointer-events-none focus:outline-none'>
          Highlight...
        </span>
      )}
    </div>
  );
};
