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
import type { ContentBlock } from '@/types/article';
import { renderEditableBlock } from './EditableBlock';

interface ContentBlocksProps {
  blocks: ContentBlock[];
  onAddBlock: (type: ContentBlock['type'], index?: number) => void;
  onUpdateBlock: (index: number, updates: Partial<ContentBlock>) => void;
  onRemoveBlock: (index: number) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
  updateArticle: (updates: Partial<{ blocks: ContentBlock[] }>) => void;
}

export function ContentBlocks({
  blocks,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  updateArticle,
}: ContentBlocksProps) {
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

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    if (draggedIndex === index) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);

    updateArticle({ blocks: newBlocks });
  };

  return (
    <>
      <div className='prose prose-lg max-w-none space-y-6'>
        {blocks.map((block, index) => (
          <div key={index} className='relative'>
            {renderEditableBlock(
              block,
              index,
              onUpdateBlock,
              onRemoveBlock,
              onAddBlock,
              onMoveBlock,
              handleDragStart,
              handleDragOver,
              handleDrop,
              blocks.length,
            )}
          </div>
        ))}
      </div>

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
    </>
  );
}
