import type React from 'react';
import { useState } from 'react';
import type { ListBlock } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';

interface ListBlockProps {
  block: ListBlock;
  onUpdateBlock: (updates: Partial<ListBlock>) => void;
}

export const ListBlockComponent: React.FC<ListBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleListKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    itemIndex: number,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newItems = [...block.items];
      newItems.splice(itemIndex + 1, 0, '');
      onUpdateBlock({ items: newItems });

      setTimeout(() => {
        const nextItem = document.getElementById(`list-item-${itemIndex + 1}`);
        nextItem?.focus();
      }, 0);
    }

    if (
      e.key === 'Backspace' &&
      (e.target as HTMLDivElement).textContent === '' &&
      block.items.length > 1
    ) {
      e.preventDefault();
      const newItems = [...block.items];
      newItems.splice(itemIndex, 1);
      onUpdateBlock({ items: newItems });

      setTimeout(() => {
        const prevItem = document.getElementById(`list-item-${itemIndex - 1}`);
        prevItem?.focus();
      }, 0);
    }
  };

  const handleItemChange = (itemIndex: number, value: string) => {
    const newItems = [...block.items];
    newItems[itemIndex] = value;
    onUpdateBlock({ items: newItems });
  };

  const commonProps = (itemIndex: number) => ({
    id: `list-item-${itemIndex}`,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setFocusedIndex(itemIndex),
    onBlur: (e: React.FocusEvent<HTMLParagraphElement>) => {
      setFocusedIndex(null);
      handleItemChange(itemIndex, e.currentTarget.textContent || '');
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) =>
      handleListKeyDown(e, itemIndex),
  });

  return (
    <ul className='list-disc list-outside pl-6 space-y-2 my-2'>
      {(block.items.length ? block.items : ['']).map((item, itemIndex) => (
        <li
          key={itemIndex}
          className='relative marker:text-gray-500 pl-2 text-gray-800'
        >
          <p
            {...commonProps(itemIndex)}
            className='outline-none focus:outline-none min-h-[1.5em] text-md md:text-lg inline-block w-full'
          >
            {item}
          </p>
          {renderPlaceholder(focusedIndex === itemIndex, item) && (
            <span className='absolute -top-1 left-0 text-gray-400 pointer-events-none p-2 focus:outline-none'>
              List item...
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
