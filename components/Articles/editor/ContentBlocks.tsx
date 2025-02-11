import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Heading,
  Text,
  Image,
  Layout,
  Quote,
  Star,
  AlertCircle,
  Video,
  List,
  Minus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
  CalloutBlockTypes,
  ContentBlock,
  GalleryBlockTypes,
  HeadingBlockTypes,
  HighlightBlockTypes,
  ImageBlockTypes,
  ListBlockTypes,
  QuoteBlockTypes,
  SeparatorBlockTypes,
  TextBlockTypes,
  VideoBlockTypes,
} from '@/types/contentBlocks';
import { BlockWrapper } from './BlockWrapper';
import { TextBlock } from './blocks/TextBlock/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { HighlightBlock } from './blocks/HighlightBlock';
import { CalloutBlock } from './blocks/CalloutBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ListBlock } from './blocks/ListBlock';
import { SeparatorBlock } from './blocks/SeparatorBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { createNewBlock } from '@/utils/blockUtils';

export const blockTypes = [
  { type: 'heading', label: 'Heading', icon: Heading },
  { type: 'text', label: 'Text', icon: Text },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'gallery', label: 'Gallery', icon: Layout },
  { type: 'quote', label: 'Quote', icon: Quote },
  { type: 'highlight', label: 'Highlight', icon: Star },
  { type: 'callout', label: 'Callout', icon: AlertCircle },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'list', label: 'List', icon: List },
  { type: 'separator', label: 'Separator', icon: Minus },
] as const;

interface ContentBlocksProps {
  blocks: ContentBlock[];
  isEditing?: boolean;
  onUpdateBlocks?: (blocks: ContentBlock[]) => void;
}

export function ContentBlocks({
  blocks = [],
  isEditing = false,
  onUpdateBlocks,
}: ContentBlocksProps) {
  const addBlock = useCallback(
    (type: ContentBlock['type'], index?: number) => {
      const newBlock = createNewBlock(type);
      const newBlocks = [...blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      onUpdateBlocks?.(newBlocks);
    },
    [blocks, onUpdateBlocks],
  );

  const updateBlock = useCallback(
    (index: number, updates: Partial<ContentBlock>) => {
      const newBlocks = blocks.map((block, i) => {
        if (i !== index) return block;
        return { ...block, ...updates } as ContentBlock;
      });
      onUpdateBlocks?.(newBlocks);
    },
    [blocks, onUpdateBlocks],
  );

  const removeBlock = useCallback(
    (index: number) => {
      const newBlocks = blocks.filter((_, i) => i !== index);
      onUpdateBlocks?.(newBlocks);
    },
    [blocks, onUpdateBlocks],
  );

  const moveBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      onUpdateBlocks?.(newBlocks);
    },
    [blocks, onUpdateBlocks],
  );

  const duplicateBlock = useCallback(
    (index: number) => {
      const newBlocks = [...blocks];
      const blockToDuplicate = { ...blocks[index] };
      newBlocks.splice(index + 1, 0, blockToDuplicate);
      onUpdateBlocks?.(newBlocks);
    },
    [blocks, onUpdateBlocks],
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (!isEditing) return;
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isEditing) return;
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    if (draggedIndex === index) return;
    moveBlock(draggedIndex, index);
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    const blockProps = {
      block,
      isEditing,
      onUpdateBlock: (updates: Partial<ContentBlock>) =>
        updateBlock(index, updates),
    };

    switch (block.type) {
      case 'heading':
        return (
          <HeadingBlock {...blockProps} block={block as HeadingBlockTypes} />
        );
      case 'text':
        return <TextBlock {...blockProps} block={block as TextBlockTypes} />;
      case 'image':
        return <ImageBlock {...blockProps} block={block as ImageBlockTypes} />;
      case 'gallery':
        return (
          <GalleryBlock {...blockProps} block={block as GalleryBlockTypes} />
        );
      case 'quote':
        return <QuoteBlock {...blockProps} block={block as QuoteBlockTypes} />;
      case 'highlight':
        return (
          <HighlightBlock
            {...blockProps}
            block={block as HighlightBlockTypes}
          />
        );
      case 'callout':
        return (
          <CalloutBlock {...blockProps} block={block as CalloutBlockTypes} />
        );
      case 'video':
        return <VideoBlock {...blockProps} block={block as VideoBlockTypes} />;
      case 'list':
        return <ListBlock {...blockProps} block={block as ListBlockTypes} />;
      case 'separator':
        return (
          <SeparatorBlock
            {...blockProps}
            block={block as SeparatorBlockTypes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className='prose prose-lg max-w-none space-y-6 md:space-y-8'>
        {blocks.map((block, index) => (
          <BlockWrapper
            key={index}
            isEditing={isEditing}
            block={block}
            index={index}
            totalBlocks={blocks.length}
            onRemoveBlock={removeBlock}
            onMoveBlock={moveBlock}
            onDuplicateBlock={duplicateBlock}
            onAddBlock={addBlock}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {renderBlock(block, index)}
          </BlockWrapper>
        ))}
      </div>

      {isEditing && (
        <div className='flex justify-center mt-8'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {blockTypes.map(({ type, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => addBlock(type)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    <Icon className='w-4 h-4' />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
