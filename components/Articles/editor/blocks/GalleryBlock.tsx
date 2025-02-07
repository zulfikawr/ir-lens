import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Trash } from 'lucide-react';
import type { GalleryBlockTypes } from '@/types/contentBlocks';
import { handleImageUpload } from '@/utils/blockUtils';

interface GalleryBlockProps {
  block: GalleryBlockTypes;
  isEditing?: boolean;
  onUpdateBlock?: (updates: Partial<GalleryBlockTypes>) => void;
}

const ImageControls: React.FC<{
  onPrev: () => void;
  onNext: () => void;
}> = ({ onPrev, onNext }) => (
  <div className='absolute inset-0 flex justify-between items-center p-2 pointer-events-none'>
    <Button
      onClick={onPrev}
      className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
      style={{ transform: 'translateY(-50%)', top: '50%' }}
    >
      <ChevronLeft className='w-6 h-6' />
    </Button>
    <Button
      onClick={onNext}
      className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300 pointer-events-auto cursor-pointer'
      style={{ transform: 'translateY(-50%)', top: '50%' }}
    >
      <ChevronRight className='w-6 h-6' />
    </Button>
  </div>
);

const ImageUploadSection: React.FC<{
  onAddImage: (fileOrUrl: File | string) => void;
  imgUrlInput: string;
  setimgUrlInput: (value: string) => void;
}> = ({ onAddImage, imgUrlInput, setimgUrlInput }) => (
  <div className='w-full max-w-md space-y-4 p-4'>
    <label className='flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4'>
      <input
        type='file'
        className='hidden'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onAddImage(file);
        }}
      />
      <div className='text-center'>
        <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
        <p className='text-sm text-gray-500'>
          Drop an image here, or click to select
        </p>
        <p className='text-xs text-gray-400 mt-1'>Maximum size: 2MB</p>
      </div>
    </label>

    <div className='text-center'>
      <p className='text-sm text-gray-500'>or</p>
    </div>

    <div className='flex flex-row gap-2'>
      <input
        type='text'
        value={imgUrlInput}
        onChange={(e) => setimgUrlInput(e.target.value)}
        placeholder='Paste image URL here'
        className='w-full p-2 border border-gray-300 focus:outline-none text-sm'
      />
      <Button
        onClick={() => {
          onAddImage(imgUrlInput);
          setimgUrlInput('');
        }}
        className='w-fit text-sm h-9'
        disabled={!imgUrlInput}
      >
        Submit
      </Button>
    </div>
  </div>
);

export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgUrlInput, setimgUrlInput] = useState('');

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

  const handleimgAltChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageIndex: number,
  ) => {
    const updatedImages = [...block.images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      imgAlt: e.target.value,
    };
    onUpdateBlock?.({ images: updatedImages });
  };

  const handleAddImage = (fileOrUrl: File | string) => {
    if (typeof fileOrUrl === 'string') {
      const newImage = { imgUrl: fileOrUrl, imgAlt: '' };
      onUpdateBlock?.({ images: [...block.images, newImage] });
    } else {
      handleImageUpload(fileOrUrl, (imgUrl) => {
        const newImage = { imgUrl, imgAlt: '' };
        onUpdateBlock?.({ images: [...block.images, newImage] });
      });
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    const updatedImages = block.images.filter((_, i) => i !== imageIndex);
    onUpdateBlock?.({ images: updatedImages });
    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(updatedImages.length - 1);
    }
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

  if (!isEditing) {
    if (block.images.length === 0) return null;

    const currentImage = block.images[currentImageIndex];

    return (
      <div className='my-8 relative w-full max-w-4xl mx-auto'>
        <div className='relative w-full aspect-[16/9]'>
          <Image
            src={currentImage.imgUrl}
            alt={
              currentImage.imgAlt || `Gallery image ${currentImageIndex + 1}`
            }
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover shadow-none border border-black'
            fill
          />

          {block.images.length > 1 && (
            <ImageControls onPrev={handlePrevImage} onNext={handleNextImage} />
          )}
        </div>

        {currentImage.imgAlt && (
          <figcaption className='text-sm text-gray-800 mt-2 text-center'>
            {currentImage.imgAlt} | {currentImageIndex + 1} /{' '}
            {block.images.length}
          </figcaption>
        )}
      </div>
    );
  }

  return (
    <div className='relative mt-2'>
      <div className='relative w-full max-w-4xl mx-auto'>
        {block.images.length > 0 ? (
          <>
            <div className='relative w-full h-[250px] md:h-[350px] lg:h-[400px]'>
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
              <ImageControls
                onPrev={handlePrevImage}
                onNext={handleNextImage}
              />
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
            className='relative w-full h-[250px] md:h-[350px] lg:h-[400px] border-2 border-dashed border-gray-300'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <ImageUploadSection
                onAddImage={handleAddImage}
                imgUrlInput={imgUrlInput}
                setimgUrlInput={setimgUrlInput}
              />
            </div>
          </div>
        )}
      </div>
      {block.images.length > 0 && (
        <div className='mt-4 space-y-4'>
          <div
            className='relative w-full h-[250px] md:h-[350px] lg:h-[400px] border-2 border-dashed border-gray-300'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <ImageUploadSection
                onAddImage={handleAddImage}
                imgUrlInput={imgUrlInput}
                setimgUrlInput={setimgUrlInput}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
