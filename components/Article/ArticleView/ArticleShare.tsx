'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Twitter,
  Instagram,
  Mail,
  Link as LinkIcon,
  Copy,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Article } from '@/types/article';
import Image from 'next/image';

export const ArticleShareDialog = ({ article }: { article: Article }) => {
  const [copied, setCopied] = useState(false);
  const articleUrl = `https://ir-lens.vercel.app/articles/${article.slug}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      article.title,
    )}&url=${encodeURIComponent(articleUrl)}`,
    instagram: `https://www.instagram.com/create/details/?caption=${encodeURIComponent(
      article.title,
    )}`,
    email: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(
      `Check out this article: ${articleUrl}`,
    )}`,
  };

  const { toast } = useToast();

  const copyLink = () => {
    navigator.clipboard.writeText(articleUrl).then(() => {
      setCopied(true);
      toast({
        description: 'Link copied to clipboard',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const socialShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='md:ml-auto'>
          <div className='flex items-center gap-2'>
            <Share2 className='w-4 h-4' />
            Share
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-11/12 sm:max-w-md md:max-w-xl p-0'>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 block'>
            <Image
              src={article.coverImg}
              alt={article.coverImgAlt || article.title} // Use coverImgAlt for accessibility
              width={400}
              height={300}
              className='object-cover h-48 mx-auto w-full md:h-full'
            />
          </div>

          <div className='w-full md:w-1/2 p-4 md:p-6 space-y-4'>
            <DialogHeader>
              <DialogTitle className='text-left text-2xl font-bold'>
                {article.title}
              </DialogTitle>
              <p className='text-left text-gray-600 text-sm line-clamp-3'>
                {article.description}
              </p>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                className='w-full border-black hover:bg-black hover:text-white'
                onClick={() => socialShare('twitter')}
              >
                <Twitter className='mr-2 h-4 w-4' /> Twitter
              </Button>
              <Button
                variant='outline'
                className='w-full border-black hover:bg-black hover:text-white'
                onClick={() => socialShare('instagram')}
              >
                <Instagram className='mr-2 h-4 w-4' /> Instagram
              </Button>
              <Button
                variant='outline'
                className='w-full border-black hover:bg-black hover:text-white'
                onClick={() => socialShare('email')}
              >
                <Mail className='mr-2 h-4 w-4' /> Email
              </Button>
              <Button
                variant='outline'
                className='w-full border-black hover:bg-black hover:text-white'
                onClick={copyLink}
              >
                {copied ? (
                  <Copy className='mr-2 h-4 w-4 text-green-500' />
                ) : (
                  <LinkIcon className='mr-2 h-4 w-4' />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
