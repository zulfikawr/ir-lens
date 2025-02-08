import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { VideoBlockTypes } from '@/types/contentBlocks';

interface VideoBlockProps {
  block: VideoBlockTypes;
  isEditing: boolean;
  onUpdateBlock?: (updates: Partial<VideoBlockTypes>) => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [videoUrlInput, setVideoUrlInput] = useState(block.videoUrl);
  const [videoAltInput, setVideoAltInput] = useState(block.videoAlt || '');

  const handleVideoUrlSubmit = () => {
    onUpdateBlock?.({ videoUrl: videoUrlInput });
  };

  const handleVideoAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoAltInput(e.target.value);
    onUpdateBlock?.({ videoAlt: e.target.value });
  };

  if (!isEditing) {
    return (
      <div className='my-8'>
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={block.videoUrl}
            className='absolute top-0 left-0 w-full h-full border border-black'
            allowFullScreen
          />
        </div>
        {block.videoAlt && (
          <p className='text-sm text-gray-800 mt-2 text-center italic'>
            {block.videoAlt}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className='relative mt-2'>
      {!block.videoUrl ? (
        <div className='flex flex-col space-y-2'>
          <input
            type='text'
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            placeholder='Paste video URL here'
            className='w-full p-2 border border-gray-300 focus:outline-none'
          />
          <Button onClick={handleVideoUrlSubmit} className='w-fit'>
            Submit
          </Button>
        </div>
      ) : (
        <>
          <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={block.videoUrl}
              className='absolute top-0 left-0 w-full h-full border border-black'
              allowFullScreen
            />
          </div>
          <input
            type='text'
            value={videoAltInput}
            onChange={handleVideoAltChange}
            placeholder='Enter video description...'
            className='w-full mt-2 p-2 border border-gray-300 focus:outline-none text-center italic text-gray-800 text-sm md:text-md'
          />
        </>
      )}
    </div>
  );
};
