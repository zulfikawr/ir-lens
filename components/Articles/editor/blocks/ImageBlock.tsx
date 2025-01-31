import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { ImageBlock } from '@/types/contentBlocks';
import { handleImageUpload } from '@/utils/blockUtils';
import { Plus } from 'lucide-react';

interface ImageBlockProps {
  block: ImageBlock;
  onUpdateBlock: (updates: Partial<ImageBlock>) => void;
}

export const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [imgUrlInput, setimgUrlInput] = useState('');

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

  return (
    <div className='relative'>
      {!block.imgUrl ? (
        <div className='space-y-4 mt-2'>
          <div className='flex flex-col space-y-2'>
            <input
              type='text'
              value={imgUrlInput}
              onChange={(e) => setimgUrlInput(e.target.value)}
              placeholder='Paste image URL here'
              className='w-full p-2 border border-gray-300 focus:outline-none'
            />
            <Button
              onClick={handleimgUrlSubmit}
              className='w-fit'
              disabled={!imgUrlInput}
            >
              Add Image from URL
            </Button>
          </div>
          <div className='relative w-full max-w-4xl h-[300px] mx-auto border-2 border-dashed border-gray-300 overflow-hidden'>
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
                <p className='text-xs text-gray-400 mt-1'>Maximum size: 2MB</p>
              </div>
            </label>
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
