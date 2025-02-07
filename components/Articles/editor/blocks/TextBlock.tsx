import type React from 'react';
import type { TextBlockTypes } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';
import { useState } from 'react';

interface TextBlockProps {
  block: TextBlockTypes;
  isEditing?: boolean;
  onUpdateBlock?: (updates: Partial<TextBlockTypes>) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      setIsFocused(false);
      onUpdateBlock?.({ text: e.currentTarget.textContent || '' });
    },
  };

  if (!isEditing) {
    return (
      <p className='my-6 text-gray-800 text-md md:text-lg'>{block.text}</p>
    );
  }

  return (
    <div className='relative mt-2'>
      <p
        {...commonProps}
        className='w-full text-gray-800 text-md md:text-lg focus:outline-none min-h-[1.5em]'
      >
        {block.text}
      </p>
      {renderPlaceholder(isFocused, block.text) && (
        <span className='absolute top-0 left-0 pt-1 text-gray-400 pointer-events-none focus:outline-none'>
          Text...
        </span>
      )}
    </div>
  );
};
