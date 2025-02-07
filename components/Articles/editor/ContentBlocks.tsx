// ContentBlocks.tsx
import type React from 'react';
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
import type { ContentBlock } from '@/types/contentBlocks';
import { BlockWrapper } from './BlockWrapper';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { GalleryBlock } from './blocks/GalleryBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { HighlightBlock } from './blocks/HighlightBlock';
import { CalloutBlock } from './blocks/CalloutBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ListBlock } from './blocks/ListBlock';
import { SeparatorBlock } from './blocks/SeparatorBlock';
import { HeadingBlock } from './blocks/HeadingBlock';

interface ContentBlocksProps {
  blocks: ContentBlock[];
  isEditing?: boolean;
  onUpdateBlock?: (index: number, updates: Partial<ContentBlock>) => void;
  onRemoveBlock?: (index: number) => void;
  onMoveBlock?: (fromIndex: number, toIndex: number) => void;
  onAddBlock?: (type: ContentBlock['type'], index?: number) => void;
}

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

export function ContentBlocks({
  blocks,
  isEditing = false,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onAddBlock,
}: ContentBlocksProps) {
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
    if (!isEditing || !onMoveBlock) return;
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    if (draggedIndex === index) return;
    onMoveBlock(draggedIndex, index);
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    const blockProps = {
      block,
      isEditing,
      onUpdateBlock: onUpdateBlock
        ? (updates: Partial<ContentBlock>) => onUpdateBlock(index, updates)
        : undefined,
    };

    switch (block.type) {
      case 'heading':
        return <HeadingBlock {...blockProps} block={block} />;
      case 'text':
        return <TextBlock {...blockProps} block={block} />;
      case 'image':
        return <ImageBlock {...blockProps} block={block} />;
      case 'gallery':
        return <GalleryBlock {...blockProps} block={block} />;
      case 'quote':
        return <QuoteBlock {...blockProps} block={block} />;
      case 'highlight':
        return <HighlightBlock {...blockProps} block={block} />;
      case 'callout':
        return <CalloutBlock {...blockProps} block={block} />;
      case 'video':
        return <VideoBlock {...blockProps} block={block} />;
      case 'list':
        return <ListBlock {...blockProps} block={block} />;
      case 'separator':
        return <SeparatorBlock {...blockProps} block={block} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className='prose prose-lg max-w-none space-y-6'>
        {blocks.map((block, index) => (
          <BlockWrapper
            key={index}
            isEditing={isEditing}
            block={block}
            index={index}
            totalBlocks={blocks.length}
            onRemoveBlock={onRemoveBlock}
            onMoveBlock={onMoveBlock}
            onAddBlock={onAddBlock}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {renderBlock(block, index)}
          </BlockWrapper>
        ))}
      </div>

      {isEditing && onAddBlock && (
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
                    onClick={() => onAddBlock(type)}
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
