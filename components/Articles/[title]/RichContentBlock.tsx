'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ContentBlock } from '@/types/article';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const RichContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'image':
      return (
        <figure className='my-8'>
          <div className='relative w-full max-w-4xl h-[300px] md:h-[500px] mx-auto'>
            <Image
              src={block.imageUrl || '/images/default-fallback-image.png'}
              alt={block.imageAlt || 'Image related to the article'}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover shadow-none border border-black'
              fill
            />
          </div>
          {block.imageAlt && (
            <figcaption className='text-xs md:text-sm text-gray-800 mt-2 text-center italic'>
              {block.imageAlt}
            </figcaption>
          )}
        </figure>
      );

    case 'gallery':
      return <GalleryComponent images={block.images} />;

    case 'video':
      return (
        <div className='my-8'>
          <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={block.videoUrl}
              className='absolute top-0 left-0 w-full h-full border border-black'
              allowFullScreen
            />
          </div>
          {block.content && (
            <p className='text-sm text-gray-800 mt-2 text-center italic'>
              {block.content}
            </p>
          )}
        </div>
      );

    case 'quote':
      return (
        <div className='my-8 bg-gray-50 p-6 border border-black'>
          <Quote className='w-6 h-6 text-black mb-4' />
          <blockquote className='text-md md:text-lg italic text-gray-900'>
            {block.content}
          </blockquote>
          <div className='mt-4'>
            <cite className='block font-semibold text-black not-italic'>
              {block.spokesperson}
            </cite>
            <span className='text-sm text-gray-600'>{block.role}</span>
          </div>
        </div>
      );

    case 'highlight':
      return (
        <div className='my-8 p-4 bg-black text-white'>
          <p className='text-md md:text-lg font-medium'>{block.content}</p>
        </div>
      );

    case 'callout':
      return (
        <div className='my-8 border-l-4 border-black bg-gray-200 p-4'>
          <p className='text-md md:text-lg text-gray-800'>{block.content}</p>
        </div>
      );

    case 'heading':
      return (
        <h2 className='my-6 text-2xl font-bold text-black'>{block.content}</h2>
      );

    case 'separator':
      return <hr className='my-6 border-t-2 border-black' />;

    case 'list':
      return (
        <ul className='my-6 pl-6 list-disc text-black'>
          {block.items.map((item, index) => (
            <li key={index} className='mb-1'>
              {item}
            </li>
          ))}
        </ul>
      );

    case 'text':
      return (
        <p className='my-6 text-gray-800 text-md md:text-lg'>{block.content}</p>
      );
  }
};

const GalleryComponent = ({
  images,
}: {
  images: Array<{ imageUrl: string; imageAlt?: string }>;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  if (images.length === 0) return null;

  const currentImage = images[currentImageIndex];

  return (
    <div className='my-8 relative w-full max-w-4xl mx-auto'>
      <div className='relative w-full h-[300px] md:h-[500px]'>
        <Image
          src={currentImage.imageUrl}
          alt={
            currentImage.imageAlt || `Gallery image ${currentImageIndex + 1}`
          }
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover shadow-none border border-black'
          fill
        />
      </div>

      {images.length > 1 && (
        <div className='absolute inset-0 flex justify-between items-center p-2'>
          <button
            onClick={handlePrevImage}
            className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300'
            style={{ transform: 'translateY(-50%)', top: '50%' }}
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={handleNextImage}
            className='bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black p-2 transition duration-300'
            style={{ transform: 'translateY(-50%)', top: '50%' }}
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>
      )}

      {currentImage.imageAlt && (
        <figcaption className='text-sm text-gray-800 mt-2 text-center'>
          {currentImage.imageAlt} | {currentImageIndex + 1} / {images.length}
        </figcaption>
      )}
    </div>
  );
};

export default GalleryComponent;
