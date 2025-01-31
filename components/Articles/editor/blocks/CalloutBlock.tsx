import type React from 'react';
import type { CalloutBlock } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';
import { useState } from 'react';

interface CalloutBlockProps {
  block: CalloutBlock;
  onUpdateBlock: (updates: Partial<CalloutBlock>) => void;
}

export const CalloutBlockComponent: React.FC<CalloutBlockProps> = ({
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
      onUpdateBlock({ callout: e.currentTarget.textContent || '' });
    },
  };

  return (
    <div className='border-l-4 border-black bg-gray-200 p-4 relative mt-2'>
      <p
        {...commonProps}
        className='text-md md:text-lg text-gray-800 min-h-[1.5em] focus:outline-none'
      >
        {block.callout}
      </p>
      {renderPlaceholder(isFocused, block.callout) && (
        <span className='absolute top-0 left-0 p-4 text-gray-400 pointer-events-none focus:outline-none'>
          Callout...
        </span>
      )}
    </div>
  );
};
