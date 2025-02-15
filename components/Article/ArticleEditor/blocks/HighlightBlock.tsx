import type React from 'react';
import { useState } from 'react';
import type { HighlightBlockTypes } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface HighlightBlockProps {
  block: HighlightBlockTypes;
  isEditing: boolean;
  onUpdateBlock?: (updates: Partial<HighlightBlockTypes>) => void;
}

export const HighlightBlock: React.FC<HighlightBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLParagraphElement>) => {
      setIsFocused(false);
      onUpdateBlock?.({ highlight: e.currentTarget.textContent || '' });
    },
  };

  if (!isEditing) {
    return (
      <div className='my-8 p-4 bg-black text-white'>
        <p className='text-md md:text-lg font-medium'>{block.highlight}</p>
      </div>
    );
  }

  return (
    <div className='bg-black p-4 relative mt-2'>
      <p
        {...commonProps}
        className='text-md md:text-lg text-white min-h-[1.5em] focus:outline-none'
      >
        {block.highlight}
      </p>
      {renderPlaceholder(isFocused, block.highlight) && (
        <span className='absolute top-0 left-0 p-4 text-gray-400 pointer-events-none focus:outline-none'>
          Highlight...
        </span>
      )}
    </div>
  );
};
