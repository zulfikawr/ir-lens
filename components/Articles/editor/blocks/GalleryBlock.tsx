import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { GalleryBlock } from '@/types/contentBlocks';
import { handleImageUpload } from '@/utils/blockUtils';

interface GalleryBlockProps {
  block: GalleryBlock;
  onUpdateBlock: (updates: Partial<GalleryBlock>) => void;
}

export const GalleryBlockComponent: React.FC<GalleryBlockProps> = ({
  block,
  onUpdateBlock,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgUrlInput, setimgUrlInput] = useState('');

  const handleimgAltChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageIndex: number,
  ) => {
    const updatedImages = [...block.images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      imgAlt: e.target.value,
    };
    onUpdateBlock({ images: updatedImages });
  };

  const handleimgUrlSubmit = () => {
    handleAddImage(imgUrlInput);
    setimgUrlInput('');
  };

  const handleAddImage = (fileOrUrl: File | string) => {
    if (typeof fileOrUrl === 'string') {
      const newImage = { imgUrl: fileOrUrl, imgAlt: '' };
      onUpdateBlock({ images: [...block.images, newImage] });
    } else {
      handleImageUpload(fileOrUrl, (imgUrl) => {
        const newImage = { imgUrl, imgAlt: '' };
        onUpdateBlock({ images: [...block.images, newImage] });
      });
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    const updatedImages = block.images.filter((_, i) => i !== imageIndex);
    onUpdateBlock({ images: updatedImages });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === block.images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? block.images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className='relative'>
      <div className='my-8 relative w-full max-w-4xl mx-auto'>
        {block.images.length > 0 ? (
          <>
            <div className='relative w-full h-[300px] md:h-[500px]'>
              <Image
                src={
                  block.images[currentImageIndex].imgUrl || '/placeholder.svg'
                }
                alt={
                  block.images[currentImageIndex].imgAlt ||
                  `Gallery image ${currentImageIndex + 1}`
                }
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover shadow-none border border-black'
                fill
              />
            </div>
            {block.images.length > 1 && (
              <div className='absolute inset-0 flex justify-between items-center p-2 pointer-events-none'>
                <Button
                  onClick={handlePrevImage}
                  className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
                  style={{ transform: 'translateY(-50%)', top: '50%' }}
                >
                  <ChevronLeft className='w-6 h-6' />
                </Button>
                <Button
                  onClick={handleNextImage}
                  className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
                  style={{ transform: 'translateY(-50%)', top: '50%' }}
                >
                  <ChevronRight className='w-6 h-6' />
                </Button>
              </div>
            )}
            <div className='mt-2'>
              <input
                type='text'
                value={block.images[currentImageIndex].imgAlt || ''}
                onChange={(e) => handleimgAltChange(e, currentImageIndex)}
                className='w-full p-2 border border-gray-300 cursor-text focus:outline-none'
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
          <div className='space-y-4'>
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
            <label className='flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors'>
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
          </div>
        )}
      </div>
      {block.images.length > 0 && (
        <div className='mt-4 space-y-4'>
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
          <label className='flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors'>
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
  );
};
