import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { ImageBlock } from '@/types/contentBlocks';
import { handleImageUpload } from '@/utils/blockUtils';
import { Plus, Trash } from 'lucide-react';

interface ImageBlockProps {
  block: ImageBlock;
  onUpdateBlock: (updates: Partial<ImageBlock>) => void;
}

export const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [imgUrlInput, setimgUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleimgUrlSubmit = () => {
    onUpdateBlock({ imgUrl: imgUrlInput });
    setimgUrlInput('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (imgUrl) => onUpdateBlock({ imgUrl }));
    }
  };

  const handleimgAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateBlock({ imgAlt: e.target.value });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file, (imgUrl) => onUpdateBlock({ imgUrl }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImg = () => {
    onUpdateBlock({ imgUrl: '', imgAlt: '' });
  };

  return (
    <div className='relative mt-2'>
      {!block.imgUrl ? (
        <div
          className='relative w-full max-w-4xl h-[300px] md:h-[450px] mx-auto border-2 border-dashed border-gray-300'
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <div
              className='w-full max-w-md space-y-4 p-4'
              onClick={(e) => e.stopPropagation()}
            >
              {/* File Upload Section */}
              <label className='flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4'>
                <input
                  ref={fileInputRef}
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileSelect}
                />
                <div className='text-center'>
                  <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                  <p className='text-sm text-gray-500'>
                    Drop an image here, or click to select
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Maximum size: 2MB
                  </p>
                </div>
              </label>

              <div className='text-center'>
                <p className='text-sm text-gray-500'>or</p>
              </div>

              {/* URL Input Section */}
              <div className='flex flex-row gap-2'>
                <input
                  type='text'
                  value={imgUrlInput}
                  onChange={(e) => setimgUrlInput(e.target.value)}
                  placeholder='Paste image URL here'
                  className='w-full p-2 h-9 border border-gray-300 focus:outline-none text-sm'
                />
                <Button
                  onClick={handleimgUrlSubmit}
                  className='w-fit text-sm h-9'
                  disabled={!imgUrlInput}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='relative w-full max-w-4xl h-[300px] mx-auto border border-gray-300 overflow-hidden'>
            <Image
              src={block.imgUrl || '/placeholder.svg'}
              alt={block.imgAlt || 'Image related to the article'}
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            <Button
              variant='destructive'
              onClick={handleRemoveImg}
              className='absolute bottom-4 right-4 p-2 flex items-center'
            >
              <Trash className='w-5 h-5 mr-2' />
              Remove
            </Button>
          </div>
          <input
            type='text'
            value={block.imgAlt || ''}
            onChange={handleimgAltChange}
            className='w-full mt-2 p-2 border border-gray-300 focus:outline-none'
            placeholder='Enter alt text for the image'
          />
        </>
      )}
    </div>
  );
};
