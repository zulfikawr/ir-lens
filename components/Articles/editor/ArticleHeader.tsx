import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Tag, Globe, Plus, Trash, Link } from 'lucide-react';
import { ArticleType } from '@/types/article';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { handleImageUpload } from '@/utils/blockUtils';

interface ArticleHeaderProps {
  article: ArticleType['articles'][0];
  onUpdate: (updates: Partial<ArticleType['articles'][0]>) => void;
}

const AutoResizeTextArea = ({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={`w-full resize-none ${className}`}
      placeholder={placeholder}
    />
  );
};

export function ArticleHeader({ article, onUpdate }: ArticleHeaderProps) {
  const [imgUrlInput, setimgUrlInput] = useState('');
  const coverImgInputRef = useRef<HTMLInputElement>(null);
  const coverImgAltRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const tags = ['Diplomacy', 'Conflicts', 'Economy', 'Climate'];
  const regions = [
    'Global',
    'Asia',
    'Europe',
    'Middle East',
    'Africa',
    'Americas',
  ];

  const handleimgUrlSubmit = () => {
    onUpdate({ coverImg: imgUrlInput });
    setimgUrlInput('');
  };

  const handlecoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (coverImg) => onUpdate({ coverImg }));
    }
  };

  const handleRemovecoverImg = () => {
    onUpdate({ coverImg: '', coverImgAlt: '' });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file, (coverImg) => onUpdate({ coverImg }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handlecoverImgAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ coverImgAlt: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    onUpdate({ title: content });

    const slug = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    onUpdate({ slug });
  };

  function formatArticleUrl(article: { date: string; slug: string }) {
    if (!article.date || !article.slug) return '';

    const date = new Date(article.date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}/${article.slug}`;
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onUpdate({ description: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ location: e.target.value });
  };

  const handleTagSelect = (tag: string) => {
    onUpdate({ tag: tag });
  };

  const handleRegionSelect = (region: string) => {
    onUpdate({ region: region });
  };

  return (
    <div className='mb-8'>
      <div className='space-y-6'>
        {/* Cover Image Section */}
        <div
          className={`relative w-full h-[250px] md:h-[350px] lg:h-[400px] ${article.coverImg ? 'mb-20' : 'mb-4'}`}
        >
          {/* Drag and Drop Section */}
          <div
            className='relative w-full max-w-4xl h-[250px] md:h-[350px] lg:h-[400px] mx-auto border-2 border-dashed border-gray-300'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {article.coverImg ? (
              <div
                onClick={() => coverImgInputRef.current?.click()}
                className='cursor-pointer w-full h-full'
              >
                <Image
                  src={article.coverImg || '/images/default-fallback-image.png'}
                  alt={article.coverImgAlt || 'Cover Image'}
                  width={1200}
                  height={300}
                  className='object-cover w-full h-full'
                />
                <Button
                  variant='destructive'
                  onClick={handleRemovecoverImg}
                  className='absolute bottom-4 right-4 p-2 flex items-center'
                >
                  <Trash className='w-5 h-5 mr-2' />
                  Remove
                </Button>
              </div>
            ) : (
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <div
                  className='w-full max-w-md space-y-4 p-4'
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* File Upload Section */}
                  <label className='flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4'>
                    <input
                      ref={coverImgInputRef}
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handlecoverImgChange}
                    />
                    <div className='text-center'>
                      <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                      <p className='text-sm text-gray-500'>
                        Drop a cover image here, or click to select
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
                      placeholder='Paste cover image URL here'
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
            )}
          </div>

          {/* Alt Text Input */}
          {article.coverImg && (
            <div className='text-center mt-2 mb-12'>
              <input
                ref={coverImgAltRef}
                type='text'
                value={article.coverImgAlt}
                onChange={handlecoverImgAltChange}
                className='w-full p-2 focus:outline-none text-center border border-gray-300 text-center italic text-gray-800 text-sm md:text-md'
                placeholder='Enter alt text for the cover image'
              />
            </div>
          )}
        </div>

        {/* Labels Section */}
        <div className='flex flex-wrap gap-2 md:gap-4 my-6 ml-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Tag className='w-4 h-4' />
                {tags.includes(article.tag) ? article.tag : 'Select Tags'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Globe className='w-4 h-4' />
                {regions.includes(article.region)
                  ? article.region
                  : 'Select Region'}
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

        {/* Slug Section */}
        <div className='flex items-center w-full gap-4 relative text-gray-500 line-clamp-1'>
          <Link className='w-5 h-5 flex-shrink-0' />
          <input
            value={`https://ir-lens.vercel.app/${formatArticleUrl(article)}`}
            onChange={() => {}}
            className='focus:outline-none bg-transparent flex-grow truncate'
            readOnly
          />
        </div>

        {/* Title Section */}
        <div className='relative'>
          <AutoResizeTextArea
            value={article.title}
            onChange={handleTitleChange}
            className='text-4xl md:text-5xl font-bold leading-tight focus:outline-none bg-transparent'
            placeholder='Untitled Article'
          />
        </div>

        {/* Description Section */}
        <div className='relative'>
          <AutoResizeTextArea
            value={article.description}
            onChange={handleDescriptionChange}
            className='text-md md:text-lg text-gray-600 leading-relaxed focus:outline-none bg-transparent'
            placeholder='Add a description...'
          />
        </div>
      </div>

      {/* Date and Location Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mt-6 pb-6 border-b border-black'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='flex items-center gap-2 md:gap-4 text-gray-600'>
            <Calendar className='w-5 h-5' />
            <input
              type='text'
              className='border-none focus:outline-none'
              value={article.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              placeholder='1 January 2025...'
            />
          </div>
          <div className='flex items-center gap-2 md:gap-4 text-gray-600 relative whitespace-nowrap'>
            <MapPin className='w-5 h-5 flex-shrink-0' />
            <input
              ref={locationRef}
              type='text'
              value={article.location}
              onChange={handleLocationChange}
              className='focus:outline-none min-w-[200px] bg-transparent'
              placeholder='Jakarta, Indonesia...'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
