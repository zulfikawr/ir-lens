import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Trash } from 'lucide-react';
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
    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(updatedImages.length - 1);
    }
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleAddImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className='relative mt-2'>
      <div className='relative w-full max-w-4xl mx-auto'>
        {block.images.length > 0 ? (
          <>
            <div className='relative w-full h-[300px] md:h-[450px]'>
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
                onClick={() => handleRemoveImage(currentImageIndex)}
                className='h-9'
              >
                <Trash className='w-4 h-4 mr-2' />
                Remove Image
              </Button>
            </div>
          </>
        ) : (
          <div
            className='relative w-full h-[300px] md:h-[450px] border-2 border-dashed border-gray-300'
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
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddImage(file);
                    }}
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
                    className='w-full p-2 border border-gray-300 focus:outline-none text-sm'
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
        )}
      </div>
      {block.images.length > 0 && (
        <div className='mt-4 space-y-4'>
          <div
            className='relative w-full h-[300px] md:h-[450px] border-2 border-dashed border-gray-300'
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
                    type='file'
                    className='hidden'
                    accept='image/*'
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
        </div>
      )}
    </div>
  );
};
