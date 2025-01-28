import type React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Tag, Globe, Plus } from 'lucide-react';
import { ArticleType } from '@/types/article';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ArticleHeaderProps {
  article: ArticleType['articles'][0];
  onUpdate: (updates: Partial<ArticleType['articles'][0]>) => void;
}

export function ArticleHeader({ article, onUpdate }: ArticleHeaderProps) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageAltRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const topics = ['Diplomacy', 'Conflicts', 'Economy', 'Climate'];
  const regions = ['Asia', 'Europe', 'Middle East', 'Africa', 'Americas'];

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ coverImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ coverImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCoverImageAltChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onUpdate({ coverImageAlt: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    onUpdate({ title: content });

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;

    const slug = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    onUpdate({ slug });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onUpdate({ description: e.target.value });

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ location: e.target.value });
  };

  const handleTopicSelect = (topic: string) => {
    const currentLabels = article.labels.filter((label) =>
      regions.includes(label),
    );
    onUpdate({ labels: [topic, ...currentLabels] });
  };

  const handleRegionSelect = (region: string) => {
    const currentLabels = article.labels.filter((label) =>
      topics.includes(label),
    );
    onUpdate({ labels: [...currentLabels, region] });
  };

  return (
    <div className='mb-8'>
      <div className='space-y-6'>
        {/* Cover Image Section */}
        <div
          className={`relative w-full h-[400px] mb-4 ${article.coverImage ? 'mb-[5rem]' : ''}`}
        >
          <div
            className='relative w-full max-w-4xl h-[400px] mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {article.coverImage ? (
              <div
                onClick={() => coverImageInputRef.current?.click()}
                className='cursor-pointer w-full h-full'
              >
                <Image
                  src={
                    article.coverImage || '/images/default-fallback-image.png'
                  }
                  alt={article.coverImageAlt || 'Cover Image'}
                  width={1200}
                  height={300}
                  className='object-cover w-full h-full'
                />
              </div>
            ) : (
              <label className='absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'>
                <input
                  ref={coverImageInputRef}
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleCoverImageChange}
                />
                <div className='text-center p-4'>
                  <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                  <p className='text-sm text-gray-500'>
                    Drop a cover image here, or click to select
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Maximum size: 2MB
                  </p>
                </div>
              </label>
            )}
          </div>

          {article.coverImage && (
            <div className='text-center mt-2'>
              <input
                ref={coverImageAltRef}
                type='text'
                value={article.coverImageAlt}
                onChange={handleCoverImageAltChange}
                className='w-full p-2 focus:outline-none text-center border border-gray-300 rounded focus:outline-none'
                placeholder='Enter alt text for the cover image'
              />
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className='relative'>
          <textarea
            ref={titleRef}
            value={article.title}
            onChange={handleTitleChange}
            className='w-full text-4xl md:text-5xl font-bold leading-tight focus:outline-none resize-none overflow-hidden bg-transparent'
            rows={1}
            placeholder='Untitled Article'
          />
        </div>

        {/* Description Section */}
        <div className='relative'>
          <textarea
            ref={descriptionRef}
            value={article.description}
            onChange={handleDescriptionChange}
            className='w-full text-md md:text-lg text-gray-600 leading-relaxed focus:outline-none resize-none overflow-hidden bg-transparent'
            rows={3}
            placeholder='Add a description...'
          />
        </div>
      </div>

      {/* Date and Location Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mt-6 pb-6 border-b border-gray-200'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-5 h-5' />
            <input
              type='text'
              className='border-none focus:outline-none'
              value={article.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              placeholder='1 January 2025...'
            />
          </div>
          <div className='flex items-center gap-4 text-gray-600 relative whitespace-nowrap'>
            <MapPin className='w-5 h-5 flex-shrink-0' />
            <input
              ref={locationRef}
              type='text'
              value={article.location}
              onChange={handleLocationChange}
              className='focus:outline-none min-w-[100px] bg-transparent'
              placeholder='Jakarta, Indonesia...'
            />
          </div>
        </div>

        {/* Labels Section */}
        <div className='flex flex-wrap gap-2 md:gap-4 my-6 ml-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Tag className='w-4 h-4' />
                {article.labels.find((label) => topics.includes(label)) ||
                  'Select Topic'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {topics.map((topic) => (
                  <DropdownMenuItem
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {topic}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Globe className='w-4 h-4' />
                {article.labels.find((label) => regions.includes(label)) ||
                  'Select Region'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {regions.map((region) => (
                  <DropdownMenuItem
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {region}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
