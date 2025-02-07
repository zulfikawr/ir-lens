import type React from 'react';
import { useState } from 'react';
import type { HeadingBlockTypes } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface HeadingBlockProps {
  block: HeadingBlockTypes;
  isEditing?: boolean;
  onUpdateBlock?: (updates: Partial<HeadingBlockTypes>) => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLHeadingElement>) => {
      setIsFocused(false);
      onUpdateBlock?.({ heading: e.currentTarget.textContent || '' });
    },
  };

  if (!isEditing) {
    return (
      <h2 className='my-6 text-2xl font-bold text-black'>{block.heading}</h2>
    );
  }

  return (
    <div className='relative mt-2'>
      <h2
        {...commonProps}
        className='w-full text-2xl font-bold text-black focus:outline-none min-h-[1.5em]'
      >
        {block.heading}
      </h2>
      {renderPlaceholder(isFocused, block.heading) && (
        <span className='absolute top-0 left-0 pt-1 text-gray-400 pointer-events-none focus:outline-none'>
          Heading...
        </span>
      )}
    </div>
  );
};
