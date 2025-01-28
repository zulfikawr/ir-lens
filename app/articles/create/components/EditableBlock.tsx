import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Quote, Plus, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContentBlock } from '@/types/article';

interface EditableBlockProps {
  block: ContentBlock;
  index: number;
  onUpdateBlock: (index: number, updates: Partial<ContentBlock>) => void;
  onRemoveBlock: (index: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

export function EditableBlock({
  block,
  index,
  onUpdateBlock,
  onRemoveBlock,
  onDragStart,
  onDragOver,
  onDrop,
}: EditableBlockProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const commonProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setIsFocused(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      setIsFocused(false);
      onUpdateBlock(index, { content: e.currentTarget.textContent || '' });
    },
  };

  const blockWrapperClasses =
    'border border-gray-200 p-4 rounded-tr-lg rounded-br-lg rounded-bl-lg relative group flex justify-between hover:shadow-lg transition-shadow duration-200';
  const contentWrapperClasses = 'flex-grow';

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
  }) => (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className='capitalize absolute -top-4 -left-1 border border-gray-300 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg cursor-move'
    >
      {type}
    </div>
  );

  const RemoveBlockButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant='ghost'
      size='sm'
      onClick={onClick}
      className='absolute -top-4 -right-1 border border-gray-300 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg cursor-pointer ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-400 hover:bg-red-50 z-10'
    >
      <Trash className='w-4 h-4 text-red-400' />
    </Button>
  );

  const handleImageUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdateBlock(index, { imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageAltChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageIndex?: number,
  ) => {
    if (block.type === 'image') {
      onUpdateBlock(index, { imageAlt: e.target.value });
    } else if (block.type === 'gallery' && typeof imageIndex === 'number') {
      const updatedImages = [...block.images];
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        imageAlt: e.target.value,
      };
      onUpdateBlock(index, { images: updatedImages });
    }
  };

  const handleAddImage = (file: File) => {
    if (block.type === 'gallery') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = { imageUrl: e.target?.result as string, imageAlt: '' };
        onUpdateBlock(index, { images: [...block.images, newImage] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    if (block.type === 'gallery') {
      const updatedImages = block.images.filter((_, i) => i !== imageIndex);
      onUpdateBlock(index, { images: updatedImages });
    }
  };

  const handleNextImage = () => {
    if (block.type === 'gallery') {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === block.images.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };

  const handlePrevImage = () => {
    if (block.type === 'gallery') {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? block.images.length - 1 : prevIndex - 1,
      );
    }
  };

  const renderPlaceholder = (text: string) => {
    if (isFocused || (block.content && block.content.length > 0)) return null;
    return (
      <span className='absolute top-0 left-0 text-gray-400 pointer-events-none p-2 focus:outline-none'>
        {text}
      </span>
    );
  };

  switch (block.type) {
    case 'text':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={`${contentWrapperClasses} relative`}>
            <p
              {...commonProps}
              className='w-full text-gray-800 text-md md:text-lg focus:outline-none min-h-[1.5em]'
            >
              {block.content}
            </p>
            {renderPlaceholder('Start typing...')}
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'heading':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={`${contentWrapperClasses} relative`}>
            <h2
              {...commonProps}
              className='w-full my-2 text-2xl font-bold text-black focus:outline-none min-h-[1.5em]'
            >
              {block.content}
            </h2>
            {renderPlaceholder('Heading...')}
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'image':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={`${contentWrapperClasses} relative`}>
            <div
              className='relative w-full max-w-4xl h-[300px] mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden'
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {block.imageUrl ? (
                <Image
                  src={block.imageUrl || '/images/default-fallback-image.png'}
                  alt={block.imageAlt || 'Uploaded image'}
                  className='object-cover'
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              ) : (
                <label className='absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileSelect}
                  />
                  <div className='text-center p-4'>
                    <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      Drop an image here, or click to select
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                      Maximum size: 2MB
                    </p>
                  </div>
                </label>
              )}
            </div>
            <input
              type='text'
              value={block.imageAlt || ''}
              onChange={(e) => handleImageAltChange(e)}
              className='w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none'
              placeholder='Enter alt text for the image'
            />
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'quote':
      return (
        <div className={`${blockWrapperClasses} bg-gray-50`}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={contentWrapperClasses}>
            <Quote className='w-6 h-6 text-black mb-4' />
            <div className='relative mb-4'>
              <blockquote
                {...commonProps}
                className='text-md md:text-lg italic text-gray-900 focus:outline-none min-h-[1.5em]'
                onFocus={() => setFocusedField('quote')}
                onBlur={(e) => {
                  setFocusedField(null);
                  onUpdateBlock(index, {
                    content: e.currentTarget.textContent || '',
                  });
                }}
              >
                {block.content}
              </blockquote>
              {focusedField !== 'quote' && !block.content && (
                <span className='absolute top-0 left-0 text-gray-400 pointer-events-none'>
                  Quote...
                </span>
              )}
            </div>
            <div className='mt-4'>
              <div className='relative mb-2'>
                <cite
                  {...commonProps}
                  className='block font-semibold text-black not-italic focus:outline-none min-h-[1.5em]'
                  onFocus={() => setFocusedField('spokesperson')}
                  onBlur={(e) => {
                    setFocusedField(null);
                    onUpdateBlock(index, {
                      spokesperson: e.currentTarget.textContent || '',
                    });
                  }}
                >
                  {block.spokesperson}
                </cite>
                {focusedField !== 'spokesperson' && !block.spokesperson && (
                  <span className='absolute top-0 left-0 text-gray-400 pointer-events-none text-sm'>
                    Spokesperson...
                  </span>
                )}
              </div>
              <div className='relative'>
                <span
                  {...commonProps}
                  className='text-sm text-gray-600 focus:outline-none block min-h-[1.5em]'
                  onFocus={() => setFocusedField('role')}
                  onBlur={(e) => {
                    setFocusedField(null);
                    onUpdateBlock(index, {
                      role: e.currentTarget.textContent || '',
                    });
                  }}
                >
                  {block.role}
                </span>
                {focusedField !== 'role' && !block.role && (
                  <span className='absolute top-0 left-0 text-gray-400 pointer-events-none text-sm'>
                    Role...
                  </span>
                )}
              </div>
            </div>
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'gallery':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={`${contentWrapperClasses} relative`}>
            <div className='my-8 relative w-full max-w-4xl mx-auto'>
              {block.images.length > 0 ? (
                <>
                  <div className='relative w-full h-[300px] md:h-[500px]'>
                    <Image
                      src={
                        block.images[currentImageIndex].imageUrl ||
                        '/placeholder.svg'
                      }
                      alt={
                        block.images[currentImageIndex].imageAlt ||
                        `Gallery image ${currentImageIndex + 1}`
                      }
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover shadow-none border border-black'
                      fill
                    />
                  </div>
                  {block.images.length > 1 && (
                    <div className='absolute inset-0 flex justify-between items-center p-2 pointer-events-none'>
                      <button
                        onClick={handlePrevImage}
                        className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
                        style={{ transform: 'translateY(-50%)', top: '50%' }}
                      >
                        <ChevronLeft className='w-6 h-6' />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
                        style={{ transform: 'translateY(-50%)', top: '50%' }}
                      >
                        <ChevronRight className='w-6 h-6' />
                      </button>
                    </div>
                  )}
                  <div className='mt-2'>
                    <input
                      type='text'
                      value={block.images[currentImageIndex].imageAlt || ''}
                      onChange={(e) =>
                        handleImageAltChange(e, currentImageIndex)
                      }
                      className='w-full p-2 border border-gray-300 rounded cursor-text focus:outline-none'
                      placeholder={`Enter alt text for image ${currentImageIndex + 1}`}
                    />
                  </div>
                  <div className='mt-2 flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      {currentImageIndex + 1} / {block.images.length}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleRemoveImage(currentImageIndex)}
                      className='cursor-pointer'
                    >
                      Remove Image
                    </Button>
                  </div>
                </>
              ) : (
                <label className='flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddImage(file);
                    }}
                  />
                  <div className='text-center p-4'>
                    <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      Add images to the gallery
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                      Click to select or drop images here
                    </p>
                  </div>
                </label>
              )}
            </div>
            {block.images.length > 0 && (
              <div className='mt-4'>
                <label className='flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddImage(file);
                    }}
                  />
                  <div className='text-center'>
                    <Plus className='w-6 h-6 mx-auto mb-1 text-gray-400' />
                    <p className='text-sm text-gray-500'>Add more images</p>
                  </div>
                </label>
              </div>
            )}
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'video':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={contentWrapperClasses}>
            <div
              className='relative w-full'
              style={{ paddingBottom: '56.25%' }}
            >
              <iframe
                src={block.videoUrl}
                className='absolute top-0 left-0 w-full h-full border border-black'
                allowFullScreen
              />
            </div>
            <div className='relative mt-2'>
              <p
                {...commonProps}
                className='text-sm text-gray-800 text-center italic focus:outline-none min-h-[1.5em]'
              >
                {block.content}
              </p>
              {renderPlaceholder('Video description...')}
            </div>
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'highlight':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className={`${contentWrapperClasses} relative`}>
            <p
              {...commonProps}
              className='text-md md:text-lg font-medium min-h-[1.5em] focus:outline-none'
            >
              {block.content}
            </p>
            {renderPlaceholder('Highlight text...')}
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'callout':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div
            className={`${contentWrapperClasses} border-l-4 border-black bg-gray-200 p-4 relative`}
          >
            <p
              {...commonProps}
              className='text-md md:text-lg text-gray-800 min-h-[1.5em] focus:outline-none'
            >
              {block.content}
            </p>
            {renderPlaceholder('Callout text...')}
          </div>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'separator':
      return (
        <div className={`flex items-center ${blockWrapperClasses}`}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <div className='flex-grow my-2 h-1 bg-black' />
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );

    case 'list':
      return (
        <div className={blockWrapperClasses}>
          <BlockTypeLabel
            type={block.type}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          />
          <ul className='my-6 pl-6 list-disc text-black'>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className='mb-1 relative'>
                <span {...commonProps} className='block min-h-[1.5em]'>
                  {item}
                </span>
                {renderPlaceholder('List item...')}
              </li>
            ))}
          </ul>
          <RemoveBlockButton onClick={() => onRemoveBlock(index)} />
        </div>
      );
  }
}

export function renderEditableBlock(
  block: ContentBlock,
  index: number,
  onUpdateBlock: (index: number, updates: Partial<ContentBlock>) => void,
  onRemoveBlock: (index: number) => void,
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void,
) {
  return (
    <EditableBlock
      key={index}
      block={block}
      index={index}
      onUpdateBlock={onUpdateBlock}
      onRemoveBlock={onRemoveBlock}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
}
