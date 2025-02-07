import type React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import type { ContentBlock } from '@/types/contentBlocks';
import { blockTypes } from './ContentBlocks';

interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  onRemoveBlock?: (index: number) => void;
  onMoveBlock?: (fromIndex: number, toIndex: number) => void;
  onAddBlock?: (type: ContentBlock['type'], index?: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

export function BlockWrapper({
  children,
  isEditing,
  block,
  index,
  totalBlocks,
  onRemoveBlock,
  onMoveBlock,
  onAddBlock,
  onDragStart,
  onDragOver,
  onDrop,
}: BlockWrapperProps) {
  if (!isEditing) {
    return <>{children}</>;
  }

  const blockType = blockTypes.find((t) => t.type === block.type);
  const Icon = blockType?.icon;

  return (
    <div className='border border-gray-200 p-4 relative group flex flex-col justify-between hover:shadow-lg transition-shadow duration-200'>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        className='capitalize absolute -top-4 -left-1 border border-gray-300 text-xs text-gray-500 bg-gray-100 px-2 py-1 cursor-move flex items-center space-x-2'
      >
        {Icon && <Icon className='w-4 h-4' />}
        <span>{blockType?.label}</span>
      </div>

      <div className='absolute -top-4 -right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        {onMoveBlock && (
          <>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onMoveBlock(index, index - 1)}
              disabled={index === 0}
              className='border border-gray-300 bg-gray-100 px-2 py-1 cursor-pointer'
            >
              <ChevronUp className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onMoveBlock(index, index + 1)}
              disabled={index === totalBlocks - 1}
              className='border border-gray-300 bg-gray-100 px-2 py-1 cursor-pointer'
            >
              <ChevronDown className='w-4 h-4' />
            </Button>
          </>
        )}
        {onRemoveBlock && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onRemoveBlock(index)}
            className='border border-gray-300 text-xs text-gray-500 bg-red-200 px-2 py-1 cursor-pointer text-red-400 hover:bg-red-400 hover:text-red-50'
          >
            <Trash className='w-4 h-4' />
          </Button>
        )}
      </div>

      <div className='flex-grow'>{children}</div>

      {onAddBlock && (
        <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAddBlock('text', index + 1)}
            className='border border-gray-300 bg-gray-100 px-2 py-1 cursor-pointer'
          >
            <Plus className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
}
