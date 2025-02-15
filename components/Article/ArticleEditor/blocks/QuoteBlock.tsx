import type React from 'react';
import { useState } from 'react';
import { Quote } from 'lucide-react';
import type { QuoteBlockTypes } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface QuoteBlockProps {
  block: QuoteBlockTypes;
  isEditing: boolean;
  onUpdateBlock?: (updates: Partial<QuoteBlockTypes>) => void;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const commonProps = (
    field: string,
    onBlurHandler: (e: React.FocusEvent<HTMLElement>) => void,
  ) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setFocusedField(field),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      setFocusedField(null);
      onBlurHandler(e);
    },
  });

  if (!isEditing) {
    return (
      <div className='my-8 bg-gray-50 p-6 border border-black'>
        <Quote className='w-6 h-6 text-black mb-4' />
        <blockquote className='text-md md:text-lg italic text-gray-900'>
          {block.quote}
        </blockquote>
        <div className='mt-4'>
          <cite className='block font-semibold text-black not-italic'>
            {block.spokesperson}
          </cite>
          <span className='text-sm text-gray-600'>{block.role}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='border border-black p-4 mt-2'>
      <Quote className='w-6 h-6 text-black mb-4' />

      <div className='relative mb-4'>
        <blockquote
          {...commonProps('quote', (e) =>
            onUpdateBlock?.({ quote: e.currentTarget.textContent || '' }),
          )}
          className='text-md md:text-lg italic text-gray-900 focus:outline-none min-h-[1.5em]'
        >
          {block.quote}
        </blockquote>
        {renderPlaceholder(focusedField === 'quote', block.quote) && (
          <span className='absolute top-0 left-0 text-gray-400 pointer-events-none'>
            Quote...
          </span>
        )}
      </div>

      <div className='mt-4'>
        <div className='relative mb-2'>
          <cite
            {...commonProps('spokesperson', (e) =>
              onUpdateBlock?.({
                spokesperson: e.currentTarget.textContent || '',
              }),
            )}
            className='block font-semibold text-black not-italic focus:outline-none min-h-[1.5em]'
          >
            {block.spokesperson}
          </cite>
          {renderPlaceholder(
            focusedField === 'spokesperson',
            block.spokesperson,
          ) && (
            <span className='absolute top-0 left-0 text-gray-400 pointer-events-none text-sm'>
              Spokesperson...
            </span>
          )}
        </div>

        <div className='relative'>
          <span
            {...commonProps('role', (e) =>
              onUpdateBlock?.({ role: e.currentTarget.textContent || '' }),
            )}
            className='text-sm text-gray-600 focus:outline-none block min-h-[1.5em]'
          >
            {block.role}
          </span>
          {renderPlaceholder(focusedField === 'role', block.role) && (
            <span className='absolute top-0 left-0 text-gray-400 pointer-events-none text-sm'>
              Role...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
