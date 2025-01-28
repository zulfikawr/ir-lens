'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    toast({
      description: 'Function not implemented yet',
      duration: 2000,
    });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className='min-h-screen flex justify-center items-center px-4 md:px-0'>
      <div className='w-full max-w-xl p-8 border border-black shadow-lg'>
        <h2 className='text-3xl font-semibold text-center text-black mb-8'>
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <input
              type='text'
              name='name'
              placeholder='Your Name'
              className='w-full p-4 bg-transparent border-b-2 border-black text-black focus:outline-none'
            />
          </div>

          <div>
            <input
              type='email'
              name='email'
              placeholder='Your Email'
              className='w-full p-4 bg-transparent border-b-2 border-black text-black focus:outline-none'
            />
          </div>

          <div>
            <textarea
              name='message'
              placeholder='Your Message'
              rows={6}
              className='w-full p-4 bg-transparent border-b-2 border-black text-black focus:outline-none'
            />
          </div>

          <Button type='submit' size='lg' className='w-full'>
            {isSubmitting ? 'Submitting...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
