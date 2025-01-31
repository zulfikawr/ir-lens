import type React from 'react';
import type { ContentBlock } from '@/types/contentBlocks';
import { TextBlockComponent } from './blocks/TextBlock';
import { ImageBlockComponent } from './blocks/ImageBlock';
import { GalleryBlockComponent } from './blocks/GalleryBlock';
import { QuoteBlockComponent } from './blocks/QuoteBlock';
import { HighlightBlockComponent } from './blocks/HighlightBlock';
import { CalloutBlockComponent } from './blocks/CalloutBlock';
import { VideoBlockComponent } from './blocks/VideoBlock';
import { ListBlockComponent } from './blocks/ListBlock';
import { SeparatorBlockComponent } from './blocks/SeparatorBlock';
import { HeadingBlockComponent } from './blocks/HeadingBlock';
import { Button } from '@/components/ui/button';
import {
  Trash,
  ChevronUp,
  ChevronDown,
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

interface EditableBlockProps {
  block: ContentBlock;
  index: number;
  onUpdateBlock: (index: number, updates: Partial<ContentBlock>) => void;
  onRemoveBlock: (index: number) => void;
  onAddBlock: (type: ContentBlock['type'], index?: number) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  totalBlocks: number;
}

export function EditableBlock({
  block,
  index,
  onUpdateBlock,
  onRemoveBlock,
  onAddBlock,
  onMoveBlock,
  onDragStart,
  onDragOver,
  onDrop,
  totalBlocks,
}: EditableBlockProps) {

  const blockWrapperClasses =
    'border border-gray-200 p-4 relative group flex flex-col justify-between hover:shadow-lg transition-shadow duration-200';
  const contentWrapperClasses = 'flex-grow';

  const blockTypes = [
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

  const BlockTypeLabel = ({
    type,
    onDragStart,
    onDragOver,
    onDrop,
  }: {
    type: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  }) => {
    const blockType = blockTypes.find((block) => block.type === type);
    if (!blockType) return null;

    const { icon: Icon, label } = blockType;

    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className='capitalize absolute -top-4 -left-1 border border-gray-300 text-xs text-gray-500 bg-gray-100 px-2 py-1 cursor-move flex items-center space-x-2'
      >
        <Icon className='w-4 h-4' />
        <span>{label}</span>
      </div>
    );
  };

  const BlockActions = () => (
    <div className='absolute -top-4 -right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
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
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onRemoveBlock(index)}
        className='border border-gray-300 text-xs text-gray-500 bg-red-200 px-2 py-1 cursor-pointer text-red-400 hover:bg-red-400 hover:text-red-50'
      >
        <Trash className='w-4 h-4' />
      </Button>
    </div>
  );

  const AddBlockButton = () => (
    <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='border border-gray-300 bg-gray-100 px-2 py-1 cursor-pointer'
          >
            <Plus className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuGroup>
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <DropdownMenuItem
                key={type}
                onClick={() => onAddBlock(type, index + 1)}
              >
                <Icon className='mr-2 h-4 w-4' />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <TextBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'image':
        return (
          <ImageBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'gallery':
        return (
          <GalleryBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'quote':
        return (
          <QuoteBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'highlight':
        return (
          <HighlightBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'callout':
        return (
          <CalloutBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'video':
        return (
          <VideoBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'list':
        return (
          <ListBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      case 'separator':
        return <SeparatorBlockComponent block={block} />;
      case 'heading':
        return (
          <HeadingBlockComponent
            block={block}
            onUpdateBlock={(updates) => onUpdateBlock(index, updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={blockWrapperClasses}>
      <BlockTypeLabel
        type={block.type}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
      />
      <BlockActions />
      <div className={contentWrapperClasses}>{renderBlockContent()}</div>
      <AddBlockButton />
    </div>
  );
}

export function renderEditableBlock(
  block: ContentBlock,
  index: number,
  onUpdateBlock: (index: number, updates: Partial<ContentBlock>) => void,
  onRemoveBlock: (index: number) => void,
  onAddBlock: (type: ContentBlock['type'], index?: number) => void,
  onMoveBlock: (fromIndex: number, toIndex: number) => void,
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
  totalBlocks: number,
) {
  return (
    <EditableBlock
      key={index}
      block={block}
      index={index}
      onUpdateBlock={onUpdateBlock}
      onRemoveBlock={onRemoveBlock}
      onAddBlock={onAddBlock}
      onMoveBlock={onMoveBlock}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      totalBlocks={totalBlocks}
    />
  );
}
